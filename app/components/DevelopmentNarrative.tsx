import { motion, useReducedMotion } from "framer-motion";
import { Eyebrow, Plate } from "~/components/primitives";
import type { BodySection, GalleryImage, PlateKind } from "~/lib/content";

/**
 * The register — the development's chapters (residence, materials, district,
 * terms) set as editorial spreads: prose on one side, a photograph on the
 * other, alternating. No slider, no chrome — the chapters are read, not
 * paged. Images come from the development's gallery (the hero image is
 * skipped so nothing repeats); with no gallery the plate stands in.
 *
 * SSR renders every chapter complete; entrances are viewport reveals that
 * collapse under prefers-reduced-motion.
 */

export function DevelopmentNarrative({
  sections,
  gallery = [],
  plate,
  heroImage,
}: {
  sections: BodySection[];
  gallery?: GalleryImage[];
  plate: PlateKind;
  /** the page's hero image — excluded from chapter pairing so it never repeats */
  heroImage?: string;
}) {
  const reduced = useReducedMotion();
  const pool = gallery.filter((g) => g.src !== heroImage);
  const images = pool.length ? pool : gallery;

  return (
    <section className="py-12 md:py-18">
      <div className="container-site">
        <Eyebrow className="text-fog">The Register</Eyebrow>
        <div className="mt-4 flex flex-col">
          {sections.map((s, i) => {
            const img = images.length ? images[i % images.length] : undefined;
            const flip = i % 2 === 1;
            return (
              <article key={s.id} id={s.id} className="scroll-mt-28 border-t border-ink/14 py-12 first:border-t-0 md:py-16">
                <motion.div
                  className="grid items-center gap-8 md:grid-cols-12 md:gap-7"
                  initial={reduced ? false : { opacity: 0, y: 26 }}
                  whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-90px" }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className={`md:col-span-6 ${flip ? "md:order-2 md:col-start-8" : "md:col-start-1"}`}>
                    <div className="type-data text-brass">{String(i + 1).padStart(2, "0")}</div>
                    <h2 className="type-headline mt-4">{s.title}</h2>
                    <div
                      className="prose-serene mt-6"
                      dangerouslySetInnerHTML={{ __html: s.html }}
                    />
                  </div>
                  <div className={`md:col-span-5 ${flip ? "md:order-1 md:col-start-1" : "md:col-start-8"}`}>
                    <Plate
                      kind={plate}
                      image={img?.src}
                      alt={img?.caption ?? ""}
                      className="aspect-[4/3] w-full"
                      parallax
                    />
                    {img?.caption && <p className="type-cap mt-3 text-fog">{img.caption}</p>}
                  </div>
                </motion.div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
