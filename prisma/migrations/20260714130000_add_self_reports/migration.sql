-- Periodic life-outcome self-reports (baseline + longitudinal deltas).
-- Matches prisma/schema/self-report.prisma.

-- CreateTable
CREATE TABLE "self_reports" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "metric" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "note" TEXT,
    "isBaseline" BOOLEAN NOT NULL DEFAULT false,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "self_reports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "self_reports_userId_metric_occurredAt_idx" ON "self_reports"("userId", "metric", "occurredAt");
