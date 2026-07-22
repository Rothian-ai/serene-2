import { LegalPage } from "~/components/LegalPage";
import { meta as buildMeta } from "~/lib/site";

export const handle = { headerTone: "light" as const };
export function meta() {
  return buildMeta({
    title: "Privacy Policy",
    description: "How Serene handles personal data: GDPR/UK GDPR and UAE PDPL aligned.",
    path: "/privacy",
  });
}
export default function Privacy() {
  return <LegalPage slug="privacy" />;
}
