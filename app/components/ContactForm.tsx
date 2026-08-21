import { useState } from "react";
import type { FormEvent } from "react";
import { track } from "~/lib/analytics";

type Status = "idle" | "sending" | "success" | "error";

/**
 * Underline-style inputs; phone deliberately optional — we never require it.
 * Set VITE_CONTACT_ENDPOINT (e.g. a Formspree/serverless URL) for production;
 * without it the form completes locally so the flow can be exercised in dev.
 *
 * Three strategy-led fields sit alongside the standard four: where the buyer is
 * based (most are non-resident), which stage of the lifecycle they are at, and
 * an explicit opt-in for a call. Nothing calls them unless that box is ticked —
 * the call-on-request model, made a mechanism rather than a promise. The extra
 * answers are folded into the existing `context` column, so the enquiry sink and
 * its schema are untouched.
 */
const ENDPOINT = (import.meta.env.VITE_CONTACT_ENDPOINT as string | undefined) ?? "/api/submit";

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
        const data = new FormData(form);
        // The three extra answers ride in `context` so the enquiry schema is
        // unchanged; the call opt-in is recorded either way, so an advisor can
        // see plainly that silence means "do not call".
        const context = [
          data.get("stage") ? `Stage: ${data.get("stage")}` : "",
          String(data.get("basedIn") ?? "").trim() ? `Based in: ${data.get("basedIn")}` : "",
          data.get("callRequested") ? "Call requested" : "No call requested",
        ]
          .filter(Boolean)
          .join(" · ");
        const payload = { ...Object.fromEntries(data), context };
        const res = await fetch(ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(payload),
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
          An advisor replies within one business day. If you asked for a call, we will arrange it
          then; if you didn't, you will not receive one. Either way, there is no follow-up campaign.
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
        {status === "error" && (
          <p className="type-cap text-brass" role="alert">
            Something interrupted the send. Your message is intact. Try once more.
          </p>
        )}
      </div>
    </form>
  );
}
