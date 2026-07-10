import { useSearchParams } from "react-router";
import { Eyebrow, Reveal, RevealGroup, RevealItem, Section } from "~/components/primitives";
import { Hero } from "~/components/Hero";
import { SplitHeading } from "~/components/SplitHeading";
import { DevelopmentGridCard } from "~/components/cards";
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

      {/* filter — pins below the header, and rises to the top edge in step
          with the bar's own hide/show transition (via --header-offset) */}
      <div className="sticky top-[var(--header-offset)] z-30 border-y border-ink/12 bg-ivory/92 backdrop-blur-[3px] transition-[top] duration-500">
        <div className="container-site flex flex-wrap items-baseline gap-7 py-4">
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
        <Reveal>
          <SplitHeading as="h2" className="type-headline max-w-[18ch]">
            The register, kept current.
          </SplitHeading>
          <p className="type-body-lg mt-4 max-w-[52ch] text-ink/65">
            Each development, presented plainly — and answerable in full the moment you ask.
          </p>
        </Reveal>
        {list.length > 0 ? (
          <RevealGroup className="mt-12 grid gap-x-7 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((d) => (
              <RevealItem key={d.slug} className="flex">
                <DevelopmentGridCard development={d} />
              </RevealItem>
            ))}
          </RevealGroup>
        ) : (
          <p className="type-body-lg mt-12 text-ink/60">
            No developments in this market at present. The registry grows steadily — ask Amelia
            what is coming.
          </p>
        )}
      </Section>

      <AmeliaBand
        title="Yields, payment plans, districts — compare them properly."
        refId="developments-index"
      />
    </>
  );
}
