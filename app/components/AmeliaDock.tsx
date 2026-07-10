import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles, X } from "lucide-react";
import { track } from "~/lib/analytics";
import { EASE_QUIET } from "~/lib/motion";

/**
 * Amelia, always within reach — a fixed dock (bottom-right) that opens into a
 * compact ask panel and hands the question to the platform. Navy is Amelia's
 * ground; gold is her single accent. Radius 0, in the house grammar. Hidden on
 * the /amelia route itself, and collapses to a fade under reduced motion.
 */

const EXAMPLES = [
  "Payment plans in Dubai Creek Harbour",
  "Which developers deliver on time?",
  "Saadiyat or Downtown for yield?",
];

export function AmeliaDock() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const reduced = useReducedMotion();

  // Already at the source — no need to float over it.
  if (location.pathname.startsWith("/amelia")) return null;

  const go = (raw: string) => {
    const q = raw.trim();
    track("amelia_dock", { ref: "dock" });
    navigate(`/amelia?ref=dock${q ? `&context=${encodeURIComponent(q)}` : ""}`);
    setOpen(false);
    setValue("");
  };

  return (
    <div className="fixed bottom-5 right-5 z-[25] flex flex-col items-end md:bottom-7 md:right-7">
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Ask Amelia"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 14, scale: 0.98 }}
            transition={{ duration: 0.3, ease: EASE_QUIET }}
            className="mb-3 w-[min(86vw,360px)] origin-bottom-right bg-navy text-ivory shadow-[0_24px_60px_-20px_rgba(10,21,38,0.7)] ring-1 ring-gold/30"
          >
            <div className="flex items-center justify-between border-b border-ivory/12 px-5 py-3.5">
              <span className="type-eyebrow flex items-center gap-2 text-gold">
                <Sparkles size={13} /> Amelia
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="cursor-pointer text-ivory/60 transition-colors hover:text-ivory"
              >
                <X size={16} strokeWidth={1.5} />
              </button>
            </div>
            <div className="px-5 py-5">
              <p className="text-[14.5px] leading-relaxed text-ivory/80">
                Ask anything about off-plan in Dubai and Abu Dhabi. Answered on demand — no
                call-backs, ever.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  go(value);
                }}
                className="mt-4 flex items-center gap-2 border-b border-ivory/25 pb-2 focus-within:border-gold"
              >
                <input
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="Type a question…"
                  aria-label="Your question"
                  className="w-full bg-transparent text-[15px] text-ivory placeholder-ivory/40 focus:outline-none"
                />
                <button
                  type="submit"
                  aria-label="Ask Amelia"
                  className="cursor-pointer text-gold transition-transform hover:translate-x-0.5"
                >
                  <ArrowRight size={18} />
                </button>
              </form>
              <div className="mt-4 flex flex-col gap-2.5">
                {EXAMPLES.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => go(q)}
                    className="cursor-pointer text-left text-[13px] leading-snug text-ivory/60 transition-colors hover:text-ivory"
                  >
                    “{q}”
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={open ? "Close Amelia" : "Ask Amelia"}
        className="group flex cursor-pointer items-center gap-2.5 bg-navy px-5 py-3.5 text-ivory shadow-[0_16px_40px_-16px_rgba(10,21,38,0.7)] ring-1 ring-gold/40 transition-[transform,box-shadow,--tw-ring-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:ring-gold motion-reduce:transform-none motion-reduce:hover:translate-y-0"
      >
        {open ? (
          <X size={17} strokeWidth={1.5} className="text-gold" />
        ) : (
          <Sparkles size={17} className="text-gold" />
        )}
        <span className="text-[12px] font-semibold uppercase tracking-[0.14em]">Ask Amelia</span>
      </button>
    </div>
  );
}
