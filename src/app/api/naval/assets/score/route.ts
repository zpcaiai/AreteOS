import { z } from "zod";
import { route, ok, parseBody } from "@/lib/http";
import { scoreAsset } from "@/lib/naval/engines";

export async function POST(req: Request) {
  return route(async () => {
    const b = await parseBody(req, z.object({
      ownership: z.number().min(0).max(1), leverage: z.number().min(0).max(1),
      compounding: z.number().min(0).max(1), durability: z.number().min(0).max(1),
    }));
    return ok({ score: await scoreAsset(b) });
  });
}
