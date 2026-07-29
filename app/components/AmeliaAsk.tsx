import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Eyebrow, Reveal, Section } from "~/components/primitives";
import { EASE_QUIET } from "~/lib/motion";
import { track } from "~/lib/analytics";

/**
 * The Amelia centerpiece — the site's one interactive-storytelling device,
 * on its one sanctioned navy surface. A real question field that demonstrates
 * the promise (ask anything, no call) instead of asserting it. On submit it
 * hands off to the /amelia gateway carrying the question as `context`, which
 * the gateway threads on to the external platform.
 *
 * Gold appears exactly once here (the ask action). Radius 0. All motion
 * collapses under prefers-reduced-motion.
 */

const EXAMPLES = [
  "What protects my deposit under UAE escrow law?",
  "Compare service charges in Downtown and Creek Harbour.",
  "Which handovers complete before 2028?",
  "Model an 80/20 payment plan against expected yield.",
];

function toAmelia(question?: string): string {
  const q = question?.trim();
  return `/amelia?ref=home-ask${q ? `&context=${encodeURIComponent(q)}` : ""}`;
}

export function AmeliaAsk() {
  const navigate = useNavigate();
  const reduced = useReducedMotion();
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const [ghost, setGhost] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const showGhost = value === "" && !focused;

  // rotate the ghost prompt while the field is idle — the demonstration
  useEffect(() => {
    if (reduced || !showGhost) return;
    const id = window.setInterval(() => setGhost((g) => (g + 1) % EXAMPLES.length), 3400);
    return () => window.clearInterval(id);
  }, [reduced, showGhost]);

  function go(question?: string) {
    track("amelia_ask", { ref: "home-ask" });
    navigate(toAmelia(question));
  }

  return (
    <div className="bg-navy text-ivory">
      <Section>
        <Eyebrow className="text-silver">Amelia</Eyebrow>
        <div className="mt-9 max-w-[860px]">
          <Reveal>
            <h2 className="type-headline max-w-[20ch]">Conversation, not cold calls.</h2>
            <p className="type-body-lg mt-6 max-w-[52ch] text-ivory/78">
              Amelia is Serene's conversational advisor, awake at every hour, fluent in the
              record: escrow rules, service charges, handover dates, yields. She replaced the
              sales floor with answers, and she follows up with no one.
            </p>
          </Reveal>

          <Reveal delay={0.12}>
            <form
              className="mt-11"
              onSubmit={(e) => {
                e.preventDefault();
                go(value);
              }}
            >
              <label htmlFor="amelia-ask" className="sr-only">
                Ask Amelia a question
              </label>
              <div
                className={`flex items-center gap-4 border-b pb-4 transition-colors duration-300 ${
                  focused ? "border-silver" : "border-ivory/30"
                }`}
              >
                <div className="relative min-w-0 flex-1">
                  <input
                    id="amelia-ask"
                    ref={inputRef}
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    autoComplete="off"
                    className="w-full bg-transparent text-[1.05rem] font-light text-ivory caret-silver outline-none placeholder:text-ivory/40"
                    placeholder={reduced ? "Ask Amelia a question…" : undefined}
                  />
                  {!reduced && showGhost && (
                    <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center overflow-hidden">
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={ghost}
                          className="block truncate text-[1.05rem] font-light text-ivory/40"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.5, ease: EASE_QUIET }}
                        >
                          {EXAMPLES[ghost]}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  className="btn-platinum shrink-0 cursor-pointer px-7 py-3 text-[12.5px] font-semibold uppercase tracking-[0.1em] transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
                >
                  Ask&nbsp;&nbsp;↗
                </button>
              </div>
            </form>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-3">
              <span className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-silver">
                For instance
              </span>
              {EXAMPLES.slice(0, 3).map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => go(q)}
                  className="cursor-pointer border border-ivory/22 px-3.5 py-2 text-left text-[13px] leading-snug text-ivory/75 transition-colors duration-300 hover:border-silver hover:text-ivory"
                >
                  {q}
                </button>
              ))}
            </div>
            <p className="type-cap mt-7 text-silver">
              The conversation begins on the next page and continues on her platform. No
              call-backs, no lists, ever.
            </p>
          </Reveal>
        </div>
      </Section>
    </div>
  );
}
