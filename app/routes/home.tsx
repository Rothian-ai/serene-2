import { Link } from "react-router";
import { Hero } from "~/components/Hero";
import { CTA, Eyebrow, QuietLink, Reveal, RevealGroup, RevealItem, Section, Plate } from "~/components/primitives";
import { DevelopmentCard, DeveloperCard, InsightRow } from "~/components/cards";
import { AMELIA_QUESTIONS, QuestionSettle } from "~/components/AmeliaBand";
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
  const featured = developments.slice(0, 3);
  const registry = developers.slice(0, 3);
  const latest = insights.slice(0, 3);

  return (
    <>
      {/* ① Cinematic hero */}
      <Hero plate="hero" direction="photography · slow aerial, dusk facade, glass & water">
        <h1 className="type-display-xl max-w-[14ch]">The address is only the beginning.</h1>
        <p className="type-body-lg mt-6 max-w-[44ch] text-ivory/80">
          Off-plan property in Dubai and Abu Dhabi, advised with data and held to a single
          standard: you will never receive a call you didn't ask for.
        </p>
        <div className="mt-9">
          <CTA to="/developments" kind="line">Explore Developments</CTA>
        </div>
      </Hero>

      {/* ② Philosophy */}
      <Section>
        <div className="grid gap-10 md:grid-cols-12 md:gap-7">
          <Reveal className="md:col-span-5 md:col-start-2">
            <Eyebrow className="text-brass">The House</Eyebrow>
            <h2 className="type-headline mt-5">A quieter way to acquire in the Emirates.</h2>
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
            <Plate kind="stone" alt="" className="aspect-[4/5]" />
          </Reveal>
        </div>
      </Section>

      {/* ③ Featured developments */}
      <Section className="pt-0">
        <Eyebrow className="text-brass">Current Developments</Eyebrow>
        <div className="mt-9 grid gap-10 md:grid-cols-12 md:gap-7">
          {featured[0] && (
            <Reveal className="md:col-span-7">
              <DevelopmentCard development={featured[0]} />
            </Reveal>
          )}
          <div className="flex flex-col gap-11 md:col-span-4 md:col-start-9 md:mt-28">
            {featured.slice(1).map((d, i) => (
              <Reveal key={d.slug} delay={0.1 * (i + 1)}>
                <DevelopmentCard development={d} aspect="aspect-[4/5]" compact />
              </Reveal>
            ))}
          </div>
        </div>
        <div className="mt-11">
          <QuietLink to="/developments">All Developments</QuietLink>
        </div>
      </Section>

      {/* ④ Why Serene — the trust monument */}
      <div className="bg-ink text-ivory">
        <Section>
          <Eyebrow className="text-gold">Why Serene</Eyebrow>
          <Reveal>
            <h2 className="type-headline mt-6 max-w-[24ch]">Trust is a matter of record.</h2>
          </Reveal>
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

      {/* ⑤ Amelia — her one navy moment */}
      <div className="bg-navy text-ivory">
        <Section>
          <Eyebrow className="text-gold">Amelia</Eyebrow>
          <div className="mt-10 max-w-[820px]">
            <QuestionSettle questions={AMELIA_QUESTIONS} />
            <Reveal delay={0.2}>
              <p className="type-body-lg mt-11 max-w-[48ch] text-ivory/82">
                Ask anything. Amelia answers with data — at midnight, in detail, without ever
                placing a call.
              </p>
              <div className="mt-8">
                <CTA to="/amelia?ref=home" kind="gold">Speak with Amelia</CTA>
              </div>
            </Reveal>
          </div>
        </Section>
      </div>

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

      {/* ⑧ Final threshold */}
      <div className="bg-ink text-ivory">
        <Section className="text-center">
          <Reveal>
            <h2 className="type-display">When you have questions, ask.</h2>
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
