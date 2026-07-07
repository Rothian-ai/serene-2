import { Link } from "react-router";
import { motion } from "framer-motion";
import { Eyebrow, Section } from "~/components/primitives";
import { viewportOnce } from "~/lib/motion";

/**
 * The contextual Amelia threshold — the one navy surface on any page.
 * Lands on /amelia (the gateway) carrying its context; the gateway makes
 * the promise in full before the external handoff.
 */
export function AmeliaBand({
  title,
  cta = "Speak with Amelia",
  refId,
  context,
  caption = "Answers on demand. No call-backs, no lists.",
}: {
  title: string;
  cta?: string;
  refId: string;
  context?: string;
  caption?: string;
}) {
  const to = `/amelia?ref=${refId}${context ? `&context=${context}` : ""}`;
  return (
    <div className="bg-navy text-ivory">
      <Section tight className="text-center">
        <h2 className="type-headline">{title}</h2>
        <div className="mt-7">
          <Link
            to={to}
            className="inline-block bg-gold px-8 py-[15px] text-[12.5px] font-semibold uppercase tracking-[0.1em] text-ink transition-colors duration-300 hover:bg-dawn"
          >
            {cta}
          </Link>
        </div>
        <p className="type-cap mt-4 text-silver">{caption}</p>
      </Section>
    </div>
  );
}

/**
 * Type-settle: investor questions resolving in sequence — editorial
 * typography, no chat chrome. The site's one interactive-storytelling device.
 */
export function QuestionSettle({ questions }: { questions: string[] }) {
  // floor at 0.5 — ivory@0.5 over navy is the last step that clears WCAG 4.5:1
  const opacities = [1, 0.68, 0.5];
  return (
    <div>
      {questions.map((q, i) => (
        <motion.div
          key={q}
          className={`border-t border-ivory/16 py-4 ${i === questions.length - 1 ? "" : ""}`}
          style={{ opacity: opacities[i] ?? 0.3 }}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{
            opacity: opacities[i] ?? 0.3,
            y: 0,
            transition: { duration: 0.6, delay: 0.35 * i, ease: [0.22, 1, 0.36, 1] },
          }}
          viewport={viewportOnce}
        >
          <span className="type-title font-light">“{q}”</span>
        </motion.div>
      ))}
    </div>
  );
}

export const AMELIA_QUESTIONS = [
  "What protects my deposit under UAE escrow law?",
  "Compare service charges in Downtown and Creek Harbour.",
  "Which handovers complete before 2028?",
];
