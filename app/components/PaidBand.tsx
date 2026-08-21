import { Counter } from "~/components/Counter";
import { SplitHeading } from "~/components/SplitHeading";
import { Eyebrow, QuietLink, Reveal, RevealGroup, RevealItem, Section } from "~/components/primitives";

/**
 * "How we are paid" — the commercial-transparency band, on navy.
 *
 * This is the surface that used to be Amelia's. It now carries the one thing a
 * buyer most needs stated without euphemism: who pays us, how much, and what
 * happens to that money once it arrives. Strategy §3 and §6.
 *
 * The three figures count up on scroll-in. Two of them are deliberately not
 * numbers you can climb — AED 0 and "salary" — which is the point of the band.
 */

const CARDS = [
  {
    eyebrow: "The money",
    title: "The developer pays, as always",
    copy: "Off-plan commission is budgeted into the developer's own project economics and paid to whichever broker introduces the buyer. That does not change with us, and it is not added to your price.",
  },
  {
    eyebrow: "The difference",
    title: "It funds salaries, not a race",
    copy: "That revenue pays a salaried advisory team. No advisor's income moves because you chose one project over another, or because you signed this month rather than next.",
  },
  {
    eyebrow: "The consequence",
    title: "Nothing to hand back",
    copy: "Kickbacks happen when agents compete by returning slices of their own commission. Our advisors have no commission to slice, so the behaviour is not discouraged here — it is unavailable.",
  },
];

export function PaidBand() {
  return (
    <div className="bg-navy text-ivory">
      <Section>
        <div className="grid gap-8 md:grid-cols-12 md:gap-7">
          <Reveal className="md:col-span-5" exit>
            <Eyebrow className="text-silver">How We Are Paid</Eyebrow>
            <SplitHeading as="h2" className="type-display mt-5 max-w-[14ch]">
              Stated plainly, because it is the whole point.
            </SplitHeading>
          </Reveal>
          <Reveal delay={0.1} className="md:col-span-6 md:col-start-7 md:pt-3">
            <p className="type-body-lg text-ivory/78">
              You pay us nothing on an off-plan purchase — the developer does, exactly as it would
              any broker. What is different is what happens to that money once it reaches us.
            </p>
            <div className="mt-9 flex flex-wrap gap-x-12 gap-y-6">
              <div>
                <div className="font-extralight leading-none tabular-nums text-[clamp(1.9rem,3vw,2.6rem)] text-ivory">
                  AED&nbsp;<Counter to={0} />
                </div>
                <p className="type-cap mt-2 text-silver">payable by you</p>
              </div>
              <div>
                <div className="font-extralight leading-none tabular-nums text-[clamp(1.9rem,3vw,2.6rem)] text-dawn">
                  <Counter to={2} suffix="–8%" />
                </div>
                <p className="type-cap mt-2 text-silver">paid to us by the developer</p>
              </div>
              <div>
                <div className="font-extralight leading-none text-[clamp(1.9rem,3vw,2.6rem)] text-ivory">
                  Salary
                </div>
                <p className="type-cap mt-2 text-silver">how the advisor is paid</p>
              </div>
            </div>
          </Reveal>
        </div>

        <RevealGroup className="mt-12 grid gap-x-7 gap-y-9 md:mt-16 md:grid-cols-3">
          {CARDS.map((c) => (
            <RevealItem key={c.eyebrow} className="border-t border-ivory/18 pt-5">
              <p className="type-cap text-dawn">{c.eyebrow}</p>
              <h3 className="type-title mt-2">{c.title}</h3>
              <p className="mt-3 text-[15.5px] leading-relaxed text-ivory/72">{c.copy}</p>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal className="mt-11">
          <QuietLink to="/difference" className="text-ivory">
            The full comparison
          </QuietLink>
        </Reveal>
      </Section>
    </div>
  );
}
