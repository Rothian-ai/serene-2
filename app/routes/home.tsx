import { HeroSequence } from "~/components/HeroSequence";
import { HorizontalShowcase } from "~/components/HorizontalShowcase";
import { MetricsMonument } from "~/components/MetricsMonument";
import { SplitHeading } from "~/components/SplitHeading";
import { CTA, Eyebrow, QuietLink, Reveal, RevealGroup, RevealItem, Section, Plate } from "~/components/primitives";
import { DeveloperCard, InsightCard } from "~/components/cards";
import { CollaborationsBand } from "~/components/CollaborationsBand";
import { AmeliaAsk } from "~/components/AmeliaAsk";
import { developers, developments, insights } from "~/lib/content";
import { AMELIA_URL, meta as buildMeta } from "~/lib/site";

export const handle = { headerTone: "dark" as const };

export function meta() {
  return buildMeta({
    description:
      "Serene is an AI-native advisory for off-plan real estate in Dubai and Abu Dhabi. RERA-licensed, registered with the developers it represents, and incapable of a cold call.",
    path: "/",
  });
}

export default function Home() {
  const latest = insights.slice(0, 3);

  return (
    <>
      {/* ① Cinematic hero — pinned, scroll-driven three-chapter sequence */}
      <HeroSequence />

      {/* ② Developers — the registry leads, set on a light silver (frost) ground.
          The silver mark reinforces the platinum-led brand on a light surface. */}
      <div className="bg-frost">
        <Section>
          <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-6">
            <Reveal>
              <img src="/logo/serene-mark.png" alt="" className="mb-6 h-11 w-auto" />
              <Eyebrow className="text-fog">The Registry</Eyebrow>
              <SplitHeading as="h2" className="type-display mt-5 max-w-[16ch]">
                The institutions behind every address.
              </SplitHeading>
            </Reveal>
            <QuietLink to="/developers">All developers</QuietLink>
          </div>
          <RevealGroup className="mt-10 grid grid-cols-2 gap-6 md:mt-14 md:grid-cols-4 md:gap-7">
            {developers.slice(0, 4).map((d) => (
              <RevealItem key={d.slug}>
                <DeveloperCard developer={d} />
              </RevealItem>
            ))}
          </RevealGroup>
        </Section>
      </div>

      {/* ③ Developments — the featured register, a pinned horizontal gallery */}
      <HorizontalShowcase developments={developments.slice(0, 6)} />

      {/* ④ The House — statement on top, a wide plate, then the principles */}
      <Section>
        <div className="grid gap-8 md:grid-cols-12 md:gap-7">
          <Reveal className="md:col-span-5" exit>
            <Eyebrow className="text-fog">The House</Eyebrow>
            <SplitHeading as="h2" className="type-display mt-5 max-w-[12ch]">
              A quieter way to acquire.
            </SplitHeading>
          </Reveal>
          <Reveal delay={0.1} className="md:col-span-6 md:col-start-7 md:pt-3">
            <p className="type-body-lg text-ink/74">
              Serene is an advisory for off-plan property in Dubai and Abu Dhabi, licensed,
              registered with the developers it represents, and built on one conviction: serious
              buyers are persuaded by information, not persistence.
            </p>
            <div className="mt-7">
              <QuietLink to="/about">About Serene</QuietLink>
            </div>
          </Reveal>
        </div>

        {/* a single wide plate — deliberately short, not a full-height wall */}
        <Reveal className="mt-9 md:mt-12">
          <Plate
            kind="stone"
            image="/images/philosophy-stone.jpg"
            alt="White stone stair in natural light"
            className="aspect-[16/10] sm:aspect-[16/7] lg:aspect-[21/7]"
            parallax
          />
        </Reveal>

        {/* the principles — three columns, hairline-ruled */}
        <RevealGroup className="mt-10 grid gap-8 md:mt-14 md:grid-cols-3 md:gap-10">
          {[
            {
              k: "Information first",
              copy: "We publish what we know and answer what you ask. No cold calls, no follow-up campaigns. The decision, and its timing, stays yours.",
            },
            {
              k: "On the record",
              copy: "We transact only with the developers we are registered with: Emaar, Aldar, Sobha, and the institutions building the Emirates.",
            },
            {
              k: "Answered on demand",
              copy: "Amelia holds the record: escrow, service charges, handovers, yields. She answers the moment the question arrives, in detail.",
            },
          ].map((p) => (
            <RevealItem key={p.k} className="border-t border-ink/14 pt-5">
              <h3 className="type-title">{p.k}</h3>
              <p className="mt-3 text-[15.5px] leading-relaxed text-ink/68">{p.copy}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* ⑤ By the Record — animated credibility monument */}
      <MetricsMonument />

      {/* ⑤ The registry — hidden for now: the collaborations band below already
          carries the developer register. Restore by uncommenting.
      <Section className="pt-0">
        <Reveal exit>
          <Eyebrow className="text-fog">The Registry</Eyebrow>
        </Reveal>
        ...
      </Section> */}

      {/* ⑥ Collaborations — the register, set large, then covered by its addresses */}
      <CollaborationsBand />

      {/* ⑦ Amelia — her one navy moment, now interactive */}
      <AmeliaAsk />

      {/* ⑧ Insights — the journal, image-led */}
      <Section>
        <Reveal exit>
          <Eyebrow className="text-fog">Insights</Eyebrow>
        </Reveal>
        <RevealGroup className="mt-9 grid gap-10 md:grid-cols-3 md:gap-7">
          {latest.map((i) => (
            <RevealItem key={i.slug}>
              <InsightCard insight={i} />
            </RevealItem>
          ))}
        </RevealGroup>
        <div className="mt-11">
          <QuietLink to="/insights">All Insights</QuietLink>
        </div>
      </Section>

      {/* ⑨ Final threshold — the close */}
      <div className="bg-ink text-ivory">
        <Section className="text-center">
          <Reveal exit>
            <Eyebrow className="justify-center text-silver">The Threshold</Eyebrow>
          </Reveal>
          <SplitHeading as="h2" className="type-display mt-6" mode="chars">
            When you have questions, ask.
          </SplitHeading>
          <Reveal delay={0.15}>
            <p className="type-body-lg mx-auto mt-7 max-w-[46ch] text-ivory/70">
              No queue, no call-back, no sales floor. Amelia answers the moment the
              question arrives, and stays quiet until the next one does.
            </p>
            <div className="mt-11 flex flex-wrap justify-center gap-4">
              <CTA to={AMELIA_URL} external kind="platinum">Ask Amelia</CTA>
              <CTA to="/contact" kind="line">Enquire</CTA>
            </div>
          </Reveal>
        </Section>
      </div>
    </>
  );
}
