import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { VignetteCard } from "@/components/services/VignetteCard";
import { SERVICES } from "@/content/services";
import { SERVICE_DETAIL } from "@/content/service-detail";
import { SITUATIONS } from "@/content/situations";
import { INSIGHTS } from "@/content/insights";
import { PROCESS_STEPS } from "@/content/process";
import { pageMetadata } from "@/lib/seo";
import { serviceGraph } from "@/lib/structured-data";

// One page per service line.
//
// WHAT THIS IS FOR. All six services used to live on /services as fragment
// anchors, and a fragment is not a separate URL to a crawler — so one ~1,000
// word page was competing for six unrelated search terms and ranking for
// none of them. These pages give each service a URL, an H1 carrying its own
// term, its own title and description, and Service + FAQPage structured data.
//
// WHAT THIS IS NOT. It does not replace /services, and the DIRECTION CONTRACT
// in that file still holds: the comparison grid keeps every service's name,
// summary, capabilities, proof and CTA visible in every state. Comparison is
// a job a set of separate pages structurally cannot do, which is exactly why
// the grid was built. This is depth hanging off that hub — a visitor who has
// already chosen follows a link here; a visitor still deciding stays there.
//
// Fully static, like every other marketing route. `dynamicParams = false` so
// an unknown slug 404s rather than attempting an on-demand render.

export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICES.map((service) => ({ slug: service.id }));
}

