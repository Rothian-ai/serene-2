import { LegalPage } from "~/components/LegalPage";
import { meta as buildMeta } from "~/lib/site";

export const handle = { headerTone: "light" as const };
export function meta() {
  return buildMeta({
    title: "Cookie Policy",
    description: "What Serene's single analytics cookie does, and how consent works.",
    path: "/cookies",
  });
}
export default function Cookies() {
  return <LegalPage slug="cookies" />;
}
