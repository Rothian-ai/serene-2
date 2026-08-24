import {
  sendAcknowledgement,
  sendEnquiryNotification,
  smtpConfigured,
  type EnquiryPayload,
} from "~/lib/email.server";

/**
 * The enquiry pipeline, in one place so both entry points share it:
 *
 *   POST /api/submit  — the JSON endpoint the form's fetch() calls
 *   POST /contact     — the route action, which handles a *native* form submit
 *
 * That second path matters more than it looks. `/contact` is prerendered, so
 * between first paint and hydration the submit button is an ordinary one; a
 * visitor who submits in that window (or who has JavaScript disabled or
 * blocked) posts the form the old-fashioned way. Without a route action that
 * produced a framework error page and a lost enquiry. Now both paths run this.
 *
 * ORDERING IS DELIBERATE. Email is the critical path; the database is
 * best-effort. An enquiry that reached a human inbox has succeeded even if
 * Postgres was unreachable. An enquiry that only reached the database has *not*
 * succeeded when SMTP was configured and rejected it — the visitor was promised
 * a reply and nobody knows to make one. The request succeeds when at least one
 * durable sink accepted it.
 */

export interface EnquiryResult {
  ok: boolean;
  status: number;
  error?: string;
  emailed?: boolean;
  stored?: boolean;
  id?: string | null;
}

const TYPES = new Set(["contact", "register-interest", "careers"]);

/**
 * Per-instance rate limit. A warm serverless instance keeps this map; a cold
 * one starts empty, so it is a speed bump against casual abuse rather than a
 * real limiter, and it is paired with the form's honeypot. For anything
 * stronger, put Vercel's WAF or a KV-backed counter in front of the route.
 */
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 5;
const hits = new Map<string, number[]>();

function rateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 500) {
    for (const [k, v] of hits) if (v.every((t) => now - t > RATE_WINDOW_MS)) hits.delete(k);
  }
  return recent.length > RATE_MAX;
}

/** Persist to Postgres if it is configured. Never throws into the request. */
async function persist(p: EnquiryPayload, context: string): Promise<string | null> {
  if (!process.env.DATABASE_URL) return null;
  try {
    // Imported lazily so a deploy with no database never even loads Prisma.
    const { getPrisma } = await import("~/lib/db.server");
    const prisma = await getPrisma();
    const row = await prisma.submission.create({
      data: {
        type:
          p.type === "careers"
            ? "CAREERS"
            : p.type === "register-interest"
              ? "REGISTER_INTEREST"
              : "CONTACT",
        name: p.name,
        email: p.email,
        phone: p.phone?.trim() || null,
        message: p.message?.trim() || null,
        context: context || null,
        source: p.source?.trim() || null,
      },
    });
    return row.id;
  } catch (err) {
    console.error("[enquiry] database write failed (continuing):", err);
    return null;
  }
}

export async function processEnquiry(request: Request): Promise<EnquiryResult> {
  if (request.method !== "POST") return { ok: false, status: 405, error: "Method not allowed." };

  const ct = request.headers.get("content-type") ?? "";
  let data: Record<string, string>;
  try {
    data = ct.includes("application/json")
      ? await request.json()
      : (Object.fromEntries(await request.formData()) as Record<string, string>);
  } catch {
    return { ok: false, status: 400, error: "That request could not be read." };
  }

  // Honeypot: a field no human sees, so anything in it is a bot. Report success
  // so the bot believes it worked and does not retry with variations.
  if (String(data.company ?? "").trim()) {
    console.warn("[enquiry] honeypot tripped");
    return { ok: true, status: 200, emailed: false, stored: false, id: null };
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  if (rateLimited(ip)) {
    return { ok: false, status: 429, error: "Too many submissions. Try again in a minute." };
  }

  const name = String(data.name ?? "").trim();
  const email = String(data.email ?? "").trim();
  const message = String(data.message ?? "").trim();

  if (!name) return { ok: false, status: 400, error: "A name is required." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return { ok: false, status: 400, error: "That email looks incomplete." };
  }
  if (name.length > 120 || email.length > 200 || message.length > 5000) {
    return { ok: false, status: 400, error: "That submission is longer than we can accept." };
  }

  const rawType = String(data.type ?? "contact");
  const payload: EnquiryPayload = {
    type: (TYPES.has(rawType) ? rawType : "contact") as EnquiryPayload["type"],
    name,
    email,
    phone: String(data.phone ?? "").trim() || undefined,
    message: message || undefined,
    stage: String(data.stage ?? "").trim() || undefined,
    basedIn: String(data.basedIn ?? "").trim() || undefined,
    callRequested: Boolean(data.callRequested),
    source: String(data.source ?? "").trim() || undefined,
  };

  // The dashboard reads a single `context` string, so keep composing one.
  const context = [
    payload.stage ? `Stage: ${payload.stage}` : "",
    payload.basedIn ? `Based in: ${payload.basedIn}` : "",
    payload.callRequested ? "Call requested" : "No call requested",
  ]
    .filter(Boolean)
    .join(" · ");

  let emailed = false;
  let emailError: unknown = null;
  if (smtpConfigured()) {
    try {
      await sendEnquiryNotification(payload);
      emailed = true;
    } catch (err) {
      emailError = err;
      console.error("[enquiry] SMTP send failed:", err);
    }
  } else {
    console.warn("[enquiry] SMTP not configured — enquiry will only be stored.");
  }

  const storedId = await persist(payload, context);

  // Nothing durable accepted it. Say so, rather than thanking someone whose
  // enquiry went nowhere.
  if (!emailed && !storedId) {
    return {
      ok: false,
      status: 502,
      error: emailError
        ? "We could not deliver your message just now."
        : "The enquiry service is not configured.",
    };
  }

  // A single courtesy reply, only when MAIL_ACK is on. Never fails the request.
  if (emailed) {
    try {
      await sendAcknowledgement(payload);
    } catch (err) {
      console.error("[enquiry] acknowledgement failed (ignored):", err);
    }
  }

  return { ok: true, status: 200, emailed, stored: Boolean(storedId), id: storedId };
}
