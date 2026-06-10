// MISSION OS — Neo4j knowledge-graph projector.
// Writes a traversal-optimized projection (identity graph + mental-model
// latticework) over Neo4j's transactional HTTP API — no driver dependency.
// Completely inert unless NEO4J_HTTP_URL is set, so the app runs fine without it.
// All callers should treat failures as non-fatal (.catch).

interface CypherStatement {
  statement: string;
  parameters?: Record<string, unknown>;
}

const base = () => process.env.NEO4J_HTTP_URL?.replace(/\/$/, "") ?? "";
export const graphEnabled = () => base().length > 0;

async function runCypher(statements: CypherStatement[]): Promise<void> {
  if (!graphEnabled() || statements.length === 0) return;
  const db = process.env.NEO4J_DB || "neo4j";
  const user = process.env.NEO4J_USER || "neo4j";
  const pass = process.env.NEO4J_PASSWORD || "";
  const auth = Buffer.from(`${user}:${pass}`).toString("base64");
  const res = await fetch(`${base()}/db/${db}/tx/commit`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json", Authorization: `Basic ${auth}` },
    body: JSON.stringify({ statements }),
  });
  if (!res.ok) throw new Error(`Neo4j ${res.status}: ${await res.text()}`);
  const data = await res.json();
  if (data.errors?.length) throw new Error(`Neo4j: ${JSON.stringify(data.errors)}`);
}

/**
 * Run a read query and map each result row to an object keyed by the RETURN
 * column names. Returns null when the graph is not configured.
 */
export async function readCypher<T = Record<string, unknown>>(
  statement: string,
  parameters?: Record<string, unknown>,
): Promise<T[] | null> {
  if (!graphEnabled()) return null;
  const db = process.env.NEO4J_DB || "neo4j";
  const user = process.env.NEO4J_USER || "neo4j";
  const pass = process.env.NEO4J_PASSWORD || "";
  const auth = Buffer.from(`${user}:${pass}`).toString("base64");
  const res = await fetch(`${base()}/db/${db}/tx/commit`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json", Authorization: `Basic ${auth}` },
    body: JSON.stringify({ statements: [{ statement, parameters: parameters ?? {} }] }),
  });
  if (!res.ok) throw new Error(`Neo4j ${res.status}: ${await res.text()}`);
  const data = await res.json();
  if (data.errors?.length) throw new Error(`Neo4j: ${JSON.stringify(data.errors)}`);
  const result = data.results?.[0];
  if (!result) return [];
  const columns: string[] = result.columns ?? [];
  return (result.data ?? []).map((entry: { row: unknown[] }) => {
    const obj: Record<string, unknown> = {};
    columns.forEach((col, i) => { obj[col] = entry.row[i]; });
    return obj as T;
  });
}

/** Mission → Identity edge in the identity graph. */
export function projectIdentityGraph(p: { userId: string; identityId: string; identityName: string; missionStatement?: string }) {
  return runCypher([
    {
      statement:
        "MERGE (u:User {id:$userId}) " +
        "MERGE (i:Identity {id:$identityId}) SET i.name=$identityName " +
        "MERGE (u)-[:HAS_IDENTITY]->(i) " +
        "FOREACH (_ IN CASE WHEN $missionStatement IS NULL THEN [] ELSE [1] END | " +
        "  MERGE (m:Mission {userId:$userId}) SET m.statement=$missionStatement MERGE (m)-[:SHAPES]->(i))",
      parameters: { userId: p.userId, identityId: p.identityId, identityName: p.identityName, missionStatement: p.missionStatement ?? null },
    },
  ]);
}

/** Upsert a mental model the user knows. */
export function projectMentalModel(p: { userId: string; modelId: string; name: string; category: string }) {
  return runCypher([
    {
      statement:
        "MERGE (u:User {id:$userId}) " +
        "MERGE (mm:MentalModel {id:$modelId}) SET mm.name=$name, mm.category=$category " +
        "MERGE (u)-[:KNOWS]->(mm)",
      parameters: p,
    },
  ]);
}

