import { HeroSequence } from "~/components/HeroSequence";
import { meta as buildMeta } from "~/lib/site";

export const handle = { headerTone: "dark" as const };

export function meta() {
  return buildMeta({
    description:
      "Serene — the UAE's first AI-native real estate agency. Off-plan in Dubai and Abu Dhabi. Coming soon.",
    path: "/",
  });
}

/** Alpha (coming-soon): the homepage is the cinematic hero, and nothing else. */
export default function Home() {
  return <HeroSequence />;
}
