// MISSION OS — weekly job. Run via cron / a scheduled task:
//   0 9 * * 1  cd /path/to/mission-os && npm run weekly
// Generates a shareable weekly growth card for every user (persisted as a
// WeeklyCard domain event; surfaced on the dashboard as the default landing).
// Shares its logic with POST /api/cron/weekly so both stay in sync.
import { prisma } from "../src/lib/db";
import { runWeeklyForAllUsers } from "../src/lib/growth-card";
import { logger, reportError } from "../src/lib/logger";

async function main() {
  const started = Date.now();
  const r = await runWeeklyForAllUsers(Number(process.env.WEEKLY_CONCURRENCY ?? "8") || 8);
  logger.info({ ...r, ms: Date.now() - started }, `weekly: generated ${r.generated} growth cards (${r.failed} failures)`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => { reportError(e, { surface: "weekly-main" }); await prisma.$disconnect(); process.exit(1); });
