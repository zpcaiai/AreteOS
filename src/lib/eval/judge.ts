export interface JudgeVerdict { score: number; reason: string }

/** Invalid or absent evidence always fails the judge gate. */
export function parseJudgeVerdict(raw: string): JudgeVerdict {
  try {
    const value: unknown = JSON.parse(raw);
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      const verdict = value as Record<string, unknown>;
      if (typeof verdict.score === "number" && Number.isInteger(verdict.score)
        && verdict.score >= 1 && verdict.score <= 5
        && typeof verdict.reason === "string" && verdict.reason.trim()) {
        return { score: verdict.score, reason: verdict.reason.trim() };
      }
    }
    return { score: 0, reason: "Judge returned an invalid score or missing reason" };
  } catch {
    return { score: 0, reason: "Judge returned invalid JSON" };
  }
}
