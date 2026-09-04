import {
  CTA,
  Eyebrow,
  Ledger,
  Plate,
  QuietLink,
  Reveal,
  RevealGroup,
  RevealItem,
  Section,
} from "~/components/primitives";
import { Hero } from "~/components/Hero";
import { SplitHeading } from "~/components/SplitHeading";
import { Accordion } from "~/components/Accordion";
import { ConversationBand } from "~/components/ConversationBand";
import { ImageMosaic } from "~/components/ImageMosaic";
import type { MosaicFrame } from "~/components/ImageMosaic";
import {
  COSTS,
  EMIRATES,
  OFFPLAN_FAQS,
  OFFPLAN_SOURCES,
  OTHER_EMIRATES,
  PLANS,
  PLAN_BASIS,
  PLAN_CHECKS,
} from "~/lib/offplan";
import { CALCULATOR} from "~/lib/strategy";
import { ASK_EXTERNAL, askHref, meta as buildMeta } from "~/lib/site";

export const handle = { headerTone: "dark" as const };

export function meta() {
  return buildMeta({
    title: "Off-Plan, Explained",
    description:
      "A plain guide to buying off-plan property in the UAE: what off-plan means, the nine steps from shortlist through SPA and handover to exit, how payment plans work, how the rules differ between Dubai, Abu Dhabi, Sharjah and Ras Al Khaimah, and the questions worth asking.",
    path: "/off-plan",
  });
}

/**
 * Three frames to break the page's long middle. Captions describe the *kind* of
 * stock the market builds, not specific Emirates or projects — the photography
 * is architectural, not documentary.
 */
const MOSAIC: MosaicFrame[] = [
  {
    image: "/images/mamsha-gardens-01.jpg",
    alt: "A white beachfront villa with a pool and palms",
    kind: "stone",
    caption: "Low-rise coastal",
    className: "col-span-2 aspect-[4/5] md:col-span-4 md:mt-14",
    drift: 5,
  },
  {
    image: "/images/vela-crest-01.jpg",
    alt: "A glass residential tower seen from below",
    kind: "render",
    caption: "High-rise urban",
    className: "col-span-2 aspect-[4/5] md:col-span-4 md:aspect-[3/4]",
    drift: 2,
  },
  {
    image: "/images/verde-terraces-03.jpg",
    alt: "A landscaped terrace with dense planting",
    kind: "interior",
    caption: "Masterplanned community",
    className: "col-span-2 aspect-[4/5] md:col-span-4 md:mt-24",
    drift: 6,
  },
];

/**
 * /off-plan — the explainer for someone who has never bought in the UAE.
 *
 * It answers the mechanics: what off-plan is, what happens in what order, what
 * the paperwork is called, how payment plans really work, what differs between
 * the Emirates, and what can go wrong. Every market claim on this page carries
 * a source, because most of it is researched beyond the strategy document,
 * which is Dubai-only (see the sourcing note in app/lib/offplan.ts).
 *
 * Deliberate division of labour with the neighbouring pages:
 *   /off-plan   — the mechanics: payment plans, all-in cost, the Emirates.
 *   /lifecycle  — the nine stages, now carrying the timings and paperwork too.
 *   /difference — why we are able to work that way at all.
 *
 * Going direct used to sit here too. It is an argument, not a description, and
 * this page's remit is the second of those; more to the point /difference
 * compares against the direct route in a column of its own table, so the case
 * and the comparison were on separate pages. It moved there.
 *
 * Three other things have come off for repeating something said elsewhere.
 * A "known risks" band that was the document's four gaps reworded. Eight of
 * twelve FAQ questions that the sections above them already answered. And "From
 * shortlist to exit", nine steps over the same ground as /lifecycle's nine
 * stages — its timings and paperwork moved onto those stages, which is where a
 * reader wanting the sequence now goes.
 */
