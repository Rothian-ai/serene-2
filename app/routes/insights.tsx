import { useSearchParams } from "react-router";
import { Link } from "react-router";
import { Eyebrow, Plate, Reveal, Section } from "~/components/primitives";
import { formatDate, insights } from "~/lib/content";
import { meta as buildMeta } from "~/lib/site";

export const handle = { headerTone: "light" as const };

export function meta() {
  return buildMeta({
    title: "Insights",
    description:
      "Market analysis, investment guides, and developer spotlights for UAE off-plan real estate, written to inform, not to sell.",
    path: "/insights",
  });
}

const CATEGORIES = ["All", "Market Analysis", "Investment Guides", "Developer Spotlights", "Journal"] as const;

export default function Insights() {
  const [params, setParams] = useSearchParams();
  const cat = params.get("category") ?? "All";
  const list = insights.filter((i) => cat === "All" || i.category === cat);

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

      {/* the articles — alternating editorial rows, image opposite the words */}
      <Section className="pt-0">
        {list.length > 0 ? (
          <div className="flex flex-col gap-20 md:gap-28">
            {list.map((a, i) => {
              const flip = i % 2 === 1;
              return (
                <Reveal key={a.slug}>
                  <article className="grid items-center gap-8 md:grid-cols-12 md:gap-7">
                    <div className={`md:col-span-5 ${flip ? "md:order-2 md:col-start-8" : ""}`}>
                      <Eyebrow className="text-brass">
                        {a.category} · {formatDate(a.date)}
                      </Eyebrow>
                      <h2 className="type-headline mt-5">
                        <Link
                          to={`/insights/${a.slug}`}
                          className="transition-colors duration-300 hover:text-brass"
                        >
                          {a.title}
                        </Link>
                      </h2>
                      <p className="type-body-lg mt-5 max-w-[48ch] text-ink/70">{a.excerpt}</p>
                      <div className="mt-8">
                        <Link
                          to={`/insights/${a.slug}`}
                          className="inline-block border border-ink/35 px-8 py-[13px] text-[12px] font-semibold uppercase tracking-[0.1em] text-ink transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-ivory"
                        >
                          Read the article
                        </Link>
                      </div>
                    </div>
                    <Link
                      to={`/insights/${a.slug}`}
                      className={`group block md:col-span-6 ${flip ? "md:order-1 md:col-start-1" : "md:col-start-7"}`}
                    >
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <Plate
                          kind={a.plate}
                          image={a.image}
                          alt=""
                          className="h-full w-full transition-transform duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
                        />
                      </div>
                      <p className="type-cap mt-3 text-fog">{a.readingTime}</p>
                    </Link>
                  </article>
                </Reveal>
              );
            })}
          </div>
        ) : (
          <p className="type-body-lg text-ink/60">The journal opens shortly.</p>
        )}
      </Section>
    </>
  );
}