/** A latticework edge between two models. */
export function projectModelConnection(p: { fromId: string; toId: string; relation: string }) {
  return runCypher([
    {
      statement: "MATCH (a:MentalModel {id:$fromId}),(b:MentalModel {id:$toId}) MERGE (a)-[:CONNECTS_TO {relation:$relation}]->(b)",
      parameters: p,
    },
  ]);
}

/** Record that the user models after a role model and which models it exhibits. */
export function projectRoleModel(p: { userId: string; person: string; mentalModels: string[] }) {
  return runCypher([
    {
      statement:
        "MERGE (u:User {id:$userId}) MERGE (r:RoleModel {userId:$userId, person:$person}) MERGE (u)-[:MODELS_AFTER]->(r) " +
        "WITH r UNWIND $mentalModels AS mmName MERGE (mm:MentalModel {name:mmName}) MERGE (r)-[:EXHIBITS]->(mm)",
      parameters: p,
    },
  ]);
}

/** Excellence graph: link a user's adaptation to a role model + its identity/values. */
export function projectExcellenceGraph(p: { userId: string; roleModel: string; identity: string; values: string }) {
  return runCypher([
    {
      statement:
        "MERGE (u:User {id:$userId}) MERGE (r:RoleModel {name:$roleModel}) MERGE (u)-[:ADAPTS]->(r) " +
        "MERGE (i:Identity {name:$identity}) MERGE (u)-[:ADAPTED_IDENTITY]->(i) " +
        "FOREACH (v IN $values | MERGE (val:Value {name:v}) MERGE (u)-[:HAS_VALUE]->(val))",
      parameters: { userId: p.userId, roleModel: p.roleModel, identity: p.identity, values: p.values.split(/[,，·]/).map((x) => x.trim()).filter(Boolean) },
    },
  ]);
}

/** SFM graph: link a founder/company to its success factors, values, principles, bottlenecks. */
export function projectSfmGraph(p: {
  userId: string; companyIdentity?: string; successFactors?: string[];
  values?: string[]; principles?: string[]; bottlenecks?: string[];
}) {
  return runCypher([
    {
      statement:
        "MERGE (f:Founder {userId:$userId}) MERGE (c:Company {userId:$userId}) MERGE (f)-[:FOUNDER_OF]->(c) " +
        (p.companyIdentity ? "MERGE (i:Identity {name:$companyIdentity}) MERGE (c)-[:HAS_IDENTITY]->(i) " : "") +
        "FOREACH (s IN $successFactors | MERGE (sf:SuccessFactor {name:s, userId:$userId}) MERGE (c)-[:CREATES_SUCCESS_FACTOR]->(sf)) " +
        "FOREACH (v IN $values | MERGE (val:Value {name:v, userId:$userId}) MERGE (c)-[:HOLDS_VALUE]->(val)) " +
        "FOREACH (pr IN $principles | MERGE (op:OperatingPrinciple {name:pr, userId:$userId}) MERGE (c)-[:FOLLOWS_PRINCIPLE]->(op)) " +
        "FOREACH (b IN $bottlenecks | MERGE (bn:Bottleneck {name:b, userId:$userId}) MERGE (c)-[:HAS_BOTTLENECK]->(bn))",
      parameters: {
        userId: p.userId, companyIdentity: p.companyIdentity ?? null,
        successFactors: p.successFactors ?? [], values: p.values ?? [],
        principles: p.principles ?? [], bottlenecks: p.bottlenecks ?? [],
      },
    },
  ]);
}

