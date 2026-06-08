import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { created, parseBody, route, HttpError } from "@/lib/http";

// Registers a pointer to a file the user legally owns. We do NOT host or redistribute
// copyrighted content; the user may also paste text from their own copy for TTS.
export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const b = await parseBody(req, z.object({
      title: z.string().min(1), author: z.string().default(""),
      format: z.enum(["PDF", "EPUB", "TEXT", "AUDIO"]).default("PDF"),
      assetRef: z.string().optional(), textContent: z.string().default(""),
      relatedModule: z.string().default("My Library"), confirmOwnership: z.boolean(),
    }));
    if (!b.confirmOwnership) throw new HttpError(400, "You must confirm you own this file. We do not host copyrighted content.");
    const slug = `user-${userId.slice(0, 6)}-${b.title.toLowerCase().replace(/\s+/g, "-").slice(0, 40)}-${Date.now().toString(36)}`;
    const book = await prisma.audioBook.create({ data: {
      slug, title: b.title, author: b.author, relatedModule: b.relatedModule,
      inspiredByNote: "User-owned upload", summary: "", textContent: b.textContent,
      sourceType: "USER_UPLOAD", format: b.format, isPublicDomain: false, ownerUserId: userId, assetRef: b.assetRef ?? null,
    } });
    return created({ book });
  });
}
