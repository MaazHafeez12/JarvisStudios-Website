import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Work — Jarvis Studios",
  description: "Case studies and client work from Jarvis Studios.",
};

// The 2 real case studies (docs/PRD.md §6 item 3, docs/DESIGN.md §6.3) need
// actual client details, screenshots, and confirmed consent on format
// (docs/TRD.md open question) before they can go here — placeholder
// content would misrepresent real client work, so this stays honest about
// not being ready yet rather than fabricating case studies.
export default function WorkPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-24 text-center">
      <Reveal>
        <h1 className="font-display text-4xl font-semibold">Work</h1>
        <p className="mt-4 text-[--text-secondary]">
          Case studies from our clients are coming soon.
        </p>
        <Link
          href="/contact"
          className="mt-8 inline-flex items-center gap-2 rounded-md bg-brand-500 px-6 py-3 text-sm font-medium text-neutral-950 transition-colors duration-150 ease-confident hover:bg-brand-300"
        >
          Start a project
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </Reveal>
    </main>
  );
}
