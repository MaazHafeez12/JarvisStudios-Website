import type { ProcessStepId } from "@/content/process";

// Authored scenes for the four process steps — the visual half of the
// /services timeline (docs/MOTION_REDESIGN.md §5.7).
//
// Same construction and the same rules as ServiceVignette.tsx, deliberately:
// one frame, one stroke weight, one accent, so ten scenes down this page read
// as one family rather than two.
//
// PRODUCT.md:58 records that no client screenshots, product screenshots or
// photography of any kind exist, and PRODUCT.md:61 that imagery for this site
// is to be *authored* as illustrative compositions, clearly generic rather
// than presented as delivered work. These therefore show the kind of artifact
// each stage produces, drawn as structure only. No invented client names, no
// invented metrics, no axis values that could be misread as a claim — the
// Launch monitoring line in particular is shape without scale, the same call
// SaasVignette made.
//
// ANIMATION. Each scene assembles when its layer becomes active. Membership
// of `.pv-1` / `.pv-2` / `.pv-3` sets the order (0 / 90 / 180ms) and the one
// `.vg-accent` element lands last at 300ms — reusing ServiceVignette's accent
// class rather than inventing a second vocabulary for the same idea. All of
// that is CSS keyed on `[data-state="active"]`, in app/globals.css.

const ACCENT = "#00ADEF";

/** Shared canvas. Same 3:2 and inset as ServiceVignette's Frame. */
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

/** Three inputs feeding a short list of findings. One finding is marked. */
function DiscoveryVignette() {
  const inputs = [0, 1, 2];

  return (
    <Frame>
      <g className="pv-1">
        {inputs.map((i) => (
          <g key={i}>
            <rect x="32" y={54 + i * 78} width="128" height="58" rx="6" {...hairSoft} />
            <rect
              x="48"
              y={72 + i * 78}
              width={72 - i * 12}
              height="7"
              rx="2"
              fill="currentColor"
              fillOpacity="0.26"
            />
            <rect
              x="48"
              y={87 + i * 78}
              width={92 - i * 8}
              height="6"
              rx="2"
              fill="currentColor"
              fillOpacity="0.13"
            />
          </g>
        ))}
      </g>

      {/* The three inputs converging on one read of the problem. */}
      <g className="pv-2">
        {inputs.map((i) => (
          <path key={i} d={`M160 ${83 + i * 78} H200 V161 H240`} {...hair} />
        ))}
      </g>

      <g className="pv-3">
        <path d="M264 62 H448" {...hair} />
        <rect x="264" y="80" width="120" height="8" rx="2" fill="currentColor" fillOpacity="0.3" />

        <rect x="264" y="112" width="184" height="6" rx="2" fill="currentColor" fillOpacity="0.15" />
        <rect x="264" y="130" width="152" height="6" rx="2" fill="currentColor" fillOpacity="0.15" />

        {/* The finding that decides the shape of the work. */}
        <g className="vg-accent">
          <rect x="256" y="150" width="2" height="22" rx="1" fill={ACCENT} />
          <rect x="264" y="158" width="168" height="6" rx="2" fill={ACCENT} fillOpacity="0.55" />
        </g>

        <rect x="264" y="186" width="140" height="6" rx="2" fill="currentColor" fillOpacity="0.15" />
        <rect x="264" y="204" width="176" height="6" rx="2" fill="currentColor" fillOpacity="0.15" />
        <rect x="264" y="222" width="112" height="6" rx="2" fill="currentColor" fillOpacity="0.15" />
      </g>
    </Frame>
  );
}

/** Two artboards and the flow between them. The reviewed one is outlined. */
function DesignVignette() {
  return (
    <Frame>
      <g className="pv-1">
        <rect x="28" y="52" width="176" height="216" rx="8" {...hairSoft} />
        <path d="M28 84 H204" {...hairSoft} />
        <rect x="44" y="64" width="44" height="7" rx="2" fill="currentColor" fillOpacity="0.2" />

        <rect x="44" y="104" width="104" height="10" rx="2" fill="currentColor" fillOpacity="0.28" />
        <rect x="44" y="124" width="76" height="10" rx="2" fill="currentColor" fillOpacity="0.28" />
        <rect x="44" y="152" width="144" height="6" rx="2" fill="currentColor" fillOpacity="0.14" />
        <rect x="44" y="166" width="120" height="6" rx="2" fill="currentColor" fillOpacity="0.14" />
        <rect x="44" y="192" width="64" height="20" rx="4" {...hair} />
        <rect x="44" y="228" width="144" height="24" rx="4" fill="currentColor" fillOpacity="0.06" />
      </g>

      {/* Review, then the next state. */}
      <g className="pv-2">
        <path d="M204 160 H276" {...hair} />
        <path d="M268 154 L276 160 L268 166" {...hair} />
      </g>

      <g className="pv-3">
        <rect x="276" y="52" width="176" height="216" rx="8" {...hairSoft} />
        <path d="M276 84 H452" {...hairSoft} />
        <rect x="292" y="64" width="44" height="7" rx="2" fill="currentColor" fillOpacity="0.2" />

        <rect x="292" y="104" width="120" height="10" rx="2" fill="currentColor" fillOpacity="0.28" />
        <rect x="292" y="124" width="88" height="10" rx="2" fill="currentColor" fillOpacity="0.28" />
        <rect x="292" y="152" width="144" height="6" rx="2" fill="currentColor" fillOpacity="0.14" />
        <rect x="292" y="166" width="104" height="6" rx="2" fill="currentColor" fillOpacity="0.14" />
        <rect x="292" y="192" width="64" height="20" rx="4" {...hair} />
        <rect x="292" y="228" width="144" height="24" rx="4" fill="currentColor" fillOpacity="0.06" />
      </g>

      {/* Signed off — the state the build is written against. */}
      <rect
        x="270"
        y="46"
        width="188"
        height="228"
        rx="10"
        stroke={ACCENT}
        strokeWidth="1.5"
        className="vg-accent"
      />
    </Frame>
  );
}

