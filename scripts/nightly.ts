// MISSION OS — nightly job. Run via cron / a scheduled task:
//   0 3 * * *  cd /path/to/mission-os && npm run nightly
// Forces a daily score snapshot + stage evaluation for every user, and generates
// periodic reviews (weekly always; monthly on the 1st; quarterly on Q starts).
import { prisma } from "../src/lib/db";
import { recordProgress } from "../src/lib/analytics";
import { generateReview } from "../src/lib/reviews";

async function main() {
  const users = await prisma.user.findMany({ select: { id: true } });
  const now = new Date();
  let advanced = 0;
  for (const u of users) {
    try {
      const { transition } = await recordProgress(u.id, { force: true });
      if (transition.advanced) advanced++;
      await generateReview(u.id, "WEEKLY");
      if (now.getDate() === 1) await generateReview(u.id, "MONTHLY");
      if (now.getDate() === 1 && now.getMonth() % 3 === 0) await generateReview(u.id, "QUARTERLY");
    } catch (e) {
      console.error("nightly failed for user", u.id, e);
    }
  }
  console.log(`nightly: processed ${users.length} users, ${advanced} stage advancements`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
