import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Jarvis Studios",
  description: "Mission, team, and differentiation for Jarvis Studios.",
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="font-display text-4xl font-semibold">About</h1>
      <p className="mt-4 text-[--text-secondary]">
        Mission and team content (docs/DESIGN.md §6.4) is a later step.
      </p>
    </main>
  );
}
