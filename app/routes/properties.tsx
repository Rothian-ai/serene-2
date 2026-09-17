import { useRef } from "react";
import { data, Form, Link, useLoaderData, useNavigate, useSearchParams } from "react-router";
import type { HeadersArgs, LoaderFunctionArgs } from "react-router";
import { AdvisorLink, Eyebrow, Reveal, RevealGroup, RevealItem, Section } from "~/components/primitives";
import { SplitHeading } from "~/components/SplitHeading";
import { PropertyCard } from "~/components/property";
import {
  AmeliaError,
  fetchAllProjects,
  fetchRegisterFacts,
  isAmeliaConfigured,
  serverTiming,
} from "~/lib/amelia.server";
import type { ProjectCard, RegisterFacts, Timing } from "~/lib/amelia.server";
import { humanise, money } from "~/lib/amelia";
import { meta as buildMeta } from "~/lib/site";

export const handle = { headerTone: "light" as const };

export function meta() {
  return buildMeta({
    title: "Properties",
    description:
      "The register of off-plan developments Serene presents in Dubai and Abu Dhabi: pricing, handover, payment plans and permit details, published from the record.",
    path: "/properties",
  });
}

/**
 * Two cache lifetimes, chosen by the loader.
 *
 * A good response is worth holding at the edge for five minutes (this stack's
 * equivalent of the guide's Next `revalidate: 300`). A failure is not: caching
 * it would pin one upstream timeout in front of every visitor for the full five
 * minutes, long after the catalogue recovered. Failures get seconds instead, so
 * the next request re-tries almost immediately.
 */
// One hour at the edge: the catalogue changes a few times a week, stale
// copies still serve instantly for a day while revalidating, and the hourly
// warmer refreshes entries anyway. Five minutes just meant a fresh origin
// render (and its upstream calls) every five minutes per URL.
const FRESH = "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400";
const BRIEF = "public, max-age=0, s-maxage=15";

export function headers({ loaderHeaders }: HeadersArgs) {
  const out: Record<string, string> = {
    "Cache-Control": loaderHeaders.get("Cache-Control") ?? FRESH,
  };
  // Published so a slow page can be attributed rather than guessed at: it says
  // how much of the wait was the catalogue and how much was us. The header is
  // cached with the body, so a CDN hit still reports the timings of the origin
  // render that filled it — which is what you want, since that render is the
  // one a visitor would have waited for.
  const timing = loaderHeaders.get("Server-Timing");
  if (timing) out["Server-Timing"] = timing;
  return out;
}

/* ——— filtering, done here rather than upstream ———

     The API filters on type, status, area and price, but the register's search
     asks more of the record than that: developer, emirate, community, amenity
     and free keywords have no upstream params to lean on. The catalogue is
     dozens of cards, so the whole register is fetched (conditionally — an
     unchanged catalogue answers 304s) and every question is answered locally,
     over all of it, in one pass. ——— */

interface Filters {
  q: string;
  developer: string;
  emirate: string;
  community: string;
  type: string;
  status: string;
  category: string;
  minPrice: number | null;
  maxPrice: number | null;
  amenities: string[];
}

const norm = (s: string | null | undefined) => (s ?? "").trim().toLowerCase();

/** Plot is land and Commercial is commercial; everything else on this register
 *  is a home. Unknown enum values fall to Residential rather than crashing. */
function category(propertyType: string | null | undefined): string {
  const t = norm(propertyType);
  if (t === "plot") return "Land";
  if (t === "commercial") return "Commercial";
  if (t === "mixeduse") return "Mixed use";
  return "Residential";
}

/** Everything a keyword may match: the card's own fields plus the indexed
 *  amenities and community names. One string, searched as lowercase. */
function haystack(card: ProjectCard, facts: RegisterFacts | undefined): string {
  return [
    card.name,
    card.slug,
    card.developer?.name,
    card.area,
    card.emirate,
    card.propertyType,
    humanise(card.propertyType),
    card.status,
    humanise(card.status),
    category(card.propertyType),
    card.handoverQuarter,
    card.permit?.number,
    (card.availableBedrooms ?? []).map((b) => (b === 0 ? "studio" : `${b} bed`)).join(" "),
    ...(facts?.amenities ?? []),
    ...(facts?.communities ?? []),
    facts?.neighborhood,
  ]
    .filter(Boolean)
    .join(" · ")
    .toLowerCase();
}

