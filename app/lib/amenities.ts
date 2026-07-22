/**
 * Amenity library — shared image + blurb keyed by the icon token authored in
 * development frontmatter (`pool · Rooftop Pool`; see AmenityIcon.tsx). This
 * lets the amenities showcase enrich each development's existing amenity list
 * with an image and a line of copy, without touching the markdown or shipping a
 * bespoke photo per development. Photography drops into the stable
 * `/images/amenities/<key>.jpg` slots (see public/images/CREDITS.txt).
 */

export interface AmenityDetail {
  image: string;
  blurb: string;
}

const img = (key: string) => `/images/amenities/${key}.jpg`;

export const AMENITY_LIBRARY: Record<string, AmenityDetail> = {
  pool: {
    image: img("pool"),
    blurb: "Water on the roofline: a still pool set against the skyline, kept for residents alone.",
  },
  gym: {
    image: img("gym"),
    blurb: "A fully equipped fitness floor with daylight and a view, open around the clock.",
  },
  spa: {
    image: img("spa"),
    blurb: "A quiet spa and hammam for the slow end of the day: steam, stone, and low light.",
  },
  concierge: {
    image: img("concierge"),
    blurb: "A round-the-clock concierge who arranges the day before you ask. Discreet, resident-only.",
  },
  courts: {
    image: img("courts"),
    blurb: "Padel and sports courts on site, floodlit for the evening game.",
  },
  parking: {
    image: img("parking"),
    blurb: "Secure valet and covered parking, so arrival is never a negotiation.",
  },
  park: {
    image: img("park"),
    blurb: "Landscaped gardens and shaded walks threaded through the podium: green at ground level.",
  },
  play: {
    image: img("play"),
    blurb: "A dedicated children's play area, shaded and watched over, at the heart of the community.",
  },
  beach: {
    image: img("beach"),
    blurb: "Direct access to the sand: the shoreline as an extension of the address.",
  },
  cycling: {
    image: img("cycling"),
    blurb: "Dedicated cycling and running tracks that loop the community, clear of the road.",
  },
  pavilion: {
    image: img("pavilion"),
    blurb: "A residents' pavilion for gathering: lounge, library, and terrace under one roof.",
  },
  retail: {
    image: img("retail"),
    blurb: "Boardwalk retail and cafés at the door: the essentials, curated and close.",
  },
};

const FALLBACK: AmenityDetail = {
  image: img("pool"),
  blurb: "A considered amenity, held to the same standard as the residences.",
};

export function amenityDetail(icon: string): AmenityDetail {
  return AMENITY_LIBRARY[icon] ?? FALLBACK;
}
