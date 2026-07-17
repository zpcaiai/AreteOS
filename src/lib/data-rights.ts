import { Prisma } from "@prisma/client";
import { prisma } from "./db";
import { privacyHash } from "./session";

const PRIVATE_TABLES = new Set(["auth_sessions", "auth_tokens", "rate_limit_buckets"]);
const RETAINED_AUDIT_TABLES = new Set(["security_audit_events"]);
const quoteIdentifier = (name: string) => `"${name.replaceAll('"', '""')}"`;

async function userDataTables(tx: Prisma.TransactionClient | typeof prisma) {
  const rows = await tx.$queryRaw<Array<{ table_name: string; column_name: string }>>(Prisma.sql`
    SELECT table_name, column_name FROM information_schema.columns
    WHERE table_schema = 'public' AND column_name IN ('userId', 'ownerId', 'actorId')
    ORDER BY table_name, column_name
  `);
  const grouped = new Map<string, string[]>();
  for (const row of rows) {
    if (PRIVATE_TABLES.has(row.table_name)) continue;
    grouped.set(row.table_name, [...(grouped.get(row.table_name) ?? []), row.column_name]);
  }
  return [...grouped].map(([table, columns]) => ({ table, columns }));
}

const ownershipClause = (columns: string[]) => columns.map((column, index) => `${quoteIdentifier(column)} = $${index + 1}`).join(" OR ");

/** Complete machine-readable export across every current user-owned table. */
export async function exportAllUserData(userId: string) {
  const tables = await userDataTables(prisma);
  const data: Record<string, unknown[]> = {};
  for (const { table, columns } of tables) {
    data[table] = await prisma.$queryRawUnsafe<unknown[]>(`SELECT * FROM ${quoteIdentifier(table)} WHERE ${ownershipClause(columns)}`, ...columns.map(() => userId));
  }
  return data;
}

/** Erase all user-owned records and the identity record in one transaction. */
export async function deleteEntireAccount(userId: string) {
  const deletedActorId = `deleted:${privacyHash(userId)}`;
  return prisma.$transaction(async (tx) => {
    const tables = await userDataTables(tx);
    let deletedRecords = 0;
    // Children with userId are removed first. Remaining related rows are handled
    // by the schema's ON DELETE CASCADE constraints when the user is deleted.
    for (const { table, columns } of tables) {
      if (table === "users") continue;
      if (RETAINED_AUDIT_TABLES.has(table)) continue;
      deletedRecords += await tx.$executeRawUnsafe(`DELETE FROM ${quoteIdentifier(table)} WHERE ${ownershipClause(columns)}`, ...columns.map(() => userId));
    }
    await tx.securityAuditEvent.updateMany({ where: { actorId: userId }, data: { actorId: deletedActorId } });
    await tx.user.delete({ where: { id: userId } });
    return { deletedRecords: deletedRecords + 1 };
  }, { timeout: 30_000 });
}
