// Mirrors the `leads` table schema in supabase/migrations/0001_create_leads_table.sql
// and docs/TRD.md §4.2. Imported by both components/ContactForm.tsx and
// app/api/leads/route.ts so client and server never disagree on shape.

// Every lead is a client lead — the investor/partner path is gone from the
// site. The `leads` table's check constraint still permits 'investor' and is
// deliberately left alone: narrowing it would reject rows already stored
// under that type, and a constraint that allows a value nothing writes costs
// nothing.
export type LeadType = "client";
export type LeadStatus = "new" | "contacted" | "archived";

export const PROJECT_TYPES = ["web", "app", "saas", "crm", "ai", "design"] as const;
export type ProjectType = (typeof PROJECT_TYPES)[number];

export interface LeadInput {
  type: LeadType;
  name: string;
  email: string;
  company?: string;
  projectType?: ProjectType;
  message: string;
  /** Honeypot field — must stay empty. Not part of the stored lead. */
  website?: string;
}

export interface Lead {
  id: string;
  type: LeadType;
  name: string;
  email: string;
  company: string | null;
  projectType: string | null;
  message: string;
  status: LeadStatus;
  createdAt: string; // ISO 8601
}
