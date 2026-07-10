import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { motion, useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Eyebrow, Plate, Reveal, RevealGroup, RevealItem, Section } from "~/components/primitives";
import { developments } from "~/lib/content";
import { ameliaHref, meta as buildMeta } from "~/lib/site";
import { track } from "~/lib/analytics";
import { EASE_QUIET } from "~/lib/motion";
import type { ReactNode } from "react";

export const handle = { headerTone: "dark" as const };

export function meta() {
  return buildMeta({
    title: "Amelia",
    description:
      "Talk with Amelia — Serene's conversational AI advisor for UAE off-plan real estate. Around-the-clock, data-rich investment answers, and never a cold call.",
    path: "/amelia",
  });
}

/* ——— the scripted register — deterministic demonstrations, not imitation AI.
       Each reply is composed from the record; the platform holds the rest. ——— */

const CHIPS = [
  "What protects my deposit under UAE escrow law?",
  "Which handovers complete before 2028?",
  "Model an 80/20 payment plan against expected yield.",
];

function handoverAnswer(): string {
  const before = developments.filter((d) => {
    const m = d.handover.match(/20\d{2}/);
    return m && Number(m[0]) < 2028;
  });
  if (before.length === 0) {
    return "None of the current register completes before 2028 — the earliest handovers land that year. I can set the full schedule against your horizon on the platform.";
  }
  const list = before.map((d) => `${d.title} (${d.handover})`).join(" · ");
  return `Of the ${developments.length} addresses in the register today, ${before.length} complete before 2028: ${list}. Each is anchored to RERA escrow and a developer we are registered with.`;
}

function scriptedAnswer(q: string): string | null {
  if (q === CHIPS[0]) {
    return "Every dirham paid for off-plan in Dubai sits in a RERA-regulated escrow account, released to the developer only against certified construction progress — never on demand. Abu Dhabi holds the same discipline under ADREC. If a project stalls, the account holds your money; the developer does not.";
  }
  if (q === CHIPS[1]) return handoverAnswer();
  if (q === CHIPS[2]) {
    return "An 80/20 plan settles four-fifths of the price before handover, so the honest model turns on three numbers: entry price, the district's rent record, and service charges. On the platform I run that against live figures rather than a brochure's.";
  }
  return null;
}

const GENERIC_REPLY =
  "I answer that properly with figures, not reassurance — and the figures live on my platform. Continue there and your question comes with me.";

/* ——— the conversation ——— */

type Msg = { id: number; from: "amelia" | "you"; body: string; handoff?: boolean };

const OPENING: Msg[] = [
  { id: 1, from: "amelia", body: "Welcome. I'm Amelia — Serene's advisory intelligence." },
  {
    id: 2,
    from: "amelia",
    body: "I exist so that no one has to call you. Escrow rules, payment plans, service charges, handover records, yields — ask in your own words, at any hour, and I answer from the record.",
  },
];

function AmeliaAvatar() {
  return (
    <span
      aria-hidden
      className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center border border-gold/45"
    >
      <Sparkles size={14} className="text-gold" />
    </span>
  );
}

function Bubble({ msg, href, onEngage }: { msg: Msg; href: string; onEngage: () => void }) {
  if (msg.from === "you") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] bg-ivory px-5 py-4 text-[15px] leading-relaxed text-navy md:max-w-[62%]">
          {msg.body}
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-start gap-3.5">
      <AmeliaAvatar />
      <div className="max-w-[85%] border border-ivory/12 bg-ivory/[0.06] px-5 py-4 text-[15px] leading-relaxed text-ivory/90 md:max-w-[70%]">
        {msg.body}
        {msg.handoff && (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onEngage}
            className="mt-4 flex w-fit items-center gap-2 border-b border-silver/60 pb-1 text-[12.5px] font-semibold uppercase tracking-[0.1em] text-silver transition-colors duration-300 hover:border-ivory hover:text-ivory"
          >
            Continue with Amelia ↗
          </a>
        )}
      </div>
    </div>
  );
}

function Typing() {
  return (
    <div className="flex items-start gap-3.5" aria-label="Amelia is writing">
      <AmeliaAvatar />
      <div className="flex items-center gap-1.5 border border-ivory/12 bg-ivory/[0.06] px-5 py-[19px]">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 animate-pulse bg-ivory/60"
            style={{ animationDelay: `${i * 0.18}s` }}
          />
        ))}
      </div>
    </div>
  );
}

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

/** The conversation page — the only all-navy surface. The thread is the hero;
 *  every reply is scripted from the record, and the platform handoff carries
 *  the question across. SSR renders the opening complete; appended messages
 *  are client interactions. */
