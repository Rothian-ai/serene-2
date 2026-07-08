import { useEffect, useState } from "react";

/**
 * Once per session: ink ground, the mark rising, cross-fade out. ≤1.8s, skipped
 * by any interaction, skipped entirely on repeat visits and under
 * prefers-reduced-motion.
 *
 * Dismissal is driven by timers + a CSS transition (NOT rAF/Framer): the overlay
 * is unmounted by a setTimeout chain that fires even in a backgrounded tab, so a
 * first load in an inactive tab can never leave it stuck (the previous rAF-driven
 * exit froze mid-fade until refresh). SSR/first paint render nothing (phase
 * starts "pending" → null), matching the prerendered HTML; the reveal is a
 * post-hydration enhancement.
 */
type Phase = "pending" | "shown" | "leaving" | "done";

export function LoadingSequence() {
  const [phase, setPhase] = useState<Phase>("pending");

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // If hydration arrived late, the page is already readable — flashing an
    // overlay over it would be worse than no sequence.
    if (reduced || sessionStorage.getItem("serene-visited") || performance.now() > 1500) {
      setPhase("done");
      return;
    }
    sessionStorage.setItem("serene-visited", "1");
    setPhase("shown");

    let doneTimer = 0;
    const dismiss = () => {
      setPhase("leaving");
      // hard unmount after the fade window — a plain timer, so it fires even if
      // the tab was backgrounded through the whole sequence.
      doneTimer = window.setTimeout(() => setPhase("done"), 650);
    };
    const leaveTimer = window.setTimeout(dismiss, 1800);
    const early = () => {
      window.clearTimeout(leaveTimer);
      dismiss();
    };
    window.addEventListener("wheel", early, { once: true, passive: true });
    window.addEventListener("pointerdown", early, { once: true });
    window.addEventListener("keydown", early, { once: true });
    return () => {
      window.clearTimeout(leaveTimer);
      window.clearTimeout(doneTimer);
      window.removeEventListener("wheel", early);
      window.removeEventListener("pointerdown", early);
      window.removeEventListener("keydown", early);
    };
  }, []);

  if (phase === "pending" || phase === "done") return null;

  return (
    <div
      aria-hidden
      className={`fixed inset-0 z-[60] flex flex-col items-center justify-center bg-ink transition-opacity duration-[600ms] ease-[cubic-bezier(0.65,0,0.35,1)] ${
        phase === "leaving" ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <img src="/logo/serene-mark-white.png" alt="" className="loader-mark h-24 w-auto" />
      <span className="loader-word mt-5 text-[15px] font-medium uppercase tracking-[0.3em] text-ivory">
        Serene
      </span>
    </div>
  );
}
