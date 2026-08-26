import { Link, useLoaderData } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { CTA, Eyebrow, Ledger, Plate, Reveal, Section } from "~/components/primitives";
import { SplitHeading } from "~/components/SplitHeading";
import { RegisterInterest } from "~/components/RegisterInterest";
import { AmeliaError, fetchProject, isAmeliaConfigured } from "~/lib/amelia.server";
import type { ProjectDetail } from "~/lib/amelia.server";
import {
  EMPTY,
  bedrooms,
  brochureHref,
  buyerPropertyHref,
  buyerSignupHref,
  humanise,
  money,
  perSqft,
  priceRange,
  text,
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
  return {
    "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=86400",
  };
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
  typeof a === "string" ? a : (a?.name ?? a?.label ?? null);

export default function Property() {
  const { project: p } = useLoaderData<typeof loader>();
  const currency = p.currency ?? "AED";
  const locality = [p.area, p.emirate].filter(Boolean).join(", ");
  const signup = buyerSignupHref(p.slug);
  const band = priceRange(p.minPrice, p.maxPrice, currency);

  /** the one marketing line the record carries, if any */
  const positioning =
    p.positioning?.signaturePositioning ||
    p.positioning?.brandedResidenceBrand ||
    p.positioning?.brandedResidence ||
    undefined;

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
          ? typeof p.totalUnits === "number"
            ? `${p.availableUnitCount} of ${p.totalUnits}`
            : `${p.availableUnitCount}`
          : null,
    },
    { k: "Built", v: typeof p.completionPct === "number" ? `${p.completionPct}% complete` : null },
  ].filter((c): c is { k: string; v: string } => Boolean(c.v));

  const amenities = (p.amenities ?? []).map(amenityName).filter(Boolean) as string[];
  const nearby = p.location?.nearbyPlaces ?? [];
  // The detail record has no featuredImageUrl (only the card does), so the hero
  // and gallery both come out of `media`. Anything that is not explicitly a
  // plan, video or tour is treated as a photograph.
  const isPhoto = (m: { kind?: string | null }) =>
    !/floor|master|video|tour/i.test(m.kind ?? "");
  const gallery = (p.media ?? []).filter((m) => m.url && isPhoto(m));
  const images = gallery.length ? gallery.map((m) => m.url) : (p.images ?? []);
  const heroImage = p.featuredImageUrl ?? images[0] ?? undefined;
  const brochures = (p.documents ?? []).filter((d) => d.url);
  const units = (p.units ?? []).filter(
    (u) => u && (u.unitNumber || u.name || u.bedrooms != null),
  );
  const plans = (p.paymentPlans ?? []).filter((pl) => (pl.milestones ?? []).length || pl.name);
  const permit = p.trust?.permit ?? p.permit ?? null;
  // `trust.rera` and `trust.escrow` are records, not strings — take the
  // printable leaf from each rather than the object itself.
  const rera = p.trust?.rera;
  const reraNumber =
    text(typeof rera === "object" && rera ? (rera as Record<string, unknown>).reraNumber : rera) ??
    text(p.trust?.reraNumber) ??
    text(p.trust?.reraRegistration);
  const reraStatus = text(
    typeof rera === "object" && rera ? (rera as Record<string, unknown>).status : null,
  );
  const escrow = p.trust?.escrow;
  const escrowName =
    text(
      typeof escrow === "object" && escrow
        ? ((escrow as Record<string, unknown>).bank ??
           (escrow as Record<string, unknown>).name ??
           (escrow as Record<string, unknown>).bankName)
        : escrow,
    ) ?? text(p.trust?.escrowBank);
  const escrowTrustee =
    text(
      typeof escrow === "object" && escrow
        ? (escrow as Record<string, unknown>).trustee
        : null,
    ) ?? text(p.trust?.escrowTrustee);
  /** the compliance line the rail carries, so the permit is visible throughout */
  const permitLine = text(permit?.number) ? `Trakheesi permit ${text(permit?.number)}` : null;
  // Media arrives typed: images are proxied and hotlinkable, while video and
  // 3D tours are external embed URLs (Matterport, YouTube) to iframe directly.
  const media = p.media ?? [];
  const floorPlans = media.filter((m) => m.url && /floor/i.test(m.kind ?? ""));
  const masterplans = media.filter((m) => m.url && /master/i.test(m.kind ?? ""));
  const embeds = media.filter(
    (m) =>
      m.url &&
      /video|tour|matterport|youtube/i.test((m.kind ?? "") + " " + (m.provider ?? "")),
  );
  const towers = (p.towers ?? []).filter((t) => t.name || (t.pricingBands ?? []).length);
  const communities = (p.communities ?? []).filter((c) => c.name);
  const construction = (p.constructionMilestones ?? []).filter((m) => m.label || m.date);
  const partners = (p.partners ?? []).filter((x) => x.name);
  const fees = (p.fees ?? []).filter((x) => x.label);

  return (
    <>
      {/* ——— the address, over its own photograph ——— */}
      <div className="relative flex min-h-[74svh] items-end overflow-hidden bg-ink text-ivory">
        <div className="absolute inset-0">
          <Plate
            kind="render"
            image={heroImage}
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
          <SplitHeading as="h1" mode="chars" className="type-display mt-6 max-w-[18ch]">
            {p.name}
          </SplitHeading>
          {band && (
            <p className="type-body-lg mt-7 text-ivory/85">
              From {band}
              {p.developer?.name ? ` · ${p.developer.name}` : ""}
            </p>
          )}
          <div className="mt-12 flex flex-wrap gap-4 md:mt-14">
            <CTA to={signup} external kind="platinum">
              Ask Amelia
            </CTA>
            <CTA to="/contact" kind="line">
              Speak to an advisor
            </CTA>
          </div>
        </div>
      </div>

      {/* ——— the offer: prose at a readable measure, the record beside it ———

           This used to be a bare Ledger floating in its own full-width band,
           then a description stretched the whole container. Both were wrong:
           seven unlabelled facts in a horizontal row is a strip of data with no
           subject, and prose at container width is 120 characters a line.

           So the facts become a rail, set vertically where a narrow column
           suits them, carrying the price, the record, the permit and the way to
           ask about it in one place.

           It sticks, but only within this section: that is what sticky does,
           and the travel is whatever the description leaves over. With a full
           fact set the rail is around 550px, so a short record gives it a couple
           of hundred pixels of hold and a wordy one gives it most of the
           section. That is the right way round — it earns its keep exactly when
           there is enough to read to lose your place in. ——— */}
      {(p.description || facts.length > 0) && (
        <Section>
          <div className="grid gap-12 md:grid-cols-12 md:gap-7">
            <div className="md:col-span-7">
              {positioning && (
                <>
                  <Reveal exit>
                    <Eyebrow className="text-fog">The Address</Eyebrow>
                  </Reveal>
                  <h2 className="type-headline mt-5 max-w-[26ch]">{positioning}</h2>
                </>
              )}
              {p.description && (
                <div className={`prose-serene whitespace-pre-line ${positioning ? "mt-8" : ""}`}>
                  {p.description}
                </div>
              )}
            </div>

            {facts.length > 0 && (
              <aside className="md:col-span-4 md:col-start-9">
                <div className="md:sticky md:top-28">
                  <Reveal>
                    <div className="border-t border-ink/18 pt-6">
                      {band && (
                        <>
                          <p className="type-eyebrow text-fog">From</p>
                          <p className="mt-1.5 font-extralight leading-none tabular-nums text-[clamp(1.6rem,2.4vw,2.1rem)]">
                            {band}
                          </p>
                        </>
                      )}
                      <dl className="mt-7 flex flex-col">
                        {facts
                          .filter((c) => c.k !== "From")
                          .map((c) => (
                            <div
                              key={c.k}
                              className="flex items-baseline justify-between gap-6 border-t border-ink/10 py-3 first:border-t-0 first:pt-0"
                            >
                              <dt className="text-[10.5px] font-semibold uppercase tracking-[0.13em] text-fog">
                                {c.k}
                              </dt>
                              <dd className="type-data text-right">{c.v}</dd>
                            </div>
                          ))}
                      </dl>
                      <CTA to={signup} external kind="platinum" className="mt-8 w-full">
                        Ask Amelia
                      </CTA>
                      {permitLine && <p className="type-cap mt-4 text-fog">{permitLine}</p>}
                    </div>
                  </Reveal>
                </div>
              </aside>
            )}
          </div>
        </Section>
      )}

      {/* ——— investment: the numbers a buyer actually weighs ——— */}
      {(p.investment || p.serviceChargePerSqft) && (
        <Block
          eyebrow="The Money"
          title="What it returns, what it holds, and how the payments fall."
          className="pt-0"
        >
          <Ledger
            cells={[
              {
                k: "Gross yield",
                v:
                  typeof (p.investment?.expectedGrossYieldPct ??
                    p.investment?.grossYieldPct) === "number"
                    ? `${p.investment?.expectedGrossYieldPct ?? p.investment?.grossYieldPct}%`
                    : null,
              },
              {
                k: "Expected rent",
                v: money(
                  p.investment?.expectedAnnualRentAed ?? p.investment?.expectedRentAnnual,
                  currency,
                ),
              },
              { k: "Service charge", v: perSqft(p.serviceChargePerSqft, currency) },
              {
                k: "Golden visa",
                v: (() => {
                  // The live field is a descriptive string; the older boolean is
                  // still honoured so both shapes render.
                  const r = p.investment?.residencyVisaEligibility;
                  if (typeof r === "string" && r.trim()) return humanise(r);
                  if (r === true || p.investment?.visaEligible) {
                    const t = money(p.investment?.visaThreshold, currency);
                    return t ? `Eligible from ${t}` : "Eligible";
                  }
                  return null;
                })(),
              },
            ].filter((c): c is { k: string; v: string } => Boolean(c.v))}
          />
        </Block>
      )}

      {/* ——— payment plans ——— */}
      {plans.length > 0 && (
        <Block title="How the payments fall." className="pt-0">
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
                          {typeof m.percentage === "number" ? `${m.percentage}%` : (m.dueOn ?? EMPTY)}
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

      {/* ——— fees ——— */}
      {fees.length > 0 && (
        <Block title="What it costs on top." className="pt-0">
          <dl>
            {fees.map((x, i) => (
              <div key={i} className="hairline-t flex flex-wrap items-baseline justify-between gap-x-6 py-3">
                <dt className="text-[15px] text-ink/78">
                  {x.label}
                  {(x.frequency || x.isOptional || x.note) && (
                    <span className="type-cap ml-2 text-fog">
                      {[humanise(x.frequency), x.isOptional ? "optional" : null, x.note]
                        .filter(Boolean)
                        .join(" · ")}
                    </span>
                  )}
                </dt>
                <dd className="type-data shrink-0 text-brass">
                  {typeof x.pctOfPrice === "number"
                    ? `${x.pctOfPrice}%`
                    : (money(x.amount, currency) ?? EMPTY)}
                </dd>
              </div>
            ))}
          </dl>
        </Block>
      )}

      {/* ——— amenities ——— */}
      {amenities.length > 0 && (
        <Block eyebrow="The Property" title="What is on the site." className="pt-0">
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
        <Block title="The units on the floor plates." className="pt-0">
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
                      <td className="py-3 pr-6">{u.unitNumber ?? u.name ?? EMPTY}</td>
                      <td className="py-3 pr-6">{u.bedrooms === 0 ? "Studio" : (u.bedrooms ?? EMPTY)}</td>
                      <td className="py-3 pr-6 tabular-nums">
                        {typeof (u.sizeSqft ?? u.areaSqft) === "number"
                          ? `${(u.sizeSqft ?? u.areaSqft)!.toLocaleString("en-GB")} sqft`
                          : EMPTY}
                      </td>
                      <td className="py-3 pr-6 tabular-nums">{money(u.price, currency) ?? EMPTY}</td>
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
        <Block title="The frames." className="pt-0">
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

      {/* ——— towers, with their per-floor pricing bands ——— */}
      {towers.length > 0 && (
        <Block title="The towers, and their price bands." className="pt-0">
          <div className="grid gap-10 md:grid-cols-2 md:gap-7">
            {towers.map((t, i) => (
              <div key={i} className="border-t border-ink/14 pt-5">
                <h3 className="type-title">{t.name ?? "Tower " + (i + 1)}</h3>
                <p className="type-cap mt-1 text-fog">
                  {[
                    t.floors ? t.floors + " floors" : null,
                    t.unitCount ? t.unitCount + " units" : null,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
                {(t.pricingBands ?? []).length > 0 && (
                  <dl className="mt-4">
                    {(t.pricingBands ?? []).map((b, j) => (
                      <div key={j} className="hairline-t flex items-baseline justify-between gap-6 py-2.5">
                        <dt className="text-[15px] text-ink/75">
                          {b.floorFrom != null && b.floorTo != null
                            ? "Floors " + b.floorFrom + "–" + b.floorTo
                            : "Pricing band"}
                        </dt>
                        <dd className="type-data shrink-0 text-brass">
                          {priceRange(b.minPrice, b.maxPrice, currency) ?? EMPTY}
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

      {/* ——— floor plans & masterplans ——— */}
      {(floorPlans.length > 0 || masterplans.length > 0) && (
        <Block title="The plans." className="pt-0">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...masterplans, ...floorPlans].slice(0, 9).map((m, i) => (
              <a
                key={m.url + i}
                href={m.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <div className="relative aspect-[4/3] overflow-hidden border border-ink/12 bg-white">
                  <img
                    src={m.url}
                    alt={m.caption ?? "Plan"}
                    loading="lazy"
                    className="h-full w-full object-contain p-3 transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <p className="type-cap mt-2 text-fog">{m.caption ?? humanise(m.kind) ?? "Plan"}</p>
              </a>
            ))}
          </div>
        </Block>
      )}

      {/* ——— video & 3D tours: external embeds, not proxied ——— */}
      {embeds.length > 0 && (
        <Block title="The walkthrough." className="pt-0">
          <div className="grid gap-6 lg:grid-cols-2">
            {embeds.slice(0, 4).map((m, i) => (
              <figure key={m.url + i}>
                <div className="relative aspect-video overflow-hidden bg-ink">
                  <iframe
                    src={m.url}
                    title={m.caption ?? (humanise(m.provider) ?? "Virtual") + " tour"}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; xr-spatial-tracking; fullscreen"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full border-0"
                  />
                </div>
                {(m.caption || m.provider) && (
                  <figcaption className="type-cap mt-2 text-fog">
                    {m.caption ?? humanise(m.provider)}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        </Block>
      )}

      {/* ——— construction progress ——— */}
      {construction.length > 0 && (
        <Block title="Where the build has reached." className="pt-0">
          <dl>
            {construction.map((m, i) => (
              <div key={i} className="hairline-t flex flex-wrap items-baseline gap-x-6 gap-y-1 py-3">
                <dt className="type-data w-[8rem] shrink-0 text-brass">{m.date ?? EMPTY}</dt>
                <dd className="flex-1 text-[15px] text-ink/78">{m.label}</dd>
                {typeof m.completedPct === "number" && (
                  <dd className="type-cap text-fog">{m.completedPct}%</dd>
                )}
              </div>
            ))}
          </dl>
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
            <Ledger
              dark
              className="mt-7"
              cells={[
                { k: "Established", v: text(p.developer.establishedYear) },
                { k: "Delivered", v: text(p.developer.projectsDelivered) },
                { k: "Headquarters", v: text(p.developer.headquarters) },
                {
                  k: "On time",
                  v:
                    typeof p.developer.onTimeDeliveryPct === "number"
                      ? `${p.developer.onTimeDeliveryPct}%`
                      : null,
                },
              ].filter((c): c is { k: string; v: string } => Boolean(c.v))}
            />
          </Section>
        </div>
      )}

      {/* ——— partners ——— */}
      {partners.length > 0 && (
        <Block title="Who else is involved." className="pt-0">
          <ul className="flex flex-wrap gap-x-10 gap-y-4">
            {partners.map((x, i) => (
              <li key={i} className="flex items-baseline gap-3">
                <span className="text-[15px] text-ink/80">{x.name}</span>
                {x.role && <span className="type-cap text-fog">{humanise(x.role)}</span>}
              </li>
            ))}
          </ul>
        </Block>
      )}

      {/* ——— location ——— */}
      {(p.location?.addressLine || p.location?.address || nearby.length > 0) && (
        <Block
          eyebrow="The Place"
          title={p.location?.addressLine ?? p.location?.address ?? undefined}
        >
          {nearby.length > 0 && (
            <dl className="grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
              {nearby.map((n, i) => (
                <div key={i} className="hairline-t flex items-baseline gap-4 py-3">
                  <dt className="type-data w-[5.5rem] shrink-0 text-brass">
                    {typeof (n.travelTimeMin ?? n.minutes) === "number"
                      ? `${n.travelTimeMin ?? n.minutes} min`
                      : typeof n.distanceKm === "number"
                        ? `${n.distanceKm} km`
                        : EMPTY}
                  </dt>
                  <dd className="text-[15px] text-ink/78">{n.name}</dd>
                </div>
              ))}
            </dl>
          )}
        </Block>
      )}

      {/* ——— communities ——— */}
      {communities.length > 0 && (
        <Block title="The community around it." className="pt-0">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {communities.map((c, i) => (
              <div key={i} className="border-t border-ink/14 pt-5">
                <h3 className="type-title text-[1.15rem]">{c.name}</h3>
                {c.description && (
                  <p className="mt-2 text-[15px] leading-relaxed text-ink/68">{c.description}</p>
                )}
              </div>
            ))}
          </div>
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
      {(text(permit?.number) || reraNumber || reraStatus || escrowName) && (
        <Block eyebrow="On the Record" title="Permit, escrow and registration.">
          <div className="grid gap-10 md:grid-cols-[1fr_auto] md:gap-16">
            <Ledger
              cells={[
                { k: "Trakheesi permit", v: text(permit?.number) },
                { k: "RERA registration", v: reraNumber ?? reraStatus },
                { k: "Escrow bank", v: escrowName },
                { k: "Escrow trustee", v: escrowTrustee },
              ].filter((c): c is { k: string; v: string } => Boolean(c.v))}
            />
            {/* A permit QR has to survive being pointed at by a phone, which
                sets its size: a Trakheesi validation URL is long enough to
                encode at around version 7 to 10, so 45 to 57 modules across.
                The old 112px gave those 2.0 to 2.5px a module, under what a
                camera decodes reliably; 192px gives 3.4 to 4.3.

                `pixelated` because the source may be smaller than we draw it,
                and smoothing an upscaled QR blurs exactly the module edges a
                scanner is looking for. The white plate guarantees the quiet
                zone whether or not the supplied image includes one. */}
            {permit?.qrImageUrl && (
              <div className="shrink-0">
                {/* the quiet zone is the wrapper's padding, not the image's:
                    padding on the image itself comes out of the code area, and
                    the code area is what a scanner has to resolve */}
                <div className="inline-block bg-white p-3">
                  <img
                    src={permit.qrImageUrl}
                    alt="Scan to verify this permit with the Dubai Land Department"
                    className="block h-44 w-44 md:h-56 md:w-56"
                    style={{ imageRendering: "pixelated" }}
                  />
                </div>
                <p className="type-cap mt-2.5 text-fog">Scan to verify with DLD</p>
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
            Verified signup: confirm your email, and your WhatsApp number where that is
            enabled, then the property opens in your portal.
            No cold calls: an advisor replies only when you ask.
          </p>
          <p className="type-cap mt-2 text-silver/70">
            Already have an account?{" "}
            <a
              href={buyerPropertyHref(p.slug)}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-ivory"
            >
              Open it in the portal ↗
            </a>
          </p>

          {/* the lighter path: no account, an advisor comes to you */}
          <div className="mx-auto mt-14 max-w-[760px] border-t border-ivory/20 pt-12 text-left">
            <h3 className="type-subhead text-center text-ivory">
              Or register interest without an account.
            </h3>
            <div className="mt-8">
              <RegisterInterest projectSlug={p.slug} projectName={p.name} />
            </div>
          </div>
        </Section>
      </div>
    </>
  );
}
