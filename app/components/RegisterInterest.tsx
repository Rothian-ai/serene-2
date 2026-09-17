import { useState } from "react";
import type { FormEvent } from "react";
import { track } from "~/lib/analytics";

type Status = "idle" | "sending" | "success" | "error";

/**
 * Register interest in one property without creating an account.
 *
 * The lighter half of the funnel: the platinum CTA above it opens verified
 * signup (email + WhatsApp codes, a password, and the buyer portal on the other
 * side); this is for a visitor who wants an advisor to come to them instead.
 * Posts to our own /api/register-interest, which forwards to Amelia server-side.
 *
 * Repeat submissions for the same email update the interested property rather
 * than duplicating the lead, so submitting twice is harmless.
 */
const field =
  "w-full border-b border-ivory/30 bg-transparent py-2.5 text-[15.5px] text-ivory outline-none transition-colors placeholder:text-ivory/35 focus:border-b-2 focus:border-silver";
const label = "mb-1 block text-[10.5px] font-semibold uppercase tracking-[0.14em] text-silver";

export function RegisterInterest({
  projectSlug,
  projectName,
}: {
  projectSlug: string;
  projectName: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    setError(null);
    try {
      const res = await fetch("/api/register-interest", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const body = (await res.json().catch(() => null)) as
        | { ok?: boolean; error?: string }
        | null;
      if (!res.ok || !body?.ok) {
        throw new Error(body?.error || "Could not register your interest just now.");
      }
      track("register_interest", { project: projectSlug });
      setStatus("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not register your interest.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="border border-ivory/20 p-8" role="status">
        <p className="type-title text-ivory">Noted.</p>
        <p className="mt-3 max-w-[46ch] text-[15.5px] text-ivory/75">
          An advisor has your interest in {projectName} and will reply within one business day.
          You have not been added to a list.
        </p>
      </div>
    );
  }

  return (
    // Named on the form, not the button: Amelia's tracker counts the submit
    // itself, and a tagged button inside it would count the same lead twice.
    <form
      onSubmit={onSubmit}
      className="relative"
      noValidate
      data-amelia-conversion="register_interest"
    >
      <input type="hidden" name="projectSlug" value={projectSlug} />
      {/* honeypot — off-screen rather than display:none, and out of tab order */}
      <div aria-hidden className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
        <label htmlFor="ri-company">Company</label>
        <input id="ri-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="ri-name" className={label}>
            Name
          </label>
          <input id="ri-name" name="name" type="text" autoComplete="name" className={field} required />
        </div>
        <div>
          <label htmlFor="ri-email" className={label}>
            Email
          </label>
          <input
            id="ri-email"
            name="email"
            type="email"
            autoComplete="email"
            className={field}
            required
          />
        </div>
      </div>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="ri-phone" className={label}>
            Phone, optional
          </label>
          <input id="ri-phone" name="phone" type="tel" autoComplete="tel" className={field} />
        </div>
        <div>
          <label htmlFor="ri-message" className={label}>
            What you would like to know
          </label>
          <input id="ri-message" name="message" type="text" className={field} />
        </div>
      </div>

      <div className="mt-7 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={status === "sending"}
          className="cursor-pointer border border-ivory/50 px-8 py-[15px] text-[12.5px] font-semibold uppercase tracking-[0.1em] text-ivory transition-colors hover:border-ivory disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : "Register interest"}
        </button>
        {status === "error" && error && (
          <p className="type-cap text-dawn" role="alert">
            {error}
          </p>
        )}
      </div>
    </form>
  );
}