function getService(slug: string) {
  const service = SERVICES.find((s) => s.id === slug);
  if (!service) return null;
  return { service, detail: SERVICE_DETAIL[service.id] };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const found = getService(slug);
  if (!found) return {};

  // "AI Automation Services" rather than the bare service name: the title is
  // the strongest on-page signal and "Services" is how the search is actually
  // phrased. The H1 below carries the same term in a sentence a human reads.
  return pageMetadata({
    title: `${found.service.name} Services`,
    description: found.detail.lead,
    path: `/services/${found.service.id}`,
  });
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const found = getService(slug);
  if (!found) notFound();

  const { service, detail } = found;

  // Real data, not a hand-kept list: the situations that map to this service
  // are the same overlapping mapping /services already uses to sort the grid.
  const situations = SITUATIONS.filter((s) => s.services.includes(service.id));
  const related = INSIGHTS.filter((post) => post.services?.includes(service.id));

  return (
    <main>
      <JsonLd data={serviceGraph(service, detail)} />

      <section className="mx-auto max-w-4xl px-6 py-20">
        <Reveal lcpSafe>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm text-(--text-secondary) transition-colors duration-200 ease-confident hover:text-(--text-primary)"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            All services
          </Link>

          <p className="mt-8 font-mono text-xs uppercase tracking-widest text-(--text-secondary)">
            {service.name}
          </p>
          {/* The H1 carries the search term inside a sentence. A heading that
              reads "AI Automation" alone ranks no better and says less. */}
          <h1 className="mt-3 max-w-3xl text-balance font-display text-4xl font-semibold sm:text-5xl">
            {detail.headline}
          </h1>
          <p className="mt-5 max-w-2xl text-balance text-lg text-(--text-secondary)">
            {detail.lead}
          </p>
        </Reveal>
      </section>

      <section className="border-t border-(--border) px-6 py-16">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          <div className="space-y-6">
            {detail.body.map((paragraph, i) => (
              <Reveal key={i} delay={Math.min(i * 0.06, 0.2)}>
                <p className="max-w-[65ch] leading-relaxed text-(--text-primary)">
                  {paragraph}
                </p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            {/* The same vignette the comparison grid uses, so a visitor who
                arrived from /services recognises where they landed. */}
            <VignetteCard service={service.id} />
          </Reveal>
        </div>
      </section>

      <section className="border-t border-(--border) px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <h2 className="font-display text-2xl font-semibold">
              What {service.name} covers
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-10 md:grid-cols-2">
            <Reveal>
              <h3 className="font-mono text-xs uppercase tracking-widest text-(--text-secondary)">
                Capabilities
              </h3>
              <ul className="mt-4 border-t border-(--border)">
                {service.capabilities.map((capability) => (
                  <li
                    key={capability}
                    className="border-b border-(--border) py-3 text-sm"
                  >
                    {capability}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.08}>
              <h3 className="font-mono text-xs uppercase tracking-widest text-(--text-secondary)">
                What you end up with
              </h3>
              <ul className="mt-4 space-y-3">
                {detail.outcomes.map((outcome) => (
                  <li
                    key={outcome}
                    className="relative pl-5 text-sm leading-relaxed text-(--text-secondary)"
                  >
                    <span
                      aria-hidden="true"
                      className="absolute left-0 top-[0.55em] h-1.5 w-1.5 rounded-full bg-(--accent)"
                    />
                    {outcome}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          {/* Only where there is proof to carry — same rule as the grid. An
              invented result beside a real one devalues both. */}
          {service.proof ? (
            <Reveal>
              <div className="mt-12 max-w-xl border-t border-(--border) pt-6">
                <p className="font-medium leading-relaxed">
                  {service.proof.result}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-(--text-secondary)">
                  {service.proof.detail}
                </p>
              </div>
            </Reveal>
          ) : null}
        </div>
      </section>

      {situations.length > 0 && (
        <section className="border-t border-(--border) px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <h2 className="font-display text-2xl font-semibold">
                When this is the right call
              </h2>
              <p className="mt-3 max-w-xl text-(--text-secondary)">
                Phrased the way the problem usually arrives, rather than as a
                service category.
              </p>
            </Reveal>
            <ul role="list" className="mt-8 grid gap-4 sm:grid-cols-2">
              {situations.map((situation, i) => (
                <Reveal key={situation.id} delay={Math.min(i * 0.06, 0.2)}>
                  <li className="h-full rounded-lg border border-(--border) bg-(--surface-raised) p-5">
                    <p className="font-medium">{situation.label}</p>
                    <p className="mt-2 text-sm leading-relaxed text-(--text-secondary)">
                      {situation.detail}
                    </p>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="border-t border-(--border) px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <h2 className="font-display text-2xl font-semibold">
              Common questions
            </h2>
          </Reveal>
          {/* A <dl> rather than a details/summary accordion, deliberately.
              Collapsed answers are still in the DOM and still indexable, but
              they cost a click to read and give an answer engine no signal
              about which one matters. These are three short answers; hiding
              them buys nothing. Emitted as FAQPage structured data too. */}
          <dl className="mt-8 divide-y divide-(--border) border-t border-(--border)">
            {detail.faqs.map((faq, i) => (
              <Reveal key={faq.question} delay={Math.min(i * 0.06, 0.2)}>
                <div className="py-6">
                  <dt className="font-display text-lg font-semibold">
                    {faq.question}
                  </dt>
                  <dd className="mt-2 max-w-[65ch] leading-relaxed text-(--text-secondary)">
                    {faq.answer}
                  </dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      <section className="border-t border-(--border) px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <h2 className="font-display text-2xl font-semibold">
              How a {service.name} project runs
            </h2>
            <p className="mt-3 max-w-xl text-(--text-secondary)">
              The same four stages as every project we take on. Discovery is
              free, and the scope and price come before the work starts.
            </p>
          </Reveal>
          <ol className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS_STEPS.map((step, i) => (
              <Reveal key={step.id} delay={Math.min(i * 0.06, 0.2)}>
                <li className="h-full border-t border-(--border) pt-4">
                  <span className="font-mono text-sm text-(--accent)">
                    0{step.step}
                  </span>
                  <h3 className="mt-2 font-display text-lg font-semibold">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-(--text-secondary)">
                    {step.description}
                  </p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-(--border) px-6 py-16">
          <div className="mx-auto max-w-4xl">
            <Reveal>
              <h2 className="font-display text-2xl font-semibold">
                Related reading
              </h2>
            </Reveal>
            <ul role="list" className="mt-6 divide-y divide-(--border) border-t border-(--border)">
              {related.map((post) => (
                <Reveal key={post.slug}>
                  <li>
                    <Link
                      href={`/insights/${post.slug}`}
                      className="group block py-5"
                    >
                      <p className="font-display text-lg font-semibold transition-colors duration-200 ease-confident group-hover:text-(--accent)">
                        {post.title}
                      </p>
                      <p className="mt-1.5 max-w-xl text-sm text-(--text-secondary)">
                        {post.excerpt}
                      </p>
                    </Link>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="border-t border-(--border) px-6 py-20 text-center">
        <Reveal>
          <h2 className="mx-auto max-w-2xl text-balance font-display text-3xl font-semibold">
            Get a scoped {service.name} project and a real price in 48 hours.
            Free.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-balance text-(--text-secondary)">
            Tell us what&rsquo;s slow, missed, or manual right now, and
            we&rsquo;ll tell you what it costs and how long it takes.
          </p>
          {/* Pre-selects this service in the form, the same deep link the
              comparison grid uses. */}
          <Link
            href={`/contact?service=${service.id}`}
            className="group mt-8 inline-flex items-center gap-2 rounded-md bg-brand-500 px-6 py-3 text-sm font-medium text-neutral-950 transition-colors duration-150 ease-confident hover:bg-brand-300"
          >
            Start a {service.name} project
            <ArrowRight
              className="h-4 w-4 transition-transform duration-200 ease-confident motion-safe:group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </Reveal>
      </section>
    </main>
  );
}