export default function Amelia() {
  const [params] = useSearchParams();
  const reduced = useReducedMotion();
  const ref = params.get("ref") ?? "direct";
  const context = params.get("context") ?? undefined;

  const [messages, setMessages] = useState<Msg[]>(OPENING);
  const [value, setValue] = useState("");
  const [typing, setTyping] = useState(false);
  const nextId = useRef(10);
  const endRef = useRef<HTMLDivElement>(null);
  const askedRef = useRef<string | undefined>(undefined);
  const sentContext = useRef(false);

  const href = ameliaHref(ref, askedRef.current ?? context);
  const engage = () => track("amelia_engage", { ref, ...(askedRef.current ? { context: askedRef.current } : {}) });

  function send(raw: string) {
    const q = raw.trim();
    if (!q || typing) return;
    askedRef.current = q;
    track("amelia_ask", { ref });
    setMessages((m) => [...m, { id: nextId.current++, from: "you", body: q }]);
    setValue("");
    setTyping(true);
    const scripted = scriptedAnswer(q);
    window.setTimeout(
      () => {
        setTyping(false);
        setMessages((m) => [
          ...m,
          { id: nextId.current++, from: "amelia", body: scripted ?? GENERIC_REPLY, handoff: true },
        ]);
      },
      reduced ? 0 : 1100,
    );
  }

  // a question carried in from elsewhere on the site enters the conversation
  useEffect(() => {
    if (!context || sentContext.current) return;
    sentContext.current = true;
    send(context);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // keep the latest exchange in view (skip the initial static render)
  useEffect(() => {
    if (messages.length <= OPENING.length && !typing) return;
    endRef.current?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "nearest" });
  }, [messages.length, typing, reduced]);

  return (
    <div className="bg-navy text-ivory">
      <Section className="pt-40 pb-0">
        <div className="mx-auto max-w-[800px]">
          <Eyebrow className="text-silver">Amelia</Eyebrow>
          <h1 className="type-display mt-6 max-w-[16ch]">The advisory, in conversation.</h1>
          <p className="type-body-lg mt-6 max-w-[54ch] text-ivory/78">
            Amelia is Serene's conversational advisor — the reason no one here will ever cold-call
            you. She holds the record and answers around the clock; the decision keeps your pace.
          </p>
        </div>
      </Section>

      {/* the thread */}
      <Section tight>
        <div className="mx-auto max-w-[800px]">
          <div className="flex flex-col gap-5 border-t border-ivory/14 pt-10">
            {messages.map((msg, i) => {
              const isOpening = msg.id <= OPENING.length;
              const bubble = <Bubble msg={msg} href={href} onEngage={engage} />;
              return isOpening ? (
                <Reveal key={msg.id} delay={i * 0.12}>
                  {bubble}
                </Reveal>
              ) : (
                <motion.div
                  key={msg.id}
                  initial={reduced ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: EASE_QUIET }}
                >
                  {bubble}
                </motion.div>
              );
            })}
            {typing && <Typing />}
            <div ref={endRef} aria-hidden />
          </div>

          {/* for instance */}
          <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-3">
            <span className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-silver">
              Ask, for instance
            </span>
            {CHIPS.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => send(q)}
                className="cursor-pointer border border-ivory/22 px-3.5 py-2 text-left text-[13px] leading-snug text-ivory/75 transition-colors duration-300 hover:border-silver hover:text-ivory"
              >
                {q}
              </button>
            ))}
          </div>

          {/* the composer */}
          <form
            className="mt-9"
            onSubmit={(e) => {
              e.preventDefault();
              send(value);
            }}
          >
            <label htmlFor="amelia-composer" className="sr-only">
              Write to Amelia
            </label>
            <div className="flex items-center gap-4 border-b border-ivory/30 pb-4 transition-colors duration-300 focus-within:border-silver">
              <input
                id="amelia-composer"
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                autoComplete="off"
                placeholder="Write to Amelia…"
                className="w-full bg-transparent text-[1.05rem] font-light text-ivory caret-silver outline-none placeholder:text-ivory/40"
              />
              <button
                type="submit"
                className="btn-platinum shrink-0 cursor-pointer px-7 py-3 text-[12.5px] font-semibold uppercase tracking-[0.1em] transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
              >
                Send
              </button>
            </div>
            <p className="type-cap mt-4 text-silver">
              The full advisory lives on Amelia's own platform — your question travels with you.
            </p>
          </form>
        </div>
      </Section>

      {/* the promises */}
      <Section className="pt-10">
        <RevealGroup className="mx-auto grid max-w-[800px] gap-9 md:grid-cols-3">
          {PROMISES.map((p) => (
            <RevealItem key={p.k} className="border-t border-ivory/18 pt-4">
              <div className="type-data text-silver">{p.k}</div>
              <p className="mt-2 text-[15.5px] leading-relaxed text-ivory/75">{p.copy}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* the threshold — for those who would rather begin directly */}
      <Plate kind="dusk" image="/images/amelia-dusk.jpg" alt="">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(17,28,57,0.72), rgba(17,28,57,0.28) 55%, rgba(17,28,57,0.15))" }}
        />
        <div className="container-site relative z-[1] flex min-h-[48svh] flex-col items-center justify-center py-20 text-center">
          <Reveal>
            <h2 className="type-display">Or begin directly.</h2>
            <div className="mt-9">
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={engage}
                className="btn-platinum inline-block px-9 py-4 text-[13px] font-semibold uppercase tracking-[0.1em] transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform hover:-translate-y-[2px] active:translate-y-0 motion-reduce:transform-none motion-reduce:hover:translate-y-0"
              >
                Open Amelia&nbsp;&nbsp;↗
              </a>
            </div>
            <p className="type-cap mt-4 text-ivory/55">Amelia opens in a new window.</p>
          </Reveal>
        </div>
      </Plate>
    </div>
  );
}
