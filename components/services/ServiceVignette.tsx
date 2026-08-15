import type { ProjectType } from "@/lib/types/lead";
import {
  ACCENT,
  ACCENT_TEXT,
  Avatar,
  Frame,
  Glyph,
  Label,
  SceneImage,
  Surface,
  TextRun,
  hair,
  hairSoft,
} from "./vignette-kit";

// Authored interface vignettes — one per service line.
//
// PRODUCT.md records that no real screenshots, case studies or client work
// exist yet, and the site's standing principle is not to fabricate evidence.
// These are therefore illustrative: they show the *kind of artifact* each
// service produces. No invented client names, no invented metrics, no fake
// dashboards with plausible-looking numbers — anything a visitor could
// mistake for delivered work is absent by construction. Where a real product
// would show a customer's name, these still show a grey bar, and that is the
// one place the bar is the honest drawing rather than a shortcut.
//
// They share one frame, one stroke weight and one accent so six of them down
// a page read as a family. Everything is currentColor at varying opacity
// except a single brand-blue element per scene: the thing the service
// actually changes.
//
// DRAWN AS SOFTWARE, NOT AS WIREFRAMES. Earlier versions rendered every label
// as a grey rounded bar on an unfilled outline, which is the skeleton-loader
// idiom — they read as interfaces still loading. Real type, filled surfaces at
// three elevations, and ordinary UI furniture (search fields, avatars, tab
// bars, icons) are what separate a picture of software from a placeholder.
// See vignette-kit.tsx for the primitives and the reasoning.

/**
 * Real screenshots, when they exist, keyed by service.
 *
 * Empty on purpose: `public/` holds only fonts and the logo today. Drop a
 * pre-optimised WebP in `public/vignettes/`, add its path here, and that one
 * scene becomes a photograph while the other five stay drawn — no other file
 * changes. See `SceneImage` for why it paints inside the same frame.
 */
const SCENE_IMAGES: Partial<Record<ProjectType, string>> = {};

/** A browser: the page, its structure, and the one thing that converts. */
function WebVignette() {
  const cards = [
    { x: 44, glyph: "grid", label: "Services" },
    { x: 180, glyph: "chart", label: "Results" },
    { x: 316, glyph: "user", label: "About" },
  ] as const;

  return (
    <>
      {/* Window chrome. */}
      <rect x="24" y="28" width="432" height="264" rx="10" {...hair} />
      <path d="M24 62 H456" {...hair} />
      <circle cx="46" cy="45" r="3.5" fill="currentColor" fillOpacity="0.28" />
      <circle cx="60" cy="45" r="3.5" fill="currentColor" fillOpacity="0.28" />
      <circle cx="74" cy="45" r="3.5" fill="currentColor" fillOpacity="0.28" />
      <Surface x={96} y={37} width={200} height={17} rx={8.5} level="inset" border="none" />
      <Glyph name="search" x={103} y={41} size={9} opacity={0.4} />
      <Label x={118} y={49} size={8.5} tone="muted">
        yourbrand.com
      </Label>

      {/* The page itself, one step above the window ground. */}
      <rect x="24" y="62" width="432" height="230" fill="currentColor" fillOpacity="0.045" />

      {/* Site header. */}
      <rect x="44" y="78" width="15" height="15" rx="4" fill="currentColor" fillOpacity="0.28" />
      <Label x={246} y={91} size={9}>
        Work
      </Label>
      <Label x={288} y={91} size={9}>
        Services
      </Label>
      <Label x={344} y={91} size={9}>
        About
      </Label>
      <path d="M44 106 H436" {...hairSoft} />

      {/* Above the fold: headline, supporting line, one action. */}
      <Label x={44} y={142} size={17} weight={600} tone="primary">
        Built to be
      </Label>
      <Label x={44} y={164} size={17} weight={600} tone="primary">
        found and used.
      </Label>
      <TextRun x={44} y={178} width={190} />
      <TextRun x={44} y={192} width={148} />
      {/* The blue is a fixed brand value in both themes, so the label on top
          of it is a fixed near-black rather than a theme token. */}
      <g className="vg-accent">
        <rect x="44" y="208" width="94" height="26" rx="13" fill={ACCENT} />
        <text
          x="91"
          y="224"
          fontSize="9.5"
          fontWeight="600"
          fontFamily="var(--font-inter), sans-serif"
          textAnchor="middle"
          fill="#141414"
        >
          Start a project
        </text>
      </g>

      {/* The hero image, drawn as an image rather than left as an empty box. */}
      <Surface x={300} y={126} width={136} height={106} rx={8} />
      <circle cx="330" cy="154" r="8" fill="currentColor" fillOpacity="0.2" />
      <path
        d="M300 232 L340 186 L368 214 L392 194 L436 232 Z"
        fill="currentColor"
        fillOpacity="0.16"
      />

      {/* Below: the supporting row. */}
      {cards.map((card) => (
        <g key={card.x}>
          <Surface x={card.x} y={250} width={120} height={32} rx={5} />
          <Glyph name={card.glyph} x={card.x + 12} y={259} size={13} opacity={0.42} />
          <Label x={card.x + 33} y={270} size={9}>
            {card.label}
          </Label>
        </g>
      ))}
    </>
  );
}

