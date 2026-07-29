import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { AMELIA_URL } from "~/lib/site";

const NAV = [
  { to: "/developments", label: "Developments" },
  { to: "/developers", label: "Developers" },
  { to: "/insights", label: "Insights" },
  { to: "/about", label: "About" },
];

const SECONDARY = [
  { to: "/careers", label: "Careers" },
  { to: "/faqs", label: "FAQs" },
  { to: "/contact", label: "Contact" },
];

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

  // Sticky elements (e.g. the developments filter) pin below the bar via
  // --header-offset; keep it in sync so they rise when the bar hides.
  const barHidden = hidden && !open;
  useEffect(() => {
    document.documentElement.style.setProperty("--header-offset", barHidden ? "0px" : "68px");
    return () => {
      document.documentElement.style.setProperty("--header-offset", "68px");
    };
  }, [barHidden]);

  const overDark = tone === "dark" && !scrolled && !open;
  const bar = overDark
    ? "bg-transparent"
    : "bg-ivory/95 backdrop-blur-[2px] border-b border-ink/12";
  const text = overDark ? "text-ivory" : "text-ink";
  const amelia = overDark
    ? "border-silver/70 text-silver hover:border-silver"
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
            {/* mark alone — the wordmark beside it is the live "SERENE" span */}
            <img
              src="/logo/serene-mark.png"
              alt=""
              className="h-9 w-auto"
            />
            <span className="text-[15px] font-medium uppercase tracking-[0.2em]">Serene</span>
          </Link>
          <nav className="ml-auto hidden items-center gap-8 lg:flex" aria-label="Primary">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="text-[13.5px] font-medium opacity-85 transition-opacity hover:opacity-100"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/contact"
              className="text-[13.5px] font-medium opacity-85 transition-opacity hover:opacity-100"
            >
              Contact
            </Link>
            <a
              href={AMELIA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`border px-5 py-2.5 text-[11.5px] font-semibold uppercase tracking-[0.12em] transition-colors ${amelia}`}
            >
              Ask Amelia
            </a>
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
            <nav
              className="flex h-full flex-col justify-center gap-2 px-8 pt-16"
              aria-label="Menu"
            >
              {NAV.map((item, i) => (
                <motion.div
                  key={item.to}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link to={item.to} className="type-headline block py-2">
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <div className="mt-8 flex gap-6">
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
                <a
                  href={AMELIA_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-silver/70 px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-silver"
                >
                  Ask Amelia
                </a>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
