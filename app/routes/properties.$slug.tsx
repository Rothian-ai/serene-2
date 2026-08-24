import { Link, useLoaderData } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { CTA, Eyebrow, Ledger, Plate, Reveal, Section } from "~/components/primitives";
import { SplitHeading } from "~/components/SplitHeading";
import { AmeliaError, fetchProject, isAmeliaConfigured } from "~/lib/amelia.server";
import type { ProjectDetail } from "~/lib/amelia.server";
import {
  bedrooms,
  brochureHref,
  buyerSignupHref,
  humanise,
  money,
  perSqft,
  priceRange,
} from "~/lib/amelia";
import { meta as buildMeta } from "~/lib/site";
import type { Route } from "./+types/properties.$slug";

export const handle = { headerTone: "dark" as const };

export function meta({ data }: Route.MetaArgs) {
  const p = data?.project;
  if (!p) return buildMeta({ title: "Property", description: "An off-plan address." });
  const where = [p.area, p.emirate].filter(Boolean).join(", ");
  return buildMeta({
    title: p.name,
    description:
      p.description?.slice(0, 180) ||
      `${p.name}${where ? ` in ${where}` : ""}: pricing, handover and payment terms, published from the record.`,
    path: `/properties/${p.slug}`,
  });
}

/**
 * CDN caching is how this stays fast without being prerendered: the catalogue
 * changes, so the HTML must not be frozen at build time. This is the equivalent
 * of the integration guide's Next `revalidate: 300`.
 */
export function headers() {
  return { "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=600" };
}

export async function loader({ params, request }: LoaderFunctionArgs) {
  const slug = params.slug!;
  if (!isAmeliaConfigured()) throw new Response("Not Found", { status: 404 });
  let project: ProjectDetail | null;
  try {
    // `all` so Reserved/Sold arrive too and sold-out states can be rendered.
    project = await fetchProject(slug, { includeUnits: "all" }, request.signal);
  } catch (err) {
    throw new Response(
      err instanceof AmeliaError ? err.message : "The listing service is unavailable.",
      { status: 503 },
    );
  }
  // 404 covers unknown slugs, another org's slugs and unpublished drafts alike.
  if (!project) throw new Response("Not Found", { status: 404 });
  return { project };
}

/* ——— a titled band, so every section shares one rhythm ——— */

function Block({
  eyebrow,
  title,
  children,
  className = "",
}: {
  eyebrow?: string;
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Section className={className}>
      {eyebrow && (
        <Reveal exit>
          <Eyebrow className="text-fog">{eyebrow}</Eyebrow>
        </Reveal>
      )}
      {title && <h2 className="type-headline mt-5 max-w-[24ch]">{title}</h2>}
      <div className={title || eyebrow ? "mt-8" : ""}>{children}</div>
    </Section>
  );
}

const amenityName = (a: NonNullable<ProjectDetail["amenities"]>[number]) =>
  typeof a === "string" ? a : (a?.name ?? null);

