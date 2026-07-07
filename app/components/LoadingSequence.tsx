import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Once per session: ink ground, the mark rising, cross-fade out.
 * ≤1.8s, skipped by any interaction, skipped entirely on repeat visits
 * and under prefers-reduced-motion.
 */
export function LoadingSequence() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // If hydration arrived late (slow network/device), the page is already
    // readable — flashing an overlay over it would be worse than no sequence.
    if (reduced || sessionStorage.getItem("serene-visited") || performance.now() > 1500) return;
    sessionStorage.setItem("serene-visited", "1");
    setShow(true);
    const dismiss = () => setShow(false);
    const timer = window.setTimeout(dismiss, 1800);
    window.addEventListener("wheel", dismiss, { once: true, passive: true });
    window.addEventListener("pointerdown", dismiss, { once: true });
    window.addEventListener("keydown", dismiss, { once: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("wheel", dismiss);
      window.removeEventListener("pointerdown", dismiss);
      window.removeEventListener("keydown", dismiss);
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-ink"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: [0.65, 0, 0.35, 1] } }}
          aria-hidden
        >
          <motion.img
            src="/logo/serene-mark-white.png"
            alt=""
            className="h-24 w-auto"
            initial={{ opacity: 0, y: 18, clipPath: "inset(100% 0 0 0)" }}
            animate={{
              opacity: 1,
              y: 0,
              clipPath: "inset(0% 0 0 0)",
              transition: { duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] },
            }}
          />
          <motion.span
            className="mt-5 text-[15px] font-medium uppercase tracking-[0.3em] text-ivory"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.6, delay: 1.0 } }}
          >
            Serene
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
