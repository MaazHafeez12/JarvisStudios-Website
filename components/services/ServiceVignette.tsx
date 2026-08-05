import type { ProjectType } from "@/lib/types/lead";

// Authored interface vignettes — one per service line.
//
// PRODUCT.md records that no real screenshots, case studies or client work
// exist yet, and the site's standing principle is not to fabricate evidence.
// These are therefore illustrative: they show the *kind of artifact* each
// service produces, drawn as structure only. No invented client names, no
// invented metrics, no fake dashboards with plausible-looking numbers —
// anything a visitor could mistake for delivered work is absent by
// construction. When real screenshots exist they replace these outright.
//
// They share one frame, one stroke weight and one accent so six of them
// down a page read as a family. Everything is currentColor at varying
// opacity except a single brand-blue element per scene: the thing the
// service actually changes.

const ACCENT = "#00ADEF";

/** Shared canvas. 3:2, generous inset, so every scene sits on one grid. */
function Frame({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 480 320"
      className="h-full w-full text-[--text-secondary]"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

const hair = { stroke: "currentColor", strokeOpacity: 0.32, strokeWidth: 1 };
const hairSoft = { stroke: "currentColor", strokeOpacity: 0.18, strokeWidth: 1 };

/** A browser: the page, its structure, and the one thing that converts. */
function WebVignette() {
  return (
    <Frame>
      <rect x="24" y="28" width="432" height="264" rx="10" {...hair} />
      <path d="M24 62 H456" {...hair} />
      <circle cx="46" cy="45" r="3.5" fill="currentColor" fillOpacity="0.28" />
      <circle cx="60" cy="45" r="3.5" fill="currentColor" fillOpacity="0.28" />
      <circle cx="74" cy="45" r="3.5" fill="currentColor" fillOpacity="0.28" />
      <rect x="96" y="38" width="196" height="14" rx="7" fill="currentColor" fillOpacity="0.1" />

      {/* Above the fold: headline, supporting line, one action. */}
      <rect x="52" y="88" width="188" height="11" rx="2" fill="currentColor" fillOpacity="0.34" />
      <rect x="52" y="108" width="140" height="11" rx="2" fill="currentColor" fillOpacity="0.34" />
      <rect x="52" y="134" width="232" height="7" rx="2" fill="currentColor" fillOpacity="0.16" />
      <rect x="52" y="148" width="196" height="7" rx="2" fill="currentColor" fillOpacity="0.16" />
      <rect x="52" y="176" width="88" height="26" rx="13" fill={ACCENT} />

      <rect x="316" y="88" width="112" height="114" rx="6" fill="currentColor" fillOpacity="0.07" />

      {/* Below: the supporting row. */}
      <rect x="52" y="228" width="112" height="42" rx="5" {...hairSoft} />
      <rect x="184" y="228" width="112" height="42" rx="5" {...hairSoft} />
      <rect x="316" y="228" width="112" height="42" rx="5" {...hairSoft} />
    </Frame>
  );
}

/** A handset: a list-driven app with a live tab. */
function AppVignette() {
  return (
    <Frame>
      <rect x="168" y="20" width="144" height="280" rx="22" {...hair} />
      <rect x="216" y="34" width="48" height="5" rx="2.5" fill="currentColor" fillOpacity="0.3" />

      <rect x="184" y="58" width="72" height="10" rx="2" fill="currentColor" fillOpacity="0.34" />

      <rect x="184" y="84" width="112" height="46" rx="6" {...hairSoft} />
      <rect x="196" y="98" width="52" height="7" rx="2" fill="currentColor" fillOpacity="0.26" />
      <rect x="196" y="112" width="76" height="6" rx="2" fill="currentColor" fillOpacity="0.14" />

      <rect x="184" y="140" width="112" height="46" rx="6" {...hairSoft} />
      <rect x="196" y="154" width="64" height="7" rx="2" fill="currentColor" fillOpacity="0.26" />
      <rect x="196" y="168" width="44" height="6" rx="2" fill="currentColor" fillOpacity="0.14" />

      <rect x="184" y="196" width="112" height="46" rx="6" {...hairSoft} />
      <rect x="196" y="210" width="58" height="7" rx="2" fill="currentColor" fillOpacity="0.26" />
      <rect x="196" y="224" width="70" height="6" rx="2" fill="currentColor" fillOpacity="0.14" />

      <path d="M168 262 H312" {...hair} />
      <rect x="199" y="274" width="22" height="4" rx="2" fill={ACCENT} />
      <rect x="229" y="274" width="22" height="4" rx="2" fill="currentColor" fillOpacity="0.2" />
      <rect x="259" y="274" width="22" height="4" rx="2" fill="currentColor" fillOpacity="0.2" />
    </Frame>
  );
}

/** An application shell: navigation, a working table, a live figure. */
function SaasVignette() {
  return (
    <Frame>
      <rect x="24" y="28" width="432" height="264" rx="10" {...hair} />
      <path d="M148 28 V292" {...hair} />
      <path d="M148 76 H456" {...hair} />

      <rect x="44" y="52" width="52" height="8" rx="2" fill="currentColor" fillOpacity="0.3" />
      <rect x="44" y="98" width="84" height="9" rx="2" fill={ACCENT} />
      <rect x="44" y="122" width="72" height="9" rx="2" fill="currentColor" fillOpacity="0.16" />
      <rect x="44" y="146" width="80" height="9" rx="2" fill="currentColor" fillOpacity="0.16" />
      <rect x="44" y="170" width="60" height="9" rx="2" fill="currentColor" fillOpacity="0.16" />

      <rect x="172" y="46" width="76" height="9" rx="2" fill="currentColor" fillOpacity="0.28" />

      {/* Table: header rule then rows. */}
      <path d="M172 122 H432" {...hairSoft} />
      <path d="M172 156 H432" {...hairSoft} />
      <path d="M172 190 H432" {...hairSoft} />
      <rect x="172" y="102" width="60" height="7" rx="2" fill="currentColor" fillOpacity="0.24" />
      <rect x="286" y="102" width="44" height="7" rx="2" fill="currentColor" fillOpacity="0.24" />
      <rect x="380" y="102" width="52" height="7" rx="2" fill="currentColor" fillOpacity="0.24" />
      <rect x="172" y="136" width="76" height="7" rx="2" fill="currentColor" fillOpacity="0.13" />
      <rect x="286" y="136" width="36" height="7" rx="2" fill="currentColor" fillOpacity="0.13" />
      <rect x="380" y="136" width="52" height="7" rx="2" fill="currentColor" fillOpacity="0.13" />
      <rect x="172" y="170" width="64" height="7" rx="2" fill="currentColor" fillOpacity="0.13" />
      <rect x="286" y="170" width="48" height="7" rx="2" fill="currentColor" fillOpacity="0.13" />
      <rect x="380" y="170" width="52" height="7" rx="2" fill="currentColor" fillOpacity="0.13" />

      {/* Usage figure — shape only, no axis values to misread as a claim. */}
      <path d="M172 262 L212 246 L252 252 L292 228 L332 236 L372 214 L412 220" stroke={ACCENT} strokeWidth="2" />
      <path d="M172 276 H432" {...hairSoft} />
    </Frame>
  );
}

/** A pipeline: stages, and the one deal that just moved. */
function CrmVignette() {
  const columns = [
    { x: 44, cards: [0, 1, 2] },
    { x: 156, cards: [0, 1] },
    { x: 268, cards: [0, 1, 2] },
    { x: 380, cards: [0] },
  ];

  return (
    <Frame>
      {columns.map((column) => (
        <g key={column.x}>
          <rect x={column.x} y="34" width="56" height="8" rx="2" fill="currentColor" fillOpacity="0.28" />
          <path d={`M${column.x} 56 H${column.x + 92}`} {...hair} />
          {column.cards.map((card) => (
            <rect
              key={card}
              x={column.x}
              y={74 + card * 62}
              width="92"
              height="50"
              rx="6"
              {...hairSoft}
            />
          ))}
        </g>
      ))}
      {/* The deal that advanced: outlined, in the stage it moved into. */}
      <rect x="268" y="74" width="92" height="50" rx="6" stroke={ACCENT} strokeWidth="1.5" />
      <rect x="280" y="88" width="46" height="6" rx="2" fill={ACCENT} fillOpacity="0.5" />
      <rect x="280" y="102" width="30" height="5" rx="2" fill="currentColor" fillOpacity="0.16" />
    </Frame>
  );
}

/** A workflow: a trigger, a branch, a review gate, a result. */
function AiVignette() {
  const node = (x: number, y: number, w = 84, h = 44) => (
    <rect x={x} y={y} width={w} height={h} rx="6" {...hairSoft} />
  );

  return (
    <Frame>
      {node(36, 138)}
      <rect x="48" y="156" width="46" height="7" rx="2" fill="currentColor" fillOpacity="0.26" />

      <path d="M120 160 H164" {...hair} />
      <path d="M164 160 V78 H196" {...hair} />
      <path d="M164 160 V242 H196" {...hair} />

      {node(196, 56)}
      <rect x="208" y="74" width="52" height="7" rx="2" fill="currentColor" fillOpacity="0.26" />
      {node(196, 220)}
      <rect x="208" y="238" width="38" height="7" rx="2" fill="currentColor" fillOpacity="0.26" />

      <path d="M280 78 H316 V160 H348" {...hair} />
      <path d="M280 242 H316 V160" {...hair} />

      {/* The human review gate — the part that keeps automation honest. */}
      <rect x="348" y="138" width="84" height="44" rx="6" stroke={ACCENT} strokeWidth="1.5" />
      <rect x="360" y="156" width="48" height="7" rx="2" fill={ACCENT} fillOpacity="0.55" />
    </Frame>
  );
}

/** A specimen sheet: the system a brand is actually made of. */
function DesignVignette() {
  return (
    <Frame>
      <text
        x="44"
        y="150"
        fontFamily="var(--font-clash-display), sans-serif"
        fontSize="132"
        fontWeight="700"
        fill="currentColor"
        fillOpacity="0.9"
        letterSpacing="-6"
      >
        Aa
      </text>

      <path d="M44 186 H436" {...hair} />

      {/* Type scale, descending. */}
      <rect x="44" y="206" width="150" height="14" rx="2" fill="currentColor" fillOpacity="0.3" />
      <rect x="44" y="228" width="112" height="10" rx="2" fill="currentColor" fillOpacity="0.22" />
      <rect x="44" y="246" width="86" height="7" rx="2" fill="currentColor" fillOpacity="0.16" />
      <rect x="44" y="261" width="64" height="5" rx="2" fill="currentColor" fillOpacity="0.12" />

      {/* The palette, as the brand actually defines it. */}
      <rect x="256" y="206" width="42" height="60" rx="4" fill="#141414" stroke="currentColor" strokeOpacity="0.25" />
      <rect x="306" y="206" width="42" height="60" rx="4" fill="#4A4A4A" />
      <rect x="356" y="206" width="42" height="60" rx="4" fill={ACCENT} />
      <rect x="406" y="206" width="30" height="60" rx="4" fill="#5FD0FF" />
    </Frame>
  );
}

const VIGNETTES: Record<ProjectType, () => React.JSX.Element> = {
  web: WebVignette,
  app: AppVignette,
  saas: SaasVignette,
  crm: CrmVignette,
  ai: AiVignette,
  design: DesignVignette,
};

export function ServiceVignette({ service }: { service: ProjectType }) {
  const Vignette = VIGNETTES[service];
  return <Vignette />;
}
