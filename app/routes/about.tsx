import {
  CTA,
  Eyebrow,
  QuietLink,
  Reveal,
  RevealGroup,
  RevealItem,
  Section,
} from "~/components/primitives";
import { Hero } from "~/components/Hero";
import { SplitHeading } from "~/components/SplitHeading";
import { ConversationBand } from "~/components/ConversationBand";
import {
  BUYER_ORIGINS,
  OVERSEAS_INTRO,
  PROBLEMS,
  PROBLEMS_INTRO,
  SCHEDULE_BAND,
} from "~/lib/strategy";
import { HAS_WHATSAPP, SITE, conversationHref, meta as buildMeta } from "~/lib/site";

export const handle = { headerTone: "dark" as const };

export function meta() {
  return buildMeta({
    title: "About",
    description:
      "You are buying a building you cannot walk into. Serene Bay is an off-plan advisory across Dubai and Abu Dhabi, built for the non-resident buyer managing a large asset from thousands of kilometres away.",
    path: "/about",
  });
}

export default function About() {
  return (
    <>
      {/* ① Hero — photographic, held short; the page reads on, not down */}
      <Hero plate="glass" image="/images/about-glass.jpg" height="min-h-[64svh]">
        <Eyebrow className="text-silver">{OVERSEAS_INTRO.eyebrow}</Eyebrow>
        <SplitHeading as="h1" mode="chars" className="type-display mt-5 max-w-[20ch]">
          {OVERSEAS_INTRO.headline}
        </SplitHeading>
        <p className="type-body-lg mt-6 max-w-[54ch] text-ivory/72">{SITE.positioning}</p>
      </Hero>

      {/* ② Who we work for — the buyer, and where they are buying from */}
      <Section>
        <div className="grid gap-8 md:grid-cols-12 md:gap-7">
          <Reveal exit className="md:col-span-5">
            <Eyebrow className="text-fog">Who we work for</Eyebrow>
            <SplitHeading as="h2" className="type-headline mt-6 max-w-[17ch]">
              The customer the market serves worst.
            </SplitHeading>
          </Reveal>
          <Reveal delay={0.1} className="md:col-span-6 md:col-start-7 md:pt-2">
            <p className="type-body-lg text-ink/80">{OVERSEAS_INTRO.body}</p>
            <div className="mt-8 flex flex-wrap gap-x-9 gap-y-5">
              {BUYER_ORIGINS.map((o) => (
                <div key={o.country}>
                  <div className="font-extralight leading-none tabular-nums text-[clamp(1.5rem,2.2vw,2rem)] text-ink">
                    {o.share}
                  </div>
                  <p className="type-cap mt-1.5 text-fog">{o.country}</p>
                </div>
              ))}
            </div>
            <p className="type-cap mt-5 max-w-[52ch] text-fog">{OVERSEAS_INTRO.originsNote}</p>
            <div className="mt-8">
              <QuietLink to="/difference">How the model works</QuietLink>
            </div>
          </Reveal>
        </div>

      </Section>

      {/* ③ Four things nobody is doing for you, each answered by a stage */}
      <Section className="pt-0">
        <Reveal exit>
          <Eyebrow className="text-fog">{PROBLEMS_INTRO.eyebrow}</Eyebrow>
          <SplitHeading as="h2" className="type-headline mt-5 max-w-[20ch]">
            {PROBLEMS_INTRO.headline}
          </SplitHeading>
        </Reveal>
        <RevealGroup className="mt-10 grid gap-x-7 gap-y-9 sm:grid-cols-2 md:gap-7 lg:grid-cols-4">
          {PROBLEMS.map((p) => (
            <RevealItem key={p.k} className="border-t border-ink/16 pt-5">
              <div className="font-extralight leading-none tabular-nums text-[clamp(1.5rem,2.2vw,2rem)] text-ink">
                {p.stat}
              </div>
              <h3 className="type-title mt-3">{p.title}</h3>
              <p className="mt-3 text-[15.5px] leading-relaxed text-ink/68">{p.copy}</p>
              <p className="type-cap mt-4 text-brass">{p.link}</p>
            </RevealItem>
          ))}
        </RevealGroup>
        <Reveal className="mt-10">
          <QuietLink to="/lifecycle">See the nine stages</QuietLink>
        </Reveal>
      </Section>

      {/* ④ On your schedule — the charter, on ink */}
      <div className="bg-ink text-ivory">
        <Section>
          <div className="mx-auto max-w-[880px] text-center">
            <Reveal exit>
              <Eyebrow className="justify-center text-silver">{SCHEDULE_BAND.eyebrow}</Eyebrow>
            </Reveal>
            <SplitHeading as="h2" mode="chars" className="type-display mt-6">
              {SCHEDULE_BAND.headline}
            </SplitHeading>
            <Reveal delay={0.12}>
              <p className="type-body-lg mx-auto mt-8 max-w-[60ch] text-ivory/75">
                {SCHEDULE_BAND.body}
              </p>
              <div className="mt-11 flex flex-wrap justify-center gap-4">
                <CTA to={conversationHref()} kind="platinum" external={HAS_WHATSAPP}>
                  Book a conversation
                </CTA>
                <CTA to="/lifecycle" kind="line">The nine stages</CTA>
              </div>
            </Reveal>
          </div>
        </Section>
      </div>

      <ConversationBand
        eyebrow="Request a conversation"
        title="We will not call you unless you ask us to."
        copy="Tell us what you are trying to achieve. An advisor replies in your preferred channel, in your hours, with no obligation and no follow-up sequence."
        secondary="How the model works"
        secondaryTo="/difference"
        image="/images/mamsha-gardens-02.jpg"
        alt="A warm living room in natural light"
      />
    </>
  );
}
