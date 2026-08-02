export function Marquee({ items }: { items: string[] }) {
  return (
    <div className="overflow-hidden">
      <div className="flex w-max animate-marquee gap-12">
        {/* Track duplicated once so the -50% loop is seamless. */}
        {[...items, ...items].map((item, i) => (
          <span
            key={i}
            className="whitespace-nowrap font-mono text-sm uppercase tracking-widest text-[--text-secondary]"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
