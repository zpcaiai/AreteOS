import { z } from "zod";
import { getUserId } from "@/lib/auth";
import { badRequest, ok, parseBody, route } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";
import { analyzeCapital, balanceSheet, recordEntry } from "@/lib/capital-ledger";
import { CATEGORY_KEYS } from "@/lib/capital-ledger-math";

const Body = z.object({
  action: z.enum(["entry", "analyze"]),
  category: z.enum(CATEGORY_KEYS as [string, ...string[]]).optional(),
  entryType: z.enum(["deposit", "withdrawal"]).optional(),
  amount: z.number().min(0).max(100).optional(),
  description: z.string().max(500).optional(),
});

// GET /api/life-capital -> balance sheet + global score (open).
export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    return ok(await balanceSheet(userId));
  });
}

// POST /api/life-capital -> record an entry or run the analyst (gated).
export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "life_capital");
    const b = await parseBody(req, Body);
    if (b.action === "analyze") return ok(await analyzeCapital(userId));
    if (!b.category || !b.entryType || b.amount == null) return badRequest("category, entryType, amount required");
    await recordEntry(userId, { category: b.category, entryType: b.entryType, amount: b.amount, description: b.description });
    return ok(await balanceSheet(userId));
  });
}
