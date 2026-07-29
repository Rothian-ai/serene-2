import { marked } from "marked";
import { load as loadYaml } from "js-yaml";

/**
 * Content collections.
 *
 * Every development, developer profile, and insight article is a markdown
 * file in /content with standard YAML frontmatter. Adding content = adding a
 * file — by hand, or through the Decap CMS admin at /admin (see ADD-CONTENT.md).
 * No component ever hard-codes an entity. Structured fields (amenities, gallery,
 * reasons, landmarks, map) are YAML arrays/objects.
 */

type Frontmatter = Record<string, unknown>;

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

function parseFrontmatter(raw: string): { data: Frontmatter; body: string } {
  const match = FRONTMATTER.exec(raw);
  if (!match) return { data: {}, body: raw };
  const data = (loadYaml(match[1]) as Frontmatter) ?? {};
  return { data, body: raw.slice(match[0].length) };
}

/** Coerce a frontmatter value to a string (numbers tolerated). */
const str = (v: unknown, fallback = ""): string =>
  typeof v === "string" ? v : v == null ? fallback : String(v);
/** Coerce to a number, or undefined when absent. */
const num = (v: unknown): number | undefined =>
  typeof v === "number" ? v : v == null || v === "" ? undefined : Number(v);
/** A date value YAML may have parsed as a Date → ISO `YYYY-MM-DD` string. */
const isoDate = (v: unknown): string =>
  v instanceof Date ? v.toISOString().slice(0, 10) : str(v);

/**
 * Structured lists are YAML arrays of objects, e.g.
 *   amenities:
 *     - { icon: pool, label: Rooftop Pool }
 */
export interface Amenity {
  icon: string;
  label: string;
}
export interface Landmark {
  time: string;
  place: string;
}
export interface GalleryImage {
  src: string;
  caption?: string;
}
export interface Reason {
  heading: string;
  body: string;
}

export function renderMarkdown(body: string): string {
  return marked.parse(body, { async: false }) as string;
}

export interface BodySection {
  id: string;
  title: string;
  html: string;
}

/**
 * Split a markdown body into its top-level (`## `) sections for the
 * sticky section-nav on masterpiece pages. Any preamble before the first
 * heading is discarded (our development bodies open straight on a heading).
 */
