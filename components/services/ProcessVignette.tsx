import type { ProcessStepId } from "@/content/process";
import {
  ACCENT,
  ACCENT_TEXT,
  Frame,
  Glyph,
  Label,
  SceneImage,
  Surface,
  TextRun,
  hair,
  hairSoft,
} from "./vignette-kit";

// Authored scenes for the four process steps — the visual half of the
// /services timeline (docs/MOTION_REDESIGN.md §5.7).
//
// Same construction and the same rules as ServiceVignette.tsx, deliberately:
// one frame, one stroke weight, one accent, so ten scenes down this page read
// as one family rather than two. Both files draw from vignette-kit.tsx.
//
// PRODUCT.md:58 records that no client screenshots, product screenshots or
// photography of any kind exist, and PRODUCT.md:61 that imagery for this site
// is to be *authored* as illustrative compositions, clearly generic rather
// than presented as delivered work. These therefore show the kind of artifact
// each stage produces. No invented client names, no invented metrics, no axis
// values that could be misread as a claim — the Launch monitoring line in
// particular is shape without scale, the same call SaasVignette made.
//
// ANIMATION. Each scene assembles when its layer becomes active. Membership
// of `.pv-1` / `.pv-2` / `.pv-3` sets the order (0 / 90 / 180ms) and the one
// `.vg-accent` element lands last at 300ms — reusing ServiceVignette's accent
// class rather than inventing a second vocabulary for the same idea. All of
// that is CSS keyed on `[data-state="active"]`, in app/globals.css. Keep new
// elements inside one of those three groups or they arrive unsequenced.

/** Real screenshots when they exist. Empty on purpose — see ServiceVignette. */
const SCENE_IMAGES: Partial<Record<ProcessStepId, string>> = {};

/** Three inputs feeding a short list of findings. One finding is marked. */
function DiscoveryVignette() {
  const inputs = [
    { glyph: "user", label: "Stakeholders" },
    { glyph: "chart", label: "Analytics" },
    { glyph: "inbox", label: "Support inbox" },
  ] as const;
  const findings = [104, 130, 182, 208];

  return (
    <>
      <g className="pv-1">
        {inputs.map((input, i) => {
          const y = 54 + i * 78;
          return (
            <g key={input.label}>
              <Surface x={32} y={y} width={128} height={58} rx={6} />
              <Glyph name={input.glyph} x={46} y={y + 12} size={14} opacity={0.42} />
              <Label x={68} y={y + 23} size={9.5} weight={600}>
                {input.label}
              </Label>
              <TextRun x={46} y={y + 34} width={96 - i * 8} />
              <TextRun x={46} y={y + 45} width={68 + i * 10} height={5} opacity={0.12} />
            </g>
          );
        })}
      </g>

      {/* The three inputs converging on one read of the problem. */}
      <g className="pv-2">
        {inputs.map((input, i) => (
          <path key={input.label} d={`M160 ${83 + i * 78} H200 V161 H240`} {...hair} />
        ))}
      </g>

      <g className="pv-3">
        <Label x={264} y={48} size={8.5} tone="muted" tracking={1}>
          FINDINGS
        </Label>
        <path d="M264 62 H448" {...hair} />
        <Label x={264} y={88} size={12} weight={600} tone="primary">
          What&rsquo;s actually in the way
        </Label>

        {findings.map((y, i) => (
          <g key={y}>
            <Glyph name="check" x={264} y={y - 9} size={11} opacity={0.28} />
            <TextRun x={282} y={y - 5} width={[166, 134, 148, 112][i]} />
          </g>
        ))}

        {/* The finding that decides the shape of the work. */}
        <g className="vg-accent">
          <rect x="256" y="142" width="192" height="28" rx="5" fill={ACCENT} fillOpacity="0.1" />
          <rect x="256" y="142" width="3" height="28" rx="1.5" fill={ACCENT} />
          <Glyph name="check" x={268} y={150} size={11} opacity={1} color={ACCENT_TEXT} />
          <Label x={286} y={160} size={9} weight={600} tone="accent">
            The one that changes scope
          </Label>
        </g>
      </g>
    </>
  );
}

