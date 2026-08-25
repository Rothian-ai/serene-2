import {
  CTA,
  Eyebrow,
  Plate,
  QuietLink,
  Reveal,
  Section,
} from "~/components/primitives";
import { Hero } from "~/components/Hero";
import { SplitHeading } from "~/components/SplitHeading";
import { StickyStages } from "~/components/StickyStages";
import { ConversationBand } from "~/components/ConversationBand";
import { CHAIN_INTRO, STAGES } from "~/lib/strategy";
import { meta as buildMeta } from "~/lib/site";

export const handle = { headerTone: "dark" as const };

export function meta() {
  return buildMeta({
    title: "Lifecycle",
    description:
      "Nine stages. The last one is years after the signature. A commission-only agent is paid at stage three and gone by stage four; six of these nine happen after that point.",
    path: "/lifecycle",
  });
}

/** Where the market stops and where Serene Bay carries on (strategy §4). */
const AFTER_RESERVATION = STAGES.length - 3;

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

      {/* ② The shape of it — where the market stops */}
      <Section>
        <div className="grid gap-8 md:grid-cols-12 md:gap-7">
          <Reveal exit className="md:col-span-5">
            <Eyebrow className="text-fog">Why It Runs This Long</Eyebrow>
            <SplitHeading as="h2" className="type-headline mt-6 max-w-[16ch]">
              The hardest part is not the purchase.
            </SplitHeading>
          </Reveal>
          <Reveal delay={0.1} className="md:col-span-6 md:col-start-7 md:pt-2">
            <p className="type-body-lg text-ink/80">
              Most of our buyers are managing a six- or seven-figure asset from thousands of
              kilometres away, in a legal and construction environment they do not live inside and
              cannot easily inspect. The purchase is the short, well-served part. Everything after
              it, a build that slips, a unit that needs inspecting, a tenant, a mortgage, an exit,
              is where the current market simply stops answering.
            </p>
            <div className="mt-8 flex flex-wrap gap-x-10 gap-y-5">
              <div>
                <div className="font-extralight leading-none tabular-nums text-[clamp(2rem,3vw,2.75rem)] text-ink">
                  {STAGES.length}
                </div>
                <p className="type-cap mt-2 text-fog">stages in total</p>
              </div>
              <div>
                <div className="font-extralight leading-none tabular-nums text-[clamp(2rem,3vw,2.75rem)] text-brass">
                  {AFTER_RESERVATION}
                </div>
                <p className="type-cap mt-2 text-fog">of them after reservation</p>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ③ The spine — all nine stages in full */}
      <Section className="pt-0">
        <Reveal exit>
          <Eyebrow className="text-fog">Stage by Stage</Eyebrow>
        </Reveal>
        <div className="mt-9">
          <StickyStages />
        </div>
      </Section>

      {/* ④ A plate to breathe, then the two governing principles */}
      <Section className="pt-0">
        <Reveal>
          <Plate
            kind="stone"
            image="/images/about-light.jpg"
            alt="An atrium in plaster and daylight"
            className="aspect-[16/10] sm:aspect-[16/7] lg:aspect-[21/7]"
            parallax
          />
          <p className="type-cap mt-3 text-fog">
            The long middle: the years most of this market never sees.
          </p>
        </Reveal>
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

      {/* ⑤ The close */}
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
              <CTA to="/contact" kind="platinum">Ask us anything</CTA>
              <CTA to="/faqs" kind="line">Read the questions first</CTA>
            </div>
          </Reveal>
        </Section>
      </div>

      <ConversationBand
        eyebrow="Stage One"
        title="Questions about a later stage are welcome years early."
        copy="Most buyers ask about snagging in month thirty. Asking in month one is how the answer changes what you buy in the first place."
        secondary="Why we work this way"
        secondaryTo="/difference"
        image="/images/vela-crest-02.jpg"
        alt="Floor-to-ceiling glass above the city"
      />
    </>
  );
}
