import { Link } from "react-router";
import { Hero } from "~/components/Hero";
import { CTA, Eyebrow, Ledger, Reveal, Section } from "~/components/primitives";
import { DevelopmentCard } from "~/components/cards";
import { DevelopmentNarrative } from "~/components/DevelopmentNarrative";
import { SplitHeading } from "~/components/SplitHeading";
import { AmeliaBand } from "~/components/AmeliaBand";
import { ReasonsCarousel } from "~/components/ReasonsCarousel";
import { AmenitiesShowcase } from "~/components/AmenitiesShowcase";
import { LocationSection } from "~/components/LocationSection";
import { developments, getDeveloper, getDevelopment, parseSections, renderMarkdown } from "~/lib/content";
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
  const sections = parseSections(d.body);
  const adjacent = developments.filter((x) => x.slug !== d.slug).slice(0, 2);
  // The case carousel never repeats a photograph: unique gallery images only,
  // and never the hero shot (it already owns the top of the page).
  const caseImages = [...new Set(d.gallery.map((s) => s.src))].filter((src) => src !== d.image);

  const facts = [
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
  ];

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

      <Hero plate={d.plate} image={d.image} height="min-h-[74svh]" scrollCue>
        <Eyebrow className="text-dawn">
          <Link to="/developments" className="hover:underline">Developments</Link>
          <span aria-hidden>·</span> {d.district}, {d.city}
        </Eyebrow>
        <SplitHeading as="h1" className="type-display mt-4 max-w-[16ch]" mode="chars">
          {d.title}
        </SplitHeading>
        <p className="type-body-lg mt-6 max-w-[46ch] text-ivory/80">{d.excerpt}</p>
      </Hero>

      {/* ① Overview — information first; the copy carries the width, the
          ledger closes the row (no empty gutter between them) */}
      <Section>
        <div className="grid gap-12 md:grid-cols-12 md:gap-7">
          <div className="md:col-span-8">
            <Reveal>
              <Eyebrow className="text-brass">The Overview</Eyebrow>
              {d.positioning && (
                <h2 className="type-headline mt-5 max-w-[24ch] text-ink">{d.positioning}</h2>
              )}
            </Reveal>
            <Reveal delay={0.08}>
              {d.overview && (
                <p className="type-body-lg mt-7 max-w-[64ch] text-ink/72">{d.overview}</p>
              )}
            </Reveal>
          </div>

          <div className="md:col-span-4 md:col-start-9">
            <Reveal delay={0.1}>
              <Ledger cells={facts} />
              <div className="mt-8">
                <CTA to={`/amelia?ref=development&context=${d.slug}`} kind="line-ink">
                  Register your interest
                </CTA>
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* ② amenities — directly below the overview */}
      <AmenitiesShowcase amenities={d.amenities} plate={d.plate} title={d.title} />

      {/* ③ the case — "Why [development]" reasons carousel, info inside the frames */}
      <ReasonsCarousel
        reasons={d.reasons}
        images={caseImages}
        plate={d.plate}
        title={d.title}
        city={d.city}
        intro={d.positioning}
      />

      {/* ④ the register — editorial chapters, each paired with a gallery image
          (the gallery reads inline here; no separate image slider) */}
      {sections.length > 0 ? (
        <DevelopmentNarrative
          sections={sections}
          gallery={d.gallery}
          plate={d.plate}
          heroImage={d.image}
        />
      ) : (
        <Section>
          <div className="prose-serene" dangerouslySetInnerHTML={{ __html: renderMarkdown(d.body) }} />
        </Section>
      )}

      {/* ④ the developer — trust anchor */}
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

      {/* ⑤ location — map + nearest landmarks */}
      <LocationSection landmarks={d.landmarks} map={d.map} district={d.district} city={d.city} />

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