function matches(card: ProjectCard, facts: RegisterFacts | undefined, f: Filters): boolean {
  if (f.developer && norm(card.developer?.name) !== norm(f.developer)) return false;
  if (f.emirate && norm(card.emirate) !== norm(f.emirate)) return false;
  if (f.type && norm(card.propertyType) !== norm(f.type)) return false;
  if (f.status && norm(card.status) !== norm(f.status)) return false;
  if (f.category && norm(category(card.propertyType)) !== norm(f.category)) return false;
  if (f.community) {
    const want = norm(f.community);
    const named =
      norm(card.area) === want ||
      norm(card.area).includes(want) ||
      norm(facts?.neighborhood) === want ||
      (facts?.communities ?? []).some((x) => norm(x) === want);
    if (!named) return false;
  }
  // Band overlap, the same semantics the API gives min/maxPrice: a project
  // matches when its band and the asked band intersect. A card with no band at
  // all cannot confirm a price question, so it does not match one.
  if (f.minPrice !== null || f.maxPrice !== null) {
    const lo = card.minPrice ?? card.maxPrice;
    const hi = card.maxPrice ?? card.minPrice;
    if (lo === null || hi === null) return false;
    if (f.minPrice !== null && hi < f.minPrice) return false;
    if (f.maxPrice !== null && lo > f.maxPrice) return false;
  }
  if (f.amenities.length > 0) {
    const held = new Set((facts?.amenities ?? []).map(norm));
    if (!f.amenities.every((a) => held.has(norm(a)))) return false;
  }
  if (f.q) {
    const hay = haystack(card, facts);
    const words = norm(f.q).split(/\s+/).filter(Boolean);
    if (!words.every((w) => hay.includes(w))) return false;
  }
  return true;
}

/** Distinct values, first spelling wins, alphabetical. */
function uniq(values: Array<string | null | undefined>): string[] {
  const seen = new Map<string, string>();
  for (const v of values) {
    const s = v?.trim();
    if (s && !seen.has(s.toLowerCase())) seen.set(s.toLowerCase(), s);
  }
  return [...seen.values()].sort((a, b) => a.localeCompare(b));
}

/**
 * A facet option has to read as a label. The live catalogue files prose where
 * this page expected names — `location.neighborhood` arrives as a paragraph on
 * where the property sits — and a sentence in a select is not a filter anyone
 * can use. Prose stays in the search haystack, where it is genuinely useful,
 * and out of the options.
 */
const nameLike = (s: string) => s.length <= 48 && !s.includes(". ") && !/[.!?]$/.test(s);

export interface RegisterFacets {
  developers: string[];
  emirates: string[];
  communities: string[];
  types: string[];
  statuses: string[];
  categories: string[];
  /** ranked by how many properties carry each, so the visible checkboxes are
   *  the ones that actually divide the register */
  amenities: string[];
}

function buildFacets(cards: ProjectCard[], facts: Map<string, RegisterFacts>): RegisterFacets {
  const amenityCount = new Map<string, { label: string; n: number }>();
  for (const f of facts.values()) {
    for (const a of f.amenities) {
      const key = a.toLowerCase();
      const held = amenityCount.get(key);
      if (held) held.n += 1;
      else amenityCount.set(key, { label: a, n: 1 });
    }
  }
  return {
    developers: uniq(cards.map((c) => c.developer?.name)),
    emirates: uniq(cards.map((c) => c.emirate)),
    communities: uniq([
      ...cards.map((c) => c.area),
      ...[...facts.values()].flatMap((f) => [...f.communities, f.neighborhood]),
    ]).filter(nameLike),
    types: uniq(cards.map((c) => c.propertyType)),
    statuses: uniq(cards.map((c) => c.status)),
    categories: uniq(cards.map((c) => category(c.propertyType))),
    amenities: [...amenityCount.values()]
      .sort((a, b) => b.n - a.n || a.label.localeCompare(b.label))
      .slice(0, 24)
      .map((x) => x.label),
  };
}

