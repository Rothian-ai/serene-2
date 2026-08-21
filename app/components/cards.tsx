import { Link } from "react-router";
import { Plate } from "~/components/primitives";
import type { Insight } from "~/lib/content";
import { formatDate } from "~/lib/content";

/* The journal's two card grammars. The development/developer cards that used to
   live here went with the inventory: the beta site is informative and carries
   neither listings nor developer partnerships. */

/* Journal card — image-led, for the home grid. */
export function InsightCard({ insight }: { insight: Insight }) {
  return (
    <Link to={`/insights/${insight.slug}`} className="group flex h-full flex-col">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Plate
          kind={insight.plate}
          image={insight.image}
          alt=""
          className="h-full w-full transition-transform duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
        />
      </div>
      <div className="type-eyebrow mt-5 text-fog">
        {insight.category} · {formatDate(insight.date)}
      </div>
      <h3 className="type-title mt-2.5 text-[1.25rem] transition-colors duration-300 group-hover:text-brass">
        {insight.title}
      </h3>
      <p className="mt-2.5 text-[15px] leading-relaxed text-ink/68">{insight.excerpt}</p>
      <span className="type-cap mt-4 text-fog">{insight.readingTime}</span>
    </Link>
  );
}

/* Journal-contents row — ledger grammar, not a blog card. */
export function InsightRow({ insight }: { insight: Insight }) {
  return (
    <Link
      to={`/insights/${insight.slug}`}
      className="group hairline-t flex flex-wrap items-baseline gap-x-7 gap-y-1 py-4"
    >
      <span className="type-data w-[150px] shrink-0 text-brass">
        {insight.category.toUpperCase()}
      </span>
      <span className="type-title min-w-0 flex-1 basis-64 text-[1.2rem] transition-colors group-hover:text-brass">
        {insight.title}
      </span>
      <span className="type-cap text-fog">{formatDate(insight.date)}</span>
    </Link>
  );
}
