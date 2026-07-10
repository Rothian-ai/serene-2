import { useCallback, useState } from "react";
import { Eyebrow, Plate, Reveal, Section } from "~/components/primitives";
import { SplitHeading } from "~/components/SplitHeading";
import { AmenityIcon } from "~/components/AmenityIcon";
import { amenityDetail } from "~/lib/amenities";
import type { Amenity, PlateKind } from "~/lib/content";

/**
 * A World of Amenities — a tab row over a single-panel slider (per the
 * branded-residence reference). Selecting a tab slides the track to that
 * amenity; the copy sits inside the image. One panel is shown at a time, so a
 * tab always moves the carousel — no scroll-clamping dead-ends at the tail.
 *
 * SSR-complete: the track renders at translateX(0) (panel 0) with the copy in
 * the DOM — nothing to hydrate. The transform transition collapses to an
 * instant swap under the reduced-motion rule in app.css.
 */
export function AmenitiesShowcase({
  amenities,
  plate,
  title,
}: {
  amenities: Amenity[];
  plate: PlateKind;
  title: string;
}) {
  const [active, setActive] = useState(0);
  const count = amenities.length;
  const go = useCallback((dir: number) => setActive((a) => (a + dir + count) % count), [count]);

  if (count === 0) return null;

  return (
    <Section>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <Reveal>
          <Eyebrow className="text-brass">Amenities</Eyebrow>
          <SplitHeading as="h2" className="type-headline mt-5 max-w-[16ch]">
            A world of amenities.
          </SplitHeading>
        </Reveal>
        {count > 1 && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous amenity"
              className="flex h-11 w-11 cursor-pointer items-center justify-center border border-ink/25 text-ink transition-colors duration-300 hover:border-ink hover:bg-ink/5"
            >
              <span aria-hidden>←</span>
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next amenity"
              className="flex h-11 w-11 cursor-pointer items-center justify-center border border-ink/25 text-ink transition-colors duration-300 hover:border-ink hover:bg-ink/5"
            >
              <span aria-hidden>→</span>
            </button>
          </div>
        )}
      </div>

      {/* tab row — icon + label, active underlined in brass */}
      <div
        role="tablist"
        aria-label={`${title} — amenities`}
        className="mt-9 flex gap-8 overflow-x-auto border-b border-ink/12 [scrollbar-width:none] md:gap-10 [&::-webkit-scrollbar]:hidden"
      >
        {amenities.map((a, i) => {
          const on = i === active;
          return (
            <button
              key={a.label}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => setActive(i)}
              className={`group flex shrink-0 cursor-pointer flex-col items-center gap-3 border-b-2 pb-4 transition-colors duration-300 ${
                on ? "border-brass text-ink" : "border-transparent text-fog hover:text-ink"
              }`}
            >
              <AmenityIcon
                name={a.icon}
                className={`h-7 w-7 transition-colors ${on ? "text-brass" : "text-fog group-hover:text-ink"}`}
              />
              <span className="type-cap max-w-[12ch] text-center leading-tight">{a.label}</span>
            </button>
          );
        })}
      </div>

      {/* the slider — one featured panel, copy inside the frame */}
      <div className="mt-9 overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
          style={{ transform: `translateX(-${active * 100}%)` }}
        >
          {amenities.map((a, i) => {
            const detail = amenityDetail(a.icon);
            return (
              <div key={a.label} className="w-full flex-none">
                <div className="relative aspect-[4/5] overflow-hidden bg-ink text-ivory sm:aspect-[16/10] lg:aspect-[16/8]">
                  <Plate
                    kind={plate}
                    image={detail.image}
                    alt={`${a.label} — ${title}`}
                    eager
                    className="absolute inset-0 h-full w-full"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(10,21,38,0.82) 0%, rgba(10,21,38,0.32) 42%, transparent 72%)",
                    }}
                  />
                  <div className="absolute inset-x-0 bottom-0 max-w-[52ch] p-6 md:p-10">
                    <h3 className="type-headline text-ivory">{a.label}</h3>
                    <p className="type-body-lg mt-3 text-ivory/82">{detail.blurb}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
