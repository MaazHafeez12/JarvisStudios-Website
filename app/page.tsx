import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { HeroVisual } from "@/components/hero/HeroVisual";
import { Marquee } from "@/components/ui/Marquee";
import { ServiceTour } from "@/components/services/ServiceTour";
import { ServiceVignette } from "@/components/services/ServiceVignette";
import { SERVICES } from "@/content/services";

export default function HomePage() {
  return (
    <main>
      {/* Hero — staggered entrance per docs/DESIGN.md §3.2, over the
          assembling shard field from docs/MOTION_REDESIGN.md §3 (Option C).
          The copy stays server-rendered inside the client shell so the H1
          remains the LCP candidate and never waits on the 3D bundle. */}
      <HeroVisual>
        <Reveal>
          <p className="font-mono text-sm uppercase tracking-widest text-[--text-secondary]">
            Jarvis Studios
          </p>
        </Reveal>
        <Reveal delay={0.1} lcpSafe>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight sm:text-6xl">
            Software that ships. Growth that compounds.
          </h1>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mx-auto mt-6 max-w-xl text-[--text-secondary]">
            Web, app, SaaS, CRM, AI automation, and marketing &amp; design.
          </p>
        </Reveal>
        <Reveal delay={0.3}>
          <Link
            href="/contact"
            className="mt-8 inline-flex items-center gap-2 rounded-md bg-brand-500 px-6 py-3 text-sm font-medium text-neutral-950 transition-colors duration-150 ease-confident hover:bg-brand-300"
          >
            Start a project
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Reveal>
      </HeroVisual>

      {/* Service summary — a scroll-linked pinned tour rather than a card
          grid (docs/MOTION_REDESIGN.md §5.5). The vignettes are rendered
          here, on the server, and passed to the client component as slots so
          content/services.ts and ServiceVignette.tsx stay out of the client
          bundle. */}
      <section
        id="what-we-do"
        className="scroll-mt-24 border-t border-[--border] px-6 py-20"
      >
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <h2 className="font-display text-2xl font-semibold">What we do</h2>
          </Reveal>
          <ServiceTour
            services={SERVICES}
            visuals={SERVICES.map((service) => (
              <ServiceVignette key={service.id} service={service.id} />
            ))}
          />
        </div>
      </section>

      {/* Credibility strip */}
      <section className="border-t border-[--border] py-12">
        <Marquee
          items={SERVICES.map((s) => s.name)}
        />
      </section>

      {/* Featured work — restored with a real, named client result instead
          of the removed placeholder teaser. Links to /contact rather than
          /work since /work still has no case studies to land on. */}
      <section className="border-t border-[--border] px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="flex flex-col items-start gap-6 rounded-lg border border-[--border] bg-[--surface-raised] p-8 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-[--text-secondary]">
                  Real client, real numbers
                </p>
                <h2 className="mt-2 max-w-xl text-balance font-display text-2xl font-semibold sm:text-3xl">
                  SNF Construction Group&rsquo;s social reach is growing 10%,
                  every month.
                </h2>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-[--text-secondary]">
                  Content and social management, run and measured monthly
                  since we took over.
                </p>
              </div>
              <Link
                href="/contact"
                className="group inline-flex shrink-0 items-center gap-2 rounded-md border border-[--border] px-5 py-2.5 text-sm font-medium transition-colors duration-150 ease-confident hover:border-[--accent] hover:text-[--accent]"
              >
                Get results like this
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-200 ease-confident motion-safe:group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Final CTA band */}
      <section className="border-t border-[--border] px-6 py-20 text-center">
        <Reveal>
          <h2 className="mx-auto max-w-2xl text-balance font-display text-3xl font-semibold">
            Get a scoped project and a real price in 48 hours. Free.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-balance text-[--text-secondary]">
            No sales pitch, no pitch deck. Tell us what you&rsquo;re building, and
            we&rsquo;ll tell you what it costs and how long it takes.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-brand-500 px-6 py-3 text-sm font-medium text-neutral-950 transition-colors duration-150 ease-confident hover:bg-brand-300"
          >
            Start a project
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Reveal>
      </section>

      {/* Insights callout. Sits after the CTA deliberately: it's a secondary,
          low-commitment path, so it shouldn't come between the featured result
          and the ask. */}
      <section className="border-t border-[--border] px-6 py-12">
        <Reveal>
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left">
            <p className="text-sm text-[--text-secondary]">
              Notes on process and engineering decisions.
            </p>
            <Link
              href="/insights"
              className="text-sm font-medium text-[--text-secondary] underline decoration-[--border] underline-offset-4 transition-colors duration-150 ease-confident hover:text-[--text-primary]"
            >
              Read our insights
            </Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