export function parseSections(body: string): BodySection[] {
  return body
    .split(/\r?\n(?=## )/)
    .map((part) => part.trim())
    .map((part) => {
      const m = /^##\s+(.+)/.exec(part);
      if (!m) return null;
      const title = m[1].trim();
      const id = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      const rest = part.replace(/^##\s+.+(\r?\n)?/, "");
      return { id, title, html: renderMarkdown(rest) };
    })
    .filter((s): s is BodySection => s !== null);
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** 2026-07-02 → "July 2026" — editorial, and stable at prerender time. */
export function formatDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})/.exec(iso);
  if (!m) return iso;
  return `${MONTHS[Number(m[2]) - 1]} ${m[1]}`;
}

export type PlateKind = "hero" | "render" | "stone" | "interior" | "dusk" | "glass";

export interface Development {
  slug: string;
  title: string;
  developer: string; // developer slug
  district: string;
  city: "Dubai" | "Abu Dhabi";
  status: string;
  handover: string;
  paymentPlan: string;
  priceFrom: string;
  excerpt: string;
  plate: PlateKind;
  image?: string;
  featured?: number;
  /** one-line Nakheel-style positioning statement */
  positioning?: string;
  /** descriptive overview paragraph (info-first block) */
  overview?: string;
  amenities: Amenity[];
  gallery: GalleryImage[];
  reasons: Reason[];
  landmarks: Landmark[];
  map?: { lat: number; lng: number; zoom: number };
  body: string;
}

export interface Developer {
  slug: string;
  name: string;
  founded: string;
  hq: string;
  delivered: string;
  notable: string[];
  tagline: string;
  plate: PlateKind;
  image?: string;
  body: string;
}

export interface Insight {
  slug: string;
  title: string;
  category: "Market Analysis" | "Investment Guides" | "Developer Spotlights" | "Journal";
  date: string;
  readingTime: string;
  excerpt: string;
  plate: PlateKind;
  image?: string;
  featured?: number;
  body: string;
}

function load<T>(
  files: Record<string, string>,
  map: (slug: string, data: Frontmatter, body: string) => T,
): T[] {
  return Object.entries(files).map(([path, raw]) => {
    const slug = path.split("/").pop()!.replace(/\.md$/, "");
    const { data, body } = parseFrontmatter(raw);
    return map(slug, data, body);
  });
}

const developmentFiles = import.meta.glob("../../content/developments/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const developerFiles = import.meta.glob("../../content/developers/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const insightFiles = import.meta.glob("../../content/insights/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const legalFiles = import.meta.glob("../../content/legal/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

export const developments: Development[] = load(developmentFiles, (slug, d, body) => ({
  slug,
  title: str(d.title, slug),
  developer: str(d.developer),
  district: str(d.district),
  city: (str(d.city, "Dubai") as Development["city"]),
  status: str(d.status),
  handover: str(d.handover),
  paymentPlan: str(d.paymentPlan),
  priceFrom: str(d.priceFrom),
  excerpt: str(d.excerpt),
  plate: (str(d.plate, "render") as PlateKind),
  image: str(d.image) || undefined,
  featured: num(d.featured),
  positioning: str(d.positioning) || undefined,
  overview: str(d.overview) || undefined,
  amenities: (d.amenities as Amenity[] | undefined) ?? [],
  gallery: (d.gallery as GalleryImage[] | undefined) ?? [],
  reasons: (d.reasons as Reason[] | undefined) ?? [],
  landmarks: (d.landmarks as Landmark[] | undefined) ?? [],
  map: d.map
    ? {
        lat: Number((d.map as Record<string, unknown>).lat),
        lng: Number((d.map as Record<string, unknown>).lng),
        zoom: Number((d.map as Record<string, unknown>).zoom) || 15,
      }
    : undefined,
  body,
})).sort((a, b) => (a.featured ?? 99) - (b.featured ?? 99));

export const developers: Developer[] = load(developerFiles, (slug, d, body) => ({
  slug,
  name: str(d.name, slug),
  founded: str(d.founded),
  hq: str(d.hq),
  delivered: str(d.delivered),
  notable: (d.notable as string[] | undefined) ?? [],
  tagline: str(d.tagline),
  plate: (str(d.plate, "glass") as PlateKind),
  image: str(d.image) || undefined,
  body,
})).sort((a, b) => a.name.localeCompare(b.name));

export const insights: Insight[] = load(insightFiles, (slug, d, body) => ({
  slug,
  title: str(d.title, slug),
  category: (str(d.category, "Journal") as Insight["category"]),
  date: isoDate(d.date),
  readingTime: str(d.readingTime, "4 min"),
  excerpt: str(d.excerpt),
  plate: (str(d.plate, "dusk") as PlateKind),
  image: str(d.image) || undefined,
  featured: num(d.featured),
  body,
})).sort((a, b) => (b.date > a.date ? 1 : -1));

export const legal: Record<string, { title: string; updated: string; body: string }> =
  Object.fromEntries(
    load(legalFiles, (slug, d, body) => [
      slug,
      { title: str(d.title, slug), updated: str(d.updated), body },
    ] as const).map(([k, v]) => [k, v]),
  );

export const getDevelopment = (slug: string) => developments.find((d) => d.slug === slug);
export const getDeveloper = (slug: string) => developers.find((d) => d.slug === slug);
export const getInsight = (slug: string) => insights.find((i) => i.slug === slug);
export const developmentsByDeveloper = (slug: string) =>
  developments.filter((d) => d.developer === slug);
