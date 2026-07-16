import { NextResponse } from "next/server";
import { z } from "zod";
import { reportError } from "./logger";

/** An error carrying an HTTP status; route() maps it to a JSON response. */
export class HttpError extends Error {
  constructor(public status: number, message: string) { super(message); this.name = "HttpError"; }
}

export const ok = <T>(data: T, init?: ResponseInit) => NextResponse.json(data, init);
export const created = <T>(data: T) => NextResponse.json(data, { status: 201 });
export const badRequest = (message: string) => NextResponse.json({ error: message }, { status: 400 });
export const notFound = (message = "Not found") => NextResponse.json({ error: message }, { status: 404 });

/** Reject cross-site browser writes. Webhooks must verify provider signatures instead. */
export function requireSameOrigin(req: Request) {
  const origin = req.headers.get("origin");
  if (!origin && process.env.NODE_ENV !== "production") return;
  const expected = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;
  if (!origin || new URL(origin).origin !== new URL(expected).origin) {
    throw new HttpError(403, "Cross-site request rejected");
  }
}

const MAX_JSON_BODY_CHARS = Number(process.env.MAX_JSON_BODY_CHARS ?? "24000");

/** Parse + validate a JSON body; throws a Response on failure (catch in route). */
export async function parseBody<S extends z.ZodTypeAny>(req: Request, schema: S): Promise<z.output<S>> {
  const text = await req.text().catch(() => "");
  if (text.length > MAX_JSON_BODY_CHARS) {
    throw NextResponse.json({ error: "Request body too large" }, { status: 413 });
  }
  let raw: unknown = {};
  try {
    raw = text ? JSON.parse(text) : {};
  } catch {
    throw NextResponse.json({ error: "Malformed JSON body" }, { status: 400 });
  }
  const result = schema.safeParse(raw);
  if (!result.success) {
    throw NextResponse.json({ error: "Invalid body", issues: result.error.issues }, { status: 400 });
  }
  return result.data;
}

export function pagination(req: Request, defaults = { limit: 30, max: 100 }) {
  const url = new URL(req.url);
  const page = Math.max(1, Number(url.searchParams.get("page") ?? "1") || 1);
  const limit = Math.min(defaults.max, Math.max(1, Number(url.searchParams.get("limit") ?? defaults.limit) || defaults.limit));
  return { page, limit, skip: (page - 1) * limit };
}

/** Wrap a route handler so thrown Responses/Errors become clean JSON. */
export function route<T>(handler: () => Promise<T>): Promise<T | NextResponse> {
  return handler().catch((e) => {
    if (e instanceof NextResponse) return e;
    if (e instanceof HttpError) return NextResponse.json({ error: e.message }, { status: e.status });
    reportError(e, { surface: "api-route" });
    return NextResponse.json({ error: process.env.NODE_ENV === "production" ? "Internal server error" : e instanceof Error ? e.message : String(e) }, { status: 500 });
  });
}
