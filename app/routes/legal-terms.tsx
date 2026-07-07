import { LegalPage } from "~/components/LegalPage";
import { meta as buildMeta } from "~/lib/site";

export const handle = { headerTone: "light" as const };
export function meta() {
  return buildMeta({
    title: "Terms of Use",
    description: "Terms governing use of serene.com.",
    path: "/terms",
  });
}
export default function Terms() {
  return <LegalPage slug="terms" />;
}
