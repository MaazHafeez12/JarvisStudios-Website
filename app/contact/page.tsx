import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Suspense } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  // Leads with the visitor's problem and the two facts that lower the
  // cost of enquiring — free discovery, and a number before they commit
  // (content/engagement.ts). "Start a project with Jarvis Studios" asked
  // for the commitment without answering what it costs to ask.
  description:
    "Tell us what's breaking. Discovery is free, and you get a real scope and a real price within 48 hours — before you commit to anything.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-xl px-6 py-24">
      {/* This page was the one route with no Reveal at all, so its heading
          arrived flat while every other page's H1 assembled. lcpSafe for the
          same reason the other H1s use it — this heading is the LCP
          candidate here, and a fade would defer its own timestamp.

          The form deliberately stays outside: it's behind a Suspense
          boundary whose skeleton exists to hold height against a 0.43 CLS
          regression, and animating the boundary would reintroduce movement
          at exactly the moment that skeleton is there to prevent it. */}
      <Reveal lcpSafe>
        <h1 className="font-display text-4xl font-semibold">Get in touch</h1>
        <p className="mt-3 text-[--text-secondary]">
          Tell us what you&rsquo;re building and we&rsquo;ll come back with
          scope, price, and a timeline.
        </p>
      </Reveal>
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

// Four labelled fields, then message, then submit, then the collection
// notice — the real form exactly. The standalone block that used to lead this
// stood in for the client/investor selector; with that gone, and the
// project-type field no longer conditional, the two now match rather than the
// skeleton running one field short.
//
// KEEP THIS IN STEP WITH ContactForm. Every block below stands in for a real
// one, and the whole point of the skeleton is that the swap costs no layout
// shift — a skeleton one element short is a skeleton that has stopped doing
// its job. The two-line tail is the privacy notice under the button.
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
      <div className="space-y-1.5">
        <div className="h-3 animate-pulse rounded bg-[--surface-raised] motion-reduce:animate-none" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-[--surface-raised] motion-reduce:animate-none" />
      </div>
    </div>
  );
}
