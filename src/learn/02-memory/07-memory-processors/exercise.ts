/**
 * ============================================================
 *  MODULE 15: Memory Processors
 * ============================================================
 *
 *  THEORY
 *  ------
 *  Memory processors are the middleware that powers memory features.
 *  When you enable memory on an agent, three processors are
 *  automatically added behind the scenes:
 *
 *  THREE BUILT-IN MEMORY PROCESSORS:
 *
 *  1. MessageHistory Processor
 *     INPUT phase:  Fetches last N messages, prepends to context
 *     OUTPUT phase: Persists new messages to storage
 *     → This is what lastMessages: 10 configures
 *
 *  2. SemanticRecall Processor
 *     INPUT phase:  Vector search for similar past messages
 *     OUTPUT phase: Embeds new messages, stores in vector DB
 *     → This is what semanticRecall: { topK: 3 } configures
 *
 *  3. WorkingMemory Processor
 *     INPUT phase:  Retrieves working memory state for thread
 *     OUTPUT phase: (no output processing)
 *     → This is what workingMemory: { enabled: true } configures
 *
 *  EXECUTION ORDER (CRITICAL to understand):
 *
 *    ┌─────────────────────────────────────────────────┐
 *    │                  INPUT FLOW                      │
 *    │                                                  │
 *    │  User Message                                    │
 *    │    → Memory processors run FIRST                 │
 *    │      (fetch history, semantic recall, working mem)│
 *    │    → Your custom inputProcessors run AFTER       │
 *    │    → LLM processes                               │
 *    │                                                  │
 *    │                  OUTPUT FLOW                      │
 *    │                                                  │
 *    │  LLM Response                                    │
 *    │    → Your custom outputProcessors run FIRST      │
 *    │    → Memory processors run AFTER                 │
 *    │      (persist messages, create embeddings)        │
 *    │    → Response to user                             │
 *    └─────────────────────────────────────────────────┘
 *
 *  WHY THIS ORDER MATTERS:
 *    If your output guardrail calls abort(), memory processors
 *    are SKIPPED — so harmful content is never saved to memory.
 *    This is a SAFETY feature by design.
 *
 *  MANUAL CONTROL:
 *    If you add a memory processor manually to inputProcessors
 *    or outputProcessors, it won't be auto-added — giving you
 *    full control over ordering.
 *
 *  DEDUPLICATION:
 *    Memory processors auto-deduplicate. If a processor is already
 *    in the pipeline, it won't be added twice.
 *
 *  COMBINING WITH OTHER PROCESSORS:
 *    You can use memory processors alongside custom processors:
 *    - TokenLimiter: Prevents context overflow
 *    - ToolCallFilter: Removes tool calls from history
 *    - Custom processors: Any middleware you build
 *
 *  EXERCISE
 *  --------
 *  Understand how memory processors interact with custom
 *  processors and observe the execution pipeline.
 * ============================================================
 */

import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import type { Processor } from '@mastra/core/agent';

// ─── TODO 1: Create a logging processor to see the pipeline ──
// This processor logs WHEN it runs so you can see the order.
// Implement both processInput and processOutputResult.
//
// processInput should:
//   1. Log "CUSTOM INPUT: processing <N> messages"
//   2. Log each message's role (to see what memory added)
//   3. Return messages unchanged
//
// processOutputResult should:
//   1. Log "CUSTOM OUTPUT: processing result"
//   2. Return result unchanged

const pipelineLogger: Processor = {
  // TODO: implement processInput
  // TODO: implement processOutputResult
};

// ─── TODO 2: Create an agent with memory + custom processor ──
// Register the logging processor alongside memory.
//
// Since memory processors run FIRST on input and LAST on output,
// your logger should see:
//   INPUT:  Memory has already fetched history → your logger sees it
//   OUTPUT: Your logger runs → then memory persists

const memory = new Memory({
  options: {
    lastMessages: 5,
  },
});

export const pipelineAgent = undefined as any; // ← replace

// ─── TODO 3: Test and observe the pipeline ──────────────────
// Send 3 messages and watch the console logs.
// You should see:
//   1st message: pipelineLogger sees 1 message (just user's)
//   2nd message: pipelineLogger sees 3 messages
//                (history: user+assistant from msg 1, plus new user msg)
//   3rd message: pipelineLogger sees 5 messages
//                (full history + new message)

