import { Eyebrow, Section } from "~/components/primitives";
import { DevelopmentCard } from "~/components/cards";
import { developments } from "~/lib/content";
import { meta as buildMeta } from "~/lib/site";

export const handle = { headerTone: "dark" as const };

export function meta() {
  return buildMeta({ title: "Not found", description: "This address doesn't exist." });
}

export default function NotFound() {
  const featured = developments.slice(0, 3);
  return (
    <>
      <div className="bg-ink text-ivory">
        <Section className="pt-48 text-center">
          <Eyebrow className="justify-center text-silver">404</Eyebrow>
          <h1 className="type-display mt-6">
            This address doesn't exist. The developments below do.
          </h1>
        </Section>
      </div>
      <Section>
        <div className="grid gap-10 md:grid-cols-3">
          {featured.map((d) => (
            <DevelopmentCard key={d.slug} development={d} aspect="aspect-[4/5]" compact />
          ))}
        </div>
      </Section>
    </>
  );
}
