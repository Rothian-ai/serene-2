import { useState } from "react";
import type { FormEvent } from "react";
import { track } from "~/lib/analytics";
import { SITE } from "~/lib/site";

type Status = "idle" | "sending" | "success" | "error";

/**
 * Underline-style inputs; phone deliberately optional — we never require it.
 *
 * Three strategy-led fields sit alongside the standard four: where the buyer is
 * based (most are non-resident), which stage of the process they are at, and an
 * explicit opt-in for a call. Nothing calls them unless that box is ticked — the
 * call-on-request model, made a mechanism rather than a promise.
 *
 * Posts to `/api/submit`, which emails the house over SMTP and stores the row if
 * a database is configured. `VITE_CONTACT_ENDPOINT` overrides the destination if
 * an external form service is ever preferred.
 */
/**
 * Where the form posts. Note `||`, not `??`: an env var that exists but is
 * EMPTY is a real deployment case (a blank value in Vercel, or a bare
 * `VITE_CONTACT_ENDPOINT=` line in .env), and `??` would let that empty string
 * win — posting the form to "", which resolves to the current page instead of
 * the endpoint. Trim too, so stray whitespace cannot do the same.
 */
const ENDPOINT =
  (import.meta.env.VITE_CONTACT_ENDPOINT as string | undefined)?.trim() || "/api/submit";

const field =
  "w-full border-b border-ink/25 bg-transparent py-2.5 text-[15.5px] outline-none transition-colors focus:border-b-2 focus:border-gold";
const label = "mb-1 block text-[10.5px] font-semibold uppercase tracking-[0.14em] text-fog";

/** Stage one of the lifecycle is a conversation about the objective (strategy §4). */
const STAGE_OPTIONS = [
  "Working out what the purchase is for",
  "Comparing projects and developers",
  "Ready to reserve",
  "I already own a unit off-plan",
  "Looking to resell or exit",
];

export function ContactForm({
  fallback,
}: {
  /** Result of a native (no-JavaScript) post to the /contact action, if any. */
  fallback?: { ok: boolean; error?: string };
} = {}) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

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
      // The endpoint composes the advisor-facing summary itself, so the client
      // just sends the fields as entered.
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const body = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      if (!res.ok || !body?.ok) {
        // Show what the server actually said — "something went wrong" tells a
        // visitor nothing and loses a real enquiry.
        throw new Error(body?.error || "Something interrupted the send. Your message is intact.");
      }
      track("contact_submit");
      setStatus("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something interrupted the send.");
      setStatus("error");
    }
  };

  // A native post already succeeded: show the same confirmation.
  if (status === "success" || fallback?.ok) {
    return (
      <div className="border border-ink/18 p-8" role="status">
        <p className="type-title">Received.</p>
        <p className="mt-3 max-w-[48ch] text-[15.5px] text-ink/75">
          An advisor replies within one business day. If you asked for a call, we will arrange it
          then; if you didn't, you will not receive one. Either way, there is no follow-up campaign.
        </p>
      </div>
    );
  }

  return (
    <form method="post" onSubmit={onSubmit} noValidate className="relative">
      <input type="hidden" name="type" value="contact" />
      <input type="hidden" name="source" value="contact-page" />
      {/* Honeypot. Positioned off-screen rather than display:none, which some
          bots skip, and hidden from assistive tech and tab order. Anything that
          fills this in is not a person. */}
      <div aria-hidden className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
        <label htmlFor="cf-company">Company</label>
        <input id="cf-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>
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
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="cf-based" className={label}>Where you are based, optional</label>
          <input
            id="cf-based"
            name="basedIn"
            type="text"
            autoComplete="country-name"
            placeholder="London, Mumbai, Riyadh…"
            className={`${field} placeholder:text-ink/30`}
          />
        </div>
        <div>
          <label htmlFor="cf-stage" className={label}>Where you are in the process</label>
          <select
            id="cf-stage"
            name="stage"
            className={`${field} field-select`}
            defaultValue={STAGE_OPTIONS[0]}
          >
            {STAGE_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-6">
        <label htmlFor="cf-message" className={label}>What you would like to know</label>
        <textarea id="cf-message" name="message" rows={4} className={field} required />
        {errors.message && <p className="type-cap mt-1 text-brass">{errors.message}</p>}
      </div>

      {/* the call opt-in — the no-cold-call commitment, as a mechanism */}
      <div className="mt-8 border border-ink/18 p-5">
        <label htmlFor="cf-call" className="flex cursor-pointer items-start gap-3.5">
          <input
            id="cf-call"
            name="callRequested"
            type="checkbox"
            value="yes"
            className="field-check mt-0.5 shrink-0"
          />
          <span>
            <span className="type-subhead block">I would like a call.</span>
            <span className="type-cap mt-1 block text-fog">
              Leave this unticked and nobody will phone you. We reply in writing instead.
            </span>
          </span>
        </label>
        <div className="mt-5">
          <label htmlFor="cf-phone" className={label}>
            Phone, only needed if you want that call
          </label>
          <input id="cf-phone" name="phone" type="tel" autoComplete="tel" className={field} />
        </div>
      </div>

      <p className="type-cap mt-6 max-w-[56ch] text-fog">
        Your details are used to answer this enquiry and for nothing else. Never sold, never passed
        to a sales floor, never used for unsolicited outreach. See the privacy policy.
      </p>
      <div className="mt-6 flex items-center gap-4">
        <button
          type="submit"
          disabled={status === "sending"}
          className="btn-platinum cursor-pointer px-8 py-[15px] text-[12.5px] font-semibold uppercase tracking-[0.1em] transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[2px] active:translate-y-0 disabled:opacity-60 motion-reduce:transform-none motion-reduce:hover:translate-y-0"
        >
          {status === "sending" ? "Sending…" : "Send"}
        </button>
        {(status === "error" || fallback?.error) && (
          <p className="type-cap max-w-[42ch] text-brass" role="alert">
            {error ?? fallback?.error} Try once more, or write to{" "}
            <a href={`mailto:${SITE.email}`} className="underline underline-offset-2">
              {SITE.email}
            </a>
            .
          </p>
        )}
      </div>
    </form>
  );
}
