/**
 * Amelia Partner Listing API — server-only client.
 *
 * The key is a bearer secret and the API sends no CORS headers by design, so
 * every call here must stay on the server: loaders only, never a component.
 * The `.server.ts` suffix makes Vite fail the build if a browser bundle ever
 * imports it, which is the guardrail we want around a credential.
 *
 * Configuration (all server-side — no VITE_ prefix, ever):
 *   AMELIA_API_BASE   white-label base, e.g. https://amelia.serenebay.ae
 *   AMELIA_API_KEY    Bearer key issued per organisation
 *
 * Every field in the catalogue is nullable: "treat null as not provided and omit
 * the section". The types below say so, and the pages render accordingly.
 */

import { amenityName } from "~/lib/amelia";

const DEFAULT_BASE = "https://amelia.serenebay.ae";

/** Absent key ⇒ the listing pages show an explained empty state, never a 500. */
export function isAmeliaConfigured(): boolean {
  return Boolean(process.env.AMELIA_API_KEY?.trim());
}

/**
 * How long to wait on the catalogue before giving up.
 *
 * The first uncached query for a whole org can take a good few seconds, and
 * the original 10s proved too tight in production: the transport is ~0.3s, so
 * a timeout here means the upstream is still working, not that it is broken.
 * Override with AMELIA_TIMEOUT_MS if the catalogue grows.
 */
const TIMEOUT_MS = Number(process.env.AMELIA_TIMEOUT_MS) || 25_000;

function base(): string {
  return (process.env.AMELIA_API_BASE?.trim() || DEFAULT_BASE).replace(/\/+$/, "");
}

/**
 * Where the wall clock went on one call, so a slow page can be attributed
 * instead of guessed at. Loaders pass one of these in and publish it as a
 * Server-Timing header, which means anyone with devtools open, or a curl, can
 * see whether the wait was Amelia's or ours.
 */
export interface Timing {
  /** request sent to parsed JSON body, including transport. Accumulates when a
   *  loader makes several calls (the register page fans out), so it reads as
   *  total catalogue time spent, not the last call's. */
  upstreamMs: number;
  /** applying house style to the parsed record */
  shapeMs: number;
}

/** `Server-Timing` value for a call, or undefined when nothing was measured. */
export function serverTiming(t: Timing): string {
  return `amelia;dur=${t.upstreamMs}, housestyle;dur=${t.shapeMs}`;
}

export class AmeliaError extends Error {
  constructor(readonly status: number, message: string) {
    super(message);
    this.name = "AmeliaError";
  }
}

/* ——— shapes (subset of the documented record we actually render) ——— */

export interface Money {
  minPrice: number | null;
  maxPrice: number | null;
  currency: string | null;
}
export interface Developer {
  id?: string;
  name: string | null;
  logoUrl?: string | null;
  logoOnDark?: boolean | null;
  description?: string | null;
  establishedYear?: number | null;
  projectsDelivered?: number | null;
  headquarters?: string | null;
  onTimeDeliveryPct?: number | null;
  website?: string | null;
}
export interface Permit {
  number?: string | null;
  liveness?: string | null;
  /** last nightly DLD re-check */
  checkedAt?: string | null;
  /** the seller's active-permit confirmation (property-level only) */
  attestedAt?: string | null;
  /** DLD End Date — "Valid until …" (property-level only) */
  expiresAt?: string | null;
  verificationUrl?: string | null;
  qrImageUrl?: string | null;
}
export interface ProjectCard extends Money {
  id: string;
  slug: string;
  name: string;
  emirate: string | null;
  area: string | null;
  propertyType: string | null;
  status: string | null;
  minPricePerSqft: number | null;
  handoverQuarter: string | null;
  completionPct: number | null;
  totalUnits: number | null;
  availableUnitCount: number | null;
  availableBedrooms: number[] | null;
  developer: Developer | null;
  /** Register facets, carried on the card since the 1 Sep feed update. Older
   *  payloads omit them — the facts fetcher then falls back to the detail
   *  record, exactly as before. */
  amenities?: Array<{ name?: string | null; label?: string | null } | string> | null;
  communities?: Array<{ name?: string | null } | string> | null;
  location: {
    latitude: number | null;
    longitude: number | null;
    neighborhood?: string | null;
  } | null;
  featuredImageUrl: string | null;
  images: string[] | null;
  permit: Permit | null;
  updatedAt: string | null;
}

export interface NearbyPlace {
  name?: string | null;
  category?: string | null;
  distanceKm?: number | null;
  travelTimeMin?: number | null;
  transportMode?: string | null;
  minutes?: number | null;
}

