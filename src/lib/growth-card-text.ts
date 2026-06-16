// Pure composer for the weekly growth card's text. No I/O; unit-testable. Kept
// separate from the service so it can be tested without pulling the DB/engine graph.

export interface CardInput {
  growth: number; // 0..100
  protocol: number; // 0..100
  bottleneck: string | null;
  deepWorkMinutes: number;
  assetsPublished: number;
  capital: number; // 0..100
  identityUnlocked: number;
  identityTotal: number;
}

export interface GrowthCardText {
  headline: string;
  lines: string[];
}

export function composeCardText(d: CardInput): GrowthCardText {
  const lines: string[] = [`Growth score: ${Math.round(d.growth)}`];
  if (d.protocol > 0) lines.push(`Protocol best: ${Math.round(d.protocol)}`);
  if (d.bottleneck) lines.push(`Focus: clear the "${d.bottleneck}" bottleneck`);
  if (d.deepWorkMinutes > 0) lines.push(`Deep work: ${d.deepWorkMinutes} min`);
  if (d.assetsPublished > 0) lines.push(`Assets shipped: ${d.assetsPublished}`);
  lines.push(`Life capital: ${Math.round(d.capital)}`);
  lines.push(`Identity: ${d.identityUnlocked}/${d.identityTotal} unlocked`);
  return { headline: `My growth — score ${Math.round(d.growth)}`, lines };
}

/** One-paragraph form for the share-card image body. */
export function cardBody(text: GrowthCardText): string {
  return text.lines.join("  ·  ");
}