/** A handset: a list-driven app, plus the moment it tells you something. */
function AppVignette() {
  const rows = [
    { y: 112, title: "Site review", meta: "Today · 10:00" },
    { y: 160, title: "Team sync", meta: "Tomorrow · 14:30" },
    { y: 208, title: "Kickoff call", meta: "Fri · 09:15" },
  ];
  const tabs = [
    { cx: 121, glyph: "home", label: "Home" },
    { cx: 164, glyph: "inbox", label: "Book" },
    { cx: 207, glyph: "user", label: "You" },
  ] as const;

  return (
    <>
      {/* Handset and screen. Held left of centre so the card below can lift
          off its right edge without landing on any of the row text. */}
      <rect x="92" y="20" width="144" height="280" rx="22" {...hair} />
      <rect x="100" y="28" width="128" height="264" rx="16" fill="currentColor" fillOpacity="0.045" />

      {/* Status bar. */}
      <Label x={110} y={45} size={8} tone="muted">
        9:41
      </Label>
      <rect x="204" y="38" width="12" height="6.5" rx="2" {...hairSoft} />
      <rect x="217" y="40" width="1.5" height="2.5" rx="0.75" fill="currentColor" fillOpacity="0.3" />

      <Label x={110} y={76} size={13} weight={600} tone="primary">
        Bookings
      </Label>

      <Surface x={110} y={86} width={108} height={18} rx={9} level="inset" border="none" />
      <Glyph name="search" x={117} y={90} size={10} opacity={0.4} />
      <Label x={132} y={99} size={8.5} tone="muted">
        Search
      </Label>

      {rows.map((row) => (
        <g key={row.y}>
          <Surface x={110} y={row.y} width={108} height={42} rx={8} />
          <Avatar cx={125} cy={row.y + 21} r={9} />
          <Label x={141} y={row.y + 19} size={9} weight={600}>
            {row.title}
          </Label>
          <Label x={141} y={row.y + 32} size={8} tone="muted">
            {row.meta}
          </Label>
        </g>
      ))}

      {/* Tab bar. The live tab is the one blue element. */}
      <path d="M100 258 H228" {...hairSoft} />
      {tabs.map((tab, i) =>
        i === 0 ? (
          <g key={tab.cx} className="vg-accent">
            <Glyph name={tab.glyph} x={tab.cx - 6.5} y={266} size={13} opacity={1} color={ACCENT_TEXT} />
            <Label x={tab.cx} y={288} size={7.5} weight={600} anchor="middle" tone="accent">
              {tab.label}
            </Label>
          </g>
        ) : (
          <g key={tab.cx}>
            <Glyph name={tab.glyph} x={tab.cx - 6.5} y={266} size={13} opacity={0.32} />
            <Label x={tab.cx} y={288} size={7.5} anchor="middle" tone="muted">
              {tab.label}
            </Label>
          </g>
        ),
      )}

      {/* A card lifted off the handset — opaque, so it reads as being in
          front of the screen rather than printed on it. The fill is the
          ground both consumers (the tour stage and ServiceExplorer's cards)
          actually paint, so it occludes correctly in either theme. */}
      <rect x="224" y="112" width="204" height="100" rx="12" fill="var(--surface-raised)" />
      <Surface x={224} y={112} width={204} height={100} rx={12} border="hair" />
      <Glyph name="check" x={244} y={132} size={16} opacity={0.45} />
      <Label x={270} y={144} size={11} weight={600} tone="primary">
        Booking confirmed
      </Label>
      <TextRun x={244} y={160} width={152} />
      <TextRun x={244} y={174} width={112} />
      <Label x={244} y={198} size={8.5} tone="muted">
        Sent to the calendar
      </Label>
    </>
  );
}

