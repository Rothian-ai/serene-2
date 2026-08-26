import {
  CTA,
  Eyebrow,
  QuietLink,
  Reveal,
  Section,
} from "~/components/primitives";
import { Hero } from "~/components/Hero";
import { SplitHeading } from "~/components/SplitHeading";
import { StickyStages } from "~/components/StickyStages";
import { ConversationBand } from "~/components/ConversationBand";
import { CHAIN_INTRO} from "~/lib/strategy";
import { HAS_WHATSAPP, conversationHref, meta as buildMeta } from "~/lib/site";

export const handle = { headerTone: "dark" as const };

export function meta() {
  return buildMeta({
    title: "Lifecycle",
    description:
      "Nine stages. The last one is years after the signature. A commission-only agent is paid at stage three and gone by stage four; six of these nine happen after that point.",
    path: "/lifecycle",
  });
}

export default function Lifecycle() {
  return (
    <>
      {/* ① Hero — the whole proposition in one line */}
      <Hero plate="dusk" image="/images/about-decide.jpg" height="min-h-[64svh]">
        <Eyebrow className="text-silver">The Lifecycle</Eyebrow>
        <SplitHeading as="h1" mode="chars" className="type-display mt-5 max-w-[20ch]">
          {CHAIN_INTRO.headline}
        </SplitHeading>
        <p className="type-body-lg mt-6 max-w-[56ch] text-ivory/72">{CHAIN_INTRO.body}</p>
      </Hero>

      {/* ② The spine — all nine stages in full */}
      <Section className="pt-0">
        <Reveal exit>
          <Eyebrow className="text-fog">Stage by Stage</Eyebrow>
        </Reveal>
        <div className="mt-9">
          <StickyStages />
        </div>
      </Section>

      <div className="bg-frost">
        <Section>
          <Reveal exit>
            <Eyebrow className="text-fog">Every introduction</Eyebrow>
            <p className="type-title mt-5 max-w-[34ch] font-light text-ink/80">
              {CHAIN_INTRO.note}
            </p>
          </Reveal>
          <Reveal className="mt-9">
            <QuietLink to="/difference">Why we are able to work this way</QuietLink>
          </Reveal>
        </Section>
      </div>

      {/* ③ The close */}
      <div className="bg-ink text-ivory">
        <Section className="text-center">
          <Reveal exit>
            <Eyebrow className="justify-center text-silver">Begin</Eyebrow>
          </Reveal>
          <SplitHeading as="h2" mode="chars" className="type-display mt-6">
            Start at stage one.
          </SplitHeading>
          <Reveal delay={0.15}>
            <p className="type-body-lg mx-auto mt-7 max-w-[52ch] text-ivory/70">
              Before any project is named we establish your actual objective, your true all-in
              budget, and your tolerance for developer tier and delivery risk.
            </p>
            <div className="mt-11 flex flex-wrap justify-center gap-4">
              <CTA to={conversationHref()} kind="platinum" external={HAS_WHATSAPP}>
                Ask us anything
              </CTA>
              <CTA to="/faqs" kind="line">Read the questions first</CTA>
            </div>
          </Reveal>
        </Section>
      </div>

      <ConversationBand
        eyebrow="Request a conversation"
        title="We will not call you unless you ask us to."
        copy="Tell us what you are trying to achieve. An advisor replies in your preferred channel, in your hours, with no obligation and no follow-up sequence."
        secondary="Why we work this way"
        secondaryTo="/difference"
        image="/images/vela-crest-02.jpg"
        alt="Floor-to-ceiling glass above the city"
      />
    </>
  );
}
