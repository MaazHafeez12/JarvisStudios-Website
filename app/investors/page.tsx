import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Investors — Jarvis Studios",
  description: "Investor and partner information for Jarvis Studios.",
};

export default function InvestorsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="font-display text-4xl font-semibold">Investors</h1>
      <p className="mt-4 text-[--text-secondary]">
        Traction/team/vision content (docs/DESIGN.md §6.5) is a later step.
      </p>
    </main>
  );
}
