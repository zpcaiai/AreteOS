import { NextResponse } from "next/server";
import { z } from "zod";

/** An error carrying an HTTP status; route() maps it to a JSON response. */
export class HttpError extends Error {
  constructor(public status: number, message: string) { super(message); this.name = "HttpError"; }
}

export const ok = <T>(data: T, init?: ResponseInit) => NextResponse.json(data, init);
export const created = <T>(data: T) => NextResponse.json(data, { status: 201 });
export const badRequest = (message: string) => NextResponse.json({ error: message }, { status: 400 });
export const notFound = (message = "Not found") => NextResponse.json({ error: message }, { status: 404 });

/** Parse + validate a JSON body; throws a Response on failure (catch in route). */
export async function parseBody<S extends z.ZodTypeAny>(req: Request, schema: S): Promise<z.output<S>> {
  const raw = await req.json().catch(() => ({}));
  const result = schema.safeParse(raw);
  if (!result.success) {
    throw NextResponse.json({ error: "Invalid body", issues: result.error.issues }, { status: 400 });
  }
  return result.data;
}

/** Wrap a route handler so thrown Responses/Errors become clean JSON. */
export function route<T>(handler: () => Promise<T>): Promise<T | NextResponse> {
  return handler().catch((e) => {
    if (e instanceof NextResponse) return e;
    if (e instanceof HttpError) return NextResponse.json({ error: e.message }, { status: e.status });
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  });
}
