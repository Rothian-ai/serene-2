import nodemailer from "nodemailer";

/**
 * SMTP notifier.
 *
 * Deliberately decoupled from Prisma: it takes a plain payload rather than a
 * `Submission` row, so an enquiry can be emailed even when the database is not
 * configured or is unreachable. Email is the critical path for a form whose
 * whole promise is "an advisor replies" — persistence is a convenience on top.
 *
 * Everything is read from env vars. Set them in `.env` locally and in
 * Vercel → Project → Settings → Environment Variables for deploys:
 *
 *   SMTP_HOST     smtp.your-provider.com
 *   SMTP_PORT     587 (STARTTLS) or 465 (implicit TLS)
 *   SMTP_SECURE   "true" for 465, "false" for 587
 *   SMTP_USER     the mailbox / API user
 *   SMTP_PASS     the password or app-specific key
 *   MAIL_FROM     "Serene <noreply@serene.com>" — must be a sender the SMTP
 *                 provider has authorised, or the send will be rejected
 *   MAIL_TO       where enquiries land; comma-separate for several recipients
 *   MAIL_ACK      "true" to also send the enquirer a short acknowledgement
 */

export interface EnquiryPayload {
  type: "contact" | "register-interest" | "careers";
  name: string;
  email: string;
  phone?: string;
  message?: string;
  /** where in the process they are, from the contact form's select */
  stage?: string;
  /** the city or country they wrote in, if any */
  basedIn?: string;
  /** true only if they explicitly ticked the box asking for a call */
  callRequested: boolean;
  /** the page or entry point the enquiry came from */
  source?: string;
}

const env = () => ({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: process.env.SMTP_SECURE === "true",
  user: process.env.SMTP_USER,
  pass: process.env.SMTP_PASS,
  from: process.env.MAIL_FROM,
  to: process.env.MAIL_TO,
  ack: process.env.MAIL_ACK === "true",
});

/** True when enough SMTP config is present to attempt a send. */
export function smtpConfigured(): boolean {
  const e = env();
  return Boolean(e.host && e.user && e.pass);
}

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter | null {
  if (!smtpConfigured()) return null;
  const e = env();
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: e.host,
      port: e.port,
      secure: e.secure,
      auth: { user: e.user!, pass: e.pass! },
      // A serverless function must never hang on a stalled SMTP handshake:
      // without these it can sit until Vercel's own timeout kills it, and the
      // visitor watches a spinner the whole time. Fail fast and tell them.
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 20_000,
    });
  }
  return transporter;
}

/** Verify the credentials and the connection without sending mail. */
export async function verifySmtp(): Promise<void> {
  const t = getTransporter();
  if (!t) throw new Error("SMTP is not configured (need SMTP_HOST, SMTP_USER, SMTP_PASS).");
  await t.verify();
}

const TYPE_LABEL: Record<EnquiryPayload["type"], string> = {
  contact: "enquiry",
  "register-interest": "register-interest",
  careers: "careers",
};

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function buildBody(p: EnquiryPayload) {
  const rows: Array<[string, string]> = [
    ["Name", p.name],
    ["Email", p.email],
    ["Phone", p.phone?.trim() || "—"],
    ["Based in", p.basedIn?.trim() || "—"],
    ["Stage", p.stage?.trim() || "—"],
    // The single most operationally important line: the no-cold-call promise is
    // only kept if whoever reads this can see the answer at a glance.
    ["Call requested", p.callRequested ? "YES — they asked to be called" : "No — reply in writing only"],
    ["Source", p.source?.trim() || "—"],
  ];

  const text = [
    ...rows.map(([k, v]) => `${k.padEnd(16)}${v}`),
    "",
    "Message",
    "-------",
    p.message?.trim() || "(no message)",
  ].join("\n");

  const html = `<div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;font-size:14px;line-height:1.6;color:#0a1526">
  <p style="margin:0 0 18px;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#6b7078">
    New ${esc(TYPE_LABEL[p.type])}
  </p>
  <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:22px">
    ${rows
      .map(
        ([k, v]) => `<tr>
      <td style="padding:6px 24px 6px 0;color:#6b7078;white-space:nowrap;vertical-align:top">${esc(k)}</td>
      <td style="padding:6px 0;vertical-align:top;${
        k === "Call requested" && p.callRequested ? "font-weight:700;color:#795a00" : ""
      }">${esc(v)}</td>
    </tr>`,
      )
      .join("")}
  </table>
  <div style="border-top:1px solid #e1e4e8;padding-top:16px;white-space:pre-wrap">${esc(
    p.message?.trim() || "(no message)",
  )}</div>
</div>`;

  return { text, html };
}

/** Notify the house. Throws on send failure so the caller can react. */
export async function sendEnquiryNotification(p: EnquiryPayload): Promise<void> {
  const t = getTransporter();
  if (!t) {
    console.warn("[email] SMTP not configured — no notification sent for", p.email);
    return;
  }
  const e = env();
  const { text, html } = buildBody(p);
  await t.sendMail({
    from: e.from ?? e.user!,
    to: e.to ?? e.user!,
    replyTo: `${p.name} <${p.email}>`,
    subject: `${p.callRequested ? "[CALL REQUESTED] " : ""}New ${TYPE_LABEL[p.type]} — ${p.name}`,
    text,
    html,
  });
}

/**
 * Optional acknowledgement to the enquirer, off unless MAIL_ACK=true.
 *
 * Left opt-in on purpose: the site promises no follow-up sequences, so any mail
 * we send unprompted has to be a single courtesy reply and nothing more. Never
 * let this throw into the request — an acknowledgement failing must not make a
 * captured enquiry look like a failed one.
 */
export async function sendAcknowledgement(p: EnquiryPayload): Promise<void> {
  const e = env();
  if (!e.ack) return;
  const t = getTransporter();
  if (!t) return;

  const body = [
    `Dear ${p.name.split(" ")[0] || p.name},`,
    "",
    "Thank you for writing to Serene Bay. An advisor will reply to this address within one business day.",
    p.callRequested
      ? "You asked for a call, so we will propose a time in that reply."
      : "You did not ask for a call, so you will not receive one. We will reply in writing.",
    "",
    "You have not been added to any list, and there is no follow-up sequence.",
    "",
    "Serene Bay",
  ].join("\n");

  await t.sendMail({
    from: e.from ?? e.user!,
    to: p.email,
    ...(e.to ? { replyTo: e.to } : {}),
    subject: "We have your enquiry — Serene Bay",
    text: body,
  });
}
