// Scenario-suite evaluation. Runs each scenario's agent and grades behavior:
//   npm run eval:scenarios
// Under AI_PROVIDER=mock, agents return their example outputs, so this is a smoke test
// that the graders execute; run with a real provider for a true behavioral eval. Writes
// eval-scenarios-report.json. Exits non-zero on any failure when a real provider is used.

import { writeFileSync } from "node:fs";
import { getAgent, type AgentName } from "../src/lib/agents/registry";
import { getProvider } from "../src/lib/ai/provider";
import { SCENARIOS, gradeScenario, SCENARIO_SUITES } from "../src/lib/eval/scenarios";

async function main() {
  const provider = getProvider();
  const mock = provider.name === "mock";
  const rows: Record<string, unknown>[] = [];

  for (const sc of SCENARIOS) {
    const started = Date.now();
    try {
      const agent = getAgent(sc.agent as AgentName);
      const output = await agent.run(sc.input as never);
      const grade = gradeScenario(sc, output);
      rows.push({
        id: sc.id, suite: sc.suite, agent: sc.agent, pass: grade.pass,
        score: Number(grade.score.toFixed(2)), ms: Date.now() - started,
        failed: grade.results.filter((r) => !r.pass).map((r) => r.label),
      });
    } catch (e) {
      rows.push({ id: sc.id, suite: sc.suite, agent: sc.agent, pass: false, score: 0, error: e instanceof Error ? e.message : String(e) });
    }
  }

  const bySuite = Object.fromEntries(
    SCENARIO_SUITES.map((s) => {
      const r = rows.filter((x) => x.suite === s);
      return [s, { total: r.length, passed: r.filter((x) => x.pass).length }];
    }),
  );
  const passed = rows.filter((r) => r.pass).length;
  const report = { provider: provider.name, mock, total: rows.length, passed, bySuite, rows, generatedAt: new Date().toISOString() };
  writeFileSync("eval-scenarios-report.json", JSON.stringify(report, null, 2));

  console.log(`\nScenario eval — provider=${provider.name} — ${passed}/${rows.length} passed`);
  for (const r of rows) {
    const mark = r.pass ? "✓" : "✗";
    const extra = r.error ? ` ERROR: ${r.error}` : (r.failed as string[])?.length ? ` — failed: ${(r.failed as string[]).join("; ")}` : "";
    console.log(`  ${mark} [${r.suite}] ${r.id} (${r.agent})${extra}`);
  }
  if (mock) console.log("\nNOTE: mock returns example outputs — run with a real AI_PROVIDER for a true behavioral eval.");
  process.exit(!mock && passed < rows.length ? 1 : 0);
}

main().catch((e) => { console.error(e); process.exit(1); });
