# Capstone: AI Content Pipeline (Workflows Section)

Build a full-stack **Content Pipeline** app using everything from Modules 16-23.

## What you'll build

A Next.js app that generates blog posts through a multi-step workflow:
1. User submits a topic
2. Workflow researches the topic (agent in workflow — Module 20)
3. Workflow generates an outline in parallel with keyword research (Module 17)
4. Workflow writes the post using the outline (Module 16)
5. Workflow pauses for human approval before publishing (Module 21, 22)
6. UI shows step-by-step progress with streaming (AI SDK UI)
7. Errors retry automatically; failures can be time-traveled (Module 23)

## Concepts practiced

| Module | Concept | How it's used |
|--------|---------|---------------|
| 16 | Workflow basics, start/stream | Core workflow creation and execution |
| 17 | .parallel(), .branch(), .map() | Parallel outline + keywords; branch on quality |
| 18 | .foreach() | Process each section of the outline |
| 19 | Workflow state | Track progress across steps |
| 20 | Agents & tools in workflows | Agent writes content inside workflow steps |
| 21 | Suspend & resume, snapshots | Pause for human approval |
| 22 | Human-in-the-loop, bail() | Approve/reject the final draft |
| 23 | Time travel, retries, onFinish | Debug failures, retry flaky API calls |

## Project structure

```
app/
├── api/
│   └── workflow/
│       └── route.ts              ← workflowRoute or handleWorkflowStream
├── page.tsx                      ← Pipeline UI
├── components/
│   ├── topic-form.tsx            ← Submit topic
│   ├── pipeline-progress.tsx     ← Step-by-step visualization
│   ├── approval-dialog.tsx       ← Approve/reject draft
│   └── article-preview.tsx       ← Final article display
src/
├── mastra/
│   ├── agents/
│   │   └── writer-agent.ts       ← Writing agent
│   ├── workflows/
│   │   └── content-pipeline.ts   ← The main workflow
│   └── index.ts
```

## Step-by-step instructions

### 1. Backend: Create the workflow steps

**src/mastra/workflows/content-pipeline.ts**
```typescript
// TODO: Create the full content pipeline workflow
//
// Step 1: Research (agent call)
// const researchStep = createStep({
//   id: 'research',
//   inputSchema: z.object({ topic: z.string() }),
//   outputSchema: z.object({ topic: z.string(), research: z.string() }),
//   execute: async ({ inputData, mastra }) => {
//     const agent = mastra.getAgent('writerAgent');
//     const response = await agent.generate(
//       `Research key points about: ${inputData.topic}. Return 5-7 bullet points.`
//     );
//     return { topic: inputData.topic, research: response.text };
//   },
// });
//
// Step 2a + 2b: Parallel (outline + keywords)
// const outlineStep = createStep({
//   id: 'outline',
//   inputSchema: z.object({ topic: z.string(), research: z.string() }),
//   outputSchema: z.object({ sections: z.array(z.string()) }),
//   execute: async ({ inputData, mastra }) => {
//     // Agent generates outline sections from research
//   },
// });
//
// const keywordsStep = createStep({
//   id: 'keywords',
//   inputSchema: z.object({ topic: z.string(), research: z.string() }),
//   outputSchema: z.object({ keywords: z.array(z.string()) }),
//   execute: async ({ inputData }) => {
//     // Extract or generate keywords
//   },
// });
//
// Step 3: Write each section (foreach)
// const writeSectionStep = createStep({
//   id: 'write-section',
//   inputSchema: z.object({ section: z.string(), keywords: z.array(z.string()) }),
//   outputSchema: z.object({ content: z.string() }),
//   execute: async ({ inputData, mastra }) => {
//     // Agent writes one section
//   },
// });
//
// Step 4: Assemble + suspend for approval
// const approvalStep = createStep({
//   id: 'approval',
//   inputSchema: z.object({ draft: z.string() }),
//   outputSchema: z.object({ article: z.string(), status: z.string() }),
//   resumeSchema: z.object({ approved: z.boolean(), feedback: z.string().optional() }),
//   suspendSchema: z.object({ message: z.string(), preview: z.string() }),
//   execute: async ({ inputData, resumeData, suspend, bail }) => {
//     if (resumeData?.approved === false) {
//       return bail({ article: '', status: 'rejected' });
//     }
//     if (!resumeData?.approved) {
//       return await suspend({
//         message: 'Review the draft before publishing',
//         preview: inputData.draft.slice(0, 500) + '...',
//       });
//     }
//     return { article: inputData.draft, status: 'published' };
//   },
// });
//
// Compose the workflow:
// export const contentPipeline = createWorkflow({
//   id: 'content-pipeline',
//   inputSchema: z.object({ topic: z.string() }),
//   outputSchema: z.object({ article: z.string(), status: z.string() }),
//   stateSchema: z.object({                        // Module 19
//     currentStep: z.string(),
//     sectionsCompleted: z.number(),
//   }),
//   retryConfig: { attempts: 3, delay: 1000 },     // Module 23
//   options: {
//     onFinish: async (result) => {                 // Module 23
//       console.log(`Pipeline finished: ${result.status}`);
//     },
//     onError: async (info) => {
//       console.error(`Pipeline failed: ${info.error?.message}`);
//     },
//   },
// })
//   .then(researchStep)                              // Module 16
//   .parallel([outlineStep, keywordsStep])            // Module 17
//   .map(async ({ inputData }) => ({                  // Module 17
//     sections: inputData['outline'].sections,
//     keywords: inputData['keywords'].keywords,
//   }))
//   // Prepare for foreach: transform into array of { section, keywords }
//   .map(async ({ inputData }) => (
//     inputData.sections.map(s => ({ section: s, keywords: inputData.keywords }))
//   ))
//   .foreach(writeSectionStep, { concurrency: 3 })    // Module 18
//   .map(async ({ inputData }) => ({                  // Assemble sections
//     draft: inputData.map(s => s.content).join('\n\n'),
//   }))
//   .then(approvalStep)                               // Module 21, 22
//   .commit();
```

