import { HeroSequence } from "~/components/HeroSequence";
import { HorizontalShowcase } from "~/components/HorizontalShowcase";
import { MetricsMonument } from "~/components/MetricsMonument";
import { SplitHeading } from "~/components/SplitHeading";
import { CTA, Eyebrow, QuietLink, Reveal, RevealGroup, RevealItem, Section, Plate } from "~/components/primitives";
import { DeveloperCard, InsightRow } from "~/components/cards";
import { AmeliaAsk } from "~/components/AmeliaAsk";
import { developments, developers, insights } from "~/lib/content";
import { SITE, meta as buildMeta } from "~/lib/site";

export const handle = { headerTone: "dark" as const };

export function meta() {
  return buildMeta({
    description:
      "Serene is an AI-native advisory for off-plan real estate in Dubai and Abu Dhabi. RERA-licensed, registered with the developers it represents — and incapable of a cold call.",
    path: "/",
  });
}

export default function Home() {
  const registry = developers.slice(0, 3);
  const latest = insights.slice(0, 3);

  return (
    <>
      {/* ① Cinematic hero — pinned, scroll-driven three-chapter sequence */}
      <HeroSequence />

      {/* ② Philosophy */}
      <Section>
        <div className="grid gap-10 md:grid-cols-12 md:gap-7">
          <Reveal className="md:col-span-5 md:col-start-2">
            <Eyebrow className="text-brass">The House</Eyebrow>
            <SplitHeading as="h2" className="type-headline mt-5">
              A quieter way to acquire in the Emirates.
            </SplitHeading>
            <p className="type-body-lg mt-6 text-ink/78">
              Serene is an advisory for off-plan property in Dubai and Abu Dhabi — licensed,
              registered with the developers it represents, and built on one conviction: serious
              buyers are persuaded by information, not persistence.
            </p>
            <p className="mt-4 text-[15.5px] leading-relaxed text-ink/65">
              We publish what we know. We answer what you ask. The rest is your decision, made in
              your own time.
            </p>
            <div className="mt-8">
              <QuietLink to="/about">About Serene</QuietLink>
            </div>
          </Reveal>
          <Reveal delay={0.15} className="md:col-span-5 md:col-start-8 md:mt-24">
            <Plate
              kind="stone"
              image="/images/philosophy-stone.jpg"
              alt="White stone stair in natural light"
              className="aspect-[4/5]"
              parallax
            />
          </Reveal>
        </div>
      </Section>

      {/* ③ Featured developments — pinned horizontal gallery */}
      <HorizontalShowcase developments={developments} />

      {/* ④ By the Record — animated credibility monument */}
      <MetricsMonument />

      {/* ⑤ Why Serene — the trust monument */}
      <div className="bg-ink text-ivory">
        <Section>
          <Eyebrow className="text-gold">Why Serene</Eyebrow>
          <SplitHeading as="h2" className="type-headline mt-6 max-w-[24ch]">
            Trust is a matter of record.
          </SplitHeading>
          <RevealGroup className="mt-12 grid gap-9 md:grid-cols-3">
            {[
              {
                k: "RERA LICENSED",
                copy: `${SITE.legalName} operates under ${SITE.rera.replace("RERA Licence", "RERA licence")}. Verifiable, as it should be.`,
              },
              {
                k: "REGISTERED DEVELOPERS",
                copy: "We transact only with developers we are registered with — Emaar, Aldar, Sobha, and the institutions building the Emirates.",
              },
              {
                k: "AI-NATIVE ADVISORY",
                copy: "Every question answered on demand, with data. No cold calls. No follow-up campaigns. Ever.",
              },
            ].map((item) => (
              <RevealItem key={item.k} className="border-t border-ivory/16 pt-4">
                <div className="type-data text-gold">{item.k}</div>
                <p className="mt-2.5 text-[15.5px] leading-relaxed text-ivory/75">{item.copy}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </Section>
      </div>

      {/* ⑤ Amelia — her one navy moment, now interactive */}
      <AmeliaAsk />

      {/* ⑥ The registry */}
      <Section>
        <Eyebrow className="text-brass">The Registry</Eyebrow>
        <div className="mt-9 grid gap-10 md:grid-cols-3 md:gap-7">
          {registry.map((dev, i) => (
            <Reveal key={dev.slug} delay={0.08 * i} className={i === 1 ? "md:mt-14" : ""}>
              <DeveloperCard developer={dev} />
            </Reveal>
          ))}
        </div>
        <div className="mt-11">
          <QuietLink to="/developers">The Developer Registry</QuietLink>
        </div>
      </Section>

      {/* ⑦ Insights — journal contents */}
      <Section className="pt-0">
        <Eyebrow className="text-brass">Insights</Eyebrow>
        <Reveal className="mt-7 hairline-b">
          {latest.map((i) => (
            <InsightRow key={i.slug} insight={i} />
          ))}
        </Reveal>
        <div className="mt-9">
          <QuietLink to="/insights">All Insights</QuietLink>
        </div>
      </Section>

      {/* ⑨ Final threshold */}
      <div className="bg-ink text-ivory">
        <Section className="text-center">
          <Reveal>
            <SplitHeading as="h2" className="type-display" mode="chars">
              When you have questions, ask.
            </SplitHeading>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <CTA to="/amelia?ref=home-final" kind="gold">Speak with Amelia</CTA>
              <CTA to="/contact" kind="line">Enquire</CTA>
            </div>
          </Reveal>
        </Section>
      </div>
    </>
  );
}
