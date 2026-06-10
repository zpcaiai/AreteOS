import { prisma } from "./db";

/** Append a domain event (event sourcing). Fire-and-forget friendly. */
export async function emit(params: {
  userId: string;
  aggregateType: string;
  aggregateId: string;
  type: string;
  payload?: unknown;
}): Promise<void> {
  await prisma.domainEvent.create({
    data: {
      userId: params.userId,
      aggregateType: params.aggregateType,
      aggregateId: params.aggregateId,
      type: params.type,
      payload: (params.payload ?? {}) as object,
    },
  });
}

export async function replayEvents(params: {
  userId: string;
  until?: Date;
  aggregateType?: string;
  aggregateId?: string;
}) {
  const events = await prisma.domainEvent.findMany({
    where: {
      userId: params.userId,
      ...(params.until ? { occurredAt: { lte: params.until } } : {}),
      ...(params.aggregateType ? { aggregateType: params.aggregateType } : {}),
      ...(params.aggregateId ? { aggregateId: params.aggregateId } : {}),
    },
    orderBy: { occurredAt: "asc" },
  });

  const aggregates = new Map<string, { aggregateType: string; aggregateId: string; eventCount: number; lastEventAt: Date | null; types: Record<string, number> }>();
  for (const event of events) {
    const key = `${event.aggregateType}:${event.aggregateId}`;
    const current =
      aggregates.get(key) ??
      { aggregateType: event.aggregateType, aggregateId: event.aggregateId, eventCount: 0, lastEventAt: null, types: {} };
    current.eventCount += 1;
    current.lastEventAt = event.occurredAt;
    current.types[event.type] = (current.types[event.type] ?? 0) + 1;
    aggregates.set(key, current);
  }

  return {
    until: params.until ?? null,
    eventCount: events.length,
    aggregates: Array.from(aggregates.values()),
    events,
  };
}