export default function Property() {
  const { project: p } = useLoaderData<typeof loader>();
  const currency = p.currency ?? "AED";
  const locality = [p.area, p.emirate].filter(Boolean).join(", ");
  const signup = buyerSignupHref(p.slug);
  const band = priceRange(p.minPrice, p.maxPrice, currency);

  const facts = [
    { k: "Type", v: humanise(p.propertyType) },
    { k: "Status", v: humanise(p.status) },
    { k: "Handover", v: p.handoverQuarter },
    { k: "From", v: band },
    { k: "Per sqft", v: perSqft(p.minPricePerSqft, currency) },
    { k: "Layouts", v: bedrooms(p.availableBedrooms) },
    {
      k: "Available",
      v:
        typeof p.availableUnitCount === "number"
          ? `${p.availableUnitCount} of ${p.totalUnits ?? "—"}`
          : null,
    },
    { k: "Built", v: typeof p.completionPct === "number" ? `${p.completionPct}% complete` : null },
  ].filter((c): c is { k: string; v: string } => Boolean(c.v));

  const amenities = (p.amenities ?? []).map(amenityName).filter(Boolean) as string[];
  const nearby = p.location?.nearbyPlaces ?? [];
  const gallery = (p.media ?? []).filter((m) => m.url && /image/i.test(m.kind ?? "image"));
  const images = gallery.length ? gallery.map((m) => m.url) : (p.images ?? []);
  const brochures = (p.documents ?? []).filter((d) => d.url);
  const units = (p.units ?? []).filter((u) => u && (u.name || u.bedrooms != null));
  const plans = (p.paymentPlans ?? []).filter((pl) => (pl.milestones ?? []).length || pl.name);
  const permit = p.trust?.permit ?? p.permit ?? null;

  return (
    <>
      {/* ——— the address, over its own photograph ——— */}
      <div className="relative flex min-h-[74svh] items-end overflow-hidden bg-ink text-ivory">
        <div className="absolute inset-0">
          <Plate
            kind="render"
            image={p.featuredImageUrl ?? undefined}
            alt={p.name}
            eager
            className="h-full w-full"
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(10,21,38,0.86) 0%, rgba(10,21,38,0.45) 45%, rgba(10,21,38,0.1) 75%, transparent 90%)",
            }}
          />
        </div>
        <div className="container-site relative z-[1] pb-16 pt-40">
          <Eyebrow className="text-silver">
            <Link to="/properties" className="hover:underline">
              Properties
            </Link>
            {locality ? ` · ${locality}` : ""}
          </Eyebrow>
          <SplitHeading as="h1" mode="chars" className="type-display mt-5 max-w-[18ch]">
            {p.name}
          </SplitHeading>
          {band && (
            <p className="type-body-lg mt-6 text-ivory/85">
              From {band}
              {p.developer?.name ? ` · ${p.developer.name}` : ""}
            </p>
          )}
          <div className="mt-9 flex flex-wrap gap-4">
            <CTA to={signup} external kind="platinum">
              Ask Amelia
            </CTA>
            <CTA to="/contact" kind="line">
              Speak to an advisor
            </CTA>
          </div>
        </div>
      </div>

      {/* ——— the facts, before the prose ——— */}
      {facts.length > 0 && (
        <Section>
          <Ledger cells={facts} />
        </Section>
      )}

      {p.description && (
        <Block
          eyebrow="The Address"
          title={p.positioning?.brandedResidence || undefined}
          className="pt-0"
        >
          <div className="prose-serene whitespace-pre-line">{p.description}</div>
        </Block>
      )}

      {/* ——— investment: the numbers a buyer actually weighs ——— */}
      {(p.investment || p.serviceChargePerSqft) && (
        <Block
          eyebrow="The Numbers"
          title="What it returns, and what it costs to hold."
          className="pt-0"
        >
          <Ledger
            cells={[
              {
                k: "Gross yield",
                v:
                  typeof p.investment?.grossYieldPct === "number"
                    ? `${p.investment.grossYieldPct}%`
                    : null,
              },
              { k: "Expected rent", v: money(p.investment?.expectedRentAnnual, currency) },
              { k: "Service charge", v: perSqft(p.serviceChargePerSqft, currency) },
              {
                k: "Golden visa",
                v: p.investment?.visaEligible
                  ? `Eligible${
                      money(p.investment.visaThreshold, currency)
                        ? ` from ${money(p.investment.visaThreshold, currency)}`
                        : ""
                    }`
                  : null,
              },
            ].filter((c): c is { k: string; v: string } => Boolean(c.v))}
          />
        </Block>
      )}

      {/* ——— payment plans ——— */}
      {plans.length > 0 && (
        <Block eyebrow="The Terms" title="How the payments fall." className="pt-0">
          <div className="grid gap-10 md:grid-cols-2 md:gap-7">
            {plans.map((plan, i) => (
              <div key={i} className="border-t border-ink/14 pt-5">
                {plan.name && <h3 className="type-title">{plan.name}</h3>}
                {plan.description && (
                  <p className="mt-2 text-[15px] text-ink/70">{plan.description}</p>
                )}
                {(plan.milestones ?? []).length > 0 && (
                  <dl className="mt-5">
                    {(plan.milestones ?? []).map((m, j) => (
                      <div
                        key={j}
                        className="hairline-t flex items-baseline justify-between gap-6 py-3"
                      >
                        <dt className="text-[15px] text-ink/75">{m.label ?? "Instalment"}</dt>
                        <dd className="type-data shrink-0 text-brass">
                          {typeof m.percentage === "number" ? `${m.percentage}%` : (m.dueOn ?? "—")}
                        </dd>
                      </div>
                    ))}
                  </dl>
                )}
              </div>
            ))}
          </div>
        </Block>
      )}

      {/* ——— amenities ——— */}
      {amenities.length > 0 && (
        <Block eyebrow="Amenities" className="pt-0">
          <ul className="grid grid-cols-2 gap-x-7 gap-y-3 md:grid-cols-3 lg:grid-cols-4">
            {amenities.map((a) => (
              <li key={a} className="hairline-t py-3 text-[15px] text-ink/78">
                {a}
              </li>
            ))}
          </ul>
        </Block>
      )}

      {/* ——— availability ——— */}
      {units.length > 0 && (
        <Block eyebrow="Availability" title="The units on the floor plates." className="pt-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-[15px]">
              <thead>
                <tr className="border-b border-ink/20 text-left text-[10.5px] uppercase tracking-[0.1em] text-fog">
                  <th className="py-3 pr-6">Unit</th>
                  <th className="py-3 pr-6">Beds</th>
                  <th className="py-3 pr-6">Area</th>
                  <th className="py-3 pr-6">Price</th>
                  <th className="py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {units.slice(0, 60).map((u, i) => {
                  const taken = /reserved|sold/i.test(u.status ?? "");
                  return (
                    <tr
                      key={u.id ?? i}
                      className={`border-b border-ink/10 ${taken ? "text-ink/40" : ""}`}
                    >
                      <td className="py-3 pr-6">{u.name ?? "—"}</td>
                      <td className="py-3 pr-6">{u.bedrooms === 0 ? "Studio" : (u.bedrooms ?? "—")}</td>
                      <td className="py-3 pr-6 tabular-nums">
                        {typeof u.areaSqft === "number"
                          ? `${u.areaSqft.toLocaleString("en-GB")} sqft`
                          : "—"}
                      </td>
                      <td className="py-3 pr-6 tabular-nums">{money(u.price, currency) ?? "—"}</td>
                      <td className="py-3">{humanise(u.status) ?? "Available"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {units.length > 60 && (
            <p className="type-cap mt-4 text-fog">
              Showing 60 of {units.length}. Amelia holds the full schedule.
            </p>
          )}
        </Block>
      )}

      {/* ——— gallery ——— */}
      {images.length > 0 && (
        <Block eyebrow="The Frames" className="pt-0">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {images.slice(0, 9).map((src, i) => (
              <div key={`${src}-${i}`} className="relative aspect-[4/3] overflow-hidden">
                <Plate
                  kind="render"
                  image={src}
                  alt={`${p.name}, view ${i + 1}`}
                  className="h-full w-full"
                />
              </div>
            ))}
          </div>
        </Block>
      )}

      {/* ——— developer ——— */}
      {p.developer?.name && (
        <div className="bg-ink text-ivory">
          <Section>
            <Eyebrow className="text-silver">The Developer</Eyebrow>
            <h2 className="type-headline mt-4">{p.developer.name}</h2>
            {p.developer.description && (
              <p className="type-body-lg mt-5 max-w-[62ch] text-ivory/78">
                {p.developer.description}
              </p>
            )}
          </Section>
        </div>
      )}

      {/* ——— location ——— */}
      {(p.location?.address || nearby.length > 0) && (
        <Block eyebrow="The Location" title={p.location?.address ?? undefined}>
          {nearby.length > 0 && (
            <dl className="grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
              {nearby.map((n, i) => (
                <div key={i} className="hairline-t flex items-baseline gap-4 py-3">
                  <dt className="type-data w-[5.5rem] shrink-0 text-brass">
                    {typeof n.minutes === "number"
                      ? `${n.minutes} min`
                      : typeof n.distanceKm === "number"
                        ? `${n.distanceKm} km`
                        : "—"}
                  </dt>
                  <dd className="text-[15px] text-ink/78">{n.name}</dd>
                </div>
              ))}
            </dl>
          )}
        </Block>
      )}

      {/* ——— documents ——— */}
      {brochures.length > 0 && (
        <Block eyebrow="Documents" className="pt-0">
          <ul className="flex flex-wrap gap-4">
            {brochures.map((d, i) => (
              <li key={i}>
                <a
                  href={d.url!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-ink/30 px-5 py-3 text-[12.5px] font-semibold uppercase tracking-[0.1em] transition-colors hover:border-ink"
                >
                  {d.title ?? "Brochure"} ↗
                </a>
              </li>
            ))}
          </ul>
        </Block>
      )}

      {/* ——— trust: the compliance record, stated plainly ——— */}
      {(permit?.number || p.trust?.reraRegistration || p.trust?.escrowBank) && (
        <Block eyebrow="On the Record" title="Permit, escrow and registration.">
          <div className="grid gap-10 md:grid-cols-[1fr_auto] md:gap-16">
            <Ledger
              cells={[
                { k: "Trakheesi permit", v: permit?.number },
                { k: "RERA registration", v: p.trust?.reraRegistration },
                { k: "Escrow bank", v: p.trust?.escrowBank },
                { k: "Escrow trustee", v: p.trust?.escrowTrustee },
              ].filter((c): c is { k: string; v: string } => Boolean(c.v))}
            />
            {permit?.qrImageUrl && (
              <div className="shrink-0">
                <img src={permit.qrImageUrl} alt="DLD verification QR code" className="h-28 w-28" />
                <p className="type-cap mt-2 text-fog">Scan to verify with DLD</p>
              </div>
            )}
          </div>
          {permit?.verificationUrl && (
            <p className="type-cap mt-6">
              <a
                href={permit.verificationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brass underline underline-offset-2"
              >
                Verify this listing with the Dubai Land Department ↗
              </a>
            </p>
          )}
        </Block>
      )}

      {/* ——— the threshold: into the buyer portal ——— */}
      <div className="bg-navy text-ivory">
        <Section className="text-center">
          <h2 className="type-headline mx-auto max-w-[26ch]">Ask anything about {p.name}.</h2>
          <p className="type-body-lg mx-auto mt-6 max-w-[52ch] text-ivory/78">
            Create your buyer account and Amelia opens on this address: payment schedule, escrow
            filing and the comparable resale record, answered on demand.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <CTA to={signup} external kind="platinum">
              Ask Amelia
            </CTA>
            <CTA to={brochureHref(p.slug)} external kind="line">
              View the brochure
            </CTA>
          </div>
          <p className="type-cap mt-5 text-silver">
            Verified signup. No cold calls: an advisor replies only when you ask.
          </p>
        </Section>
      </div>
    </>
  );
}
