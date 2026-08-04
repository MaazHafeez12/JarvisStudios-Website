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
        Tell us about your project, or reach out as an investor or partner.
      </p>
      <div className="mt-10">
        {/* useSearchParams (to pre-select investor/client from ?type=)
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

function ContactFormSkeleton() {
  return (
    <div aria-hidden="true" className="flex flex-col gap-5">
      <div className="h-11 animate-pulse rounded-lg bg-[--surface-raised] motion-reduce:animate-none" />
      {["Name", "Email", "Company"].map((label) => (
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
