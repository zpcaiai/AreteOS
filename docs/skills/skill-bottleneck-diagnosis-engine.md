# Skill: Bottleneck Diagnosis Engine

You are a Principal Diagnostic Systems Architect, AI Coach Architect, Human Development Analyst, and Product Engineer. Build a production-grade subsystem inside Mission OS: the **BOTTLENECK DIAGNOSIS ENGINE**. Tagline: *find the real constraint in a human growth system.*

## Purpose
Most users misdiagnose themselves ("I lack discipline"), when the real issue may be unclear identity, low energy, wrong environment, conflicting values, weak motivation, bad behavior design, missing skill, hidden fear, low leverage, or no feedback loop. This engine diagnoses the true bottleneck.

## Core principle
Growth is limited by the strongest constraint. Do not recommend more action until the bottleneck is known.

## Bottleneck types
1. Mission (doesn't know why it matters) 2. Identity (doesn't know who they're becoming) 3. Value Conflict 4. Belief (limiting beliefs) 5. Motivation (autonomy/competence/relatedness low) 6. Energy 7. Focus 8. Skill 9. Judgment 10. Environment 11. Habit (poor behavior design) 12. Shadow (avoidance/fear/ego/comfort/procrastination) 13. Leverage (hard work, no scalable output) 14. Asset (consumes/works but creates nothing durable) 15. Relationship (no support/feedback/aligned community) 16. Antifragility (overdependent/fragile).

## Domain model (`src/domains/bottleneck-diagnosis/`: types, events, repository, service, score, rules)
Entities: BottleneckAssessment, BottleneckSignal, BottleneckDiagnosis, BottleneckRootCause, BottleneckEvidence, BottleneckRecommendation, BottleneckHistory, BottleneckScoreSnapshot.

**BottleneckAssessment**: id, userId, contextType, contextId?, userProblemStatement, rawInput, …
**BottleneckSignal**: id, assessmentId, signalType, description, source, strength, confidence, …
**BottleneckDiagnosis**: id, assessmentId, primaryBottleneck, secondaryBottlenecks(Json), rootCause, confidence, severity, urgency, recommendedNextEngine, …
**BottleneckRecommendation**: id, diagnosisId, recommendationType, action, rationale, expectedImpact, …

## Diagnostic inputs
Free text, habit logs, reflection logs, decision history, identity profile, mission profile, energy rating, deep-work history, asset output history, failure patterns, emotional patterns.

## Diagnostic questions
1. What problem keeps repeating? 2. What have you tried? 3. What do you avoid? 4. What drains energy? 5. What identity are you becoming? 6. What behavior fails most? 7. What happens right before failure? 8. What do you believe about this? 9. What changes if it disappeared? 10. What evidence shows it's the real issue? 11. What's easiest to blame but probably not root? 12. What system reinforces the old pattern?

## Diagnostic rules (rule-based before AI)
- Clear goals but no consistent action → check Motivation, Energy, Environment, Habit Design.
- Consumes resources but produces nothing → Asset, Shadow, Focus.
- Changes goals frequently → Mission, Identity, Value Conflict.
- Many hours, no progress → Leverage, Decision, Skill.
- Starts but doesn't finish → Shadow, Energy, Behavior Design.
- Feels stuck despite effort → Belief, Double-Loop Learning need.

## Scoring (0–100)
BottleneckSeverityScore, BottleneckConfidenceScore, RootCauseClarityScore, InterventionPriorityScore, BottleneckResolutionScore. `Primary Bottleneck Score = Severity × Confidence × Urgency × ImpactPotential`.

## AI agents
BottleneckDiagnostician, RootCauseAnalyzer, SignalExtractor, MisdiagnosisDetector, InterventionRecommender, BottleneckReviewCoach. All output structured JSON.

## API routes
POST `/api/bottlenecks/assessment` · POST `/diagnose` · GET `/history` · GET `/current` · POST `/review` · GET `/dashboard`.

## Frontend
Pages: `/bottlenecks`, `/assessment`, `/current`, `/history`, `/dashboard`. Components: BottleneckAssessmentForm, BottleneckDiagnosisCard, BottleneckEvidenceList, RootCauseMap, BottleneckPriorityMatrix, RecommendedInterventionPanel, BottleneckTimeline.

## User flow
1. Describe problem. 2. Collect signals. 3. Rule engine → preliminary diagnosis. 4. AI refines. 5. Output primary + secondary bottlenecks. 6. Recommend next intervention. 7. Track improvement. 8. Update diagnosis over time.

## Integration
Growth Protocol, Growth Prescription, Mission, Identity, Habit, Reflection, Deep Work, Specific Knowledge, Naval Life OS, Antifragile Life.

## Implementation order
1. Domain types → 2. Prisma models → 3. Bottleneck taxonomy → 4. Rule-based engine → 5. Scoring → 6. AI agents → 7. API routes → 8. UI → 9. Dashboard → 10. Integration with Growth Prescription. Before coding, output: bottleneck taxonomy, rule map, data model, checklist.
