import { useEffect, useRef } from "react";

/**
 * A figure that counts up when scrolled into view. SSR renders the final
 * value (complete, and correct under reduced motion); on first entry into the
 * viewport it runs from zero via requestAnimationFrame. `tabular-nums` keeps
 * the digits from jittering.
 *
 * Uses an IntersectionObserver (not GSAP ScrollTrigger) so the trigger is
 * independent of the Lenis smooth-scroll clock — it fires reliably whether the
 * figure is already on screen at load or scrolled to later.
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

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return; // leave the final value

    let raf = 0;
    let started = false;
    el.textContent = format(0);

    const run = () => {
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / (duration * 1000));
        const eased = 1 - Math.pow(1 - t, 2); // power2.out
        el.textContent = format(eased * to);
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !started) {
            started = true;
            run();
            io.disconnect();
          }
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [to, prefix, suffix, duration]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {format(to)}
    </span>
  );
}
