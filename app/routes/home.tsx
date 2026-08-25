import { HomeHero } from "~/components/HomeHero";
import { MetricsMonument } from "~/components/MetricsMonument";
import { SplitHeading } from "~/components/SplitHeading";
import { CTA, Eyebrow, QuietLink, Reveal, RevealGroup, RevealItem, Section, Plate } from "~/components/primitives";
import { InsightCard } from "~/components/cards";
import { DirectRebuttal } from "~/components/DirectRebuttal";
import { LifecycleRail } from "~/components/LifecycleRail";
import { PaidBand } from "~/components/PaidBand";
import { MarqueeStrip } from "~/components/MarqueeStrip";
import { ImageMosaic } from "~/components/ImageMosaic";
import type { MosaicFrame } from "~/components/ImageMosaic";
import { insights } from "~/lib/content";
import {
  BUYER_ORIGINS,
  COMMITMENTS,
  COMMITMENTS_INTRO,
  OVERSEAS_INTRO,
  PROBLEMS,
  PROBLEMS_INTRO,
} from "~/lib/strategy";
import { meta as buildMeta } from "~/lib/site";

export const handle = { headerTone: "dark" as const };

export function meta() {
  return buildMeta({
    description:
      "Our advisors are salaried. They earn nothing extra for choosing one developer, one project or one unit over another. Off-plan advisory across Dubai and Abu Dhabi, with a relationship that outlasts the handover.",
    path: "/",
  });
}

/**
 * The editorial image band. Offsets and drift rates differ per frame so the
 * three separate slightly as the band passes — depth, not decoration.
 */
const MOSAIC: MosaicFrame[] = [
  {
    image: "/images/saadiyat-grove.jpg",
    alt: "A curved courtyard with a single tree",
    kind: "stone",
    caption: "Before a project is named",
    className: "col-span-2 aspect-[4/5] md:col-span-4 md:mt-16",
    drift: 5,
  },
  {
    image: "/images/the-cove-tower-three-01.jpg",
    alt: "Waterfront residential towers above the marina",
    kind: "render",
    caption: "During the years nobody watches",
    className: "col-span-2 aspect-[4/5] md:col-span-4 md:aspect-[3/4]",
    drift: 2,
  },
  {
    image: "/images/verde-terraces-01.jpg",
    alt: "A tower facade with cascading planted balconies",
    kind: "interior",
    caption: "And long after the keys",
    className: "col-span-2 aspect-[4/5] md:col-span-4 md:mt-24",
    drift: 6,
  },
];

/**
 * The homepage is the argument, in the order the strategy makes it:
 * proposition → the four claims as a strip → what is broken → who it is broken
 * for → how we are built differently → the objection → the lifecycle → the
 * market's own numbers → how we are paid → the journal → the close.
 *
 * There is no inventory here, and no developer register. The strategy names
 * neither: the partner network is still to be formalised, and a shortlist means
 * nothing before the conversation about what a purchase is actually for.
 */
export default function Home() {
  const latest = insights.slice(0, 3);

  return (
    <>
      {/* ① The hero — one statement over the dusk plate */}
      <HomeHero />

      {/* ② The four claims, drifting past — the shortest statement of the model */}
      <MarqueeStrip />

      {/* ③ Four commitments — the structural facts, not promises */}
      <div className="bg-frost">
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
      </div>

      {/* ④ Who it is broken for — the overseas buyer, with the published mix */}
      <Section>
        <div className="grid items-center gap-10 md:grid-cols-12 md:gap-7">
          <div className="md:col-span-6">
            <Reveal exit>
              <Eyebrow className="text-fog">{OVERSEAS_INTRO.eyebrow}</Eyebrow>
            </Reveal>
            <SplitHeading as="h2" className="type-headline mt-6 max-w-[19ch]">
              {OVERSEAS_INTRO.headline}
            </SplitHeading>
            <Reveal delay={0.1}>
              <p className="type-body-lg mt-7 max-w-[52ch] text-ink/78">{OVERSEAS_INTRO.body}</p>
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
              <p className="type-cap mt-5 max-w-[52ch] text-fog">
                {OVERSEAS_INTRO.originsNote}{" "}
                <a
                  href="https://veersant.com/blog/dubai-property-buyers-by-nationality-2025/"
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="text-brass underline underline-offset-2"
                >
                  Veersant, 2025 ↗
                </a>
              </p>
              <div className="mt-9">
                <QuietLink to="/about">Who we work for</QuietLink>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.15} className="md:col-span-5 md:col-start-8">
            <Plate
              kind="interior"
              image="/images/about-understand.jpg"
              alt="An architectural section drawing, read in full"
              className="aspect-[4/5]"
              parallax
            />
            <p className="type-cap mt-3 text-fog">
              The distance is the whole problem. It is also the whole opportunity.
            </p>
          </Reveal>
        </div>
      </Section>

      {/* ⑤ The band — three frames, three moments in an ownership, staggered */}
      <Section tight>
        <ImageMosaic frames={MOSAIC} />
      </Section>

      {/* ⑥ Four things nobody is doing for you, each answered by a stage */}
      <div className="bg-frost">
        <Section>
          <div className="grid gap-8 md:grid-cols-12 md:gap-7">
            <Reveal className="md:col-span-5" exit>
              <Eyebrow className="text-fog">{PROBLEMS_INTRO.eyebrow}</Eyebrow>
              <SplitHeading as="h2" className="type-display mt-5 max-w-[17ch]">
                {PROBLEMS_INTRO.headline}
              </SplitHeading>
            </Reveal>
            <Reveal delay={0.1} className="md:col-span-6 md:col-start-7 md:pt-3">
              <p className="type-body-lg text-ink/74">
                Each of the four below is answered by a named stage of the value chain, not by a
                promise about how hard we try.
              </p>
              <div className="mt-7">
                <QuietLink to="/lifecycle">See the nine stages</QuietLink>
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

          {/* the four gaps, each with the stage of the chain that answers it */}
          <RevealGroup className="mt-10 grid gap-x-7 gap-y-9 sm:grid-cols-2 md:mt-14 lg:grid-cols-4">
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
        </Section>
      </div>

      {/* ⑦ The objection — going direct. The one argument put in writing. */}
      <DirectRebuttal />

      {/* ⑧ The lifecycle — nine stages, six of them after reservation */}
      <LifecycleRail />

      {/* ⑨ On the record — the market's published figures, sourced */}
      <MetricsMonument />

      {/* ⑩ How we are paid — the commercial-transparency moment, on navy */}
      <PaidBand />

      {/* ⑪ Insights — the journal, image-led */}
      <Section>
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
          <Reveal exit>
            <Eyebrow className="text-fog">Insights</Eyebrow>
            <SplitHeading as="h2" className="type-headline mt-5 max-w-[20ch]">
              What we know, published either way.
            </SplitHeading>
          </Reveal>
          <QuietLink to="/insights">All Insights</QuietLink>
        </div>
        <RevealGroup className="mt-11 grid gap-10 md:grid-cols-3 md:gap-7">
          {latest.map((i) => (
            <RevealItem key={i.slug}>
              <InsightCard insight={i} />
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* ⑫ Final threshold — the close */}
      <div className="bg-ink text-ivory">
        <Section className="text-center">
          <Reveal exit>
            <Eyebrow className="justify-center text-silver">Begin</Eyebrow>
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
              <CTA to="/contact" kind="platinum">Request a conversation</CTA>
              <CTA to="/lifecycle" kind="line">See the nine stages</CTA>
            </div>
          </Reveal>
        </Section>
      </div>
    </>
  );
}
