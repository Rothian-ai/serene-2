import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { SereneMark } from "~/components/SereneMark";
import { HAS_WHATSAPP, conversationHref } from "~/lib/site";

/**
 * Primary navigation, ordered by the buyer journey the strategy describes:
 * discovery → understanding the model → understanding the lifecycle → trust.
 * Conversion sits in the bar's own actions, not in the link list.
 *
 * Properties is not here. It is the one link people arrive wanting, so it sits
 * with the conversation action as a button rather than sixth in a row of seven
 * equal-weight labels. The mobile drawer pairs the same two at the bottom.
 */
const NAV = [
  { to: "/developers", label: "Developers" },
  { to: "/off-plan", label: "Off-Plan" },
  { to: "/difference", label: "The Difference" },
  { to: "/lifecycle", label: "The Lifecycle" },
  { to: "/insights", label: "Insights" },
  { to: "/about", label: "About" },
];

const SECONDARY = [
  { to: "/faqs", label: "Questions" },
  { to: "/careers", label: "Careers" },
  { to: "/privacy", label: "Privacy" },
];

/**
 * WhatsApp's own glyph. lucide-react carries no brand icons, so the path is
 * inlined; it inherits currentColor like every other icon in the bar.
 */
function WhatsAppGlyph({ size = 20 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden
      focusable="false"
    >
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.4-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.48s1.07 2.87 1.22 3.07c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35z" />
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.85 9.85 0 0 0 12.04 2zm0 18.13h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.18 8.18 0 0 1-1.26-4.36c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.69 8.24-8.24 8.24z" />
    </svg>
  );
}

/**
 * The bar's conversation action, now the WhatsApp glyph rather than the words
 * "Ask our AI Agent" (11 Sep 2026).
 *
 * It is pinned to WhatsApp rather than following askHref/VITE_AMELIA_ASK_MODE,
 * because the icon makes a promise about where the click lands and that promise
 * has to hold whatever the mode is set to. Amelia's no-sign-up web chat has its
 * own door: the launcher at the bottom right of every page. Two channels, two
 * controls, neither pretending to be the other.
 *
 * With no number configured it still falls back to the contact form, so the
 * control is never a dead end — hence the branch in the markup, not just in the
 * href.
 */
function ConversationAction({ className, withLabel }: { className: string; withLabel?: boolean }) {
  const label = "Chat with us on WhatsApp";
  const body = (
    <>
      <WhatsAppGlyph />
      {withLabel && <span>WhatsApp</span>}
    </>
  );
  if (HAS_WHATSAPP) {
    return (
      <a
        href={conversationHref(undefined, "header")}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        aria-label={withLabel ? undefined : label}
        title={label}
      >
        {body}
      </a>
    );
  }
  return (
    <Link to="/contact" className={className} aria-label={withLabel ? undefined : label} title={label}>
      {body}
    </Link>
  );
}

/**
 * tone "dark": transparent over a dark hero (white mark) until scroll.
 * tone "light": solid ivory bar from the start (silver mark).
 * Hides on scroll-down, returns on scroll-up — the nav never nags.
 */
