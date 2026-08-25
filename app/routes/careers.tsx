import { Eyebrow, Section } from "~/components/primitives";
import { Hero } from "~/components/Hero";
import { SplitHeading } from "~/components/SplitHeading";
import { ConversationBand } from "~/components/ConversationBand";
import { SITE, meta as buildMeta } from "~/lib/site";
import roles from "../../content/careers.json";

export const handle = { headerTone: "dark" as const };

export function meta() {
  return buildMeta({
    title: "Careers",
    description:
      "Work at Serene Bay: salaried advisory roles in Dubai off-plan property, with no commission-only pay, no cold calling, and no six-figure-a-month promises.",
    path: "/careers",
  });
}

type Role = { title: string; location: string; type: string };
const ROLES: Role[] = roles as Role[];

export default function Careers() {
  return (
    <>
      <Hero plate="stone" image="/images/saadiyat-grove-residences-01.jpg" height="min-h-[58svh]">
        <Eyebrow className="text-silver">Careers</Eyebrow>
        <SplitHeading as="h1" mode="chars" className="type-display mt-5 max-w-[20ch]">
          Nobody here is paid to close.
        </SplitHeading>
      </Hero>

      <Section>
        <p className="type-body-lg max-w-[56ch] text-ink/74">
          The Dubai market recruits advisors on the promise of six figures a month and pays them
          nothing until they close. Average tenure has fallen to six months or less. We do the
          opposite: advisors are salaried, so the work is comparison, verification and long-term
          client relationships rather than a permanent hustle for survival.
        </p>
        <p className="mt-5 max-w-[56ch] text-[15.5px] leading-relaxed text-ink/65">
          That is a deliberate departure from the market-standard 40–70% commission split, and it
          attracts a specific kind of person. If you would rather be right than loud, in advisory,
          in research or in engineering, we would like to hear from you.
        </p>
      </Section>

      <Section className="pt-0">
        <Eyebrow className="text-fog">Open Positions</Eyebrow>
        <div className="mt-6 hairline-b max-w-[880px]">
          {ROLES.length > 0 ? (
            ROLES.map((r) => (
              <a
                key={r.title}
                href={`mailto:${SITE.careersEmail}?subject=${encodeURIComponent(r.title)}`}
                className="group hairline-t flex flex-wrap items-baseline gap-x-7 gap-y-1 py-5"
              >
                <span className="type-title text-[1.2rem] transition-colors group-hover:text-brass">
                  {r.title}
                </span>
                <span className="type-data ml-auto text-fog">
                  {r.location} · {r.type} →
                </span>
              </a>
            ))
          ) : (
            <p className="hairline-t py-6 text-[15.5px] text-ink/70">
              No open positions at present. Introduce yourself:{" "}
              <a href={`mailto:${SITE.careersEmail}`} className="text-brass underline underline-offset-2">
                {SITE.careersEmail}
              </a>
            </p>
          )}
        </div>
      </Section>

      <ConversationBand
        eyebrow="Or Just Introduce Yourself"
        title="If none of these fit, write anyway."
        copy="We would rather hear from someone who wants to build long client relationships and does not see a role listed, than fill a role with someone who wants a commission ladder."
        primary="Write to us"
        image="/images/about-decide.jpg"
        alt="A door standing open to warm light"
      />
    </>
  );
}
