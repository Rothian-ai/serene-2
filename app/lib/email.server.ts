import nodemailer from "nodemailer";
import type { Submission } from "@prisma/client";

/**
 * SMTP notifier. Configured entirely from env vars; if SMTP isn't set the send
 * is skipped (logged) so submissions still persist. Set SMTP_* + MAIL_FROM /
 * MAIL_TO in .env / Vercel to enable notifications.
 */
const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE, MAIL_FROM, MAIL_TO } =
  process.env;

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter | null {
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT ?? 587),
      secure: SMTP_SECURE === "true", // true for 465, false for 587/STARTTLS
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
  }
  return transporter;
}

const label = (t: Submission["type"]) => t.toLowerCase().replace(/_/g, " ");

export async function sendSubmissionNotification(sub: Submission): Promise<void> {
  const t = getTransporter();
  if (!t) {
    console.warn("[email] SMTP not configured — skipping notification for", sub.id);
    return;
  }
  const to = MAIL_TO ?? SMTP_USER!;
  const from = MAIL_FROM ?? SMTP_USER!;
  const lines = [
    `Type:    ${label(sub.type)}`,
    `Name:    ${sub.name}`,
    `Email:   ${sub.email}`,
    sub.phone ? `Phone:   ${sub.phone}` : null,
    sub.context ? `Context: ${sub.context}` : null,
    sub.source ? `Source:  ${sub.source}` : null,
    "",
    sub.message ?? "(no message)",
  ].filter((l): l is string => l !== null);

  await t.sendMail({
    from,
    to,
    replyTo: sub.email,
    subject: `New ${label(sub.type)} enquiry — ${sub.name}`,
    text: lines.join("\n"),
  });
}
