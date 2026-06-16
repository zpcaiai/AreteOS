// N-of-1 experiment statistics. Turns a baseline vs intervention sample into a
// causal-ish readout: effect size (Cohen's d), Welch's t, an approximate two-
// sided p, and a plain-language verdict. Pure + testable. The p is a normal
// approximation — honest enough for personal experiments, labelled `pApprox`.

export function mean(xs: number[]): number {
  return xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : 0;
}

/** Sample variance (n-1). 0 for fewer than 2 points. */
export function variance(xs: number[]): number {
  if (xs.length < 2) return 0;
  const m = mean(xs);
  return xs.reduce((s, x) => s + (x - m) ** 2, 0) / (xs.length - 1);
}

/** Standard normal CDF (Abramowitz & Stegun 7.1.26). */
export function normalCdf(x: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989422804014327 * Math.exp((-x * x) / 2);
  let p = d * t * (0.319381530 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
  p = 1 - p;
  return x >= 0 ? p : 1 - p;
}

export type Verdict = "insufficient-data" | "no-effect" | "inconclusive" | "promising" | "strong";

export interface Readout {
  nBaseline: number;
  nIntervention: number;
  meanBaseline: number;
  meanIntervention: number;
  meanDiff: number;
  cohensD: number;
  t: number;
  df: number;
  pApprox: number;
  direction: "increase" | "decrease" | "none";
  verdict: Verdict;
}

export function cohensD(a: number[], b: number[]): number {
  const na = a.length;
  const nb = b.length;
  if (na < 1 || nb < 1) return 0;
  const va = variance(a);
  const vb = variance(b);
  const diff = mean(b) - mean(a);
  const pooled = na + nb > 2 ? Math.sqrt(((na - 1) * va + (nb - 1) * vb) / (na + nb - 2)) : 0;
  if (pooled === 0) return diff === 0 ? 0 : Math.sign(diff) * Infinity;
  return diff / pooled;
}

export function readout(baseline: number[], intervention: number[]): Readout {
  const na = baseline.length;
  const nb = intervention.length;
  const ma = mean(baseline);
  const mb = mean(intervention);
  const meanDiff = mb - ma;
  const va = variance(baseline);
  const vb = variance(intervention);

  const se = Math.sqrt(va / Math.max(na, 1) + vb / Math.max(nb, 1));
  let t = 0;
  let df = 0;
  if (se > 0) {
    t = meanDiff / se;
    const num = (va / na + vb / nb) ** 2;
    const den = (va / na) ** 2 / Math.max(na - 1, 1) + (vb / nb) ** 2 / Math.max(nb - 1, 1);
    df = den > 0 ? num / den : na + nb - 2;
  } else if (meanDiff !== 0) {
    t = Math.sign(meanDiff) * Infinity;
    df = na + nb - 2;
  }
  const pApprox = Number.isFinite(t) ? Math.min(1, Math.max(0, 2 * (1 - normalCdf(Math.abs(t))))) : 0;
  const d = cohensD(baseline, intervention);
  const absD = Math.abs(d);

  let verdict: Verdict;
  if (na < 3 || nb < 3) verdict = "insufficient-data";
  else if (absD < 0.2) verdict = "no-effect";
  else if (pApprox < 0.05 && absD >= 0.5) verdict = "strong";
  else if (pApprox < 0.1 && absD >= 0.2) verdict = "promising";
  else verdict = "inconclusive";

  const direction = meanDiff > 1e-9 ? "increase" : meanDiff < -1e-9 ? "decrease" : "none";

  return { nBaseline: na, nIntervention: nb, meanBaseline: ma, meanIntervention: mb, meanDiff, cohensD: d, t, df, pApprox, direction, verdict };
}
