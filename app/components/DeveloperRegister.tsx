import { Link } from "react-router";
import { Eyebrow, QuietLink, Reveal, Section } from "~/components/primitives";
import { SplitHeading } from "~/components/SplitHeading";
import { BrandMark } from "~/components/BrandMark";
import { developers } from "~/lib/content";
import { REGISTER_INTRO } from "~/lib/strategy";

/**
 * The register, as a wall of lockups.
 *
 * The homepage does not need seven institutional profiles; it needs the reader
 * to see, in one glance, that the shortlist crosses developers. So this is the
 * marks alone, each linking to its own record. Because every logo is masked to
 * a single ink tone (see BrandMark), seven brand palettes read here as one set
 * rather than a sponsor board.
 */
export function DeveloperRegister() {
  return (
    <div className="bg-frost">
      <Section>
        <div className="grid gap-8 md:grid-cols-12 md:gap-7">
          <Reveal className="md:col-span-5" exit>
            <Eyebrow className="text-fog">{REGISTER_INTRO.eyebrow}</Eyebrow>
            <SplitHeading as="h2" className="type-display mt-5 max-w-[16ch]">
              {REGISTER_INTRO.headline}
            </SplitHeading>
          </Reveal>
          <Reveal delay={0.1} className="md:col-span-6 md:col-start-7 md:pt-3">
            <p className="type-body-lg text-ink/74">{REGISTER_INTRO.body}</p>
            <div className="mt-7">
              <QuietLink to="/developers">The full register</QuietLink>
            </div>
          </Reveal>
        </div>

        {/* Hairline cells rather than a ruled block: seven marks divide evenly
            into no common column count, and a boxed grid would leave a hole in
            the last row that has to be filled with something. On a hairline the
            absent cell is simply absent. */}
        <Reveal className="mt-12 md:mt-16">
          <ul className="grid grid-cols-2 gap-x-7 gap-y-9 sm:grid-cols-3 lg:grid-cols-4">
            {developers.map((d) => (
              <li key={d.slug} className="border-t border-ink/16">
                <Link
                  to={`/developers/${d.slug}`}
                  className="group flex flex-col items-start gap-4 pt-6"
                  aria-label={`${d.name}, the full record`}
                >
                  <BrandMark slug={d.slug} name={d.name} />
                  <span className="type-cap text-fog transition-colors duration-300 group-hover:text-brass">
                    {d.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </Section>
    </div>
  );
}
