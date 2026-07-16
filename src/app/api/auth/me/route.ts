import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getOptionalUserId } from "@/lib/auth";

export async function GET() {
  const userId = await getOptionalUserId();
  if (!userId) return NextResponse.json({ user: null }, { status: 200 });
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, email: true, name: true, emailVerifiedAt: true } });
  return NextResponse.json({ user });
}
