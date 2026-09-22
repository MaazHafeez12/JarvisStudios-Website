import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { TRADES } from "@/content/trades";
import { SERVICES } from "@/content/services";
import { PROCESS_STEPS } from "@/content/process";
import { pageMetadata } from "@/lib/seo";
import { tradeGraph } from "@/lib/structured-data";

// One page per trade, at /for/<id>.
//
// WHAT THIS IS FOR. The six service pages are organised by what the studio
// sells. These are organised by who the visitor is, which is the axis the
// market actually searches on — "software for plumbing companies" is a query
// with intent behind it, "web development" is a category with a thousand
// better-resourced agencies already ranking for it. content/trades.ts carries
// the full reasoning, including why there are three of these and not six.
//
// WHAT THIS IS NOT. It is not a landing page per service-and-trade pair.
// Every page here links out to the service pages that genuinely apply rather
// than restating them, which is also what makes those links worth something:
// an inbound link from a page about the problem, not from another copy of the
// category page.
//
// There is deliberately no /for hub. A three-item index would be a thin page
// whose only content is three links the footer already carries sitewide, and
// the breadcrumb graph names Home as the parent for the same reason.
//
// Fully static like the rest of the marketing routes, with dynamicParams off
// so an unknown trade 404s rather than rendering on demand.

export const dynamicParams = false;

export function generateStaticParams() {
  return TRADES.map((trade) => ({ trade: trade.id }));
}

function getTrade(slug: string) {
  return TRADES.find((t) => t.id === slug) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ trade: string }>;
}): Promise<Metadata> {
  const { trade: slug } = await params;
  const trade = getTrade(slug);
  if (!trade) return {};

  // The headline is already the phrase someone would type, so the title uses
  // it directly rather than restating the trade name beside a category word.
  return pageMetadata({
    title: trade.headline,
    description: trade.lead,
    path: `/for/${trade.id}`,
  });
}

