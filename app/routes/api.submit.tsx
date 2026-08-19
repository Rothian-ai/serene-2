import type { ActionFunctionArgs } from "react-router";
import { prisma } from "~/lib/db.server";
import { sendSubmissionNotification } from "~/lib/email.server";

/**
 * Enquiry sink for every form on the site. Accepts JSON or form-encoded POSTs,
 * persists a Submission, and fires an SMTP notification. `type` routes it into
 * the unified table (contact | register-interest | careers).
 */
const TYPE_MAP: Record<string, "CONTACT" | "REGISTER_INTEREST" | "CAREERS"> = {
  contact: "CONTACT",
  "register-interest": "REGISTER_INTEREST",
  registerInterest: "REGISTER_INTEREST",
  careers: "CAREERS",
};

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return Response.json({ ok: false, error: "Method not allowed" }, { status: 405 });
  }

  const ct = request.headers.get("content-type") ?? "";
  const data: Record<string, string> = ct.includes("application/json")
    ? await request.json()
    : (Object.fromEntries(await request.formData()) as Record<string, string>);

  const name = (data.name ?? "").trim();
  const email = (data.email ?? "").trim();
  const message = (data.message ?? "").trim();
  const type = TYPE_MAP[(data.type ?? "contact").toString()] ?? "CONTACT";

  if (!name || !/^\S+@\S+\.\S+$/.test(email)) {
    return Response.json(
      { ok: false, error: "A name and a valid email are required." },
      { status: 400 },
    );
  }

  const submission = await prisma.submission.create({
    data: {
      type,
      name,
      email,
      phone: data.phone?.trim() || null,
      message: message || null,
      context: data.context?.trim() || null,
      source: data.source?.trim() || null,
    },
  });

  // Notify, but never fail the submission on an SMTP hiccup.
  try {
    await sendSubmissionNotification(submission);
  } catch (err) {
    console.error("[api.submit] email notification failed:", err);
  }

  return Response.json({ ok: true, id: submission.id });
}
