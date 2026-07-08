import { createElement, useRef } from "react";
import { gsap, SplitText, useGsapContext } from "~/lib/gsap";

/**
 * A heading that reveals itself on scroll-in — masked lines rising, with an
 * optional character-level stagger for the maximal moments. GSAP owns it.
 *
 * SSR renders a plain, complete heading; the split + reveal are a post-mount
 * enhancement, and under reduced motion the heading simply stays put. Pass a
 * plain string as children (SplitText needs real text, not nested elements).
 */
export function SplitHeading({
  as = "h2",
  className,
  children,
  mode = "lines",
  start = "top 84%",
}: {
  as?: "h1" | "h2" | "h3";
  className?: string;
  children: string;
  /** "lines" — masked line rise; "chars" — per-character rise within masked lines */
  mode?: "lines" | "chars";
  start?: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGsapContext(
    ref,
    () => {
      const split = new SplitText(ref.current, {
        type: mode === "chars" ? "lines,chars" : "lines",
        mask: "lines",
        linesClass: "split-line",
      });
      const targets = mode === "chars" ? split.chars : split.lines;
      gsap.from(targets, {
        yPercent: 116,
        autoAlpha: 0,
        rotateX: mode === "chars" ? -38 : 0,
        transformOrigin: "50% 100%",
        duration: mode === "chars" ? 0.9 : 1,
        ease: "power3.out",
        stagger: mode === "chars" ? 0.014 : 0.12,
        scrollTrigger: { trigger: ref.current, start, once: true },
      });
      return () => split.revert();
    },
    [children],
  );

  return createElement(as, { ref, className }, children);
}
