import { Globe, Smartphone, Layers, Users, Palette, Check, type LucideIcon } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import type { Service } from "@/content/services";

// Abstract, brand-derived graphics (docs/DESIGN.md §2.4) rather than
// stock photography or generic gradient-blob illustrations — one icon per
// service line, rendered large inside a bordered panel.
const SERVICE_ICONS: Record<Service["id"], LucideIcon> = {
  web: Globe,
  app: Smartphone,
  saas: Layers,
  crm: Users,
  design: Palette,
};

export function ServiceBlock({ service, index }: { service: Service; index: number }) {
  const Icon = SERVICE_ICONS[service.id];
  const reversed = index % 2 === 1;

  return (
    <Reveal>
      <div
        id={service.id}
        className={`flex scroll-mt-24 flex-col items-center gap-10 py-16 md:flex-row ${
          reversed ? "md:flex-row-reverse" : ""
        }`}
      >
        <div className="flex aspect-square w-full max-w-xs shrink-0 items-center justify-center rounded-lg border border-[--border] bg-[--surface-raised]">
          <Icon className="h-20 w-20 text-[--accent]" strokeWidth={1.5} aria-hidden="true" />
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
