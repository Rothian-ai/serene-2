import { useRef } from "react";
import { Link } from "react-router";
import { Eyebrow, Ledger, Plate, Reveal } from "~/components/primitives";
import type { Development } from "~/lib/content";
import { getDeveloper } from "~/lib/content";

/**
 * Horizontal showcase — the developments register as a plain editorial
 * slider. No pin, no scroll hijack: a CSS scroll-snap rail the visitor moves
 * on their own terms (swipe, trackpad, or the ← → controls). SSR-complete by
 * construction — the prerendered HTML paints every panel static.
 */

function Panel({ development, index }: { development: Development; index: number }) {
  const dev = getDeveloper(development.developer);
  return (
    <Link
      to={`/developments/${development.slug}`}
      data-showcase-panel
      className="group flex w-[80vw] flex-none snap-start flex-col sm:w-[54vw] lg:w-[34vw] xl:w-[30rem]"
    >
      <div className="relative h-[52vh] max-h-[560px] overflow-hidden">
        <Plate
          kind={development.plate}
          image={development.image}
          alt={development.title}
          className="h-full w-full transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
        />
        <div
          aria-hidden
          className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-70"
          style={{ background: "linear-gradient(to top, rgba(10,21,38,0.62), transparent 58%)" }}
        />
        <span className="type-data absolute left-4 top-4 text-ivory/70">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="absolute inset-x-4 bottom-4 translate-y-1 transition-transform duration-500 group-hover:translate-y-0">
          <div className="type-eyebrow text-gold">
            {development.district}, {development.city}
          </div>
          <h3 className="type-title mt-2 text-ivory">{development.title}</h3>
        </div>
      </div>
      <Ledger
        className="mt-4"
        cells={[
          { k: "Developer", v: dev?.name ?? development.developer },
          { k: "Handover", v: development.handover },
          { k: "From", v: development.priceFrom },
        ]}
      />
      <span className="mt-4 inline-flex items-center gap-2 border-b border-gold pb-1.5 text-[12px] font-semibold uppercase tracking-[0.1em] text-ink">
        Discover
        <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
      </span>
    </Link>
  );
}

export function HorizontalShowcase({ developments }: { developments: Development[] }) {
  const rail = useRef<HTMLDivElement>(null);

  const scroll = (dir: number) => {
    const el = rail.current;
    if (!el) return;
    const panel = el.querySelector<HTMLElement>("[data-showcase-panel]");
    const step = panel ? panel.offsetWidth + 32 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <section className="py-12 md:py-18">
      <div className="container-site">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <Eyebrow className="text-brass">Current Developments</Eyebrow>
            <div className="hidden items-center gap-3 md:flex">
              <button
                type="button"
                onClick={() => scroll(-1)}
                aria-label="Previous developments"
                className="flex h-11 w-11 cursor-pointer items-center justify-center border border-ink/30 text-ink transition-colors duration-300 hover:border-ink hover:bg-ink/5"
              >
                <span aria-hidden>←</span>
              </button>
              <button
                type="button"
                onClick={() => scroll(1)}
                aria-label="Next developments"
                className="flex h-11 w-11 cursor-pointer items-center justify-center border border-ink/30 text-ink transition-colors duration-300 hover:border-ink hover:bg-ink/5"
              >
                <span aria-hidden>→</span>
              </button>
            </div>
          </div>
        </Reveal>

        {/* the rail — negative margins let panels bleed to the viewport edge.
            Snap is proximity, not mandatory: mandatory snap cancels the
            buttons' smooth scrollBy in Chrome; proximity still settles swipes. */}
        <div
          ref={rail}
          className="-mx-6 mt-10 flex snap-x snap-proximity gap-8 overflow-x-auto scroll-pl-6 px-6 pb-2 md:-mx-12 md:scroll-pl-12 md:px-12 lg:-mx-20 lg:scroll-pl-20 lg:px-20 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {developments.map((d, i) => (
            <Panel key={d.slug} development={d} index={i} />
          ))}
          <Link
            to="/developments"
            className="group flex w-[70vw] flex-none snap-start flex-col justify-center sm:w-[40vw] lg:w-[24vw]"
          >
            <h3 className="type-headline max-w-[10ch]">The full register.</h3>
            <span className="mt-6 inline-flex items-center gap-2.5 border-b border-gold pb-1.5 text-[12.5px] font-semibold uppercase tracking-[0.1em]">
              All Developments
              <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
