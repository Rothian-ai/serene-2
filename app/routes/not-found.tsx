import { CTA, Eyebrow, Reveal, RevealGroup, RevealItem, Section } from "~/components/primitives";
import { insights } from "~/lib/content";
import { InsightRow } from "~/components/cards";
import { meta as buildMeta } from "~/lib/site";

export const handle = { headerTone: "dark" as const };

export function meta() {
  return buildMeta({ title: "Not found", description: "This page doesn't exist." });
}

/**
 * 404 — points back into the argument rather than at inventory: the two pages
 * that carry the model, and the journal.
 */
const ROUTES = [
  { to: "/difference", label: "The Difference", copy: "Why a salaried advisory is a different business, and the full comparison." },
  { to: "/lifecycle", label: "The Lifecycle", copy: "The nine stages, six of which happen after a commission-only agent is paid." },
  { to: "/faqs", label: "Questions", copy: "Who pays the commission, whether going direct is cheaper, what follows handover." },
];

export default function NotFound() {
  const latest = insights.slice(0, 4);
  return (
    <>
      <div className="bg-ink text-ivory">
        <Section className="pt-48 text-center">
          <Eyebrow className="justify-center text-silver">404</Eyebrow>
          <h1 className="type-display mx-auto mt-6 max-w-[24ch]">
            This page doesn't exist. These do.
          </h1>
          <div className="mt-11 flex flex-wrap justify-center gap-4">
            <CTA to="/" kind="platinum">Return home</CTA>
            <CTA to="/contact" kind="line">Speak with an advisor</CTA>
          </div>
        </Section>
      </div>

      <Section>
        <RevealGroup className="grid gap-x-7 gap-y-9 md:grid-cols-3">
          {ROUTES.map((r) => (
            <RevealItem key={r.to} className="border-t border-ink/16 pt-5">
              <a href={r.to} className="group block">
                <h2 className="type-title transition-colors duration-300 group-hover:text-brass">
                  {r.label}
                </h2>
                <p className="mt-3 text-[15.5px] leading-relaxed text-ink/68">{r.copy}</p>
              </a>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {latest.length > 0 && (
        <Section className="pt-0">
          <Reveal>
            <Eyebrow className="text-fog">From the Journal</Eyebrow>
          </Reveal>
          <div className="mt-6 hairline-b max-w-[880px]">
            {latest.map((i) => (
              <InsightRow key={i.slug} insight={i} />
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
