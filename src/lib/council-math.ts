// Pure, dependency-light math for the Mentor Council. No I/O imports, so it is
// trivially unit-testable and runnable in isolation.

import { clamp01 } from "./scoring";

export interface ConsensusMetrics {
  members: number;
  meanConfidence: number;
  /** 0 = everyone equally confident, 1 = maximally split confidence. */
  confidencePolarization: number;
  /** Mean pairwise textual agreement of recommendations, 0..1. */
  agreement: number;
  /** The "medoid" recommendation — closest to all the others. */
  dominant: string;
}

const STOP = new Set([
  "the", "a", "an", "to", "of", "and", "or", "if", "is", "are", "be", "it", "that",
  "this", "for", "on", "in", "your", "you", "with", "as", "by", "at", "not", "but",
  "should", "would", "could", "do", "does", "than", "then", "into", "only", "more",
]);

export function tokenize(s: string): Set<string> {
  return new Set(
    s
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2 && !STOP.has(w)),
  );
}

export function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 1;
  let inter = 0;
  for (const x of a) if (b.has(x)) inter += 1;
  const union = a.size + b.size - inter;
  return union === 0 ? 0 : inter / union;
}

function stdev(xs: number[]): number {
  if (xs.length < 2) return 0;
  const mean = xs.reduce((s, x) => s + x, 0) / xs.length;
  const v = xs.reduce((s, x) => s + (x - mean) ** 2, 0) / xs.length;
  return Math.sqrt(v);
}

/** Pure: how aligned are the council's recommendations + confidences? */
export function consensusMetrics(
  positions: { persona: string; recommendation: string; confidence: number }[],
): ConsensusMetrics {
  const n = positions.length;
  const confidences = positions.map((p) => clamp01(p.confidence));
  const meanConfidence = n ? confidences.reduce((s, x) => s + x, 0) / n : 0;
  const confidencePolarization = clamp01(2 * stdev(confidences));

  if (n <= 1) {
    return { members: n, meanConfidence, confidencePolarization: 0, agreement: 1, dominant: positions[0]?.recommendation ?? "" };
  }

  const toks = positions.map((p) => tokenize(p.recommendation));
  let pairSum = 0;
  let pairs = 0;
  const totalSim = new Array(n).fill(0);
  for (let i = 0; i < n; i += 1) {
    for (let j = i + 1; j < n; j += 1) {
      const s = jaccard(toks[i], toks[j]);
      pairSum += s;
      pairs += 1;
      totalSim[i] += s;
      totalSim[j] += s;
    }
  }
  const agreement = pairs ? clamp01(pairSum / pairs) : 1;
  let medoid = 0;
  for (let i = 1; i < n; i += 1) if (totalSim[i] > totalSim[medoid]) medoid = i;

  return { members: n, meanConfidence, confidencePolarization, agreement, dominant: positions[medoid].recommendation };
}