/** An application shell: navigation, a working table, a live figure. */
function SaasVignette() {
  const nav = [
    { y: 96, glyph: "grid", label: "Overview", active: true },
    { y: 122, glyph: "user", label: "Customers", active: false },
    { y: 148, glyph: "chart", label: "Usage", active: false },
    { y: 174, glyph: "gear", label: "Settings", active: false },
  ] as const;
  const rows = [
    { y: 116, plan: "Pro", width: 58 },
    { y: 146, plan: "Team", width: 44 },
    { y: 176, plan: "Free", width: 66 },
  ];

  return (
    <>
      <rect x="24" y="28" width="432" height="264" rx="10" {...hair} />
      <path d="M148 28 V292" {...hair} />
      <path d="M148 76 H456" {...hair} />

      {/* Sidebar. */}
      <rect x="44" y="46" width="14" height="14" rx="4" fill="currentColor" fillOpacity="0.3" />
      <Label x={64} y={57} size={10} weight={600} tone="primary">
        Console
      </Label>
      {nav.map((item) => (
        <g key={item.y}>
          {item.active ? (
            <Surface x={38} y={item.y - 15} width={102} height={22} rx={5} level="inset" border="none" />
          ) : null}
          <Glyph name={item.glyph} x={46} y={item.y - 11} size={13} opacity={item.active ? 0.72 : 0.36} />
          <Label x={68} y={item.y} size={9.5} weight={item.active ? 600 : 500} tone={item.active ? "primary" : "muted"}>
            {item.label}
          </Label>
        </g>
      ))}

      {/* Top bar. */}
      <Label x={172} y={57} size={12} weight={600} tone="primary">
        Overview
      </Label>
      <Surface x={318} y={42} width={118} height={20} rx={10} level="inset" border="none" />
      <Glyph name="search" x={326} y={47} size={10} opacity={0.4} />
      <Label x={342} y={56} size={8.5} tone="muted">
        Search
      </Label>

      {/* Table. Account names stay bars: a plausible-looking customer list is
          exactly the fabricated evidence this site refuses to draw. */}
      <Label x={172} y={100} size={8.5} tone="muted" tracking={0.6}>
        ACCOUNT
      </Label>
      <Label x={300} y={100} size={8.5} tone="muted" tracking={0.6}>
        PLAN
      </Label>
      <Label x={378} y={100} size={8.5} tone="muted" tracking={0.6}>
        STATUS
      </Label>
      <path d="M172 108 H432" {...hairSoft} />
      {rows.map((row) => (
        <g key={row.y}>
          <Avatar cx={180} cy={row.y + 15} r={7} />
          <TextRun x={194} y={row.y + 11} width={row.width} opacity={0.2} />
          <Surface x={300} y={row.y + 8} width={38} height={14} rx={7} level="inset" border="none" />
          <Label x={319} y={row.y + 18} size={7.5} weight={600} anchor="middle" tone="muted">
            {row.plan}
          </Label>
          <circle cx="382" cy={row.y + 15} r="3" fill="currentColor" fillOpacity="0.3" />
          <Label x={390} y={row.y + 18} size={8.5} tone="muted">
            Active
          </Label>
          <path d={`M172 ${row.y + 30} H432`} {...hairSoft} />
        </g>
      ))}

      {/* Usage figure — shape only, no axis values to misread as a claim. */}
      <Label x={172} y={228} size={9} weight={600}>
        Usage
      </Label>
      <g className="vg-accent">
        <path
          d="M172 268 L215 254 L258 259 L302 238 L345 245 L389 226 L432 231 L432 280 L172 280 Z"
          fill={ACCENT}
          fillOpacity="0.14"
        />
        <path
          d="M172 268 L215 254 L258 259 L302 238 L345 245 L389 226 L432 231"
          stroke={ACCENT}
          strokeWidth="2"
        />
      </g>
      <path d="M172 280 H432" {...hairSoft} />
    </>
  );
}

