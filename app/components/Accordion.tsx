import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";

export interface AccordionItem {
  question: string;
  answer: string;
}

/**
 * Ledger-row accordion — one open at a time, 400ms ease-inout.
 *
 * `onOpen` fires on expand only, never on collapse: the question a visitor
 * chose to open is the signal, and closing it again is not a second one.
 */
export function Accordion({
  items,
  onOpen,
}: {
  items: AccordionItem[];
  onOpen?: (item: AccordionItem, index: number) => void;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const baseId = useId();

  return (
    <div className="hairline-b">
      {items.map((item, i) => {
        const open = openIndex === i;
        return (
          <div key={item.question} className="hairline-t">
            <button
              type="button"
              className="flex w-full cursor-pointer items-baseline justify-between gap-6 py-5 text-left"
              aria-expanded={open}
              aria-controls={`${baseId}-${i}`}
              onClick={() => {
                setOpenIndex(open ? null : i);
                if (!open) onOpen?.(item, i);
              }}
            >
              <span className="type-title text-[1.15rem]">{item.question}</span>
              <span aria-hidden className="shrink-0 text-brass">
                {open ? <Minus size={18} strokeWidth={1.5} /> : <Plus size={18} strokeWidth={1.5} />}
              </span>
            </button>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  id={`${baseId}-${i}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.65, 0, 0.35, 1] }}
                  className="overflow-hidden"
                >
                  <p className="max-w-[65ch] pb-6 text-[15.5px] leading-relaxed text-ink/75">
                    {item.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
