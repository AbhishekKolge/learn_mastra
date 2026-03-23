# Mastra — Interactive Learning Path

Learn by doing. Each module has an **exercise** (with TODOs) and a **solution**.

## How to use

1. Open the exercise file for the current module
2. Read the THEORY section at the top
3. Fill in all `// TODO` sections
4. Register your agent/workflow in `src/mastra/index.ts`
5. Run `pnpm dev` → test in Mastra Studio at http://localhost:4111
6. Stuck? Peek at the solution file next to it
7. After finishing a section, build the **capstone project** to cement everything

---

## Course Structure

```
src/learn/
├── 01-agents/                    ← Section 1: Agents
│   ├── 01-agent-basics/
│   ├── 02-using-tools/
│   ├── 03-structured-output/
│   ├── 04-supervisor-agents/
│   ├── 05-processors/
│   ├── 06-guardrails/
│   ├── 07-agent-approval/
│   ├── 08-voice/
│   └── capstone/                 ← Full-stack AI Code Review App
├── 02-memory/                    ← Section 2: Memory
│   ├── 01-memory-basics/
│   ├── 02-memory-storage/
│   ├── 03-message-history/
│   ├── 04-working-memory/
│   ├── 05-observational-memory/
│   ├── 06-semantic-recall/
│   ├── 07-memory-processors/
│   └── capstone/                 ← Full-stack AI Personal Assistant
└── 03-workflows/                 ← Section 3: Workflows
    ├── 01-workflow-basics/
    ├── 02-control-flow/
    ├── 03-looping/
    ├── 04-workflow-state/
    ├── 05-agents-tools/
    ├── 06-suspend-resume/
    ├── 07-human-in-the-loop/
    ├── 08-time-travel-errors/
    └── capstone/                 ← Full-stack AI Content Pipeline
```

---

## Section 1: Agents

| # | Topic | File | Concepts |
|---|-------|------|----------|
| 1 | Agent Basics | `01-agents/01-agent-basics/exercise.ts` | Agent class, instructions, model, generate/stream |
| 2 | Using Tools | `01-agents/02-using-tools/exercise.ts` | createTool, inputSchema, execute, toolChoice, activeTools, toModelOutput |
| 3 | Structured Output | `01-agents/03-structured-output/exercise.ts` | Zod schema, response.object, errorStrategy, prepareStep, jsonPromptInjection |
| 4 | Supervisor Agents | `01-agents/04-supervisor-agents/exercise.ts` | Multi-agent, delegation hooks, messageFilter, task scoring |
| 5 | Processors | `01-agents/05-processors/exercise.ts` | Input/output pipeline, processInputStep, TokenLimiter, workflow composition |
| 6 | Guardrails | `01-agents/06-guardrails/exercise.ts` | All built-in guardrails, 6 strategies, tripwire, performance |
| 7 | Agent Approval | `01-agents/07-agent-approval/exercise.ts` | requireApproval, suspend(), resumeStream, auto-resume, supervisor propagation |
| 8 | Voice | `01-agents/08-voice/exercise.ts` | speak, listen, CompositeVoice, realtime, AI SDK providers |
| **C1** | **Capstone: AI Code Review App** | **`01-agents/capstone/README.md`** | **Full-stack Next.js + AI SDK UI using ALL agent concepts** |

## Section 2: Memory

| # | Topic | File | Concepts |
|---|-------|------|----------|
| 1 | Memory Basics | `02-memory/01-memory-basics/exercise.ts` | Memory class, threads, resources, multi-agent scoping, RequestContext |
| 2 | Memory Storage | `02-memory/02-memory-storage/exercise.ts` | Providers, composite storage, agent-level override, attachments |
| 3 | Message History | `02-memory/03-message-history/exercise.ts` | recall(), listThreads, pagination, cloneThread, deleteMessages |
| 4 | Working Memory | `02-memory/04-working-memory/exercise.ts` | Template, schema, merge semantics, readOnly, programmatic init |
| 5 | Observational Memory | `02-memory/05-observational-memory/exercise.ts` | Observer/Reflector, 3-tier, async buffering, retrieval mode |
| 6 | Semantic Recall | `02-memory/06-semantic-recall/exercise.ts` | Vector search, embeddings, topK, FastEmbed, index optimization |
| 7 | Memory Processors | `02-memory/07-memory-processors/exercise.ts` | Execution order, abort safety, manual control, TokenLimiter |
| **C2** | **Capstone: AI Personal Assistant** | **`02-memory/capstone/README.md`** | **Full-stack Next.js + AI SDK UI using ALL memory concepts** |

## Section 3: Workflows

