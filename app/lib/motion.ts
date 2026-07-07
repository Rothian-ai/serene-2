import type { Variants } from "framer-motion";

/**
 * The Facade motion vocabulary — the only moves in the repertoire.
 * Weight settling, light shifting; no springs, no overshoot.
 */

export const EASE_QUIET = [0.22, 1, 0.36, 1] as const;
export const EASE_INOUT = [0.65, 0, 0.35, 1] as const;

/** fade-rise — the default entrance */
export const fadeRise: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE_QUIET },
  },
};

/** container that staggers its children (max 5 staggered items per group) */
export const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

/** mask reveal — clip-path inset wipe, for heroes and key images */
export const maskReveal: Variants = {
  hidden: { clipPath: "inset(100% 0 0 0)" },
  visible: {
    clipPath: "inset(0% 0 0 0)",
    transition: { duration: 1.1, ease: EASE_INOUT },
  },
};

/** scale-settle — image settles from 1.06 inside its masked frame */
export const scaleSettle: Variants = {
  hidden: { scale: 1.06 },
  visible: { scale: 1, transition: { duration: 1.2, ease: EASE_QUIET } },
};

export const viewportOnce = { once: true, margin: "-80px" } as const;

/**
 * First-hydration flag. Prerendered HTML must paint complete (no hidden
 * initial states) — entrance animations are reserved for client-side
 * navigations. Root marks hydration; components read it at mount.
 */
let hydrated = false;
export const markHydrated = () => {
  hydrated = true;
};
export const isHydrated = () => hydrated;
