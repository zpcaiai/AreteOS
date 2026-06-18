-- Healing OS (Robot Dilts): 16 tables, generated to match prisma/schema/healing.prisma

-- CreateTable
CREATE TABLE "safety_triage_events" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "inputMessage" TEXT NOT NULL,
    "riskLevel" TEXT NOT NULL,
    "riskDomains" JSONB NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "detectedSignals" JSONB NOT NULL,
    "recommendedRoute" TEXT NOT NULL,
    "userFacingMessage" TEXT NOT NULL,
    "allowedNextSkills" JSONB NOT NULL,
    "blockedSkills" JSONB NOT NULL,
    "safetyPlan" JSONB,
    "overridden" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "safety_triage_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mental_state_intakes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "freeText" TEXT,
    "ratings" JSONB,
    "checkboxes" JSONB,
    "summary" TEXT NOT NULL,
    "primaryConcerns" JSONB NOT NULL,
    "emotionalProfile" JSONB NOT NULL,
    "functionalImpact" JSONB NOT NULL,
    "maintainingLoops" JSONB NOT NULL,
    "suggestedNextSkills" JSONB NOT NULL,
    "riskLevelAtIntake" TEXT NOT NULL DEFAULT 'green',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mental_state_intakes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dilts_clinical_formulations" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "intakeId" TEXT,
    "problemStatement" TEXT NOT NULL,
    "depth" TEXT NOT NULL DEFAULT 'standard',
    "diltsMap" JSONB NOT NULL,
    "fiveP" JSONB NOT NULL,
    "causalLoop" JSONB NOT NULL,
    "formulationSummary" TEXT NOT NULL,
    "recommendedInterventionPath" JSONB NOT NULL,
    "cautions" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dilts_clinical_formulations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "healing_practice_tasks" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "sourceId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "steps" JSONB NOT NULL,
    "difficulty" TEXT NOT NULL DEFAULT 'easy',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "completionMetric" TEXT NOT NULL DEFAULT '',
    "scheduledFor" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "reflection" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "healing_practice_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "healing_core_belief_records" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "formulationId" TEXT,
    "intakeId" TEXT,
    "problemStatement" TEXT NOT NULL,
    "extractedBeliefs" JSONB NOT NULL,
    "primaryBeliefPattern" JSONB NOT NULL,
    "reconstructedBeliefs" JSONB NOT NULL,
    "behavioralExperiments" JSONB NOT NULL,
    "identitySeeds" JSONB NOT NULL,
    "cautions" JSONB NOT NULL,
    "nextRecommendedSkills" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "healing_core_belief_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "healing_cbt_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "situation" TEXT NOT NULL,
    "relatedBeliefRecordId" TEXT,
    "formulationId" TEXT,
    "cbtMap" JSONB NOT NULL,
    "cognitiveDistortions" JSONB NOT NULL,
    "evidenceCheck" JSONB NOT NULL,
    "alternativeThoughts" JSONB NOT NULL,
    "behaviorPlan" JSONB NOT NULL,
    "reflectionQuestions" JSONB NOT NULL,
    "nextRecommendedSkills" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "healing_cbt_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "healing_emotion_regulation_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "currentEmotionText" TEXT NOT NULL,
    "emotions" JSONB,
    "bodySignals" JSONB,
    "urges" JSONB,
    "context" JSONB,
    "emotionalStateMap" JSONB NOT NULL,
    "recommendedSkillSet" JSONB NOT NULL,
    "interventionPlan" JSONB NOT NULL,
    "actProcess" JSONB,
    "dbtProcess" JSONB,
    "practiceTask" JSONB NOT NULL,
    "reflectionQuestions" JSONB NOT NULL,
    "nextRecommendedSkills" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "healing_emotion_regulation_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "healing_stabilization_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "currentExperience" TEXT NOT NULL,
    "symptoms" JSONB,
    "bodySignals" JSONB,
    "orientation" JSONB,
    "stabilizationAssessment" JSONB NOT NULL,
    "userFacingValidation" TEXT NOT NULL,
    "immediateProtocol" JSONB NOT NULL,
    "groundingPlan" JSONB NOT NULL,
    "flashbackPlan" JSONB,
    "dissociationPlan" JSONB,
    "supportPlan" JSONB,
    "nextAllowedSkills" JSONB NOT NULL,
    "blockedSkills" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "healing_stabilization_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "healing_parts_work_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "currentConflict" TEXT NOT NULL,
    "relatedFormulationId" TEXT,
    "relatedBeliefRecordId" TEXT,
    "partsMap" JSONB NOT NULL,
    "internalConflictSummary" JSONB NOT NULL,
    "healthyAdultResponse" JSONB NOT NULL,
    "innerDialogueScript" JSONB NOT NULL,
    "practiceTask" JSONB NOT NULL,
    "nextRecommendedSkills" JSONB NOT NULL,
    "cautions" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "healing_parts_work_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "healing_exposure_plans" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "avoidanceProblem" TEXT NOT NULL,
    "relatedCBTSessionId" TEXT,
    "relatedBeliefRecordId" TEXT,
    "relatedFormulationId" TEXT,
    "blocked" BOOLEAN NOT NULL DEFAULT false,
    "blockReason" TEXT,
    "avoidanceLoop" JSONB,
    "exposureType" TEXT,
    "hierarchy" JSONB,
    "selectedExperiment" JSONB,
    "reflectionTemplate" JSONB,
    "practiceTask" JSONB,
    "nextRecommendedSkills" JSONB,
    "cautions" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "healing_exposure_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "healing_exposure_attempts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "exposurePlanId" TEXT NOT NULL,
    "hierarchyLevel" INTEGER NOT NULL,
    "beforeDistress" INTEGER,
    "peakDistress" INTEGER,
    "afterDistress" INTEGER,
    "actualOutcome" TEXT,
    "learningStatement" TEXT,
    "safetyBehaviorsUsed" JSONB,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "healing_exposure_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "healing_identity_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "currentIdentityPain" TEXT NOT NULL,
    "relatedFormulationId" TEXT,
    "relatedBeliefRecordId" TEXT,
    "identityMap" JSONB NOT NULL,
    "missionRecovery" JSONB NOT NULL,
    "dailyEvidencePlan" JSONB NOT NULL,
    "identityPracticeTask" JSONB NOT NULL,
    "integrationSummary" TEXT NOT NULL,
    "nextRecommendedSkills" JSONB NOT NULL,
    "cautions" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "healing_identity_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "healing_identity_evidence" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "identitySessionId" TEXT,
    "identityStatement" TEXT NOT NULL,
    "evidenceAction" TEXT NOT NULL,
    "userReflection" TEXT,
    "evidenceStrength" INTEGER,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "healing_identity_evidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "healing_timeline_reports" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "timeRangeFrom" TIMESTAMP(3) NOT NULL,
    "timeRangeTo" TIMESTAMP(3) NOT NULL,
    "reportMode" TEXT NOT NULL,
    "timelineSummary" JSONB NOT NULL,
    "timelineEvents" JSONB NOT NULL,
    "progressMetrics" JSONB NOT NULL,
    "patternChanges" JSONB NOT NULL,
    "growthEvidence" JSONB NOT NULL,
    "stuckPoints" JSONB NOT NULL,
    "nextStepRecommendations" JSONB NOT NULL,
    "userFacingWeeklyReport" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "healing_timeline_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "healing_relapse_plans" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionId" TEXT,
    "mode" TEXT NOT NULL,
    "currentConcern" TEXT,
    "relapseRiskMap" JSONB NOT NULL,
    "ifThenPlans" JSONB NOT NULL,
    "recoveryProtocol" JSONB NOT NULL,
    "supportSystemPlan" JSONB NOT NULL,
    "identityMaintenance" JSONB NOT NULL,
    "practiceMaintenancePlan" JSONB NOT NULL,
    "relapseReviewTemplate" JSONB NOT NULL,
    "nextRecommendedSkills" JSONB NOT NULL,
    "cautions" JSONB NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "healing_relapse_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "healing_relapse_checkins" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionId" TEXT,
    "planId" TEXT,
    "signals" JSONB NOT NULL,
    "riskLevel" TEXT NOT NULL,
    "actionTaken" JSONB,
    "userReflection" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "healing_relapse_checkins_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "safety_triage_events_userId_createdAt_idx" ON "safety_triage_events"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "safety_triage_events_sessionId_idx" ON "safety_triage_events"("sessionId");