| # | Topic | File | Concepts |
|---|-------|------|----------|
| 1 | Workflow Basics | `03-workflows/01-workflow-basics/exercise.ts` | createStep, createWorkflow, .then(), start/stream, result status |
| 2 | Control Flow | `03-workflows/02-control-flow/exercise.ts` | .parallel(), .branch(), .map(), schema rules, data mapping |
| 3 | Looping | `03-workflows/03-looping/exercise.ts` | .foreach(), .dountil(), .dowhile(), concurrency, nested workflows |
| 4 | Workflow State | `03-workflows/04-workflow-state/exercise.ts` | stateSchema, setState, initialState, persistence, nested state |
| 5 | Agents & Tools | `03-workflows/05-agents-tools/exercise.ts` | Agents/tools as steps, structured output, mastra.getAgent() |
| 6 | Suspend & Resume | `03-workflows/06-suspend-resume/exercise.ts` | suspend(), resume(), snapshots, suspendData, sleep |
| 7 | Human-in-the-Loop | `03-workflows/07-human-in-the-loop/exercise.ts` | HITL patterns, bail(), multi-turn, user feedback |
| 8 | Time Travel & Errors | `03-workflows/08-time-travel-errors/exercise.ts` | timeTravel(), retries, onFinish/onError, bail vs throw |
| **C3** | **Capstone: AI Content Pipeline** | **`03-workflows/capstone/README.md`** | **Full-stack Next.js + AI SDK UI using ALL workflow concepts** |

---

## Running a quick test (no Studio)

Each exercise exports a `runTest()` function. Register the agent/workflow in `src/mastra/index.ts` and test in Studio, or call `runTest()` directly from a script.

---

## Module Summaries

### Section 1: Agents

**1. Agent Basics** — Agent = LLM + instructions + tools. `generate()` for full response, `stream()` for real-time tokens.

**2. Using Tools** — `createTool({ id, description, inputSchema, outputSchema, execute })`. Description guides when the agent calls it. `toolChoice`, `activeTools`, `toModelOutput` for runtime control.

**3. Structured Output** — `structuredOutput: { schema }` returns typed objects via `response.object`. Error strategies: strict, warn, fallback. `prepareStep` for multi-step tool+schema.

**4. Supervisor Agents** — Coordinate subagents via `agents` property. Hooks: `onDelegationStart`, `onDelegationComplete`, `messageFilter`, `onIterationComplete`. Task scoring validates completeness.

**5. Processors** — Middleware pipeline: `processInput`, `processInputStep`, `processOutputResult`, `processOutputStream`, `processOutputStep`. Built-ins: TokenLimiter, ToolCallFilter, ToolSearchProcessor.

**6. Guardrails** — Built-in: UnicodeNormalizer, PromptInjectionDetector, LanguageDetector, SystemPromptScrubber, BatchPartsProcessor, ModerationProcessor, PIIDetector. Strategies: block, warn, detect, redact, rewrite, translate.

**7. Agent Approval** — `requireApproval` pauses before execute. `suspend()` pauses during execute. `autoResumeSuspendedTools` for conversational flows. Bubbles through supervisor chains.

**8. Voice** — `speak()` (TTS), `listen()` (STT), `CompositeVoice` (mix providers), `OpenAIRealtimeVoice` (live speech-to-speech). 11 providers supported.

### Section 2: Memory

**1. Memory Basics** — `Memory` class with `lastMessages`. Threads (conversations) + resources (users). Multi-agent delegation scoping. `RequestContext` for per-request memory.

**2. Storage** — 10+ providers (LibSQL, PG, MongoDB...). Instance-level, agent-level, composite. `generateTitle`, attachment handling, absolute paths.

**3. Message History** — `recall()` with pagination, date range, semantic search. `listThreads()`, `getThreadById()`, `cloneThread()`, `deleteMessages()`.

**4. Working Memory** — Template (Markdown) or schema (Zod). Resource-scoped (default) or thread-scoped. `readOnly`, programmatic init. Merge semantics: null removes, arrays replace.

**5. Observational Memory** — 3-tier: messages → observations → reflections. Background Observer/Reflector. Async buffering. Retrieval mode. `shareTokenBudget`.

**6. Semantic Recall** — RAG for conversations. `topK`, `messageRange`, `scope`. Vector stores (17 supported). FastEmbed for local. PG index optimization (HNSW).

**7. Memory Processors** — 3 built-in: MessageHistory, SemanticRecall, WorkingMemory. Input: memory first → custom after. Output: custom first → memory after. Abort = no save.

### Section 3: Workflows

**1. Basics** — `createStep` + `createWorkflow` + `.then()` + `.commit()`. `run.start()` or `run.stream()`. Result status union. Workflows as steps. `cloneWorkflow()`.

**2. Control Flow** — `.parallel()` (fan-out), `.branch()` (conditional), `.map()` (transform). Schema chain rules. Parallel output keyed by step ID.

**3. Looping** — `.foreach({ concurrency })`, `.dountil()`, `.dowhile()`. Nested workflows in foreach. Abort with `iterationCount`.

**4. State** — `stateSchema` + `setState()` + `initialState`. Persists across suspend/resume. Propagates to nested workflows.

**5. Agents & Tools** — Call inside execute or compose as step. `createStep(agent)` / `createStep(tool)`. Structured output with agent steps.

**6. Suspend & Resume** — `suspend(payload)` + `resume({ step, resumeData })`. `suspendData` on resume. Snapshots auto-persist. `sleep()`/`sleepUntil()`.

**7. Human-in-the-Loop** — Suspend with message → user decides → resume or `bail()`. Multi-turn approval. Resume from HTTP, webhooks, timers.

**8. Time Travel & Errors** — `timeTravel({ step, inputData, context })`. `retryConfig`/`retries`. `onFinish`/`onError` callbacks. `bail()` vs `throw`. `getStepResult()`.
