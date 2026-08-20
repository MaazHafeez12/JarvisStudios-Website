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
    id: "missed-calls",
    label: "We're missing calls and losing jobs to it",
    detail:
      "No one answers after hours, and by the time you call back, they already booked someone else.",
    services: ["ai", "crm"],
  },
  {
    id: "manual-followup",
    label: "Our booking and follow-up is still manual",
    detail:
      "Texting back and forth, writing quotes by hand, hoping nothing falls through the cracks.",
    services: ["ai", "crm"],
  },
  {
    id: "grow",
    label: "We need more of the right customers",
    detail: "The work is good. Getting found by people ready to book isn't happening enough.",
    services: ["web", "design"],
  },
  {
    id: "outdated",
    label: "Our website or systems feel outdated",
    detail: "It exists, but it's slow, doesn't build trust, or nobody's touched it in years.",
    services: ["web", "app", "saas", "design"],
  },
];