export default function OffPlan() {
  return (
    <>
      {/* ① Hero */}
      <Hero plate="render" image="/images/bugatti-residences-04.jpg" height="min-h-[64svh]">
        <Eyebrow className="text-silver">Off-Plan, Explained</Eyebrow>
        <SplitHeading as="h1" mode="chars" className="type-display mt-5 max-w-[20ch]">
          Buying a building that does not exist yet.
        </SplitHeading>
        <p className="type-body-lg mt-6 max-w-[54ch] text-ivory/72">
          Most UAE residential sales are off-plan, and almost none of the people buying have done it
          before. This is the whole process in order, in plain language, with the paperwork named and
          the risks stated.
        </p>
      </Hero>

      {/* ② What it actually is */}
      <Section>
        <div className="grid gap-8 md:grid-cols-12 md:gap-7">
          <Reveal exit className="md:col-span-5">
            <Eyebrow className="text-fog">Start Here</Eyebrow>
            <SplitHeading as="h2" className="type-headline mt-6 max-w-[16ch]">
              You are buying a right, not a building.
            </SplitHeading>
          </Reveal>
          <Reveal delay={0.1} className="md:col-span-6 md:col-start-7 md:pt-2">
            <p className="type-body-lg text-ink/80">
              Off-plan means buying before completion, often before construction has begun. What
              changes hands at the start is not a property but a contractual right to a specific
              unit, registered with the Emirate's land department, which converts to a title deed
              when the building is finished.
            </p>
            <p className="mt-5 text-[15.5px] leading-relaxed text-ink/68">
              That is the trade. You get entry pricing, a staged payment schedule instead of a lump
              sum, and choice of unit while the building is still on paper. In return you carry
              delivery risk, and a gap of two to four years in which the thing you own cannot be
              inspected, let or lived in. The framework around it, escrow accounts, project
              registration and milestone-linked releases, exists to make that trade survivable. It
              does not make it automatic.
            </p>
          </Reveal>
        </div>
      </Section>

      {/* a wide plate to close the introduction before the long process list */}
      <Section className="pt-0">
        <Reveal variant="mask">
          <Plate
            kind="render"
            image="/images/the-cove-tower-three-01.jpg"
            alt="Waterfront residential towers above the marina"
            className="aspect-[16/10] sm:aspect-[16/7] lg:aspect-[21/8]"
            parallax
          />
          <p className="type-cap mt-3 text-fog">
            Two to four years separate the contract from the keys. Everything below happens in that gap.
          </p>
        </Reveal>
      </Section>

      {/* ③ Payment plans */}
      <Section>
        <Reveal exit>
          <Eyebrow className="text-fog">Payment Plans</Eyebrow>
          <SplitHeading as="h2" className="type-headline mt-5 max-w-[22ch]">
            The headline split is the least important part.
          </SplitHeading>
          <p className="type-body-lg mt-6 max-w-[58ch] text-ink/72">
            Every launch advertises a ratio. What actually governs your exposure is whether the
            instalments are tied to construction or to the calendar.
          </p>
        </Reveal>

        {/* the basis — the distinction that matters most */}
        <RevealGroup className="mt-11 grid gap-x-7 gap-y-9 md:mt-14 md:grid-cols-2">
          {PLAN_BASIS.map((b) => (
            <RevealItem key={b.k} className="border-t border-ink/16 pt-5">
              <h3 className="type-title">{b.k}</h3>
              <p className="mt-3 text-[15.5px] leading-relaxed text-ink/70">{b.copy}</p>
              <p className="type-cap mt-4 text-brass">{b.verdict}</p>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* a plate so the section breathes before the grid of splits */}
        <Reveal className="mt-12 md:mt-16" variant="mask">
          <Plate
            kind="stone"
            image="/images/mamsha-gardens-04.jpg"
            alt="A colonnade wall, read in close detail"
            className="aspect-[16/10] sm:aspect-[16/7] lg:aspect-[21/7]"
            parallax
          />
        </Reveal>

        <Reveal className="mt-12">
          <Eyebrow className="text-fog">The Common Structures</Eyebrow>
        </Reveal>
        <RevealGroup className="mt-8 grid gap-x-7 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
          {PLANS.map((p) => (
            <RevealItem key={p.split} className="border-t border-ink/16 pt-5">
              <div className="font-extralight leading-none tabular-nums text-[clamp(1.6rem,2.4vw,2.1rem)] text-ink">
                {p.split}
              </div>
              <h3 className="type-cap mt-3 text-brass">{p.name}</h3>
              <p className="mt-3 text-[15.5px] leading-relaxed text-ink/70">{p.copy}</p>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* the checklist — the practical output of the section */}
        <Reveal className="mt-14">
          <div className="border border-ink/18 p-8 md:p-12">
            <Eyebrow className="text-fog">Ask These, In Writing</Eyebrow>
            <ul className="mt-6 flex flex-col gap-3">
              {PLAN_CHECKS.map((c) => (
                <li key={c} className="flex items-start gap-3.5 text-[15.5px] leading-relaxed text-ink/78">
                  <span
                    aria-hidden
                    className="mt-2 h-1 w-1 shrink-0 rotate-45 bg-gold"
                  />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </Section>

      {/* ④ The costs beyond the price */}
      <div className="bg-frost">
        <Section>
          <div className="grid gap-8 md:grid-cols-12 md:gap-7">
            <Reveal exit className="md:col-span-5">
              <Eyebrow className="text-fog">{CALCULATOR.eyebrow}</Eyebrow>
              <SplitHeading as="h2" className="type-headline mt-6 max-w-[18ch]">
                {CALCULATOR.headline}
              </SplitHeading>
            </Reveal>
            <Reveal delay={0.1} className="md:col-span-6 md:col-start-7 md:pt-2">
              <p className="type-body-lg text-ink/78">{CALCULATOR.body}</p>
            </Reveal>
          </div>
          <RevealGroup className="mt-11 grid gap-x-7 gap-y-8 md:mt-14 md:grid-cols-2">
            {COSTS.map((c) => (
              <RevealItem key={c.k}>
                <Ledger cells={[{ k: c.k, v: c.v }]} />
              </RevealItem>
            ))}
          </RevealGroup>
          <Reveal>
            <p className="type-cap mt-8 max-w-[80ch] text-fog">{CALCULATOR.note}</p>
          </Reveal>
        </Section>
      </div>

      {/* the band — three kinds of stock, to break the page's long middle */}
      <Section tight>
        <ImageMosaic frames={MOSAIC} />
      </Section>

      {/* ⑤ Emirate by Emirate */}
      <Section>
        <Reveal exit>
          <Eyebrow className="text-fog">By Emirate</Eyebrow>
          <SplitHeading as="h2" className="type-headline mt-5 max-w-[22ch]">
            Seven Emirates. Seven sets of rules.
          </SplitHeading>
          <p className="type-body-lg mt-6 max-w-[60ch] text-ink/72">
            This is where newcomers are caught out most often. “The UAE” is not one property market:
            each Emirate has its own regulator, its own registration process, and its own rules on
            what a foreign buyer is permitted to hold. A brochure that says freehold is not the same
            as a registry that will record it.
          </p>
        </Reveal>

        <div className="mt-11 flex flex-col gap-8 md:mt-14">
          {EMIRATES.map((e) => (
            <Reveal key={e.emirate}>
              <div className="border border-ink/18 p-7 md:p-9">
                <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
                  <h3 className="type-title text-[1.45rem]">{e.emirate}</h3>
                  <p className="type-cap text-brass">{e.regulator}</p>
                </div>
                <dl className="mt-7 grid gap-x-7 gap-y-6 md:grid-cols-3">
                  {[
                    { k: "What a foreign buyer can own", v: e.foreignOwnership },
                    { k: "Off-plan protection", v: e.offPlanProtection },
                    { k: "Registration", v: e.registration },
                  ].map((cell) => (
                    <div key={cell.k} className="border-t border-ink/14 pt-4">
                      <dt className="text-[10.5px] font-semibold uppercase tracking-[0.13em] text-fog">
                        {cell.k}
                      </dt>
                      <dd className="mt-2 text-[15px] leading-relaxed text-ink/76">{cell.v}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-7 max-w-[76ch] border-l border-gold pl-5 text-[15px] leading-relaxed text-ink/68">
                  {e.note}
                </p>
                <p className="type-cap mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-fog">
                  <span className="type-eyebrow text-fog">Sources</span>
                  {e.sources.map((src) => (
                    <a
                      key={src.href}
                      href={src.href}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="underline decoration-ink/25 underline-offset-4 transition-colors hover:text-brass"
                    >
                      {src.label} ↗
                    </a>
                  ))}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-9">
          <p className="max-w-[76ch] text-[15.5px] leading-relaxed text-ink/68">{OTHER_EMIRATES}</p>
        </Reveal>
      </Section>

      {/* ⑥ FAQ — only what the sections above do not already answer */}
      <div className="bg-frost">
        <Section>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: OFFPLAN_FAQS.map((f) => ({
                  "@type": "Question",
                  name: f.question,
                  acceptedAnswer: { "@type": "Answer", text: f.answer },
                })),
              }),
            }}
          />
          <Reveal exit>
            <Eyebrow className="text-fog">Common Questions</Eyebrow>
            <SplitHeading as="h2" className="type-headline mt-5 max-w-[18ch]">
              The questions a first-time buyer asks.
            </SplitHeading>
          </Reveal>
          <div className="mt-10 max-w-[900px]">
            <Accordion items={OFFPLAN_FAQS} />
            <p className="mt-9 text-[15.5px] text-ink/70">
              Questions about how we work rather than how the market works?{" "}
              <QuietLink to="/faqs" className="ml-1 align-middle">
                Those are here
              </QuietLink>
            </p>
          </div>
        </Section>
      </div>

      {/* ⑦ Sources — the page's whole evidence base, in one place */}
      <Section>
        <Reveal>
          <Eyebrow className="text-fog">Sources</Eyebrow>
          <p className="mt-5 max-w-[70ch] text-[15px] leading-relaxed text-ink/68">
            Off-plan regulation, fees and lending terms change, and they differ by Emirate. Every
            factual claim on this page is drawn from the references below rather than from our own
            estimates. None of it is legal or financial advice, and none of it replaces confirming
            the current position for a specific project with the relevant authority.
          </p>
          <ul className="mt-7 grid gap-x-7 gap-y-3 md:grid-cols-2">
            {OFFPLAN_SOURCES.map((s) => (
              <li key={s.href}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="text-[14.5px] text-ink/72 underline decoration-ink/25 underline-offset-4 transition-colors hover:text-brass"
                >
                  {s.label} ↗
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-11 flex flex-wrap gap-4">
            <CTA to={askHref({ context: "an off-plan purchase", via: "off-plan" })} kind="solid" external={ASK_EXTERNAL}>
              Ask Amelia, our AI Sales Agent
            </CTA>
            <CTA to="/difference" kind="line-ink">How We're Different</CTA>
          </div>
        </Reveal>
      </Section>

      <ConversationBand
        eyebrow="First Purchase"
        title="A first off-plan purchase should be a slow conversation."
        copy="Bring the questions this page raised. Nothing gets named, priced or recommended until the objective is clear, and an advisor with a salary rather than a commission can afford to take that time."
        secondary="Why we are different"
        secondaryTo="/difference"
        image="/images/about-ask.jpg"
        alt="A quiet lounge in warm evening light"
      />
    </>
  );
}
