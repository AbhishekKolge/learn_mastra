# Capstone 7: Agent Quality Monitoring System

Build a complete **Agent Quality Monitoring System** using Express + React + shadcn/ui + Vitest, applying everything from Section 7 (Modules 1-7).

## What you'll build

A quality assurance system that monitors, tests, and analyzes AI agent performance:
1. Built-in scorers evaluate accuracy, safety, and quality (Modules 1-2)
2. Custom domain-specific scorers for your use case (Module 3)
3. Multi-step scorer pipelines mixing functions and LLM judges (Module 4)
4. Live evaluations run continuously on agent outputs (Module 5)
5. CI test suites gate deployments with quality thresholds (Module 6)
6. Trace evaluations analyze historical performance (Module 7)

## Concepts practiced

| Module | Concept | How it's used |
|--------|---------|---------------|
| 1 | Scorers overview, manual scoring | Foundation for all evals |
| 2 | Built-in scorers | Relevancy, faithfulness, toxicity, bias |
| 3 | Custom scorers, createScorer | Domain-specific evaluation |
| 4 | 4-step pipeline, functions + prompts | Complex multi-stage scoring |
| 5 | Live evals, sampling | Production monitoring |
| 6 | runEvals, CI testing | Deployment quality gates |
| 7 | Trace evals, Mastra scorers | Historical analysis |

## Tech stack

- **Backend**: Express.js + Mastra agents with live scorers
- **Frontend**: Vite + React + shadcn/ui (score dashboard)
- **Testing**: Vitest for CI eval suites
- **Database**: LibSQL for score storage

## Project structure

```
capstone-7-quality-monitoring/
├── server/
│   ├── index.ts
│   ├── routes/
│   │   ├── chat.ts                 ← POST /api/chat — agent with live scoring
│   │   └── scores.ts               ← GET /api/scores — fetch score history
│   └── mastra/
│       ├── index.ts                ← Mastra with scorers registered
│       ├── agents/
│       │   └── monitored-agent.ts  ← Agent with live scorers attached
│       └── scorers/
│           ├── relevancy.ts        ← Built-in relevancy scorer
│           ├── safety.ts           ← Toxicity + bias scorers
│           ├── domain-scorer.ts    ← Custom domain scorer (createScorer)
│           └── pipeline-scorer.ts  ← Multi-step pipeline scorer
├── client/
│   ├── src/
│   │   ├── App.tsx                 ← Dashboard layout
│   │   ├── components/
│   │   │   ├── ui/                 ← shadcn (card, badge, tabs, chart, table, progress)
│   │   │   ├── chat-test.tsx       ← Send test messages, see live scores
│   │   │   ├── score-dashboard.tsx ← Aggregate scores over time
│   │   │   ├── scorer-config.tsx   ← Toggle scorers and sampling rates
│   │   │   └── eval-results.tsx    ← CI test results display
│   │   └── hooks/
│   │       └── use-scores.ts       ← Fetch and poll score data
├── tests/
│   ├── agent-quality.test.ts       ← CI eval test suite
│   ├── happy-path.test.ts          ← Happy path scenarios
│   ├── edge-cases.test.ts          ← Edge case scenarios
│   └── regression.test.ts          ← Regression test cases
├── package.json
└── tsconfig.json
```

## Step-by-step instructions

### 1. Backend: Create scorer suite

**server/mastra/scorers/relevancy.ts**
```typescript
// TODO: Built-in relevancy scorer
// import { createAnswerRelevancyScorer } from '@mastra/evals/scorers/prebuilt';
// export const relevancyScorer = createAnswerRelevancyScorer({ model: 'anthropic/claude-haiku-4-5' });
```

**server/mastra/scorers/safety.ts**
```typescript
// TODO: Toxicity + bias scorers
// import { createToxicityScorer, createBiasScorer } from '@mastra/evals/scorers/prebuilt';
// export const toxicityScorer = createToxicityScorer({ model: 'anthropic/claude-haiku-4-5' });
// export const biasScorer = createBiasScorer({ model: 'anthropic/claude-haiku-4-5' });
```

**server/mastra/scorers/domain-scorer.ts**
```typescript
// TODO: Custom domain scorer using createScorer
// Example: check if responses include actionable steps
//
// export const actionabilityScorer = createScorer({
//   id: 'actionability',
//   description: 'Check if response includes actionable steps',
//   judge: { model: 'anthropic/claude-haiku-4-5', instructions: 'You evaluate actionability.' },
// })
// .analyze({
//   description: 'Analyze for actionable content',
//   outputSchema: z.object({ hasSteps: z.boolean(), stepCount: z.number() }),
//   createPrompt: ({ run }) => `Does this response contain actionable steps?\n${run.output}`,
// })
// .generateScore(({ results }) => results.analyzeStepResult.hasSteps ? 1 : 0)
// .generateReason({ ... })
```

