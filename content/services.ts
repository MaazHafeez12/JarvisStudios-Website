// Structured, typed content — not a database (docs/ARCHITECTURE.md §4.6).
// Consumed by the homepage service summary and (in a later step) the full
// Services page. Swapping this for a CMS later only touches this file.

import type { ProjectType } from "@/lib/types/lead";

export interface Service {
  id: ProjectType;
  name: string;
  summary: string;
  /** 2-3 concrete capabilities — PRD §5 user story: prospective clients
   *  want to immediately tell if the studio does what they need, not
   *  read vague marketing copy. */
  capabilities: string[];
}

export const SERVICES: Service[] = [
  {
    id: "web",
    name: "Web Development",
    summary: "Marketing sites and web apps built for speed, clarity, and conversion.",
    capabilities: [
      "Marketing sites, landing pages, and web apps",
      "Performance and Core Web Vitals optimization",
      "CMS and content-model setup",
    ],
  },
  {
    id: "app",
    name: "App Development",
    summary: "Native and cross-platform apps, from first prototype to app-store launch.",
    capabilities: [
      "iOS, Android, and cross-platform builds",
      "App Store / Play Store submission and launch",
      "Push notifications, offline support, native integrations",
    ],
  },
  {
    id: "saas",
    name: "SaaS",
    summary: "Full-stack SaaS products — auth, billing, and everything in between.",
    capabilities: [
      "Auth, billing, and subscription management",
      "Multi-tenant architecture and role-based access",
      "API design and third-party integrations",
    ],
  },
  {
    id: "crm",
    name: "CRM",
    summary: "CRM systems tailored to how your team actually sells and supports.",
    capabilities: [
      "Custom pipelines, fields, and workflows",
      "Integrations with your existing sales/support tools",
      "Data migration from spreadsheets or legacy systems",
    ],
  },
  {
    id: "design",
    name: "Marketing & Design",
    summary: "Brand, UI, and campaign design that makes the rest of the work land.",
    capabilities: [
      "Brand identity and design systems",
      "UI/UX design for web and app products",
      "Campaign and marketing asset design",
    ],
  },
];
