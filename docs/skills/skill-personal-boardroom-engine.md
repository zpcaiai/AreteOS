# Skill: Personal Boardroom Engine

You are a Principal Multi-Agent Systems Architect, Decision Intelligence Designer, AI Product Architect, and Human Development Systems Engineer. Build a production-grade subsystem inside Mission OS: the **PERSONAL BOARDROOM ENGINE**. Tagline: *a multi-agent advisory board for high-stakes life and work decisions.*

> Note: Mission OS already ships a Mentor Council (`/council`, `src/lib/council*.ts`) with 5 lenses, consensus metrics, and a moderator. The Boardroom extends that to 10 named advisors + decision-memo output; reuse the council orchestration + consensus math.

## Purpose
A single AI coach isn't enough for complex decisions. This engine convenes a personal AI boardroom of specialized advisors, each evaluating the question from a different mental model.

## Core principle
Wisdom improves when multiple high-quality perspectives challenge each other. The boardroom does not decide for the user — it improves the user's judgment.

## Boardroom advisors
1. **Identity Advisor** (Dilts) — Does this align with who you're becoming? 2. **Mental Model Advisor** (Munger) — What models apply? What are you missing? 3. **First-Principle Challenger** (Musk-style) — What assumptions must be true? 4. **Effectiveness Advisor** (Drucker) — What is the real contribution? 5. **Leverage Advisor** (Naval) — Does this increase leverage and freedom? 6. **Risk Advisor** (Taleb) — What can break? What's fragile? 7. **Bias Detector** (Kahneman) — What bias is present? 8. **Principle Advisor** (Covey) — Does this violate your principles? 9. **Execution Advisor** (Grove) — What's the operating plan? 10. **Reflection Advisor** (Dalio-style) — How will this be reviewed?

## Domain model (`src/domains/personal-boardroom/`: types, events, repository, service, score, orchestrator)
Entities: BoardroomSession, BoardroomQuestion, BoardroomAdvisor, AdvisorResponse, AdvisorDebate, BoardroomSynthesis, BoardroomDecisionMemo, BoardroomReview, BoardroomScoreSnapshot.

**BoardroomSession**: id, userId, title, question, context, decisionType, status, …
**AdvisorResponse**: id, sessionId, advisorType, perspective, analysis, risks(Json), opportunities(Json), questions(Json), recommendation, confidence, …
**BoardroomSynthesis**: id, sessionId, summary, agreements(Json), disagreements(Json), keyRisks(Json), keyOpportunities(Json), recommendedDecision, nextActions(Json), …

## Session types
career, startup, investment, relationship, learning, health, leadership, management, product, identity, wealth, relocation, major life choice.

## Workflow
1. Submit question. 2. Clarify context. 3. Select advisors (or default board). 4. Each advisor responds. 5. Advisors challenge assumptions. 6. Synthesize. 7. Generate decision memo. 8. User decides. 9. Schedule review.

## Decision memo template
1. Decision Question 2. Context 3. Options 4. Advisor Perspectives 5. Key Agreements 6. Key Disagreements 7. Hidden Assumptions 8. Risks 9. Opportunities 10. Reversibility 11. Principle Alignment 12. Identity Alignment 13. Recommended Next Step 14. Review Date.

## Scoring
PerspectiveDiversityScore, AssumptionQualityScore, RiskCoverageScore, DecisionClarityScore, AdvisorAgreementScore, BoardroomUsefulnessScore.

## AI agents
Advisor agents: IdentityAdvisor, MentalModelAdvisor, FirstPrincipleChallenger, EffectivenessAdvisor, LeverageAdvisor, RiskAdvisor, BiasDetectorAdvisor, PrincipleAdvisor, ExecutionAdvisor, ReflectionAdvisor. Plus BoardroomModerator, BoardroomSynthesizer, DecisionMemoWriter.

## API routes
POST `/api/boardroom/session` · GET `/sessions` · GET `/session/:id` · POST `/session/:id/advisors` · POST `/session/:id/run` · POST `/session/:id/synthesize` · POST `/session/:id/memo` · POST `/session/:id/review` · GET `/dashboard`.

## Frontend
Pages: `/boardroom`, `/new`, `/session/[id]`, `/history`, `/dashboard`. Components: BoardroomQuestionForm, AdvisorSelector, AdvisorResponseCard, AdvisorDebateView, BoardroomSynthesisPanel, DecisionMemoViewer, BoardroomHistoryTable.

## User flow
1. Ask a complex question. 2. Clarify context. 3. Select board. 4. Run advisors. 5. Review perspectives. 6. Synthesis. 7. Decision memo. 8. Record decision. 9. Schedule review. 10. Review updates Judgment Engine.

## Integration
Decision Engine, Cognitive Bias, Mental Model, First Principle, Identity, Naval Life OS, Principle-Centered Life, Reflection. (Reuse the existing Mentor Council orchestrator + consensus metrics.)

## Implementation order
1. Domain types → 2. Prisma schema → 3. Advisor registry → 4. Agent prompts → 5. Boardroom orchestrator → 6. Synthesis service → 7. API routes → 8. UI → 9. Decision Memo export → 10. Integration with Decision Journal. Before coding, output: advisor architecture, orchestration flow, database summary, checklist.