**server/mastra/scorers/pipeline-scorer.ts**
```typescript
// TODO: Multi-step pipeline scorer mixing functions + LLM
// .preprocess(({ run }) => { /* extract key phrases with regex */ })
// .analyze({ /* LLM judges quality */ })
// .generateScore(({ results }) => { /* combine preprocess + analyze */ })
// .generateReason(({ results, score }) => { /* explain the score */ })
```

### 2. Backend: Monitored agent with live scoring

**server/mastra/agents/monitored-agent.ts**
```typescript
// TODO: Agent with live scorers attached
// export const monitoredAgent = new Agent({
//   id: 'monitored-agent',
//   model: 'anthropic/claude-sonnet-4-5',
//   scorers: {
//     relevancy: { scorer: relevancyScorer, sampling: { type: 'ratio', rate: 0.5 } },
//     safety:    { scorer: toxicityScorer,   sampling: { type: 'ratio', rate: 1.0 } },
//     domain:    { scorer: actionabilityScorer, sampling: { type: 'ratio', rate: 0.3 } },
//   },
// });
```

### 3. Backend: Register scorers on Mastra for trace evals

**server/mastra/index.ts**
```typescript
// TODO: Register scorers on Mastra instance
// const mastra = new Mastra({
//   agents: { monitoredAgent },
//   scorers: { relevancyScorer, toxicityScorer, biasScorer, actionabilityScorer },
//   storage: new LibSQLStore({ id: 'storage', url: 'file:./evals.db' }),
// });
```

### 4. Tests: CI eval suite

**tests/agent-quality.test.ts**
```typescript
// TODO: CI test suite using runEvals
// describe('Agent Quality', () => {
//   it('should meet relevancy threshold', async () => {
//     const result = await runEvals({
//       data: [
//         { input: 'How do I deploy?', groundTruth: { ... } },
//         { input: 'What is caching?', groundTruth: { ... } },
//       ],
//       target: monitoredAgent,
//       scorers: [relevancyScorer],
//     });
//     expect(result.scores['answer-relevancy']).toBeGreaterThan(0.8);
//   });
//
//   it('should not be toxic', async () => {
//     const result = await runEvals({
//       data: provocativeInputs,
//       target: monitoredAgent,
//       scorers: [toxicityScorer],
//     });
//     expect(result.scores['toxicity']).toBeLessThan(0.1);
//   });
// });
```

### 5. Frontend: Score dashboard with shadcn

**client/src/components/score-dashboard.tsx**
```tsx
// TODO: Build using shadcn Card + Badge + Table
// 1. Fetch scores from GET /api/scores
// 2. Show aggregate scores per scorer (avg, min, max)
// 3. Badge color: green (>0.8), yellow (0.5-0.8), red (<0.5)
// 4. Table of recent individual scores with timestamp
// 5. Trend line showing score over time (optional)
```

**client/src/components/chat-test.tsx**
```tsx
// TODO: Build using shadcn Card + Input + ScrollArea
// 1. Send test messages to monitored agent
// 2. Show agent response
// 3. After response, fetch and display live eval scores
// 4. Highlight scores below threshold in red
```

**client/src/components/scorer-config.tsx**
```tsx
// TODO: Build using shadcn Card + Switch + Slider
// Toggle individual scorers on/off
// Adjust sampling rates with Slider (0-100%)
// Show estimated cost impact of sampling rate
```

## How to run

```bash
# Start the server
cd server && npx tsx index.ts

# Start the dashboard
cd client && pnpm dev

# Run CI eval tests
npx vitest run tests/
```

## Test scenarios

1. **Live monitoring**: Chat 20 times → verify scores are stored in DB
2. **CI happy path**: Run evals on clear questions → all scores > 0.8
3. **CI edge cases**: Run evals on ambiguous queries → check graceful handling
4. **CI regression**: Compare scores before/after a prompt change
5. **Custom scorer**: Run domain scorer → verify 4-step pipeline output
6. **Trace analysis**: Generate traces → view in Studio → score historically

## Bonus challenges

1. Add score trend visualization with shadcn charts
2. Add alerting: highlight when any score drops below threshold
3. Create model comparison eval: same test cases against different models
4. Add A/B testing: compare two prompt variations with runEvals
5. Create composite scorer combining 3+ individual scorers with weights
6. Set up automatic nightly eval runs with cron
