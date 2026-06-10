// MISSION OS — nightly job. Run via cron / a scheduled task:
//   0 3 * * *  cd /path/to/mission-os && npm run nightly
// Forces a daily score snapshot + stage evaluation for every user, and generates
// periodic reviews (weekly always; monthly on the 1st; quarterly on Q starts).
// Users are processed in concurrent batches (NIGHTLY_CONCURRENCY, default 8) so
// the job scales to thousands of users without serializing on each one.
import { prisma } from "../src/lib/db";
import { recordProgress } from "../src/lib/analytics";
import { generateReview } from "../src/lib/reviews";
import { recordSnapshot } from "../src/lib/naval/service";
import { runAmbientInsights } from "../src/lib/ambient";
import { logger, reportError } from "../src/lib/logger";

const CONCURRENCY = Math.max(1, Number(process.env.NIGHTLY_CONCURRENCY ?? "8") || 8);

async function processUser(userId: string, now: Date): Promise<boolean> {
  const { transition } = await recordProgress(userId, { force: true });
  await generateReview(userId, "WEEKLY");
  if (process.env.NAVAL_NIGHTLY === "true") await recordSnapshot(userId);
  await runAmbientInsights(userId);
  if (now.getDate() === 1) await generateReview(userId, "MONTHLY");
  if (now.getDate() === 1 && now.getMonth() % 3 === 0) await generateReview(userId, "QUARTERLY");
  return transition.advanced;
}

async function main() {
  const started = Date.now();
  const users = await prisma.user.findMany({ select: { id: true } });
  const now = new Date();
  let advanced = 0;
  let failed = 0;

  for (let i = 0; i < users.length; i += CONCURRENCY) {
    const batch = users.slice(i, i + CONCURRENCY);
    const results = await Promise.allSettled(batch.map((u) => processUser(u.id, now)));
    results.forEach((result, j) => {
      if (result.status === "fulfilled") {
        if (result.value) advanced++;
      } else {
        failed++;
        reportError(result.reason, { surface: "nightly", userId: batch[j].id });
      }
    });
  }

  logger.info(
    { users: users.length, advanced, failed, concurrency: CONCURRENCY, ms: Date.now() - started },
    `nightly: processed ${users.length} users (${advanced} stage advancements, ${failed} failures)`,
  );
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => { reportError(e, { surface: "nightly-main" }); await prisma.$disconnect(); process.exit(1); });
