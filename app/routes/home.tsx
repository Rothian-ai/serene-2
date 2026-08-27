import { HomeHero } from "~/components/HomeHero";
import { MetricsMonument } from "~/components/MetricsMonument";
import { SplitHeading } from "~/components/SplitHeading";
import { CTA, Eyebrow, Reveal, RevealGroup, RevealItem, Section } from "~/components/primitives";
import { InsightCarousel } from "~/components/InsightCarousel";
import { LifecycleRail } from "~/components/LifecycleRail";
import { DeveloperRegister } from "~/components/DeveloperRegister";
import { insights } from "~/lib/content";
import { COMMITMENTS, COMMITMENTS_INTRO } from "~/lib/strategy";
import { HAS_WHATSAPP, conversationHref, meta as buildMeta } from "~/lib/site";

export const handle = { headerTone: "dark" as const };

export function meta() {
  return buildMeta({
    description:
      "Our advisors are salaried. They earn nothing extra for choosing one developer, one project or one unit over another. Off-plan advisory across Dubai and Abu Dhabi, with a relationship that outlasts the handover.",
    path: "/",
  });
}

/**
 * The homepage is the document's "Why Serene" page and nothing else: the
 * proposition, the four commitments, the market that makes them necessary, and
 * a rail into the value chain.
 *
 * Everything it used to also carry — the overseas buyer, the four gaps, the
 * going-direct rebuttal, how we are paid — has one home elsewhere now. Saying
 * each of them twice was the redundancy; a homepage that signposts is not.
 */
export default function Home() {
  const latest = insights.slice(0, 3);

  return (
    <>
      {/* ① The hero — one statement over the dusk plate */}
      <HomeHero />

      {/* ② Four commitments — the structural facts, not promises.
          On ivory, because the register below it took the frost — two frost
          blocks in a row merge into one expanse and neither gets an edge. */}
      <Section>
        <div className="grid gap-8 md:grid-cols-12 md:gap-7">
          <Reveal className="md:col-span-5" exit>
            <Eyebrow className="text-fog">{COMMITMENTS_INTRO.eyebrow}</Eyebrow>
            <SplitHeading as="h2" className="type-display mt-5 max-w-[16ch]">
              {COMMITMENTS_INTRO.headline}
            </SplitHeading>
          </Reveal>
          <Reveal delay={0.1} className="md:col-span-6 md:col-start-7 md:pt-3">
            <p className="type-body-lg text-ink/74">{COMMITMENTS_INTRO.body}</p>
          </Reveal>
        </div>

        <RevealGroup className="mt-11 grid gap-x-7 gap-y-9 sm:grid-cols-2 md:mt-14 lg:grid-cols-4">
          {COMMITMENTS.map((c) => (
            <RevealItem key={c.k} className="border-t border-ink/16 pt-5">
              <span className="type-data text-fog">{c.k}</span>
              <h3 className="type-title mt-2">{c.claim}</h3>
              <p className="mt-3 text-[15.5px] leading-relaxed text-ink/68">{c.copy}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* ③ The register — the lockups alone, each linking to its own record */}
      <DeveloperRegister />

      {/* ④ The value chain — nine marks on one rule, the handoff coloured */}
      <LifecycleRail />

      {/* ⑤ The market we are answering — the figures, then why they matter */}
      <MetricsMonument />

      {/* ⑥ Insights — a scrollable rail, so more than three can be offered */}
      <InsightCarousel insights={insights} />

      {/* ⑦ Request a conversation — the close */}
      <div className="bg-ink text-ivory">
        <Section className="text-center">
          <Reveal exit>
            <Eyebrow className="justify-center text-silver">Our promise</Eyebrow>
          </Reveal>
          <SplitHeading as="h2" className="type-display mt-6" mode="chars">
            We will not call you unless you ask us to.
          </SplitHeading>
          <Reveal delay={0.15}>
            <p className="type-body-lg mx-auto mt-7 max-w-[52ch] text-ivory/70">
              Tell us what you are trying to achieve. An advisor replies in your preferred
              channel, in your hours, with no obligation and no follow-up sequence.
            </p>
            <div className="mt-11 flex flex-wrap justify-center gap-4">
              <CTA to={conversationHref()} kind="platinum" external={HAS_WHATSAPP}>
                Ask Amelia, our AI Sales Agent
              </CTA>
              <CTA to="/difference" kind="line">How We're Different</CTA>
            </div>
          </Reveal>
        </Section>
      </div>
    </>
  );
}
