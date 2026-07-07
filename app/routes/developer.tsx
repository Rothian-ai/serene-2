import { Eyebrow, Ledger, Reveal, Section } from "~/components/primitives";
import { Hero } from "~/components/Hero";
import { DevelopmentCard } from "~/components/cards";
import { AmeliaBand } from "~/components/AmeliaBand";
import { developmentsByDeveloper, getDeveloper, renderMarkdown } from "~/lib/content";
import { meta as buildMeta } from "~/lib/site";
import type { Route } from "./+types/developer";

export const handle = { headerTone: "dark" as const };

export function meta({ params }: Route.MetaArgs) {
  const dev = getDeveloper(params.slug);
  if (!dev) return buildMeta({ title: "Developer", description: "Registered developer profile." });
  return buildMeta({
    title: dev.name,
    description: `${dev.name} — registered Serene developer. Founded ${dev.founded}; ${dev.delivered} delivered. ${dev.tagline}`,
    path: `/developers/${dev.slug}`,
  });
}

export default function DeveloperProfile({ params }: Route.ComponentProps) {
  const dev = getDeveloper(params.slug);
  if (!dev) throw new Response("Not Found", { status: 404 });
  const theirs = developmentsByDeveloper(dev.slug);

  return (
    <>
      <Hero plate={dev.plate} image={dev.image} height="min-h-[54svh]" direction="identity · signature elevation">
        <Eyebrow className="text-dawn">Registered Developer</Eyebrow>
        <h1 className="type-display mt-4">{dev.name}</h1>
        <p className="type-body-lg mt-4 max-w-[44ch] text-ivory/80">{dev.tagline}</p>
      </Hero>

      <div className="mx-auto max-w-[1440px] px-6 md:px-12 lg:px-20">
        <Ledger
          className="!border-t-0 py-5"
          cells={[
            { k: "Founded", v: dev.founded },
            { k: "Headquarters", v: dev.hq },
            { k: "Delivered", v: dev.delivered },
            { k: "Notable", v: dev.notable.join(" · ") },
          ]}
        />
      </div>

      <Section>
        <div className="grid gap-10 md:grid-cols-12">
          <Reveal className="md:col-span-6 md:col-start-2">
            <div
              className="prose-serene"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(dev.body) }}
            />
          </Reveal>
        </div>
      </Section>

      {theirs.length > 0 && (
        <Section className="pt-0">
          <Eyebrow className="text-brass">With Serene</Eyebrow>
          <div className="mt-8 grid gap-10 md:grid-cols-2">
            {theirs.map((d) => (
              <DevelopmentCard key={d.slug} development={d} compact />
            ))}
          </div>
        </Section>
      )}

      <AmeliaBand
        title={`Ask Amelia about ${dev.name}'s delivery record.`}
        cta="Ask Amelia"
        refId="developer"
        context={dev.slug}
      />
    </>
  );
}
