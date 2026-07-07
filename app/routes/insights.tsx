import { useSearchParams } from "react-router";
import { Link } from "react-router";
import { Eyebrow, Plate, Reveal, Section } from "~/components/primitives";
import { InsightRow } from "~/components/cards";
import { formatDate, insights } from "~/lib/content";
import { meta as buildMeta } from "~/lib/site";

export const handle = { headerTone: "light" as const };

export function meta() {
  return buildMeta({
    title: "Insights",
    description:
      "Market analysis, investment guides, and developer spotlights for UAE off-plan real estate — written to inform, not to sell.",
    path: "/insights",
  });
}

const CATEGORIES = ["All", "Market Analysis", "Investment Guides", "Developer Spotlights", "Journal"] as const;

export default function Insights() {
  const [params, setParams] = useSearchParams();
  const cat = params.get("category") ?? "All";
  const list = insights.filter((i) => cat === "All" || i.category === cat);
  const [featured, ...rest] = list;

  return (
    <>
      <Section className="pt-40">
        <Eyebrow className="text-brass">Insights</Eyebrow>
        <h1 className="type-display mt-6">The journal.</h1>
        <div className="mt-10 flex flex-wrap items-baseline gap-x-7 gap-y-2 border-y border-ink/14 py-3.5">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() =>
                setParams(c === "All" ? {} : { category: c }, { preventScrollReset: true })
              }
              className={`type-data cursor-pointer uppercase tracking-[0.08em] transition-colors ${
                cat === c ? "text-ink" : "text-fog hover:text-ink"
              }`}
              aria-pressed={cat === c}
            >
              {c}
            </button>
          ))}
        </div>
      </Section>

      <Section className="pt-0">
        {featured ? (
          <>
            <Reveal>
              <Link to={`/insights/${featured.slug}`} className="group grid items-end gap-8 md:grid-cols-2">
                <div className="aspect-[16/9] overflow-hidden">
                  <Plate
                    kind={featured.plate}
                    image={featured.image}
                    alt=""
                    className="h-full w-full transition-transform duration-[600ms] group-hover:scale-[1.03]"
                  />
                </div>
                <div>
                  <Eyebrow className="text-brass">
                    {featured.category} · {formatDate(featured.date)}
                  </Eyebrow>
                  <h2 className="type-headline mt-4 group-hover:text-brass">{featured.title}</h2>
                  <p className="type-body-lg mt-4 max-w-[46ch] text-ink/70">{featured.excerpt}</p>
                </div>
              </Link>
            </Reveal>
            <div className="mt-16 hairline-b">
              {rest.map((i) => (
                <InsightRow key={i.slug} insight={i} />
              ))}
            </div>
          </>
        ) : (
          <p className="type-body-lg text-ink/60">The journal opens shortly.</p>
        )}
      </Section>
    </>
  );
}