/** A pipeline: named stages, and the one deal that just moved. */
function CrmVignette() {
  const columns = [
    { x: 32, stage: "New", count: "4", cards: ["Web", "App", "Web"] },
    { x: 140, stage: "Qualified", count: "2", cards: ["SaaS", "CRM"] },
    { x: 248, stage: "Proposal", count: "3", cards: ["App", "Web", "SaaS"] },
    { x: 356, stage: "Won", count: "1", cards: ["CRM"] },
  ];

  /** Account names are bars by construction — see SaasVignette's table. */
  const card = (x: number, y: number, tag: string) => (
    <>
      <Surface x={x} y={y} width={92} height={56} rx={6} />
      <Avatar cx={x + 15} cy={y + 17} r={7} />
      <TextRun x={x + 28} y={y + 13} width={46} opacity={0.22} />
      <TextRun x={x + 28} y={y + 24} width={30} height={5} opacity={0.13} />
      <path d={`M${x + 1} ${y + 38} H${x + 91}`} {...hairSoft} />
      <Surface x={x + 12} y={y + 42} width={36} height={11} rx={5.5} level="inset" border="none" />
      <Label x={x + 30} y={y + 50} size={7} weight={600} anchor="middle" tone="muted">
        {tag}
      </Label>
    </>
  );

  return (
    <>
      {columns.map((column) => (
        <g key={column.x}>
          <Label x={column.x} y={44} size={9.5} weight={600}>
            {column.stage}
          </Label>
          <Label x={column.x + 92} y={44} size={9} anchor="end" tone="muted">
            {column.count}
          </Label>
          <path d={`M${column.x} 54 H${column.x + 92}`} {...hair} />
          {column.cards.map((tag, i) => (
            <g key={`${column.x}-${i}`}>{card(column.x, 68 + i * 66, tag)}</g>
          ))}
        </g>
      ))}

      {/* The deal that advanced: outlined, in the stage it moved into. */}
      <g className="vg-accent">
        <rect x="248" y="68" width="92" height="56" rx="6" stroke={ACCENT} strokeWidth="1.5" />
        <rect x="260" y="110" width="36" height="11" rx="5.5" fill={ACCENT} fillOpacity="0.22" />
        <Label x={278} y={118} size={7} weight={600} anchor="middle" tone="accent">
          App
        </Label>
      </g>
    </>
  );
}