/** Leadership graph: link a leader to mission, vision, identity, teams, culture, future leaders. */
export function projectLeadershipGraph(p: {
  userId: string; vision?: string; mission?: string; identity?: string;
  futureLeaders?: string[]; culture?: string;
}) {
  return runCypher([
    {
      statement:
        "MERGE (l:Leader {userId:$userId}) " +
        (p.mission ? "MERGE (m:Mission {name:$mission}) MERGE (l)-[:OWNS_MISSION]->(m) " : "") +
        (p.vision ? "MERGE (v:Vision {name:$vision}) MERGE (l)-[:COMMUNICATES_VISION]->(v) " : "") +
        (p.identity ? "MERGE (i:Identity {name:$identity}) MERGE (l)-[:SPONSORS_IDENTITY]->(i) " : "") +
        (p.culture ? "MERGE (c:Culture {name:$culture, userId:$userId}) MERGE (l)-[:BUILDS_CULTURE]->(c) " : "") +
        "FOREACH (fl IN $futureLeaders | MERGE (f:FutureLeader {name:fl, userId:$userId}) MERGE (l)-[:DEVELOPS_LEADER]->(f))",
      parameters: {
        userId: p.userId, vision: p.vision ?? null, mission: p.mission ?? null,
        identity: p.identity ?? null, culture: p.culture ?? null, futureLeaders: p.futureLeaders ?? [],
      },
    },
  ]);
}

/** Management graph: link a manager to mission, teams, knowledge assets, playbooks, decisions, culture. */
export function projectManagementGraph(p: {
  userId: string; mission?: string; knowledge?: string[]; playbooks?: string[]; decisions?: string[]; culture?: string;
}) {
  return runCypher([
    {
      statement:
        "MERGE (m:Manager {userId:$userId}) MERGE (o:Organization {userId:$userId}) MERGE (m)-[:GUIDES_TEAM]->(o) " +
        (p.mission ? "MERGE (mi:Mission {name:$mission}) MERGE (m)-[:OWNS_MISSION]->(mi) " : "") +
        (p.culture ? "MERGE (c:Culture {name:$culture, userId:$userId}) MERGE (m)-[:BUILDS_CULTURE]->(c) " : "") +
        "FOREACH (k IN $knowledge | MERGE (kn:Knowledge {name:k, userId:$userId}) MERGE (m)-[:CREATES_KNOWLEDGE]->(kn)) " +
        "FOREACH (pb IN $playbooks | MERGE (p:Playbook {name:pb, userId:$userId}) MERGE (m)-[:USES_PLAYBOOK]->(p)) " +
        "FOREACH (d IN $decisions | MERGE (dec:Decision {name:d, userId:$userId}) MERGE (m)-[:MAKES_DECISION]->(dec))",
      parameters: {
        userId: p.userId, mission: p.mission ?? null, culture: p.culture ?? null,
        knowledge: p.knowledge ?? [], playbooks: p.playbooks ?? [], decisions: p.decisions ?? [],
      },
    },
  ]);
}

/** Identity graph: link a user to their identity archetypes, values, models, shadows, mission. */
export function projectIdentityLibraryGraph(p: {
  userId: string; identities?: string[]; values?: string[]; mentalModels?: string[]; shadows?: string[]; mission?: string;
}) {
  return runCypher([
    {
      statement:
        "MERGE (u:User {id:$userId}) " +
        (p.mission ? "MERGE (m:Mission {name:$mission}) " : "") +
        "FOREACH (idn IN $identities | MERGE (i:Identity {name:idn, userId:$userId}) MERGE (u)-[:HAS_IDENTITY]->(i) " +
        (p.mission ? "MERGE (i)-[:SUPPORTS_MISSION]->(m) " : "") + ") " +
        "FOREACH (v IN $values | MERGE (val:Value {name:v}) MERGE (u)-[:HAS_VALUE]->(val)) " +
        "FOREACH (mm IN $mentalModels | MERGE (md:MentalModel {name:mm}) MERGE (u)-[:USES_MODEL]->(md)) " +
        "FOREACH (sh IN $shadows | MERGE (s:Shadow {name:sh, userId:$userId}) MERGE (u)-[:HAS_SHADOW]->(s))",
      parameters: {
        userId: p.userId, mission: p.mission ?? null, identities: p.identities ?? [],
        values: p.values ?? [], mentalModels: p.mentalModels ?? [], shadows: p.shadows ?? [],
      },
    },
  ]);
}

