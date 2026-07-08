import { useEffect, useLayoutEffect, useRef } from "react";
import type { DependencyList, RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

/**
 * GSAP foundation for the cinematic layer.
 *
 * GSAP + ScrollTrigger own the heavy scroll-driven work (pins, scrubs,
 * split-text); Framer Motion stays for lightweight component animation.
 * Plugins register once, client-only. Lenis drives the document scroll
 * directly (no wrapper), so ScrollTrigger's default `window` scroller works
 * with no scrollerProxy — the wiring lives in `root.tsx`.
 */

let registered = false;
export function registerGsap() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger, SplitText);
  registered = true;
}
registerGsap();

export { gsap, ScrollTrigger, SplitText };

/** SSR-safe layout effect — falls back to useEffect on the server. */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Scope a GSAP setup function to a container ref. The callback runs inside a
 * `gsap.context()` (so every tween/ScrollTrigger it creates is reverted on
 * cleanup), only on the client, and only when motion is allowed. Return a
 * cleanup fn from `fn` for anything GSAP can't revert (e.g. SplitText).
 *
 * The container's `gsap.context` also enables `matchMedia` inside `fn` for
 * responsive/reduced-motion branching.
 */
export function useGsapContext(
  ref: RefObject<HTMLElement | null>,
  fn: (ctx: {
    self: gsap.Context;
    mm: gsap.MatchMedia;
  }) => void | (() => void),
  deps: DependencyList = [],
) {
  useIsomorphicLayoutEffect(() => {
    if (prefersReducedMotion() || !ref.current) return;
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {}, ref);
    let userCleanup: void | (() => void);
    ctx.add(() => {
      userCleanup = fn({ self: ctx, mm });
    });
    return () => {
      userCleanup?.();
      mm.revert();
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/** Media query strings for consistent matchMedia branching. */
export const MQ = {
  desktop: "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
  motion: "(prefers-reduced-motion: no-preference)",
} as const;

/** Keep a stable ref without re-running effects. */
export function useLatest<T>(value: T) {
  const ref = useRef(value);
  ref.current = value;
  return ref;
}
