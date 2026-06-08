import { redirect } from "next/navigation";
import { getOptionalUserId } from "../auth";
import { prisma } from "../db";
import { HttpError } from "../http";

function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS || "")
    .split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
}

/** True if the current session user's email is in ADMIN_EMAILS. */
export async function isAdmin(): Promise<boolean> {
  const uid = await getOptionalUserId();
  if (!uid) return false;
  const u = await prisma.user.findUnique({ where: { id: uid }, select: { email: true } });
  return !!u && adminEmails().includes(u.email.toLowerCase());
}

/** API-route guard: throws 401/403 (mapped by route()). Returns admin userId. */
export async function requireAdmin(): Promise<string> {
  const uid = await getOptionalUserId();
  if (!uid) throw new HttpError(401, "请先登录");
  const u = await prisma.user.findUnique({ where: { id: uid }, select: { id: true, email: true } });
  if (!u || !adminEmails().includes(u.email.toLowerCase())) throw new HttpError(403, "需要管理员权限");
  return u.id;
}

/** Page guard: redirect non-admins to /login. */
export async function requireAdminPage(): Promise<void> {
  if (!(await isAdmin())) redirect("/login");
}
