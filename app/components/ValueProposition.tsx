import { Eyebrow, QuietLink, Reveal, Section } from "~/components/primitives";
import { SplitHeading } from "~/components/SplitHeading";
import { VALUE_PROPOSITION } from "~/lib/strategy";

/**
 * What a buyer actually receives — the four commitments restated as outcomes,
 * each set against what the market offers in its place.
 *
 * The paired "instead" line is the whole device: a value proposition that only
 * states what it gives you is a brochure, and every brokerage brochure says the
 * same four things. Naming the alternative is what makes the claim checkable.
 */
export function ValueProposition({
  eyebrow = "The Value",
  title = "What you actually get for it.",
  intro,
  tone = "light",
}: {
  eyebrow?: string;
  title?: string;
  intro?: string;
  /** "light" sits on ivory/frost; "dark" on the ink ground */
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  return (
    <Section>
      <div className="grid gap-8 md:grid-cols-12 md:gap-7">
        <Reveal className="md:col-span-5" exit>
          <Eyebrow className={dark ? "text-silver" : "text-fog"}>{eyebrow}</Eyebrow>
          <SplitHeading as="h2" className="type-display mt-5 max-w-[14ch]">
            {title}
          </SplitHeading>
        </Reveal>
        {intro && (
          <Reveal delay={0.1} className="md:col-span-6 md:col-start-7 md:pt-3">
            <p className={`type-body-lg ${dark ? "text-ivory/78" : "text-ink/74"}`}>{intro}</p>
          </Reveal>
        )}
      </div>

      <div className={`mt-11 md:mt-14 ${dark ? "hairline-b on-dark" : "hairline-b"}`}>
        {VALUE_PROPOSITION.map((v) => (
          <Reveal key={v.k}>
            <div
              className={`grid gap-4 py-9 md:grid-cols-12 md:gap-7 md:py-11 ${
                dark ? "hairline-t on-dark" : "hairline-t"
              }`}
            >
              <div className="md:col-span-4">
                <span className={`type-data ${dark ? "text-silver" : "text-fog"}`}>{v.k}</span>
                <h3 className="type-title mt-2 max-w-[20ch]">{v.title}</h3>
              </div>
              <div className="md:col-span-7 md:col-start-6">
                <p className={`type-body-lg ${dark ? "text-ivory/78" : "text-ink/76"}`}>{v.copy}</p>
                <p
                  className={`mt-5 border-l pl-5 text-[14.5px] leading-relaxed ${
                    dark ? "border-ivory/25 text-ivory/55" : "border-ink/20 text-ink/58"
                  }`}
                >
                  <span
                    className={`type-eyebrow mr-2 ${dark ? "text-silver" : "text-fog"}`}
                  >
                    Instead of
                  </span>
                  {v.instead}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-10">
        <QuietLink to="/difference" className={dark ? "text-ivory" : ""}>
          How the model makes this possible
        </QuietLink>
      </Reveal>
    </Section>
  );
}
