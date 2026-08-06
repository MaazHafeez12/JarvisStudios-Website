import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { INSIGHTS } from "@/content/insights";
import { formatDate } from "@/lib/format-date";

export const metadata: Metadata = {
  title: "Insights — Jarvis Studios",
  description: "Notes on process and engineering decisions from Jarvis Studios.",
};

export default function InsightsPage() {
  return (
    <main>
      <section className="mx-auto max-w-3xl px-6 py-20 text-center">
        <Reveal lcpSafe>
          <h1 className="font-display text-4xl font-semibold sm:text-5xl">
            How we think about the work.
          </h1>
          {/* No "we don't have case studies yet" clause. It was the same
              coming-soon admission that got /work removed, and it went
              factually stale the moment a real result shipped — it now
              contradicts the homepage and /services, which both publish
              one. Points at that result instead. */}
          <p className="mt-4 text-[--text-secondary]">
            Notes on process and engineering decisions. For results, see{" "}
            <Link
              href="/services#design"
              className="text-[--text-primary] underline decoration-[--border] underline-offset-4 transition-colors duration-200 ease-confident hover:text-[--accent] hover:decoration-[--accent]"
            >
              what we&rsquo;ve done for SNF Construction Group
            </Link>
            .
          </p>
        </Reveal>
      </section>

      <section className="border-t border-[--border] px-6 py-8">
        <div className="mx-auto max-w-3xl divide-y divide-[--border]">
          {INSIGHTS.map((post, i) => (
            <Reveal key={post.slug} delay={i * 0.06}>
              <Link href={`/insights/${post.slug}`} className="group block py-8">
                <p className="text-sm text-[--text-secondary]">
                  {formatDate(post.publishedAt)}
                </p>
                <h2 className="mt-2 font-display text-2xl font-semibold transition-colors duration-200 ease-confident group-hover:text-[--accent]">
                  {post.title}
                </h2>
                <p className="mt-3 max-w-xl text-[--text-secondary]">
                  {post.excerpt}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* The page used to end on the last post excerpt. A reader who got
          through three posts on process and pricing is warmer than a cold
          visitor and had nowhere to go. Same offer as the homepage and
          /services — third hand-maintained copy of this band, which is one
          too many; it wants extracting once anything about it changes. */}
      <section className="border-t border-[--border] px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <h2 className="text-balance font-display text-3xl font-semibold sm:text-4xl">
              Get a scoped project and a real price in 48 hours. Free.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-balance text-[--text-secondary]">
              No sales pitch, no pitch deck. Tell us what you&rsquo;re
              building, and we&rsquo;ll tell you what it costs and how long it
              takes.
            </p>
            <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-[--text-secondary]">
              If discovery shows we&rsquo;re not the right fit, we&rsquo;ll
              tell you and point you elsewhere. You lose nothing but a phone
              call.
            </p>
            <Link
              href="/contact"
              className="group mt-8 inline-flex items-center gap-2 rounded-md bg-brand-500 px-6 py-3 text-sm font-medium text-neutral-950 transition-colors duration-200 ease-confident hover:bg-brand-300"
            >
              Start a project
              <ArrowRight
                className="h-4 w-4 transition-transform duration-200 ease-confident motion-safe:group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
