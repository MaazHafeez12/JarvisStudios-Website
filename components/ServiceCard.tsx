import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Service } from "@/content/services";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <Link
      href={`/services#${service.id}`}
      className="group flex flex-col justify-between rounded-lg border border-[--border] bg-[--surface-raised] p-6 transition-colors duration-150 ease-confident hover:border-[--accent]"
    >
      <div>
        <h3 className="font-display text-lg font-semibold">{service.name}</h3>
        <p className="mt-2 text-sm text-[--text-secondary]">{service.summary}</p>
      </div>
      <ArrowUpRight
        className="mt-6 h-5 w-5 text-[--text-secondary] transition-colors duration-150 ease-confident group-hover:text-[--accent]"
        aria-hidden="true"
      />
    </Link>
  );
}
