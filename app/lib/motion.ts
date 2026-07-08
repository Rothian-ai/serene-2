import type { Variants } from "framer-motion";

/**
 * The Facade motion vocabulary — the only moves in the repertoire.
 * Weight settling, light shifting; no springs, no overshoot.
 */

export const EASE_QUIET = [0.22, 1, 0.36, 1] as const;
export const EASE_INOUT = [0.65, 0, 0.35, 1] as const;
/** expressive — a touch of overshoot for the maximal moments */
export const EASE_EXPRESSIVE = [0.34, 1.3, 0.64, 1] as const;

/** fade-rise — the default entrance */
export const fadeRise: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE_QUIET },
  },
};

/** the reveal repertoire — selected by `Reveal`'s `variant` prop */
export const fadeUp = fadeRise;
export const fade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.9, ease: EASE_QUIET } },
};
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.9, ease: EASE_EXPRESSIVE },
  },
};
export const maskUp: Variants = {
  hidden: { opacity: 0, y: 30, clipPath: "inset(100% 0 0 0)" },
  visible: {
    opacity: 1,
    y: 0,
    clipPath: "inset(0% 0 0 0)",
    transition: { duration: 1, ease: EASE_INOUT },
  },
};

export const revealVariants = {
  "fade-up": fadeUp,
  fade,
  scale: scaleIn,
  mask: maskUp,
} as const;

export type RevealVariant = keyof typeof revealVariants;

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
