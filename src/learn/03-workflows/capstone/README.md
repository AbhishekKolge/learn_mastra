# Capstone 3: AI Content Pipeline

Build a full-stack **Content Pipeline** using Express + React + shadcn/ui + AI SDK, applying everything from Section 3 (Modules 1-8).

## What you'll build

A web app that generates blog posts through a multi-step workflow:
1. User submits a topic
2. Workflow researches the topic via an agent (Module 5)
3. Generates outline + keywords in parallel (Module 2)
4. Writes sections using foreach (Module 3)
5. Tracks progress with workflow state (Module 4)
6. Suspends for human approval before publishing (Module 6, 7)
7. Errors retry automatically; failures can be time-traveled (Module 8)

## Concepts practiced

| Module | Concept | How it's used |
|--------|---------|---------------|
| 1 | Workflow basics, start/stream | Core workflow creation and execution |
| 2 | .parallel(), .branch(), .map() | Parallel outline + keywords; quality branching |
| 3 | .foreach() | Process each section of the outline |
| 4 | Workflow state | Track sectionsCompleted counter |
| 5 | Agents & tools in workflows | Agent writes content inside steps |
| 6 | Suspend & resume, snapshots | Pause for human approval |
| 7 | Human-in-the-loop, bail() | Approve/reject the final draft |
| 8 | Time travel, retries, onFinish | Debug failures, retry flaky calls |

## Tech stack

- **Backend**: Express.js + Mastra workflows
- **Frontend**: Vite + React + shadcn/ui
- **Streaming**: Workflow stream events via SSE

## Project structure

```
capstone-3-content-pipeline/
├── server/
│   ├── index.ts                    ← Express server
│   ├── routes/
│   │   ├── workflow.ts             ← POST /api/workflow — start pipeline
│   │   └── resume.ts               ← POST /api/resume — resume suspended
│   └── mastra/
│       ├── index.ts
│       ├── agents/
│       │   └── writer-agent.ts     ← Writing agent for content steps
│       └── workflows/
│           └── content-pipeline.ts ← The main workflow
├── client/
│   ├── src/
│   │   ├── App.tsx                 ← Main layout
│   │   ├── components/
│   │   │   ├── ui/                 ← shadcn (button, card, input, badge, dialog, progress, alert)
│   │   │   ├── topic-form.tsx      ← Submit topic
│   │   │   ├── pipeline-progress.tsx ← Step-by-step visualization
│   │   │   ├── approval-dialog.tsx ← Approve/reject draft
│   │   │   └── article-preview.tsx ← Final article display
├── package.json
└── tsconfig.json
```

## Step-by-step instructions

### 1. Backend: Create the workflow

**server/mastra/workflows/content-pipeline.ts**
```typescript
// TODO: Build the full content pipeline workflow
//
// Steps:
// 1. researchStep — agent call to research topic (Module 5)
// 2. outlineStep + keywordsStep — parallel (Module 2)
// 3. writeSectionStep — foreach with concurrency: 3 (Module 3)
// 4. assembleStep — .map() to combine sections
// 5. approvalStep — suspend() for HITL, bail() on reject (Module 6, 7)
//
// Workflow config:
//   stateSchema: { currentStep, sectionsCompleted }  (Module 4)
//   retryConfig: { attempts: 3, delay: 1000 }        (Module 8)
//   options: { onFinish, onError }                    (Module 8)
//
// Composition:
//   .then(researchStep)
//   .parallel([outlineStep, keywordsStep])
//   .map(...)
//   .foreach(writeSectionStep, { concurrency: 3 })
//   .map(...)
//   .then(approvalStep)
//   .commit()
```

### 2. Backend: Express routes

**server/routes/workflow.ts**
```typescript
// TODO: POST /api/workflow
// 1. Extract { topic } from req.body
// 2. Create workflow run: const run = await workflow.createRun()
// 3. Stream events: const stream = run.stream({ inputData: { topic } })
// 4. Pipe workflow events as SSE to client
// 5. Store runId for potential resume
```

**server/routes/resume.ts**
```typescript
// TODO: POST /api/resume
// 1. Extract { runId, step, resumeData } from req.body
// 2. Create run with existing runId: workflow.createRun({ runId })
// 3. Resume: run.resume({ step, resumeData })
// 4. Stream remaining events to client
```

### 3. Frontend: Pipeline progress with shadcn

**client/src/components/pipeline-progress.tsx**
```tsx
// TODO: Build using shadcn Card + Badge + Progress
// 1. Show each workflow step as a Card
// 2. Badge for status: 'running' (blue), 'success' (green), 'failed' (red), 'suspended' (yellow)
// 3. Progress bar for foreach (sectionsCompleted / totalSections)
// 4. Expand card to see step output
```

**client/src/components/approval-dialog.tsx**
```tsx
// TODO: Build using shadcn Dialog + Button + Alert
// 1. When workflow status === 'suspended', show Dialog
// 2. Display draft preview from suspendPayload
// 3. "Approve" button → POST /api/resume with { approved: true }
// 4. "Reject" button → POST /api/resume with { approved: false }
// 5. Show Alert on rejection (bail)
```

**client/src/components/article-preview.tsx**
```tsx
// TODO: Build using shadcn Card with markdown rendering
// Show the final published article when status === 'success'
```

## How to run

```bash
# Terminal 1
cd server && npx tsx index.ts

# Terminal 2
cd client && pnpm dev
```

## Test scenarios

1. **Happy path**: Submit "AI in healthcare" → research → outline + keywords → write → approve → published
2. **Rejection**: Let it run → reject at approval → status: success with bail result
3. **Failure recovery**: Simulate a failing step → retries kick in → onError callback fires
4. **Time travel**: Research was bad → time travel back to research step with better input
5. **Progress tracking**: Watch foreach progress bar fill as sections complete

## Bonus challenges

1. Add quality branching: after writing, score quality → if < 7, rewrite; if >= 7, approve (Module 2)
2. Add dowhile: keep rewriting until quality > 7, max 3 attempts (Module 3)
3. Add real-time state display: show sectionsCompleted updating live (Module 4)
4. Add custom stream events: emit progress with writer for richer UI
5. Add shadcn Stepper component showing current pipeline stage
