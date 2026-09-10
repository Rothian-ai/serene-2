import { useEffect, useState } from "react";
import { Link, data, useLoaderData } from "react-router";
import type { HeadersArgs, LoaderFunctionArgs } from "react-router";
import { CTA, Eyebrow, Ledger, Plate, Reveal, Section } from "~/components/primitives";
import { SplitHeading } from "~/components/SplitHeading";
import { RegisterInterest } from "~/components/RegisterInterest";
import { PropertyGallery } from "~/components/PropertyGallery";
import { AmeliaError, fetchProject, isAmeliaConfigured, serverTiming } from "~/lib/amelia.server";
import type { MediaItem, ProjectDetail, Timing } from "~/lib/amelia.server";
import { permitQr } from "~/lib/qr.server";
import { track } from "~/lib/analytics";
import {
  EMPTY,
  amenityName,
  bedrooms,
  brochureHref,
  buyerPropertyHref,
  buyerSignupHref,
  tryAmeliaHref,
  dateLabel,
  humanise,
  money,
  perSqft,
  priceRange,
  text,
} from "~/lib/amelia";
import { CHAT_FIRST, WHATSAPP_ASIDE, conversationHref, meta as buildMeta } from "~/lib/site";
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
// One hour at the edge (see properties.tsx for the reasoning).
const FRESH = "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400";
// Failure states must never pin the cache — same constant the list uses.
const BRIEF = "public, max-age=0, s-maxage=15";

export function headers({ loaderHeaders }: HeadersArgs) {
  const out: Record<string, string> = {
    "Cache-Control": loaderHeaders.get("Cache-Control") ?? FRESH,
  };
  // See the note on the register: this says whether a slow render was the
  // catalogue's time or ours, and it survives into the cached copy.
  const timing = loaderHeaders.get("Server-Timing");
  if (timing) out["Server-Timing"] = timing;
  return out;
}

