import { releaseReadiness, type ReleaseProfile } from "../src/lib/release/readiness";

const inline = process.argv.find((arg) => arg.startsWith("--profile="))?.split("=")[1];
const profileIndex = process.argv.indexOf("--profile");
const requested = (inline || (profileIndex >= 0 ? process.argv[profileIndex + 1] : undefined)) as ReleaseProfile | undefined;
const report = releaseReadiness(process.env, requested);

console.log(`Release gate: ${report.profile} — ${report.ready ? "PASS" : "FAIL"}`);
for (const check of report.checks) {
  const mark = check.status === "pass" ? "✓" : check.status === "disabled" ? "–" : "✗";
  console.log(`${mark} [${check.category}] ${check.id}: ${check.message}`);
  if (check.status === "fail" && check.remediation) console.log(`  ${check.remediation}`);
}

if (!report.ready) process.exit(1);
