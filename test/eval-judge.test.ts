import { mkdtempSync, existsSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve, join } from "node:path";
import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { parseJudgeVerdict } from "../src/lib/eval/judge";

describe("judge evidence validation", () => {
  it.each([1, 2, 3, 4, 5])("preserves a valid verdict with score %i", (score) => {
    expect(parseJudgeVerdict(JSON.stringify({ score, reason: "  Specific assessment  " })))
      .toEqual({ score, reason: "Specific assessment" });
  });

  it.each(["not JSON", "null", "[]", "{}", '{"score":0,"reason":"invalid"}',
    '{"score":6,"reason":"invalid"}', '{"score":"4","reason":"invalid"}',
    '{"score":3.5,"reason":"invalid"}', '{"score":4}', '{"score":4,"reason":" "}'])
    ("fails closed for invalid judge evidence %s", (raw) => {
      expect(parseJudgeVerdict(raw).score).toBe(0);
    });

  it.each(["--judge", "--require-real"])("rejects mock evaluation requested with %s before writing a passing report", (flag) => {
    const cwd = mkdtempSync(join(tmpdir(), "arete-eval-"));
    try {
      const result = spawnSync(process.execPath, [
        resolve("node_modules/tsx/dist/cli.mjs"), resolve("scripts/evaluate-agents.ts"), flag,
      ], { cwd, env: { ...process.env, NODE_ENV: "test", AI_PROVIDER: "mock" }, encoding: "utf8", timeout: 20_000 });
      expect(result.error).toBeUndefined();
      expect(result.status).toBe(1);
      expect(result.stderr).toContain("real AI_PROVIDER is required");
      expect(existsSync(join(cwd, "eval-report.json"))).toBe(false);
    } finally { rmSync(cwd, { recursive: true, force: true }); }
  });
});
