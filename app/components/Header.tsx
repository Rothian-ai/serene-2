import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { SereneMark } from "~/components/SereneMark";
import { ASK_EXTERNAL, askHref } from "~/lib/site";

/**
 * Primary navigation, ordered by the buyer journey the strategy describes:
 * discovery → understanding the model → understanding the lifecycle → trust.
 * Conversion sits in the bar's own action, not in the link list.
 */
const NAV = [
  { to: "/properties", label: "Properties" },
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
 * The bar's single action. It is an ordinary route link to the contact form
 * until a conversation destination is configured (a WhatsApp number, or the
 * web chat on the Amelia domain), at which point it becomes an external link
 * instead — so the markup has to branch, not just the href.
 *
 * Shorter than the label the page CTAs use. "Ask Amelia, our AI Sales Agent"
 * measures 244px against a 1009px bar already carrying seven nav links at
 * 1024px, and overflows it; this fits.
 */
function ConversationAction({ className }: { className: string }) {
  const label = "Ask our AI Agent";
  if (ASK_EXTERNAL) {
    return (
      <a href={askHref({ via: "header" })} target="_blank" rel="noopener noreferrer" className={className}>
        {label}
      </a>
    );
  }
  return (
    <Link to="/contact" className={className}>
      {label}
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
            <span
              aria-hidden
              className="block h-[11px] w-[67px] bg-current"
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
          <nav className="ml-auto hidden items-center gap-5 lg:flex xl:gap-8" aria-label="Primary">
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
            <ConversationAction
              className={`whitespace-nowrap border px-4 py-2.5 text-[11.5px] font-semibold uppercase tracking-[0.12em] transition-colors xl:px-5 ${action}`}
            />
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
                className="mt-10"
              >
                <ConversationAction className="btn-platinum inline-block px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.12em]" />
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
