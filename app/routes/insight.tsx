import { useEffect } from "react";
import { Eyebrow, Plate, Section } from "~/components/primitives";
import { SplitHeading } from "~/components/SplitHeading";
import { InsightRow } from "~/components/cards";
import { AmeliaBand } from "~/components/AmeliaBand";
import { formatDate, getInsight, insights, renderMarkdown } from "~/lib/content";
import { track } from "~/lib/analytics";
import { SITE, meta as buildMeta } from "~/lib/site";
import type { Route } from "./+types/insight";

export const handle = { headerTone: "light" as const };

export function meta({ params }: Route.MetaArgs) {
  const a = getInsight(params.slug);
  if (!a) return buildMeta({ title: "Insight", description: "Serene insight." });
  return buildMeta({ title: a.title, description: a.excerpt, path: `/insights/${a.slug}` });
}

export default function Insight({ params }: Route.ComponentProps) {
  const a = getInsight(params.slug);
  if (!a) throw new Response("Not Found", { status: 404 });
  const related = insights.filter((x) => x.slug !== a.slug).slice(0, 2);

  useEffect(() => {
    track("insight_read", { slug: a.slug });
  }, [a.slug]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: a.title,
            datePublished: a.date,
            author: { "@type": "Organization", name: "Serene Research" },
            publisher: { "@type": "Organization", name: SITE.name },
          }),
        }}
      />

      <Section className="pt-44 pb-10 text-center">
        <Eyebrow className="justify-center text-brass">
          {a.category} · {formatDate(a.date)} · {a.readingTime}
        </Eyebrow>
        <SplitHeading as="h1" className="type-display mx-auto mt-6 max-w-[22ch]">
          {a.title}
        </SplitHeading>
      </Section>

      <div className="container-site">
        <Plate kind={a.plate} image={a.image} alt="" className="aspect-[21/9]" parallax />
      </div>

      <Section>
        <div
          className="prose-serene mx-auto"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(a.body) }}
        />
        <div className="mx-auto mt-14 max-w-[65ch] border-t border-ink/14 pt-4">
          <span className="type-data text-fog">SERENE RESEARCH · {formatDate(a.date)}</span>
        </div>
      </Section>

      {related.length > 0 && (
        <Section className="pt-0">
          <Eyebrow className="text-brass">Related</Eyebrow>
          <div className="mt-6 hairline-b">
            {related.map((r) => (
              <InsightRow key={r.slug} insight={r} />
            ))}
          </div>
        </Section>
      )}

      <AmeliaBand
        title="Put the analysis to work on your own shortlist."
        refId="insight"
        context={a.slug}
      />
    </>
  );
}