const EMPTY_FACETS: RegisterFacets = {
  developers: [],
  emirates: [],
  communities: [],
  types: [],
  statuses: [],
  categories: [],
  amenities: [],
};

export async function loader({ request }: LoaderFunctionArgs) {
  // No key configured (a fresh clone, or a preview without env) must render an
  // explained page, never a 500.
  if (!isAmeliaConfigured()) {
    return data(
      {
        state: "unconfigured" as const,
        projects: [],
        total: 0,
        facets: EMPTY_FACETS,
        error: null,
      },
      { headers: { "Cache-Control": BRIEF } },
    );
  }
  const p = new URL(request.url).searchParams;
  const toNum = (v: string | null) => {
    const n = Number(v);
    return v !== null && v.trim() !== "" && Number.isFinite(n) ? n : null;
  };
  const filters: Filters = {
    q: (p.get("q") ?? "").trim(),
    developer: (p.get("developer") ?? "").trim(),
    emirate: (p.get("emirate") ?? "").trim(),
    // `area` is the old name for this param; links in the wild keep working
    community: (p.get("community") ?? p.get("area") ?? "").trim(),
    type: (p.get("type") ?? "").trim(),
    status: (p.get("status") ?? "").trim(),
    category: (p.get("category") ?? "").trim(),
    minPrice: toNum(p.get("minPrice")),
    maxPrice: toNum(p.get("maxPrice")),
    amenities: p
      .getAll("amenity")
      .map((s) => s.trim())
      .filter(Boolean),
  };
  const timing: Timing = { upstreamMs: 0, shapeMs: 0 };
  try {
    const cards = await fetchAllProjects(request.signal, timing);
    const facts = await fetchRegisterFacts(cards, request.signal, timing);
    const projects = cards.filter((c) => matches(c, facts.get(c.slug), filters));
    return data(
      {
        state: "ok" as const,
        projects,
        total: cards.length,
        facets: buildFacets(cards, facts),
        error: null,
      },
      { headers: { "Cache-Control": FRESH, "Server-Timing": serverTiming(timing) } },
    );
  } catch (err) {
    // A listing outage is not a broken site: keep the page, explain the gap.
    const error =
      err instanceof AmeliaError ? err.message : "The listing service is unavailable.";
    return data(
      { state: "error" as const, projects: [], total: 0, facets: EMPTY_FACETS, error },
      { headers: { "Cache-Control": BRIEF } },
    );
  }
}

/* ——— the filter grammar: label over control, hairline fields, zero radius ——— */

const FIELD =
  "border border-ink/20 bg-white px-3 py-2 text-[14px] outline-none focus:border-gold";

function Field({
  id,
  label,
  className = "",
  children,
}: {
  id: string;
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`flex flex-col ${className}`}>
      <label
        htmlFor={id}
        className="mb-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-fog"
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function FacetSelect({
  id,
  name,
  label,
  options,
  current,
  display = (s: string) => s,
  className = "",
}: {
  id: string;
  name: string;
  label: string;
  options: string[];
  current: string | null;
  display?: (s: string) => string | null;
  className?: string;
}) {
  return (
    <Field id={id} label={label} className={className}>
      <select id={id} name={name} defaultValue={current ?? ""} className={`${FIELD} cursor-pointer`}>
        <option value="">All</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {display(o) ?? o}
          </option>
        ))}
      </select>
    </Field>
  );
}

/** The current URL minus one filter — how a chip removes itself. */
function without(params: URLSearchParams, key: string, value?: string): string {
  const next = new URLSearchParams();
  for (const [k, v] of params) {
    if (k === key && (value === undefined || v === value)) continue;
    next.append(k, v);
  }
  const s = next.toString();
  return s ? `/properties?${s}` : "/properties";
}

