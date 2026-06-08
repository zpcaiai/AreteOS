// The personal status library users pick from when posting. Tied to the OS's
// operating states (not moods/hype) — what kind of work the person is in.
export interface StatusOption { key: string; label: string; emoji: string }

export const STATUS_LIBRARY: StatusOption[] = [
  { key: "deep_work", label: "深度工作", emoji: "🛠️" },
  { key: "reflecting", label: "在复盘", emoji: "🪞" },
  { key: "modeling", label: "在建模卓越", emoji: "🧭" },
  { key: "deciding", label: "关键决策中", emoji: "⚖️" },
  { key: "learning", label: "精进中", emoji: "📚" },
  { key: "building", label: "在构建", emoji: "🏗️" },
  { key: "exploring", label: "探索方向", emoji: "🔭" },
  { key: "teaching", label: "在传授", emoji: "🎓" },
  { key: "shadow_work", label: "面对阴影", emoji: "🌑" },
  { key: "resting", label: "休整恢复", emoji: "🌙" },
];

const MAP = new Map(STATUS_LIBRARY.map((s) => [s.key, s]));
export function statusLabel(key: string): string {
  const s = MAP.get(key);
  return s ? `${s.emoji} ${s.label}` : key || "—";
}
export const STATUS_KEYS = STATUS_LIBRARY.map((s) => s.key);
