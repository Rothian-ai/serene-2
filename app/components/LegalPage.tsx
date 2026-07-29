import { Eyebrow, Section } from "~/components/primitives";
import { legal, renderMarkdown } from "~/lib/content";

/** Shared shell for the legal tier — content lives in /content/legal/*.md. */
export function LegalPage({ slug }: { slug: string }) {
  const doc = legal[slug];
  if (!doc) throw new Response("Not Found", { status: 404 });
  return (
    <Section className="pt-40">
      <Eyebrow className="text-fog">Legal</Eyebrow>
      <h1 className="type-display mt-6">{doc.title}</h1>
      {doc.updated && <p className="type-cap mt-4 text-fog">Last updated {doc.updated}</p>}
      <div
        className="prose-serene mt-12"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(doc.body) }}
      />
    </Section>
  );
}