### 2. Backend: API route with workflowRoute

**app/api/workflow/route.ts**
```typescript
// TODO: Using handleWorkflowStream for Next.js:
//
// import { handleWorkflowStream } from '@mastra/ai-sdk';
// import { createUIMessageStreamResponse } from 'ai';
// import { mastra } from '@/src/mastra';
//
// export async function POST(req: Request) {
//   const params = await req.json();
//   const stream = await handleWorkflowStream({
//     mastra,
//     workflowId: 'content-pipeline',
//     params,
//   });
//   return createUIMessageStreamResponse({ stream });
// }
```

### 3. Frontend: Pipeline progress UI

**app/components/pipeline-progress.tsx**
```tsx
// TODO: Visualize workflow execution using data-workflow parts
//
// import type { WorkflowDataPart } from '@mastra/ai-sdk';
//
// Render each step as a card with status indicator:
//   'running'   → spinner
//   'success'   → green check
//   'failed'    → red X
//   'suspended' → yellow pause icon
//
// Show step output when available.
// When status is 'suspended', show the approval dialog.
```

### 4. Frontend: Approval dialog

**app/components/approval-dialog.tsx**
```tsx
// TODO: When workflow suspends at 'approval' step:
//
// 1. Read suspendPayload.preview from data-workflow part
// 2. Show the draft preview to the user
// 3. "Approve" button → sendMessage with:
//    body: { runId, step: 'approval', resumeData: { approved: true } }
// 4. "Reject" button → sendMessage with:
//    body: { runId, step: 'approval', resumeData: { approved: false } }
// 5. Handle result: published or rejected
```

### 5. Frontend: Main page with useChat()

**app/page.tsx**
```tsx
// TODO: Wire everything together
//
// const { messages, sendMessage, status } = useChat({
//   transport: new DefaultChatTransport({
//     api: '/api/workflow',
//     prepareSendMessagesRequest: ({ messages }) => {
//       const lastMsg = messages[messages.length - 1];
//       const metadata = lastMsg?.metadata;
//
//       // Resume flow
//       if (metadata?.runId) {
//         return {
//           body: {
//             runId: metadata.runId,
//             step: metadata.step,
//             resumeData: metadata.resumeData,
//           },
//         };
//       }
//       // Start flow
//       return {
//         body: {
//           inputData: { topic: lastMsg?.parts?.[0]?.text },
//         },
//       };
//     },
//   }),
// });
//
// Render:
// 1. Topic input form
// 2. Pipeline progress (data-workflow parts)
// 3. Streaming text from agent steps
// 4. Approval dialog when suspended
// 5. Final article preview
```

## How to run

```bash
pnpm add @mastra/ai-sdk @ai-sdk/react ai
pnpm dev
```

## Test scenarios

1. **Happy path**: Submit "AI in healthcare" → research → outline + keywords → write → approve → published
2. **Rejection**: Submit topic → let it run → reject at approval → status: rejected (bail)
3. **Failure recovery**: If the writing step fails (simulate with random throw), retries should kick in
4. **Time travel**: If research was bad, time travel back to research step with better input

## Bonus challenges

1. Add quality branching: after writing, score quality → if < 7, rewrite; if >= 7, proceed to approval (Module 17)
2. Add dowhile: keep rewriting until quality score > 7, max 3 attempts (Module 18)
3. Add workflow state: track `sectionsCompleted` counter across foreach iterations (Module 19)
4. Add custom stream events: emit `data-pipeline-progress` with stage info for richer UI (Module 5)
5. Stream agent text from workflow steps: pipe agent.stream().fullStream to step writer (AI SDK UI recipe)
