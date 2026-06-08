// MISSION OS — Personal Knowledge Graph (Neo4j).
// PostgreSQL is the system of record (aggregates + event store); Neo4j is a
// projection optimized for traversal: the mental-model latticework, the identity
// graph, and "how thinking connects to action". Rebuildable from domain_events.

// ───────────────────────── constraints / indexes ─────────────────────────
CREATE CONSTRAINT user_id IF NOT EXISTS         FOR (n:User)         REQUIRE n.id IS UNIQUE;
CREATE CONSTRAINT mission_id IF NOT EXISTS      FOR (n:Mission)      REQUIRE n.id IS UNIQUE;
CREATE CONSTRAINT identity_id IF NOT EXISTS     FOR (n:Identity)     REQUIRE n.id IS UNIQUE;
CREATE CONSTRAINT value_id IF NOT EXISTS        FOR (n:Value)        REQUIRE n.id IS UNIQUE;
CREATE CONSTRAINT model_id IF NOT EXISTS        FOR (n:MentalModel)  REQUIRE n.id IS UNIQUE;
CREATE CONSTRAINT principle_id IF NOT EXISTS    FOR (n:FirstPrinciple) REQUIRE n.id IS UNIQUE;
CREATE CONSTRAINT decision_id IF NOT EXISTS     FOR (n:Decision)     REQUIRE n.id IS UNIQUE;
CREATE CONSTRAINT habit_id IF NOT EXISTS        FOR (n:Habit)        REQUIRE n.id IS UNIQUE;
CREATE CONSTRAINT skill_id IF NOT EXISTS        FOR (n:Skill)        REQUIRE n.id IS UNIQUE;
CREATE CONSTRAINT rolemodel_id IF NOT EXISTS    FOR (n:RoleModel)    REQUIRE n.id IS UNIQUE;
CREATE INDEX model_category IF NOT EXISTS       FOR (n:MentalModel)  ON (n.category);

// ───────────────────────── graph model (reference) ─────────────────────────
// (:User)-[:HAS_MISSION]->(:Mission)
// (:Mission)-[:SHAPES]->(:Identity)
// (:Identity)-[:GUIDED_BY]->(:Value)
// (:Identity)-[:REINFORCED_BY]->(:Habit)
// (:User)-[:KNOWS]->(:MentalModel)
// (:MentalModel)-[:CONNECTS_TO {relation}]->(:MentalModel)   // Munger latticework
// (:MentalModel)-[:APPLIED_IN]->(:Decision)
// (:FirstPrinciple)-[:DECOMPOSES]->(:Decision|:FirstPrinciple)
// (:User)-[:MODELS_AFTER]->(:RoleModel)
// (:RoleModel)-[:EXHIBITS]->(:MentalModel)
// (:Identity)-[:EVOLVED_TO {date}]->(:Identity)              // identity timeline
// (:Skill)-[:DEVELOPS]->(:Identity)

// ───────────────────────── example upserts ─────────────────────────
// Identity graph node + edge from mission
MERGE (u:User {id: $userId})
MERGE (m:Mission {id: $missionId}) SET m.statement = $statement
MERGE (i:Identity {id: $identityId}) SET i.name = $identityName
MERGE (u)-[:HAS_MISSION]->(m)
MERGE (m)-[:SHAPES]->(i);

// Mental-model latticework edge
MATCH (a:MentalModel {id: $fromId}), (b:MentalModel {id: $toId})
MERGE (a)-[r:CONNECTS_TO {relation: $relation}]->(b);

// Record a model being applied in a decision (feeds Mental Model Usage Score)
MATCH (mm:MentalModel {id: $modelId}), (d:Decision {id: $decisionId})
MERGE (mm)-[:APPLIED_IN {date: $date}]->(d);

// ───────────────────────── analytics queries ─────────────────────────
// Latticework reach: how many distinct models a user actually applies
// MATCH (u:User {id:$userId})-[:KNOWS]->(mm)-[:APPLIED_IN]->() RETURN count(DISTINCT mm);

// Identity evolution timeline (for the Identity Evolution Visualization)
// MATCH p=(:Identity)-[:EVOLVED_TO*]->(:Identity) WHERE ... RETURN p;