-- CreateIndex
CREATE INDEX "safety_triage_events_riskLevel_idx" ON "safety_triage_events"("riskLevel");

-- CreateIndex
CREATE INDEX "mental_state_intakes_userId_createdAt_idx" ON "mental_state_intakes"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "mental_state_intakes_sessionId_idx" ON "mental_state_intakes"("sessionId");

-- CreateIndex
CREATE INDEX "dilts_clinical_formulations_userId_createdAt_idx" ON "dilts_clinical_formulations"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "dilts_clinical_formulations_sessionId_idx" ON "dilts_clinical_formulations"("sessionId");

-- CreateIndex
CREATE INDEX "dilts_clinical_formulations_intakeId_idx" ON "dilts_clinical_formulations"("intakeId");

-- CreateIndex
CREATE INDEX "healing_practice_tasks_userId_status_idx" ON "healing_practice_tasks"("userId", "status");

-- CreateIndex
CREATE INDEX "healing_practice_tasks_userId_createdAt_idx" ON "healing_practice_tasks"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "healing_practice_tasks_sessionId_idx" ON "healing_practice_tasks"("sessionId");

-- CreateIndex
CREATE INDEX "healing_practice_tasks_sourceType_sourceId_idx" ON "healing_practice_tasks"("sourceType", "sourceId");

-- CreateIndex
CREATE INDEX "healing_core_belief_records_userId_createdAt_idx" ON "healing_core_belief_records"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "healing_core_belief_records_sessionId_idx" ON "healing_core_belief_records"("sessionId");

-- CreateIndex
CREATE INDEX "healing_core_belief_records_formulationId_idx" ON "healing_core_belief_records"("formulationId");

