import { marked } from "marked";
import { load as loadYaml } from "js-yaml";

/**
 * Content collections.
 *
 * The beta site carries no property inventory of its own: addresses come from
 * Amelia's catalogue at request time. What it does hold as files is editorial:
 * `insights` (the journal), `developers` (the register of houses we are
 * registered with) and `legal`. Each entry is a markdown file in /content with
 * YAML frontmatter, and
 * adding content means adding a file — by hand, or through the Decap CMS admin
 * at /admin (see ADD-CONTENT.md). No component ever hard-codes an entity.
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

export function renderMarkdown(body: string): string {
  return marked.parse(body, { async: false }) as string;
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

/** The photographic surface kinds a <Plate> can wear. */
export type PlateKind = "hero" | "render" | "stone" | "interior" | "dusk" | "glass";

export interface Insight {
  slug: string;
  title: string;
  category: "Market Analysis" | "Buyer Guides" | "The Model" | "Journal";
  date: string;
  readingTime: string;
  excerpt: string;
  plate: PlateKind;
  image?: string;
  featured?: number;
  body: string;
}

/**
 * A developer in the register.
 *
 * Only `name` is guaranteed. The register grew from seven researched profiles to
 * twenty-eight, and the twenty-one added later carry a name and nothing else:
 * founding years, delivery counts, headquarters and notable works are facts
 * about real companies, and an empty field is honest where a guessed one is
 * not. So every other field is optional, and `profiled` says whether a record
 * carries more than a name — which decides how much of a page renders, not
 * whether there is one. Every developer has a page.
 */
export interface Developer {
  slug: string;
  name: string;
  founded?: string;
  hq?: string;
  delivered?: string;
  notable: string[];
  tagline?: string;
  image?: string;
  plate: PlateKind;
  body: string;
  /** true once the record carries more than a name */
  profiled: boolean;
  /**
   * Kept in the repo but off the site: no card on /developers, no mark in the
   * homepage marquee, no page of its own, and absent from the sitemap and the
   * prerender list. A registration we are not presenting right now is not the
   * same as one we never had, so the record stays and a line of frontmatter
   * decides whether it is shown.
   */
  hidden: boolean;
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

const insightFiles = import.meta.glob("../../content/insights/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const developerFiles = import.meta.glob("../../content/developers/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const legalFiles = import.meta.glob("../../content/legal/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

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

const allDevelopers: Developer[] = load(developerFiles, (slug, d, body) => {
  const founded = str(d.founded) || undefined;
  const hq = str(d.hq) || undefined;
  const delivered = str(d.delivered) || undefined;
  const tagline = str(d.tagline) || undefined;
  return {
    slug,
    name: str(d.name, slug),
    founded,
    hq,
    delivered,
    notable: Array.isArray(d.notable) ? d.notable.map((n) => str(n)) : [],
    tagline,
    image: str(d.image) || undefined,
    plate: (str(d.plate, "render") as PlateKind),
    body,
    profiled: Boolean(founded || hq || delivered || tagline || body.trim()),
    hidden: d.hidden === true,
  };
}).sort((a, b) => a.name.localeCompare(b.name));

/**
 * Only the shown ones, everywhere. `getDeveloper` reads this list too, so a
 * hidden slug 404s rather than rendering a page nothing links to. The build-time
 * lists (react-router.config.ts, scripts/generate-sitemap.mjs) apply the same
 * frontmatter flag against the files directly, since they run before this
 * module exists.
 */
export const developers: Developer[] = allDevelopers.filter((d) => !d.hidden);

export const getDeveloper = (slug: string) => developers.find((d) => d.slug === slug);

export const legal: Record<string, { title: string; updated: string; body: string }> =
  Object.fromEntries(
    load(legalFiles, (slug, d, body) => [
      slug,
      { title: str(d.title, slug), updated: str(d.updated), body },
    ] as const).map(([k, v]) => [k, v]),
  );

export const getInsight = (slug: string) => insights.find((i) => i.slug === slug);
