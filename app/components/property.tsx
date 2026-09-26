import { Link } from "react-router";
import { Ledger, Plate } from "~/components/primitives";
import type { ProjectCard } from "~/lib/amelia.server";
import { bedrooms, humanise, permitLabel, priceRange, sizedImage, sizedSrcSet } from "~/lib/amelia";

/**
 * Listing card — the journal card's grammar applied to inventory: image, a
 * tracked locality eyebrow, the name, then facts in the ledger. Every cell is
 * dropped when the catalogue doesn't provide it, so a sparse record still reads
 * as a composed card rather than one full of blanks.
 */
export function PropertyCard({ project }: { project: ProjectCard }) {
  const locality = [project.area, project.emirate].filter(Boolean).join(", ");
  const cells = [
    { k: "From", v: priceRange(project.minPrice, project.maxPrice, project.currency ?? "AED") },
    { k: "Handover", v: project.handoverQuarter },
    { k: "Layouts", v: bedrooms(project.availableBedrooms) },
    {
      k: project.availableUnitCount === 0 ? "Availability" : "Available",
      v:
        project.availableUnitCount === 0
          ? "Sold out"
          : typeof project.availableUnitCount === "number"
            ? typeof project.totalUnits === "number"
              ? `${project.availableUnitCount} of ${project.totalUnits}`
              : `${project.availableUnitCount}`
            : null,
    },
  ].filter((c): c is { k: string; v: string } => Boolean(c.v));

  /* `prefetch="intent"` starts the loader fetch on hover or touch-start
     rather than on click. A warm entry is ~50ms either way, but on a cold
     one this buys back whatever the visitor spends deciding, against a ten
     second wait. */
  return (
    <Link
      to={`/properties/${project.slug}`}
      prefetch="intent"
      className="group flex h-full flex-col"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        {/* Sized variants: the card can display ~600px; the original is
            multi-MB photography. */}
        <Plate
          kind="render"
          image={sizedImage(project.featuredImageUrl, 960)}
          srcSet={sizedSrcSet(project.featuredImageUrl, [480, 960, 1280])}
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          alt={project.name}
          className="h-full w-full transition-transform duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
        />
        {project.status && (
          <span className="pill pill-blue absolute left-4 top-4">{humanise(project.status)}</span>
        )}
      </div>

      {locality && <div className="type-eyebrow mt-5 text-fog">{locality}</div>}
      <h3 className="type-title mt-2.5 text-[1.25rem] transition-colors duration-300 group-hover:text-brass">
        {project.name}
      </h3>
      {project.developer?.name && (
        <p className="type-cap mt-1.5 flex items-center gap-2 text-fog">
          {/* The catalogue files artwork for every developer now. Light artwork
              (`logoOnDark`) stands on a small ink chip; dark artwork sits
              straight on the ivory card. */}
          {project.developer.logoUrl && (
            <span
              className={`inline-flex h-5 shrink-0 items-center ${
                project.developer.logoOnDark ? "bg-ink px-1.5" : ""
              }`}
            >
              <img
                src={project.developer.logoUrl}
                alt=""
                loading="lazy"
                className="h-3.5 w-auto max-w-[76px] object-contain"
              />
            </span>
          )}
          {project.developer.name}
        </p>
      )}

      {cells.length > 0 && <Ledger className="mt-4" cells={cells} />}

      {/* The permit is what makes the listing lawful to publish; it stays on the
          card, not buried on the detail page. */}
      {permitLabel(project.permit?.number) && (
        <p className="type-cap mt-3 text-fog/80">{permitLabel(project.permit?.number)}</p>
      )}
    </Link>
  );
}
