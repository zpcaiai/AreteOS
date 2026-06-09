import { ok, route } from "@/lib/http";
import { HAPPINESS_PRACTICES } from "@/lib/naval/seed-data";

export async function GET() {
  return route(async () => ok({ practices: HAPPINESS_PRACTICES }));
}
