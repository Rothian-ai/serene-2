import { Link } from "react-router";
import { Eyebrow, QuietLink, Reveal, Section } from "~/components/primitives";
import { SplitHeading } from "~/components/SplitHeading";
import { BrandMark } from "~/components/BrandMark";
import { developers } from "~/lib/content";

/**
 * The register, as a wall of lockups.
 *
 * The homepage does not need seven institutional profiles; it needs the reader
 * to see, in one glance, that the shortlist crosses developers. So this is the
 * marks alone on one ruled grid, each linking to its own record. Because every
 * logo is masked to a single ink tone (see BrandMark), seven different brand
 * palettes read here as one set rather than a sponsor board.
 */
export function DeveloperRegister() {
  return (
    <div className="bg-frost">
      <Section>
        <div className="grid gap-8 md:grid-cols-12 md:gap-7">
          <Reveal className="md:col-span-5" exit>
            <Eyebrow className="text-fog">The register</Eyebrow>
            <SplitHeading as="h2" className="type-display mt-5 max-w-[15ch]">
              Cross-developer, on merit.
            </SplitHeading>
          </Reveal>
          <Reveal delay={0.1} className="md:col-span-6 md:col-start-7 md:pt-3">
            <p className="type-body-lg text-ink/74">
              A developer's own sales team shows you its own projects, and a commission-only agent
              favours whichever pays best. These are the houses we are registered with, each with a
              delivery record you can check.
            </p>
            <div className="mt-7">
              <QuietLink to="/developers">The full register</QuietLink>
            </div>
          </Reveal>
        </div>

        <Reveal className="mt-12 md:mt-16">
          <ul className="grid grid-cols-2 gap-px border border-ink/12 bg-ink/12 sm:grid-cols-3 lg:grid-cols-4">
            {developers.map((d) => (
              <li key={d.slug}>
                <Link
                  to={`/developers/${d.slug}`}
                  className="group flex h-full min-h-[124px] flex-col items-center justify-center gap-3 bg-frost px-5 py-9 transition-colors duration-300 hover:bg-ivory"
                  aria-label={`${d.name}, the full record`}
                >
                  <BrandMark slug={d.slug} name={d.name} />
                  <span className="type-cap text-fog transition-colors duration-300 group-hover:text-brass">
                    {d.name}
                  </span>
                </Link>
              </li>
            ))}
            {/* the grid is 7 across 4 columns, so the last cell states the rule */}
            <li className="flex min-h-[124px] items-center justify-center bg-frost px-5 py-9">
              <p className="type-cap max-w-[18ch] text-center text-ink/45">
                Selected on suitability, never on which pays us most.
              </p>
            </li>
          </ul>
        </Reveal>
      </Section>
    </div>
  );
}