export async function loader({ params, request }: LoaderFunctionArgs) {
  const slug = params.slug!;
  if (!isAmeliaConfigured()) throw new Response("Not Found", { status: 404 });
  const timing: Timing = { upstreamMs: 0, shapeMs: 0 };
  let project: ProjectDetail | null;
  try {
    // `all` so Reserved/Sold arrive too and sold-out states can be rendered.
    project = await fetchProject(slug, { includeUnits: "all" }, request.signal, timing);
  } catch (err) {
    throw new Response(
      err instanceof AmeliaError ? err.message : "The listing service is unavailable.",
      { status: 503, headers: { "Cache-Control": BRIEF } },
    );
  }
  // 404 covers unknown slugs, another org's slugs and unpublished drafts alike.
  if (!project) throw new Response("Not Found", { status: 404 });

  // Drawn here rather than in the component so the encoder stays off the
  // browser bundle, and so it is computed once per origin render rather than
  // once per hydration.
  const permit = project.trust?.permit ?? project.permit ?? null;
  const qr = permit?.qrImageUrl ? null : permitQr(permit?.verificationUrl);

  return data(
    { project, qr },
    { headers: { "Cache-Control": FRESH, "Server-Timing": serverTiming(timing) } },
  );
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

/**
 * The developer's descriptions run to four hundred words, and holding a reader
 * at the top of the page behind all of them buried the photography and the
 * record. So the prose folds: a dozen lines stand, and the rest opens on
 * request. The full text is always in the document — the fold is a style, not
 * a truncation — so search engines and find-in-page read every word.
 */
function FoldedProse({ body }: { body: string }) {
  const [open, setOpen] = useState(false);
  const folds = body.length > 700;
  return (
    <div>
      <div
        className={`prose-serene whitespace-pre-line ${folds && !open ? "line-clamp-[12]" : ""}`}
      >
        {body}
      </div>
      {folds && (
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="group mt-6 inline-flex cursor-pointer items-center gap-2.5 border-b border-gold pb-1.5 text-[12.5px] font-semibold uppercase tracking-[0.1em] text-brass"
        >
          {open ? "Read less" : "Read more"}
          <span
            aria-hidden
            className="transition-transform duration-300 group-hover:translate-y-[2px]"
          >
            {open ? "↑" : "↓"}
          </span>
        </button>
      )}
    </div>
  );
}

/** "what it returns" + "how the payments fall" → the section's one sentence. */
function moneySentence(parts: string[]): string | null {
  if (parts.length === 0) return null;
  const joined =
    parts.length === 1 ? parts[0] : `${parts.slice(0, -1).join(", ")}, and ${parts[parts.length - 1]}`;
  return joined.charAt(0).toUpperCase() + joined.slice(1) + ".";
}

const isNum = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

/** How many amenities stand before the list folds behind "+N more". */
const AMENITY_FOLD = 15;

export default function Property() {
  const { project: p, qr } = useLoaderData<typeof loader>();
  const [allAmenities, setAllAmenities] = useState(false);

  // The detail record nests money under `pricing`; the flat fields are the
  // card's shape, kept as fallbacks so either payload renders.
  const pricing = p.pricing ?? null;
  const currency = pricing?.currency ?? p.currency ?? "AED";
  const locality = [p.area, p.emirate].filter(Boolean).join(", ");
  const signup = buyerSignupHref(p.slug);
  // Chat-first: "Ask Amelia" opens the no-account chat on this property; the
  // verified signup stays one line down for anyone who wants the portal now.
  const ask = CHAT_FIRST ? tryAmeliaHref({ slug: p.slug, via: "property" }) : signup;

  /* Which address was read, not merely that /properties/<something> was.
     page_view carries the path; GA4 reports on it as an opaque string, so the
     developer and the price band have to be sent as parameters to be able to
     ask "which projects get looked at" rather than "which URLs". */
  useEffect(() => {
    track("property_view", {
      project: p.slug,
      name: p.name,
      developer: p.developer?.name,
      area: p.area,
      emirate: p.emirate,
    });
  }, [p.slug, p.name, p.developer?.name, p.area, p.emirate]);

  /* The platinum CTA leaves for the Amelia domain, so the delegated listener
     reports it as ask_agent_click — accurate, but it cannot know which property
     the visitor was standing on. This qualifies it; `place` separates the hero
     from the sticky rail and the closing band, which is the only way to learn
     how far down the page the decision is actually made. */
  const enquire = (place: string) => () =>
    track("property_enquiry", { project: p.slug, name: p.name, place, mode: CHAT_FIRST ? "chat" : "signup" });

  const units = (p.units ?? []).filter(
    (u) => u && (u.unitNumber || u.name || u.bedrooms != null),
  );
  const availableUnits = units.filter((u) => !/reserved|sold/i.test(u.status ?? ""));

  // When the developer has not filed a band, the schedule of listed units IS
  // the price range — an address headlined by no figure was this page's most
  // conspicuous silence. Available units set the band; a sold-out property
  // falls back to what its units went for.
  const pricedFrom = (availableUnits.length ? availableUnits : units)
    .map((u) => u.price)
    .filter(isNum);
  const bandMin = pricing?.minPrice ?? p.minPrice ?? (pricedFrom.length ? Math.min(...pricedFrom) : null);
  const bandMax = pricing?.maxPrice ?? p.maxPrice ?? (pricedFrom.length ? Math.max(...pricedFrom) : null);
  const band = priceRange(bandMin, bandMax, currency);

  const unitRates = (availableUnits.length ? availableUnits : units)
    .map((u) => u.pricePerSqft)
    .filter(isNum);
  const perSqftMin = p.minPricePerSqft ?? (unitRates.length ? Math.min(...unitRates) : null);

  const layoutBeds =
    p.availableBedrooms ??
    (availableUnits.length
      ? [...new Set(availableUnits.map((u) => u.bedrooms).filter(isNum))]
      : null);
  const availableCount = p.unitCounts?.available ?? p.availableUnitCount ?? null;

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
    { k: "Per sqft", v: perSqft(perSqftMin, currency) },
    { k: "Layouts", v: bedrooms(layoutBeds) },
    {
      k: "Available",
      v:
        typeof availableCount === "number"
          ? typeof p.totalUnits === "number"
            ? `${availableCount} of ${p.totalUnits}`
            : `${availableCount}`
          : null,
    },
    { k: "Built", v: typeof p.completionPct === "number" ? `${p.completionPct}% complete` : null },
  ].filter((c): c is { k: string; v: string } => Boolean(c.v));

  const amenities = (p.amenities ?? [])
    .map(amenityName)
    .filter((x): x is string => Boolean(x));
  const nearby = p.nearbyPlaces ?? p.location?.nearbyPlaces ?? [];

  // Media arrives typed (`type` in the current record, `kind` in older ones):
  // photographs feed the gallery, plans and masterplans get their own frames,
  // and video/3D tours are external embed URLs to iframe directly. Everything
  // the type does not claim is treated as a photograph.
  const media = p.media ?? [];
  const mediaType = (m: MediaItem) => m.type ?? m.kind ?? "";
  const isPhoto = (m: MediaItem) =>
    !/floor|master|site|video|tour|model|brochure|document/i.test(mediaType(m));
  const photos = media
    .filter((m) => m.url && isPhoto(m))
    .map((m) => ({ url: m.url, caption: m.caption ?? m.title ?? null }));
  const gallery = photos.length
    ? photos
    : (p.images ?? []).map((url) => ({ url, caption: null }));
  const heroImage = gallery[0]?.url ?? p.featuredImageUrl ?? undefined;
  const brochures = (p.documents ?? []).filter((d) => d.url);
  const floorPlans = media.filter((m) => m.url && /floor/i.test(mediaType(m)));
  const masterplans = media.filter((m) => m.url && /master|site/i.test(mediaType(m)));
  const embeds = media.filter(
    (m) => m.url && /video|tour|matterport|youtube/i.test(mediaType(m) + " " + (m.provider ?? "")),
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
        ? ((escrow as Record<string, unknown>).trusteeName ??
           (escrow as Record<string, unknown>).trustee)
        : null,
    ) ?? text(p.trust?.escrowTrustee);
  /** the compliance line the rail carries, so the permit is visible throughout */
  const permitLine = text(permit?.number) ? `Trakheesi permit ${text(permit?.number)}` : null;
  // §5 of the API guide: only `alive` earns a verified label; every other
  // liveness renders neutral, with the seller's attestation date standing in.
  const permitStanding = /^alive$/i.test(text(permit?.liveness) ?? "")
    ? "Verified with DLD"
    : null;

  // Two band shapes exist in the wild: the documented `floorPricing` (a per-sqft
  // rate per floor run) and the older `pricingBands` (a min/max price). Both
  // normalise to one row grammar here so the JSX renders either.
  const towers = (p.towers ?? [])
    .map((t) => ({
      name: t.name ?? null,
      floors: t.floors ?? null,
      units: t.unitCount ?? t.totalUnits ?? null,
      bands: (t.pricingBands ?? []).length
        ? (t.pricingBands ?? []).map((b) => ({
            from: b.floorFrom ?? null,
            to: b.floorTo ?? null,
            label: null as string | null,
            value: priceRange(b.minPrice, b.maxPrice, currency),
          }))
        : (t.floorPricing ?? []).map((b) => ({
            from: b.floorFrom ?? null,
            to: b.floorTo ?? null,
            label: b.label ?? null,
            value: perSqft(b.pricePerSqft, currency),
          })),
    }))
    .filter((t) => t.name || t.bands.length);
  const communities = (p.communities ?? []).filter((c) => c.name);
  const construction = (p.constructionMilestones ?? [])
    .map((m) => ({
      label: m.title ?? m.label ?? null,
      // a finished milestone reads by the date it finished, a pending one by
      // its target; older payloads sent one pre-formatted `date`
      date: dateLabel(m.completedDate ?? m.targetDate) ?? text(m.date),
      pct: m.progressPct ?? m.completedPct ?? null,
      status: m.status ?? null,
    }))
    .filter((m) => m.label || m.date);
  const partners = (p.partners ?? []).filter((x) => x.name);

  /* ——— The Money, in three movements — each rendered only when the record
         carries it. `investment` arrives as an object of nulls on most
         properties (developers rarely publish yields), and a heading over a
         blank ledger read as a broken page; now the returns movement simply
         does not exist until there are figures behind it. Fees moved in here
         from their own band: they are the "holds" of this section's sentence. ——— */
  const returnsCells = [
    {
      k: "Gross yield",
      v: isNum(p.investment?.expectedGrossYieldPct ?? p.investment?.grossYieldPct)
        ? `${p.investment?.expectedGrossYieldPct ?? p.investment?.grossYieldPct}%`
        : null,
    },
    {
      k: "Expected rent",
      v: money(p.investment?.expectedAnnualRentAed ?? p.investment?.expectedRentAnnual, currency),
    },
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
  ].filter((c): c is { k: string; v: string } => Boolean(c.v));

  const serviceCharge = perSqft(
    pricing?.serviceChargePerSqft ?? p.serviceChargePerSqft,
    currency,
  );
  const fees = (p.fees ?? []).filter((x) => x.label);
  const hasHolds = fees.length > 0 || Boolean(serviceCharge);
  const moneyTitle = moneySentence(
    [
      returnsCells.length > 0 ? "what it returns" : null,
      hasHolds ? "what it holds" : null,
      plans.length > 0 ? "how the payments fall" : null,
    ].filter((x): x is string => Boolean(x)),
  );

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
            <CTA to={ask} external kind="platinum" onClick={enquire("hero")}>
              Ask Amelia
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
           and the travel is whatever the description leaves over. The prose now
           folds at a dozen lines, so the rail's hold is set by the fold, not by
           four hundred words of developer copy. ——— */}
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
                <div className={positioning ? "mt-8" : ""}>
                  <FoldedProse body={p.description} />
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
                      <CTA
                        to={ask}
                        external
                        kind="platinum"
                        className="mt-8 w-full"
                        onClick={enquire("rail")}
                      >
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

      {/* ——— the photography, straight after the address is made ——— */}
      {gallery.length > 0 && (
        <Block eyebrow="The Frames" title="Seen before it is said." className="pt-0">
          <PropertyGallery name={p.name} images={gallery} />
        </Block>
      )}

      {/* ——— trust: the compliance record, stated plainly — and early. A permit
             is why this page is lawful to publish, so it reads before the
             brochure copy, not after it. ——— */}
      {(text(permit?.number) || reraNumber || reraStatus || escrowName) && (
        <Block eyebrow="On the Record" title="Permit, escrow and registration." className="pt-0">
          <div className="grid gap-10 md:grid-cols-[1fr_auto] md:gap-16">
            <Ledger
              cells={[
                { k: "Trakheesi permit", v: text(permit?.number) },
                { k: "Standing", v: permitStanding },
                { k: "Valid until", v: dateLabel(permit?.expiresAt) },
                { k: "DLD re-checked", v: dateLabel(permit?.checkedAt) },
                { k: "Seller attested", v: dateLabel(permit?.attestedAt) },
                { k: "RERA registration", v: reraNumber ?? reraStatus },
                { k: "Escrow bank", v: escrowName },
                { k: "Escrow trustee", v: escrowTrustee },
              ].filter((c): c is { k: string; v: string } => Boolean(c.v))}
            />
            {/* A permit QR has to survive being pointed at by a phone, which
                sets its size: a Trakheesi validation URL encodes at 49 modules
                across, and 224px gives those 4.6px each, comfortably above what
                a camera decodes.

                Two sources, in order of authority. If Amelia ever populates
                `qrImageUrl` that is the permit holder's own artwork and wins.
                Today it is null on every record, so we draw the code from
                `verificationUrl` instead: same content, and as a path rather
                than a bitmap it is exact at any size and prints sharp.

                Either way the quiet zone is the wrapper's padding, never the
                image's own: padding inside the box comes out of the code area,
                and the code area is what a scanner has to resolve. */}
            {permit?.qrImageUrl ? (
              <div className="shrink-0">
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
            ) : qr ? (
              <div className="shrink-0">
                <div className="inline-block bg-white p-3">
                  <svg
                    viewBox={`0 0 ${qr.size} ${qr.size}`}
                    className="block h-44 w-44 md:h-56 md:w-56"
                    shapeRendering="crispEdges"
                    role="img"
                    aria-label="Scan to verify this permit with the Dubai Land Department"
                  >
                    <path d={qr.path} fill="#0a1526" />
                  </svg>
                </div>
                <p className="type-cap mt-2.5 text-fog">Scan to verify with DLD</p>
              </div>
            ) : null}
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

      {/* ——— the money: returns, holds and payments, as one section ——— */}
      {moneyTitle && (
        <Block eyebrow="The Money" title={moneyTitle} className="pt-0">
          <div className="flex flex-col gap-14">
            {returnsCells.length > 0 && (
              <div>
                <h3 className="type-title">What it returns.</h3>
                <Ledger className="mt-5" cells={returnsCells} />
              </div>
            )}

            {hasHolds && (
              <div>
                <h3 className="type-title">What it holds.</h3>
                <dl className="mt-5">
                  {serviceCharge && (
                    <div className="hairline-t flex flex-wrap items-baseline justify-between gap-x-6 py-3">
                      <dt className="text-[15px] text-ink/78">
                        Service charge
                        <span className="type-cap ml-2 text-fog">Annual · per sqft</span>
                      </dt>
                      <dd className="type-data shrink-0 text-brass">{serviceCharge}</dd>
                    </div>
                  )}
                  {fees.map((x, i) => (
                    <div
                      key={i}
                      className="hairline-t flex flex-wrap items-baseline justify-between gap-x-6 py-3"
                    >
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
              </div>
            )}

            {plans.length > 0 && (
              <div>
                <h3 className="type-title">How the payments fall.</h3>
                <div className="mt-5 grid gap-10 md:grid-cols-2 md:gap-7">
                  {plans.map((plan, i) => (
                    <div key={i} className="border-t border-ink/14 pt-5">
                      {plan.name && <h4 className="type-title text-[1.1rem]">{plan.name}</h4>}
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
                                {typeof m.percentage === "number"
                                  ? `${m.percentage}%`
                                  : (m.dueOn ?? EMPTY)}
                              </dd>
                            </div>
                          ))}
                        </dl>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Block>
      )}

      {/* ——— the community it stands in ——— */}
      {communities.length > 0 && (
        <Block eyebrow="The Community" title="The community around it." className="pt-0">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {communities.map((c, i) => (
              <div key={i} className="border-t border-ink/14 pt-5">
                <h3 className="type-title text-[1.15rem]">{c.name}</h3>
                {(c.kind || c.luxuryTier) && (
                  <p className="type-cap mt-1 text-fog">
                    {[humanise(c.kind), humanise(c.luxuryTier)].filter(Boolean).join(" · ")}
                  </p>
                )}
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
        <Block eyebrow="Documents" title="The paperwork, as filed." className="pt-0">
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

      {/* ——— developer ——— */}
      {p.developer?.name && (
        <div className="bg-ink text-ivory">
          <Section>
            <Eyebrow className="text-silver">The Developer</Eyebrow>
            <div className="mt-5 flex flex-wrap items-center gap-x-8 gap-y-6">
              {/* The catalogue now files artwork for every developer.
                  `logoOnDark` says the artwork is light — it sits straight on
                  this ground; dark artwork gets a pearl plate to stand on. */}
              {p.developer.logoUrl && (
                <span
                  className={`inline-flex shrink-0 items-center ${
                    p.developer.logoOnDark ? "" : "bg-ivory px-4 py-3"
                  }`}
                >
                  <img
                    src={p.developer.logoUrl}
                    alt=""
                    loading="lazy"
                    className="h-9 w-auto max-w-[200px] object-contain md:h-11"
                  />
                </span>
              )}
              <h2 className="type-headline">{p.developer.name}</h2>
            </div>
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

      {/* ——— amenities ——— */}
      {amenities.length > 0 && (
        <Block eyebrow="The Property" title="What is on the site." className="pt-0">
          <ul className="grid grid-cols-2 gap-x-7 gap-y-3 md:grid-cols-3 lg:grid-cols-4">
            {(allAmenities ? amenities : amenities.slice(0, AMENITY_FOLD)).map((a) => (
              <li key={a} className="hairline-t py-3 text-[15px] text-ink/78">
                {a}
              </li>
            ))}
            {amenities.length > AMENITY_FOLD && !allAmenities && (
              <li className="hairline-t py-3">
                <button
                  type="button"
                  aria-expanded={false}
                  onClick={() => setAllAmenities(true)}
                  className="cursor-pointer text-[15px] font-semibold text-brass"
                >
                  + {amenities.length - AMENITY_FOLD} more
                </button>
              </li>
            )}
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
                    t.units ? t.units + " units" : null,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
                {t.bands.length > 0 && (
                  <dl className="mt-4">
                    {t.bands.map((b, j) => (
                      <div key={j} className="hairline-t flex flex-wrap items-baseline justify-between gap-x-6 py-2.5">
                        <dt className="text-[15px] text-ink/75">
                          {b.from != null && b.to != null
                            ? "Floors " + b.from + "–" + b.to
                            : "Pricing band"}
                          {b.label && <span className="type-cap ml-2 text-fog">{b.label}</span>}
                        </dt>
                        <dd className="type-data shrink-0 text-brass">{b.value ?? EMPTY}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </div>
            ))}
          </div>
        </Block>
      )}

      {/* ——— floor plans & masterplans. SVG plans arrive as external developer
             URLs rather than proxied ones — an image URL is an image URL, so
             they render like every other frame. ——— */}
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
                    alt={m.caption ?? m.title ?? "Plan"}
                    loading="lazy"
                    className="h-full w-full object-contain p-3 transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <p className="type-cap mt-2 text-fog">
                  {m.caption ?? m.title ?? humanise(m.type ?? m.kind) ?? "Plan"}
                </p>
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
                {(typeof m.pct === "number" || m.status) && (
                  <dd className="type-cap text-fog">
                    {[typeof m.pct === "number" ? `${m.pct}%` : null, humanise(m.status)]
                      .filter(Boolean)
                      .join(" · ")}
                  </dd>
                )}
              </div>
            ))}
          </dl>
        </Block>
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

      {/* ——— the threshold: into the buyer portal ——— */}
      <div className="bg-navy text-ivory">
        <Section className="text-center">
          <h2 className="type-headline mx-auto max-w-[26ch]">Ask anything about {p.name}.</h2>
          <p className="type-body-lg mx-auto mt-6 max-w-[52ch] text-ivory/78">
            {CHAT_FIRST
              ? "Amelia opens on this address with no account needed: payment schedule, escrow filing and the comparable resale record, answered on demand."
              : "Create your buyer account and Amelia opens on this address: payment schedule, escrow filing and the comparable resale record, answered on demand."}
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <CTA to={ask} external kind="platinum" onClick={enquire("closing")}>
              Ask Amelia
            </CTA>
            {/* "View the brochure" promised what the Documents band above
                already delivers; Amelia's public page is the one-screen
                summary, so it is named for what it is. */}
            <CTA to={brochureHref(p.slug)} external kind="line">
              At a glance
            </CTA>
          </div>
          <p className="type-cap mt-5 text-silver">
            {CHAT_FIRST
              ? "Nothing to fill in to ask. Share one detail when you want a brochure, a quote, a viewing or your own portal, or to keep going after a long conversation. No cold calls: an advisor replies only when you ask."
              : "Verified signup: confirm your email, and your WhatsApp number where that is enabled, then the property opens in your portal. No cold calls: an advisor replies only when you ask."}
          </p>
          {WHATSAPP_ASIDE && (
            <p className="type-cap mt-2 text-silver/70">
              Prefer WhatsApp?{" "}
              <a
                href={conversationHref(p.name, "property")}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-ivory"
              >
                Message Amelia there ↗
              </a>
            </p>
          )}
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
