import { Link } from "react-router";
import { Ledger, Plate } from "~/components/primitives";
import type { ProjectCard } from "~/lib/amelia.server";
import { EMPTY, bedrooms, humanise, permitLabel, priceRange } from "~/lib/amelia";

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
      k: "Available",
      v:
        typeof project.availableUnitCount === "number"
          ? typeof project.totalUnits === "number"
            ? `${project.availableUnitCount} of ${project.totalUnits}`
            : `${project.availableUnitCount}`
          : null,
    },
  ].filter((c): c is { k: string; v: string } => Boolean(c.v));

  return (
    <Link to={`/properties/${project.slug}`} className="group flex h-full flex-col">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Plate
          kind="render"
          image={project.featuredImageUrl ?? undefined}
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
        <p className="type-cap mt-1.5 text-fog">{project.developer.name}</p>
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
