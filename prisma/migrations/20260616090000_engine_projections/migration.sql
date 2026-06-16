-- CreateTable
CREATE TABLE "engine_projections" (
    "user_id" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "engine_projections_pkey" PRIMARY KEY ("user_id","kind")
);
