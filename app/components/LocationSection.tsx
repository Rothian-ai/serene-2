import { useEffect, useRef, useState } from "react";
import { Eyebrow, Plate, Reveal, Section } from "~/components/primitives";
import type { Landmark } from "~/lib/content";

/**
 * Location — the closing orientation block. The nearest-landmarks list is the
 * primary content; the map supports it.
 *
 * Map = Leaflet + OpenStreetMap tiles. No API key, no third-party billing.
 * Because the site is `ssr:false` + prerendered, Leaflet (which needs `window`)
 * is loaded ONLY on the client, dynamically inside an effect — the prerendered
 * HTML paints a Plate placeholder, and the live map replaces it after mount.
 * The tile pane is desaturated in CSS (`.serene-map`) so the map sits inside
 * the palette; the marker stays brass.
 */

function MapPanel({
  map,
  district,
  city,
}: {
  map: { lat: number; lng: number; zoom: number };
  district: string;
  city: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let instance: { remove: () => void } | null = null;
    let cancelled = false;

    (async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");
      if (cancelled || !ref.current) return;

      const m = L.map(ref.current, {
        center: [map.lat, map.lng],
        zoom: map.zoom,
        zoomControl: true,
        scrollWheelZoom: false, // never trap the page scroll
        attributionControl: true,
      });
      instance = m;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(m);

      // brass square marker — radius 0, in-brand (no default icon assets)
      const icon = L.divIcon({
        className: "",
        html: '<span style="display:block;width:13px;height:13px;background:#c9a227;box-shadow:0 0 0 3px rgba(201,162,39,0.25)"></span>',
        iconSize: [13, 13],
        iconAnchor: [7, 7],
      });
      L.marker([map.lat, map.lng], { icon, keyboard: false }).addTo(m).bindPopup(`${district}, ${city}`);

      // Leaflet measures its container on init; nudge it once the panel has laid out.
      requestAnimationFrame(() => m.invalidateSize());
      setReady(true);
    })();

    return () => {
      cancelled = true;
      instance?.remove();
    };
  }, [map.lat, map.lng, map.zoom, district, city]);

  return (
    <div className="serene-map relative aspect-[4/3] overflow-hidden border border-ink/10">
      <div ref={ref} className="absolute inset-0 h-full w-full" />
      {!ready && (
        <Plate kind="dusk" className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 flex items-end p-6">
            <p className="type-cap text-ivory/70">
              {district}, {city}
            </p>
          </div>
        </Plate>
      )}
    </div>
  );
}

export function LocationSection({
  landmarks,
  map,
  district,
  city,
}: {
  landmarks: Landmark[];
  map?: { lat: number; lng: number; zoom: number };
  district: string;
  city: string;
}) {
  if (landmarks.length === 0 && !map) return null;

  return (
    <Section>
      <div className="grid gap-12 md:grid-cols-12 md:gap-10">
        {/* ——— left: the orientation + landmark list (primary) ——— */}
        <div className="md:col-span-5">
          <Reveal>
            <Eyebrow className="text-fog">The Location</Eyebrow>
            <h2 className="type-headline mt-5">
              {district}, {city}.
            </h2>
          </Reveal>
          {landmarks.length > 0 && (
            <Reveal delay={0.1}>
              <dl className="mt-9 border-t border-ink/14">
                {landmarks.map((l) => (
                  <div
                    key={l.place}
                    className="flex items-baseline gap-6 border-b border-ink/12 py-4"
                  >
                    <dt className="type-data w-[4.5rem] shrink-0 text-brass">{l.time}</dt>
                    <dd className="text-[15.5px] leading-snug text-ink/80">{l.place}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          )}
        </div>

        {/* ——— right: the map (supporting) ——— */}
        <div className="md:col-span-6 md:col-start-7">
          <Reveal delay={0.15}>
            {map ? (
              <MapPanel map={map} district={district} city={city} />
            ) : (
              <div className="relative aspect-[4/3] overflow-hidden border border-ink/10">
                <Plate kind="dusk" className="h-full w-full">
                  <div className="absolute inset-0 flex items-end p-6">
                    <p className="type-cap text-ivory/70">Map available on enquiry.</p>
                  </div>
                </Plate>
              </div>
            )}
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
