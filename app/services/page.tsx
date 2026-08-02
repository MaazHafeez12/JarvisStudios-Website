import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { ProcessSteps } from "@/components/ProcessSteps";
import { ServiceBlock } from "@/components/ServiceBlock";
import { SERVICES } from "@/content/services";

export const metadata: Metadata = {
  title: "Services — Jarvis Studios",
  description:
    "Web development, app development, SaaS, CRM, and marketing/design services from Jarvis Studios.",
};

export default function ServicesPage() {
  return (
    <main>
      <section className="mx-auto max-w-3xl px-6 py-20 text-center">
        <Reveal>
          <h1 className="font-display text-4xl font-semibold sm:text-5xl">
            What we do, and how we work.
          </h1>
          <p className="mt-4 text-[--text-secondary]">
            Five service lines, one consistent process from first
            conversation to launch.
          </p>
        </Reveal>
      </section>

      <section className="border-t border-[--border] px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-widest text-[--text-secondary]">
              Our process
            </p>
          </Reveal>
          <div className="mt-6">
            <ProcessSteps />
          </div>
        </div>
      </section>

      <section className="border-t border-[--border] px-6">
        <div className="mx-auto max-w-4xl divide-y divide-[--border]">
          {SERVICES.map((service, i) => (
            <ServiceBlock key={service.id} service={service} index={i} />
          ))}
        </div>
      </section>

      <section className="border-t border-[--border] px-6 py-20 text-center">
        <Reveal>
          <h2 className="font-display text-3xl font-semibold">
            Not sure which service you need?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[--text-secondary]">
            Tell us what you're working on and we'll help you figure it out.
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
    </main>
  );
}
