import { useState } from "react";
import type { FormEvent } from "react";
import { track } from "~/lib/analytics";

type Status = "idle" | "sending" | "success" | "error";

/**
 * Underline-style inputs; phone deliberately optional — we never require it.
 * Set VITE_CONTACT_ENDPOINT (e.g. a Formspree/serverless URL) for production;
 * without it the form completes locally so the flow can be exercised in dev.
 */
const ENDPOINT = (import.meta.env.VITE_CONTACT_ENDPOINT as string | undefined) ?? "/api/submit";

const field =
  "w-full border-b border-ink/25 bg-transparent py-2.5 text-[15.5px] outline-none transition-colors focus:border-b-2 focus:border-gold";
const label = "mb-1 block text-[10.5px] font-semibold uppercase tracking-[0.14em] text-fog";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (form: HTMLFormElement) => {
    const data = new FormData(form);
    const next: Record<string, string> = {};
    if (!String(data.get("name")).trim()) next.name = "Your name is missing.";
    const email = String(data.get("email")).trim();
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "That address doesn't look complete.";
    if (!String(data.get("message")).trim()) next.message = "A message is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!validate(form)) return;
    setStatus("sending");
    try {
      if (ENDPOINT) {
        const res = await fetch(ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(Object.fromEntries(new FormData(form))),
        });
        if (!res.ok) throw new Error(String(res.status));
      } else {
        await new Promise((r) => setTimeout(r, 700));
      }
      track("contact_submit");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="border border-ink/18 p-8" role="status">
        <p className="type-title">Received.</p>
        <p className="mt-3 max-w-[48ch] text-[15.5px] text-ink/75">
          We reply within one business day. One reply, no follow-up campaign.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <input type="hidden" name="type" value="contact" />
      <input type="hidden" name="source" value="contact-page" />
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="cf-name" className={label}>Name</label>
          <input id="cf-name" name="name" type="text" autoComplete="name" className={field} required />
          {errors.name && <p className="type-cap mt-1 text-brass">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="cf-email" className={label}>Email</label>
          <input id="cf-email" name="email" type="email" autoComplete="email" className={field} required />
          {errors.email && <p className="type-cap mt-1 text-brass">{errors.email}</p>}
        </div>
      </div>
      <div className="mt-6">
        <label htmlFor="cf-phone" className={label}>Phone, optional; we never require it</label>
        <input id="cf-phone" name="phone" type="tel" autoComplete="tel" className={field} />
      </div>
      <div className="mt-6">
        <label htmlFor="cf-message" className={label}>Message</label>
        <textarea id="cf-message" name="message" rows={4} className={field} required />
        {errors.message && <p className="type-cap mt-1 text-brass">{errors.message}</p>}
      </div>
      <p className="type-cap mt-6 max-w-[56ch] text-fog">
        Your details are used to answer this enquiry and for nothing else. No lists, no campaigns.
        See the privacy policy.
      </p>
      <div className="mt-6 flex items-center gap-4">
        <button
          type="submit"
          disabled={status === "sending"}
          className="btn-platinum cursor-pointer px-8 py-[15px] text-[12.5px] font-semibold uppercase tracking-[0.1em] transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[2px] active:translate-y-0 disabled:opacity-60 motion-reduce:transform-none motion-reduce:hover:translate-y-0"
        >
          {status === "sending" ? "Sending…" : "Send"}
        </button>
        {status === "error" && (
          <p className="type-cap text-brass" role="alert">
            Something interrupted the send. Your message is intact. Try once more.
          </p>
        )}
      </div>
    </form>
  );
}
