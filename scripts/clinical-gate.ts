// Clinical safety gate — run in CI to block promotion of any clinical module that is
// missing a not-diagnosis boundary, crisis resources, or safety triage. Also reports
// (non-blocking) how much of the clinical surface has a named clinician sign-off.
//   npm run check:clinical
import { clinicalSafetyGate, expertReviewStatus } from "../src/lib/clinical/review-registry";

const gate = clinicalSafetyGate();
const review = expertReviewStatus();

console.log(`Clinical safety gate: ${gate.ok ? "PASS ✓" : "FAIL ✗"} — ${gate.checked} clinical modules checked`);
for (const v of gate.violations) console.log(`  ✗ ${v.key}: missing ${v.missing.join(", ")}`);
console.log(
  `Expert sign-off: ${review.reviewed}/${review.clinicalModules} reviewed (${Math.round(review.coverage * 100)}%)` +
  (review.pendingKeys.length ? ` — pending: ${review.pendingKeys.join(", ")}` : ""),
);
if (review.pending > 0) console.log("NOTE: pending expert sign-off is tracked, not blocking. Record a clinician review in review-registry.ts to clear it.");

process.exit(gate.ok ? 0 : 1);
