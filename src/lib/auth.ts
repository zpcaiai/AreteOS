import { cookies } from "next/headers";
import { prisma } from "./db";
import { SESSION_COOKIE, verifySession } from "./session";

/** Authenticated user id from the session cookie, or null. */
export async function getOptionalUserId(): Promise<string | null> {
  const store = await cookies();
  return verifySession(store.get(SESSION_COOKIE)?.value);
}

/**
 * Resolve the acting user. Prefers a valid session cookie. Falls back to
 * DEV_USER_ID (auto-created) for local dev so the app is usable without login.
 * The legacy `_req` arg is accepted/ignored so existing route call-sites compile.
 */
export async function getUserId(_req?: Request): Promise<string> {
  const sessionUser = await getOptionalUserId();
  if (sessionUser) return sessionUser;

  const devId = process.env.NODE_ENV === "production" ? undefined : process.env.DEV_USER_ID;
  if (!devId) throw new Error("Unauthorized");
  await prisma.user.upsert({
    where: { id: devId },
    update: {},
    create: { id: devId, email: `${devId}@mission.local`, name: "Demo User" },
  });
  return devId;
}
