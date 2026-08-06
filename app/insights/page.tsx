import type { Metadata } from "next";
import Link from "next/link";
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
          <p className="mt-4 text-[--text-secondary]">
            Notes on process and engineering decisions — not case studies,
            since we don't have any to publish yet.
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
    </main>
  );
}
