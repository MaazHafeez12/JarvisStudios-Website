import { Check } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import type { Service } from "@/content/services";
import { createServiceComposition } from "@/lib/service-shards";

// Abstract, brand-derived graphics (docs/DESIGN.md §2.4) rather than stock
// photography or generic gradient-blob illustrations — a distinct angular
// shard composition per service line, generated from the service's own id.
//
// This replaced a bordered panel holding a single large lucide icon. At
// 320x320 with an 80x80 glyph that panel was ~94% empty, and repeating it
// six times down the page made the whole section read as unfinished.

export function ServiceBlock({ service, index }: { service: Service; index: number }) {
  const shards = createServiceComposition(service.id);
  const reversed = index % 2 === 1;

  return (
    <Reveal>
      <div
        id={service.id}
        className={`flex scroll-mt-24 flex-col items-center gap-10 py-16 md:flex-row ${
          reversed ? "md:flex-row-reverse" : ""
        }`}
      >
        <div className="aspect-square w-full max-w-xs shrink-0 overflow-hidden rounded-lg border border-[--border] bg-[--surface-raised]">
          <svg
            viewBox="0 0 100 100"
            className="h-full w-full"
            aria-hidden="true"
            focusable="false"
          >
            {shards.map((shard, i) => (
              <polygon
                key={i}
                points={shard.points}
                fill={shard.color}
                fillOpacity={shard.opacity}
              />
            ))}
          </svg>
        </div>

        <div className="flex-1">
          <h2 className="font-display text-2xl font-semibold">{service.name}</h2>
          <p className="mt-2 text-[--text-secondary]">{service.summary}</p>
          <ul className="mt-5 space-y-2">
            {service.capabilities.map((capability) => (
              <li key={capability} className="flex items-start gap-2 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[--accent]" aria-hidden="true" />
                <span>{capability}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Reveal>
  );
}
