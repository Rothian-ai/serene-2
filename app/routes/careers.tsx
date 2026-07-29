import { Eyebrow, Section } from "~/components/primitives";
import { SITE, meta as buildMeta } from "~/lib/site";
import roles from "../../content/careers.json";

export const handle = { headerTone: "light" as const };

export function meta() {
  return buildMeta({
    title: "Careers",
    description:
      "Work at Serene, a small advisory holding itself to an unusual standard: no cold calls, no pressure, information first.",
    path: "/careers",
  });
}

type Role = { title: string; location: string; type: string };
const ROLES: Role[] = roles as Role[];

export default function Careers() {
  return (
    <>
      <Section className="pt-40">
        <Eyebrow className="text-fog">Careers</Eyebrow>
        <h1 className="type-display mt-6 max-w-[18ch]">Composure is a discipline.</h1>
        <p className="type-body-lg mt-6 max-w-[54ch] text-ink/70">
          We are a small house with an unusual rule: nobody here chases anybody. If you would
          rather be right than loud, in research, in engineering, in advisory, we would like
          to hear from you.
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
    </>
  );
}
