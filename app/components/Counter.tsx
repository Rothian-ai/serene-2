import { useRef } from "react";
import { gsap, useGsapContext } from "~/lib/gsap";

/**
 * A figure that counts up when scrolled into view. SSR renders the final
 * value (complete, and correct under reduced motion); on scroll-in GSAP
 * runs it from zero. `tabular-nums` keeps the digits from jittering.
 */
export function Counter({
  to,
  prefix = "",
  suffix = "",
  duration = 1.9,
  className = "",
}: {
  to: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const format = (n: number) => `${prefix}${Math.round(n).toLocaleString("en-US")}${suffix}`;

  useGsapContext(
    ref,
    () => {
      const el = ref.current!;
      const obj = { v: 0 };
      const tween = gsap.to(obj, {
        v: to,
        duration,
        ease: "power2.out",
        onUpdate: () => { el.textContent = format(obj.v); },
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
      return () => tween.kill();
    },
    [to],
  );

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {format(to)}
    </span>
  );
}
