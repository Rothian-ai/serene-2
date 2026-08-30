import { Eyebrow, QuietLink, Reveal, Section } from "~/components/primitives";
import { Hero } from "~/components/Hero";
import { SplitHeading } from "~/components/SplitHeading";
import { BrandMark } from "~/components/BrandMark";
import { ConversationBand } from "~/components/ConversationBand";
import { getDeveloper, renderMarkdown } from "~/lib/content";
import { REGISTER_INTRO } from "~/lib/strategy";
import { meta as buildMeta } from "~/lib/site";
import type { Route } from "./+types/developers.$slug";

export const handle = { headerTone: "dark" as const };

export function meta({ params }: Route.MetaArgs) {
  const dev = getDeveloper(params.slug);
  if (!dev) return buildMeta({ title: "Developer", description: "A registered developer." });
  return buildMeta({
    title: dev.name,
    description: [
      dev.name,
      dev.founded ? `founded ${dev.founded}` : null,
      dev.delivered ? `${dev.delivered} delivered` : null,
      dev.hq ? `headquartered in ${dev.hq}` : null,
    ]
      .filter(Boolean)
      .join(", ") + (dev.tagline ? `. ${dev.tagline}` : "."),
    path: `/developers/${dev.slug}`,
  });
}

export default function DeveloperProfile({ params }: Route.ComponentProps) {
  const dev = getDeveloper(params.slug);
  if (!dev) throw new Response("Not Found", { status: 404 });

  const record = [
    { k: "Founded", v: dev.founded },
    { k: "Headquarters", v: dev.hq },
    { k: "Delivered", v: dev.delivered },
  ].filter((f): f is { k: string; v: string } => Boolean(f.v));

  return (
    <>
      <Hero plate={dev.plate} image={dev.image} height="min-h-[70svh]">
        <Eyebrow className="text-silver">Registered developer</Eyebrow>
        <SplitHeading as="h1" mode="chars" className="type-display mt-5">
          {dev.name}
        </SplitHeading>
        {dev.tagline && (
          <p className="type-body-lg mt-6 max-w-[46ch] text-ivory/80">{dev.tagline}</p>
        )}
      </Hero>

      {/* Every developer has a page; a fuller record simply makes a longer one.
          With nothing on file this is the mark, how the register is selected and
          the way to ask — brief, but true, and it grows the moment a profile is
          written for it. */}
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
                        <span key={n} className="type-data">
                          {n}
                        </span>
                      ))}
                    </dd>
                  </div>
                )}
              </dl>
            </Reveal>
          </div>

          <div className="md:col-span-7 md:col-start-6">
            <Reveal delay={0.1}>
              <Eyebrow className="text-fog">
                {dev.body.trim() ? "The house" : "In the register"}
              </Eyebrow>
              {dev.body.trim() ? (
                <div
                  className="prose-serene mt-7"
                  // eslint-disable-next-line react/no-danger
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(dev.body) }}
                />
              ) : (
                <>
                  <p className="type-body-lg mt-7 max-w-[54ch] text-ink/78">
                    {REGISTER_INTRO.full} {REGISTER_INTRO.body}
                  </p>
                  <div className="mt-9">
                    <QuietLink to="/properties">
                      The addresses currently in the register
                    </QuietLink>
                  </div>
                </>
              )}
            </Reveal>
          </div>
        </div>
      </Section>

      <ConversationBand
        eyebrow="Request a conversation"
        title="We will not call you unless you ask us to."
        copy="Tell us what you are trying to achieve. An advisor replies in your preferred channel, in your hours, with no obligation and no follow-up sequence."
        context={dev.name}
        secondary="The register"
        secondaryTo="/developers"
        image={dev.image ?? "/images/about-ask.jpg"}
        alt={dev.name}
      />
    </>
  );
}
