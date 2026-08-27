import { Link } from "react-router";
import { Eyebrow, QuietLink, Reveal, Section } from "~/components/primitives";
import { SplitHeading } from "~/components/SplitHeading";
import { BrandMark, hasBrandLogo } from "~/components/BrandMark";
import { developers } from "~/lib/content";
import { REGISTER_INTRO } from "~/lib/strategy";

/**
 * The register, as a grid of marks on the frost ground.
 *
 * It was a drifting marquee, which suited seven and does not suit twenty-eight.
 * A marquee's duration has to scale with its length or it speeds up as you add
 * to it, so twenty-eight marks means a 196-second loop: any one developer is on
 * screen for a few seconds in every three and a half minutes, and a visitor who
 * scrolls past in five seconds sees two of them. That is fine for decoration and
 * useless for a claim about how many houses we are registered with — a claim
 * that only lands if you can see the set at once.
 *
 * So: a grid, which shows all of them, gains rows rather than pace as the
 * register grows, and gives every mark the same weight.
 *
 * Names carry the ones without a logo file. BrandMark falls back to the name in
 * the house light weight, which is why the grid can fill out before the artwork
 * arrives — and why the fallback has to look deliberate rather than missing.
 */
export function DeveloperRegister() {
  return (
    <div className="bg-frost">
      <Section className="pb-0">
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
      </Section>

      <Section className="pt-0">
        <Reveal className="mt-11 md:mt-14">
          {/* Column count climbs with the viewport and the rows follow the
              register, so nothing needs a filler cell. Each mark sits in a
              fixed-height box so a wordmark and a logo occupy the same space. */}
          <ul className="grid grid-cols-2 gap-x-6 gap-y-9 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {developers.map((d) => {
              // With no logo on file the mark is already the name, so the
              // caption would repeat it. Only logos get a name beneath them.
              const logo = hasBrandLogo(d.slug);
              const inner = (
                <>
                  <span className="flex h-11 items-center">
                    <BrandMark slug={d.slug} name={d.name} compact />
                  </span>
                  {logo && (
                    <span className="type-cap mt-3 block text-fog transition-colors duration-300 group-hover:text-brass">
                      {d.name}
                    </span>
                  )}
                </>
              );
              // only the researched records have a page worth opening
              return (
                <li key={d.slug} className="border-t border-ink/16 pt-5">
                  {d.profiled ? (
                    <Link
                      to={`/developers/${d.slug}`}
                      className="group block"
                      aria-label={`${d.name}, the full record`}
                    >
                      {inner}
                    </Link>
                  ) : (
                    <div className="group">{inner}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </Reveal>

        <Reveal className="mt-10">
          <QuietLink to="/developers">All {developers.length} developers</QuietLink>
        </Reveal>
      </Section>
    </div>
  );
}