/** Two artboards and the flow between them. The reviewed one is outlined. */
function DesignVignette() {
  const artboard = (x: number, state: string, heading: string) => (
    <>
      <Surface x={x} y={52} width={176} height={216} rx={8} />
      <path d={`M${x} 84 H${x + 176}`} {...hairSoft} />
      <Label x={x + 16} y={73} size={9} tone="muted">
        {state}
      </Label>

      <Label x={x + 16} y={116} size={13} weight={600} tone="primary">
        {heading}
      </Label>
      <TextRun x={x + 16} y={128} width={144} />
      <TextRun x={x + 16} y={142} width={112} />

      <Surface x={x + 16} y={162} width={64} height={20} rx={4} level="inset" border="none" />
      <Label x={x + 48} y={176} size={8} weight={600} anchor="middle" tone="muted">
        Action
      </Label>

      <Surface x={x + 16} y={196} width={144} height={56} rx={5} level="inset" border="none" />
      <circle cx={x + 44} cy={216} r="7" fill="currentColor" fillOpacity="0.18" />
      <path
        d={`M${x + 16} 252 L${x + 56} 218 L${x + 84} 238 L${x + 108} 222 L${x + 160} 252 Z`}
        fill="currentColor"
        fillOpacity="0.14"
      />
    </>
  );

  return (
    <>
      <g className="pv-1">{artboard(28, "Draft", "Homepage")}</g>

      {/* Review, then the next state. */}
      <g className="pv-2">
        <path d="M204 160 H276" {...hair} />
        <path d="M268 154 L276 160 L268 166" {...hair} />
      </g>

      <g className="pv-3">{artboard(276, "Signed off", "Homepage")}</g>

      {/* Signed off — the state the build is written against. */}
      <g className="vg-accent">
        <rect
          x="270"
          y="46"
          width="188"
          height="228"
          rx="10"
          stroke={ACCENT}
          strokeWidth="1.5"
        />
        <rect x="362" y="60" width="82" height="18" rx="9" fill={ACCENT} fillOpacity="0.18" />
        <Glyph name="check" x={370} y={64} size={10} opacity={1} color={ACCENT_TEXT} />
        <Label x={386} y={73} size={8.5} weight={600} tone="accent">
          Approved
        </Label>
      </g>
    </>
  );
}

/** A commit spine beside the work it produced. One commit is in flight. */
function BuildVignette() {
  const commits = [
    { y: 72, label: "Scaffold" },
    { y: 122, label: "Feature" },
    { y: 172, label: "In review" },
    { y: 222, label: "Fixes" },
    { y: 272, label: "Release" },
  ];
  // Code as shape, never as readable text — indent, then a "keyword" run and
  // the rest of the line at a lower weight.
  const code = [
    [0, 26, 74],
    [12, 34, 52],
    [12, 30, 68],
    [24, 22, 40],
    [12, 28, 46],
    [0, 36, 86],
    [12, 24, 62],
    [12, 30, 38],
    [0, 32, 70],
  ];

  return (
    <>
      <g className="pv-1">
        <path d="M76 56 V284" {...hair} />
        {commits.map((commit) => (
          <g key={commit.y}>
            <circle cx="76" cy={commit.y} r="5" fill="currentColor" fillOpacity="0.22" />
            <Label x={64} y={commit.y + 3} size={8} anchor="end" tone="muted">
              {commit.label}
            </Label>
          </g>
        ))}
        {/* One branch off the spine and back — iteration, not a straight line. */}
        <path d="M76 122 H112 V222 H76" {...hairSoft} />
        <circle cx="112" cy="172" r="4" fill="currentColor" fillOpacity="0.16" />
      </g>

      <g className="pv-2">
        <Surface x={164} y={56} width={288} height={228} rx={8} />
        <path d="M164 88 H452" {...hairSoft} />
        <Label x={180} y={77} size={9} weight={600} tone="primary">
          index.tsx
        </Label>
        <Label x={244} y={77} size={9} tone="muted">
          styles.css
        </Label>
      </g>

      <g className="pv-3">
        {code.map(([indent, keyword, rest], i) => {
          const y = 112 + i * 18;
          return (
            <g key={y}>
              <Label x={186} y={y + 5} size={7.5} anchor="end" tone="muted">
                {i + 1}
              </Label>
              <TextRun x={198 + indent} y={y} width={keyword} opacity={0.26} />
              <TextRun x={198 + indent + keyword + 8} y={y} width={rest} opacity={0.13} />
            </g>
          );
        })}
      </g>

      <g className="vg-accent">
        <circle cx="76" cy="172" r="7" fill={ACCENT} />
        <Label x={64} y={175} size={8} weight={600} anchor="end" tone="accent">
          In review
        </Label>
      </g>
    </>
  );
}

