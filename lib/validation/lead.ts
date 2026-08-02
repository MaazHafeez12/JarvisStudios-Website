import { PROJECT_TYPES, type LeadInput, type LeadType } from "@/lib/types/lead";

// Validation rules per docs/TRD.md §5. This module is imported by both
// components/ContactForm.tsx (inline field errors, UX only) and
// app/api/leads/route.ts (the actual security boundary — TRD §8.1 requires
// server-side validation regardless of what the client already checked).

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LEAD_TYPES: LeadType[] = ["client", "investor"];

export type FieldErrors = Partial<Record<keyof LeadInput, string>>;

export interface ValidationResult {
  valid: boolean;
  fields: FieldErrors;
}

export function validateLead(input: Partial<LeadInput>): ValidationResult {
  const fields: FieldErrors = {};

  if (!input.type || !LEAD_TYPES.includes(input.type)) {
    fields.type = 'Must be "client" or "investor"';
  }

  const name = input.name?.trim() ?? "";
  if (!name) {
    fields.name = "Name is required";
  } else if (name.length > 200) {
    fields.name = "Name must be 200 characters or fewer";
  }

  const email = input.email?.trim() ?? "";
  if (!email) {
    fields.email = "Email is required";
  } else if (!EMAIL_REGEX.test(email)) {
    fields.email = "Must be a valid email address";
  }

  if (input.company && input.company.trim().length > 200) {
    fields.company = "Company must be 200 characters or fewer";
  }

  if (
    input.projectType &&
    !PROJECT_TYPES.includes(input.projectType as (typeof PROJECT_TYPES)[number])
  ) {
    fields.projectType = "Not a recognized project type";
  }

  const message = input.message?.trim() ?? "";
  if (!message) {
    fields.message = "Message is required";
  } else if (message.length < 10) {
    fields.message = "Message must be at least 10 characters";
  } else if (message.length > 5000) {
    fields.message = "Message must be 5000 characters or fewer";
  }

  return { valid: Object.keys(fields).length === 0, fields };
}
