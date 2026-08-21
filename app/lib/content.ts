import { marked } from "marked";
import { load as loadYaml } from "js-yaml";

/**
 * Content collections.
 *
 * The beta site is informative: it explains the Serene Bay model and the market
 * it exists to answer. It carries no property inventory and no developer
 * partnerships, because the strategy names none — the partner network is still
 * to be formalised. So there are two collections: `insights` (the journal) and
 * `legal`. Each entry is a markdown file in /content with YAML frontmatter, and
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

export const legal: Record<string, { title: string; updated: string; body: string }> =
  Object.fromEntries(
    load(legalFiles, (slug, d, body) => [
      slug,
      { title: str(d.title, slug), updated: str(d.updated), body },
    ] as const).map(([k, v]) => [k, v]),
  );

export const getInsight = (slug: string) => insights.find((i) => i.slug === slug);
