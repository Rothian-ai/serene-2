import { Link } from "react-router";
import { Ledger, Plate } from "~/components/primitives";
import type { Development, Developer, Insight } from "~/lib/content";
import { formatDate, getDeveloper } from "~/lib/content";

/* Editorial development card — flat, image-led, whole card is the link. */
export function DevelopmentCard({
  development,
  aspect = "aspect-[16/10]",
  compact = false,
}: {
  development: Development;
  aspect?: string;
  compact?: boolean;
}) {
  const dev = getDeveloper(development.developer);
  return (
    <Link to={`/developments/${development.slug}`} className="group block">
      <div className={`relative overflow-hidden ${aspect}`}>
        <Plate
          kind={development.plate}
          image={development.image}
          alt={development.title}
          className="h-full w-full transition-transform duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: "linear-gradient(to top, rgba(10,21,38,0.42), transparent 58%)" }}
        />
      </div>
      <h3 className={`type-title mt-4 transition-colors duration-300 group-hover:text-brass ${compact ? "text-[1.25rem]" : ""}`}>
        {development.title}
      </h3>
      {compact ? (
        <p className="type-cap mt-1.5 text-fog">
          {development.district}, {development.city} · {dev?.name} · from {development.priceFrom}
        </p>
      ) : (
        <Ledger
          className="mt-3"
          cells={[
            { k: "District", v: development.district },
            { k: "Developer", v: dev?.name ?? development.developer },
            { k: "Handover", v: development.handover },
            { k: "From", v: development.priceFrom },
          ]}
        />
      )}
    </Link>
  );
}

/* Registry card — an institution, identity-led. */
export function DeveloperCard({ developer }: { developer: Developer }) {
  return (
    <Link to={`/developers/${developer.slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden">
        <Plate
          kind={developer.plate}
          image={developer.image}
          alt={developer.name}
          className="h-full w-full transition-transform duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: "linear-gradient(to top, rgba(10,21,38,0.42), transparent 58%)" }}
        />
      </div>
      <h3 className="type-title mt-4 text-[1.35rem] transition-colors duration-300 group-hover:text-brass">
        {developer.name}
      </h3>
      <p className="type-cap mt-1 text-fog">{developer.tagline}</p>
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
