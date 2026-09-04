import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { CTA, Eyebrow, Plate, Reveal } from "~/components/primitives";
import { SplitHeading } from "~/components/SplitHeading";
import { ENQUIRY } from "~/lib/strategy";
import { ASK_EXTERNAL, WHATSAPP_ASIDE, askFootnote, askHref, conversationHref } from "~/lib/site";

/**
 * The closing band on every inner page, and the site's single conversion
 * moment: a photographic navy surface that ends in the contact form.
 *
 * It replaces the Amelia handoff band that used to close these pages. Navy was
 * previously reserved for Amelia; with that surface parked, navy now carries
 * the commercial-transparency and conversion moments instead (see app.css).
 *
 * The photograph drifts slowly behind a navy scrim as the band passes — enough
 * to feel alive, nowhere near enough to compete with the type. Drift is off
 * under prefers-reduced-motion.
 */
export function ConversationBand({
  eyebrow = "Our promise",
  title,
  copy,
  primary = "Ask Amelia, our AI Sales Agent",
  secondary,
  secondaryTo,
  image = "/images/about-ask.jpg",
  alt = "A quiet lounge in warm evening light",
  context,
}: {
  eyebrow?: string;
  title: string;
  copy: string;
  primary?: string;
  secondary?: string;
  secondaryTo?: string;
  image?: string;
  alt?: string;
  /** what the visitor is asking about: folded into the WhatsApp opening line, or typed as the first line of the web chat, so Amelia knows the page */
  context?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <div ref={ref} className="relative overflow-hidden bg-navy text-ivory">
      <motion.div
        aria-hidden={false}
        className="absolute inset-x-0 -bottom-[8%] -top-[8%]"
        style={reduced ? undefined : { y }}
      >
        <Plate kind="dusk" image={image} alt={alt} className="h-full w-full" />
      </motion.div>
      {/* legibility scrim — navy, from both edges, never a flat wall */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(100deg, rgba(17,28,57,0.94) 0%, rgba(17,28,57,0.82) 48%, rgba(17,28,57,0.55) 100%)",
        }}
      />
      <div className="container-site relative py-20 md:py-28">
        <div className="max-w-[46ch]">
          <Reveal exit>
            <Eyebrow className="text-silver">{eyebrow}</Eyebrow>
          </Reveal>
          <SplitHeading as="h2" className="type-headline mt-5">
            {title}
          </SplitHeading>
          <Reveal delay={0.12}>
            <p className="type-body-lg mt-6 text-ivory/78">{copy}</p>
            <div className="mt-10 flex flex-wrap gap-4">
              <CTA to={askHref({ context })} kind="platinum" external={ASK_EXTERNAL}>
                {primary}
              </CTA>
              {secondary && secondaryTo && (
                <CTA to={secondaryTo} kind="line">
                  {secondary}
                </CTA>
              )}
            </div>
            <p className="type-cap mt-5 text-ivory/55">{askFootnote(ENQUIRY.footnote)}</p>
            {WHATSAPP_ASIDE && (
              <p className="type-cap mt-2 text-ivory/55">
                Prefer WhatsApp?{" "}
                <a
                  href={conversationHref(context)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:text-ivory"
                >
                  Message Amelia there ↗
                </a>
              </p>
            )}
          </Reveal>
        </div>
      </div>
    </div>
  );
}
