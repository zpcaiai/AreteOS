-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- Enable pgvector for the personal memory layer.
CREATE EXTENSION IF NOT EXISTS vector;

-- CreateEnum
CREATE TYPE "BookSourceType" AS ENUM ('CATALOG', 'PUBLIC_DOMAIN', 'USER_UPLOAD');

-- CreateEnum
CREATE TYPE "BookFormat" AS ENUM ('PDF', 'EPUB', 'TEXT', 'AUDIO');

-- CreateEnum
CREATE TYPE "ChildIdentityKind" AS ENUM ('EXPLORER', 'RESEARCHER', 'CREATOR', 'BUILDER', 'INVENTOR', 'PROBLEM_SOLVER', 'COLLABORATOR', 'STORYTELLER', 'LEADER', 'MENTOR');

-- CreateEnum
CREATE TYPE "MindsetKind" AS ENUM ('FIXED', 'GROWTH');

-- CreateEnum
CREATE TYPE "CreativityMode" AS ENUM ('DREAMER', 'BUILDER', 'CRITIC');

-- CreateEnum
CREATE TYPE "CogCategory" AS ENUM ('ECONOMICS', 'PSYCHOLOGY', 'SYSTEMS_THINKING', 'PROBABILITY', 'BIOLOGY', 'PHYSICS', 'STRATEGY', 'INNOVATION', 'DECISION_SCIENCE', 'GENERAL');

-- CreateEnum
CREATE TYPE "EvolutionStage" AS ENUM ('UNAWARE', 'EXPLORER', 'BUILDER', 'OPERATOR', 'STRATEGIST', 'CREATOR', 'LEADER', 'LEGACY_BUILDER');

-- CreateEnum
CREATE TYPE "DevLayer" AS ENUM ('WORLDVIEW', 'MISSION', 'IDENTITY', 'VALUES', 'MENTAL_MODELS', 'FIRST_PRINCIPLES', 'DECISIONS', 'BEHAVIOR', 'HABITS', 'MASTERY', 'LEADERSHIP', 'LEGACY');

-- CreateEnum
CREATE TYPE "MasteryStage" AS ENUM ('NOVICE', 'BEGINNER', 'PRACTITIONER', 'PROFESSIONAL', 'EXPERT', 'MASTER');

-- CreateEnum
CREATE TYPE "ShadowType" AS ENUM ('PROCRASTINATION', 'COMFORT_ADDICTION', 'STATUS_ADDICTION', 'CONFIRMATION_BIAS', 'SUNK_COST_BIAS', 'EGO', 'FEAR', 'AVOIDANCE', 'DISTRACTION');

-- CreateEnum
CREATE TYPE "ModelArchetype" AS ENUM ('EINSTEIN', 'BUFFETT', 'DISNEY', 'JOBS', 'MUNGER', 'MUSK', 'DALIO', 'CUSTOM');

-- CreateEnum
CREATE TYPE "ModelCategory" AS ENUM ('ECONOMICS', 'PSYCHOLOGY', 'SYSTEMS', 'PROBABILITY', 'PHYSICS', 'BIOLOGY', 'STRATEGY', 'GENERAL');

-- CreateEnum
CREATE TYPE "DecisionStatus" AS ENUM ('DRAFT', 'REVIEWED', 'DECIDED');

-- CreateEnum
CREATE TYPE "ReviewPeriod" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY');

-- CreateEnum
CREATE TYPE "ScoreKind" AS ENUM ('MISSION_ALIGNMENT', 'IDENTITY_ALIGNMENT', 'VALUE_INTEGRITY', 'MENTAL_MODEL_USAGE', 'FIRST_PRINCIPLE', 'DECISION_QUALITY', 'HABIT_CONSISTENCY', 'MASTERY', 'LEADERSHIP', 'LEGACY', 'REFLECTION', 'GROWTH');

-- CreateEnum
CREATE TYPE "MemberTier" AS ENUM ('FREE', 'PLUS', 'PRO');

-- CreateEnum
CREATE TYPE "BillingPeriod" AS ENUM ('MONTHLY', 'QUARTERLY', 'ANNUAL');

-- CreateEnum
CREATE TYPE "MemberOrderStatus" AS ENUM ('CREATED', 'PAID', 'CANCELLED');

-- CreateEnum
CREATE TYPE "BeliefType" AS ENUM ('LIMITING', 'EMPOWERING', 'NEUTRAL');

-- CreateEnum
CREATE TYPE "ProductKind" AS ENUM ('MEMBERSHIP_DAYS', 'CREDITS', 'CONTENT');