export interface MediaItem {
  url: string;
  /** documented field name; `kind` kept as a fallback for older payloads */
  type?: string | null;
  kind?: string | null;
  provider?: string | null;
  title?: string | null;
  caption?: string | null;
  thumbnailUrl?: string | null;
}
export interface Unit {
  id?: string;
  unitNumber?: string | null;
  unitType?: string | null;
  sizeSqft?: number | null;
  bathrooms?: number | null;
  name?: string | null;
  bedrooms?: number | null;
  areaSqft?: number | null;
  price?: number | null;
  pricePerSqft?: number | null;
  status?: string | null;
  floor?: number | string | null;
  /** The unit's OWN Trakheesi permit; null means the property permit in
   *  trust.permit covers it. Rendered only where a single unit is advertised. */
  permit?: Permit | null;
}
export interface PaymentMilestone {
  label?: string | null;
  percentage?: number | null;
  dueOn?: string | null;
}
export interface PaymentPlan {
  name?: string | null;
  description?: string | null;
  milestones?: PaymentMilestone[] | null;
}

/** The detail record. Deliberately loose: unknown blocks pass through untouched
 *  so a catalogue addition never breaks the page. */
/* `location` is widened here (address + nearby places), so it is omitted from
   the base rather than redeclared — narrowing a required prop to optional is
   not a valid extension. */
export interface ProjectDetail extends Omit<ProjectCard, "location"> {
  description?: string | null;
  /** The detail record nests money here (the card carries it flat); the flat
   *  aliases inherited from ProjectCard stay honoured as fallbacks. */
  pricing?: {
    minPrice?: number | null;
    maxPrice?: number | null;
    currency?: string | null;
    serviceChargePerSqft?: number | null;
  } | null;
  serviceChargePerSqft?: number | null;
  /** Field names confirmed against a live record; the older aliases are kept
   *  as fallbacks so either shape renders. */
  investment?: {
    expectedGrossYieldPct?: number | null;
    expectedAnnualRentAed?: number | null;
    residencyVisaEligibility?: string | boolean | null;
    investorEligibility?: string | null;
    grossYieldPct?: number | null;
    expectedRentAnnual?: number | null;
    visaEligible?: boolean | null;
    visaThreshold?: number | null;
  } | null;
  positioning?: {
    luxuryTier?: string | null;
    isBrandedResidence?: boolean | null;
    brandedResidenceBrand?: string | null;
    signaturePositioning?: string | null;
    viewClassifications?: string[] | null;
    brandedResidence?: string | null;
    views?: string[] | null;
  } | null;
  amenities?: Array<{ name?: string | null; label?: string | null; category?: string | null } | string> | null;
  location?: {
    latitude: number | null;
    longitude: number | null;
    addressLine?: string | null;
    neighborhood?: string | null;
    mapUrl?: string | null;
    address?: string | null;
    nearbyPlaces?: NearbyPlace[] | null;
  } | null;
  /** the documented home for nearby places is the record root; some older
   *  payloads nested them under `location` */
  nearbyPlaces?: NearbyPlace[] | null;
  media?: MediaItem[] | null;
  documents?: Array<{ title?: string | null; url?: string | null }> | null;
  paymentPlans?: PaymentPlan[] | null;
  fees?: Array<{
    category?: string | null;
    label?: string | null;
    amount?: number | null;
    pctOfPrice?: number | null;
    frequency?: string | null;
    isOptional?: boolean | null;
    note?: string | null;
  }> | null;
  units?: Unit[] | null;
  unitCounts?: { available?: number | null; reserved?: number | null; sold?: number | null } | null;
  towers?: Array<{
    name?: string | null;
    floors?: number | null;
    unitCount?: number | null;
    totalUnits?: number | null;
    /** the documented shape: a per-sqft rate per floor band */
    floorPricing?: Array<{
      floorFrom?: number | null;
      floorTo?: number | null;
      pricePerSqft?: number | null;
      label?: string | null;
    }> | null;
    /** older payloads carried min/max bands under this name */
    pricingBands?: Array<{
      floorFrom?: number | null;
      floorTo?: number | null;
      minPrice?: number | null;
      maxPrice?: number | null;
    }> | null;
  }> | null;
  communities?: Array<{
    name?: string | null;
    kind?: string | null;
    description?: string | null;
    luxuryTier?: string | null;
    amenities?: string[] | null;
    totalUnits?: number | null;
  }> | null;
  constructionMilestones?: Array<{
    /** documented name, with the older alias beside it */
    title?: string | null;
    label?: string | null;
    targetDate?: string | null;
    completedDate?: string | null;
    date?: string | null;
    progressPct?: number | null;
    completedPct?: number | null;
    status?: string | null;
    note?: string | null;
  }> | null;
  partners?: Array<{ name?: string | null; role?: string | null; logoUrl?: string | null }> | null;
  trust?: {
    rera?: string | null;
    reraNumber?: string | null;
    escrow?: string | null;
    reraRegistration?: string | null;
    escrowBank?: string | null;
    escrowTrustee?: string | null;
    permit?: Permit | null;
  } | null;
}

