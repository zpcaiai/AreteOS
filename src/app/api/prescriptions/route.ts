import { z } from "zod";
import { getUserId } from "@/lib/auth";
import { badRequest, ok, parseBody, route } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";
import { generatePrescription, listPrescriptions } from "@/lib/prescription";

const Body = z.object({ bottleneck: z.string().min(2).max(40), context: z.string().max(2000).optional() });

// POST /api/prescriptions -> generate a personalized prescription (gated).
export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "prescription");
    const b = await parseBody(req, Body);
    const result = await generatePrescription(userId, b);
    return result ? ok({ result }) : badRequest("Unknown bottleneck type");
  });
}

// GET /api/prescriptions -> recent prescriptions (open).
export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    return ok({ prescriptions: await listPrescriptions(userId) });
  });
}
