import type { ActionFunctionArgs } from "react-router";
import { AmeliaError, captureLead, orgKey } from "~/lib/amelia.server";

/**
 * POST /api/register-interest — the no-account funnel.
 *
 * Proxies to Amelia's `/api/leads/capture` from the server rather than posting
 * cross-origin from the browser. Three reasons: the visitor's browser never has
 * to be trusted with our org key, the platform needs no CORS allowance for this
 * origin, and a failure comes back as our own JSON shape so the form can say
 * something useful instead of surfacing a CORS error.
 */
export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return Response.json({ ok: false, error: "Method not allowed." }, { status: 405 });
  }

  const ct = request.headers.get("content-type") ?? "";
  const raw: Record<string, string> = ct.includes("application/json")
    ? await request.json()
    : (Object.fromEntries(await request.formData()) as Record<string, string>);

  // Honeypot, matching the contact form: anything that fills it is not a person.
  // Answer 200 so the bot does not retry with variations.
  if ((raw.company ?? "").trim()) return Response.json({ ok: true });

  const name = (raw.name ?? "").trim();
  const email = (raw.email ?? "").trim();
  if (!name || !/^\S+@\S+\.\S+$/.test(email)) {
    return Response.json(
      { ok: false, error: "A name and a valid email are required." },
      { status: 400 },
    );
  }

  if (!orgKey()) {
    // Misconfiguration, not the visitor's fault — say so rather than pretending.
    return Response.json(
      { ok: false, error: "Register-interest is not configured yet. Please use the contact form." },
      { status: 503 },
    );
  }

  try {
    await captureLead(
      {
        name,
        email,
        phone: (raw.phone ?? "").trim() || undefined,
        message: (raw.message ?? "").trim() || undefined,
        projectSlug: (raw.projectSlug ?? "").trim() || undefined,
      },
      request.signal,
    );
  } catch (err) {
    const message =
      err instanceof AmeliaError ? err.message : "Could not register your interest just now.";
    return Response.json({ ok: false, error: message }, { status: 502 });
  }

  return Response.json({ ok: true });
}

export async function loader() {
  return Response.json(
    { ok: false, error: "POST a register-interest form to this endpoint." },
    { status: 405 },
  );
}