export async function testPipeline() {
  const memConfig = {
    memory: { thread: { id: 'pipeline-thread' }, resource: 'user-pipeline' },
  };

  console.log('=== Message 1 ===');
  // TODO: Send "Hello, my name is Sam"

  console.log('\n=== Message 2 ===');
  // TODO: Send "I like pizza"

  console.log('\n=== Message 3 ===');
  // TODO: Send "What do you know about me?"
  // The agent should recall name + pizza preference from history

  console.log('\nTODO: implement');
}

// ─── TODO 4: Understand abort safety ────────────────────────
// CONCEPTUAL: Consider this scenario:
//
//   outputProcessors: [myGuardrail]  ← runs FIRST on output
//   memory processors                ← run AFTER on output
//
//   If myGuardrail detects harmful content and calls abort():
//     → Memory processors NEVER run
//     → Harmful content is NEVER saved to memory
//     → User sees the abort message instead
//
// Q: Why is this important?
// → Without this order, harmful agent responses would be saved
//   to memory and potentially recalled in future conversations.
//
// Q: What if you WANT to save aborted messages to memory?
// → Manually add the memory processor to outputProcessors
//   BEFORE your guardrail, overriding the default order.

// ─── TODO 5: Understand TokenLimiter ────────────────────────
// When conversations are long, the context window fills up.
// TokenLimiter removes older messages while keeping:
//   - System messages (always kept)
//   - Recent messages (configurable count)
//
// Usage:
//   import { TokenLimiter } from '@mastra/memory';
//   new Agent({
//     inputProcessors: [new TokenLimiter({ maxTokens: 4000 })],
//   })
//
// This runs AFTER memory loads history but BEFORE the LLM,
// ensuring the context never exceeds the limit.

// ─── TODO 6: Manual processor control ───────────────────────
// If you manually add a memory processor to inputProcessors
// or outputProcessors, Mastra WON'T auto-add it. This gives
// you full control over ordering and prevents duplicates.
//
//   import { MessageHistory } from '@mastra/core/processors';
//   import { TokenLimiter } from '@mastra/core/processors';
//
//   const customHistory = new MessageHistory({
//     storage: new LibSQLStore({ id: 'store', url: 'file:memory.db' }),
//     lastMessages: 20,
//   });
//
//   new Agent({
//     memory: new Memory({ ... }),
//     inputProcessors: [
//       customHistory,            // manually added → won't be auto-added
//       new TokenLimiter(4000),   // runs AFTER history loads
//     ],
//   })
//
// Use this when you need:
//   - Memory loaded in a specific order relative to other processors
//   - TokenLimiter between memory and LLM
//   - Custom filtering before memory saves

// ─── TODO 7: ToolCallFilter ─────────────────────────────────
// Tool calls and results can be VERY verbose (large JSON).
// ToolCallFilter strips them from LLM input to save tokens.
//
//   import { ToolCallFilter } from '@mastra/core/processors';
//
//   new Agent({
//     inputProcessors: [new ToolCallFilter()],
//   })
//
// Key points:
//   - Only affects what the LLM sees
//   - Messages are still SAVED to memory (filtered only from context)
//   - You can exclude specific tools from filtering

// ─── TODO 8: Complete pipeline example ──────────────────────
// A production agent might combine all these:
//
//   new Agent({
//     memory: new Memory({
//       lastMessages: 20,
//       semanticRecall: { topK: 3 },
//       workingMemory: { enabled: true, template: '...' },
//     }),
//     inputProcessors: [
//       // Memory auto-adds: WorkingMemory, MessageHistory, SemanticRecall
//       // Then your processors run:
//       new PromptInjectionDetector({ strategy: 'block' }),
//     ],
//     outputProcessors: [
//       // Your processors run FIRST:
//       new PIIDetector({ strategy: 'redact' }),
//       // Then memory auto-adds: SemanticRecall (embed), MessageHistory (persist)
//       // If PIIDetector aborts → memory NEVER saves the harmful response
//     ],
//   })
//
// Pipeline:
//   INPUT:  WorkingMem → MsgHistory → SemanticRecall → InjectionDetector → LLM
//   OUTPUT: PIIDetector → SemanticRecall(embed) → MsgHistory(persist) → User

export async function runTest() {
  await testPipeline();
}