/** A workflow: a trigger, a branch, a review gate, a result. */
function AiVignette() {
  const nodes = [
    { x: 28, y: 140, glyph: "bolt", label: "Trigger" },
    { x: 172, y: 64, glyph: "grid", label: "Classify" },
    { x: 172, y: 216, glyph: "inbox", label: "Enrich" },
  ] as const;

  return (
    <>
      <Label x={28} y={40} size={9} weight={600} tone="muted" tracking={0.6}>
        WORKFLOW
      </Label>

      {nodes.map((node) => (
        <g key={`${node.x}-${node.y}`}>
          <Surface x={node.x} y={node.y} width={88} height={40} rx={6} />
          <Glyph name={node.glyph} x={node.x + 12} y={node.y + 13} size={14} opacity={0.42} />
          <Label x={node.x + 34} y={node.y + 24} size={9.5} weight={600}>
            {node.label}
          </Label>
        </g>
      ))}

      <path d="M116 160 H140" {...hair} />
      <path d="M140 160 V84 H172" {...hair} />
      <path d="M140 160 V236 H172" {...hair} />
      <path d="M260 84 H300 V160 H340" {...hair} />
      <path d="M260 236 H300 V160" {...hair} />
      <path d="M334 154 L341 160 L334 166" {...hair} />

      {/* The human review gate — the part that keeps automation honest. */}
      <g className="vg-accent">
        <rect x="344" y="140" width="88" height="40" rx="6" fill={ACCENT} fillOpacity="0.1" />
        <rect x="344" y="140" width="88" height="40" rx="6" stroke={ACCENT} strokeWidth="1.5" />
        <Glyph name="user" x={356} y={153} size={14} opacity={1} color={ACCENT_TEXT} />
        <Label x={378} y={164} size={9.5} weight={600} tone="accent">
          Review
        </Label>
      </g>
      <Label x={344} y={200} size={8.5} tone="muted">
        Approved by a person
      </Label>
    </>
  );
}

/** A specimen sheet: the system a brand is actually made of. */
function DesignVignette() {
  const swatches = [
    { x: 256, fill: "#141414", label: "950", stroke: true },
    { x: 304, fill: "#4A4A4A", label: "600", stroke: false },
    { x: 352, fill: ACCENT, label: "500", stroke: false, accent: true },
    { x: 400, fill: "#5FD0FF", label: "300", stroke: false },
  ];

  return (
    <>
      <text
        x="44"
        y="156"
        fontFamily="var(--font-clash-display), sans-serif"
        fontSize="128"
        fontWeight="700"
        fill="var(--text-primary)"
        fillOpacity="0.9"
        letterSpacing="-6"
      >
        Aa
      </text>

      <Label x={236} y={62} size={8.5} tone="muted" tracking={1}>
        TYPEFACE
      </Label>
      <Label x={236} y={86} size={15} weight={600} tone="primary" display>
        Clash Display
      </Label>
      <Label x={236} y={104} size={9} tone="muted">
        Display · 3 weights
      </Label>
      <path d="M236 118 H436" {...hairSoft} />
      <Label x={236} y={138} size={8.5} tone="muted" tracking={1}>
        SUPPORTING
      </Label>
      <Label x={236} y={160} size={13} weight={500} tone="primary">
        Inter
      </Label>
      <Label x={236} y={176} size={9} tone="muted">
        Text · 4 weights
      </Label>

      <path d="M44 192 H436" {...hair} />

      {/* Type scale, descending — set in the type it describes. */}
      <Label x={44} y={212} size={8.5} tone="muted" tracking={1}>
        SCALE
      </Label>
      <Label x={44} y={236} size={15} weight={600} tone="primary" display>
        Heading
      </Label>
      <Label x={44} y={256} size={11} weight={500}>
        Subheading
      </Label>
      <Label x={44} y={272} size={9} tone="muted">
        Body copy
      </Label>
      <Label x={44} y={286} size={7.5} tone="muted">
        Caption
      </Label>

      {/* The palette, as the brand actually defines it. */}
      <Label x={256} y={212} size={8.5} tone="muted" tracking={1}>
        PALETTE
      </Label>
      {swatches.map((swatch) => (
        <g key={swatch.x} className={swatch.accent ? "vg-accent" : undefined}>
          <rect
            x={swatch.x}
            y="224"
            width="40"
            height="48"
            rx="4"
            fill={swatch.fill}
            {...(swatch.stroke ? { stroke: "currentColor", strokeOpacity: 0.25 } : {})}
          />
          <Label x={swatch.x + 20} y={286} size={7.5} anchor="middle" tone="muted">
            {swatch.label}
          </Label>
        </g>
      ))}
    </>
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
  const src = SCENE_IMAGES[service];
  const Vignette = VIGNETTES[service];

  return (
    <Frame className="vg-scene">
      {src ? <SceneImage src={src} /> : <Vignette />}
    </Frame>
  );
}
