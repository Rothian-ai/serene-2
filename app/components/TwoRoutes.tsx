import { Eyebrow, Ledger, Reveal, Section } from "~/components/primitives";
import { SplitHeading } from "~/components/SplitHeading";
import { DIRECT_REBUTTAL } from "~/lib/strategy";
import { ROUTES } from "~/lib/strategy";

/**
 * The two routes to the same building, set side by side.
 *
 * The device is the repetition: three of the four rows are identical in both
 * columns, so the one that differs is the whole argument. Route B is the raised
 * ground, as the Serene column is in the comparison table.
 *
 * It carries the going-direct headline too. This used to be two stacked
 * sections — "Buying direct does not make it cheaper" and then "Two routes. One
 * price." — which is one argument introduced twice before the reader reaches
 * the thing being argued about. ROUTES.headline is unused as a result; the
 * columns say it themselves.
 */
export function TwoRoutes() {
  return (
    <Section>
      <Reveal exit>
        <Eyebrow className="text-fog">{DIRECT_REBUTTAL.eyebrow}</Eyebrow>
        <SplitHeading as="h2" className="type-display mt-5 max-w-[22ch]">
          {DIRECT_REBUTTAL.headline}
        </SplitHeading>
        <p className="type-body-lg mt-6 max-w-[58ch] text-ink/74">{DIRECT_REBUTTAL.body}</p>
      </Reveal>

      <div className="mt-11 grid gap-8 md:mt-14 md:grid-cols-2 md:gap-7">
        {[ROUTES.direct, ROUTES.serene].map((route, i) => {
          const ours = i === 1;
          return (
            <Reveal key={route.label} delay={i * 0.08}>
              <div
                className={`h-full border p-7 md:p-9 ${
                  ours ? "border-brass bg-frost" : "border-ink/18"
                }`}
              >
                <p className={`type-eyebrow ${ours ? "text-brass" : "text-fog"}`}>{route.label}</p>
                <Ledger className="mt-6" cells={route.rows.map((r) => ({ k: r.k, v: r.v }))} />
                <p
                  className={`mt-7 text-[15px] leading-relaxed ${
                    ours ? "text-ink/76" : "text-ink/66"
                  }`}
                >
                  {route.note}
                </p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
