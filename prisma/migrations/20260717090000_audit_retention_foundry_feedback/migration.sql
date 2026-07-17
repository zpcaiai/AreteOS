ALTER TABLE "foundry_workspaces"
ADD COLUMN "templateVersion" INTEGER NOT NULL DEFAULT 1;

CREATE TABLE "security_audit_events" (
    "id" TEXT NOT NULL,
    "actorId" TEXT,
    "action" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT,
    "outcome" TEXT NOT NULL DEFAULT 'success',
    "metadata" JSONB,
    "requestId" TEXT,
    "ipHash" TEXT,
    "userAgent" TEXT,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "security_audit_events_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "security_audit_events_actorId_occurredAt_idx" ON "security_audit_events"("actorId", "occurredAt");
CREATE INDEX "security_audit_events_action_occurredAt_idx" ON "security_audit_events"("action", "occurredAt");
CREATE INDEX "security_audit_events_targetType_targetId_occurredAt_idx" ON "security_audit_events"("targetType", "targetId", "occurredAt");

CREATE TABLE "workspace_template_feedback" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "templateVersion" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "outcome" TEXT NOT NULL DEFAULT '',
    "comment" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "workspace_template_feedback_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "workspace_template_feedback_userId_workspaceId_key" ON "workspace_template_feedback"("userId", "workspaceId");
CREATE INDEX "workspace_template_feedback_templateId_templateVersion_createdAt_idx" ON "workspace_template_feedback"("templateId", "templateVersion", "createdAt");
ALTER TABLE "workspace_template_feedback" ADD CONSTRAINT "workspace_template_feedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "workspace_template_feedback" ADD CONSTRAINT "workspace_template_feedback_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "foundry_workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;
