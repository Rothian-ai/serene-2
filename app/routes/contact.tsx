import { useActionData } from "react-router";
import type { ActionFunctionArgs } from "react-router";
import { Eyebrow, Ledger, Section } from "~/components/primitives";
import { Hero } from "~/components/Hero";
import { SplitHeading } from "~/components/SplitHeading";
import { ContactForm } from "~/components/ContactForm";
import { processEnquiry } from "~/lib/enquiry.server";
import { ENQUIRY } from "~/lib/strategy";
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
      "We will not call you unless you ask us to. Tell us what you are trying to achieve and an advisor replies in your preferred channel, in your hours, with no obligation and no follow-up sequence.",
    path: "/contact",
  });
}

export default function Contact() {
  // Present only when the form was submitted without JavaScript.
  const fallback = useActionData<typeof action>();
  return (
    <>
    <Hero plate="dusk" image="/images/mamsha-gardens-03.jpg" height="min-h-[52svh]">
      <Eyebrow className="text-silver">{ENQUIRY.eyebrow}</Eyebrow>
      <SplitHeading as="h1" mode="chars" className="type-display mt-5 max-w-[20ch]">
        {ENQUIRY.headline}
      </SplitHeading>
    </Hero>

    <Section>
      <p className="type-body-lg max-w-[58ch] text-ink/74">{ENQUIRY.body}</p>
      <ul className="mt-8 flex flex-col gap-2.5">
        {ENQUIRY.assurances.map((a) => (
          <li key={a} className="flex items-start gap-3.5 text-[15.5px] leading-relaxed text-ink/74">
            <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rotate-45 bg-silver" />
            {a}
          </li>
        ))}
      </ul>
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
          <p className="type-cap mt-6 max-w-[40ch] text-fog">{ENQUIRY.footnote}</p>
        </aside>
      </div>
    </Section>
    </>
  );
}
