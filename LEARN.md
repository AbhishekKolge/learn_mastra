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
   - Capstones use **Express + Vite React + shadcn/ui + AI SDK**
   - Each capstone is a portfolio-ready full-stack app

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
│   └── capstone/                 ← Express + React: AI Code Review App
├── 02-memory/                    ← Section 2: Memory
│   ├── 01-memory-basics/
│   ├── 02-memory-storage/
│   ├── 03-message-history/
│   ├── 04-working-memory/
│   ├── 05-observational-memory/
│   ├── 06-semantic-recall/
│   ├── 07-memory-processors/
│   └── capstone/                 ← Express + React: AI Personal Assistant
├── 03-workflows/                 ← Section 3: Workflows
│   ├── 01-workflow-basics/
│   ├── 02-control-flow/
│   ├── 03-looping/
│   ├── 04-workflow-state/
│   ├── 05-agents-tools/
│   ├── 06-suspend-resume/
│   ├── 07-human-in-the-loop/
│   ├── 08-time-travel-errors/
│   └── capstone/                 ← Express + React: AI Content Pipeline
├── 04-streaming/                 ← Section 4: Streaming
│   ├── 01-streaming-basics/
│   ├── 02-stream-events/
│   ├── 03-tool-streaming/
│   ├── 04-workflow-streaming/
│   ├── 05-agent-tool-piping/
│   ├── 06-agent-workflow-piping/
│   ├── 07-network-streaming/
│   └── capstone/                 ← Express + React: Real-Time AI Dashboard
├── 05-rag/                       ← Section 5: RAG
│   ├── 01-rag-basics/
│   ├── 02-chunking-strategies/
│   ├── 03-embeddings/
│   ├── 04-vector-databases/
│   ├── 05-retrieval/
│   ├── 06-rag-agents/
│   ├── 07-graph-rag/
│   ├── 08-reranking/
│   └── capstone/                 ← Express + React: AI Knowledge Base
├── 06-workspaces/                ← Section 6: Workspaces
│   ├── 01-workspace-basics/
│   ├── 02-filesystem/
│   ├── 03-sandbox/
│   ├── 04-workspace-tools/
│   ├── 05-search-indexing/
│   ├── 06-skills/
│   ├── 07-advanced-patterns/
│   └── capstone/                 ← Express + React: AI Dev Assistant
└── 07-evals/                     ← Section 7: Evals
    ├── 01-evals-basics/
    ├── 02-built-in-scorers/
    ├── 03-custom-scorers/
    ├── 04-scorer-pipeline/
    ├── 05-live-evals/
    ├── 06-running-in-ci/
    ├── 07-trace-evals/
    └── capstone/                 ← Express + React: Quality Monitoring System
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
| **C1** | **Capstone: AI Code Review App** | **`01-agents/capstone/README.md`** | **Express + React + shadcn/ui using ALL agent concepts** |

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
| **C2** | **Capstone: AI Personal Assistant** | **`02-memory/capstone/README.md`** | **Express + React + shadcn/ui using ALL memory concepts** |

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
| **C3** | **Capstone: AI Content Pipeline** | **`03-workflows/capstone/README.md`** | **Express + React + shadcn/ui using ALL workflow concepts** |

## Section 4: Streaming

| # | Topic | File | Concepts |
|---|-------|------|----------|
| 1 | Streaming Basics | `04-streaming/01-streaming-basics/exercise.ts` | Agent.stream(), textStream, text, finishReason, usage, timing |
| 2 | Stream Events | `04-streaming/02-stream-events/exercise.ts` | Event types (start, text-delta, tool-call, finish), filtering, counting |
| 3 | Tool Streaming | `04-streaming/03-tool-streaming/exercise.ts` | context.writer, writer.custom(), transient chunks, lifecycle hooks |
| 4 | Workflow Streaming | `04-streaming/04-workflow-streaming/exercise.ts` | Step writer, lifecycle events, custom payloads, resumeStream |
| 5 | Agent→Tool Piping | `04-streaming/05-agent-tool-piping/exercise.ts` | fullStream.pipeTo(writer), nested streaming, usage aggregation |
| 6 | Agent→Workflow Piping | `04-streaming/06-agent-workflow-piping/exercise.ts` | textStream.pipeTo(writer), multi-step content generation |
| 7 | Multi-Agent Streaming | `04-streaming/07-network-streaming/exercise.ts` | Supervisor agents, delegation as tool-calls, hybrid tools+agents, event inspection |
| **C4** | **Capstone: Real-Time AI Dashboard** | **`04-streaming/capstone/README.md`** | **Express + React + shadcn/ui using ALL streaming concepts** |

