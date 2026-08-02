// Structured, typed content — not a database (docs/ARCHITECTURE.md §4.6).
// Consumed by the homepage service summary and (in a later step) the full
// Services page. Swapping this for a CMS later only touches this file.

import type { ProjectType } from "@/lib/types/lead";

export interface Service {
  id: ProjectType;
  name: string;
  summary: string;
}

export const SERVICES: Service[] = [
  {
    id: "web",
    name: "Web Development",
    summary: "Marketing sites and web apps built for speed, clarity, and conversion.",
  },
  {
    id: "app",
    name: "App Development",
    summary: "Native and cross-platform apps, from first prototype to app-store launch.",
  },
  {
    id: "saas",
    name: "SaaS",
    summary: "Full-stack SaaS products — auth, billing, and everything in between.",
  },
  {
    id: "crm",
    name: "CRM",
    summary: "CRM systems tailored to how your team actually sells and supports.",
  },
  {
    id: "design",
    name: "Marketing & Design",
    summary: "Brand, UI, and campaign design that makes the rest of the work land.",
  },
];