-- CreateIndex
CREATE INDEX "healing_cbt_sessions_userId_createdAt_idx" ON "healing_cbt_sessions"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "healing_cbt_sessions_sessionId_idx" ON "healing_cbt_sessions"("sessionId");

-- CreateIndex
CREATE INDEX "healing_cbt_sessions_relatedBeliefRecordId_idx" ON "healing_cbt_sessions"("relatedBeliefRecordId");

-- CreateIndex
CREATE INDEX "healing_emotion_regulation_sessions_userId_createdAt_idx" ON "healing_emotion_regulation_sessions"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "healing_emotion_regulation_sessions_sessionId_idx" ON "healing_emotion_regulation_sessions"("sessionId");

-- CreateIndex
CREATE INDEX "healing_stabilization_sessions_userId_createdAt_idx" ON "healing_stabilization_sessions"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "healing_stabilization_sessions_sessionId_idx" ON "healing_stabilization_sessions"("sessionId");

-- CreateIndex
CREATE INDEX "healing_parts_work_sessions_userId_createdAt_idx" ON "healing_parts_work_sessions"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "healing_parts_work_sessions_sessionId_idx" ON "healing_parts_work_sessions"("sessionId");

-- CreateIndex
CREATE INDEX "healing_parts_work_sessions_relatedFormulationId_idx" ON "healing_parts_work_sessions"("relatedFormulationId");

-- CreateIndex
CREATE INDEX "healing_exposure_plans_userId_createdAt_idx" ON "healing_exposure_plans"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "healing_exposure_plans_sessionId_idx" ON "healing_exposure_plans"("sessionId");

-- CreateIndex
CREATE INDEX "healing_exposure_plans_relatedCBTSessionId_idx" ON "healing_exposure_plans"("relatedCBTSessionId");

-- CreateIndex
CREATE INDEX "healing_exposure_attempts_userId_createdAt_idx" ON "healing_exposure_attempts"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "healing_exposure_attempts_exposurePlanId_idx" ON "healing_exposure_attempts"("exposurePlanId");

-- CreateIndex
CREATE INDEX "healing_identity_sessions_userId_createdAt_idx" ON "healing_identity_sessions"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "healing_identity_sessions_sessionId_idx" ON "healing_identity_sessions"("sessionId");

-- CreateIndex
CREATE INDEX "healing_identity_evidence_userId_createdAt_idx" ON "healing_identity_evidence"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "healing_identity_evidence_identitySessionId_idx" ON "healing_identity_evidence"("identitySessionId");

-- CreateIndex
CREATE INDEX "healing_timeline_reports_userId_createdAt_idx" ON "healing_timeline_reports"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "healing_relapse_plans_userId_createdAt_idx" ON "healing_relapse_plans"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "healing_relapse_plans_active_idx" ON "healing_relapse_plans"("active");

-- CreateIndex
CREATE INDEX "healing_relapse_checkins_userId_createdAt_idx" ON "healing_relapse_checkins"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "healing_relapse_checkins_planId_idx" ON "healing_relapse_checkins"("planId");

-- AddForeignKey
ALTER TABLE "safety_triage_events" ADD CONSTRAINT "safety_triage_events_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mental_state_intakes" ADD CONSTRAINT "mental_state_intakes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dilts_clinical_formulations" ADD CONSTRAINT "dilts_clinical_formulations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dilts_clinical_formulations" ADD CONSTRAINT "dilts_clinical_formulations_intakeId_fkey" FOREIGN KEY ("intakeId") REFERENCES "mental_state_intakes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "healing_practice_tasks" ADD CONSTRAINT "healing_practice_tasks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "healing_core_belief_records" ADD CONSTRAINT "healing_core_belief_records_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "healing_cbt_sessions" ADD CONSTRAINT "healing_cbt_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "healing_emotion_regulation_sessions" ADD CONSTRAINT "healing_emotion_regulation_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "healing_stabilization_sessions" ADD CONSTRAINT "healing_stabilization_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "healing_parts_work_sessions" ADD CONSTRAINT "healing_parts_work_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "healing_exposure_plans" ADD CONSTRAINT "healing_exposure_plans_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "healing_exposure_attempts" ADD CONSTRAINT "healing_exposure_attempts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "healing_exposure_attempts" ADD CONSTRAINT "healing_exposure_attempts_exposurePlanId_fkey" FOREIGN KEY ("exposurePlanId") REFERENCES "healing_exposure_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "healing_identity_sessions" ADD CONSTRAINT "healing_identity_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "healing_identity_evidence" ADD CONSTRAINT "healing_identity_evidence_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "healing_identity_evidence" ADD CONSTRAINT "healing_identity_evidence_identitySessionId_fkey" FOREIGN KEY ("identitySessionId") REFERENCES "healing_identity_sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "healing_timeline_reports" ADD CONSTRAINT "healing_timeline_reports_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "healing_relapse_plans" ADD CONSTRAINT "healing_relapse_plans_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "healing_relapse_checkins" ADD CONSTRAINT "healing_relapse_checkins_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
