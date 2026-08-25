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
  location: { latitude: number | null; longitude: number | null } | null;
  featuredImageUrl: string | null;
  images: string[] | null;
  permit: Permit | null;
  updatedAt: string | null;
}

export interface MediaItem {
  url: string;
  kind?: string | null;
  provider?: string | null;
  caption?: string | null;
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
  status?: string | null;
  floor?: number | string | null;
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
    nearbyPlaces?: Array<{
      name?: string | null;
      distanceKm?: number | null;
      travelTimeMin?: number | null;
      transportMode?: string | null;
      minutes?: number | null;
    }> | null;
  } | null;
  media?: MediaItem[] | null;
  documents?: Array<{ title?: string | null; url?: string | null }> | null;
  paymentPlans?: PaymentPlan[] | null;
  fees?: Array<{
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
    pricingBands?: Array<{
      floorFrom?: number | null;
      floorTo?: number | null;
      minPrice?: number | null;
      maxPrice?: number | null;
    }> | null;
  }> | null;
  communities?: Array<{ name?: string | null; description?: string | null }> | null;
  constructionMilestones?: Array<{
    label?: string | null;
    date?: string | null;
    completedPct?: number | null;
    status?: string | null;
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

async function get<T>(path: string, signal?: AbortSignal): Promise<T> {
  const key = process.env.AMELIA_API_KEY?.trim();
  if (!key) throw new AmeliaError(0, "AMELIA_API_KEY is not set");

  // Fail fast: a hanging upstream must not hold a serverless function open.
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), TIMEOUT_MS);
  signal?.addEventListener("abort", () => ctl.abort(), { once: true });

  const started = Date.now();
  let res: Response;
  try {
    res = await fetch(`${base()}${path}`, {
      headers: { Authorization: `Bearer ${key}`, Accept: "application/json" },
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
  return houseStyle((await res.json()) as T);
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
): Promise<{ data: ProjectCard[]; nextCursor: string | null }> {
  const p = new URLSearchParams();
  p.set("limit", String(Math.min(q.limit ?? 50, 100)));
  for (const k of ["cursor", "propertyType", "status", "area", "minPrice", "maxPrice"] as const) {
    const v = q[k];
    if (v !== undefined && v !== null && String(v).trim() !== "") p.set(k, String(v));
  }
  return get(`/api/v1/projects?${p}`, signal);
}

/** `null` when the slug is unknown, belongs to another org, or is an unpublished
 *  draft — the API returns 404 for all three, and so do we. */
export async function fetchProject(
  slug: string,
  opts: { includeUnits?: "available" | "all" | "none" } = {},
  signal?: AbortSignal,
): Promise<ProjectDetail | null> {
  const units = opts.includeUnits ?? "all";
  try {
    return await get(
      `/api/v1/projects/${encodeURIComponent(slug)}?includeUnits=${units}`,
      signal,
    );
  } catch (err) {
    if (err instanceof AmeliaError && err.status === 404) return null;
    throw err;
  }
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
