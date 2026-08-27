import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Eyebrow, QuietLink, Reveal } from "~/components/primitives";
import { InsightCard } from "~/components/cards";
import type { Insight } from "~/lib/content";

/**
 * The journal as a scrollable rail rather than a grid of three.
 *
 * Native scroll with snap points does the work: it is touch and trackpad
 * native, needs no JS to function, and degrades to an ordinary scrollable row
 * if the script never runs. The buttons exist because a mouse user on a desktop
 * has no swipe, and they scroll by exactly one card so the snap always lands
 * cleanly.
 *
 * Full-bleed on purpose. The rail starts at the container's left edge but runs
 * off the right, so the cut-off card is the affordance — a rail that ends
 * neatly inside the margin looks like a grid that happens to be short.
 *
 * Under prefers-reduced-motion the scroll jumps instead of animating; the
 * arrows still work, they just do not glide.
 */
export function InsightCarousel({ insights }: { insights: Insight[] }) {
  const railRef = useRef<HTMLUListElement>(null);
  const reduced = useReducedMotion();
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  /** Which arrows are live. Recomputed on scroll and on resize. */
  const measure = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 2);
    // a fractional scrollWidth can leave a pixel behind, hence the tolerance
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2);
  }, []);

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    measure();
    el.addEventListener("scroll", measure, { passive: true });
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", measure);
      ro.disconnect();
    };
  }, [measure]);

  const step = (dir: 1 | -1) => {
    const el = railRef.current;
    if (!el) return;
    // one card, measured rather than assumed, so it stays right at every width
    const card = el.querySelector("li");
    const by = card ? card.getBoundingClientRect().width + 28 : el.clientWidth * 0.8;
    el.scrollBy({ left: by * dir, behavior: reduced ? "auto" : "smooth" });
  };

  const arrow =
    "flex h-11 w-11 items-center justify-center border border-ink/25 text-ink transition-colors duration-300 hover:border-ink hover:bg-frost disabled:pointer-events-none disabled:border-ink/12 disabled:text-ink/25";

  return (
    <section className="py-12 md:py-18">
      <div className="container-site">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
          <Reveal exit>
            <Eyebrow className="text-fog">Insights</Eyebrow>
          </Reveal>
          <div className="flex items-center gap-4">
            <QuietLink to="/insights">All Insights</QuietLink>
            {/* aria-hidden: the rail is scrollable and every card is a link, so
                these are a pointer convenience, not the only way through */}
            <div aria-hidden className="hidden gap-2 md:flex">
              <button type="button" className={arrow} onClick={() => step(-1)} disabled={atStart} tabIndex={-1}>
                ←
              </button>
              <button type="button" className={arrow} onClick={() => step(1)} disabled={atEnd} tabIndex={-1}>
                →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* the rail: padded to the container on the left, running off on the right */}
      <ul
        ref={railRef}
        className="rail mt-11 flex snap-x snap-mandatory gap-7 overflow-x-auto overflow-y-hidden pb-3"
      >
        {insights.map((i) => (
          <li
            key={i.slug}
            className="w-[78vw] shrink-0 snap-start sm:w-[46vw] lg:w-[30vw] xl:w-[27rem]"
          >
            <InsightCard insight={i} />
          </li>
        ))}
        {/* a tail spacer, so the last card can snap flush to the left gutter */}
        <li aria-hidden className="w-px shrink-0" />
      </ul>
    </section>
  );
}
