// Agent evaluation harness.
//
//   npm run eval:agents            — golden check: every agent runs on its example
//                                    input and must produce schema-valid output.
//   npm run eval:agents -- --judge — additionally grade each output against the
//                                    golden example with an LLM judge (requires a
//                                    real AI_PROVIDER; fails under mock).
//
// Writes eval-report.json so runs can be diffed across prompt changes.

import { writeFileSync } from "node:fs";
import { getProvider } from "../src/lib/ai/provider";
import { gradeOutput, isSafetySensitive } from "../src/lib/eval/rubric";
import { parseJudgeVerdict } from "../src/lib/eval/judge";

interface Row {
  agent: string;
  ok: boolean;
  ms: number;
  judgeScore?: number;
  judgeReason?: string;
  rubricScore?: number;
  rubricFlags?: string[];
  error?: string;
}

const JUDGE_SYSTEM =
  "You are a strict evaluator of AI coaching outputs. Compare the CANDIDATE output to the GOLDEN reference for the same input. " +
  "Score 1-5: 5 = matches the golden's intent, structure, and quality; 3 = usable but notably weaker or partially off-intent; 1 = wrong, unsafe, or off-schema. " +
  'Return ONLY JSON: {"score": <1-5>, "reason": "<one sentence>"}';

async function judge(agentName: string, input: unknown, golden: unknown, candidate: unknown) {
  const provider = getProvider();
  if (provider.name === "mock") return null;
  const raw = await provider.complete({
    system: JUDGE_SYSTEM,
    user: `AGENT: ${agentName}\nINPUT: ${JSON.stringify(input).slice(0, 3000)}\nGOLDEN: ${JSON.stringify(golden).slice(0, 3000)}\nCANDIDATE: ${JSON.stringify(candidate).slice(0, 3000)}`,
    json: true,
    temperature: 0,
  });
  return parseJudgeVerdict(raw);
}

async function main() {
  const useJudge = process.argv.includes("--judge");
  const provider = getProvider();
  if (provider.name === "mock" && (useJudge || process.argv.includes("--require-real"))) {
    throw new Error("A real AI_PROVIDER is required for --judge or --require-real; mock evidence is only an offline smoke check");
  }
  const { AGENTS } = await import("../src/lib/agents/registry");
  const rows: Row[] = [];

  for (const agent of Object.values(AGENTS)) {
    const started = Date.now();
    try {
      const output = await agent.run(agent.spec.example.input as never);
      agent.spec.outputSchema.parse(output);
      const rubric = gradeOutput(output, isSafetySensitive(agent.name));
      const row: Row = { agent: agent.name, ok: true, ms: Date.now() - started, rubricScore: Number(rubric.score.toFixed(3)), rubricFlags: rubric.flags };
      if (useJudge) {
        const verdict = await judge(agent.name, agent.spec.example.input, agent.spec.example.output, output);
        if (verdict) {
          row.judgeScore = verdict.score;
          row.judgeReason = verdict.reason;
          if (verdict.score < 3) row.ok = false;
        }
      }
      rows.push(row);
    } catch (e) {
      rows.push({ agent: agent.name, ok: false, ms: Date.now() - started, error: e instanceof Error ? e.message : String(e) });
    }
  }

  const failed = rows.filter((row) => !row.ok);
  const judged = rows.filter((row) => typeof row.judgeScore === "number");
  console.table(rows.map(({ agent, ok, ms, judgeScore, error }) => ({ agent, ok, ms, judgeScore: judgeScore ?? "—", error: error?.slice(0, 60) ?? "" })));

  const report = {
    ranAt: new Date().toISOString(),
    provider: getProvider().name,
    mock: provider.name === "mock",
    evidenceKind: provider.name === "mock" ? "OFFLINE_SMOKE" : "REAL_PROVIDER",
    judged: judged.length,
    avgRubricScore: rows.filter((r) => typeof r.rubricScore === "number").length
      ? rows.reduce((sum, r) => sum + (r.rubricScore ?? 0), 0) / rows.filter((r) => typeof r.rubricScore === "number").length
      : null,
    avgJudgeScore: judged.length ? judged.reduce((s, r) => s + (r.judgeScore ?? 0), 0) / judged.length : null,
    passed: rows.length - failed.length,
    failed: failed.length,
    rows,
  };
  writeFileSync("eval-report.json", JSON.stringify(report, null, 2));
  console.log(`eval-report.json written (${report.passed}/${rows.length} passed${report.avgJudgeScore ? `, avg judge ${report.avgJudgeScore.toFixed(2)}` : ""})`);

  if (failed.length) {
    console.error(`${failed.length} agent eval(s) failed`);
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
