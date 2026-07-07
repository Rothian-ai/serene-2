import { useSearchParams } from "react-router";
import { motion } from "framer-motion";
import { Eyebrow, Plate, Reveal, RevealGroup, RevealItem, Section } from "~/components/primitives";
import { QuestionSettle } from "~/components/AmeliaBand";
import { ameliaHref } from "~/lib/site";
import { track } from "~/lib/analytics";
import { meta as buildMeta } from "~/lib/site";

export const handle = { headerTone: "dark" as const };

export function meta() {
  return buildMeta({
    title: "Amelia",
    description:
      "Amelia is Serene's AI advisory platform for UAE off-plan real estate. Ask anything, anytime — data-backed answers, and never a follow-up call.",
    path: "/amelia",
  });
}

const GATEWAY_QUESTIONS = [
  "What protects my deposit under UAE escrow law?",
  "Which Creek Harbour handovers complete before 2028?",
  "Model an 80/20 plan against expected rental yield.",
];

const PROMISES = [
  {
    k: "ON YOUR TERMS",
    copy: "Midnight or midday, one question or forty. The pace is yours.",
  },
  {
    k: "YOUR DATA",
    copy: "What you share stays within the conversation. Nothing is passed to a sales floor.",
  },
  {
    k: "NO FOLLOW-UP, EVER",
    copy: "Close the window and that is the end of it. We don't call. We don't campaign.",
  },
];

/** The gateway — the only all-navy page. Every sitewide CTA lands here
 *  before the honest, one-click external handoff. */
export default function Amelia() {
  const [params] = useSearchParams();
  const ref = params.get("ref") ?? "direct";
  const context = params.get("context") ?? undefined;
  const href = ameliaHref(ref, context);

  return (
    <div className="bg-navy text-ivory">
      <Section className="pt-44">
        <Eyebrow className="text-gold">Amelia</Eyebrow>
        <h1 className="type-display-xl mt-6 max-w-[13ch]">An advisor who never calls first.</h1>
        <p className="type-body-lg mt-7 max-w-[52ch] text-ivory/82">
          Amelia is Serene's AI advisory platform. She holds the data — transaction histories,
          service charges, escrow rules, handover records — and she answers when asked. That is
          the entire relationship.
        </p>
      </Section>

      <Section className="pt-0">
        <Eyebrow className="text-gold">Ask her, for instance</Eyebrow>
        <div className="mt-6 max-w-[820px]">
          <QuestionSettle questions={GATEWAY_QUESTIONS} />
        </div>
      </Section>

      <Section className="pt-0">
        <RevealGroup className="grid gap-9 md:grid-cols-3">
          {PROMISES.map((p) => (
            <RevealItem key={p.k} className="border-t border-ivory/18 pt-4">
              <div className="type-data text-gold">{p.k}</div>
              <p className="mt-2 text-[15.5px] leading-relaxed text-ivory/75">{p.copy}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* the threshold */}
      <Plate kind="dusk" image="/images/amelia-dusk.jpg" alt="">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(13,29,60,0.72), rgba(13,29,60,0.28) 55%, rgba(13,29,60,0.15))" }}
        />
        <div className="relative z-[1] mx-auto flex min-h-[56svh] max-w-[1440px] flex-col items-center justify-center px-6 py-24 text-center">
          <Reveal>
            <h2 className="type-display">Bring her your hardest question.</h2>
            <motion.div
              className="mt-9"
              whileHover={{ y: -1 }}
              transition={{ duration: 0.25 }}
            >
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track("amelia_engage", { ref, ...(context ? { context } : {}) })}
                className="inline-block bg-gold px-9 py-4 text-[13px] font-semibold uppercase tracking-[0.1em] text-ink transition-colors duration-300 hover:bg-dawn"
              >
                Begin with Amelia&nbsp;&nbsp;↗
              </a>
            </motion.div>
            <p className="type-cap mt-4 text-ivory/55">Amelia opens in a new window.</p>
          </Reveal>
        </div>
      </Plate>
    </div>
  );
}
