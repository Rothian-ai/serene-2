import { HeroSequence } from "~/components/HeroSequence";
import { HorizontalShowcase } from "~/components/HorizontalShowcase";
import { MetricsMonument } from "~/components/MetricsMonument";
import { SplitHeading } from "~/components/SplitHeading";
import { CTA, Eyebrow, QuietLink, Reveal, RevealGroup, RevealItem, Section, Plate } from "~/components/primitives";
import { DeveloperCard, InsightCard } from "~/components/cards";
import { CollaborationsBand } from "~/components/CollaborationsBand";
import { AmeliaAsk } from "~/components/AmeliaAsk";
import { DirectRebuttal } from "~/components/DirectRebuttal";
import { LifecycleRail } from "~/components/LifecycleRail";
import { developers, developments, insights } from "~/lib/content";
import { COMMITMENTS, PROBLEMS } from "~/lib/strategy";
import { meta as buildMeta } from "~/lib/site";

export const handle = { headerTone: "dark" as const };

export function meta() {
  return buildMeta({
    description:
      "Serene Bay is an off-plan buyer advisory in Dubai and Abu Dhabi with salaried, non-commissioned advisors. Cross-developer shortlists, independent snagging, and support through construction, letting, mortgage and resale.",
    path: "/",
  });
}

/**
 * The homepage argument, in the order the strategy makes it:
 * proposition → what is broken → how we are built differently → the objection
 * → the lifecycle → what you can actually look at → who we are registered with
 * → the market's own numbers → the advisory → the journal → the close.
 */
export default function Home() {
  const latest = insights.slice(0, 3);

  return (
    <>
      {/* ① Cinematic hero — pinned, scroll-driven three-chapter sequence.
          Photography and motion unchanged; the argument is new. */}
      <HeroSequence />

      {/* ② The problem — why this market needed a different kind of house */}
      <div className="bg-frost">
        <Section>
          <div className="grid gap-8 md:grid-cols-12 md:gap-7">
            <Reveal className="md:col-span-5" exit>
              <Eyebrow className="text-fog">The Problem</Eyebrow>
              <SplitHeading as="h2" className="type-display mt-5 max-w-[15ch]">
                Nothing in this market is paid to advise you.
              </SplitHeading>
            </Reveal>
            <Reveal delay={0.1} className="md:col-span-6 md:col-start-7 md:pt-3">
              <p className="type-body-lg text-ink/74">
                Off-plan is not a corner of the Dubai market — it is the market. And almost every
                person selling it earns nothing until you sign. That single fact shapes the advice
                you get, what you are shown, and how quickly you are asked to decide.
              </p>
            </Reveal>
          </div>

          <RevealGroup className="mt-11 grid gap-x-7 gap-y-9 sm:grid-cols-2 md:mt-14 lg:grid-cols-4">
            {PROBLEMS.map((p) => (
              <RevealItem key={p.k} className="border-t border-ink/16 pt-5">
                <span className="type-data text-fog">{p.k}</span>
                <h3 className="type-title mt-2">{p.title}</h3>
                <p className="mt-3 text-[15.5px] leading-relaxed text-ink/68">{p.copy}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </Section>
      </div>

      {/* ③ The difference — the four structural commitments, then the plate */}
      <Section>
        <div className="grid gap-8 md:grid-cols-12 md:gap-7">
          <Reveal className="md:col-span-5" exit>
            <Eyebrow className="text-fog">The Difference</Eyebrow>
            <SplitHeading as="h2" className="type-display mt-5 max-w-[13ch]">
              Built so the conflict cannot arise.
            </SplitHeading>
          </Reveal>
          <Reveal delay={0.1} className="md:col-span-6 md:col-start-7 md:pt-3">
            <p className="type-body-lg text-ink/74">
              Serene Bay is not a faster or cheaper version of the broker model. It is a different
              business, built on four commitments the rest of the market is not structurally able
              to make.
            </p>
            <div className="mt-7">
              <QuietLink to="/difference">The difference in full</QuietLink>
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

        {/* the four commitments — hairline-ruled, the claim set as the figure */}
        <RevealGroup className="mt-10 grid gap-x-7 gap-y-9 sm:grid-cols-2 md:mt-14 lg:grid-cols-4">
          {COMMITMENTS.map((c) => (
            <RevealItem key={c.k} className="border-t border-ink/14 pt-5">
              <span className="type-data text-fog">{c.k}</span>
              <h3 className="type-title mt-2">{c.claim}</h3>
              <p className="mt-3 text-[15.5px] leading-relaxed text-ink/68">{c.copy}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* ④ The objection — going direct. The one argument put in writing. */}
      <DirectRebuttal />

      {/* ⑤ The lifecycle — nine stages, six of them after reservation */}
      <LifecycleRail />

      {/* ⑥ Developments — the cross-developer register, a pinned horizontal gallery */}
      <HorizontalShowcase developments={developments.slice(0, 6)} />

      {/* ⑦ Developers — the registry, proof the shortlist spans institutions */}
      <div className="bg-frost">
        <Section>
          <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-6">
            <Reveal>
              <img src="/logo/serene-mark.png" alt="" className="mb-6 h-11 w-auto" />
              <Eyebrow className="text-fog">The Registry</Eyebrow>
              <SplitHeading as="h2" className="type-display mt-5 max-w-[17ch]">
                Many developers, on purpose.
              </SplitHeading>
              <p className="type-body-lg mt-6 max-w-[46ch] text-ink/72">
                A developer's own sales team will only ever put its own inventory in front of you.
                Because our advisors are salaried, a shortlist can cross developers on merit —
                including projects that pay us less than the alternative.
              </p>
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

      {/* ⑧ On the record — the market's published figures, sourced */}
      <MetricsMonument />

      {/* ⑨ Collaborations — the register, set large, then covered by its addresses */}
      <CollaborationsBand />

      {/* ⑩ Amelia — her one navy moment, the reason no one has to call you */}
      <AmeliaAsk />

      {/* ⑪ Insights — the journal, image-led */}
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

      {/* ⑫ Final threshold — the close */}
      <div className="bg-ink text-ivory">
        <Section className="text-center">
          <Reveal exit>
            <Eyebrow className="justify-center text-silver">Begin</Eyebrow>
          </Reveal>
          <SplitHeading as="h2" className="type-display mt-6" mode="chars">
            Start with the objective, not a listing.
          </SplitHeading>
          <Reveal delay={0.15}>
            <p className="type-body-lg mx-auto mt-7 max-w-[52ch] text-ivory/70">
              Tell an advisor what the purchase is for and we will work back to the shortlist.
              No queue, no call-back you didn't ask for, no sales floor — because there isn't one.
            </p>
            <div className="mt-11 flex flex-wrap justify-center gap-4">
              <CTA to="/contact" kind="platinum">Speak with an advisor</CTA>
              <CTA to="/lifecycle" kind="line">See what we do after handover</CTA>
            </div>
          </Reveal>
        </Section>
      </div>
    </>
  );
}
