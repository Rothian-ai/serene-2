import { Eyebrow, Ledger, Section } from "~/components/primitives";
import { ContactForm } from "~/components/ContactForm";
import { SITE, meta as buildMeta } from "~/lib/site";

export const handle = { headerTone: "light" as const };

export function meta() {
  return buildMeta({
    title: "Contact",
    description:
      "Write to Serene. One reply within a business day: no lists, no campaigns. Office in Downtown Dubai.",
    path: "/contact",
  });
}

export default function Contact() {
  return (
    <Section className="pt-40">
      <Eyebrow className="text-brass">Enquire</Eyebrow>
      <h1 className="type-display mt-6 max-w-[16ch]">Write once. Hear back once.</h1>
      <div className="mt-14 grid gap-14 md:grid-cols-12">
        <div className="md:col-span-7">
          <ContactForm />
        </div>
        <aside className="md:col-span-4 md:col-start-9">
          <Eyebrow className="text-brass">Direct</Eyebrow>
          <div className="mt-5 flex flex-col gap-5">
            <Ledger cells={[{ k: "Email", v: SITE.email }]} />
            <Ledger cells={[{ k: "Office", v: SITE.office }]} />
            <Ledger cells={[{ k: "Hours", v: SITE.hours }]} />
          </div>
          <p className="type-cap mt-6 max-w-[40ch] text-fog">
            Prefer an immediate answer at any hour? Amelia holds the data and never sleeps.
          </p>
        </aside>
      </div>
    </Section>
  );
}