export default async function TradePage({
  params,
}: {
  params: Promise<{ trade: string }>;
}) {
  const { trade: slug } = await params;
  const trade = getTrade(slug);
  if (!trade) notFound();

  // Resolved from SERVICES rather than duplicated into trades.ts, so a
  // renamed service line cannot leave a stale name on a trade page.
  const services = trade.services
    .map((id) => SERVICES.find((s) => s.id === id))
    .filter((s): s is (typeof SERVICES)[number] => Boolean(s));

  // Only ever a published result, read off the service line that owns it.
  const proof = trade.proofFrom
    ? SERVICES.find((s) => s.id === trade.proofFrom)?.proof
    : undefined;

  return (
    <main>
      <JsonLd data={tradeGraph(trade)} />

      <section className="mx-auto max-w-4xl px-6 py-20">
        <Reveal lcpSafe>
          <p className="font-mono text-xs uppercase tracking-widest text-[--text-secondary]">
            {trade.name}
          </p>
          <h1 className="mt-3 max-w-3xl text-balance font-display text-4xl font-semibold sm:text-5xl">
            {trade.headline}
          </h1>
          <p className="mt-5 max-w-2xl text-balance text-lg text-[--text-secondary]">
            {trade.lead}
          </p>
        </Reveal>
      </section>

      <section className="border-t border-[--border] px-6 py-16">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          <div className="space-y-6">
            {trade.body.map((paragraph, i) => (
              <Reveal key={i} delay={Math.min(i * 0.06, 0.2)}>
                <p className="max-w-[65ch] leading-relaxed text-[--text-primary]">
                  {paragraph}
                </p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <div className="rounded-lg border border-[--border] bg-[--surface-raised] p-6">
              <h2 className="font-mono text-xs uppercase tracking-widest text-[--text-secondary]">
                What usually breaks
              </h2>
              <ul className="mt-4 space-y-3">
                {trade.breaks.map((item) => (
                  <li
                    key={item}
                    className="relative pl-5 text-sm leading-relaxed text-[--text-secondary]"
                  >
                    <span
                      aria-hidden="true"
                      className="absolute left-0 top-[0.55em] h-1.5 w-1.5 rounded-full bg-[--accent]"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-[--border] px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <h2 className="font-display text-2xl font-semibold">
              What we&rsquo;d build for {trade.audience}
            </h2>
            <p className="mt-3 max-w-xl text-[--text-secondary]">
              The service lines that genuinely apply, in the order they
              usually matter. Each one has its own page.
            </p>
          </Reveal>
          <ul role="list" className="mt-8 grid gap-4 sm:grid-cols-2">
            {services.map((service, i) => (
              <Reveal key={service.id} delay={Math.min(i * 0.06, 0.2)}>
                <li className="h-full">
                  <Link
                    href={`/services/${service.id}`}
                    className="group flex h-full flex-col rounded-lg border border-[--border] bg-[--surface-raised] p-5 transition-colors duration-200 ease-confident hover:border-[--accent]"
                  >
                    <p className="font-display text-lg font-semibold transition-colors duration-200 ease-confident group-hover:text-[--accent]">
                      {service.name}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-[--text-secondary]">
                      {service.summary}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[--accent]">
                      {service.name} in detail
                      <ArrowRight
                        className="h-3.5 w-3.5 transition-transform duration-200 ease-confident motion-safe:group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </span>
                  </Link>
                </li>
              </Reveal>
            ))}
          </ul>

          {/* Only where a published result exists, and only read off the
              service line that owns it. An invented result on a page about an
              audience would be asserting it as *this* audience's result. */}
          {proof ? (
            <Reveal>
              <div className="mt-12 max-w-xl border-t border-[--border] pt-6">
                <p className="font-medium leading-relaxed">{proof.result}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-[--text-secondary]">
                  {proof.detail}
                </p>
              </div>
            </Reveal>
          ) : null}
        </div>
      </section>

      <section className="border-t border-[--border] px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <h2 className="font-display text-2xl font-semibold">
              Common questions
            </h2>
          </Reveal>
          {/* A <dl>, not an accordion — same reasoning as the service pages:
              collapsed answers cost a click to read and tell an answer engine
              nothing about which one matters. Emitted as FAQPage too. */}
          <dl className="mt-8 divide-y divide-[--border] border-t border-[--border]">
            {trade.faqs.map((faq, i) => (
              <Reveal key={faq.question} delay={Math.min(i * 0.06, 0.2)}>
                <div className="py-6">
                  <dt className="font-display text-lg font-semibold">
                    {faq.question}
                  </dt>
                  <dd className="mt-2 max-w-[65ch] leading-relaxed text-[--text-secondary]">
                    {faq.answer}
                  </dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      <section className="border-t border-[--border] px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <h2 className="font-display text-2xl font-semibold">
              How a project runs
            </h2>
            <p className="mt-3 max-w-xl text-[--text-secondary]">
              The same four stages as every project we take on. Discovery is
              free, and the scope and price come before the work starts.
            </p>
          </Reveal>
          <ol className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS_STEPS.map((step, i) => (
              <Reveal key={step.id} delay={Math.min(i * 0.06, 0.2)}>
                <li className="h-full border-t border-[--border] pt-4">
                  <span className="font-mono text-sm text-[--accent]">
                    0{step.step}
                  </span>
                  <h3 className="mt-2 font-display text-lg font-semibold">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[--text-secondary]">
                    {step.description}
                  </p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-[--border] px-6 py-20 text-center">
        <Reveal>
          <h2 className="mx-auto max-w-2xl text-balance font-display text-3xl font-semibold">
            Get a scoped project and a real price in 48 hours. Free.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-balance text-[--text-secondary]">
            Tell us what&rsquo;s slow, missed, or manual right now, and
            we&rsquo;ll tell you what it costs and how long it takes.
          </p>
          {/* Pre-selects the service this trade most often needs first, the
              same deep link the services grid uses. */}
          <Link
            href={`/contact?service=${trade.services[0]}`}
            className="group mt-8 inline-flex items-center gap-2 rounded-md bg-brand-500 px-6 py-3 text-sm font-medium text-neutral-950 transition-colors duration-150 ease-confident hover:bg-brand-300"
          >
            Start a project
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
