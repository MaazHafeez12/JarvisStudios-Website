import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services — Jarvis Studios",
  description:
    "Web development, app development, SaaS, CRM, and marketing/design services from Jarvis Studios.",
};

export default function ServicesPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="font-display text-4xl font-semibold">Services</h1>
      <p className="mt-4 text-[--text-secondary]">
        Full page content — process sequence and 5 alternating service
        blocks per docs/DESIGN.md §6.2 — is a later step.
      </p>
    </main>
  );
}
