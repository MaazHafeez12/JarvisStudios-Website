import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — Jarvis Studios",
  description: "Start a project with Jarvis Studios.",
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="font-display text-4xl font-semibold">Contact</h1>
      <p className="mt-4 text-[--text-secondary]">
        The real contact form + /api/leads backend (docs/TRD.md §5) is a
        later step.
      </p>
    </main>
  );
}