export function Header({ tone }: { tone: "dark" | "light" }) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      // Hysteresis: ignore sub-threshold jitter (smooth-scroll fires many tiny
      // deltas) and only flip visibility after a clear 10px move in one
      // direction — otherwise the bar flickers on slow scroll. `lastY` is left
      // untouched below the deadzone so small moves accumulate toward the flip.
      const delta = y - lastY.current;
      if (Math.abs(delta) < 10) return;
      setHidden(y > 200 && delta > 0);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  const barHidden = hidden && !open;

  // a link is current when the path is it, or sits beneath it (/insights/x)
  const active = (to: string) =>
    location.pathname === to || location.pathname.startsWith(`${to}/`);

  const overDark = tone === "dark" && !scrolled && !open;
  const bar = overDark
    ? "bg-transparent"
    : "bg-ivory/95 backdrop-blur-[2px] border-b border-ink/12";
  const text = overDark ? "text-ivory" : "text-ink";
  // the bar's single action. Outlined over a dark hero, brass on the light bar —
  // the platinum fill is reserved for in-page primaries so the header never
  // out-shouts the section it sits above.
  const action = overDark
    ? "border-silver/70 text-silver hover:border-silver hover:bg-ivory/5"
    : "border-brass text-brass hover:border-ink hover:text-ink";
  /* Silver, filled, on both grounds. It used to be the quieter outline of a
     pair; now that the conversation action beside it is a bare glyph, the
     destination is the only thing in the group carrying a word, and an outline
     next to an icon read as two leftovers rather than a pair. Silver is the
     brand's own material and stops short of the platinum fill, which stays
     reserved for in-page primaries. Ink on Silver measures about 11:1, so it
     holds on the dark bar and on the ivory one without a second treatment. */
  const propertiesAction = overDark
    ? "border-transparent bg-silver text-ink hover:bg-platinum"
    // On the ivory bar the fill alone washes out: Silver on Pearl is 1.90:1, so
    // the block barely separates from the bar behind it. A Steel hairline takes
    // that edge to 2.92:1, which is a clearly visible boundary. It is not the
    // 3:1 of WCAG 1.4.11, and it does not need to be: that rule governs the
    // visual information *required* to identify a control, and here the label
    // does it at 8.76:1 — the edge is doing aesthetic work, not semantic. No
    // neutral in the palette reaches 3:1 against Pearl without going darker
    // than the mark itself. Over the hero the dark ground already separates the
    // button at 8.76:1, so a border there would only add a seam.
    : "border-steel bg-silver text-ink hover:border-ink hover:bg-platinum";

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-[transform,background-color] duration-500 ${bar} ${
          barHidden ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <div className={`container-site flex items-center gap-8 py-4 ${text}`}>
          <Link to="/" className="flex items-center gap-3" aria-label="Serene, home">
            <SereneMark tone={overDark ? "white" : "graphite"} className="h-9 w-auto" />
            {/* The wordmark is the supplied artwork, not type: the "SERENE" band
                cropped out of logo/serene-mark.png. That artwork is flat white,
                so it is invisible on the light bar — the file supplies the shape
                through a mask and the header's own currentColor supplies the
                ink, which keeps it in step with the bar's dark/light tone for
                free. 11px tall means even a 2x screen samples the 23px source
                down rather than up. */}
            {/* Nudged down 3px, deliberately.

                items-center centres the two boxes, and the mark's ink is centred in
                its own box: measured mid 17.95 against a box centre of 18. But the
                mark is a spire and a hairline frame sitting over solid towers, so its
                mass is not where its box is. Rasterised and weighted, its centre of
                mass falls at 22.4px, 4.4px below centre, and the silhouette only
                becomes substantial 6.6px down. Centred geometrically the wordmark
                therefore reads high, which is exactly how it looked.

                3px aligns it to the middle of the towers (20.75px) rather than to the
                full extent including the spire, which is the shape the eye weighs.
                Chasing the centre of mass outright would drop it 4.4px and read low.
                A transform, so nothing reflows. */}
            <span
              aria-hidden
              className="block h-[11px] w-[67px] translate-y-[3px] bg-current"
              style={{
                WebkitMaskImage: 'url("/logo/serene-wordmark.png")',
                maskImage: 'url("/logo/serene-wordmark.png")',
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskPosition: "center",
                WebkitMaskSize: "contain",
                maskSize: "contain",
              }}
            />
          </Link>
          {/* five primary links + one action: at lg the gaps tighten so the
              longer strategic labels still fit on a 1024px laptop */}
          <nav className="ml-auto hidden items-center gap-4 lg:flex xl:gap-7" aria-label="Primary">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                  prefetch="intent"
                className={`whitespace-nowrap text-[13.5px] font-medium transition-opacity ${
                  active(item.to) ? "opacity-100" : "opacity-85 hover:opacity-100"
                }`}
                aria-current={active(item.to) ? "page" : undefined}
              >
                {item.label}
              </Link>
            ))}
            {/* The actions are their own group, not two more items in the row.
                Every gap in this bar used to be the same 32px, so a 40px-tall
                boxed button sat exactly as far from "About" as "About" sat from
                "Insights" — the two buttons read as stray boxes dropped into the
                link list rather than as a pair of actions. A wider break before
                the group and a tighter gap inside it is what separates
                navigation from conversion.

                Deliberately unequal within the pair: Properties takes the
                quieter outline so it reads as a destination; the conversation
                action keeps the accent because it is the conversion. Neither
                takes the platinum fill, which stays reserved for in-page
                primaries. */}
            <div className="ml-2 flex items-center gap-2.5 xl:ml-4">
              <Link
                to="/properties"
                prefetch="intent"
                className={`whitespace-nowrap border px-4 py-2.5 text-[11.5px] font-semibold uppercase tracking-[0.12em] transition-colors xl:px-5 ${propertiesAction}`}
                aria-current={active("/properties") ? "page" : undefined}
              >
                View Properties
              </Link>
              {/* Square rather than the text button's padding, and sized to
                  match its neighbour's height so the pair still reads as a
                  pair. */}
              <ConversationAction
                className={`flex h-[40px] w-[40px] shrink-0 items-center justify-center border transition-colors ${action}`}
              />
            </div>
          </nav>
          <button
            type="button"
            className="ml-auto p-2 lg:hidden"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-30 bg-ink text-ivory"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            {/* the drawer scrolls: five primary links plus two actions can
                exceed a short phone viewport in landscape */}
            <nav
              className="flex h-full flex-col justify-center gap-1 overflow-y-auto px-8 py-24"
              aria-label="Menu"
            >
              {NAV.map((item, i) => (
                <motion.div
                  key={item.to}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link to={item.to} prefetch="intent" className="type-headline block py-2">
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
                {SECONDARY.map((item) => (
                  <Link key={item.to} to={item.to} className="type-cap text-silver">
                    {item.label}
                  </Link>
                ))}
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
                className="mt-10 flex flex-wrap items-center gap-3"
              >
                {/* Properties left the link list above, so it has to be here or
                    it would be unreachable from the drawer. */}
                <Link
                  to="/properties"
                  prefetch="intent"
                  onClick={() => setOpen(false)}
                  className="inline-block bg-silver px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-ink transition-colors hover:bg-platinum"
                >
                  View Properties
                </Link>
                {/* The drawer has the room the bar does not, and a bare glyph in
                    a full-screen menu loses the affordance a tap target wants,
                    so here the icon keeps its word. */}
                <ConversationAction
                  withLabel
                  className="inline-flex items-center gap-2.5 border border-ivory/30 px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-ivory transition-colors hover:border-ivory"
                />
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
