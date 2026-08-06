import type { Metadata } from "next";
import { Suspense } from "react";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact — Jarvis Studios",
  description: "Start a project with Jarvis Studios.",
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-xl px-6 py-24">
      <h1 className="font-display text-4xl font-semibold">Get in touch</h1>
      <p className="mt-3 text-[--text-secondary]">
        Tell us what you&rsquo;re building and we&rsquo;ll come back with scope,
        price, and a timeline.
      </p>
      <div className="mt-10">
        {/* useSearchParams (to pre-select the service line from ?service=)
            requires a Suspense boundary during static generation. The
            fallback approximates the real form's height so it doesn't pop
            in and shove the footer down (was a 0.43 CLS regression). */}
        <Suspense fallback={<ContactFormSkeleton />}>
          <ContactForm />
        </Suspense>
      </div>
    </main>
  );
}

// Four labelled fields, then message, then submit — the real form exactly.
// The standalone block that used to lead this stood in for the
// client/investor selector; with that gone, and the project-type field no
// longer conditional, the two now match rather than the skeleton running one
// field short.
function ContactFormSkeleton() {
  return (
    <div aria-hidden="true" className="flex flex-col gap-5">
      {["Name", "Email", "Company", "Project type"].map((label) => (
        <div key={label}>
          <div className="mb-1.5 h-3.5 w-16 animate-pulse rounded bg-[--surface-raised] motion-reduce:animate-none" />
          <div className="h-11 animate-pulse rounded-md bg-[--surface-raised] motion-reduce:animate-none" />
        </div>
      ))}
      <div>
        <div className="mb-1.5 h-3.5 w-20 animate-pulse rounded bg-[--surface-raised] motion-reduce:animate-none" />
        <div className="h-32 animate-pulse rounded-md bg-[--surface-raised] motion-reduce:animate-none" />
      </div>
      <div className="h-12 animate-pulse rounded-md bg-[--surface-raised] motion-reduce:animate-none" />
    </div>
  );
}
