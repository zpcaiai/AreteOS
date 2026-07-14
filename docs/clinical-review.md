# Clinical review process

The Healing OS and other mental-health-adjacent modules touch clinically sensitive
territory (CBT, exposure, parts work, stabilization, relapse prevention, identity
rebuild). This document defines how those modules are reviewed and how the review is
**enforced in code** rather than left as an intention.

## Two layers

### 1. Safety essentials — automated, blocking
Every module flagged `clinical: true` in `src/lib/clinical/review-registry.ts` MUST have:

- **Not-diagnosis boundary** — an explicit "this is not diagnosis/treatment and cannot
  replace a therapist, psychiatrist, or emergency services" statement (see `/safety` and
  the site-wide `Disclaimer`).
- **Crisis resources** — on any risk signal, the flow routes to `/safety`, which renders
  region-aware crisis lines from `src/lib/healing/crisis-resources.ts` plus a universal,
  non-promissory guidance line. Operators localize via the `HEALING_CRISIS_RESOURCES` env var.
- **Safety triage** — the module sits behind the deterministic safety gate
  (`SafetyTriageClassifier` + `src/lib/healing/workflows.ts`), where the highest-risk
  (red) path short-circuits to crisis response and can never be downgraded by the model.

Enforced by `npm run check:clinical` (`scripts/clinical-gate.ts`) → **exit non-zero** if any
clinical module is missing an essential. Unit-tested in `test/clinical-review.test.ts`.
Wire it into CI as a required gate.

### 2. Expert sign-off — human, tracked
A **licensed clinician** reviews each clinical module before it is promoted out of preview,
checking: clinical accuracy, that techniques match their evidence base, that success is
framed safely (e.g. exposure success = *approaching/recording*, never *zero anxiety*),
contraindications, and escalation wording. The reviewer's name, date, and scope are
recorded on the module in `review-registry.ts` (`expertReview: "reviewed"`), which lifts
its status in the `/admin` "Clinical review" card and in `expertReviewStatus()`.

Current coverage is intentionally honest: only `/safety` is marked reviewed; the rest are
`pending` until a clinician signs off. This is **tracked, not blocking** — the automated
safety essentials above are the hard gate.

## How to record a review
1. Clinician reviews the module against the checklist above.
2. Update its entry in `src/lib/clinical/review-registry.ts`:
   `expertReview: "reviewed"`, `reviewer: "<name, credential>"`, `reviewedAt: "<ISO date>"`,
   and a short `scope`.
3. `npm run check:clinical` and the admin card reflect the new coverage.

## Promotion policy
- A clinical module may ship in **preview** with safety essentials in place.
- It may be promoted to a **default/paid** experience only after clinician sign-off is
  recorded. Track this alongside the release checklist in the CI gate.

## Re-review cadence
Re-review on any change to a module's technique content, its prompts, or the safety
triage rules, and at minimum annually. Re-verify crisis numbers per region before each
production deployment (they change).
