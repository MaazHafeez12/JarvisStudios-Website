// The diagnostic entry for /services.
//
// Six service lines only help a visitor who already knows the name of what
// they need. Per PRODUCT.md, visitors arrive in three states at once —
// comparing studios, confirming a referral covers their need, and browsing
// with a vague problem — and only the third is served by a list of service
// names. These are the same six services indexed by the visitor's own words
// for their situation instead of the studio's words for its offer.
//
// Deliberately overlapping: a situation maps to every service that
// genuinely applies, because pretending each problem has exactly one answer
// would be a lie told for the sake of a tidy diagram.

import type { ProjectType } from "@/lib/types/lead";

export interface Situation {
  id: string;
  /** The visitor's phrasing of their own problem, not a service category. */
  label: string;
  /** Sharpens the label without restating it. */
  detail: string;
  services: ProjectType[];
}

export const SITUATIONS: Situation[] = [
  {
    id: "new",
    label: "We're starting something from scratch",
    detail: "No product yet, or an idea that needs to become one.",
    services: ["web", "app", "saas"],
  },
  {
    id: "fix",
    label: "What we have isn't working",
    detail: "It exists, but it's slow, dated, or nobody finished it.",
    services: ["web", "app", "saas", "design"],
  },
  {
    id: "grow",
    label: "We need more of the right customers",
    detail: "The product is fine. Getting people to it isn't.",
    services: ["web", "design"],
  },
  {
    id: "automate",
    label: "Too much of this is still manual",
    detail: "Work that runs on spreadsheets, copy-paste, and memory.",
    services: ["ai", "crm"],
  },
];