-- CreateEnum
CREATE TYPE "StoreOrderStatus" AS ENUM ('CREATED', 'PAID', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "IdentityStackRole" AS ENUM ('PRIMARY', 'SECONDARY', 'EMERGING', 'LEGACY');

-- CreateEnum
CREATE TYPE "IdentityStage" AS ENUM ('DISCOVER', 'CHOOSE', 'PRACTICE', 'INTERNALIZE', 'INTEGRATE', 'MASTER', 'TEACH', 'LEGACY');

-- CreateEnum
CREATE TYPE "LeadershipLevel" AS ENUM ('ENVIRONMENT', 'BEHAVIOR', 'CAPABILITY', 'BELIEF', 'IDENTITY', 'MISSION');

-- CreateEnum
CREATE TYPE "LeadershipRole" AS ENUM ('CARETAKER', 'GUIDE', 'COACH', 'MENTOR', 'SPONSOR', 'AWAKENER');

-- CreateEnum
CREATE TYPE "ManagementLevel" AS ENUM ('SUPERVISOR', 'MANAGER', 'DIRECTOR', 'LEADER', 'VISIONARY', 'SYSTEM_ARCHITECT', 'ORG_DESIGNER');

-- CreateEnum
CREATE TYPE "LeverageTier" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "KnowledgeAssetKind" AS ENUM ('PLAYBOOK', 'PROMPT_LIBRARY', 'EXPERT_PATTERN', 'DECISION_PATTERN', 'TROUBLESHOOTING', 'CUSTOMER', 'TECHNICAL');

-- CreateEnum
CREATE TYPE "PersonalMemoryKind" AS ENUM ('DECISION', 'REFLECTION', 'HABIT', 'SHADOW', 'NAVAL', 'REVIEW', 'GENERAL');

-- CreateEnum
CREATE TYPE "GoalHorizon" AS ENUM ('ONE_YEAR', 'THREE_YEARS', 'FIVE_YEARS', 'TEN_YEARS', 'LIFETIME');

-- CreateEnum
CREATE TYPE "NavalPlanStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "OnboardingStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "NavalStatus" AS ENUM ('DRAFT', 'ACTIVE', 'IN_PROGRESS', 'REVIEW', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "LeverageCategory" AS ENUM ('LABOR', 'CAPITAL', 'CODE', 'MEDIA', 'AI_AGENT', 'COMMUNITY', 'BRAND', 'NETWORK', 'KNOWLEDGE', 'SYSTEM');

-- CreateEnum
CREATE TYPE "AssetCategory" AS ENUM ('CODE', 'MEDIA', 'KNOWLEDGE', 'PRODUCT', 'BRAND', 'COMMUNITY', 'EQUITY', 'INVESTMENT', 'BUSINESS', 'AI_AGENT');

-- CreateEnum
CREATE TYPE "PortfolioAreaType" AS ENUM ('HEALTH', 'WEALTH', 'LEARNING', 'RELATIONSHIPS', 'MISSION', 'FREEDOM', 'HAPPINESS', 'CREATIVITY', 'LEGACY');

-- CreateEnum
CREATE TYPE "FreedomDimension" AS ENUM ('TIME', 'LOCATION', 'FINANCIAL', 'PSYCHOLOGICAL');

-- CreateEnum
CREATE TYPE "IncomeKind" AS ENUM ('ACTIVE', 'PASSIVE', 'LEVERAGED');

-- CreateEnum
CREATE TYPE "NarrativeType" AS ENUM ('REDEMPTION', 'CONTAMINATION', 'TURNING_POINT', 'STABILITY');

-- CreateEnum
CREATE TYPE "SuccessFactorCategory" AS ENUM ('IDENTITY', 'VALUE', 'MARKET', 'PRODUCT', 'DECISION', 'TEAM', 'CULTURE', 'EXECUTION', 'CUSTOMER', 'RESILIENCE');

-- CreateEnum
CREATE TYPE "BottleneckType" AS ENUM ('FOUNDER_DEPENDENCY', 'UNCLEAR_VALUES', 'INCONSISTENT_DECISIONS', 'WEAK_MANAGEMENT', 'POOR_KNOWLEDGE_TRANSFER', 'CULTURE_DILUTION', 'PRODUCT_COMPLEXITY', 'CUSTOMER_ACQUISITION', 'OPERATIONAL_CHAOS', 'CASH_FLOW');

-- CreateEnum
CREATE TYPE "WorldviewStage" AS ENUM ('INHERITED', 'QUESTIONED', 'CONSCIOUS', 'INTEGRATED', 'GENERATIVE', 'LEGACY');

-- CreateTable
CREATE TABLE "audiobooks" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL DEFAULT '',
    "relatedModule" TEXT NOT NULL DEFAULT '',
    "inspiredByNote" TEXT NOT NULL DEFAULT '',
    "summary" TEXT NOT NULL DEFAULT '',
    "textContent" TEXT NOT NULL DEFAULT '',
    "sourceType" "BookSourceType" NOT NULL DEFAULT 'CATALOG',
    "format" "BookFormat" NOT NULL DEFAULT 'TEXT',
    "isPublicDomain" BOOLEAN NOT NULL DEFAULT false,
    "ownerUserId" TEXT,
    "assetRef" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "audiobooks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "listening_progress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "positionChar" INTEGER NOT NULL DEFAULT 0,
    "percent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalSeconds" INTEGER NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "listening_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "listening_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "seconds" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "listening_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "book_notes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "positionChar" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "book_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "child_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL DEFAULT 0,
    "interests" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "primaryIdentity" "ChildIdentityKind",
    "emergingIdentity" "ChildIdentityKind",
    "globalScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "child_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "child_identities" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "kind" "ChildIdentityKind" NOT NULL,
    "strengths" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "opportunities" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "sponsorship" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "child_identities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "child_assessments" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "curiosity" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "creativity" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "resilience" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "autonomy" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "collaboration" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "problemSolving" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "identityClarity" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "learningMotivation" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "globalScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "child_assessments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "child_growth_mindset_logs" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "fixedStatement" TEXT NOT NULL,
    "growthReframe" TEXT NOT NULL DEFAULT '',
    "mindset" "MindsetKind" NOT NULL DEFAULT 'FIXED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "child_growth_mindset_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "child_curiosity_logs" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "question" TEXT NOT NULL DEFAULT '',
    "experiment" TEXT NOT NULL DEFAULT '',
    "topic" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "child_curiosity_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "child_creativity_projects" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "mode" "CreativityMode" NOT NULL DEFAULT 'DREAMER',
    "idea" TEXT NOT NULL DEFAULT '',
    "prototype" TEXT NOT NULL DEFAULT '',
    "reflection" TEXT NOT NULL DEFAULT '',
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "child_creativity_projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "child_learning_environments" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "noise" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "distraction" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "autonomy" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "exploration" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "accessibility" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "qualityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "upgradePlan" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "child_learning_environments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "child_learning_autonomy_logs" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "initiative" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ownership" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "persistence" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "focus" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "independentLearning" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "autonomyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "note" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "child_learning_autonomy_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "child_problem_solving_logs" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "problem" TEXT NOT NULL,
    "observation" TEXT NOT NULL DEFAULT '',
    "hypothesis" TEXT NOT NULL DEFAULT '',
    "experiment" TEXT NOT NULL DEFAULT '',
    "reflection" TEXT NOT NULL DEFAULT '',
    "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "child_problem_solving_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "child_projects" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "interest" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'in_progress',
    "capabilities" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "child_projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "child_resilience_logs" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "failureRecovery" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "persistence" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "riskTaking" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "emotionalRegulation" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "resilienceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "note" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "child_resilience_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "child_parent_coaching_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'Identity Sponsor',
    "guidance" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "conversationScripts" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "supportScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "child_parent_coaching_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "child_identity_snapshots" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "kind" "ChildIdentityKind" NOT NULL,
    "note" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "child_identity_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "child_development_snapshots" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "explorer" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "creator" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "builder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "researcher" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "problemSolver" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "resilience" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "autonomy" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "growthMindset" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "parentSupport" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "globalScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "child_development_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cog_models" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "CogCategory" NOT NULL DEFAULT 'GENERAL',
    "summary" TEXT NOT NULL DEFAULT '',
    "whenToUse" TEXT NOT NULL DEFAULT '',
    "examples" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cog_models_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cog_model_relationships" (
    "id" TEXT NOT NULL,
    "fromSlug" TEXT NOT NULL,
    "toSlug" TEXT NOT NULL,
    "relation" TEXT NOT NULL DEFAULT 'relates-to',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cog_model_relationships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cog_model_clusters" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "purpose" TEXT NOT NULL DEFAULT '',
    "modelSlugs" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cog_model_clusters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cog_model_examples" (
    "id" TEXT NOT NULL,
    "modelSlug" TEXT NOT NULL,
    "example" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cog_model_examples_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cog_decision_lenses" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "question" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cog_decision_lenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cog_decision_lens_results" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "decision" TEXT NOT NULL,
    "lenses" JSONB,
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cog_decision_lens_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cog_biases" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "correction" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cog_biases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cog_bias_events" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "biasSlug" TEXT NOT NULL,
    "biasName" TEXT NOT NULL,
    "context" TEXT NOT NULL DEFAULT '',
    "severity" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cog_bias_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cog_judgment_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "judgmentScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "blindSpots" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cog_judgment_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cog_judgment_assessments" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "problemFraming" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "evidenceQuality" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "modelDiversity" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "biasResistance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "longTermThinking" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "secondOrderThinking" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "riskAwareness" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "decisionClarity" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "judgmentScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cog_judgment_assessments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cog_decision_journals" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "decision" TEXT NOT NULL,
    "context" TEXT NOT NULL DEFAULT '',
    "expectedOutcome" TEXT NOT NULL DEFAULT '',
    "actualOutcome" TEXT NOT NULL DEFAULT '',
    "modelsUsed" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cog_decision_journals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cog_decision_assumptions" (
    "id" TEXT NOT NULL,
    "journalId" TEXT NOT NULL,
    "assumption" TEXT NOT NULL,
    "heldTrue" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cog_decision_assumptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cog_decision_outcomes" (
    "id" TEXT NOT NULL,
    "journalId" TEXT NOT NULL,
    "outcome" TEXT NOT NULL,
    "surprise" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cog_decision_outcomes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cog_decision_reviews" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "journalId" TEXT NOT NULL,
    "lessons" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "failedModel" TEXT NOT NULL DEFAULT '',
    "wrongAssumptions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cog_decision_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cog_latticeworks" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "goal" TEXT NOT NULL,
    "blindSpots" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "synergyNote" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cog_latticeworks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cog_latticework_nodes" (
    "id" TEXT NOT NULL,
    "latticeworkId" TEXT NOT NULL,
    "modelSlug" TEXT NOT NULL,
    "modelName" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cog_latticework_nodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cog_latticework_edges" (
    "id" TEXT NOT NULL,
    "latticeworkId" TEXT NOT NULL,
    "fromModel" TEXT NOT NULL,
    "toModel" TEXT NOT NULL,
    "relation" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cog_latticework_edges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cog_cognitive_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "thinkingStyle" TEXT NOT NULL DEFAULT '',
    "decisionStyle" TEXT NOT NULL DEFAULT '',
    "learningStyle" TEXT NOT NULL DEFAULT '',
    "reasoningStyle" TEXT NOT NULL DEFAULT '',
    "riskStyle" TEXT NOT NULL DEFAULT '',
    "strengths" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "weaknesses" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "globalScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cog_cognitive_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cog_thinking_patterns" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "pattern" TEXT NOT NULL,
    "helpful" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cog_thinking_patterns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cog_reasoning_styles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "style" TEXT NOT NULL,
    "note" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cog_reasoning_styles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cog_uncertainty_assessments" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "robustness" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "fragility" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "optionality" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "tailRiskAwareness" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "uncertaintyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "profile" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cog_uncertainty_assessments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cog_optionalities" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "option" TEXT NOT NULL,
    "upside" TEXT NOT NULL DEFAULT '',
    "cappedDownside" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cog_optionalities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cog_tail_risks" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "risk" TEXT NOT NULL,
    "exposure" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "mitigation" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cog_tail_risks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cog_diagnoses" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "problem" TEXT NOT NULL,
    "diagnosis" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cog_diagnoses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cog_root_causes" (
    "id" TEXT NOT NULL,
    "diagnosisId" TEXT NOT NULL,
    "rootCause" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cog_root_causes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cog_leverage_points" (
    "id" TEXT NOT NULL,
    "diagnosisId" TEXT NOT NULL,
    "leverage" TEXT NOT NULL,
    "impact" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cog_leverage_points_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cog_wisdom_insights" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "insight" TEXT NOT NULL,
    "basis" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cog_wisdom_insights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cog_personal_principles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "principle" TEXT NOT NULL,
    "rationale" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cog_personal_principles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "passwordHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "personality_states" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "stage" "EvolutionStage" NOT NULL DEFAULT 'UNAWARE',
    "progress" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "enteredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "personality_states_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "personality_transitions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fromStage" "EvolutionStage" NOT NULL,
    "toStage" "EvolutionStage" NOT NULL,
    "reason" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "personality_transitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "worldviews" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "summary" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "worldviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "worldview_dimensions" (
    "id" TEXT NOT NULL,
    "worldviewId" TEXT NOT NULL,
    "dimension" TEXT NOT NULL,
    "stance" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "worldview_dimensions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "worldview_assessments" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "worldview_assessments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "missions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "statement" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "missions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "statement" TEXT NOT NULL,
    "horizon" TEXT NOT NULL DEFAULT '10Y',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "visions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "life_themes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "note" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "life_themes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "constitutions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "article" TEXT NOT NULL,
    "rank" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "constitutions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identities" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "statement" TEXT NOT NULL DEFAULT '',
    "clarity" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "identities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "identityId" TEXT,
    "name" TEXT NOT NULL,
    "intention" TEXT NOT NULL DEFAULT '',
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identity_scores" (
    "id" TEXT NOT NULL,
    "identityId" TEXT NOT NULL,
    "alignment" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "identity_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identity_history" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "snapshot" JSONB NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "identity_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "values" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "values_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "value_rankings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "valueId" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "value_rankings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "value_conflicts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "valueAId" TEXT NOT NULL,
    "valueBId" TEXT NOT NULL,
    "context" TEXT NOT NULL DEFAULT '',
    "resolution" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "value_conflicts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mental_models" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "ModelCategory" NOT NULL DEFAULT 'GENERAL',
    "description" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mental_models_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "model_connections" (
    "id" TEXT NOT NULL,
    "fromModelId" TEXT NOT NULL,
    "toModelId" TEXT NOT NULL,
    "relation" TEXT NOT NULL DEFAULT 'relates_to',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "model_connections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "model_usage_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "context" TEXT NOT NULL DEFAULT '',
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "model_usage_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "first_principle_maps" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "problem" TEXT NOT NULL,
    "tree" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "first_principle_maps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assumptions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "mapId" TEXT,
    "statement" TEXT NOT NULL,
    "valid" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "assumptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "root_causes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "mapId" TEXT,
    "cause" TEXT NOT NULL,
    "depth" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "root_causes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "constraints" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "mapId" TEXT,
    "statement" TEXT NOT NULL,
    "kind" TEXT NOT NULL DEFAULT 'PHYSICAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "constraints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "decisions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "context" TEXT NOT NULL DEFAULT '',
    "status" "DecisionStatus" NOT NULL DEFAULT 'DRAFT',
    "quality" DOUBLE PRECISION,
    "reversible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "decisions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "decision_options" (
    "id" TEXT NOT NULL,
    "decisionId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "chosen" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "decision_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "decision_reviews" (
    "id" TEXT NOT NULL,
    "decisionId" TEXT NOT NULL,
    "optionId" TEXT,
    "missionFit" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "identityFit" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "valueFit" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "expectedValue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "opportunityCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "secondOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "risk" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "reversibility" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "shadowMotive" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "quality" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "note" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "decision_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_models" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "person" TEXT NOT NULL,
    "archetype" "ModelArchetype" NOT NULL DEFAULT 'CUSTOM',
    "values" TEXT NOT NULL DEFAULT '',
    "beliefs" TEXT NOT NULL DEFAULT '',
    "environment" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "role_models_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identity_patterns" (
    "id" TEXT NOT NULL,
    "roleModelId" TEXT NOT NULL,
    "pattern" TEXT NOT NULL,

    CONSTRAINT "identity_patterns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "decision_patterns" (
    "id" TEXT NOT NULL,
    "roleModelId" TEXT NOT NULL,
    "rule" TEXT NOT NULL,

    CONSTRAINT "decision_patterns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "habit_patterns" (
    "id" TEXT NOT NULL,
    "roleModelId" TEXT NOT NULL,
    "habit" TEXT NOT NULL,

    CONSTRAINT "habit_patterns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "habits" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "identityProof" TEXT NOT NULL DEFAULT '',
    "targetPerWeek" INTEGER NOT NULL DEFAULT 7,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "habits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "habit_logs" (
    "id" TEXT NOT NULL,
    "habitId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "done" BOOLEAN NOT NULL DEFAULT true,
    "identityNote" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "habit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "habit_identity_links" (
    "id" TEXT NOT NULL,
    "habitId" TEXT NOT NULL,
    "identityId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "habit_identity_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shadow_patterns" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "ShadowType" NOT NULL,
    "rootCause" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "shadow_patterns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shadow_events" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "patternId" TEXT,
    "type" "ShadowType" NOT NULL,
    "trigger" TEXT NOT NULL DEFAULT '',
    "severity" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "shadow_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interventions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "patternId" TEXT,
    "action" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "interventions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reflections" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "worked" TEXT NOT NULL DEFAULT '',
    "failed" TEXT NOT NULL DEFAULT '',
    "learned" TEXT NOT NULL DEFAULT '',
    "wrongAssumptions" TEXT NOT NULL DEFAULT '',
    "identityReinforced" TEXT NOT NULL DEFAULT '',
    "depth" DOUBLE PRECISION NOT NULL DEFAULT 0.5,

    CONSTRAINT "reflections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lessons" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reflectionId" TEXT,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lessons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "period" "ReviewPeriod" NOT NULL,
    "periodKey" TEXT NOT NULL,
    "summary" TEXT NOT NULL DEFAULT '',
    "metrics" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skills" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "domain" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mastery_levels" (
    "id" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "stage" "MasteryStage" NOT NULL DEFAULT 'NOVICE',
    "knowledge" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "execution" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "problemSolving" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "teaching" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mastery_levels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skill_progress" (
    "id" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "note" TEXT NOT NULL DEFAULT '',
    "delta" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "skill_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leadership_metrics" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "communication" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "influence" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "delegation" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "teamBuilding" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "decisionQuality" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "leadership_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "influence_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "who" TEXT NOT NULL DEFAULT '',
    "outcome" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "influence_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "legacy_projects" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "kind" TEXT NOT NULL DEFAULT 'INSTITUTION',
    "impact" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "legacy_projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mentees" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "focus" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mentees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "knowledge_assets" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'ARTICLE',
    "url" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "knowledge_assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "score_snapshots" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "kind" "ScoreKind" NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "detail" JSONB,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "score_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "domain_events" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "aggregateType" TEXT NOT NULL,
    "aggregateId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "domain_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "beliefs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "statement" TEXT NOT NULL,
    "type" "BeliefType" NOT NULL DEFAULT 'NEUTRAL',
    "strength" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "beliefs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "limiting_beliefs" (
    "id" TEXT NOT NULL,
    "beliefId" TEXT NOT NULL,
    "trigger" TEXT NOT NULL DEFAULT '',
    "cost" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "limiting_beliefs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "empowering_beliefs" (
    "id" TEXT NOT NULL,
    "beliefId" TEXT NOT NULL,
    "evidence" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "empowering_beliefs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "belief_reframes" (
    "id" TEXT NOT NULL,
    "beliefId" TEXT NOT NULL,
    "reframedText" TEXT NOT NULL,
    "empoweringText" TEXT NOT NULL DEFAULT '',
    "action" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "belief_reframes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "belief_change_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "beliefId" TEXT,
    "fromType" "BeliefType" NOT NULL,
    "toType" "BeliefType" NOT NULL,
    "note" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "belief_change_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "digital_twin_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "snapshot" JSONB,
    "summary" TEXT NOT NULL DEFAULT '',
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "digital_twin_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "twin_memories" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "kind" TEXT NOT NULL DEFAULT 'EVENT',
    "content" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "twin_memories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "twin_insights" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "insight" TEXT NOT NULL,
    "basis" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "twin_insights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "drift_predictions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "risk" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "fromIdentity" TEXT NOT NULL DEFAULT '',
    "towardIdentity" TEXT NOT NULL DEFAULT '',
    "rationale" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "drift_predictions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "geniuses" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "era" TEXT NOT NULL DEFAULT '',
    "domain" TEXT NOT NULL DEFAULT '',
    "summary" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "geniuses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "genius_strategies" (
    "id" TEXT NOT NULL,
    "geniusId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "repSequence" JSONB,
    "tote" JSONB,
    "identity" TEXT NOT NULL DEFAULT '',
    "beliefs" TEXT NOT NULL DEFAULT '',
    "values" TEXT NOT NULL DEFAULT '',
    "capabilities" TEXT NOT NULL DEFAULT '',
    "highLeverage" TEXT NOT NULL DEFAULT '',
    "creativeProcess" TEXT NOT NULL DEFAULT '',
    "learningProcess" TEXT NOT NULL DEFAULT '',
    "feedbackProcess" TEXT NOT NULL DEFAULT '',
    "shadowPatterns" TEXT NOT NULL DEFAULT '',
    "failureModes" TEXT NOT NULL DEFAULT '',
    "installProtocol" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "genius_strategies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "strategy_adoptions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "strategyId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ADOPTED',
    "note" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "strategy_adoptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "genius_practice_logs" (
    "id" TEXT NOT NULL,
    "adoptionId" TEXT NOT NULL,
    "reflection" TEXT NOT NULL DEFAULT '',
    "fidelity" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "genius_practice_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blueprint_adaptations" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "strategyId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "identity" TEXT NOT NULL DEFAULT '',
    "beliefs" TEXT NOT NULL DEFAULT '',
    "values" TEXT NOT NULL DEFAULT '',
    "decisionRules" JSONB,
    "habits" JSONB,
    "creativeProcess" TEXT NOT NULL DEFAULT '',
    "summary" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blueprint_adaptations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "learning_paths" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "adaptationId" TEXT,
    "strategyId" TEXT,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "learning_paths_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "learning_steps" (
    "id" TEXT NOT NULL,
    "pathId" TEXT NOT NULL,
    "stage" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "action" TEXT NOT NULL DEFAULT '',
    "done" BOOLEAN NOT NULL DEFAULT false,
    "doneAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "learning_steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "community_posts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT '',
    "message" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "community_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_comments" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "post_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "memberships" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tier" "MemberTier" NOT NULL DEFAULT 'FREE',
    "period" "BillingPeriod",
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "memberships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "membership_orders" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tier" "MemberTier" NOT NULL,
    "period" "BillingPeriod" NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'CNY',
    "status" "MemberOrderStatus" NOT NULL DEFAULT 'CREATED',
    "provider" TEXT NOT NULL DEFAULT 'mock',
    "outTradeNo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paidAt" TIMESTAMP(3),

    CONSTRAINT "membership_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "store_products" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "kind" "ProductKind" NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'CNY',
    "grantTier" "MemberTier",
    "grantDays" INTEGER NOT NULL DEFAULT 0,
    "grantCredits" INTEGER NOT NULL DEFAULT 0,
    "grantContentKey" TEXT NOT NULL DEFAULT '',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "store_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "store_orders" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'CNY',
    "status" "StoreOrderStatus" NOT NULL DEFAULT 'CREATED',
    "provider" TEXT NOT NULL DEFAULT 'mock',
    "outTradeNo" TEXT NOT NULL,
    "paidAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "deliveryNote" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "store_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_credits" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_credits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "credit_ledgers" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "delta" INTEGER NOT NULL,
    "reason" TEXT NOT NULL DEFAULT '',
    "orderId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "credit_ledgers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_unlocks" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "contentKey" TEXT NOT NULL,
    "orderId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "content_unlocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identity_families" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "purpose" TEXT NOT NULL DEFAULT '',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "identity_families_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identity_archetypes" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "familyId" TEXT NOT NULL,
    "mission" TEXT NOT NULL DEFAULT '',
    "identityStatement" TEXT NOT NULL DEFAULT '',
    "values" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "beliefs" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "mentalModels" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "decisionRules" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "habits" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "capabilities" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "shadowPatterns" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "failureModes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "growthPath" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "legacyExpression" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "identity_archetypes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identity_values" (
    "id" TEXT NOT NULL,
    "archetypeId" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "identity_values_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identity_beliefs" (
    "id" TEXT NOT NULL,
    "archetypeId" TEXT NOT NULL,
    "belief" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "identity_beliefs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identity_habits" (
    "id" TEXT NOT NULL,
    "archetypeId" TEXT NOT NULL,
    "habit" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "identity_habits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identity_capabilities" (
    "id" TEXT NOT NULL,
    "archetypeId" TEXT NOT NULL,
    "capability" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "identity_capabilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identity_mental_models" (
    "id" TEXT NOT NULL,
    "archetypeId" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "identity_mental_models_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identity_shadow_patterns" (
    "id" TEXT NOT NULL,
    "archetypeId" TEXT NOT NULL,
    "pattern" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "identity_shadow_patterns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identity_failure_modes" (
    "id" TEXT NOT NULL,
    "archetypeId" TEXT NOT NULL,
    "failureMode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "identity_failure_modes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identity_evolution_paths" (
    "id" TEXT NOT NULL,
    "archetypeId" TEXT NOT NULL,
    "stage" "IdentityStage" NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "identity_evolution_paths_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_identity_stacks" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "IdentityStackRole" NOT NULL,
    "archetypeSlug" TEXT NOT NULL,
    "archetypeName" TEXT NOT NULL,
    "stage" "IdentityStage" NOT NULL DEFAULT 'CHOOSE',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_identity_stacks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identity_recommendations" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "archetypeSlug" TEXT NOT NULL,
    "archetypeName" TEXT NOT NULL,
    "role" "IdentityStackRole" NOT NULL DEFAULT 'EMERGING',
    "rationale" TEXT NOT NULL DEFAULT '',
    "fitScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "identity_recommendations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identity_conflicts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "identityA" TEXT NOT NULL,
    "identityB" TEXT NOT NULL,
    "tension" TEXT NOT NULL DEFAULT '',
    "tradeoffs" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "integration" TEXT NOT NULL DEFAULT '',
    "severity" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "identity_conflicts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identity_assessments" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "clarity" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "alignment" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "stability" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "conflict" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "evolution" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "integration" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "globalScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "summary" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "identity_assessments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identity_evolution_snapshots" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "archetypeSlug" TEXT NOT NULL,
    "stage" "IdentityStage" NOT NULL,
    "note" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "identity_evolution_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leadership_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT,
    "currentRole" "LeadershipRole" NOT NULL DEFAULT 'GUIDE',
    "dominantLevel" "LeadershipLevel" NOT NULL DEFAULT 'BEHAVIOR',
    "leverageScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "globalScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "blindSpots" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leadership_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leadership_assessments" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT,
    "selfAwareness" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "responsibility" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "communication" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "emotionalRegulation" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "decisionMaturity" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "integrity" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "peopleDevelopment" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "maturityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "leadership_assessments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leadership_leverage_maps" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT,
    "environment" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "behavior" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "capability" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "belief" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "identity" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "mission" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "overfocus" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "blindSpots" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "leverageScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "leadership_leverage_maps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leadership_conversations" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT,
    "conversationType" "LeadershipRole" NOT NULL DEFAULT 'COACH',
    "script" TEXT NOT NULL DEFAULT '',
    "questions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "followUps" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "effectiveness" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "leadership_conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leadership_identity_sponsorships" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT,
    "recipient" TEXT NOT NULL DEFAULT '',
    "recognition" TEXT NOT NULL DEFAULT '',
    "identityStatement" TEXT NOT NULL DEFAULT '',
    "narrative" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "leadership_identity_sponsorships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leadership_vision_statements" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT,
    "statement" TEXT NOT NULL,
    "communication" TEXT NOT NULL DEFAULT '',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "alignmentScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leadership_vision_statements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leadership_vision_alignment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT,
    "alignmentScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "adoptionScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "driftDetected" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "leadership_vision_alignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leadership_belonging_assessments" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT,
    "trust" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "psychologicalSafety" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "recognition" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "contribution" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "identityFit" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "missionFit" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "belongingScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "cohesionScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "leadership_belonging_assessments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leadership_alignment_assessments" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT,
    "mission" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "identity" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "values" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "decisionRules" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "behaviors" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "teams" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "alignmentScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "misalignments" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "leadership_alignment_assessments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leadership_future_leaders" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT,
    "candidate" TEXT NOT NULL DEFAULT '',
    "selfAwareness" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "decisionQuality" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "influence" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "responsibility" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "missionOwnership" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "identityStability" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "visionCapability" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "readinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leadership_future_leaders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leadership_pipelines" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT,
    "role" TEXT NOT NULL,
    "candidates" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "successionMap" JSONB,
    "readinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leadership_pipelines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leadership_culture_blueprints" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT,
    "founderIdentity" TEXT NOT NULL DEFAULT '',
    "values" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "leadershipBehaviors" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "operatingPrinciples" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "rituals" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "replicationPlaybook" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leadership_culture_blueprints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leadership_awakening_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT,
    "task" TEXT NOT NULL DEFAULT '',
    "why" TEXT NOT NULL DEFAULT '',
    "becoming" TEXT NOT NULL DEFAULT '',
    "futureCreated" TEXT NOT NULL DEFAULT '',
    "largerPurpose" TEXT NOT NULL DEFAULT '',
    "purposeClarity" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "missionConnection" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "awakeningReadiness" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "leadership_awakening_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leadership_growth_plans" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT,
    "fromRole" "LeadershipRole" NOT NULL,
    "toRole" "LeadershipRole" NOT NULL,
    "steps" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "successMetrics" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leadership_growth_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "management_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT,
    "level" "ManagementLevel" NOT NULL DEFAULT 'MANAGER',
    "maturityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "globalScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "dependencyRisk" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "management_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "management_assessments" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT,
    "mission" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "leadership" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "knowledge" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "decisionQuality" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "delegation" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "alignment" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "resilience" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "maturityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "management_assessments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "management_activities" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT,
    "activity" TEXT NOT NULL,
    "tier" "LeverageTier" NOT NULL DEFAULT 'LOW',
    "hoursPerWeek" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "management_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leverage_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT,
    "lowShare" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "mediumShare" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "highShare" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "leverageScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "improvementPlan" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "leverage_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "knowledge_worker_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT,
    "subject" TEXT NOT NULL DEFAULT '',
    "clarity" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "autonomy" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "capability" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "tooling" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "focus" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "effectivenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "constraints" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "knowledge_worker_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mgmt_knowledge_assets" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT,
    "kind" "KnowledgeAssetKind" NOT NULL DEFAULT 'PLAYBOOK',
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL DEFAULT '',
    "tacitSource" TEXT NOT NULL DEFAULT '',
    "reuseCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mgmt_knowledge_assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "management_playbooks" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT,
    "title" TEXT NOT NULL,
    "steps" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "whenToUse" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "management_playbooks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "management_prompt_libraries" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT,
    "title" TEXT NOT NULL,
    "prompts" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "domain" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "management_prompt_libraries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organizational_memories" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT,
    "kind" TEXT NOT NULL DEFAULT 'lesson',
    "title" TEXT NOT NULL,
    "detail" TEXT NOT NULL DEFAULT '',
    "outcome" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "organizational_memories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "management_decision_governance" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT,
    "quality" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "consistency" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "speed" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ownership" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "learning" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "governanceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "notes" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "management_decision_governance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organizational_health" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT,
    "trust" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "communication" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "execution" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ownership" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "learning" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "collaboration" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "healthScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "organizational_health_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fragility_assessments" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT,
    "founderDependency" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "keyPersonDependency" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "customerConcentration" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "knowledgeConcentration" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "productConcentration" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "resilienceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "fragilityMap" JSONB,
    "stressTest" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fragility_assessments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organization_designs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT,
    "title" TEXT NOT NULL,
    "structure" TEXT NOT NULL DEFAULT '',
    "decisionRights" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "informationFlow" TEXT NOT NULL DEFAULT '',
    "coordinationCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "scalingRecommendations" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "designScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organization_designs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "management_twin_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT,
    "snapshot" JSONB,
    "accuracyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "management_twin_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organization_twin_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT,
    "snapshot" JSONB,
    "simulationResults" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organization_twin_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "management_coaching_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT,
    "blindSpots" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "growthAreas" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "coachingPlan" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "developmentPlan" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "management_coaching_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "personal_memories" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "kind" "PersonalMemoryKind" NOT NULL DEFAULT 'GENERAL',
    "source_type" TEXT NOT NULL DEFAULT '',
    "source_id" TEXT NOT NULL DEFAULT '',
    "title" TEXT NOT NULL DEFAULT '',
    "content" TEXT NOT NULL,
    "embedding" vector(1536),
    "metadata" JSONB,
    "importance" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "occurred_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "personal_memories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "naval_goals" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "statement" TEXT NOT NULL,
    "horizon" "GoalHorizon" NOT NULL DEFAULT 'FIVE_YEARS',
    "targetDate" TIMESTAMP(3),
    "why" TEXT NOT NULL DEFAULT '',
    "status" "NavalStatus" NOT NULL DEFAULT 'ACTIVE',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "naval_goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "naval_plans" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "goalId" TEXT,
    "headline" TEXT NOT NULL DEFAULT '',
    "northStar" TEXT NOT NULL DEFAULT '',
    "status" "NavalPlanStatus" NOT NULL DEFAULT 'ACTIVE',
    "progress" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "naval_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "naval_plan_tasks" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "month" INTEGER NOT NULL DEFAULT 1,
    "engine" TEXT NOT NULL DEFAULT '',
    "task" TEXT NOT NULL,
    "done" BOOLEAN NOT NULL DEFAULT false,
    "dueDate" TIMESTAMP(3),
    "order" INTEGER NOT NULL DEFAULT 0,
    "doneAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "naval_plan_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "naval_onboarding" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "currentStep" INTEGER NOT NULL DEFAULT 1,
    "completedSteps" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "status" "OnboardingStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "naval_onboarding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "naval_specific_knowledge_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "summary" TEXT NOT NULL DEFAULT '',
    "curiosityDepth" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "skillRarity" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "marketRelevance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "personalEnergy" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "compounding" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "score" DOUBLE PRECISION,
    "metadata" JSONB,
    "notes" TEXT,
    "source" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "naval_specific_knowledge_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "naval_specific_knowledge_assets" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "profileId" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "evidence" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "rarity" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "relevance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "score" DOUBLE PRECISION,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "naval_specific_knowledge_assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "naval_talent_stacks" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Talent stack',
    "combination" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "identityStack" TEXT NOT NULL DEFAULT '',
    "rarityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "defensibility" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "optionality" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "score" DOUBLE PRECISION,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "naval_talent_stacks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "naval_talent_signals" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "stackId" TEXT,
    "skill" TEXT NOT NULL,
    "depth" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "demand" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "evidence" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "naval_talent_signals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "naval_leverage_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "summary" TEXT NOT NULL DEFAULT '',
    "timeForMoney" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "score" DOUBLE PRECISION,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "naval_leverage_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "naval_leverage_sources" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "profileId" TEXT,
    "category" "LeverageCategory" NOT NULL,
    "usage" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "scalability" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ownership" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "risk" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "compounding" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "naval_leverage_sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "naval_judgment_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "predictionAccuracy" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "assumptionQuality" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "modelUsage" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "emotionalDiscipline" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "learningRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "blindSpots" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "score" DOUBLE PRECISION,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "naval_judgment_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "naval_decision_journal_entries" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "context" TEXT NOT NULL DEFAULT '',
    "options" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "assumptions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "expectedOutcome" TEXT NOT NULL DEFAULT '',
    "downsideRisk" TEXT NOT NULL DEFAULT '',
    "upsidePotential" TEXT NOT NULL DEFAULT '',
    "timeHorizon" TEXT NOT NULL DEFAULT '',
    "emotionalState" TEXT NOT NULL DEFAULT '',
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "modelsUsed" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "rationale" TEXT NOT NULL DEFAULT '',
    "reviewDate" TIMESTAMP(3),
    "status" "NavalStatus" NOT NULL DEFAULT 'ACTIVE',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "naval_decision_journal_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "naval_decision_journal_reviews" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "entryId" TEXT NOT NULL,
    "actualOutcome" TEXT NOT NULL DEFAULT '',
    "lessons" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "biasDetected" TEXT NOT NULL DEFAULT '',
    "expectedVsActual" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "naval_decision_journal_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "naval_wealth_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "summary" TEXT NOT NULL DEFAULT '',
    "ownershipRatio" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "assetQuality" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "durability" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "bottleneck" TEXT NOT NULL DEFAULT '',
    "score" DOUBLE PRECISION,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "naval_wealth_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "naval_wealth_assets" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "profileId" TEXT,
    "name" TEXT NOT NULL,
    "category" "AssetCategory" NOT NULL,
    "ownership" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "leverage" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "compounding" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "durability" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "score" DOUBLE PRECISION,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "naval_wealth_assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "naval_income_streams" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "profileId" TEXT,
    "name" TEXT NOT NULL,
    "kind" "IncomeKind" NOT NULL DEFAULT 'ACTIVE',
    "monthly" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "leverage" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "naval_income_streams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "naval_asset_build_plans" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "assetName" TEXT NOT NULL,
    "category" "AssetCategory" NOT NULL,
    "buildSteps" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "distribution" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "maintenance" TEXT NOT NULL DEFAULT '',
    "compounding" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "qualityScore" DOUBLE PRECISION,
    "status" "NavalStatus" NOT NULL DEFAULT 'DRAFT',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "naval_asset_build_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "naval_startup_opportunities" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "opportunityType" TEXT NOT NULL DEFAULT '',
    "problem" TEXT NOT NULL DEFAULT '',
    "market" TEXT NOT NULL DEFAULT '',
    "distribution" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "mvp" TEXT NOT NULL DEFAULT '',
    "fitScore" DOUBLE PRECISION,
    "status" "NavalStatus" NOT NULL DEFAULT 'DRAFT',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "naval_startup_opportunities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "naval_validation_experiments" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "opportunityId" TEXT,
    "hypothesis" TEXT NOT NULL,
    "test" TEXT NOT NULL DEFAULT '',
    "metric" TEXT NOT NULL DEFAULT '',
    "result" TEXT NOT NULL DEFAULT '',
    "validated" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "naval_validation_experiments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "naval_long_term_games" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "compounding" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "identityAlignment" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "relationshipQuality" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "reputationUpside" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "learningRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "shortTermTrapRisk" DOUBLE PRECISION NOT NULL DEFAULT 0.1,
    "score" DOUBLE PRECISION,
    "status" "NavalStatus" NOT NULL DEFAULT 'ACTIVE',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "naval_long_term_games_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "naval_freedom_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "timeFreedom" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "locationFreedom" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "financialResilience" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "psychologicalFreedom" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "optionality" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "score" DOUBLE PRECISION,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "naval_freedom_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "naval_freedom_constraints" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "profileId" TEXT,
    "dimension" "FreedomDimension" NOT NULL,
    "description" TEXT NOT NULL,
    "severity" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "dependency" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "naval_freedom_constraints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "naval_happiness_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "peace" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "health" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "relationships" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "autonomy" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "gratitude" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "desireLoad" DOUBLE PRECISION NOT NULL DEFAULT 0.3,
    "score" DOUBLE PRECISION,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "naval_happiness_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "naval_happiness_reflections" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "profileId" TEXT,
    "prompt" TEXT NOT NULL DEFAULT '',
    "entry" TEXT NOT NULL DEFAULT '',
    "practice" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "naval_happiness_reflections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "naval_life_portfolios" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "score" DOUBLE PRECISION,
    "imbalance" TEXT NOT NULL DEFAULT '',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "naval_life_portfolios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "naval_life_portfolio_areas" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "portfolioId" TEXT,
    "area" "PortfolioAreaType" NOT NULL,
    "current" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "target" DOUBLE PRECISION NOT NULL DEFAULT 0.7,
    "allocation" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "naval_life_portfolio_areas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "naval_score_snapshots" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "globalScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "specificKnowledge" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "talentStack" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "leverage" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "judgment" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "wealthCreation" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "longTermGame" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "freedom" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "happiness" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lifePortfolio" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "naval_score_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "naval_twin_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "summary" TEXT NOT NULL DEFAULT '',
    "strategy" JSONB,
    "driftScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "naval_twin_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "naval_twin_memories" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "twinId" TEXT,
    "kind" TEXT NOT NULL DEFAULT '',
    "content" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "naval_twin_memories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "naval_twin_insights" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "twinId" TEXT,
    "insight" TEXT NOT NULL,
    "kind" TEXT NOT NULL DEFAULT 'opportunity',
    "priority" INTEGER NOT NULL DEFAULT 3,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "naval_twin_insights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cbt_entries" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "activatingEvent" TEXT NOT NULL,
    "automaticThought" TEXT NOT NULL DEFAULT '',
    "distortionType" TEXT NOT NULL DEFAULT '',
    "beliefHierarchy" JSONB NOT NULL,
    "consequences" JSONB NOT NULL,
    "reframing" JSONB NOT NULL,
    "evidenceAgainst" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "severityScore" INTEGER NOT NULL DEFAULT 5,
    "beliefStrength" INTEGER NOT NULL DEFAULT 5,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cbt_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "driver_entries" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "driverCategory" TEXT NOT NULL,
    "surfaceProblem" TEXT NOT NULL,
    "deepEmotion" TEXT NOT NULL DEFAULT '',
    "hiddenDynamics" TEXT NOT NULL DEFAULT '',
    "behavioralCycle" JSONB NOT NULL,
    "coreBelief" TEXT NOT NULL DEFAULT '',
    "longTermRisk" TEXT NOT NULL DEFAULT '',
    "interventionPriority" INTEGER NOT NULL DEFAULT 3,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "driver_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "narrative_entries" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "narrativeType" "NarrativeType" NOT NULL,
    "narrativeTitle" TEXT NOT NULL,
    "identityThemes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "coreValues" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "coherenceScore" INTEGER NOT NULL DEFAULT 5,
    "agencyScore" INTEGER NOT NULL DEFAULT 5,
    "redemptionScore" INTEGER NOT NULL DEFAULT 5,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "narrative_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "formation_snapshots" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "stateVector" JSONB NOT NULL,
    "dimensions" JSONB NOT NULL,
    "dominantLoop" TEXT NOT NULL DEFAULT 'unknown',
    "trajectory" TEXT NOT NULL DEFAULT 'unknown',
    "formationArc" TEXT NOT NULL DEFAULT 'unknown',
    "driftDetected" BOOLEAN NOT NULL DEFAULT false,
    "alignmentTrend" TEXT NOT NULL DEFAULT 'stable',
    "narrative" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "formation_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "decision_discernments" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "decision" TEXT NOT NULL,
    "motiveProfile" JSONB NOT NULL,
    "dominantSource" TEXT NOT NULL,
    "guidancePriority" TEXT NOT NULL,
    "reasoning" TEXT NOT NULL DEFAULT '',
    "alternatives" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "reviewedOutcome" TEXT NOT NULL DEFAULT '',
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "decision_discernments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "persona_tags" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 0.6,
    "source" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "persona_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sfm_founder_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT,
    "founderIdentity" TEXT NOT NULL DEFAULT '',
    "founderValues" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "founderBeliefs" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "decisionStyle" TEXT NOT NULL DEFAULT '',
    "riskStyle" TEXT NOT NULL DEFAULT '',
    "learningStyle" TEXT NOT NULL DEFAULT '',
    "leadershipStyle" TEXT NOT NULL DEFAULT '',
    "creativityStyle" TEXT NOT NULL DEFAULT '',
    "executionStyle" TEXT NOT NULL DEFAULT '',
    "strengths" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "shadowRisks" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "dependencyMap" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sfm_founder_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sfm_business_missions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT,
    "statement" TEXT NOT NULL,
    "customerPain" TEXT NOT NULL DEFAULT '',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sfm_business_missions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sfm_company_identities" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT,
    "identityStatement" TEXT NOT NULL,
    "strategicPosition" TEXT NOT NULL DEFAULT '',
    "culturalIdentity" TEXT NOT NULL DEFAULT '',
    "enemyToAvoid" TEXT NOT NULL DEFAULT '',
    "promiseToCustomer" TEXT NOT NULL DEFAULT '',
    "internalSelfImage" TEXT NOT NULL DEFAULT '',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sfm_company_identities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sfm_core_values" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT,
    "value" TEXT NOT NULL,
    "rank" INTEGER NOT NULL DEFAULT 0,
    "operatingPrinciple" TEXT NOT NULL DEFAULT '',
    "dilutionRisk" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sfm_core_values_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sfm_success_factors" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "category" "SuccessFactorCategory" NOT NULL,
    "evidence" TEXT NOT NULL DEFAULT '',
    "repeatabilityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "founderDependencyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "scalabilityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "riskIfLost" TEXT NOT NULL DEFAULT '',
    "replicationMethod" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sfm_success_factors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sfm_founder_patterns" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT,
    "pattern" TEXT NOT NULL,
    "domain" TEXT NOT NULL DEFAULT '',
    "founderDependency" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sfm_founder_patterns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sfm_business_patterns" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT,
    "pattern" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT '',
    "repeatability" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sfm_business_patterns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sfm_decision_rules" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT,
    "rule" TEXT NOT NULL,
    "context" TEXT NOT NULL DEFAULT '',
    "examples" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "antiPatterns" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sfm_decision_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sfm_operating_principles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT,
    "principle" TEXT NOT NULL,
    "whyItMatters" TEXT NOT NULL DEFAULT '',
    "decisionContext" TEXT NOT NULL DEFAULT '',
    "examples" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "antiPatterns" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "enforcement" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sfm_operating_principles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sfm_scaling_bottlenecks" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT,
    "bottleneckType" "BottleneckType" NOT NULL,
    "severity" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "rootCause" TEXT NOT NULL DEFAULT '',
    "affectedSystems" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "intervention" TEXT NOT NULL DEFAULT '',
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sfm_scaling_bottlenecks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sfm_team_alignments" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT,
    "area" TEXT NOT NULL,
    "alignmentScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "notes" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sfm_team_alignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sfm_leadership_patterns" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT,
    "pattern" TEXT NOT NULL,
    "maturityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "blindSpots" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sfm_leadership_patterns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "culture_rituals" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT,
    "name" TEXT NOT NULL,
    "purpose" TEXT NOT NULL DEFAULT '',
    "cadence" TEXT NOT NULL DEFAULT '',
    "reinforcesValue" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "culture_rituals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sfm_collaboration_patterns" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT,
    "dimension" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "friction" TEXT NOT NULL DEFAULT '',
    "upgrade" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sfm_collaboration_patterns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sfm_resilience_patterns" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT,
    "dimension" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "fragility" TEXT NOT NULL DEFAULT '',
    "upgrade" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sfm_resilience_patterns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sfm_system_blueprints" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT,
    "title" TEXT NOT NULL,
    "preserve" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "standardize" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "delegate" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "automate" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "teach" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "measure" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "protect" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sfm_system_blueprints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sfm_replication_playbooks" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT,
    "title" TEXT NOT NULL,
    "transferPlan" TEXT NOT NULL DEFAULT '',
    "hiringPlaybook" TEXT NOT NULL DEFAULT '',
    "onboardingPlaybook" TEXT NOT NULL DEFAULT '',
    "culturePlaybook" TEXT NOT NULL DEFAULT '',
    "decisionPlaybook" TEXT NOT NULL DEFAULT '',
    "scalingPlaybook" TEXT NOT NULL DEFAULT '',
    "readinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sfm_replication_playbooks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sfm_org_health_snapshots" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT,
    "founderDependency" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "repeatability" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "scalability" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "valuesAlignment" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "decisionConsistency" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "collaborationQuality" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "leadershipMaturity" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "resilience" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "replicationReadiness" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "organizationalHealth" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sfm_org_health_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "worldview_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reality" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "humanNature" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "meaning" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "success" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "failure" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "responsibility" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "time" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "change" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "risk" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "purpose" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "clarityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "coherenceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "globalScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "stage" "WorldviewStage" NOT NULL DEFAULT 'QUESTIONED',
    "summary" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "worldview_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "worldview_assumption_conflicts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "valueOrGoal" TEXT NOT NULL,
    "assumption" TEXT NOT NULL,
    "conflict" TEXT NOT NULL DEFAULT '',
    "severity" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "resolution" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "worldview_assumption_conflicts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "worldview_archetypes" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mission" TEXT NOT NULL DEFAULT '',
    "coreAssumptions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "values" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "blindSpots" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "growthOpportunities" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "worldview_archetypes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "worldview_meaning_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "work" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "learning" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "relationships" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "contribution" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "mastery" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "legacy" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "meaningScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "summary" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "worldview_meaning_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "worldview_personal_philosophies" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "philosophy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "worldview_personal_philosophies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "worldview_life_principles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "principle" TEXT NOT NULL,
    "rationale" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "worldview_life_principles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "worldview_twins" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "snapshot" JSONB,
    "driftDetected" BOOLEAN NOT NULL DEFAULT false,
    "evolutionSuggestions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "worldview_twins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "worldview_evolutions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "stage" "WorldviewStage" NOT NULL,
    "note" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "worldview_evolutions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "audiobooks_slug_key" ON "audiobooks"("slug");

-- CreateIndex
CREATE INDEX "audiobooks_relatedModule_idx" ON "audiobooks"("relatedModule");

-- CreateIndex
CREATE INDEX "audiobooks_sourceType_idx" ON "audiobooks"("sourceType");

-- CreateIndex
CREATE INDEX "audiobooks_ownerUserId_idx" ON "audiobooks"("ownerUserId");

-- CreateIndex
CREATE INDEX "listening_progress_userId_idx" ON "listening_progress"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "listening_progress_userId_bookId_key" ON "listening_progress"("userId", "bookId");

-- CreateIndex
CREATE INDEX "listening_sessions_userId_idx" ON "listening_sessions"("userId");

-- CreateIndex
CREATE INDEX "listening_sessions_bookId_idx" ON "listening_sessions"("bookId");

-- CreateIndex
CREATE INDEX "book_notes_userId_idx" ON "book_notes"("userId");

-- CreateIndex
CREATE INDEX "book_notes_bookId_idx" ON "book_notes"("bookId");

-- CreateIndex
CREATE INDEX "child_profiles_userId_idx" ON "child_profiles"("userId");

-- CreateIndex
CREATE INDEX "child_identities_childId_idx" ON "child_identities"("childId");

-- CreateIndex
CREATE INDEX "child_assessments_childId_idx" ON "child_assessments"("childId");

-- CreateIndex
CREATE INDEX "child_assessments_createdAt_idx" ON "child_assessments"("createdAt");

-- CreateIndex
CREATE INDEX "child_growth_mindset_logs_childId_idx" ON "child_growth_mindset_logs"("childId");

-- CreateIndex
CREATE INDEX "child_curiosity_logs_childId_idx" ON "child_curiosity_logs"("childId");

-- CreateIndex
CREATE INDEX "child_creativity_projects_childId_idx" ON "child_creativity_projects"("childId");

-- CreateIndex
CREATE INDEX "child_learning_environments_childId_idx" ON "child_learning_environments"("childId");

-- CreateIndex
CREATE INDEX "child_learning_environments_createdAt_idx" ON "child_learning_environments"("createdAt");

-- CreateIndex
CREATE INDEX "child_learning_autonomy_logs_childId_idx" ON "child_learning_autonomy_logs"("childId");

-- CreateIndex
CREATE INDEX "child_learning_autonomy_logs_createdAt_idx" ON "child_learning_autonomy_logs"("createdAt");

-- CreateIndex
CREATE INDEX "child_problem_solving_logs_childId_idx" ON "child_problem_solving_logs"("childId");

-- CreateIndex
CREATE INDEX "child_projects_childId_idx" ON "child_projects"("childId");

-- CreateIndex
CREATE INDEX "child_resilience_logs_childId_idx" ON "child_resilience_logs"("childId");

-- CreateIndex
CREATE INDEX "child_resilience_logs_createdAt_idx" ON "child_resilience_logs"("createdAt");

-- CreateIndex
CREATE INDEX "child_parent_coaching_sessions_userId_idx" ON "child_parent_coaching_sessions"("userId");

-- CreateIndex
CREATE INDEX "child_parent_coaching_sessions_childId_idx" ON "child_parent_coaching_sessions"("childId");

-- CreateIndex
CREATE INDEX "child_identity_snapshots_childId_idx" ON "child_identity_snapshots"("childId");

-- CreateIndex
CREATE INDEX "child_identity_snapshots_createdAt_idx" ON "child_identity_snapshots"("createdAt");

-- CreateIndex
CREATE INDEX "child_development_snapshots_childId_idx" ON "child_development_snapshots"("childId");

-- CreateIndex
CREATE INDEX "child_development_snapshots_createdAt_idx" ON "child_development_snapshots"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "cog_models_slug_key" ON "cog_models"("slug");

-- CreateIndex
CREATE INDEX "cog_models_category_idx" ON "cog_models"("category");

-- CreateIndex
CREATE INDEX "cog_model_relationships_fromSlug_idx" ON "cog_model_relationships"("fromSlug");

-- CreateIndex
CREATE INDEX "cog_model_examples_modelSlug_idx" ON "cog_model_examples"("modelSlug");

-- CreateIndex
CREATE UNIQUE INDEX "cog_decision_lenses_slug_key" ON "cog_decision_lenses"("slug");

-- CreateIndex
CREATE INDEX "cog_decision_lens_results_userId_idx" ON "cog_decision_lens_results"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "cog_biases_slug_key" ON "cog_biases"("slug");

-- CreateIndex
CREATE INDEX "cog_bias_events_userId_idx" ON "cog_bias_events"("userId");

-- CreateIndex
CREATE INDEX "cog_judgment_profiles_userId_idx" ON "cog_judgment_profiles"("userId");

-- CreateIndex
CREATE INDEX "cog_judgment_assessments_userId_idx" ON "cog_judgment_assessments"("userId");

-- CreateIndex
CREATE INDEX "cog_judgment_assessments_createdAt_idx" ON "cog_judgment_assessments"("createdAt");

-- CreateIndex
CREATE INDEX "cog_decision_journals_userId_idx" ON "cog_decision_journals"("userId");

-- CreateIndex
CREATE INDEX "cog_decision_assumptions_journalId_idx" ON "cog_decision_assumptions"("journalId");

-- CreateIndex
CREATE INDEX "cog_decision_outcomes_journalId_idx" ON "cog_decision_outcomes"("journalId");

-- CreateIndex
CREATE INDEX "cog_decision_reviews_userId_idx" ON "cog_decision_reviews"("userId");

-- CreateIndex
CREATE INDEX "cog_decision_reviews_journalId_idx" ON "cog_decision_reviews"("journalId");

-- CreateIndex
CREATE INDEX "cog_latticeworks_userId_idx" ON "cog_latticeworks"("userId");

-- CreateIndex
CREATE INDEX "cog_latticework_nodes_latticeworkId_idx" ON "cog_latticework_nodes"("latticeworkId");

-- CreateIndex
CREATE INDEX "cog_latticework_edges_latticeworkId_idx" ON "cog_latticework_edges"("latticeworkId");

-- CreateIndex
CREATE INDEX "cog_cognitive_profiles_userId_idx" ON "cog_cognitive_profiles"("userId");

-- CreateIndex
CREATE INDEX "cog_thinking_patterns_userId_idx" ON "cog_thinking_patterns"("userId");

-- CreateIndex
CREATE INDEX "cog_reasoning_styles_userId_idx" ON "cog_reasoning_styles"("userId");

-- CreateIndex
CREATE INDEX "cog_uncertainty_assessments_userId_idx" ON "cog_uncertainty_assessments"("userId");

-- CreateIndex
CREATE INDEX "cog_uncertainty_assessments_createdAt_idx" ON "cog_uncertainty_assessments"("createdAt");

-- CreateIndex
CREATE INDEX "cog_optionalities_userId_idx" ON "cog_optionalities"("userId");

-- CreateIndex
CREATE INDEX "cog_tail_risks_userId_idx" ON "cog_tail_risks"("userId");

-- CreateIndex
CREATE INDEX "cog_diagnoses_userId_idx" ON "cog_diagnoses"("userId");

-- CreateIndex
CREATE INDEX "cog_root_causes_diagnosisId_idx" ON "cog_root_causes"("diagnosisId");

-- CreateIndex
CREATE INDEX "cog_leverage_points_diagnosisId_idx" ON "cog_leverage_points"("diagnosisId");

-- CreateIndex
CREATE INDEX "cog_wisdom_insights_userId_idx" ON "cog_wisdom_insights"("userId");

-- CreateIndex
CREATE INDEX "cog_wisdom_insights_createdAt_idx" ON "cog_wisdom_insights"("createdAt");

-- CreateIndex
CREATE INDEX "cog_personal_principles_userId_idx" ON "cog_personal_principles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "personality_states_userId_key" ON "personality_states"("userId");

-- CreateIndex
CREATE INDEX "personality_transitions_userId_createdAt_idx" ON "personality_transitions"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "worldviews_userId_idx" ON "worldviews"("userId");

-- CreateIndex
CREATE INDEX "worldview_dimensions_worldviewId_idx" ON "worldview_dimensions"("worldviewId");

-- CreateIndex
CREATE INDEX "worldview_assessments_userId_idx" ON "worldview_assessments"("userId");

-- CreateIndex
CREATE INDEX "missions_userId_idx" ON "missions"("userId");

-- CreateIndex
CREATE INDEX "visions_userId_idx" ON "visions"("userId");

-- CreateIndex
CREATE INDEX "life_themes_userId_idx" ON "life_themes"("userId");

-- CreateIndex
CREATE INDEX "constitutions_userId_idx" ON "constitutions"("userId");

-- CreateIndex
CREATE INDEX "identities_userId_idx" ON "identities"("userId");

-- CreateIndex
CREATE INDEX "roles_userId_idx" ON "roles"("userId");

-- CreateIndex
CREATE INDEX "identity_scores_identityId_date_idx" ON "identity_scores"("identityId", "date");

-- CreateIndex
CREATE INDEX "identity_history_userId_date_idx" ON "identity_history"("userId", "date");

-- CreateIndex
CREATE INDEX "values_userId_idx" ON "values"("userId");

-- CreateIndex
CREATE INDEX "value_rankings_userId_rank_idx" ON "value_rankings"("userId", "rank");

-- CreateIndex
CREATE UNIQUE INDEX "value_rankings_userId_valueId_key" ON "value_rankings"("userId", "valueId");

-- CreateIndex
CREATE INDEX "value_conflicts_userId_idx" ON "value_conflicts"("userId");

-- CreateIndex
CREATE INDEX "mental_models_userId_category_idx" ON "mental_models"("userId", "category");

-- CreateIndex
CREATE UNIQUE INDEX "mental_models_userId_name_key" ON "mental_models"("userId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "model_connections_fromModelId_toModelId_relation_key" ON "model_connections"("fromModelId", "toModelId", "relation");

-- CreateIndex
CREATE INDEX "model_usage_logs_userId_date_idx" ON "model_usage_logs"("userId", "date");

-- CreateIndex
CREATE INDEX "model_usage_logs_modelId_idx" ON "model_usage_logs"("modelId");

-- CreateIndex
CREATE INDEX "first_principle_maps_userId_idx" ON "first_principle_maps"("userId");

-- CreateIndex
CREATE INDEX "assumptions_userId_idx" ON "assumptions"("userId");

-- CreateIndex
CREATE INDEX "root_causes_userId_idx" ON "root_causes"("userId");

-- CreateIndex
CREATE INDEX "constraints_userId_idx" ON "constraints"("userId");

-- CreateIndex
CREATE INDEX "decisions_userId_idx" ON "decisions"("userId");

-- CreateIndex
CREATE INDEX "decision_options_decisionId_idx" ON "decision_options"("decisionId");

-- CreateIndex
CREATE INDEX "decision_reviews_decisionId_idx" ON "decision_reviews"("decisionId");

-- CreateIndex
CREATE INDEX "role_models_userId_idx" ON "role_models"("userId");

-- CreateIndex
CREATE INDEX "identity_patterns_roleModelId_idx" ON "identity_patterns"("roleModelId");

-- CreateIndex
CREATE INDEX "decision_patterns_roleModelId_idx" ON "decision_patterns"("roleModelId");

-- CreateIndex
CREATE INDEX "habit_patterns_roleModelId_idx" ON "habit_patterns"("roleModelId");

-- CreateIndex
CREATE INDEX "habits_userId_idx" ON "habits"("userId");

-- CreateIndex
CREATE INDEX "habit_logs_habitId_date_idx" ON "habit_logs"("habitId", "date");

-- CreateIndex
CREATE INDEX "habit_identity_links_habitId_idx" ON "habit_identity_links"("habitId");

-- CreateIndex
CREATE UNIQUE INDEX "habit_identity_links_habitId_identityId_key" ON "habit_identity_links"("habitId", "identityId");

-- CreateIndex
CREATE INDEX "shadow_patterns_userId_type_idx" ON "shadow_patterns"("userId", "type");

-- CreateIndex
CREATE INDEX "shadow_events_userId_date_idx" ON "shadow_events"("userId", "date");

-- CreateIndex
CREATE INDEX "interventions_userId_idx" ON "interventions"("userId");

-- CreateIndex
CREATE INDEX "reflections_userId_date_idx" ON "reflections"("userId", "date");

-- CreateIndex
CREATE INDEX "lessons_userId_idx" ON "lessons"("userId");

-- CreateIndex
CREATE INDEX "reviews_userId_period_idx" ON "reviews"("userId", "period");

-- CreateIndex
CREATE UNIQUE INDEX "reviews_userId_period_periodKey_key" ON "reviews"("userId", "period", "periodKey");

-- CreateIndex
CREATE INDEX "skills_userId_idx" ON "skills"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "mastery_levels_skillId_key" ON "mastery_levels"("skillId");

-- CreateIndex
CREATE INDEX "skill_progress_skillId_date_idx" ON "skill_progress"("skillId", "date");

-- CreateIndex
CREATE INDEX "leadership_metrics_userId_date_idx" ON "leadership_metrics"("userId", "date");

-- CreateIndex
CREATE INDEX "influence_logs_userId_idx" ON "influence_logs"("userId");

-- CreateIndex
CREATE INDEX "legacy_projects_userId_idx" ON "legacy_projects"("userId");

-- CreateIndex
CREATE INDEX "mentees_userId_idx" ON "mentees"("userId");

-- CreateIndex
CREATE INDEX "knowledge_assets_userId_idx" ON "knowledge_assets"("userId");

-- CreateIndex
CREATE INDEX "score_snapshots_userId_kind_date_idx" ON "score_snapshots"("userId", "kind", "date");

-- CreateIndex
CREATE INDEX "domain_events_userId_occurredAt_idx" ON "domain_events"("userId", "occurredAt");

-- CreateIndex
CREATE INDEX "domain_events_aggregateType_aggregateId_idx" ON "domain_events"("aggregateType", "aggregateId");

-- CreateIndex
CREATE INDEX "beliefs_userId_type_idx" ON "beliefs"("userId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "limiting_beliefs_beliefId_key" ON "limiting_beliefs"("beliefId");

-- CreateIndex
CREATE UNIQUE INDEX "empowering_beliefs_beliefId_key" ON "empowering_beliefs"("beliefId");

-- CreateIndex
CREATE INDEX "belief_reframes_beliefId_idx" ON "belief_reframes"("beliefId");

-- CreateIndex
CREATE INDEX "belief_change_logs_userId_idx" ON "belief_change_logs"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "digital_twin_profiles_userId_key" ON "digital_twin_profiles"("userId");

-- CreateIndex
CREATE INDEX "twin_memories_userId_createdAt_idx" ON "twin_memories"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "twin_insights_userId_createdAt_idx" ON "twin_insights"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "drift_predictions_userId_createdAt_idx" ON "drift_predictions"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "geniuses_name_key" ON "geniuses"("name");

-- CreateIndex
CREATE INDEX "genius_strategies_geniusId_idx" ON "genius_strategies"("geniusId");

-- CreateIndex
CREATE INDEX "strategy_adoptions_userId_idx" ON "strategy_adoptions"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "strategy_adoptions_userId_strategyId_key" ON "strategy_adoptions"("userId", "strategyId");

-- CreateIndex
CREATE INDEX "genius_practice_logs_adoptionId_date_idx" ON "genius_practice_logs"("adoptionId", "date");

-- CreateIndex
CREATE INDEX "blueprint_adaptations_userId_idx" ON "blueprint_adaptations"("userId");

-- CreateIndex
CREATE INDEX "learning_paths_userId_idx" ON "learning_paths"("userId");

-- CreateIndex
CREATE INDEX "learning_steps_pathId_order_idx" ON "learning_steps"("pathId", "order");

-- CreateIndex
CREATE INDEX "community_posts_userId_idx" ON "community_posts"("userId");

-- CreateIndex
CREATE INDEX "community_posts_createdAt_idx" ON "community_posts"("createdAt");

-- CreateIndex
CREATE INDEX "post_comments_postId_createdAt_idx" ON "post_comments"("postId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "memberships_userId_key" ON "memberships"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "membership_orders_outTradeNo_key" ON "membership_orders"("outTradeNo");

-- CreateIndex
CREATE INDEX "membership_orders_userId_idx" ON "membership_orders"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "store_products_slug_key" ON "store_products"("slug");

-- CreateIndex
CREATE INDEX "store_products_kind_idx" ON "store_products"("kind");

-- CreateIndex
CREATE INDEX "store_products_active_sortOrder_idx" ON "store_products"("active", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "store_orders_outTradeNo_key" ON "store_orders"("outTradeNo");

-- CreateIndex
CREATE INDEX "store_orders_userId_idx" ON "store_orders"("userId");

-- CreateIndex
CREATE INDEX "store_orders_status_idx" ON "store_orders"("status");

-- CreateIndex
CREATE INDEX "store_orders_createdAt_idx" ON "store_orders"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "user_credits_userId_key" ON "user_credits"("userId");

-- CreateIndex
CREATE INDEX "credit_ledgers_userId_idx" ON "credit_ledgers"("userId");

-- CreateIndex
CREATE INDEX "credit_ledgers_orderId_idx" ON "credit_ledgers"("orderId");

-- CreateIndex
CREATE INDEX "content_unlocks_userId_idx" ON "content_unlocks"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "content_unlocks_userId_contentKey_key" ON "content_unlocks"("userId", "contentKey");

-- CreateIndex
CREATE UNIQUE INDEX "identity_families_slug_key" ON "identity_families"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "identity_archetypes_slug_key" ON "identity_archetypes"("slug");

-- CreateIndex
CREATE INDEX "identity_archetypes_familyId_idx" ON "identity_archetypes"("familyId");

-- CreateIndex
CREATE INDEX "identity_values_archetypeId_idx" ON "identity_values"("archetypeId");

-- CreateIndex
CREATE INDEX "identity_beliefs_archetypeId_idx" ON "identity_beliefs"("archetypeId");

-- CreateIndex
CREATE INDEX "identity_habits_archetypeId_idx" ON "identity_habits"("archetypeId");

-- CreateIndex
CREATE INDEX "identity_capabilities_archetypeId_idx" ON "identity_capabilities"("archetypeId");

-- CreateIndex
CREATE INDEX "identity_mental_models_archetypeId_idx" ON "identity_mental_models"("archetypeId");

-- CreateIndex
CREATE INDEX "identity_shadow_patterns_archetypeId_idx" ON "identity_shadow_patterns"("archetypeId");

-- CreateIndex
CREATE INDEX "identity_failure_modes_archetypeId_idx" ON "identity_failure_modes"("archetypeId");

-- CreateIndex
CREATE INDEX "identity_evolution_paths_archetypeId_idx" ON "identity_evolution_paths"("archetypeId");

-- CreateIndex
CREATE INDEX "user_identity_stacks_userId_idx" ON "user_identity_stacks"("userId");

-- CreateIndex
CREATE INDEX "identity_recommendations_userId_idx" ON "identity_recommendations"("userId");

-- CreateIndex
CREATE INDEX "identity_conflicts_userId_idx" ON "identity_conflicts"("userId");

-- CreateIndex
CREATE INDEX "identity_assessments_userId_idx" ON "identity_assessments"("userId");

-- CreateIndex
CREATE INDEX "identity_assessments_createdAt_idx" ON "identity_assessments"("createdAt");

-- CreateIndex
CREATE INDEX "identity_evolution_snapshots_userId_idx" ON "identity_evolution_snapshots"("userId");

-- CreateIndex
CREATE INDEX "identity_evolution_snapshots_createdAt_idx" ON "identity_evolution_snapshots"("createdAt");

-- CreateIndex
CREATE INDEX "leadership_profiles_userId_idx" ON "leadership_profiles"("userId");

-- CreateIndex
CREATE INDEX "leadership_profiles_organizationId_idx" ON "leadership_profiles"("organizationId");

-- CreateIndex
CREATE INDEX "leadership_assessments_userId_idx" ON "leadership_assessments"("userId");

-- CreateIndex
CREATE INDEX "leadership_assessments_organizationId_idx" ON "leadership_assessments"("organizationId");

-- CreateIndex
CREATE INDEX "leadership_assessments_createdAt_idx" ON "leadership_assessments"("createdAt");

-- CreateIndex
CREATE INDEX "leadership_leverage_maps_userId_idx" ON "leadership_leverage_maps"("userId");

-- CreateIndex
CREATE INDEX "leadership_leverage_maps_organizationId_idx" ON "leadership_leverage_maps"("organizationId");

-- CreateIndex
CREATE INDEX "leadership_conversations_userId_idx" ON "leadership_conversations"("userId");

-- CreateIndex
CREATE INDEX "leadership_conversations_organizationId_idx" ON "leadership_conversations"("organizationId");

-- CreateIndex
CREATE INDEX "leadership_identity_sponsorships_userId_idx" ON "leadership_identity_sponsorships"("userId");

-- CreateIndex
CREATE INDEX "leadership_identity_sponsorships_organizationId_idx" ON "leadership_identity_sponsorships"("organizationId");

-- CreateIndex
CREATE INDEX "leadership_vision_statements_userId_idx" ON "leadership_vision_statements"("userId");

-- CreateIndex
CREATE INDEX "leadership_vision_statements_organizationId_idx" ON "leadership_vision_statements"("organizationId");

-- CreateIndex
CREATE INDEX "leadership_vision_alignment_userId_idx" ON "leadership_vision_alignment"("userId");

-- CreateIndex
CREATE INDEX "leadership_vision_alignment_organizationId_idx" ON "leadership_vision_alignment"("organizationId");

-- CreateIndex
CREATE INDEX "leadership_vision_alignment_createdAt_idx" ON "leadership_vision_alignment"("createdAt");

-- CreateIndex
CREATE INDEX "leadership_belonging_assessments_userId_idx" ON "leadership_belonging_assessments"("userId");

-- CreateIndex
CREATE INDEX "leadership_belonging_assessments_organizationId_idx" ON "leadership_belonging_assessments"("organizationId");

-- CreateIndex
CREATE INDEX "leadership_belonging_assessments_createdAt_idx" ON "leadership_belonging_assessments"("createdAt");

-- CreateIndex
CREATE INDEX "leadership_alignment_assessments_userId_idx" ON "leadership_alignment_assessments"("userId");

-- CreateIndex
CREATE INDEX "leadership_alignment_assessments_organizationId_idx" ON "leadership_alignment_assessments"("organizationId");

-- CreateIndex
CREATE INDEX "leadership_future_leaders_userId_idx" ON "leadership_future_leaders"("userId");

-- CreateIndex
CREATE INDEX "leadership_future_leaders_organizationId_idx" ON "leadership_future_leaders"("organizationId");

-- CreateIndex
CREATE INDEX "leadership_pipelines_userId_idx" ON "leadership_pipelines"("userId");

-- CreateIndex
CREATE INDEX "leadership_pipelines_organizationId_idx" ON "leadership_pipelines"("organizationId");

-- CreateIndex
CREATE INDEX "leadership_culture_blueprints_userId_idx" ON "leadership_culture_blueprints"("userId");

-- CreateIndex
CREATE INDEX "leadership_culture_blueprints_organizationId_idx" ON "leadership_culture_blueprints"("organizationId");

-- CreateIndex
CREATE INDEX "leadership_awakening_sessions_userId_idx" ON "leadership_awakening_sessions"("userId");

-- CreateIndex
CREATE INDEX "leadership_awakening_sessions_organizationId_idx" ON "leadership_awakening_sessions"("organizationId");

-- CreateIndex
CREATE INDEX "leadership_growth_plans_userId_idx" ON "leadership_growth_plans"("userId");

-- CreateIndex
CREATE INDEX "leadership_growth_plans_organizationId_idx" ON "leadership_growth_plans"("organizationId");

-- CreateIndex
CREATE INDEX "management_profiles_userId_idx" ON "management_profiles"("userId");

-- CreateIndex
CREATE INDEX "management_profiles_organizationId_idx" ON "management_profiles"("organizationId");

-- CreateIndex
CREATE INDEX "management_assessments_userId_idx" ON "management_assessments"("userId");

-- CreateIndex
CREATE INDEX "management_assessments_organizationId_idx" ON "management_assessments"("organizationId");

-- CreateIndex
CREATE INDEX "management_assessments_createdAt_idx" ON "management_assessments"("createdAt");

-- CreateIndex
CREATE INDEX "management_activities_userId_idx" ON "management_activities"("userId");

-- CreateIndex
CREATE INDEX "management_activities_organizationId_idx" ON "management_activities"("organizationId");

-- CreateIndex
CREATE INDEX "management_activities_tier_idx" ON "management_activities"("tier");

-- CreateIndex
CREATE INDEX "leverage_logs_userId_idx" ON "leverage_logs"("userId");

-- CreateIndex
CREATE INDEX "leverage_logs_organizationId_idx" ON "leverage_logs"("organizationId");

-- CreateIndex
CREATE INDEX "leverage_logs_createdAt_idx" ON "leverage_logs"("createdAt");

-- CreateIndex
CREATE INDEX "knowledge_worker_profiles_userId_idx" ON "knowledge_worker_profiles"("userId");

-- CreateIndex
CREATE INDEX "knowledge_worker_profiles_organizationId_idx" ON "knowledge_worker_profiles"("organizationId");

-- CreateIndex
CREATE INDEX "mgmt_knowledge_assets_userId_idx" ON "mgmt_knowledge_assets"("userId");

-- CreateIndex
CREATE INDEX "mgmt_knowledge_assets_organizationId_idx" ON "mgmt_knowledge_assets"("organizationId");

-- CreateIndex
CREATE INDEX "mgmt_knowledge_assets_kind_idx" ON "mgmt_knowledge_assets"("kind");

-- CreateIndex
CREATE INDEX "management_playbooks_userId_idx" ON "management_playbooks"("userId");

-- CreateIndex
CREATE INDEX "management_playbooks_organizationId_idx" ON "management_playbooks"("organizationId");

-- CreateIndex
CREATE INDEX "management_prompt_libraries_userId_idx" ON "management_prompt_libraries"("userId");

-- CreateIndex
CREATE INDEX "management_prompt_libraries_organizationId_idx" ON "management_prompt_libraries"("organizationId");

-- CreateIndex
CREATE INDEX "organizational_memories_userId_idx" ON "organizational_memories"("userId");

-- CreateIndex
CREATE INDEX "organizational_memories_organizationId_idx" ON "organizational_memories"("organizationId");

-- CreateIndex
CREATE INDEX "organizational_memories_kind_idx" ON "organizational_memories"("kind");

-- CreateIndex
CREATE INDEX "management_decision_governance_userId_idx" ON "management_decision_governance"("userId");

-- CreateIndex
CREATE INDEX "management_decision_governance_organizationId_idx" ON "management_decision_governance"("organizationId");

-- CreateIndex
CREATE INDEX "management_decision_governance_createdAt_idx" ON "management_decision_governance"("createdAt");

-- CreateIndex
CREATE INDEX "organizational_health_userId_idx" ON "organizational_health"("userId");

-- CreateIndex
CREATE INDEX "organizational_health_organizationId_idx" ON "organizational_health"("organizationId");

-- CreateIndex
CREATE INDEX "organizational_health_createdAt_idx" ON "organizational_health"("createdAt");

-- CreateIndex
CREATE INDEX "fragility_assessments_userId_idx" ON "fragility_assessments"("userId");

-- CreateIndex
CREATE INDEX "fragility_assessments_organizationId_idx" ON "fragility_assessments"("organizationId");

-- CreateIndex
CREATE INDEX "fragility_assessments_createdAt_idx" ON "fragility_assessments"("createdAt");

-- CreateIndex
CREATE INDEX "organization_designs_userId_idx" ON "organization_designs"("userId");

-- CreateIndex
CREATE INDEX "organization_designs_organizationId_idx" ON "organization_designs"("organizationId");

-- CreateIndex
CREATE INDEX "management_twin_profiles_userId_idx" ON "management_twin_profiles"("userId");

-- CreateIndex
CREATE INDEX "management_twin_profiles_organizationId_idx" ON "management_twin_profiles"("organizationId");

-- CreateIndex
CREATE INDEX "organization_twin_profiles_userId_idx" ON "organization_twin_profiles"("userId");

-- CreateIndex
CREATE INDEX "organization_twin_profiles_organizationId_idx" ON "organization_twin_profiles"("organizationId");

-- CreateIndex
CREATE INDEX "management_coaching_sessions_userId_idx" ON "management_coaching_sessions"("userId");

-- CreateIndex
CREATE INDEX "management_coaching_sessions_organizationId_idx" ON "management_coaching_sessions"("organizationId");

-- CreateIndex
CREATE INDEX "personal_memories_user_id_kind_created_at_idx" ON "personal_memories"("user_id", "kind", "created_at");

-- CreateIndex
CREATE INDEX "personal_memories_source_type_source_id_idx" ON "personal_memories"("source_type", "source_id");

-- CreateIndex
CREATE UNIQUE INDEX "personal_memories_user_id_source_type_source_id_kind_key" ON "personal_memories"("user_id", "source_type", "source_id", "kind");

-- ANN index for semantic memory recall. Lists=100 is conservative for small/medium personal datasets.
CREATE INDEX "personal_memories_embedding_cosine_idx" ON "personal_memories" USING ivfflat ("embedding" vector_cosine_ops) WITH (lists = 100);

-- CreateIndex
CREATE INDEX "naval_goals_userId_idx" ON "naval_goals"("userId");

-- CreateIndex
CREATE INDEX "naval_goals_status_idx" ON "naval_goals"("status");

-- CreateIndex
CREATE INDEX "naval_goals_createdAt_idx" ON "naval_goals"("createdAt");

-- CreateIndex
CREATE INDEX "naval_plans_userId_idx" ON "naval_plans"("userId");

-- CreateIndex
CREATE INDEX "naval_plans_status_idx" ON "naval_plans"("status");

-- CreateIndex
CREATE INDEX "naval_plans_createdAt_idx" ON "naval_plans"("createdAt");

-- CreateIndex
CREATE INDEX "naval_plan_tasks_userId_idx" ON "naval_plan_tasks"("userId");

-- CreateIndex
CREATE INDEX "naval_plan_tasks_planId_idx" ON "naval_plan_tasks"("planId");

-- CreateIndex
CREATE INDEX "naval_plan_tasks_done_idx" ON "naval_plan_tasks"("done");

-- CreateIndex
CREATE UNIQUE INDEX "naval_onboarding_userId_key" ON "naval_onboarding"("userId");

-- CreateIndex
CREATE INDEX "naval_onboarding_userId_idx" ON "naval_onboarding"("userId");

-- CreateIndex
CREATE INDEX "naval_onboarding_status_idx" ON "naval_onboarding"("status");

-- CreateIndex
CREATE INDEX "naval_specific_knowledge_profiles_userId_idx" ON "naval_specific_knowledge_profiles"("userId");

-- CreateIndex
CREATE INDEX "naval_specific_knowledge_profiles_userId_score_idx" ON "naval_specific_knowledge_profiles"("userId", "score");

-- CreateIndex
CREATE INDEX "naval_specific_knowledge_assets_userId_idx" ON "naval_specific_knowledge_assets"("userId");

-- CreateIndex
CREATE INDEX "naval_talent_stacks_userId_idx" ON "naval_talent_stacks"("userId");

-- CreateIndex
CREATE INDEX "naval_talent_signals_userId_idx" ON "naval_talent_signals"("userId");

-- CreateIndex
CREATE INDEX "naval_leverage_profiles_userId_idx" ON "naval_leverage_profiles"("userId");

-- CreateIndex
CREATE INDEX "naval_leverage_sources_userId_idx" ON "naval_leverage_sources"("userId");

-- CreateIndex
CREATE INDEX "naval_leverage_sources_userId_category_idx" ON "naval_leverage_sources"("userId", "category");

-- CreateIndex
CREATE INDEX "naval_judgment_profiles_userId_idx" ON "naval_judgment_profiles"("userId");

-- CreateIndex
CREATE INDEX "naval_decision_journal_entries_userId_createdAt_idx" ON "naval_decision_journal_entries"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "naval_decision_journal_entries_userId_status_idx" ON "naval_decision_journal_entries"("userId", "status");

-- CreateIndex
CREATE INDEX "naval_decision_journal_reviews_userId_idx" ON "naval_decision_journal_reviews"("userId");

-- CreateIndex
CREATE INDEX "naval_wealth_profiles_userId_idx" ON "naval_wealth_profiles"("userId");

-- CreateIndex
CREATE INDEX "naval_wealth_assets_userId_idx" ON "naval_wealth_assets"("userId");

-- CreateIndex
CREATE INDEX "naval_wealth_assets_userId_category_idx" ON "naval_wealth_assets"("userId", "category");

-- CreateIndex
CREATE INDEX "naval_income_streams_userId_idx" ON "naval_income_streams"("userId");

-- CreateIndex
CREATE INDEX "naval_asset_build_plans_userId_status_idx" ON "naval_asset_build_plans"("userId", "status");

-- CreateIndex
CREATE INDEX "naval_startup_opportunities_userId_status_idx" ON "naval_startup_opportunities"("userId", "status");

-- CreateIndex
CREATE INDEX "naval_validation_experiments_userId_idx" ON "naval_validation_experiments"("userId");

-- CreateIndex
CREATE INDEX "naval_long_term_games_userId_status_idx" ON "naval_long_term_games"("userId", "status");

-- CreateIndex
CREATE INDEX "naval_freedom_profiles_userId_idx" ON "naval_freedom_profiles"("userId");

-- CreateIndex
CREATE INDEX "naval_freedom_constraints_userId_dimension_idx" ON "naval_freedom_constraints"("userId", "dimension");

-- CreateIndex
CREATE INDEX "naval_happiness_profiles_userId_idx" ON "naval_happiness_profiles"("userId");

-- CreateIndex
CREATE INDEX "naval_happiness_reflections_userId_createdAt_idx" ON "naval_happiness_reflections"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "naval_life_portfolios_userId_idx" ON "naval_life_portfolios"("userId");

-- CreateIndex
CREATE INDEX "naval_life_portfolio_areas_userId_area_idx" ON "naval_life_portfolio_areas"("userId", "area");

-- CreateIndex
CREATE INDEX "naval_score_snapshots_userId_createdAt_idx" ON "naval_score_snapshots"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "naval_twin_profiles_userId_key" ON "naval_twin_profiles"("userId");

-- CreateIndex
CREATE INDEX "naval_twin_profiles_userId_idx" ON "naval_twin_profiles"("userId");

-- CreateIndex
CREATE INDEX "naval_twin_memories_userId_kind_idx" ON "naval_twin_memories"("userId", "kind");

-- CreateIndex
CREATE INDEX "naval_twin_insights_userId_kind_idx" ON "naval_twin_insights"("userId", "kind");

-- CreateIndex
CREATE INDEX "cbt_entries_userId_createdAt_idx" ON "cbt_entries"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "driver_entries_userId_createdAt_idx" ON "driver_entries"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "narrative_entries_userId_createdAt_idx" ON "narrative_entries"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "formation_snapshots_userId_createdAt_idx" ON "formation_snapshots"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "decision_discernments_userId_createdAt_idx" ON "decision_discernments"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "persona_tags_userId_category_idx" ON "persona_tags"("userId", "category");

-- CreateIndex
CREATE INDEX "sfm_founder_profiles_userId_idx" ON "sfm_founder_profiles"("userId");

-- CreateIndex
CREATE INDEX "sfm_founder_profiles_organizationId_idx" ON "sfm_founder_profiles"("organizationId");

-- CreateIndex
CREATE INDEX "sfm_business_missions_userId_idx" ON "sfm_business_missions"("userId");

-- CreateIndex
CREATE INDEX "sfm_business_missions_organizationId_idx" ON "sfm_business_missions"("organizationId");

-- CreateIndex
CREATE INDEX "sfm_company_identities_userId_idx" ON "sfm_company_identities"("userId");

-- CreateIndex
CREATE INDEX "sfm_company_identities_organizationId_idx" ON "sfm_company_identities"("organizationId");

-- CreateIndex
CREATE INDEX "sfm_core_values_userId_idx" ON "sfm_core_values"("userId");

-- CreateIndex
CREATE INDEX "sfm_core_values_organizationId_idx" ON "sfm_core_values"("organizationId");

-- CreateIndex
CREATE INDEX "sfm_success_factors_userId_idx" ON "sfm_success_factors"("userId");

-- CreateIndex
CREATE INDEX "sfm_success_factors_organizationId_idx" ON "sfm_success_factors"("organizationId");

-- CreateIndex
CREATE INDEX "sfm_success_factors_category_idx" ON "sfm_success_factors"("category");

-- CreateIndex
CREATE INDEX "sfm_success_factors_scalabilityScore_idx" ON "sfm_success_factors"("scalabilityScore");

-- CreateIndex
CREATE INDEX "sfm_founder_patterns_userId_idx" ON "sfm_founder_patterns"("userId");

-- CreateIndex
CREATE INDEX "sfm_founder_patterns_organizationId_idx" ON "sfm_founder_patterns"("organizationId");

-- CreateIndex
CREATE INDEX "sfm_business_patterns_userId_idx" ON "sfm_business_patterns"("userId");

-- CreateIndex
CREATE INDEX "sfm_business_patterns_organizationId_idx" ON "sfm_business_patterns"("organizationId");

-- CreateIndex
CREATE INDEX "sfm_decision_rules_userId_idx" ON "sfm_decision_rules"("userId");

-- CreateIndex
CREATE INDEX "sfm_decision_rules_organizationId_idx" ON "sfm_decision_rules"("organizationId");

-- CreateIndex
CREATE INDEX "sfm_operating_principles_userId_idx" ON "sfm_operating_principles"("userId");

-- CreateIndex
CREATE INDEX "sfm_operating_principles_organizationId_idx" ON "sfm_operating_principles"("organizationId");

-- CreateIndex
CREATE INDEX "sfm_scaling_bottlenecks_userId_idx" ON "sfm_scaling_bottlenecks"("userId");

-- CreateIndex
CREATE INDEX "sfm_scaling_bottlenecks_organizationId_idx" ON "sfm_scaling_bottlenecks"("organizationId");

-- CreateIndex
CREATE INDEX "sfm_team_alignments_userId_idx" ON "sfm_team_alignments"("userId");

-- CreateIndex
CREATE INDEX "sfm_team_alignments_organizationId_idx" ON "sfm_team_alignments"("organizationId");

-- CreateIndex
CREATE INDEX "sfm_leadership_patterns_userId_idx" ON "sfm_leadership_patterns"("userId");

-- CreateIndex
CREATE INDEX "sfm_leadership_patterns_organizationId_idx" ON "sfm_leadership_patterns"("organizationId");

-- CreateIndex
CREATE INDEX "culture_rituals_userId_idx" ON "culture_rituals"("userId");

-- CreateIndex
CREATE INDEX "culture_rituals_organizationId_idx" ON "culture_rituals"("organizationId");

-- CreateIndex
CREATE INDEX "sfm_collaboration_patterns_userId_idx" ON "sfm_collaboration_patterns"("userId");

-- CreateIndex
CREATE INDEX "sfm_collaboration_patterns_organizationId_idx" ON "sfm_collaboration_patterns"("organizationId");

-- CreateIndex
CREATE INDEX "sfm_resilience_patterns_userId_idx" ON "sfm_resilience_patterns"("userId");

-- CreateIndex
CREATE INDEX "sfm_resilience_patterns_organizationId_idx" ON "sfm_resilience_patterns"("organizationId");

-- CreateIndex
CREATE INDEX "sfm_system_blueprints_userId_idx" ON "sfm_system_blueprints"("userId");

-- CreateIndex
CREATE INDEX "sfm_system_blueprints_organizationId_idx" ON "sfm_system_blueprints"("organizationId");

-- CreateIndex
CREATE INDEX "sfm_replication_playbooks_userId_idx" ON "sfm_replication_playbooks"("userId");

-- CreateIndex
CREATE INDEX "sfm_replication_playbooks_organizationId_idx" ON "sfm_replication_playbooks"("organizationId");

-- CreateIndex
CREATE INDEX "sfm_org_health_snapshots_userId_idx" ON "sfm_org_health_snapshots"("userId");

-- CreateIndex
CREATE INDEX "sfm_org_health_snapshots_organizationId_idx" ON "sfm_org_health_snapshots"("organizationId");

-- CreateIndex
CREATE INDEX "sfm_org_health_snapshots_createdAt_idx" ON "sfm_org_health_snapshots"("createdAt");

-- CreateIndex
CREATE INDEX "worldview_profiles_userId_idx" ON "worldview_profiles"("userId");

-- CreateIndex
CREATE INDEX "worldview_profiles_createdAt_idx" ON "worldview_profiles"("createdAt");

-- CreateIndex
CREATE INDEX "worldview_assumption_conflicts_userId_idx" ON "worldview_assumption_conflicts"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "worldview_archetypes_slug_key" ON "worldview_archetypes"("slug");

-- CreateIndex
CREATE INDEX "worldview_meaning_profiles_userId_idx" ON "worldview_meaning_profiles"("userId");

-- CreateIndex
CREATE INDEX "worldview_meaning_profiles_createdAt_idx" ON "worldview_meaning_profiles"("createdAt");

-- CreateIndex
CREATE INDEX "worldview_personal_philosophies_userId_idx" ON "worldview_personal_philosophies"("userId");

-- CreateIndex
CREATE INDEX "worldview_life_principles_userId_idx" ON "worldview_life_principles"("userId");

-- CreateIndex
CREATE INDEX "worldview_twins_userId_idx" ON "worldview_twins"("userId");

-- CreateIndex
CREATE INDEX "worldview_evolutions_userId_idx" ON "worldview_evolutions"("userId");

-- CreateIndex
CREATE INDEX "worldview_evolutions_createdAt_idx" ON "worldview_evolutions"("createdAt");

-- AddForeignKey
ALTER TABLE "personality_states" ADD CONSTRAINT "personality_states_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personality_transitions" ADD CONSTRAINT "personality_transitions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "worldviews" ADD CONSTRAINT "worldviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "worldview_dimensions" ADD CONSTRAINT "worldview_dimensions_worldviewId_fkey" FOREIGN KEY ("worldviewId") REFERENCES "worldviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "worldview_assessments" ADD CONSTRAINT "worldview_assessments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "missions" ADD CONSTRAINT "missions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visions" ADD CONSTRAINT "visions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "life_themes" ADD CONSTRAINT "life_themes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "constitutions" ADD CONSTRAINT "constitutions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "identities" ADD CONSTRAINT "identities_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roles" ADD CONSTRAINT "roles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roles" ADD CONSTRAINT "roles_identityId_fkey" FOREIGN KEY ("identityId") REFERENCES "identities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "identity_scores" ADD CONSTRAINT "identity_scores_identityId_fkey" FOREIGN KEY ("identityId") REFERENCES "identities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "identity_history" ADD CONSTRAINT "identity_history_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "values" ADD CONSTRAINT "values_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "value_rankings" ADD CONSTRAINT "value_rankings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "value_rankings" ADD CONSTRAINT "value_rankings_valueId_fkey" FOREIGN KEY ("valueId") REFERENCES "values"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "value_conflicts" ADD CONSTRAINT "value_conflicts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mental_models" ADD CONSTRAINT "mental_models_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "model_connections" ADD CONSTRAINT "model_connections_fromModelId_fkey" FOREIGN KEY ("fromModelId") REFERENCES "mental_models"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "model_connections" ADD CONSTRAINT "model_connections_toModelId_fkey" FOREIGN KEY ("toModelId") REFERENCES "mental_models"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "model_usage_logs" ADD CONSTRAINT "model_usage_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "model_usage_logs" ADD CONSTRAINT "model_usage_logs_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "mental_models"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "first_principle_maps" ADD CONSTRAINT "first_principle_maps_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assumptions" ADD CONSTRAINT "assumptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assumptions" ADD CONSTRAINT "assumptions_mapId_fkey" FOREIGN KEY ("mapId") REFERENCES "first_principle_maps"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "root_causes" ADD CONSTRAINT "root_causes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "root_causes" ADD CONSTRAINT "root_causes_mapId_fkey" FOREIGN KEY ("mapId") REFERENCES "first_principle_maps"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "constraints" ADD CONSTRAINT "constraints_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "constraints" ADD CONSTRAINT "constraints_mapId_fkey" FOREIGN KEY ("mapId") REFERENCES "first_principle_maps"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "decisions" ADD CONSTRAINT "decisions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "decision_options" ADD CONSTRAINT "decision_options_decisionId_fkey" FOREIGN KEY ("decisionId") REFERENCES "decisions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "decision_reviews" ADD CONSTRAINT "decision_reviews_decisionId_fkey" FOREIGN KEY ("decisionId") REFERENCES "decisions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "decision_reviews" ADD CONSTRAINT "decision_reviews_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "decision_options"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_models" ADD CONSTRAINT "role_models_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "identity_patterns" ADD CONSTRAINT "identity_patterns_roleModelId_fkey" FOREIGN KEY ("roleModelId") REFERENCES "role_models"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "decision_patterns" ADD CONSTRAINT "decision_patterns_roleModelId_fkey" FOREIGN KEY ("roleModelId") REFERENCES "role_models"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habit_patterns" ADD CONSTRAINT "habit_patterns_roleModelId_fkey" FOREIGN KEY ("roleModelId") REFERENCES "role_models"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habits" ADD CONSTRAINT "habits_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habit_logs" ADD CONSTRAINT "habit_logs_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "habits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habit_identity_links" ADD CONSTRAINT "habit_identity_links_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "habits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habit_identity_links" ADD CONSTRAINT "habit_identity_links_identityId_fkey" FOREIGN KEY ("identityId") REFERENCES "identities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shadow_patterns" ADD CONSTRAINT "shadow_patterns_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shadow_events" ADD CONSTRAINT "shadow_events_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shadow_events" ADD CONSTRAINT "shadow_events_patternId_fkey" FOREIGN KEY ("patternId") REFERENCES "shadow_patterns"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interventions" ADD CONSTRAINT "interventions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interventions" ADD CONSTRAINT "interventions_patternId_fkey" FOREIGN KEY ("patternId") REFERENCES "shadow_patterns"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reflections" ADD CONSTRAINT "reflections_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_reflectionId_fkey" FOREIGN KEY ("reflectionId") REFERENCES "reflections"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skills" ADD CONSTRAINT "skills_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mastery_levels" ADD CONSTRAINT "mastery_levels_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skill_progress" ADD CONSTRAINT "skill_progress_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leadership_metrics" ADD CONSTRAINT "leadership_metrics_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "influence_logs" ADD CONSTRAINT "influence_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "legacy_projects" ADD CONSTRAINT "legacy_projects_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentees" ADD CONSTRAINT "mentees_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "knowledge_assets" ADD CONSTRAINT "knowledge_assets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "score_snapshots" ADD CONSTRAINT "score_snapshots_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "domain_events" ADD CONSTRAINT "domain_events_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "beliefs" ADD CONSTRAINT "beliefs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "limiting_beliefs" ADD CONSTRAINT "limiting_beliefs_beliefId_fkey" FOREIGN KEY ("beliefId") REFERENCES "beliefs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "empowering_beliefs" ADD CONSTRAINT "empowering_beliefs_beliefId_fkey" FOREIGN KEY ("beliefId") REFERENCES "beliefs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "belief_reframes" ADD CONSTRAINT "belief_reframes_beliefId_fkey" FOREIGN KEY ("beliefId") REFERENCES "beliefs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "belief_change_logs" ADD CONSTRAINT "belief_change_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "digital_twin_profiles" ADD CONSTRAINT "digital_twin_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "twin_memories" ADD CONSTRAINT "twin_memories_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "twin_insights" ADD CONSTRAINT "twin_insights_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "drift_predictions" ADD CONSTRAINT "drift_predictions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "genius_strategies" ADD CONSTRAINT "genius_strategies_geniusId_fkey" FOREIGN KEY ("geniusId") REFERENCES "geniuses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "strategy_adoptions" ADD CONSTRAINT "strategy_adoptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "strategy_adoptions" ADD CONSTRAINT "strategy_adoptions_strategyId_fkey" FOREIGN KEY ("strategyId") REFERENCES "genius_strategies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "genius_practice_logs" ADD CONSTRAINT "genius_practice_logs_adoptionId_fkey" FOREIGN KEY ("adoptionId") REFERENCES "strategy_adoptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blueprint_adaptations" ADD CONSTRAINT "blueprint_adaptations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blueprint_adaptations" ADD CONSTRAINT "blueprint_adaptations_strategyId_fkey" FOREIGN KEY ("strategyId") REFERENCES "genius_strategies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learning_paths" ADD CONSTRAINT "learning_paths_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learning_paths" ADD CONSTRAINT "learning_paths_adaptationId_fkey" FOREIGN KEY ("adaptationId") REFERENCES "blueprint_adaptations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learning_steps" ADD CONSTRAINT "learning_steps_pathId_fkey" FOREIGN KEY ("pathId") REFERENCES "learning_paths"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_posts" ADD CONSTRAINT "community_posts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_comments" ADD CONSTRAINT "post_comments_postId_fkey" FOREIGN KEY ("postId") REFERENCES "community_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_comments" ADD CONSTRAINT "post_comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "membership_orders" ADD CONSTRAINT "membership_orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_orders" ADD CONSTRAINT "store_orders_productId_fkey" FOREIGN KEY ("productId") REFERENCES "store_products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "identity_archetypes" ADD CONSTRAINT "identity_archetypes_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "identity_families"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personal_memories" ADD CONSTRAINT "personal_memories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "naval_plans" ADD CONSTRAINT "naval_plans_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "naval_goals"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "naval_plan_tasks" ADD CONSTRAINT "naval_plan_tasks_planId_fkey" FOREIGN KEY ("planId") REFERENCES "naval_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "naval_specific_knowledge_assets" ADD CONSTRAINT "naval_specific_knowledge_assets_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "naval_specific_knowledge_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "naval_talent_signals" ADD CONSTRAINT "naval_talent_signals_stackId_fkey" FOREIGN KEY ("stackId") REFERENCES "naval_talent_stacks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "naval_leverage_sources" ADD CONSTRAINT "naval_leverage_sources_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "naval_leverage_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "naval_decision_journal_reviews" ADD CONSTRAINT "naval_decision_journal_reviews_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "naval_decision_journal_entries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "naval_wealth_assets" ADD CONSTRAINT "naval_wealth_assets_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "naval_wealth_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "naval_income_streams" ADD CONSTRAINT "naval_income_streams_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "naval_wealth_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "naval_validation_experiments" ADD CONSTRAINT "naval_validation_experiments_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "naval_startup_opportunities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "naval_freedom_constraints" ADD CONSTRAINT "naval_freedom_constraints_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "naval_freedom_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "naval_happiness_reflections" ADD CONSTRAINT "naval_happiness_reflections_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "naval_happiness_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "naval_life_portfolio_areas" ADD CONSTRAINT "naval_life_portfolio_areas_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "naval_life_portfolios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "naval_twin_memories" ADD CONSTRAINT "naval_twin_memories_twinId_fkey" FOREIGN KEY ("twinId") REFERENCES "naval_twin_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "naval_twin_insights" ADD CONSTRAINT "naval_twin_insights_twinId_fkey" FOREIGN KEY ("twinId") REFERENCES "naval_twin_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cbt_entries" ADD CONSTRAINT "cbt_entries_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "driver_entries" ADD CONSTRAINT "driver_entries_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "narrative_entries" ADD CONSTRAINT "narrative_entries_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formation_snapshots" ADD CONSTRAINT "formation_snapshots_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "decision_discernments" ADD CONSTRAINT "decision_discernments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "persona_tags" ADD CONSTRAINT "persona_tags_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
