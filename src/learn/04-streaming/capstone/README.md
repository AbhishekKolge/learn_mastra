# Capstone 4: Real-Time AI Dashboard

Build a full-stack **Real-Time AI Dashboard** using Express + React + shadcn/ui + AI SDK, applying everything from Section 4 (Modules 1-7).

## What you'll build

A dashboard that visualizes AI streaming across agents, tools, and workflows:
1. User submits a prompt or question
2. Supervisor agent delegates to specialist subagents (Module 7)
3. Tool execution streams progress updates in real-time (Module 3)
4. Workflow steps pipe agent text to the UI (Module 6)
5. All stream events are visualized in a live event log (Module 2)
6. Custom progress bars show tool and workflow step status (Module 4)
7. Token usage and timing stats display in real-time (Module 1)

## Concepts practiced

| Module | Concept | How it's used |
|--------|---------|---------------|
| 1 | Streaming basics, textStream, timing | Core streaming, timing comparison |
| 2 | Stream events, filtering | Live event log with color-coded types |
| 3 | Tool streaming, writer, custom chunks | Progress bars for tool execution |
| 4 | Workflow streaming, step writer | Step-by-step progress tracker |
| 5 | Agent-to-tool piping (fullStream) | Agent output flows through tools |
| 6 | Agent-to-workflow piping (textStream) | Agent text streams through workflow |
| 7 | Multi-agent streaming, supervisor | Delegation visualization |

## Tech stack

- **Backend**: Express.js + Mastra agents + workflows
- **Frontend**: Vite + React + shadcn/ui
- **Streaming**: AI SDK + SSE for workflow events

## Project structure

```
capstone-4-dashboard/
├── server/
│   ├── index.ts
│   ├── routes/
│   │   ├── chat.ts                ← POST /api/chat — supervisor streaming
│   │   └── workflow.ts            ← POST /api/workflow — pipeline streaming
│   └── mastra/
│       ├── index.ts
│       ├── agents/
│       │   ├── supervisor.ts      ← Supervisor with subagents
│       │   ├── writer-agent.ts    ← Creative specialist
│       │   └── analyst-agent.ts   ← Data specialist
│       ├── tools/
│       │   ├── research-tool.ts   ← Tool with writer.write() progress
│       │   └── analysis-tool.ts   ← Tool with writer.custom() chunks
│       └── workflows/
│           └── content-pipeline.ts ← Workflow with agent piping
├── client/
│   ├── src/
│   │   ├── App.tsx               ← Dashboard grid layout
│   │   ├── components/
│   │   │   ├── ui/               ← shadcn (card, badge, tabs, scroll-area, progress, separator)
│   │   │   ├── prompt-input.tsx  ← User input
│   │   │   ├── stream-viewer.tsx ← Real-time text output
│   │   │   ├── event-log.tsx     ← Color-coded event timeline
│   │   │   ├── progress-tracker.tsx ← Tool/workflow progress
│   │   │   ├── usage-stats.tsx   ← Token usage + timing
│   │   │   └── delegation-viz.tsx ← Supervisor delegation flow
├── package.json
└── tsconfig.json
```

## Step-by-step instructions

### 1. Backend: Streaming tools with progress

**server/mastra/tools/research-tool.ts**
```typescript
// TODO: Create research tool with streaming progress
// 1. Emit custom chunks via context.writer.custom({ type: 'data-research-progress', ... })
// 2. Pipe agent's fullStream to writer for synthesis step
// 3. Use transient: true for verbose log chunks that don't persist
```

### 2. Backend: Supervisor with subagents

**server/mastra/agents/supervisor.ts**
```typescript
// TODO: Supervisor agent
// - agents: [writerAgent, analystAgent]
// - tools: { researchTool, analysisTool }
// - Subagents appear as tool-call/tool-result in streams
```

### 3. Backend: Express streaming routes

**server/routes/chat.ts**
```typescript
// TODO: Stream supervisor agent response as SSE
// Use toAISdkV5Stream(stream, { from: 'agent' })
```

### 4. Frontend: Event log with shadcn

**client/src/components/event-log.tsx**
```tsx
// TODO: Build using shadcn ScrollArea + Badge
// Color-code event types:
//   start/finish     → Badge variant="outline" (blue)
//   text-delta       → Badge variant="secondary" (green, collapsed with count)
//   tool-call        → Badge variant="default" (orange)
//   tool-result      → Badge variant="default" (yellow)
// Show timestamp offset from start for each event
```

**client/src/components/progress-tracker.tsx**
```tsx
// TODO: Build using shadcn Progress + Card
// Listen for data-research-progress custom chunks
// Show progress bar for each tool phase
// For workflow foreach, show completedCount/totalCount
```

**client/src/components/usage-stats.tsx**
```tsx
// TODO: Build using shadcn Card with stat grid
// Show: promptTokens, completionTokens, totalTokens
// Show: time-to-first-chunk, total-time
// Compare generate() vs stream() timing
```

### 5. Frontend: Dashboard layout

**client/src/App.tsx**
```tsx
// TODO: Grid layout using shadcn Tabs + Card
// Tab 1: "Chat" mode (supervisor streaming)
// Tab 2: "Pipeline" mode (workflow streaming)
//
// Layout:
// ┌──────────────┬───────────────┐
// │ Stream       │ Event Log     │
// │ Viewer       │ (scrollable)  │
// ├──────────────┼───────────────┤
// │ Progress     │ Usage Stats   │
// │ Tracker      │ & Timing      │
// └──────────────┴───────────────┘
```

## How to run

```bash
cd server && npx tsx index.ts
cd client && pnpm dev
```

## Test scenarios

1. **Agent streaming**: "Write a poem" → text arrives token-by-token, timing stats update
2. **Tool streaming**: "Research TypeScript" → progress phases, then piped agent text
3. **Workflow streaming**: Run pipeline → step-by-step progress
4. **Supervisor delegation**: "Write a poem then analyze data" → see delegation events
5. **Event inspection**: All scenarios populate the event log

## Bonus challenges

1. Add diff view for editor step: side-by-side original vs edited
2. Add transient log chunks that disappear on refresh
3. Add streaming tool input display from tool-call-delta events
4. Add delegation graph showing active subagents and delegation path
5. Add real-time token counter updating during streaming