/* ——— house style, applied to what the catalogue sends ——— */

/**
 * Serene's copy carries no em or en dashes, and catalogue text is published
 * straight onto the page. Editors upstream do use them, so the character is
 * translated once here, at the boundary, rather than at every call site: a
 * dash between digits is a range, and anything else becomes a comma.
 * URLs are left alone.
 */
function normaliseDashes(value: string): string {
  if (!/[–—]/.test(value)) return value;
  if (/^(https?:|data:|\/)/i.test(value)) return value;
  return value
    // a dash from a number into another number is a range ("Q4 2026 to Q1 2027")
    .replace(/(\d)\s*[–—]\s*(?=[A-Za-z]{0,3}\d)/g, "$1 to ")
    .replace(/\s*[–—]\s*/g, ", ")
    .replace(/\s+,/g, ",")
    .replace(/,\s*,/g, ",")
    .trim();
}

/** Walk the parsed record and apply house style to every string leaf. */
function houseStyle<T>(node: T, depth = 0): T {
  if (depth > 12) return node;
  if (typeof node === "string") return normaliseDashes(node) as unknown as T;
  if (Array.isArray(node)) return node.map((v) => houseStyle(v, depth + 1)) as unknown as T;
  if (node && typeof node === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(node)) out[k] = houseStyle(v, depth + 1);
    return out as T;
  }
  return node;
}

/* ——— transport ——— */

/**
 * Conditional-request cache, one entry per GET path.
 *
 * Every JSON response carries a weak ETag, and an unchanged page answers a
 * `If-None-Match` revalidation with a bodyless 304 — the API's own guidance is
 * that unchanged catalogues cost almost nothing this way. So the last shaped
 * body is kept per path and revalidated instead of re-downloaded: a 304 skips
 * the JSON parse and the houseStyle walk entirely.
 *
 * Instance-local by design. Fluid Compute reuses instances between requests,
 * so the cache warms once per instance; a cold instance simply pays full price
 * once. Entries are refreshed on insertion order and capped, which is LRU
 * enough for a catalogue this size.
 */
const conditional = new Map<string, { etag: string; body: unknown }>();
const CONDITIONAL_MAX = 256;

async function get<T>(path: string, signal?: AbortSignal, timing?: Timing): Promise<T> {
  const key = process.env.AMELIA_API_KEY?.trim();
  if (!key) throw new AmeliaError(0, "AMELIA_API_KEY is not set");

  // Fail fast: a hanging upstream must not hold a serverless function open.
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), TIMEOUT_MS);
  signal?.addEventListener("abort", () => ctl.abort(), { once: true });

  const held = conditional.get(path);
  const started = Date.now();
  let res: Response;
  try {
    res = await fetch(`${base()}${path}`, {
      headers: {
        Authorization: `Bearer ${key}`,
        Accept: "application/json",
        ...(held ? { "If-None-Match": held.etag } : {}),
      },
      signal: ctl.signal,
    });
  } catch (err) {
    const aborted = err instanceof Error && err.name === "AbortError";
    console.error(
      `[amelia] GET ${path} failed after ${Date.now() - started}ms:`,
      aborted ? `aborted at ${TIMEOUT_MS}ms` : err,
    );
    throw new AmeliaError(
      504,
      aborted
        ? "The listing service did not respond in time."
        : "The listing service is unreachable.",
    );
  } finally {
    clearTimeout(timer);
  }

  // 304 only ever comes back to an If-None-Match we sent, so `held` exists on
  // this branch; the guard keeps a misbehaving upstream from returning nothing.
  if (res.status === 304 && held) {
    if (timing) timing.upstreamMs += Date.now() - started;
    return held.body as T;
  }
  if (res.status === 404) throw new AmeliaError(404, "Not found");
  if (res.status === 401) {
    // The API deliberately doesn't say whether it's missing, mistyped or revoked.
    throw new AmeliaError(401, "The listing API rejected our credentials.");
  }
  if (res.status === 429) {
    throw new AmeliaError(429, `Rate limited. Retry after ${res.headers.get("Retry-After") ?? "60"}s.`);
  }
  if (!res.ok) {
    console.error(`[amelia] GET ${path} -> ${res.status} in ${Date.now() - started}ms`);
    throw new AmeliaError(res.status, `Listing API returned ${res.status}.`);
  }
  const parsed = (await res.json()) as T;
  if (timing) timing.upstreamMs += Date.now() - started;

  // houseStyle walks every string in the record, and a detail payload with all
  // units is a big tree — worth measuring separately rather than assuming it
  // rounds to nothing.
  const shapeStarted = Date.now();
  const shaped = houseStyle(parsed);
  if (timing) timing.shapeMs += Date.now() - shapeStarted;

  // The shaped body is what a 304 must reproduce, so that is what is held.
  // Consumers treat records as read-only (they filter and map into new arrays),
  // which is what makes sharing one body across requests safe.
  const etag = res.headers.get("ETag");
  if (etag) {
    conditional.delete(path);
    if (conditional.size >= CONDITIONAL_MAX) {
      const oldest = conditional.keys().next().value;
      if (oldest !== undefined) conditional.delete(oldest);
    }
    conditional.set(path, { etag, body: shaped });
  }
  return shaped;
}

