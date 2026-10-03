import { useEffect } from "react";
import { getConsent } from "~/lib/analytics";

/**
 * Amelia's website chat. Her script draws the round button in Serene's colours
 * and opens the chat in a panel beside the page; this only decides when to load
 * it.
 *
 * Not before the cookie band is answered: the button is fixed bottom right above
 * everything, which is exactly where the band's Accept button sits. A returning
 * visitor has already chosen, so it loads at once. The band announces a choice
 * with `serene:consent`, which also covers storage that is blocked, where the
 * choice was made but cannot be read back.
 *
 * Inserted from an effect because React does not run a <script> it creates in
 * the browser, and the choice usually arrives after hydration.
 */
const CHAT_SRC = "https://amelia.serenebay.ae/chat.js";

export function AmeliaChat() {
  useEffect(() => {
    const load = () => {
      if (document.querySelector(`script[src="${CHAT_SRC}"]`)) return;
      const script = document.createElement("script");
      script.src = CHAT_SRC;
      script.async = true;
      document.body.appendChild(script);
    };
    if (getConsent() !== null) load();
    window.addEventListener("serene:consent", load);
    return () => window.removeEventListener("serene:consent", load);
  }, []);

  return null;
}
