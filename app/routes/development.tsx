import { Link } from "react-router";
import { Hero } from "~/components/Hero";
import { CTA, Eyebrow, Ledger, Plate, Reveal, Section } from "~/components/primitives";
import { DevelopmentCard } from "~/components/cards";
import { AmeliaBand } from "~/components/AmeliaBand";
import { developments, getDeveloper, getDevelopment, renderMarkdown } from "~/lib/content";
import { SITE, meta as buildMeta } from "~/lib/site";
import type { Route } from "./+types/development";

export const handle = { headerTone: "dark" as const };

export function meta({ params }: Route.MetaArgs) {
  const d = getDevelopment(params.slug);
  if (!d) return buildMeta({ title: "Development", description: "Off-plan development." });
  return buildMeta({
    title: d.title,
    description: `${d.title} — ${d.district}, ${d.city}. Off-plan by ${getDeveloper(d.developer)?.name ?? d.developer}; handover ${d.handover}, from ${d.priceFrom}.`,
    path: `/developments/${d.slug}`,
  });
}

export default function Development({ params }: Route.ComponentProps) {
  const d = getDevelopment(params.slug);
  if (!d) {
    throw new Response("Not Found", { status: 404 });
  }
  const dev = getDeveloper(d.developer);
  const adjacent = developments.filter((x) => x.slug !== d.slug).slice(0, 2);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Residence",
            name: d.title,
            address: { "@type": "PostalAddress", addressLocality: d.district, addressRegion: d.city, addressCountry: "AE" },
            url: `${SITE.url}/developments/${d.slug}`,
          }),
        }}
      />

      <Hero plate={d.plate} image={d.image} height="min-h-[66svh]">
        <Eyebrow className="text-dawn">
          <Link to="/developments" className="hover:underline">Developments</Link>
          <span aria-hidden>·</span> {d.district}, {d.city}
        </Eyebrow>
        <h1 className="type-display mt-4">{d.title}</h1>
      </Hero>

      {/* the fact bar — what investors scan first */}
      <div className="mx-auto max-w-[1440px] px-6 md:px-12 lg:px-20">
        <Ledger
          className="!border-t-0 py-5"
          cells={[
            {
              k: "Developer",
              v: dev ? (
                <Link to={`/developers/${dev.slug}`} className="text-brass hover:underline">
                  {dev.name} ↗
                </Link>
              ) : (
                d.developer
              ),
            },
            { k: "Status", v: d.status },
            { k: "Handover", v: d.handover },
            { k: "Payment plan", v: d.paymentPlan },
            { k: "From", v: d.priceFrom },
          ]}
        />
      </div>

      {/* editorial narrative from markdown */}
      <Section>
        <div className="grid gap-10 md:grid-cols-12">
          <Reveal className="md:col-span-6 md:col-start-2">
            <div
              className="prose-serene"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(d.body) }}
            />
          </Reveal>
          <Reveal delay={0.15} className="md:col-span-4 md:col-start-9 md:mt-24">
            <Plate
              kind="interior"
              image="/images/ins-sequence.jpg"
              alt="Interior in natural light, timber and warm stone"
              className="aspect-[4/5]"
              parallax
            />
            <p className="type-cap mt-3 text-fog">Interior direction — window light, natural materials.</p>
          </Reveal>
        </div>
      </Section>

      {/* the developer — trust anchor */}
      {dev && (
        <div className="bg-ink text-ivory">
          <Section tight>
            <div className="grid items-center gap-8 md:grid-cols-12">
              <div className="md:col-span-8">
                <Eyebrow className="text-gold">The Developer</Eyebrow>
                <h2 className="type-headline mt-3">{dev.name}</h2>
                <Ledger
                  dark
                  className="mt-5"
                  cells={[
                    { k: "Founded", v: dev.founded },
                    { k: "Delivered", v: dev.delivered },
                    { k: "Notable", v: dev.notable.join(" · ") },
                  ]}
                />
              </div>
              <div className="md:col-span-3 md:col-start-10 md:text-right">
                <CTA to={`/developers/${dev.slug}`} kind="line">View profile →</CTA>
              </div>
            </div>
          </Section>
        </div>
      )}

      <AmeliaBand
        title="Payment plans, projected yields, escrow — ask."
        cta={`Ask Amelia about ${d.title}`}
        refId="development"
        context={d.slug}
      />

      {/* adjacent — max two */}
      {adjacent.length > 0 && (
        <Section tight>
          <div className="grid gap-10 md:grid-cols-2">
            {adjacent.map((a) => (
              <DevelopmentCard key={a.slug} development={a} compact />
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
