// MISSION OS — seed data. Creates a demo user with a coherent slice across all
// layers so the dashboard and pages render meaningful content out of the box.
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/password";

const prisma = new PrismaClient();
const userId = process.env.DEV_USER_ID || "usr_demo";

async function main() {
  await prisma.user.upsert({
    where: { id: userId },
    update: {},
    // Demo login: demo@mission.local / mission1234
    create: { id: userId, email: `${userId}@mission.local`, name: "Demo User", passwordHash: hashPassword("mission1234") },
  });

  // Demo convenience: give the demo user a PRO membership so every Pro/Plus
  // feature (council, future-self, knowledge graph, naval, …) is usable locally.
  await prisma.membership.upsert({
    where: { userId },
    update: { tier: "PRO", status: "ACTIVE", period: "ANNUAL", expiresAt: new Date(Date.now() + 3650 * 24 * 3600 * 1000) },
    create: { userId, tier: "PRO", status: "ACTIVE", period: "ANNUAL", expiresAt: new Date(Date.now() + 3650 * 24 * 3600 * 1000) },
  });

  await prisma.personalityState.upsert({
    where: { userId },
    update: {},
    create: { userId, stage: "OPERATOR", progress: 0.4 },
  });

  // Idempotency guard: the rich slice below uses create() (not upsert), so a
  // re-run would duplicate missions, habit logs and the snapshot timeline.
  // The upserts above always refresh; bail out here once the demo slice exists.
  if (await prisma.mission.findFirst({ where: { userId } })) {
    console.log(`[seed] ${userId} already seeded — skipping demo slice (idempotent).`);
    return;
  }

  // Mission + vision
  await prisma.mission.create({
    data: { userId, statement: "Compound and transfer understanding so others build faster than I did." },
  });
  await prisma.vision.create({ data: { userId, statement: "A body of teaching and tools that outlives me.", horizon: "10Y" } });
  await prisma.lifeTheme.createMany({ data: [{ userId, name: "Learning" }, { userId, name: "Building" }, { userId, name: "Teaching" }] });
  await prisma.constitution.createMany({
    data: [
      { userId, article: "Tell the truth, especially when costly.", rank: 1 },
      { userId, article: "Optimize for compounding, not for today.", rank: 2 },
    ],
  });

  // Identities + roles
  const researcher = await prisma.identity.create({
    data: { userId, name: "Researcher", statement: "I am someone who tests ideas and writes what I learn.", clarity: 0.8, roles: { create: [{ userId, name: "Writer", intention: "Make thinking visible" }] } },
  });
  await prisma.identity.create({ data: { userId, name: "Builder", statement: "I am someone who ships durable tools.", clarity: 0.7 } });
  await prisma.identityScore.create({ data: { identityId: researcher.id, alignment: 0.72 } });

  // Values + rankings
  for (const [i, name] of ["Truth", "Excellence", "Integrity", "Curiosity", "Long-termism"].entries()) {
    const v = await prisma.value.create({ data: { userId, name } });
    await prisma.valueRanking.create({ data: { userId, valueId: v.id, rank: i + 1 } });
  }

  // Mental models (latticework)
  const sunk = await prisma.mentalModel.create({ data: { userId, name: "Sunk Cost", category: "PSYCHOLOGY", description: "Past spend is irrelevant to the forward decision." } });
  const oppc = await prisma.mentalModel.create({ data: { userId, name: "Opportunity Cost", category: "ECONOMICS", description: "Compare to the best alternative." } });
  await prisma.mentalModel.create({ data: { userId, name: "Compounding", category: "GENERAL", description: "Small consistent gains dominate over time." } });
  await prisma.modelConnection.create({ data: { fromModelId: sunk.id, toModelId: oppc.id, relation: "reinforces" } });
  await prisma.modelUsageLog.create({ data: { userId, modelId: oppc.id, context: "Project continuation decision" } });

  // Habit + 12 logs
  const habit = await prisma.habit.create({
    data: { userId, name: "Read one paper, write 3 lines", identityProof: "I engage sources and synthesize.", targetPerWeek: 5, identityLinks: { create: { identityId: researcher.id } } },
  });
  for (let d = 0; d < 12; d++) {
    await prisma.habitLog.create({ data: { habitId: habit.id, done: true, date: new Date(Date.now() - d * 86400000), identityNote: "Proved I'm a researcher." } });
  }

  // Decision + review
  const decision = await prisma.decision.create({
    data: { userId, title: "Accept the manager role?", context: "More pay, less building", status: "REVIEWED", quality: 0.74, options: { create: [{ label: "Accept" }, { label: "Decline", chosen: true }] } },
  });
  await prisma.decisionReview.create({
    data: { decisionId: decision.id, missionFit: 0.8, identityFit: 0.9, valueFit: 0.9, expectedValue: 0.5, secondOrder: 0.6, risk: 0.3, reversibility: 0.8, shadowMotive: 0.1, quality: 0.74, note: "Protects builder identity." },
  });

  // Role model
  await prisma.roleModel.create({
    data: {
      userId, person: "Charlie Munger", archetype: "MUNGER", values: "Rationality, Honesty, Patience", beliefs: "Invert; avoid stupidity",
      environment: "Few high-quality decisions; long holding periods.",
      identityPatterns: { create: [{ pattern: "A learning machine who compounds judgment." }] },
      decisionPatterns: { create: [{ rule: "Study how things fail, then avoid that" }, { rule: "Act only where your knowledge runs deep" }] },
      habitPatterns: { create: [{ habit: "Read daily across disciplines" }] },
    },
  });

  // Skill + mastery
  await prisma.skill.create({
    data: { userId, name: "System design", domain: "Engineering", masteryLevel: { create: { stage: "PRACTITIONER", knowledge: 0.7, execution: 0.5, problemSolving: 0.5, teaching: 0.2 } } },
  });

  // Reflection + lessons
  await prisma.reflection.create({
    data: { userId, worked: "Shipped tests", failed: "Distracted AM", learned: "Tests reduce fear", wrongAssumptions: "That I needed more time", identityReinforced: "Builder", depth: 0.7, lessons: { create: [{ userId, text: "Fear, not time, was the blocker." }] } },
  });

  // Leadership + legacy
  await prisma.leadershipMetric.create({ data: { userId, communication: 0.6, influence: 0.5, delegation: 0.3, teamBuilding: 0.4, decisionQuality: 0.7 } });
  await prisma.mentee.create({ data: { userId, name: "Junior dev", focus: "System design" } });
  await prisma.knowledgeAsset.create({ data: { userId, title: "Design docs → public course", type: "COURSE" } });

  // A short Growth Score timeline
  for (let d = 14; d >= 0; d -= 2) {
    await prisma.scoreSnapshot.create({ data: { userId, kind: "GROWTH", value: 0.3 + (14 - d) * 0.02, date: new Date(Date.now() - d * 86400000) } });
  }

  console.log("Seeded demo user:", userId);
}

main().then(() => prisma.$disconnect()).catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
