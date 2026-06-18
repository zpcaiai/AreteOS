// ───────────────────────── Healing OS · Crisis resources ─────────────────────────
// A small, OPERATOR-CONFIGURABLE registry of real-world help lines surfaced when
// triage hits orange/red. These numbers were verified at build time but MUST be
// re-checked and localized before any production deployment — set
// HEALING_CRISIS_RESOURCES (JSON) to override per region. The UI ALWAYS tells the
// user to contact their own local emergency number; this list supplements, never
// replaces, that guidance. We make no promises about confidentiality or outcome.

export interface CrisisResource {
  /** ISO-ish region key the resource applies to (e.g. "CN", "US", "INTL"). */
  region: string;
  name: string;
  contact: string; // phone / short-code / URL
  hours?: string;
  note?: string;
}

// Verified June 2026. Sources: China NHC national hotline 12356 (nationwide from
// 2025-05-01); US 988 Suicide & Crisis Lifeline; standard emergency numbers.
const DEFAULT_RESOURCES: CrisisResource[] = [
  { region: "CN", name: "全国心理援助热线 (National Psychological Assistance Hotline)", contact: "12356", hours: "每日 / daily", note: "免费 / free" },
  { region: "CN", name: "紧急医疗 / Medical emergency", contact: "120" },
  { region: "CN", name: "报警 / Police", contact: "110" },
  { region: "US", name: "Suicide & Crisis Lifeline", contact: "988 (call or text)", hours: "24/7" },
  { region: "US", name: "Emergency", contact: "911" },
  { region: "INTL", name: "Find a Helpline (directory by country)", contact: "https://findahelpline.com", note: "Locate a local line in your country" },
];

let cached: CrisisResource[] | null = null;

/** All configured resources (env override → defaults). */
export function allCrisisResources(): CrisisResource[] {
  if (cached) return cached;
  const raw = process.env.HEALING_CRISIS_RESOURCES;
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.every((r) => r && r.name && r.contact)) {
        cached = parsed as CrisisResource[];
        return cached;
      }
    } catch {
      /* fall through to defaults */
    }
  }
  cached = DEFAULT_RESOURCES;
  return cached;
}

/** Resources for a region (best-effort), always including INTL + universal lines. */
export function crisisResourcesFor(locale = "zh-CN"): CrisisResource[] {
  const region = locale.toUpperCase().includes("CN") || locale.toLowerCase().startsWith("zh") ? "CN" : locale.split("-")[1]?.toUpperCase() ?? "US";
  const all = allCrisisResources();
  const local = all.filter((r) => r.region === region);
  const intl = all.filter((r) => r.region === "INTL");
  // If we have nothing region-specific, fall back to everything so the user is never left without options.
  return (local.length ? [...local, ...intl] : all);
}

/** Universal, non-promissory line shown above every crisis resource list. */
export const UNIVERSAL_CRISIS_GUIDANCE = {
  zh: "如果你现在有危险，或可能伤害自己/他人，请立即拨打你所在地的紧急电话，或联系身边可信任的人。你不需要独自面对这一切。",
  en: "If you are in danger now, or might harm yourself or someone else, call your local emergency number right away, or reach out to someone you trust. You do not have to face this alone.",
};
