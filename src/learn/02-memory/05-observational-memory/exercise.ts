/**
 * ============================================================
 *  MODULE 13: Observational Memory
 * ============================================================
 *
 *  THEORY
 *  ------
 *  Problem: Long conversations hit the context window limit.
 *  At 200+ messages, you can't send everything to the LLM.
 *
 *  Solution: Observational Memory (OM) uses TWO background agents
 *  to compress old messages into dense observation logs.
 *
 *  ARCHITECTURE (3 tiers):
 *
 *    ┌───────────────────────────────────────────────┐
 *    │ Tier 1: RECENT MESSAGES                       │
 *    │   Exact conversation history for current task │
 *    │   (raw messages, full fidelity)               │
 *    ├───────────────────────────────────────────────┤
 *    │ Tier 2: OBSERVATIONS                          │
 *    │   When messages exceed ~30K tokens, the       │
 *    │   Observer agent compresses them into dense    │
 *    │   bullet-point logs (5-40x compression)       │
 *    ├───────────────────────────────────────────────┤
 *    │ Tier 3: REFLECTIONS                           │
 *    │   When observations exceed ~40K tokens, the   │
 *    │   Reflector agent compresses observations     │
 *    │   into higher-level summaries                 │
 *    └───────────────────────────────────────────────┘
 *
 *  HOW IT WORKS:
 *    1. Normal conversation with recent messages
 *    2. When message token count > 30K (configurable):
 *       → Observer agent runs in background
 *       → Compresses old messages into observations
 *       → Old messages removed from context window
 *       → Observations prepended to context instead
 *    3. When observation token count > 40K:
 *       → Reflector agent compresses observations further
 *
 *  OBSERVATION FORMAT:
 *    ```
 *    Date: 2026-01-15
 *    - 🔴 12:10 User is building a Next.js app with Supabase auth
 *      - 🔴 12:10 App uses server components with client-side hydration
 *      - 🟡 12:12 User asked about middleware configuration
 *      - 🔴 12:15 User stated the app name is "Acme Dashboard"
 *    ```
 *    Emojis indicate importance: 🔴 critical, 🟡 moderate, 🟢 minor
 *
 *  BENEFITS:
 *    - Prompt caching: Observations are stable, cache-friendly
 *    - Zero context rot: No noise from old tool calls
 *    - Infinite conversations: Tier structure scales indefinitely
 *    - Lower cost: Compressed data uses fewer tokens
 *
 *  SCOPES:
 *    - Thread scope (default): Each thread has separate observations
 *    - Resource scope (experimental): Observations shared across threads
 *
 *  ASYNC BUFFERING (default: enabled):
 *    Pre-computes observations in background so agent doesn't pause.
 *    Configurable thresholds control when buffering triggers.
 *
 *  MODEL SELECTION:
 *    OM runs background agents — use fast, cheap models:
 *    - google/gemini-2.5-flash (default)
 *    - openai/gpt-4o-mini
 *    - anthropic/claude-haiku-4-5
 *    Models need 128K+ context windows.
 *
 *  STORAGE: Only supports @mastra/pg, @mastra/libsql, @mastra/mongodb
 *
 *  EXERCISE
 *  --------
 *  Configure observational memory and understand the architecture.
 *  Note: OM triggers after ~30K tokens, so we'll configure it
 *  and discuss how it works rather than hit the threshold.
 * ============================================================
 */

import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';

// ─── TODO 1: Create memory with observational memory ────────
// Enable observational memory with a specific model.
//
//   new Memory({
//     options: {
//       lastMessages: 20,
//       observationalMemory: {
//         model: 'anthropic/claude-haiku-4-5',
//         scope: 'thread',
//       },
//     },
//   })
//
// The default threshold is 30K tokens for observations and
// 40K tokens for reflections. For testing, you could lower these,
// but we'll keep defaults for now.

const omMemory = undefined as any; // ← replace

export const omAgent = undefined as any; // ← replace

// ─── TODO 2: Test basic conversation with OM enabled ────────
// Even with OM enabled, short conversations work normally.
// OM only kicks in when token thresholds are exceeded.

export async function testBasicOM() {
  const memConfig = {
    memory: { thread: { id: 'om-test-thread' }, resource: 'user-om' },
  };

  console.log('--- OM enabled, short conversation ---');
  // TODO: Send a few messages and print responses
  // OM won't trigger yet — messages are below 30K tokens
  // But the agent is READY for long conversations
  console.log('TODO: implement');
}

// ─── TODO 3: Create OM with custom token thresholds ─────────
// For understanding, create a memory with lower thresholds
// (in production you'd keep defaults or raise them).
//
//   observationalMemory: {
//     model: 'anthropic/claude-haiku-4-5',
//     observation: {
//       messageTokens: 30_000,     // trigger observation at 30K
//       bufferTokens: 0.2,         // buffer at 20% of threshold
//       bufferActivation: 0.8,     // activate buffer at 80%
//       blockAfter: 1.2,           // safety block at 120%
//       previousObserverTokens: 2000, // context for observer
//     },
//     reflection: {
//       observationTokens: 40_000, // trigger reflection at 40K
//       bufferActivation: 0.5,
//       blockAfter: 1.2,
//     },
//   }
//
// CONCEPTUAL: Understand what each setting does.

