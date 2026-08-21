import { Eyebrow, Ledger, Reveal, RevealGroup, RevealItem, Section } from "~/components/primitives";
import { Hero } from "~/components/Hero";
import { SplitHeading } from "~/components/SplitHeading";
import { DevelopmentCard } from "~/components/cards";
import { BrandMark } from "~/components/CollaborationsBand";
import { AmeliaBand } from "~/components/AmeliaBand";
import { developmentsByDeveloper, getDeveloper, renderMarkdown } from "~/lib/content";
import { SITE, meta as buildMeta } from "~/lib/site";
import type { Route } from "./+types/developer";

export const handle = { headerTone: "dark" as const };

export function meta({ params }: Route.MetaArgs) {
  const dev = getDeveloper(params.slug);
  if (!dev) return buildMeta({ title: "Developer", description: "Registered developer profile." });
  return buildMeta({
    title: dev.name,
    description: `${dev.name}: a developer ${SITE.name} is registered with. Founded ${dev.founded}; ${dev.delivered} delivered. ${dev.tagline}`,
    path: `/developers/${dev.slug}`,
  });
}

export default function DeveloperProfile({ params }: Route.ComponentProps) {
  const dev = getDeveloper(params.slug);
  if (!dev) throw new Response("Not Found", { status: 404 });
  const theirs = developmentsByDeveloper(dev.slug);

  const record = [
    { k: "Founded", v: dev.founded },
    { k: "Headquarters", v: dev.hq },
    { k: "Delivered", v: dev.delivered },
  ];

  return (
    <>
      <Hero plate={dev.plate} image={dev.image} height="min-h-[100svh]" scrollCue>
        <Eyebrow className="text-silver">Registered Developer</Eyebrow>
        <SplitHeading as="h1" className="type-display-xl mt-4" mode="chars">
          {dev.name}
        </SplitHeading>
        <p className="type-body-lg mt-6 max-w-[44ch] text-ivory/80">{dev.tagline}</p>
      </Hero>

      {/* ① The record — the institution's facts set large beside the house prose,
          so neither floats alone in whitespace */}
      <Section>
        <div className="grid gap-12 md:grid-cols-12 md:gap-7">
          <div className="md:col-span-4">
            <Reveal>
              <BrandMark slug={dev.slug} name={dev.name} />
              <dl className="mt-10 flex flex-col">
                {record.map((f) => (
                  <div key={f.k} className="border-t border-ink/14 py-5">
                    <dt className="text-[10.5px] font-semibold uppercase tracking-[0.13em] text-fog">
                      {f.k}
                    </dt>
                    <dd className="type-title mt-1.5">{f.v}</dd>
                  </div>
                ))}
                {dev.notable.length > 0 && (
                  <div className="border-t border-ink/14 py-5">
                    <dt className="text-[10.5px] font-semibold uppercase tracking-[0.13em] text-fog">
                      Notable works
                    </dt>
                    <dd className="mt-2 flex flex-col gap-1.5">
                      {dev.notable.map((n) => (
                        <span key={n} className="type-data">{n}</span>
                      ))}
                    </dd>
                  </div>
                )}
              </dl>
            </Reveal>
          </div>

          <div className="md:col-span-7 md:col-start-6">
            <Reveal delay={0.1}>
              <Eyebrow className="text-fog">The House</Eyebrow>
              <div
                className="prose-serene mt-7"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(dev.body) }}
              />
            </Reveal>
          </div>
        </div>
      </Section>

      {/* ② the addresses they carry in the register */}
      {theirs.length > 0 && (
        <Section className="pt-0">
          <Reveal>
            <Eyebrow className="text-fog">With {SITE.name}</Eyebrow>
            <SplitHeading as="h2" className="type-headline mt-5 max-w-[24ch]">
              {theirs.length === 1
                ? `One address in the register.`
                : `${theirs.length} addresses in the register.`}
            </SplitHeading>
          </Reveal>
          {theirs.length === 1 ? (
            <Reveal className="mt-10">
              <DevelopmentCard development={theirs[0]} aspect="aspect-[21/9]" />
            </Reveal>
          ) : (
            <RevealGroup className="mt-10 grid gap-x-7 gap-y-12 md:grid-cols-2">
              {theirs.map((d) => (
                <RevealItem key={d.slug}>
                  <DevelopmentCard development={d} />
                </RevealItem>
              ))}
            </RevealGroup>
          )}
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
