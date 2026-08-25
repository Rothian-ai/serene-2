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
import { ConversationBand } from "~/components/ConversationBand";
import {
  BUYER_ORIGINS,
  COMMITMENTS,
  OVERSEAS_INTRO,
  PROBLEMS,
  PROBLEMS_INTRO,
  SCHEDULE_BAND,
} from "~/lib/strategy";
import { SITE, meta as buildMeta } from "~/lib/site";

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

      {/* ② Why we exist — the white space, stated plainly */}
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

        {/* the argument, in material — one wide, quiet plate */}
        <Reveal className="mt-10 md:mt-14">
          <Plate
            kind="stone"
            image="/images/about-light.jpg"
            alt="An atrium in plaster and daylight"
            className="aspect-[16/10] sm:aspect-[16/7] lg:aspect-[21/7]"
            parallax
          />
          <p className="type-cap mt-3 text-fog">Room to think: the whole premise, in one frame.</p>
        </Reveal>
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

      {/* ④ How we are built — the four commitments, in short form */}
      <div className="bg-frost">
        <Section>
          <Reveal exit>
            <Eyebrow className="text-fog">How We Are Built</Eyebrow>
          </Reveal>
          <RevealGroup className="mt-9 grid gap-x-7 gap-y-9 sm:grid-cols-2 lg:grid-cols-4">
            {COMMITMENTS.map((c) => (
              <RevealItem key={c.k} className="border-t border-ink/16 pt-5">
                <span className="type-data text-fog">{c.k}</span>
                <h3 className="type-title mt-2">{c.claim}</h3>
                <p className="type-cap mt-3 text-brass">{c.title}</p>
              </RevealItem>
            ))}
          </RevealGroup>
          <Reveal className="mt-10">
            <QuietLink to="/difference">Each one, in full</QuietLink>
          </Reveal>
        </Section>
      </div>

      {/* ⑤ Licensing & registry — the open-corner frame monument */}
      <Section>
        <Reveal>
          <div className="relative border border-ink/18 p-8 md:p-12">
            <Eyebrow className="text-fog">Licensed &amp; Registered</Eyebrow>
            <Ledger
              className="mt-6"
              cells={[
                { k: "Licence", v: SITE.rera },
                { k: "Advisor pay", v: "Salaried" },
                { k: "Markets", v: "Dubai · Abu Dhabi" },
                { k: "Represents", v: "Buyers only" },
              ]}
            />
            <p className="mt-6 max-w-[62ch] text-[15.5px] leading-relaxed text-ink/70">
              We transact only under formal broker registration with each developer, and every
              purchase moves through RERA-regulated escrow. We take no seller-side listings, so
              the dual-agency conflict a buyer would otherwise carry does not exist here. Verify
              the licence; we would in your position.
            </p>
          </div>
        </Reveal>
      </Section>

      {/* ⑥ The commitment — the charter, on ink, meeting the page on a hard edge */}
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
                <CTA to="/contact" kind="platinum">Book a conversation</CTA>
                <CTA to="/lifecycle" kind="line">The nine stages</CTA>
              </div>
            </Reveal>
          </div>
        </Section>
      </div>

      {/* ⑦ The standard — counsel left, the material of it right */}
      <Section>
        <div className="grid items-center gap-10 md:grid-cols-12 md:gap-7">
          <div className="md:col-span-6">
            <Reveal exit>
              <Eyebrow className="text-fog">The Standard</Eyebrow>
            </Reveal>
            <SplitHeading as="h2" className="type-headline mt-6 max-w-[20ch]">
              Counsel that waits for the question.
            </SplitHeading>
            <Reveal delay={0.1}>
              <p className="type-body-lg mt-7 max-w-[52ch] text-ink/78">
                No financial reason to prefer one developer, one project or one unit over another,
                the same way a good independent financial adviser is not paid by any single fund
                manager.
              </p>
              <div className="mt-9">
                <QuietLink to="/faqs">The questions we get asked</QuietLink>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.15} className="md:col-span-5 md:col-start-8">
            <Plate
              kind="interior"
              image="/images/saadiyat-grove-residences-02.jpg"
              alt="A calm interior in natural light"
              className="aspect-[4/5]"
              parallax
            />
            <p className="type-cap mt-3 text-fog">Present when called upon, invisible otherwise.</p>
          </Reveal>
        </div>
      </Section>

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
