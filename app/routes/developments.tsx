import { useSearchParams } from "react-router";
import { Eyebrow, Reveal, Section } from "~/components/primitives";
import { Hero } from "~/components/Hero";
import { SplitHeading } from "~/components/SplitHeading";
import { DevelopmentCard } from "~/components/cards";
import { AmeliaBand } from "~/components/AmeliaBand";
import { developments } from "~/lib/content";
import { meta as buildMeta } from "~/lib/site";

export const handle = { headerTone: "dark" as const };

export function meta() {
  return buildMeta({
    title: "Developments",
    description:
      "Off-plan developments in Dubai and Abu Dhabi, presented with the facts investors scan first: developer, handover, payment plan, price.",
    path: "/developments",
  });
}

const CITIES = ["All", "Dubai", "Abu Dhabi"] as const;

export default function Developments() {
  const [params, setParams] = useSearchParams();
  const city = params.get("city") ?? "All";
  const list = developments.filter((d) => city === "All" || d.city === city);

  return (
    <>
      <Hero plate="dusk" image="/images/saadiyat-grove.jpg" height="min-h-[64svh]">
        <Eyebrow className="text-gold">Developments</Eyebrow>
        <SplitHeading as="h1" mode="chars" className="type-display mt-5 max-w-[16ch]">
          Off-plan, considered.
        </SplitHeading>
        <p className="type-body-lg mt-6 max-w-[52ch] text-ivory/75">
          A short register of developments in Dubai and Abu Dhabi — each anchored to a developer we
          are registered with, each presented with the facts investors scan first: developer,
          handover, payment plan, price.
        </p>
      </Hero>

      {/* filter — sticks just below the header as you scroll into the register */}
      <div className="sticky top-[68px] z-30 border-y border-ink/12 bg-ivory/92 backdrop-blur-[3px]">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-baseline gap-7 px-6 py-4 md:px-12 lg:px-20">
          {CITIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setParams(c === "All" ? {} : { city: c }, { preventScrollReset: true })}
              className={`type-data cursor-pointer uppercase tracking-[0.08em] transition-colors ${
                city === c ? "text-ink" : "text-fog hover:text-ink"
              }`}
              aria-pressed={city === c}
            >
              {c}
            </button>
          ))}
          <span className="type-data ml-auto text-fog">{list.length} projects</span>
        </div>
      </div>

      <Section className="pt-14">
        <div className="flex flex-col gap-20">
          {list.map((d, i) => {
            const wide = i % 3 === 2;
            const flip = i % 2 === 1;
            if (wide) {
              return (
                <Reveal key={d.slug}>
                  <DevelopmentCard development={d} aspect="aspect-[21/9]" />
                </Reveal>
              );
            }
            return (
              <Reveal key={d.slug}>
                <div className={`grid items-end gap-8 md:grid-cols-12`}>
                  <div className={`md:col-span-7 ${flip ? "md:order-2 md:col-start-6" : ""}`}>
                    <DevelopmentCard development={d} />
                  </div>
                  <p
                    className={`type-body-lg hidden max-w-[36ch] text-ink/65 md:col-span-4 md:block ${
                      flip ? "md:order-1 md:col-start-1" : "md:col-start-9"
                    }`}
                  >
                    {d.excerpt}
                  </p>
                </div>
              </Reveal>
            );
          })}
          {list.length === 0 && (
            <p className="type-body-lg text-ink/60">
              No developments in this market at present. The registry grows steadily — ask Amelia
              what is coming.
            </p>
          )}
        </div>
      </Section>

      <AmeliaBand
        title="Yields, payment plans, districts — compare them properly."
        refId="developments-index"
      />
    </>
  );
}
