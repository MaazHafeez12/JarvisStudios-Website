import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { TERMS_OF_USE } from "@/content/legal";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: TERMS_OF_USE.title,
  description: TERMS_OF_USE.description,
  path: "/terms",
});

export default function TermsPage() {
  return <LegalPage document={TERMS_OF_USE} />;
}
