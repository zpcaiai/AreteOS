import { prisma } from "./db";
import { reportError } from "./logger";

export type MemoryKind = "DECISION" | "REFLECTION" | "HABIT" | "SHADOW" | "NAVAL" | "REVIEW" | "GENERAL";

export interface MemoryInput {
  userId: string;
  kind: MemoryKind;
  sourceType: string;
  sourceId: string;
  title?: string;
  content: string;
  metadata?: Record<string, unknown>;
  importance?: number;
  occurredAt?: Date;
}

export interface MemoryHit {
  id: string;
  kind: MemoryKind;
  title: string;
  content: string;
  score: number;
  occurredAt: Date | null;
  createdAt: Date;
}

const EMBEDDING_DIM = 1536;
const EMBEDDING_MODEL = process.env.OPENAI_EMBEDDING_MODEL ?? "text-embedding-3-small";

function clampText(text: string, limit = 6000) {
  return text.replace(/\s+/g, " ").trim().slice(0, limit);
}

function hashEmbedding(text: string) {
  const vector = new Array<number>(EMBEDDING_DIM).fill(0);
  const normalized = clampText(text).toLowerCase();
  for (let i = 0; i < normalized.length; i++) {
    const code = normalized.charCodeAt(i);
    const idx = (code * 31 + i * 17) % EMBEDDING_DIM;
    vector[idx] += ((code % 23) - 11) / 11;
  }
  const norm = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0)) || 1;
  return vector.map((value) => Number((value / norm).toFixed(6)));
}

function vectorLiteral(vector: number[]) {
  return `[${vector.map((value) => Number.isFinite(value) ? value : 0).join(",")}]`;
}

async function embed(text: string) {
  if (!process.env.OPENAI_API_KEY || process.env.AI_PROVIDER === "mock") return hashEmbedding(text);

  const res = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    body: JSON.stringify({ model: EMBEDDING_MODEL, input: clampText(text) }),
  });
  if (!res.ok) {
    reportError(new Error(`OpenAI embeddings ${res.status}: ${await res.text()}`), { surface: "memory-embedding" });
    return hashEmbedding(text);
  }
  const data = await res.json();
  const embedding = data.data?.[0]?.embedding;
  return Array.isArray(embedding) ? embedding.slice(0, EMBEDDING_DIM) : hashEmbedding(text);
}

export async function remember(input: MemoryInput) {
  const content = clampText(input.content);
  if (!content) return null;

  const embedding = vectorLiteral(await embed(`${input.title ?? ""}\n${content}`));
  const id = crypto.randomUUID();
  await prisma.$executeRawUnsafe(
    `INSERT INTO personal_memories
      (id, user_id, kind, source_type, source_id, title, content, embedding, metadata, importance, occurred_at, created_at, updated_at)
     VALUES
      ($1, $2, $3::"PersonalMemoryKind", $4, $5, $6, $7, $8::vector, $9::jsonb, $10, $11, now(), now())
     ON CONFLICT (user_id, source_type, source_id, kind) DO UPDATE SET
      title = EXCLUDED.title,
      content = EXCLUDED.content,
      embedding = EXCLUDED.embedding,
      metadata = EXCLUDED.metadata,
      importance = EXCLUDED.importance,
      occurred_at = EXCLUDED.occurred_at,
      updated_at = now()`,
    id,
    input.userId,
    input.kind,
    input.sourceType,
    input.sourceId,
    input.title ?? "",
    content,
    embedding,
    JSON.stringify(input.metadata ?? {}),
    input.importance ?? 0.5,
    input.occurredAt ?? null,
  );
  return id;
}

export async function recall(userId: string, query: string, options: { limit?: number; kinds?: MemoryKind[] } = {}) {
  const limit = Math.min(options.limit ?? 5, 12);
  const embedding = vectorLiteral(await embed(query));
  const kinds = options.kinds && options.kinds.length ? options.kinds : null;

  try {
    const kindClause = kinds ? `AND kind::text = ANY($4::text[])` : "";
    const params = kinds ? [userId, embedding, limit, kinds] : [userId, embedding, limit];
    const rows = await prisma.$queryRawUnsafe<MemoryHit[]>(
      `SELECT id, kind, title, content, (1 - (embedding <=> $2::vector))::float AS score, occurred_at AS "occurredAt", created_at AS "createdAt"
       FROM personal_memories
       WHERE user_id = $1
         AND embedding IS NOT NULL
         ${kindClause}
       ORDER BY embedding <=> $2::vector
       LIMIT $3`,
      ...params,
    );
    return rows;
  } catch (e) {
    reportError(e, { surface: "memory-recall-fallback" });
    const rows = await prisma.personalMemory.findMany({
      where: { userId, ...(kinds ? { kind: { in: kinds } } : {}) },
      orderBy: { createdAt: "desc" },
      take: limit,
      select: { id: true, kind: true, title: true, content: true, occurredAt: true, createdAt: true },
    });
    return rows.map((row) => ({ ...row, kind: row.kind as MemoryKind, score: 0 }));
  }
}

export async function memoryContext(userId: string, query: string, options?: { limit?: number; kinds?: MemoryKind[] }) {
  const hits = await recall(userId, query, options);
  if (!hits.length) return "";
  return hits
    .map((hit, index) => {
      const when = hit.occurredAt ?? hit.createdAt;
      return `${index + 1}. [${hit.kind}${hit.score ? ` ${(hit.score * 100).toFixed(0)}%` : ""}] ${hit.title || "Untitled"} (${when.toISOString().slice(0, 10)}): ${hit.content}`;
    })
    .join("\n");
}
