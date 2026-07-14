import { z } from "zod";
import { getUserId } from "@/lib/auth";
import { ok, created, parseBody, route } from "@/lib/http";
import { createTeam, listTeamsForUser } from "@/lib/teams";
import { track } from "@/lib/telemetry";

export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    return ok({ teams: await listTeamsForUser(userId) });
  });
}

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const body = await parseBody(req, z.object({ name: z.string().min(1).max(120), seats: z.number().int().min(1).max(500).default(5) }));
    const team = await createTeam(userId, body.name, body.seats);
    await track({ userId, name: "engine_run", props: { engine: "team_create", seats: body.seats } });
    return created({ team });
  });
}
