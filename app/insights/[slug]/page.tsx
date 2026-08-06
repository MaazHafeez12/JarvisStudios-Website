import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { INSIGHTS } from "@/content/insights";
import { formatDate } from "@/lib/format-date";

// Fully static: every article is known at build time, and an unlisted slug
// 404s rather than attempting an on-demand render. Matches the rest of this
// site, where every marketing route is prerendered.
export const dynamicParams = false;

export function generateStaticParams() {
  return INSIGHTS.map((post) => ({ slug: post.slug }));
}

function getPost(slug: string) {
  return INSIGHTS.find((post) => post.slug === slug);
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const post = getPost(params.slug);
  if (!post) return {};
  return {
    title: `${post.title} — Jarvis Studios`,
    description: post.excerpt,
  };
}

export default function InsightPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = getPost(params.slug);
  if (!post) notFound();

  return (
    <main className="mx-auto max-w-2xl px-6 py-20">
      <Reveal lcpSafe>
        <Link
          href="/insights"
          className="inline-flex items-center gap-2 text-sm text-[--text-secondary] transition-colors duration-200 ease-confident hover:text-[--text-primary]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Insights
        </Link>

        <p className="mt-8 text-sm text-[--text-secondary]">
          {formatDate(post.publishedAt)}
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
          {post.title}
        </h1>
      </Reveal>

      <div className="mt-10 space-y-6 border-t border-[--border] pt-10">
        {post.body.map((paragraph, i) => (
          <Reveal key={i} delay={Math.min(i * 0.05, 0.3)}>
            <p className="max-w-[65ch] leading-relaxed text-[--text-primary]">
              {paragraph}
            </p>
          </Reveal>
        ))}
      </div>

      <div className="mt-14 border-t border-[--border] pt-8">
        <Link
          href="/contact"
          className="text-sm font-medium text-[--accent] transition-colors duration-200 ease-confident hover:text-[--accent-hover]"
        >
          Have a project this touches on? Get in touch →
        </Link>
      </div>
    </main>
  );
}