export default function Properties() {
  const { state, projects, total, facets, error } = useLoaderData<typeof loader>();
  const [params] = useSearchParams();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const navigate = useNavigate();

  /** Submit only what is actually set — a URL full of `emirate=&type=` reads
   *  as noise in the address bar and in every shared link. Without JS the
   *  plain GET still works; the loader treats empty params as absent. */
  const submitClean = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dialogRef.current?.close();
    const next = new URLSearchParams();
    for (const [k, v] of new FormData(e.currentTarget)) {
      const s = String(v).trim();
      if (s) next.append(k, s);
    }
    const qs = next.toString();
    navigate(qs ? `/properties?${qs}` : "/properties");
  };

  /* what is applied right now, as removable chips */
  const chips: Array<{ label: string; href: string }> = [];
  const q = params.get("q");
  if (q) chips.push({ label: `"${q}"`, href: without(params, "q") });
  for (const key of ["developer", "emirate", "community", "area", "type", "status", "category"] as const) {
    const v = params.get(key);
    if (v) chips.push({ label: humanise(v) ?? v, href: without(params, key) });
  }
  const minP = params.get("minPrice");
  if (minP) chips.push({ label: `From ${money(Number(minP)) ?? minP}`, href: without(params, "minPrice") });
  const maxP = params.get("maxPrice");
  if (maxP) chips.push({ label: `To ${money(Number(maxP)) ?? maxP}`, href: without(params, "maxPrice") });
  for (const a of params.getAll("amenity")) {
    chips.push({ label: a, href: without(params, "amenity", a) });
  }
  const filtered = chips.length > 0;
  /** how many of the applied filters live behind the dialog, for its button */
  const inDialog =
    ["emirate", "community", "area", "category", "minPrice", "maxPrice"].filter((k) =>
      params.get(k),
    ).length + params.getAll("amenity").length;

  return (
    <>
      {/* Section's own `md:py-18` outranks unprefixed overrides at md+ (the
          media rule is emitted later), so both edges carry md-prefixed values:
          without them the eyebrow sat straight under the fixed header and the
          intro trailed four and a half rems of nothing. */}
      <Section className="pt-40 pb-6 md:pt-40 md:pb-8">
        <Reveal exit>
          <Eyebrow className="text-fog">The Register</Eyebrow>
        </Reveal>
        <SplitHeading as="h1" className="type-display mt-6 max-w-[20ch]">
          Every address, on the record.
        </SplitHeading>
        <Reveal delay={0.1}>
          <p className="type-body-lg mt-6 max-w-[54ch] text-ink/70">
            Pricing, handover, payment terms and permit details as the developers file them.
            Nothing is presented without a valid Trakheesi permit, so what you read here is what
            is lawful to sell.
          </p>
        </Reveal>
      </Section>

      <Section className="pt-0 md:pt-0">
        {state === "ok" && (
          <>
            {/* A GET form: filters live in the URL, so any result set can be
                linked, bookmarked and re-rendered on the server. The dialog
                sits inside the same form — everything applies in one submit. */}
            {/* Amelia's tracker reports every form submit as a conversion and
                offers no opt-out, so an unnamed filter form would land in the
                lead numbers as a generic `form_submit`. Naming it keeps a
                search separable from an enquiry in every report. */}
            <Form
              method="get"
              onSubmit={submitClean}
              data-amelia-conversion="register_search"
              className="border-y border-ink/12 py-5"
            >
              <div className="flex flex-wrap items-end gap-x-4 gap-y-4">
                <Field id="f-q" label="Search" className="min-w-[220px] flex-1 basis-[260px]">
                  <input
                    id="f-q"
                    type="search"
                    name="q"
                    defaultValue={q ?? ""}
                    placeholder="A name, a developer, a community, an amenity…"
                    className={`${FIELD} w-full`}
                  />
                </Field>
                {/* Developer is the facet people actually arrive with, so it
                    takes the row. Wider than the others because a developer
                    name is a name, not a one-word category. No `display`: these
                    are already proper nouns and humanise would re-case them. */}
                <FacetSelect
                  id="f-developer"
                  name="developer"
                  label="Developer"
                  options={facets.developers}
                  current={params.get("developer")}
                  className="w-[190px]"
                />
                <FacetSelect
                  id="f-type"
                  name="type"
                  label="Type"
                  options={facets.types}
                  current={params.get("type")}
                  display={humanise}
                  className="w-[140px]"
                />
                <FacetSelect
                  id="f-status"
                  name="status"
                  label="Status"
                  options={facets.statuses}
                  current={params.get("status")}
                  display={humanise}
                  className="w-[160px]"
                />
                <button
                  type="button"
                  onClick={() => dialogRef.current?.showModal()}
                  className="flex cursor-pointer items-center gap-2 border border-ink/25 px-4 py-[9px] text-[11.5px] font-semibold uppercase tracking-[0.1em] text-ink transition-colors hover:border-ink"
                >
                  All filters
                  {inDialog > 0 && (
                    <span className="flex h-[18px] min-w-[18px] items-center justify-center bg-ink px-1 text-[10px] tabular-nums text-ivory">
                      {inDialog}
                    </span>
                  )}
                </button>
                <button className="cursor-pointer bg-ink px-5 py-2.5 text-[11.5px] font-semibold uppercase tracking-[0.1em] text-ivory">
                  Filter
                </button>
                {filtered && (
                  <Link
                    to="/properties"
                    className="type-cap self-center text-brass underline underline-offset-2"
                  >
                    Clear
                  </Link>
                )}
              </div>

              {/* ——— everything else, behind one quiet door ——— */}
              <dialog
                ref={dialogRef}
                aria-label="All register filters"
                className="m-auto w-[min(94vw,760px)] border border-ink/20 bg-ivory p-0 text-ink backdrop:bg-ink/55"
              >
                <div className="flex items-center justify-between border-b border-ink/12 px-7 py-5">
                  <Eyebrow className="text-fog">Refine the register</Eyebrow>
                  <button
                    type="button"
                    onClick={() => dialogRef.current?.close()}
                    aria-label="Close filters"
                    className="flex h-10 w-10 cursor-pointer items-center justify-center border border-ink/20 text-[1.05rem] leading-none transition-colors hover:border-ink"
                  >
                    ×
                  </button>
                </div>
                <div className="grid max-h-[62vh] gap-x-7 gap-y-6 overflow-y-auto px-7 py-7 sm:grid-cols-2">
                  <FacetSelect
                    id="f-emirate"
                    name="emirate"
                    label="Emirate"
                    options={facets.emirates}
                    current={params.get("emirate")}
                    display={humanise}
                  />
                  <FacetSelect
                    id="f-community"
                    name="community"
                    label="Community"
                    options={facets.communities}
                    current={params.get("community") ?? params.get("area")}
                  />
                  <FacetSelect
                    id="f-category"
                    name="category"
                    label="Category"
                    options={facets.categories}
                    current={params.get("category")}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Field id="f-min" label="Price from (AED)">
                      <input
                        id="f-min"
                        type="number"
                        inputMode="numeric"
                        min="0"
                        step="100000"
                        name="minPrice"
                        defaultValue={minP ?? ""}
                        placeholder="1000000"
                        className={FIELD}
                      />
                    </Field>
                    <Field id="f-max" label="Price to (AED)">
                      <input
                        id="f-max"
                        type="number"
                        inputMode="numeric"
                        min="0"
                        step="100000"
                        name="maxPrice"
                        defaultValue={maxP ?? ""}
                        placeholder="5000000"
                        className={FIELD}
                      />
                    </Field>
                  </div>
                  {facets.amenities.length > 0 && (
                    <fieldset className="sm:col-span-2">
                      <legend className="mb-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-fog">
                        Amenities
                      </legend>
                      <div className="grid grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2 md:grid-cols-3">
                        {facets.amenities.map((a) => (
                          <label
                            key={a}
                            className="flex cursor-pointer items-center gap-2.5 text-[14px] text-ink/80"
                          >
                            <input
                              type="checkbox"
                              name="amenity"
                              value={a}
                              defaultChecked={params.getAll("amenity").includes(a)}
                              className="h-4 w-4 cursor-pointer accent-ink"
                            />
                            {a}
                          </label>
                        ))}
                      </div>
                    </fieldset>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-5 border-t border-ink/12 px-7 py-5">
                  <button
                    onClick={() => dialogRef.current?.close()}
                    className="cursor-pointer bg-ink px-6 py-2.5 text-[11.5px] font-semibold uppercase tracking-[0.1em] text-ivory"
                  >
                    Apply filters
                  </button>
                  <Link
                    to="/properties"
                    onClick={() => dialogRef.current?.close()}
                    className="type-cap text-brass underline underline-offset-2"
                  >
                    Clear all
                  </Link>
                </div>
              </dialog>
            </Form>

            {filtered && (
              <div className="mt-4 flex flex-wrap gap-2">
                {chips.map((c) => (
                  <Link
                    key={c.href + c.label}
                    to={c.href}
                    aria-label={`Remove filter: ${c.label}`}
                    className="group inline-flex items-center gap-2 border border-ink/20 bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink/80 transition-colors hover:border-ink"
                  >
                    <span>{c.label}</span>
                    <span aria-hidden className="text-fog transition-colors group-hover:text-ink">
                      ×
                    </span>
                  </Link>
                ))}
              </div>
            )}

            {projects.length > 0 && (
              <p className="type-cap mt-5 text-fog">
                {projects.length === total
                  ? `${total} addresses on the register`
                  : `${projects.length} of ${total} addresses`}
              </p>
            )}
          </>
        )}

        {state === "unconfigured" && (
          <div className="border border-ink/18 p-8">
            <p className="type-title">The register is being connected.</p>
            <p className="mt-3 max-w-[52ch] text-[15.5px] text-ink/75">
              Listings are served from Amelia's catalogue. Once the credentials are in place this
              page fills itself, with no content copied across by hand.
            </p>
          </div>
        )}

        {state === "error" && (
          <div className="border border-ink/18 p-8" role="status">
            <p className="type-title">The register is briefly unavailable.</p>
            <p className="mt-3 max-w-[52ch] text-[15.5px] text-ink/75">{error}</p>
            <p className="type-cap mt-4 text-fog">
              Nothing is lost. Try again shortly, or{" "}
              <AdvisorLink context="the register, which is not loading">
                ask an advisor
              </AdvisorLink>
              .
            </p>
          </div>
        )}

        {/* Two different nothings, and they were saying the same sentence.
            "Nothing matches that yet" is only true if the visitor asked for
            something; on a bare visit it blames them for a catalogue that has
            nothing published in it. */}
        {state === "ok" && projects.length === 0 && (
          <div className="mt-8 border border-ink/18 p-8">
            {filtered ? (
              <>
                <p className="type-title">Nothing matches that yet.</p>
                <p className="mt-3 text-[15.5px] text-ink/75">
                  Loosen a filter above, or{" "}
                  <Link to="/properties" className="text-brass underline underline-offset-2">
                    clear them all
                  </Link>{" "}
                  to see the whole register.
                </p>
              </>
            ) : (
              <>
                <p className="type-title">No addresses are published yet.</p>
                <p className="mt-3 max-w-[54ch] text-[15.5px] text-ink/75">
                  The register is served live from Amelia's catalogue, so this page fills itself the
                  moment a permitted project is published. Nothing is listed here without a valid
                  Trakheesi permit.
                </p>
                <p className="mt-5 text-[15.5px] text-ink/75">
                  An advisor can tell you what is coming before it appears.{" "}
                  <AdvisorLink context="what is coming to the register">Ask one</AdvisorLink>
                  .
                </p>
              </>
            )}
          </div>
        )}

        {projects.length > 0 && (
          <RevealGroup className="mt-7 grid gap-x-5 gap-y-9 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <RevealItem key={p.id}>
                <PropertyCard project={p} />
              </RevealItem>
            ))}
          </RevealGroup>
        )}
      </Section>
    </>
  );
}
