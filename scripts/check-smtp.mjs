/**
 * SMTP preflight — `npm run smtp:check [recipient@example.com]`
 *
 * Verifies the SMTP_* environment variables actually connect and authenticate,
 * and optionally sends one test message. Run it before deploying so a broken
 * credential is found here rather than by a visitor whose enquiry vanished.
 *
 * Reads `.env` when present; on Vercel/CI the vars are already in the
 * environment. Nothing is printed except the host and user — never the password.
 */
import { existsSync } from "node:fs";
import nodemailer from "nodemailer";

if (existsSync(".env")) {
  try {
    process.loadEnvFile(".env");
  } catch {
    // Node < 20.12: the vars must come from the shell instead.
  }
}

const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, MAIL_FROM, MAIL_TO } = process.env;

const missing = ["SMTP_HOST", "SMTP_USER", "SMTP_PASS"].filter((k) => !process.env[k]);
if (missing.length) {
  console.error(`\n✗ Missing: ${missing.join(", ")}`);
  console.error("  Set them in .env (locally) or in Vercel → Settings → Environment Variables.\n");
  process.exit(1);
}

const port = Number(SMTP_PORT ?? 587);
const secure = SMTP_SECURE === "true";

console.log("\nSMTP configuration");
console.log(`  host    ${SMTP_HOST}:${port}`);
console.log(`  secure  ${secure}  ${secure ? "(implicit TLS — use with 465)" : "(STARTTLS — use with 587)"}`);
console.log(`  user    ${SMTP_USER}`);
console.log(`  from    ${MAIL_FROM ?? "(falling back to SMTP_USER)"}`);
console.log(`  to      ${MAIL_TO ?? "(falling back to SMTP_USER)"}`);

if ((port === 465 && !secure) || (port === 587 && secure)) {
  console.warn(
    `\n⚠  SMTP_PORT=${port} with SMTP_SECURE=${secure} is an unusual pairing.` +
      "\n   465 normally needs SMTP_SECURE=true; 587 normally needs false.",
  );
}

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port,
  secure,
  auth: { user: SMTP_USER, pass: SMTP_PASS },
  connectionTimeout: 10_000,
  greetingTimeout: 10_000,
  socketTimeout: 20_000,
});

try {
  await transporter.verify();
  console.log("\n✓ Connected and authenticated.");
} catch (err) {
  console.error(`\n✗ Could not connect or authenticate: ${err.message}`);
  console.error("  Common causes: wrong port/secure pairing, an app-specific password");
  console.error("  being required, or the provider not allowing this sender.\n");
  process.exit(1);
}

const recipient = process.argv[2];
if (!recipient) {
  console.log("\nTo send a test message:  npm run smtp:check -- you@example.com\n");
  process.exit(0);
}

try {
  const info = await transporter.sendMail({
    from: MAIL_FROM ?? SMTP_USER,
    to: recipient,
    subject: "Serene — SMTP test",
    text: "If you are reading this, the contact form's mail path works.",
  });
  console.log(`✓ Test message accepted for ${recipient} (id ${info.messageId})\n`);
} catch (err) {
  console.error(`\n✗ Send failed: ${err.message}`);
  console.error("  Authentication worked, so this is usually MAIL_FROM not being an");
  console.error("  address the provider has authorised for this account.\n");
  process.exit(1);
}
