import { marked } from "marked";

/**
 * Content collections.
 *
 * Every development, developer profile, and insight article is a markdown
 * file in /content with flat frontmatter. Adding content = adding a file;
 * no component ever hard-codes an entity. Lists (e.g. `notable`) are
 * pipe-separated: `notable: Burj Khalifa | Dubai Mall`.
 */

type Frontmatter = Record<string, string>;

function parseFrontmatter(raw: string): { data: Frontmatter; body: string } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw);
  if (!match) return { data: {}, body: raw };
  const data: Frontmatter = {};
  for (const line of match[1].split(/\r?\n/)) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    if (key) data[key] = value;
  }
  return { data, body: raw.slice(match[0].length) };
}

function list(value: string | undefined): string[] {
  return value ? value.split("|").map((s) => s.trim()).filter(Boolean) : [];
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
  title: d.title ?? slug,
  developer: d.developer ?? "",
  district: d.district ?? "",
  city: (d.city as Development["city"]) ?? "Dubai",
  status: d.status ?? "",
  handover: d.handover ?? "",
  paymentPlan: d.paymentPlan ?? "",
  priceFrom: d.priceFrom ?? "",
  excerpt: d.excerpt ?? "",
  plate: (d.plate as PlateKind) ?? "render",
  image: d.image || undefined,
  featured: d.featured ? Number(d.featured) : undefined,
  body,
})).sort((a, b) => (a.featured ?? 99) - (b.featured ?? 99));

export const developers: Developer[] = load(developerFiles, (slug, d, body) => ({
  slug,
  name: d.name ?? slug,
  founded: d.founded ?? "",
  hq: d.hq ?? "",
  delivered: d.delivered ?? "",
  notable: list(d.notable),
  tagline: d.tagline ?? "",
  plate: (d.plate as PlateKind) ?? "glass",
  image: d.image || undefined,
  body,
})).sort((a, b) => a.name.localeCompare(b.name));

export const insights: Insight[] = load(insightFiles, (slug, d, body) => ({
  slug,
  title: d.title ?? slug,
  category: (d.category as Insight["category"]) ?? "Journal",
  date: d.date ?? "",
  readingTime: d.readingTime ?? "4 min",
  excerpt: d.excerpt ?? "",
  plate: (d.plate as PlateKind) ?? "dusk",
  image: d.image || undefined,
  featured: d.featured ? Number(d.featured) : undefined,
  body,
})).sort((a, b) => (b.date > a.date ? 1 : -1));

export const legal: Record<string, { title: string; updated: string; body: string }> =
  Object.fromEntries(
    load(legalFiles, (slug, d, body) => [
      slug,
      { title: d.title ?? slug, updated: d.updated ?? "", body },
    ] as const).map(([k, v]) => [k, v]),
  );

export const getDevelopment = (slug: string) => developments.find((d) => d.slug === slug);
export const getDeveloper = (slug: string) => developers.find((d) => d.slug === slug);
export const getInsight = (slug: string) => insights.find((i) => i.slug === slug);
export const developmentsByDeveloper = (slug: string) =>
  developments.filter((d) => d.developer === slug);
