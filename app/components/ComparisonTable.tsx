import { Reveal } from "~/components/primitives";
import { COMPARISON } from "~/lib/strategy";

/**
 * Strategy §5 — Serene Bay against the two alternatives a buyer actually
 * weighs. The house data grammar: hairline rules, tracked labels, radius 0.
 * The Serene Bay column is the only one on a raised ground, and the only one
 * carrying ink-weight text; the alternatives sit at reading weight.
 *
 * Responsive by structure, not by scroll: three columns on desktop become one
 * stacked block per dimension below lg, so nothing is hidden behind a
 * horizontal scrollbar and no column is squeezed into an unreadable measure.
 */

const HEADS = [
  { k: "Typical commission-only broker", quiet: true },
  { k: "Buying direct from the developer", quiet: true },
  { k: "Serene Bay", quiet: false },
] as const;

export function ComparisonTable() {
  return (
    <>
      {/* ——— desktop: a true table, the Serene Bay column raised. Held back to
             lg: at tablet width the three prose columns fall to ~180px each,
             which is legible but a poor read — tablets get the stacked view. ——— */}
      <div className="hidden lg:block">
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">
            How Serene Bay compares with a typical commission-only broker and with buying direct
            from the developer
          </caption>
          <thead>
            <tr>
              <th scope="col" className="w-[16%] border-b border-ink/20 pb-4 pr-6 align-bottom">
                <span className="sr-only">Dimension</span>
              </th>
              {HEADS.map((h) => (
                <th
                  key={h.k}
                  scope="col"
                  className={`w-[28%] border-b pb-4 pr-6 align-bottom text-[10.5px] font-semibold uppercase tracking-[0.13em] ${
                    h.quiet ? "border-ink/20 text-fog" : "border-brass bg-frost px-5 text-ink"
                  }`}
                >
                  {h.k}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COMPARISON.map((row) => (
              <tr key={row.dimension}>
                <th
                  scope="row"
                  className="border-b border-ink/10 py-5 pr-6 align-top text-[13px] font-semibold leading-snug"
                >
                  {row.dimension}
                </th>
                <td className="border-b border-ink/10 py-5 pr-6 align-top text-[14.5px] leading-relaxed text-ink/62">
                  {row.broker}
                </td>
                <td className="border-b border-ink/10 py-5 pr-6 align-top text-[14.5px] leading-relaxed text-ink/62">
                  {row.direct}
                </td>
                <td className="border-b border-ink/10 bg-frost px-5 py-5 align-top text-[14.5px] leading-relaxed text-ink/88">
                  {row.serene}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ——— mobile and tablet: one block per dimension, stacked ——— */}
      <div className="lg:hidden">
        {COMPARISON.map((row) => (
          <Reveal key={row.dimension}>
            <div className="hairline-t py-7">
              <h3 className="type-subhead">{row.dimension}</h3>
              <dl className="mt-4 flex flex-col gap-4">
                <div>
                  <dt className="text-[10.5px] font-semibold uppercase tracking-[0.13em] text-fog">
                    Commission-only broker
                  </dt>
                  <dd className="mt-1 text-[14.5px] leading-relaxed text-ink/62">{row.broker}</dd>
                </div>
                <div>
                  <dt className="text-[10.5px] font-semibold uppercase tracking-[0.13em] text-fog">
                    Direct from developer
                  </dt>
                  <dd className="mt-1 text-[14.5px] leading-relaxed text-ink/62">{row.direct}</dd>
                </div>
                <div className="border-l border-brass bg-frost py-3 pl-4">
                  <dt className="text-[10.5px] font-semibold uppercase tracking-[0.13em] text-ink">
                    Serene Bay
                  </dt>
                  <dd className="mt-1 text-[14.5px] leading-relaxed text-ink/88">{row.serene}</dd>
                </div>
              </dl>
            </div>
          </Reveal>
        ))}
        <div className="hairline-t" />
      </div>
    </>
  );
}
