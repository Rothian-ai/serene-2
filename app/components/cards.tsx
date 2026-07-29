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

/* Registry row — an institution as a ledger entry: number, plate, name and
   tagline, the two facts that matter, and the arrow. The whole row is the link. */
export function DeveloperRow({ developer, index }: { developer: Developer; index: number }) {
  return (
    <Link
      to={`/developers/${developer.slug}`}
      className="group grid items-center gap-x-7 gap-y-4 border-t border-ink/14 py-7 md:grid-cols-12 md:py-8"
    >
      <span className="type-data text-brass md:col-span-1">{String(index + 1).padStart(2, "0")}</span>
      <div className="relative aspect-[16/10] overflow-hidden md:col-span-3">
        <Plate
          kind={developer.plate}
          image={developer.image}
          alt={developer.name}
          className="h-full w-full transition-transform duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
        />
      </div>
      <div className="md:col-span-4">
        <h3 className="type-title text-[1.45rem] transition-colors duration-300 group-hover:text-brass">
          {developer.name}
        </h3>
        <p className="type-cap mt-1.5 text-fog">{developer.tagline}</p>
      </div>
      <dl className="hidden gap-x-9 md:col-span-3 md:flex">
        <div>
          <dt className="text-[10.5px] font-semibold uppercase tracking-[0.13em] text-fog">Founded</dt>
          <dd className="type-data mt-1">{developer.founded}</dd>
        </div>
        <div>
          <dt className="text-[10.5px] font-semibold uppercase tracking-[0.13em] text-fog">Delivered</dt>
          <dd className="type-data mt-1">{developer.delivered}</dd>
        </div>
      </dl>
      <span
        aria-hidden
        className="hidden text-right text-ink/45 transition-all duration-300 group-hover:translate-x-1 group-hover:text-ink md:col-span-1 md:block"
      >
        →
      </span>
    </Link>
  );
}

/* Column card — the register in even columns: image, title, a line of
   description, and a full-width quiet action. Facts stay one click away. */
export function DevelopmentGridCard({ development }: { development: Development }) {
  const dev = getDeveloper(development.developer);
  return (
    <Link to={`/developments/${development.slug}`} className="group flex h-full flex-col">
      <div className="relative aspect-[4/3] overflow-hidden">
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
      <div className="type-eyebrow mt-5 text-fog">
        {development.district}, {development.city}
      </div>
      <h3 className="type-title mt-2 transition-colors duration-300 group-hover:text-brass">
        {development.title}
      </h3>
      <p className="mt-2.5 text-[15px] leading-relaxed text-ink/68">{development.excerpt}</p>
      <p className="type-cap mt-3 text-fog">
        {dev?.name ?? development.developer} · handover {development.handover} · from{" "}
        {development.priceFrom}
      </p>
      <span className="mt-auto block pt-5">
        <span className="block border border-ink/35 py-[13px] text-center text-[12px] font-semibold uppercase tracking-[0.1em] text-ink transition-colors duration-300 group-hover:border-ink group-hover:bg-ink group-hover:text-ivory">
          View the development
        </span>
      </span>
    </Link>
  );
}

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
