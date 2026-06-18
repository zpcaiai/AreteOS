"use client";

/**
 * CompanionSprite — a cute little-girl companion ("暖暖") drawn as an inline SVG,
 * with a soft glow, breathing halo, slow dust ring and state-driven expressions.
 * Pure CSS animation, theme-neutral, self-contained (no image asset).
 */

import "./companion.css";

export type CompanionState = "idle" | "listening" | "comforting" | "focus" | "celebrating" | "resting";

const SPARKLES = [0, 60, 120, 180, 240, 300];

const HAIR = "#a06a43";
const HAIR_DK = "#855636";
const SKIN = "#ffe2cf";
const CHEEK = "#ff8aaa";
const EYE = "#3f2d28";
const DRESS = "#818cf8";
const DRESS_DK = "#6366f1";
const STAR = "#ffd166";
const MOUTH = "#c65b6e";

/** Expression-driven eye for the given center x. */
function Eye({ cx, mode }: { cx: number; mode: "open" | "calm" | "closed" | "happy" }) {
  if (mode === "happy") return <path d={`M${cx - 3} 36 Q${cx} 31.7 ${cx + 3} 36`} stroke={EYE} strokeWidth={1.9} fill="none" strokeLinecap="round" />;
  if (mode === "closed") return <path d={`M${cx - 3} 35 Q${cx} 37.9 ${cx + 3} 35`} stroke={EYE} strokeWidth={1.6} fill="none" strokeLinecap="round" />;
  const ry = mode === "calm" ? 3.2 : 5;
  return (
    <g>
      <ellipse cx={cx} cy={35} rx={3.6} ry={ry} fill={EYE} />
      <circle cx={cx + 1.2} cy={32.7} r={1.65} fill="#fff" />
      <circle cx={cx - 1.4} cy={36.8} r={1.05} fill="#ffe1ec" />
      {mode === "calm" && <rect x={cx - 4} y={31} width={8} height={2.3} rx={1} fill={SKIN} />}
    </g>
  );
}

export default function CompanionSprite({ state = "idle", size = 64 }: { state?: CompanionState; size?: number }) {
  const eyeMode = state === "celebrating" ? "happy" : state === "resting" ? "closed" : state === "focus" ? "calm" : "open";
  const mouth =
    state === "celebrating" ? (
      <path d="M33.4 41 Q36 45.8 38.6 41 Q36 42.6 33.4 41 Z" fill={MOUTH} />
    ) : state === "resting" ? (
      <path d="M34.6 41.7 Q36 42.8 37.4 41.7" stroke={MOUTH} strokeWidth={1.2} fill="none" strokeLinecap="round" />
    ) : (
      <path d="M33.4 41 Q36 44.6 38.6 41" stroke={MOUTH} strokeWidth={1.5} fill="none" strokeLinecap="round" />
    );

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      {/* soft blurred glow (color/breath shifts with state) */}
      <div className={`companion-glow companion-glow--${state}`} />

      {/* halo + slow dust ring (decorative, behind the body) */}
      <svg viewBox="0 0 72 72" width={size} height={size} style={{ position: "absolute", inset: 0, overflow: "visible" }} aria-hidden="true">
        <defs>
          <radialGradient id="companionHalo" cx="50%" cy="48%" r="50%">
            <stop offset="52%" stopColor="#ffd9ec" stopOpacity="0" />
            <stop offset="80%" stopColor="#ffd9ec" stopOpacity="0.24" />
            <stop offset="100%" stopColor="#ffd9ec" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle className="companion-halo" cx="36" cy="38" r="33" fill="url(#companionHalo)" />
        <circle className="companion-ring" cx="36" cy="38" r="27" fill="none" stroke="#ffe3f0" strokeOpacity="0.45" strokeWidth="1" strokeDasharray="2 9" strokeLinecap="round" />
      </svg>

      {/* celebration burst */}
      {state === "celebrating" &&
        SPARKLES.map((angle) => (
          <span
            key={angle}
            className="companion-sparkle"
            style={
              {
                "--gx": `${Math.cos((angle * Math.PI) / 180) * (size * 0.56)}px`,
                "--gy": `${Math.sin((angle * Math.PI) / 180) * (size * 0.56)}px`,
                animationDelay: `${(angle / 360) * 0.4}s`,
              } as React.CSSProperties
            }
          />
        ))}

      {/* the little girl */}
      <div className={`companion-body companion-body--${state}`} style={{ position: "relative", width: "100%", height: "100%" }}>
        <svg viewBox="0 0 72 72" width="100%" height="100%" style={{ filter: "drop-shadow(0 2px 5px rgba(0,0,0,0.25))" }} role="img" aria-label="暖暖">
          {/* ahoge (little hair antenna) */}
          <path d="M36 18 q3 -6 6 -3 q-3 0 -4 4 Z" fill={HAIR_DK} />
          {/* back hair */}
          <ellipse cx="36" cy="32" rx="19.5" ry="20.5" fill={HAIR} />
          <path d="M17.5 33 Q14 49 19.5 59 Q24.5 50 24.5 38 Z" fill={HAIR_DK} />
          <path d="M54.5 33 Q58 49 52.5 59 Q47.5 50 47.5 38 Z" fill={HAIR_DK} />

          {/* dress + puff sleeves */}
          <ellipse cx="24" cy="55" rx="5" ry="4.5" fill={DRESS_DK} />
          <ellipse cx="48" cy="55" rx="5" ry="4.5" fill={DRESS_DK} />
          <path d="M26 51 Q36 46 46 51 L50 65 Q36 69 22 65 Z" fill={DRESS} />
          <path d="M31 50 Q36 54 41 50" fill="none" stroke={DRESS_DK} strokeWidth="1.2" />
          <circle cx="36" cy="57" r="1.6" fill={STAR} />

          {/* neck */}
          <rect x="33" y="44" width="6" height="6" rx="2.6" fill={SKIN} />

          {/* face */}
          <ellipse cx="36" cy="34" rx="14.5" ry="15" fill={SKIN} />

          {/* bangs */}
          <path d="M21 32 C 22 19, 50 19, 51 32 C 46.5 25.5, 41 25, 36 28.5 C 31 25, 25.5 25.5, 21 32 Z" fill={HAIR} />
          <path d="M21 31 Q19 42 22 49 Q25.5 43 25 34 Z" fill={HAIR} />
          <path d="M51 31 Q53 42 50 49 Q46.5 43 47 34 Z" fill={HAIR} />

          {/* star hairclip */}
          <path d="M25 24 l1 2 2 .3 -1.5 1.5 .4 2.1 -1.9 -1 -1.9 1 .4 -2.1 -1.5 -1.5 2 -.3 Z" fill={STAR} />

          {/* blush */}
          <ellipse cx="26.5" cy="40.6" rx="3.7" ry="2.5" fill={CHEEK} opacity="0.85" />
          <ellipse cx="45.5" cy="40.6" rx="3.7" ry="2.5" fill={CHEEK} opacity="0.85" />

          {/* brows */}
          <path d="M26.6 29.2 Q30 28 33.4 29" stroke={HAIR_DK} strokeWidth="0.9" fill="none" strokeLinecap="round" opacity="0.7" />
          <path d="M38.6 29 Q42 28 45.4 29.2" stroke={HAIR_DK} strokeWidth="0.9" fill="none" strokeLinecap="round" opacity="0.7" />

          {/* eyes + mouth (expression) */}
          <Eye cx={30} mode={eyeMode} />
          <Eye cx={42} mode={eyeMode} />
          {mouth}
        </svg>
      </div>
    </div>
  );
}
