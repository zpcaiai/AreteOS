// The single highest-leverage next action for the user, derived from their latest
// prescription (its first action) or, failing that, their latest bottleneck's
// recommendation. The "what do I do now?" answer the dashboard surfaces.

import { latestBottleneck } from "./bottleneck";
import { listPrescriptions } from "./prescription";

export interface NextAction {
  action: string;
  source: string;
  href: string;
}

export async function nextAction(userId: string): Promise<NextAction> {
  const rx = (await listPrescriptions(userId, 1)) as { firstAction?: string; title?: string }[];
  if (rx[0]?.firstAction) return { action: rx[0].firstAction, source: rx[0].title ?? "prescription", href: "/prescriptions" };

  const bn = (await latestBottleneck(userId)) as { recommendation?: string; primary?: string } | null;
  if (bn?.recommendation) return { action: bn.recommendation, source: bn.primary ?? "bottleneck", href: "/bottlenecks" };

  return { action: "", source: "", href: "/onboarding" };
}
