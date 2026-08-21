import {
  CTA,
  Eyebrow,
  Plate,
  QuietLink,
  Reveal,
  RevealGroup,
  RevealItem,
  Section,
} from "~/components/primitives";
import { Hero } from "~/components/Hero";
import { SplitHeading } from "~/components/SplitHeading";
import { LifecycleSpine } from "~/components/LifecycleRail";
import { AmeliaBand } from "~/components/AmeliaBand";
import { STAGES } from "~/lib/strategy";
import { meta as buildMeta } from "~/lib/site";

export const handle = { headerTone: "dark" as const };

export function meta() {
  return buildMeta({
    title: "Lifecycle",
    description:
      "The nine stages Serene Bay works through with an off-plan buyer: discovery, due diligence, SPA support, construction monitoring, independent snagging, fit-out, letting, mortgage and refinance, and eventual resale.",
    path: "/lifecycle",
  });
}

/** Where the market stops and where Serene Bay carries on (strategy §4). */
const AFTER_RESERVATION = STAGES.length - 3;

/** The two structural principles woven through every stage (strategy §4, close). */
const PRINCIPLES = [
  {
    k: "Introduced, never required",
    copy: "Every specialist — surveyor, mortgage advisor, interior designer, letting agent — is presented as an independent option you are free to use or ignore. Not a mandatory referral, and never a commissioned one, so the no-kickback rule holds at every handoff rather than only at the point of sale.",
  },
  {
    k: "The next stage comes to you",
    copy: "Each introduction is logged against your record, so Amelia can raise the next relevant stage herself — a snagging inspection as handover approaches, a refinance conversation as a fixed term ends — instead of relying on you to remember to come back.",
  },
];

export default function Lifecycle() {
  return (
    <>
      {/* ① Hero — the whole proposition in one line */}
      <Hero plate="dusk" image="/images/about-decide.jpg" height="min-h-[64svh]">
        <Eyebrow className="text-silver">The Lifecycle</Eyebrow>
        <SplitHeading as="h1" mode="chars" className="type-display mt-5 max-w-[18ch]">
          Handover is the midpoint, not the end.
        </SplitHeading>
        <p className="type-body-lg mt-6 max-w-[54ch] text-ivory/72">
          Nine stages, from the first conversation about what the purchase is for to the day you
          eventually sell. Six of them happen after the point a commission-only agent has been paid
          and moved on.
        </p>
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
              it — a build that slips, a unit that needs inspecting, a tenant, a mortgage, an exit —
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
          <LifecycleSpine />
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
            <Eyebrow className="text-fog">Two Rules Throughout</Eyebrow>
          </Reveal>
          <RevealGroup className="mt-9 grid gap-9 md:grid-cols-2 md:gap-7">
            {PRINCIPLES.map((p) => (
              <RevealItem key={p.k} className="border-t border-ink/16 pt-5">
                <h3 className="type-title">{p.k}</h3>
                <p className="mt-3 text-[15.5px] leading-relaxed text-ink/70">{p.copy}</p>
              </RevealItem>
            ))}
          </RevealGroup>
          <Reveal className="mt-10">
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
            <p className="type-body-lg mx-auto mt-7 max-w-[50ch] text-ivory/70">
              Before any project is named: what the purchase is for, what it can actually cost
              all-in, and what timeline you can live with. That conversation is the whole first
              stage, and it costs nothing.
            </p>
            <div className="mt-11 flex flex-wrap justify-center gap-4">
              <CTA to="/contact" kind="platinum">Speak with an advisor</CTA>
              <CTA to="/developments" kind="line">See the register</CTA>
            </div>
          </Reveal>
        </Section>
      </div>

      <AmeliaBand
        title="Questions about a later stage? Ask now, years early."
        refId="lifecycle"
      />
    </>
  );
}