/** Cognitive graph: link a user to mental models, biases, decisions, principles, wisdom. */
export function projectCognitiveGraph(p: {
  userId: string; models?: string[]; biases?: string[]; decisions?: string[]; principles?: string[]; wisdom?: string[];
}) {
  return runCypher([
    {
      statement:
        "MERGE (u:User {id:$userId}) " +
        "FOREACH (m IN $models | MERGE (mm:MentalModel {name:m}) MERGE (u)-[:USES_MODEL]->(mm)) " +
        "FOREACH (b IN $biases | MERGE (bi:Bias {name:b}) MERGE (u)-[:SUFFERS_FROM_BIAS]->(bi)) " +
        "FOREACH (d IN $decisions | MERGE (de:Decision {name:d, userId:$userId}) MERGE (u)-[:SUPPORTS_DECISION]->(de)) " +
        "FOREACH (pr IN $principles | MERGE (p:Principle {name:pr, userId:$userId}) MERGE (u)-[:INFORMS_JUDGMENT]->(p)) " +
        "FOREACH (w IN $wisdom | MERGE (wi:Wisdom {name:w, userId:$userId}) MERGE (u)-[:GENERATES_WISDOM]->(wi))",
      parameters: {
        userId: p.userId, models: p.models ?? [], biases: p.biases ?? [],
        decisions: p.decisions ?? [], principles: p.principles ?? [], wisdom: p.wisdom ?? [],
      },
    },
  ]);
}

/** Worldview graph: link a user's worldview to assumptions, mission, identity, principles, meaning. */
export function projectWorldviewGraph(p: {
  userId: string; assumptions?: string[]; mission?: string; identities?: string[]; principles?: string[]; meaning?: string[];
}) {
  return runCypher([
    {
      statement:
        "MERGE (u:User {id:$userId}) MERGE (w:Worldview {userId:$userId}) MERGE (u)-[:HAS_WORLDVIEW]->(w) " +
        (p.mission ? "MERGE (m:Mission {name:$mission}) MERGE (w)-[:CREATES]->(m) " : "") +
        "FOREACH (a IN $assumptions | MERGE (as:Assumption {name:a, userId:$userId}) MERGE (w)-[:INFLUENCES]->(as)) " +
        "FOREACH (idn IN $identities | MERGE (i:Identity {name:idn, userId:$userId}) MERGE (w)-[:SUPPORTS]->(i)) " +
        "FOREACH (pr IN $principles | MERGE (p:Principle {name:pr, userId:$userId}) MERGE (w)-[:CREATES]->(p)) " +
        "FOREACH (me IN $meaning | MERGE (mn:Meaning {name:me, userId:$userId}) MERGE (w)-[:CREATES]->(mn))",
      parameters: {
        userId: p.userId, mission: p.mission ?? null, assumptions: p.assumptions ?? [],
        identities: p.identities ?? [], principles: p.principles ?? [], meaning: p.meaning ?? [],
      },
    },
  ]);
}

/** Child graph: link a child to identities, projects, capabilities, parent support. */
export function projectChildGraph(p: {
  childId: string; identities?: string[]; projects?: string[]; capabilities?: string[];
}) {
  return runCypher([
    {
      statement:
        "MERGE (c:Child {id:$childId}) " +
        "FOREACH (idn IN $identities | MERGE (i:Identity {name:idn, childId:$childId}) MERGE (c)-[:HAS_IDENTITY]->(i)) " +
        "FOREACH (pr IN $projects | MERGE (p:Project {name:pr, childId:$childId}) MERGE (c)-[:WORKS_ON]->(p)) " +
        "FOREACH (cap IN $capabilities | MERGE (ca:Capability {name:cap}) MERGE (c)-[:BUILDS_CAPABILITY]->(ca))",
      parameters: { childId: p.childId, identities: p.identities ?? [], projects: p.projects ?? [], capabilities: p.capabilities ?? [] },
    },
  ]);
}