## Section 5: RAG

| # | Topic | File | Concepts |
|---|-------|------|----------|
| 1 | RAG Basics | `05-rag/01-rag-basics/exercise.ts` | MDocument, chunk, embed, store, query — full pipeline |
| 2 | Chunking Strategies | `05-rag/02-chunking-strategies/exercise.ts` | recursive, character, token, sentence, markdown, html, json, overlap |
| 3 | Embeddings | `05-rag/03-embeddings/exercise.ts` | ModelRouterEmbeddingModel, embedMany, embed, dimensions, similarity |
| 4 | Vector Databases | `05-rag/04-vector-databases/exercise.ts` | LibSQLVector, createIndex, upsert, metadata, deleteVectors |
| 5 | Retrieval & Filtering | `05-rag/05-retrieval/exercise.ts` | query, topK, metadata filters ($eq, $gt, $in, $or, $and) |
| 6 | RAG Agents | `05-rag/06-rag-agents/exercise.ts` | createVectorQueryTool, Mastra vectors, agent-driven retrieval |
| 7 | Graph RAG | `05-rag/07-graph-rag/exercise.ts` | createGraphRAGTool, knowledge graph, threshold, hybrid agents |
| 8 | Re-ranking | `05-rag/08-reranking/exercise.ts` | rerankWithScorer, MastraAgentRelevanceScorer, weights, precision |
| **C5** | **Capstone: AI Knowledge Base** | **`05-rag/capstone/README.md`** | **Express + React + shadcn/ui using ALL RAG concepts** |

## Section 6: Workspaces

| # | Topic | File | Concepts |
|---|-------|------|----------|
| 1 | Workspace Basics | `06-workspaces/01-workspace-basics/exercise.ts` | Workspace class, LocalFilesystem, LocalSandbox, global vs agent-level |
| 2 | Filesystem | `06-workspaces/02-filesystem/exercise.ts` | File operations, containment, allowedPaths, readOnly, programmatic access |
| 3 | Sandbox | `06-workspaces/03-sandbox/exercise.ts` | execute_command, background processes, callbacks, abort signal |
| 4 | Workspace Tools | `06-workspaces/04-workspace-tools/exercise.ts` | WORKSPACE_TOOLS, requireApproval, requireReadBeforeWrite, name remapping |
| 5 | Search & Indexing | `06-workspaces/05-search-indexing/exercise.ts` | BM25, vector, hybrid search, manual/auto indexing, search options |
| 6 | Skills | `06-workspaces/06-skills/exercise.ts` | SKILL.md, skill directories, skill/skill_read/skill_search tools |
| 7 | Advanced Patterns | `06-workspaces/07-advanced-patterns/exercise.ts` | Mounts, multi-agent permissions, production config, multi-team |
| **C6** | **Capstone: AI Dev Assistant** | **`06-workspaces/capstone/README.md`** | **Express + React + shadcn/ui using ALL workspace concepts** |

## Section 7: Evals

