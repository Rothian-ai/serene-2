import { useEffect, useState } from "react";

/**
 * The first-visit intro: ink ground, the mark, cross-fade out. Once per session,
 * skipped under prefers-reduced-motion.
 *
 * Whether to show it is decided by an inline script in <head> (see root.tsx),
 * before the first paint, and that is the whole point. This component used to
 * decide in an effect, which runs after hydration: on anything but a fast
 * connection the home page painted, sat there readable for about a second, then
 * got covered by the intro and uncovered again. That is the flash the client
 * reported, and no threshold tuning fixes it, because paint always precedes
 * hydration.
 *
 * Now the overlay is in the server-rendered HTML and hidden by CSS unless the
 * script set `data-intro` on <html>. A first-time visitor's first paint IS the
 * intro; a returning visitor never sees it at all. It also ends sooner than
 * before, since the 1.8s is counted from paint rather than from hydration.
 *
 * The exit is timers plus a CSS transition, never rAF: a tab that is
 * backgrounded through the whole sequence still finishes it. An earlier
 * rAF-driven exit froze mid-fade until refresh.
 */
export function LoadingSequence() {
  const [phase, setPhase] = useState<"idle" | "leaving" | "done">("idle");

  useEffect(() => {
    const root = document.documentElement;
    // No attribute means the head script decided against an intro: reduced
    // motion, a repeat visit in this session, or storage unavailable. Nothing is
    // on screen, so there is nothing to dismiss.
    if (!root.hasAttribute("data-intro")) {
      setPhase("done");
      return;
    }

    let doneTimer = 0;
    const dismiss = () => {
      setPhase("leaving");
      // Hard unmount after the fade window. A plain timer, so it fires even if
      // the tab was never focused.
      doneTimer = window.setTimeout(() => {
        root.removeAttribute("data-intro");
        setPhase("done");
      }, 650);
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

  if (phase === "done") return null;

  /* No `flex` utility here on purpose: the display property is what CSS uses to
     gate the overlay on `html[data-intro]`, so setting it inline would show the
     intro to everyone until hydration removed it. */
  return (
    <div
      aria-hidden
      className={`serene-intro fixed inset-0 z-[60] flex-col items-center justify-center bg-ink transition-opacity duration-[600ms] ease-[cubic-bezier(0.65,0,0.35,1)] ${
        phase === "leaving" ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      {/* the lockup already carries the wordmark — the mark stands alone, dead-centre */}
      <img src="/logo/serene-mark-white.png" alt="" className="loader-mark h-28 w-auto" />
    </div>
  );
}
