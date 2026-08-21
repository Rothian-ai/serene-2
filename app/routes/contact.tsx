import { Eyebrow, Ledger, Section } from "~/components/primitives";
import { ContactForm } from "~/components/ContactForm";
import { SITE, meta as buildMeta } from "~/lib/site";

export const handle = { headerTone: "light" as const };

export function meta() {
  return buildMeta({
    title: "Speak With an Advisor",
    description:
      "Speak with a salaried Serene Bay advisor about an off-plan purchase in Dubai or Abu Dhabi. One reply within a business day, and a call only if you ask for one.",
    path: "/contact",
  });
}

export default function Contact() {
  return (
    <Section className="pt-40">
      <Eyebrow className="text-fog">Speak With an Advisor</Eyebrow>
      <h1 className="type-display mt-6 max-w-[18ch]">Start with the objective.</h1>
      <p className="type-body-lg mt-6 max-w-[58ch] text-ink/74">
        Stage one is a conversation about what the purchase is actually for — capital growth,
        rental yield, Golden Visa eligibility, lifestyle use, exit horizon — and what it costs
        all-in. No project is named until that is clear. The advisor you speak to is salaried, so
        nothing in this exchange is worth more to them than being right.
      </p>
      <div className="mt-14 grid gap-14 md:grid-cols-12">
        <div className="md:col-span-7">
          <ContactForm />
        </div>
        <aside className="md:col-span-4 md:col-start-9">
          <Eyebrow className="text-fog">Direct</Eyebrow>
          <div className="mt-5 flex flex-col gap-5">
            <Ledger cells={[{ k: "Email", v: SITE.email }]} />
            <Ledger cells={[{ k: "Office", v: SITE.office }]} />
            <Ledger cells={[{ k: "Hours", v: SITE.hours }]} />
          </div>
          <p className="type-cap mt-6 max-w-[40ch] text-fog">
            Prefer an immediate answer at any hour? Amelia holds the record and never sleeps.
          </p>
          <p className="type-cap mt-4 max-w-[40ch] text-fog">
            We will only call you if you ask us to on the form. There is no follow-up campaign and
            no sales floor to pass you to.
          </p>
        </aside>
      </div>
    </Section>
  );
}