/** What shipped, and the fact that someone is still watching it. */
function LaunchVignette() {
  return (
    <>
      <g className="pv-1">
        <Surface x={88} y={40} width={304} height={164} rx={8} border="hair" />
        <path d="M88 70 H392" {...hair} />
        <circle cx="106" cy="55" r="3" fill="currentColor" fillOpacity="0.26" />
        <circle cx="118" cy="55" r="3" fill="currentColor" fillOpacity="0.26" />
        <circle cx="130" cy="55" r="3" fill="currentColor" fillOpacity="0.26" />
      </g>

      <g className="pv-2">
        <Label x={112} y={108} size={14} weight={600} tone="primary">
          You&rsquo;re live.
        </Label>
        <TextRun x={112} y={122} width={168} />
        <TextRun x={112} y={136} width={132} />
        <Surface x={112} y={158} width={72} height={22} rx={4} level="inset" border="none" />
        <Label x={148} y={173} size={8.5} weight={600} anchor="middle" tone="muted">
          View site
        </Label>
        <Surface x={292} y={92} width={76} height={72} rx={5} level="inset" border="none" />
        <circle cx="312" cy="112" r="7" fill="currentColor" fillOpacity="0.18" />
        <path d="M292 164 L322 132 L344 150 L368 132 L368 164 Z" fill="currentColor" fillOpacity="0.14" />
      </g>

      {/* Still being watched after handoff. Shape only — no axis, no values,
          nothing that could be read as a result we are claiming. */}
      <g className="pv-3">
        <Label x={88} y={234} size={9} weight={600}>
          Uptime and errors
        </Label>
        <path
          d="M88 264 L140 254 L192 260 L244 244 L296 250 L344 236 L392 242"
          {...hair}
        />
        <path d="M88 276 H392" {...hairSoft} />
        <Label x={88} y={294} size={8.5} tone="muted">
          Watched after handoff
        </Label>
      </g>

      <g className="vg-accent">
        <rect x="306" y="46" width="70" height="18" rx="9" fill={ACCENT} fillOpacity="0.18" />
        <circle cx="319" cy="55" r="4" fill={ACCENT} />
        <Label x={330} y={58} size={8.5} weight={600} tone="accent">
          Live
        </Label>
      </g>
    </>
  );
}

const VIGNETTES: Record<ProcessStepId, () => React.JSX.Element> = {
  discovery: DiscoveryVignette,
  design: DesignVignette,
  build: BuildVignette,
  launch: LaunchVignette,
};

export function ProcessVignette({ step }: { step: ProcessStepId }) {
  const src = SCENE_IMAGES[step];
  const Vignette = VIGNETTES[step];

  return <Frame>{src ? <SceneImage src={src} /> : <Vignette />}</Frame>;
}
