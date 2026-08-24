import { useActionData } from "react-router";
import type { ActionFunctionArgs } from "react-router";
import { Eyebrow, Ledger, Section } from "~/components/primitives";
import { Hero } from "~/components/Hero";
import { SplitHeading } from "~/components/SplitHeading";
import { ContactForm } from "~/components/ContactForm";
import { processEnquiry } from "~/lib/enquiry.server";
import { SITE, meta as buildMeta } from "~/lib/site";

export const handle = { headerTone: "dark" as const };

/**
 * The no-JavaScript path. `/contact` is prerendered, so between first paint and
 * hydration the submit button is an ordinary one — and a visitor who submits in
 * that window, or who has JavaScript blocked, posts the form natively to this
 * route. Without this action that produced a framework error page and the
 * enquiry was lost. Same pipeline as /api/submit.
 */
export async function action({ request }: ActionFunctionArgs) {
  const { ok, error } = await processEnquiry(request);
  return { ok, error };
}

export function meta() {
  return buildMeta({
    title: "Speak With an Advisor",
    description:
      "Speak with a salaried Serene Bay advisor about an off-plan purchase in Dubai or Abu Dhabi. One reply within a business day, and a call only if you ask for one.",
    path: "/contact",
  });
}

export default function Contact() {
  // Present only when the form was submitted without JavaScript.
  const fallback = useActionData<typeof action>();
  return (
    <>
    <Hero plate="dusk" image="/images/mamsha-gardens-03.jpg" height="min-h-[52svh]">
      <Eyebrow className="text-silver">Speak With an Advisor</Eyebrow>
      <SplitHeading as="h1" mode="chars" className="type-display mt-5 max-w-[18ch]">
        Start with the objective.
      </SplitHeading>
    </Hero>

    <Section>
      <p className="type-body-lg max-w-[58ch] text-ink/74">
        Stage one is a conversation about what the purchase is actually for — capital growth,
        rental yield, Golden Visa eligibility, lifestyle use, exit horizon — and what it costs
        all-in. No project is named until that is clear. The advisor you speak to is salaried, so
        nothing in this exchange is worth more to them than being right.
      </p>
      <div className="mt-14 grid gap-14 md:grid-cols-12">
        <div className="md:col-span-7">
          <ContactForm fallback={fallback} />
        </div>
        <aside className="md:col-span-4 md:col-start-9">
          <Eyebrow className="text-fog">Direct</Eyebrow>
          <div className="mt-5 flex flex-col gap-5">
            <Ledger cells={[{ k: "Email", v: SITE.email }]} />
            <Ledger cells={[{ k: "Office", v: SITE.office }]} />
            <Ledger cells={[{ k: "Hours", v: SITE.hours }]} />
          </div>
          <p className="type-cap mt-6 max-w-[40ch] text-fog">
            We will only call you if you ask us to on the form. There is no follow-up campaign and
            no sales floor to pass you to.
          </p>
        </aside>
      </div>
    </Section>
    </>
  );
}
