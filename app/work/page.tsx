import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work — Jarvis Studios",
  description: "Case studies and client work from Jarvis Studios.",
};

export default function WorkPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="font-display text-4xl font-semibold">Work</h1>
      <p className="mt-4 text-[--text-secondary]">
        The 2 full case studies (docs/DESIGN.md §6.3) are a later step.
      </p>
    </main>
  );
}
