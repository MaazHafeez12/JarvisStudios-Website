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
            requires a Suspense boundary during static generation. */}
        <Suspense fallback={null}>
          <ContactForm />
        </Suspense>
      </div>
    </main>
  );
}
