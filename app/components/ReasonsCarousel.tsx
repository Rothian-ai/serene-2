import { useRef } from "react";
import { Eyebrow, Plate, Reveal, Section } from "~/components/primitives";
import { SplitHeading } from "~/components/SplitHeading";
import type { PlateKind, Reason } from "~/lib/content";

/**
 * Reasons carousel — the "Why [development]" case, made of cards whose heading
 * and copy are baked *into* the image (per the branded-residence reference).
 *
 * SSR-complete by construction: the layout is a CSS scroll-snap rail, so the
 * prerendered HTML paints every card static — no `enhanced`/`initial` gating,
 * nothing to hydrate. The ← → buttons only nudge `scrollBy`; the reduced-motion
 * rule in app.css turns the smooth scroll into an instant jump.
 */
export function ReasonsCarousel({
  reasons,
  images,
  plate,
  title,
  city,
  intro,
}: {
  reasons: Reason[];
  images: string[];
  plate: PlateKind;
  title: string;
  city: string;
  intro?: string;
}) {
  const rail = useRef<HTMLDivElement>(null);

  if (reasons.length === 0) return null;

  const scroll = (dir: number) => {
    const el = rail.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-reason-card]");
    const step = card ? card.offsetWidth + 16 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <Section>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <Reveal>
          <Eyebrow className="text-brass">The Case</Eyebrow>
          <SplitHeading as="h2" className="type-headline mt-5 max-w-[18ch]">
            {`Why ${city}. Why ${title}.`}
          </SplitHeading>
          {intro && <p className="type-body-lg mt-5 max-w-[52ch] text-ink/72">{intro}</p>}
        </Reveal>

        {reasons.length > 1 && (
          <div className="hidden items-center gap-3 md:flex">
            <button
              type="button"
              onClick={() => scroll(-1)}
              aria-label="Previous"
              className="flex h-11 w-11 cursor-pointer items-center justify-center border border-ink/30 text-ink transition-colors duration-300 hover:border-ink hover:bg-ink/5"
            >
              <span aria-hidden>←</span>
            </button>
            <button
              type="button"
              onClick={() => scroll(1)}
              aria-label="Next"
              className="flex h-11 w-11 cursor-pointer items-center justify-center border border-ink/30 text-ink transition-colors duration-300 hover:border-ink hover:bg-ink/5"
            >
              <span aria-hidden>→</span>
            </button>
          </div>
        )}
      </div>

      {/* the rail — negative margins let cards bleed to the viewport edge on scroll */}
      <div
        ref={rail}
        className="mt-12 -mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 md:-mx-12 md:px-12 lg:-mx-20 lg:px-20 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {reasons.map((r, i) => (
          <article
            key={r.heading}
            data-reason-card
            className="relative aspect-[3/4] w-[80vw] flex-none snap-start overflow-hidden bg-ink text-ivory sm:w-[54vw] md:w-[40vw] lg:w-[24rem]"
          >
            <Plate
              kind={plate}
              image={images.length ? images[i % images.length] : undefined}
              alt={`${title} — ${r.heading}`}
              className="absolute inset-0 h-full w-full"
            />
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(10,21,38,0.9) 0%, rgba(10,21,38,0.62) 30%, rgba(10,21,38,0.18) 58%, transparent 80%)",
              }}
            />
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-7">
              <div className="type-data text-gold/85">{String(i + 1).padStart(2, "0")}</div>
              <h3 className="type-title mt-2.5 max-w-[17ch] text-ivory">{r.heading}</h3>
              <p className="mt-3 max-w-[34ch] text-[15px] leading-relaxed text-ivory/85">{r.body}</p>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
