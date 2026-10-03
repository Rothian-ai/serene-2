import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getConsent, setConsent } from "~/lib/analytics";

/**
 * A quiet ivory band, never a modal wall. Decline is one click and
 * remembered — the no-pressure promise applies to our own banner.
 */
export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (getConsent() === null) setVisible(true);
  }, []);

  if (!visible) return null;

  const decide = (state: "accepted" | "declined") => {
    setConsent(state);
    setVisible(false);
    // Amelia's chat button would cover this band's Accept button, so the chat
    // loads only once a choice is made, and this is how it hears of one.
    window.dispatchEvent(new Event("serene:consent"));
  };

  return (
    <div
      role="region"
      aria-label="Cookie notice"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-ink/14 bg-ivory px-6 py-4 md:px-12"
    >
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-4">
        <p className="type-cap max-w-[64ch] text-fog">
          We use analytics cookies to understand how the site is read, nothing more. Decline and
          no cookies are set. <Link to="/cookies" className="underline underline-offset-2">Cookie policy</Link>
        </p>
        <div className="ml-auto flex gap-3">
          <button
            type="button"
            onClick={() => decide("declined")}
            className="cursor-pointer px-4 py-2 text-[11.5px] font-semibold uppercase tracking-[0.1em] text-fog hover:text-ink"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => decide("accepted")}
            className="cursor-pointer bg-ink px-5 py-2 text-[11.5px] font-semibold uppercase tracking-[0.1em] text-ivory hover:bg-ink/85"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