export interface ProjectQuery {
  limit?: number;
  cursor?: string | null;
  propertyType?: string | null;
  status?: string | null;
  area?: string | null;
  minPrice?: number | null;
  maxPrice?: number | null;
}

export async function fetchProjects(
  q: ProjectQuery = {},
  signal?: AbortSignal,
  timing?: Timing,
): Promise<{ data: ProjectCard[]; nextCursor: string | null }> {
  const p = new URLSearchParams();
  p.set("limit", String(Math.min(q.limit ?? 50, 100)));
  for (const k of ["cursor", "propertyType", "status", "area", "minPrice", "maxPrice"] as const) {
    const v = q[k];
    if (v !== undefined && v !== null && String(v).trim() !== "") p.set(k, String(v));
  }
  const res = await get<{ data: ProjectCard[]; nextCursor: string | null }>(
    `/api/v1/projects?${p}`,
    signal,
    timing,
  );
  // A 200 carrying an empty catalogue is indistinguishable, from the page, from
  // a request we got wrong. Say which in the logs so the next person asking
  // "why is the register empty" can read the answer instead of deducing it.
  if (!res?.data?.length) {
    console.warn(
      `[amelia] GET /api/v1/projects?${p} returned 200 with ${
        Array.isArray(res?.data) ? "0 projects" : `no data array (keys: ${Object.keys(res ?? {})})`
      }`,
    );
  }
  return res;
}

/**
 * The whole register, cursor by cursor.
 *
 * Filtering moved into our own loader — keyword search, developer, community
 * and amenity filters have no upstream query params to lean on — and that only
 * works over the full card set. The catalogue is dozens of cards, not
 * thousands; one page usually carries it all, and the page cap is a guard
 * against a runaway cursor, not an expected depth.
 */
export async function fetchAllProjects(
  signal?: AbortSignal,
  timing?: Timing,
): Promise<ProjectCard[]> {
  const all: ProjectCard[] = [];
  let cursor: string | null = null;
  for (let page = 0; page < 6; page++) {
    const res: { data: ProjectCard[]; nextCursor: string | null } = await fetchProjects(
      { limit: 100, cursor },
      signal,
      timing,
    );
    all.push(...(res.data ?? []));
    cursor = res.nextCursor;
    if (!cursor) break;
  }
  return all;
}

/** `null` when the slug is unknown, belongs to another org, or is an unpublished
 *  draft — the API returns 404 for all three, and so do we. */
export async function fetchProject(
  slug: string,
  opts: { includeUnits?: "available" | "all" | "none" } = {},
  signal?: AbortSignal,
  timing?: Timing,
): Promise<ProjectDetail | null> {
  const units = opts.includeUnits ?? "all";
  try {
    return await get(
      `/api/v1/projects/${encodeURIComponent(slug)}?includeUnits=${units}`,
      signal,
      timing,
    );
  } catch (err) {
    if (err instanceof AmeliaError && err.status === 404) return null;
    throw err;
  }
}

/* ——— the filter index: what the cards do not carry ——— */