/** A commit spine beside the work it produced. One commit is in flight. */
function BuildVignette() {
  const commits = [72, 122, 172, 222, 272];

  return (
    <Frame>
      <g className="pv-1">
        <path d="M76 56 V284" {...hair} />
        {commits.map((y) => (
          <circle key={y} cx="76" cy={y} r="5" fill="currentColor" fillOpacity="0.22" />
        ))}
        {/* One branch off the spine and back — iteration, not a straight line. */}
        <path d="M76 122 H112 V222 H76" {...hairSoft} />
        <circle cx="112" cy="172" r="4" fill="currentColor" fillOpacity="0.16" />
      </g>

      <g className="pv-2">
        <rect x="164" y="56" width="288" height="228" rx="8" {...hairSoft} />
        <path d="M164 88 H452" {...hairSoft} />
        <rect x="180" y="68" width="52" height="7" rx="2" fill="currentColor" fillOpacity="0.2" />
      </g>

      {/* Indented line lengths: code as shape, never as readable text. */}
      <g className="pv-3">
        {[
          [180, 108, 132],
          [196, 126, 96],
          [196, 144, 116],
          [212, 162, 72],
          [196, 180, 88],
          [180, 198, 148],
          [196, 216, 104],
          [196, 234, 76],
          [180, 252, 120],
        ].map(([x, y, w]) => (
          <rect
            key={`${x}-${y}`}
            x={x}
            y={y}
            width={w}
            height="6"
            rx="2"
            fill="currentColor"
            fillOpacity="0.14"
          />
        ))}
      </g>

      <circle cx="76" cy="172" r="7" fill={ACCENT} className="vg-accent" />
    </Frame>
  );
}

/** What shipped, and the fact that someone is still watching it. */
function LaunchVignette() {
  return (
    <Frame>
      <g className="pv-1">
        <rect x="88" y="40" width="304" height="164" rx="8" {...hair} />
        <path d="M88 70 H392" {...hair} />
        <circle cx="106" cy="55" r="3" fill="currentColor" fillOpacity="0.26" />
        <circle cx="118" cy="55" r="3" fill="currentColor" fillOpacity="0.26" />
        <circle cx="130" cy="55" r="3" fill="currentColor" fillOpacity="0.26" />
      </g>

      <g className="pv-2">
        <rect x="112" y="94" width="140" height="10" rx="2" fill="currentColor" fillOpacity="0.3" />
        <rect x="112" y="114" width="100" height="10" rx="2" fill="currentColor" fillOpacity="0.3" />
        <rect x="112" y="140" width="168" height="6" rx="2" fill="currentColor" fillOpacity="0.14" />
        <rect x="112" y="154" width="132" height="6" rx="2" fill="currentColor" fillOpacity="0.14" />
        <rect x="296" y="94" width="72" height="66" rx="6" fill="currentColor" fillOpacity="0.07" />
      </g>

      {/* Still being watched after handoff. Shape only — no axis, no values,
          nothing that could be read as a result we are claiming. */}
      <g className="pv-3">
        <path d="M88 264 H392" {...hairSoft} />
        <path
          d="M88 250 L140 240 L192 246 L244 230 L296 236 L344 222 L392 228"
          {...hair}
        />
        <rect x="88" y="284" width="96" height="6" rx="2" fill="currentColor" fillOpacity="0.13" />
      </g>

      <g className="vg-accent">
        <rect x="316" y="46" width="60" height="18" rx="9" fill={ACCENT} fillOpacity="0.18" />
        <circle cx="329" cy="55" r="4" fill={ACCENT} />
      </g>
    </Frame>
  );
}

const VIGNETTES: Record<ProcessStepId, () => React.JSX.Element> = {
  discovery: DiscoveryVignette,
  design: DesignVignette,
  build: BuildVignette,
  launch: LaunchVignette,
};

export function ProcessVignette({ step }: { step: ProcessStepId }) {
  const Vignette = VIGNETTES[step];
  return <Vignette />;
}
