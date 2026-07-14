-- Product telemetry: append-only analytics events (activation, retention, page views).
-- Matches prisma/schema/analytics.prisma. Denormalized (no FK to users) to keep it a
-- lightweight high-write log; application code writes best-effort and never blocks on it.

-- CreateTable
CREATE TABLE "analytics_events" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "props" JSONB,
    "sessionId" TEXT,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analytics_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "analytics_events_userId_occurredAt_idx" ON "analytics_events"("userId", "occurredAt");

-- CreateIndex
CREATE INDEX "analytics_events_name_occurredAt_idx" ON "analytics_events"("name", "occurredAt");