/**
 * Amenities and community names live only in the detail record, and the
 * register's filters need them for every property at once. So each slug's
 * facts are read via the lightweight `includeUnits=none` shape and held here,
 * keyed by the card's own `updatedAt`: an unchanged card costs nothing at all,
 * a changed one costs a conditional request that usually answers 304.
 *
 * The staleness this accepts is the API's own: content-only edits may not bump
 * `updatedAt`, so a renamed amenity can lag until the instance recycles or the
 * inventory next changes. For a filter list, that trade is the right one.
 */
export interface RegisterFacts {
  updatedAt: string | null;
  amenities: string[];
  communities: string[];
  neighborhood: string | null;
}

const factsCache = new Map<string, RegisterFacts>();
// Fallback-path width only (cards without the 1 Sep facet fields). The
// upstream allows 120 requests/min, so one full-register wave fits easily —
// four six-wide waves was most of a cold render's wall clock.
const FACTS_CONCURRENCY = 19;

/**
 * Since 1 Sep the feed carries the facets on the card itself — a card that
 * has them costs nothing: no detail request, no cache dependency, always
 * exactly as fresh as the list. Older payloads (missing the fields) return
 * null and take the detail-fetch path below.
 */
function factsFromCard(c: ProjectCard): RegisterFacts | null {
  if (!Array.isArray(c.amenities) && !Array.isArray(c.communities)) return null;
  return {
    updatedAt: c.updatedAt ?? null,
    amenities: (c.amenities ?? []).map(amenityName).filter((x): x is string => Boolean(x)),
    communities: (c.communities ?? []).map(amenityName).filter((x): x is string => Boolean(x)),
    neighborhood: c.location?.neighborhood?.trim() || null,
  };
}

export async function fetchRegisterFacts(
  cards: ProjectCard[],
  signal?: AbortSignal,
  timing?: Timing,
): Promise<Map<string, RegisterFacts>> {
  const stale = cards.filter((c) => {
    const direct = factsFromCard(c);
    if (direct) {
      factsCache.set(c.slug, direct);
      return false;
    }
    const held = factsCache.get(c.slug);
    return !held || !held.updatedAt || held.updatedAt !== (c.updatedAt ?? null);
  });

  let next = 0;
  const worker = async () => {
    while (next < stale.length) {
      const card = stale[next++];
      try {
        const d = await fetchProject(card.slug, { includeUnits: "none" }, signal, timing);
        if (!d) continue;
        factsCache.set(card.slug, {
          updatedAt: card.updatedAt ?? null,
          amenities: (d.amenities ?? []).map(amenityName).filter((x): x is string => Boolean(x)),
          communities: (d.communities ?? [])
            .map((c) => amenityName(c?.name))
            .filter((x): x is string => Boolean(x)),
          neighborhood: d.location?.neighborhood?.trim() || null,
        });
      } catch {
        // A slug that will not index still lists and still filters on its card
        // fields; the page must never 500 over a facet.
      }
    }
  };
  await Promise.all(
    Array.from({ length: Math.min(FACTS_CONCURRENCY, stale.length) }, worker),
  );

  const out = new Map<string, RegisterFacts>();
  for (const c of cards) {
    const held = factsCache.get(c.slug);
    if (held) out.set(c.slug, held);
  }
  return out;
}

/* ——— the register-interest funnel (no account created) ——— */

export interface LeadPayload {
  name: string;
  email: string;
  phone?: string;
  message?: string;
  projectSlug?: string;
}

/** The org id the leads endpoint keys on. Public, but read server-side so the
 *  form posts through our own route rather than cross-origin. */
export function orgKey(): string | null {
  return process.env.AMELIA_ORG_KEY?.trim() || null;
}

/**
 * POST a lead to Amelia. Repeat submissions for the same email update the
 * interested property rather than duplicating the lead, so this is safe to
 * call again — no client-side de-duplication needed.
 */
export async function captureLead(lead: LeadPayload, signal?: AbortSignal): Promise<void> {
  const key = orgKey();
  if (!key) throw new AmeliaError(0, "AMELIA_ORG_KEY is not set");

  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), TIMEOUT_MS);
  signal?.addEventListener("abort", () => ctl.abort(), { once: true });

  let res: Response;
  try {
    res = await fetch(`${base()}/api/leads/capture`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        orgKey: key,
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        message: lead.message,
        source: "serenebay_website",
        projectSlug: lead.projectSlug,
        utmSource: "serenebay.ae",
        utmMedium: "website",
      }),
      signal: ctl.signal,
    });
  } catch (err) {
    throw new AmeliaError(504, "Could not reach the advisory. Please try again.");
  } finally {
    clearTimeout(timer);
  }

  if (!res.ok) throw new AmeliaError(res.status, `Lead capture returned ${res.status}.`);
}
