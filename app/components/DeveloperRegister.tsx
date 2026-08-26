import { Link } from "react-router";
import { Eyebrow, QuietLink, Reveal, Section } from "~/components/primitives";
import { SplitHeading } from "~/components/SplitHeading";
import { BrandMark } from "~/components/BrandMark";
import { developers } from "~/lib/content";
import { REGISTER_INTRO } from "~/lib/strategy";

/**
 * The register, inside the house's framed panel.
 *
 * Three constraints shaped this. It cannot be another top-rule grid, because
 * the homepage already runs four of those in sequence. It cannot be a band on
 * ink: the page opens and closes on ink, so a third dark stretch between them
 * reads as a stripe rather than a section, and ink here carries the arguments.
 * And it has to survive the register growing.
 *
 * That last one ruled out the drifting band this replaces. A marquee's duration
 * is fixed for one full translate, so seven marks drift and thirty blur past at
 * four times the speed — it degrades precisely as the register fills up. A
 * frame with a reflowing grid gains a row instead, which is the behaviour you
 * want from a list that is meant to get longer.
 *
 * The frame is the site's existing monument device (the licensing ledger, the
 * payment-plan checklist, the two routes), so it breaks the hairline run
 * without introducing a new one.
 */

/**
 * How many marks the homepage carries before it defers to /developers. Seven
 * fit today, so nothing is hidden; the count in the link keeps it honest once
 * they do not.
 */
const ON_HOMEPAGE = 12;

export function DeveloperRegister() {
  const shown = developers.slice(0, ON_HOMEPAGE);
  const hidden = developers.length - shown.length;

  return (
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
        </Reveal>
      </div>

      <Reveal className="mt-11 md:mt-14">
        <div className="border border-ink/18 p-8 md:p-12">
          {/* the column count climbs with the viewport, and the grid gains rows
              as the register does — no cell ever needs filling */}
          <ul className="grid grid-cols-2 gap-x-8 gap-y-11 sm:grid-cols-3 lg:grid-cols-4">
            {shown.map((d) => (
              <li key={d.slug}>
                <Link
                  to={`/developers/${d.slug}`}
                  className="group flex flex-col items-center gap-3.5 text-center"
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
        </div>
      </Reveal>

      <Reveal className="mt-9">
        <QuietLink to="/developers">
          {hidden > 0 ? `All ${developers.length} developers` : "The full register"}
        </QuietLink>
      </Reveal>
    </Section>
  );
}