| # | Topic | File | Concepts |
|---|-------|------|----------|
| 1 | Evals Basics | `07-evals/01-evals-basics/exercise.ts` | Scorers, scores 0-1, scorer types, manual scoring |
| 2 | Built-in Scorers | `07-evals/02-built-in-scorers/exercise.ts` | relevancy, faithfulness, hallucination, completeness, toxicity, bias, tone |
| 3 | Custom Scorers | `07-evals/03-custom-scorers/exercise.ts` | createScorer, functions vs prompt objects, judge config |
| 4 | Scorer Pipeline | `07-evals/04-scorer-pipeline/exercise.ts` | preprocess→analyze→generateScore→generateReason, data flow, mixing |
| 5 | Live Evals | `07-evals/05-live-evals/exercise.ts` | Agent scorers, workflow step scorers, sampling rates, async storage |
| 6 | Running in CI | `07-evals/06-running-in-ci/exercise.ts` | runEvals, test cases, groundTruth, thresholds, vitest |
| 7 | Trace Evals | `07-evals/07-trace-evals/exercise.ts` | Mastra scorers, Studio trace scoring, type: 'agent', eval strategy |
| **C7** | **Capstone: Quality Monitoring** | **`07-evals/capstone/README.md`** | **Express + React + shadcn/ui using ALL eval concepts** |

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

### Section 4: Streaming

**1. Streaming Basics** — `agent.stream()` returns `{ textStream, text, finishReason, usage }`. Iterate `textStream` with `for await`. Three prompt forms: string, string array, message objects. `process.stdout.write()` for seamless output.

**2. Stream Events** — Raw stream yields typed events: `start`, `step-start`, `text-delta`, `tool-call`, `tool-result`, `step-finish`, `finish`. Each has `{ type, from, payload }`. Filter by type for specific handling.

**3. Tool Streaming** — `context.writer.write()` for nested tool-result events. `context.writer.custom()` for top-level `data-*` chunks. `transient: true` skips DB persistence. Lifecycle hooks: `onInputStart`, `onInputDelta`, `onInputAvailable`, `onOutput`.

**4. Workflow Streaming** — Step `writer` argument for custom events. Workflow events: `workflow-start`, `workflow-step-start`, `workflow-step-progress`, `workflow-step-finish`. `run.resumeStream()` for interrupted/suspended workflows.

**5. Agent→Tool Piping** — `stream.fullStream.pipeTo(context.writer)` pipes agent stream through tool. Usage auto-aggregated. Custom events BEFORE pipe (pipe closes writer). Nested tool events propagate.

**6. Agent→Workflow Piping** — `stream.textStream.pipeTo(writer)` pipes agent text through workflow step. Step writer expects strings (not objects). Mix pure logic steps with agent-piped steps.

**7. Multi-Agent Streaming** — Supervisor agents with `agents: [...]` + `.stream()`. Subagents appear as tool-call/tool-result events. Hybrid supervisors: tools + subagents. Delegation tracking with timing. `agent.network()` is deprecated.

### Section 5: RAG

**1. RAG Basics** — RAG = Retrieval-Augmented Generation. Pipeline: document → chunk → embed → store → query. `MDocument.fromText/HTML/Markdown/JSON`. `embedMany()` + `embed()` from `ai`. `LibSQLVector` for storage.

**2. Chunking Strategies** — 9 strategies: `recursive` (most versatile), `character`, `token`, `sentence`, `markdown`, `semantic-markdown`, `html`, `json`, `latex`. Key params: `size`, `overlap`, `separators`. Overlap preserves context at boundaries.

**3. Embeddings** — `ModelRouterEmbeddingModel('provider/model')` for any provider. `embedMany()` for batches, `embed()` for single queries. Custom dimensions reduce storage. Same model for storing AND querying. Cosine similarity measures semantic closeness.

**4. Vector Databases** — 14+ stores with unified API: `createIndex()`, `upsert()`, `query()`, `deleteVectors()`. Metadata is critical — always store `text`. Dimension must match embedding model. `LibSQLVector` for local dev.

**5. Retrieval & Filtering** — `topK` controls result count. MongoDB-style filters: `$eq`, `$ne`, `$gt`, `$lt`, `$in`, `$nin`, `$and`, `$or`. Hybrid search = vector similarity + metadata filters. Consistent across all stores.

**6. RAG Agents** — `createVectorQueryTool()` lets agents query vector stores directly. Register stores in `Mastra({ vectors: {} })`. Vector store prompts tell agents valid filter syntax. Agent decides WHEN and WHAT to search.

