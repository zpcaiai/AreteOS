export {};

if (!process.env.RESTORE_DATABASE_URL) throw new Error("RESTORE_DATABASE_URL is required");
if (process.env.RESTORE_DATABASE_URL === process.env.DATABASE_URL) throw new Error("Refusing to run a restore drill against the active DATABASE_URL");

process.env.DATABASE_URL = process.env.RESTORE_DATABASE_URL;
process.env.DIRECT_URL = process.env.RESTORE_DATABASE_URL;
const { Prisma, PrismaClient } = await import("@prisma/client");
const prisma = new PrismaClient();

const [row] = await prisma.$queryRaw<Array<{ users: boolean; sessions: boolean; workspaces: boolean; migrations: boolean }>>(Prisma.sql`
  SELECT
    to_regclass('public.users') IS NOT NULL AS users,
    to_regclass('public.auth_sessions') IS NOT NULL AS sessions,
    to_regclass('public.foundry_workspaces') IS NOT NULL AS workspaces,
    to_regclass('public._prisma_migrations') IS NOT NULL AS migrations
`);
if (!row || Object.values(row).some((value) => value !== true)) throw new Error(`Restore schema verification failed: ${JSON.stringify(row)}`);

const [counts] = await prisma.$queryRaw<Array<{ users: bigint; workspaces: bigint; migrations: bigint }>>(Prisma.sql`
  SELECT
    (SELECT count(*) FROM users) AS users,
    (SELECT count(*) FROM foundry_workspaces) AS workspaces,
    (SELECT count(*) FROM _prisma_migrations WHERE finished_at IS NOT NULL AND rolled_back_at IS NULL) AS migrations
`);
console.log(JSON.stringify({
  verifiedAt: new Date().toISOString(),
  schema: row,
  counts: {
    users: Number(counts?.users || 0),
    workspaces: Number(counts?.workspaces || 0),
    migrations: Number(counts?.migrations || 0),
  },
}, null, 2));
await prisma.$disconnect();