// ─── TODO 4: Understand the OM lifecycle ────────────────────
// Answer these questions in your head:
//
// Q1: You have a 200-message thread. The first 150 messages are
//     about project setup. The last 50 are about deployment.
//     With OM, what does the agent see?
//     → Answer: Recent 50 messages in full + observation log
//       summarizing the 150 setup messages as bullet points
//
// Q2: What's the advantage of OM over just using lastMessages: 50?
//     → Answer: lastMessages: 50 LOSES the first 150 messages.
//       OM COMPRESSES them — the agent still knows what happened,
//       just in summary form.
//
// Q3: Why use a cheap/fast model for OM?
//     → Answer: Observer and Reflector run in the BACKGROUND.
//       They process lots of text for compression. Using an
//       expensive model would be costly and slow.
//
// Q4: When would you use resource scope vs thread scope?
//     → Answer: Resource scope shares observations across threads.
//       Use it for user-level memory (like a personal assistant
//       that remembers you across conversations).
//       Thread scope (default) is safer and well-tested.
//
// Q5: How does OM differ from Working Memory?
//     → Answer: Working Memory = small structured scratchpad
//       (name, preferences). OM = automatic compression of
//       entire conversation history. They serve different purposes
//       and can be used together.

// ─── TODO 5: Retrieval mode (experimental) ──────────────────
// OM compresses messages — but sometimes the agent needs the
// EXACT wording of a past message. Retrieval mode preserves
// links between observations and source messages.
//
//   observationalMemory: {
//     model: 'google/gemini-2.5-flash',
//     scope: 'thread',    // required — only works with thread scope
//     retrieval: true,     // ← enables retrieval mode
//   }
//
// How it works:
//   1. Observer stores `range` metadata (startId:endId) on observations
//   2. A `recall` tool is registered with the agent
//   3. Agent can call `recall` to page through raw source messages
//
// Note: Only works with thread scope. Setting retrieval: true
// with scope: 'resource' has no effect.

// ─── TODO 6: Thread title via observation ───────────────────
// The Observer can auto-suggest thread titles when topics change:
//
//   observationalMemory: {
//     model: 'google/gemini-2.5-flash',
//     observation: {
//       threadTitle: true,  // ← Observer suggests titles
//     },
//   }
//
// Title updates thread metadata for UI display.

// ─── TODO 7: Async buffering deep-dive ──────────────────────
// Buffering pre-computes observations in background so the
// agent never pauses. Configuration:
//
//   observation: {
//     bufferTokens: 0.2,        // buffer every 20% of messageTokens
//     bufferActivation: 0.8,    // activate (clear messages) at 80%
//     blockAfter: 1.2,          // FORCE sync observation at 120%
//   }
//   reflection: {
//     bufferActivation: 0.5,    // start background reflection at 50%
//     blockAfter: 1.2,          // force sync reflection at 120%
//   }
//
// Disable buffering (synchronous operation):
//   observation: { bufferTokens: false }
//
// Note: Async buffering NOT supported with resource scope.

// ─── TODO 8: Observer context optimization ──────────────────
// Limit how much observation history the Observer sees:
//
//   observation: {
//     previousObserverTokens: 2000,  // default: ~2K tokens
//   }
//
//   Values:
//     2000    (default) → keeps ~2K tokens of recent observations
//     0       → omits ALL previous observations
//     false   → disables truncation, full history
//     10_000  → larger context for more continuity

// ─── TODO 9: Storage requirements ───────────────────────────
// OM only supports 3 storage adapters:
//   @mastra/pg     (PostgreSQL)
//   @mastra/libsql (LibSQL)
//   @mastra/mongodb (MongoDB)
//
// Token estimates are cached in message metadata
// (part.providerMetadata.mastra) to avoid repeated counting.

// ─── TODO 10: OM vs other memory features ───────────────────
// OM replaces both message history and working memory for
// LONG conversations:
//
//   | Feature          | Best for                    |
//   |------------------|-----------------------------|
//   | Message History  | Current conversation (raw)  |
//   | Working Memory   | Small structured data       |
//   | Semantic Recall  | RAG: find by meaning        |
//   | Observational    | Long conversations (auto)   |
//
// OM provides greater accuracy and lower cost than Semantic
// Recall for long-running conversations. But Semantic Recall
// is better for finding specific past messages by topic.

// ─── TODO 11: shareTokenBudget ──────────────────────────────
// Let message history borrow unused tokens from the observation
// budget. This keeps more raw messages in context when
// observations haven't filled their allocation yet.
//
//   observationalMemory: {
//     model: 'google/gemini-2.5-flash',
//     observation: { messageTokens: 30_000 },
//     reflection: { observationTokens: 40_000 },
//     shareTokenBudget: false,  // default: false
//     // requires bufferTokens: false (temporary limitation)
//   }
//
// When true: message history can use unused observation budget.
// When false (default): budgets are independent.

export async function runTest() {
  console.log('=== Observational Memory ===\n');
  await testBasicOM();

  console.log('\n--- OM Architecture Summary ---');
  console.log('Tier 1: Recent messages (raw, full fidelity)');
  console.log('Tier 2: Observations (compressed at ~30K tokens)');
  console.log('Tier 3: Reflections (compressed observations at ~40K tokens)');
  console.log('\nOM runs in background — agent never pauses');
  console.log('Use fast models: gemini-2.5-flash, gpt-4o-mini, claude-haiku-4-5');
}