**7. Graph RAG** — `createGraphRAGTool()` follows relationships between chunks. Threshold controls connection strictness (0.7 default). Best for cross-document queries. Combine with standard vector tool in hybrid agents.

**8. Re-ranking** — Two-stage: vector search (recall) → re-ranking (precision). `rerankWithScorer()` with `MastraAgentRelevanceScorer`. Weights: `semantic` (LLM relevance), `vector` (similarity), `position` (original order). Requires `metadata.text`.

### Section 6: Workspaces

**1. Workspace Basics** — `Workspace` class with `filesystem` + `sandbox`. Global workspace on Mastra or agent-level override. `init()` pre-creates directories. Agents get tools automatically.

**2. Filesystem** — `LocalFilesystem` (also S3, GCS, AgentFS). Tools: read, write, edit, list, delete, stat, copy, move, grep, mkdir. Containment prevents path traversal. `allowedPaths` for specific outside access. `readOnly` disables writes.

**3. Sandbox** — `LocalSandbox` (also E2B, Daytona, Blaxel). `execute_command` tool. Background processes with `background: true` → PID → `get_process_output` / `kill_process`. Callbacks: `onStdout`, `onStderr`, `onExit`. Output auto-truncated.

**4. Workspace Tools** — `WORKSPACE_TOOLS` constants for per-tool config. `requireApproval`, `requireReadBeforeWrite`, `enabled: false`, `name` (remapping), `maxOutputTokens`. Two safety layers: tool-level + filesystem-level mtime check.

**5. Search & Indexing** — BM25 (keyword), vector (semantic), hybrid. `workspace.index()` manual or `autoIndexPaths` auto. `workspace.search(query, { topK, mode, minScore, vectorWeight })`. Agent gets search tools automatically.

**6. Skills** — `SKILL.md` + `references/` + `scripts/` + `assets/`. Agent tools: `skill` (load), `skill_read` (read files), `skill_search` (search). Stateless — reload anytime. Dynamic skill paths via function. BM25 auto-indexes skills.

**7. Advanced Patterns** — `mounts` for cloud storage in sandboxes (S3, GCS). `filesystem` vs `mounts` (mutually exclusive). Multi-agent with different workspaces. Production checklist: containment, approval, read-before-write, search, skills, output limits.

### Section 7: Evals

**1. Evals Basics** — Scorers return 0-1 scores measuring output quality. Three types: textual (accuracy), classification (categorization), output quality (safety/style). Higher is better except toxicity/hallucination/bias (lower is better).

**2. Built-in Scorers** — 16+ scorers: `answer-relevancy`, `faithfulness`, `hallucination`, `completeness`, `content-similarity`, `tool-call-accuracy`, `prompt-alignment`, `context-precision`, `context-relevance`, `tone-consistency`, `toxicity`, `bias`, `keyword-coverage`.

**3. Custom Scorers** — `createScorer({ id, description, judge })` with 4-step pipeline. Functions for deterministic logic. Prompt objects for LLM-judged evaluation. Mix both in one scorer.

**4. Scorer Pipeline** — `preprocess` → `analyze` → `generateScore` (required) → `generateReason`. Data flows via `results.preprocessStepResult` and `results.analyzeStepResult`. Function steps get `{ run, results }`, prompt objects get `outputSchema` + `createPrompt`.

**5. Live Evals** — Attach scorers to agents/workflow steps. `sampling: { type: 'ratio', rate: 0.5 }`. Runs async — no response delay. Scores stored in `mastra_scorers` table. View in Studio.

**6. Running in CI** — `runEvals({ data, target, scorers })` returns aggregate scores. `data` items have `input` + optional `groundTruth`. Assert thresholds in test frameworks (vitest/jest). Group tests by scenario.

**7. Trace Evals** — Register scorers on `Mastra({ scorers: {} })` for Studio trace scoring. `type: 'agent'` for live+trace compatibility. Requires observability. Three modes together: live (production), CI (gates), trace (historical).
