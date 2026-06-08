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
