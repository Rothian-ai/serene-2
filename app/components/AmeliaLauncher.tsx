import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { tryAmeliaHref } from "~/lib/amelia";
import { getConsent } from "~/lib/analytics";

/**
 * Amelia's web chat, pinned to the bottom right of every page.
 *
 * This replaces the platinum "Ask Amelia, our AI Sales Agent" button that used
 * to lead the homepage hero. A hero button is the strongest thing on the page
 * for one screen and then gone; the launcher is quieter but stays within reach
 * the whole way down, which is where the question usually forms.
 *
 * Pinned to the web chat deliberately, bypassing askHref and
 * VITE_AMELIA_ASK_MODE, exactly as the hero button did: WhatsApp is the header's
 * channel now, and this is the one that opens a chat with no sign-up. The two
 * are different doors on purpose.
 *
 * It yields to the cookie band. That band is `fixed inset-x-0 bottom-0` and owns
 * the same strip, so a launcher sitting on top of it would cover the Accept
 * button. Rather than guess an offset that survives the band wrapping to two
 * lines on a phone, the launcher simply waits: the band is a one-time state and
 * one click clears it. CookieConsent fires `serene:consent` when that happens,
 * because otherwise this would stay hidden until the next navigation.
 */
export function AmeliaLauncher() {
  // Rendered only after mount: the consent state lives in browser storage, and
  // committing to a visible/hidden launcher during SSR would hydrate wrong for
  // half the visitors.
  const [ready, setReady] = useState(false);
  const [consentPending, setConsentPending] = useState(false);

  useEffect(() => {
    const read = () => setConsentPending(getConsent() === null);
    read();
    setReady(true);
    window.addEventListener("serene:consent", read);
    return () => window.removeEventListener("serene:consent", read);
  }, []);

  if (!ready || consentPending) return null;

  return (
    <a
      href={tryAmeliaHref({ via: "launcher" })}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Ask Amelia, our AI sales agent"
      title="Ask Amelia"
      className="group fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-ink text-ivory shadow-[0_10px_30px_rgba(10,21,38,0.45)] transition-[transform,background-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[2px] hover:bg-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass motion-reduce:transform-none motion-reduce:hover:translate-y-0 md:bottom-8 md:right-8"
    >
      <MessageCircle size={24} strokeWidth={1.5} aria-hidden />
      {/* The label appears on hover on pointer devices and is always available
          to a screen reader through aria-label, so the icon never has to carry
          the meaning on its own. */}
      <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap bg-ink px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-ivory opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:block">
        Ask Amelia
      </span>
    </a>
  );
}
