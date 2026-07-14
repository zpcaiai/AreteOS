// Product telemetry — activation / first-meaningful-action / weekly-retained use /
// time-to-value. This is the instrumentation the product needs to *measure* stickiness
// before trying to improve it.
//
// Design principles:
//  • Best-effort: every write is wrapped so telemetry can NEVER break a product path
//    (a missing table before the migration, or a DB blip, is swallowed and logged).
//  • Decoupled: uses raw SQL against `analytics_events` (see prisma/schema/analytics.prisma)
//    so it doesn't couple callers to the generated Prisma model.
//  • Privacy-respecting: store event names + small structured props, not message content.

import { prisma } from "./db";
import { reportError } from "./logger";

/** Event names the browser client is allowed to emit (server may emit anything). */
export const CLIENT_EVENTS = [
  "page_view",
  "cta_click",
  "engine_run",
  "today_action",
  "nav_mode",
  "onboarding_step",
  "upgrade_view",
  "upgrade_click",
] as const;
export type ClientEvent = (typeof CLIENT_EVENTS)[number];

export interface TrackInput {
  userId: string;
  name: string;
  props?: Record<string, unknown> | null;
  sessionId?: string | null;
}

/** Append one analytics event. Never throws. */
export async function track({ userId, name, props, sessionId }: TrackInput): Promise<void> {
  try {
    const id = globalThis.crypto?.randomUUID?.() ?? `evt_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const propsJson = props == null ? null : JSON.stringify(props);
    await prisma.$executeRaw`
      INSERT INTO analytics_events ("id", "userId", "name", "props", "sessionId", "occurredAt")
      VALUES (${id}, ${userId}, ${name}, ${propsJson}::jsonb, ${sessionId ?? null}, now())
    `;
  } catch (e) {
    // Telemetry is best-effort: log and move on, never surface to the user.
    reportError(e, { surface: "telemetry", event: name });
  }
}

/**
 * Record the user's first meaningful action exactly once. "Activation" is defined as
 * completing a real unit of work (a reflection, a decision review, a finished protocol
 * step) — not merely signing up. Idempotent.
 */
export async function recordFirstMeaningfulAction(userId: string, kind: string): Promise<void> {
  try {
    const rows = await prisma.$queryRaw<{ n: bigint }[]>`
      SELECT count(*)::bigint AS n FROM analytics_events
      WHERE "userId" = ${userId} AND "name" = 'first_meaningful_action'
    `;
    if (Number(rows[0]?.n ?? 0) > 0) return;
    await track({ userId, name: "first_meaningful_action", props: { kind } });
  } catch (e) {
    reportError(e, { surface: "telemetry", event: "first_meaningful_action" });
  }
}

export interface TelemetrySummary {
  windowDays: number;
  knownUsers: number;         // distinct users with any event ever
  activatedUsers: number;     // distinct users with a first_meaningful_action
  activationRate: number;     // activated / known (0..1)
  weeklyActiveUsers: number;  // distinct users with any event in the window
  topEvents: { name: string; count: number }[];
}

/** Aggregate funnel/retention metrics. Read-only; returns zeros if the table is absent. */
export async function telemetrySummary(windowDays = 7): Promise<TelemetrySummary> {
  const empty: TelemetrySummary = { windowDays, knownUsers: 0, activatedUsers: 0, activationRate: 0, weeklyActiveUsers: 0, topEvents: [] };
  try {
    const [known, activated, wau, top] = await Promise.all([
      prisma.$queryRaw<{ n: bigint }[]>`SELECT count(DISTINCT "userId")::bigint AS n FROM analytics_events`,
      prisma.$queryRaw<{ n: bigint }[]>`SELECT count(DISTINCT "userId")::bigint AS n FROM analytics_events WHERE "name" = 'first_meaningful_action'`,
      prisma.$queryRaw<{ n: bigint }[]>`SELECT count(DISTINCT "userId")::bigint AS n FROM analytics_events WHERE "occurredAt" > now() - (${windowDays} * interval '1 day')`,
      prisma.$queryRaw<{ name: string; n: bigint }[]>`
        SELECT "name", count(*)::bigint AS n FROM analytics_events
        WHERE "occurredAt" > now() - (${windowDays} * interval '1 day')
        GROUP BY "name" ORDER BY n DESC LIMIT 12
      `,
    ]);
    const knownUsers = Number(known[0]?.n ?? 0);
    const activatedUsers = Number(activated[0]?.n ?? 0);
    return {
      windowDays,
      knownUsers,
      activatedUsers,
      activationRate: knownUsers ? activatedUsers / knownUsers : 0,
      weeklyActiveUsers: Number(wau[0]?.n ?? 0),
      topEvents: top.map((r) => ({ name: r.name, count: Number(r.n) })),
    };
  } catch (e) {
    reportError(e, { surface: "telemetry", event: "summary" });
    return empty;
  }
}
