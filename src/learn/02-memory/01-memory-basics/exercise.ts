/**
 * ============================================================
 *  MODULE 9: Memory Basics
 * ============================================================
 *
 *  THEORY
 *  ------
 *  Without memory, every agent call is a blank slate — the agent
 *  has ZERO knowledge of previous conversations. Memory fixes this.
 *
 *  Memory enables agents to:
 *    - Remember user messages, agent replies, and tool results
 *    - Maintain context across multiple interactions
 *    - Stay consistent over time
 *
 *  TWO KEY IDENTIFIERS organize memory:
 *
 *    ┌─────────────────────────────────────────────┐
 *    │  resourceId  = WHO is talking (user/org)    │
 *    │  threadId    = WHICH conversation           │
 *    └─────────────────────────────────────────────┘
 *
 *    Think of it like email:
 *      - resourceId = your email address (identifies YOU)
 *      - threadId   = a specific email thread
 *      - One user can have many threads
 *      - Each thread has its own message history
 *
 *  MEMORY FEATURES (5 layers, mix & match):
 *
 *    1. Message History   — stores recent messages (baseline)
 *       → "What did we just talk about?"
 *
 *    2. Working Memory    — persists structured user data
 *       → "User prefers dark mode, speaks French"
 *
 *    3. Observational Memory — compresses old messages into logs
 *       → "Here's a summary of our last 500 messages"
 *
 *    4. Semantic Recall   — finds relevant past messages by meaning
 *       → "We discussed project deadlines 3 weeks ago"
 *
 *    5. Memory Processors — filter/prioritize when context is full
 *       → "Drop tool calls, keep recent messages"
 *
 *  SETUP requires:
 *    1. A storage provider (LibSQL, PostgreSQL, MongoDB, etc.)
 *    2. A Memory instance with options
 *    3. Thread + resource IDs when calling the agent
 *
 *  EXERCISE
 *  --------
 *  Create an agent with basic memory and test that it remembers
 *  across multiple messages in the same thread.
 * ============================================================
 */

import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';

// ─── TODO 1: Create a Memory instance ───────────────────────
// Create a Memory with:
//   - lastMessages: 20 (how many recent messages to include)
//
// The storage will be inherited from your Mastra instance
// (already configured with LibSQLStore in src/mastra/index.ts).
//
// Hint:
//   new Memory({
//     options: {
//       lastMessages: 20,
//     },
//   })

const memory = undefined as any; // ← replace

// ─── TODO 2: Create an agent with memory ────────────────────
// Create a personal assistant agent that uses the memory above.
// Give it instructions to:
//   - Remember user preferences mentioned in conversation
//   - Refer back to earlier messages when relevant
//   - Be friendly and personal
//
// Hint: Just add `memory` to the Agent config

export const memoryAgent = undefined as any; // ← replace

// ─── TODO 3: Test memory across multiple messages ───────────
// Send multiple messages to the SAME thread and verify the agent
// remembers earlier messages.
//
// Key: You MUST pass `memory: { thread, resource }` to each call.
// Use the SAME threadId and resourceId for continuity!
//
// Example flow:
//   Message 1: "My name is Alex and I love TypeScript"
//   Message 2: "What's my name?"          → should say "Alex"
//   Message 3: "What language do I love?"  → should say "TypeScript"
//
// The memory parameter structure:
//   {
//     memory: {
//       thread: { id: 'thread-1' },
//       resource: 'user-1',
//     }
//   }

export async function testMemoryBasics() {
  const memoryConfig = {
    memory: {
      thread: { id: 'test-thread-1' },
      resource: 'user-alex',
    },
  };

  console.log('--- Message 1: Introduce myself ---');
  // TODO: Send "My name is Alex and I love TypeScript" with memoryConfig
  // TODO: Print the response

  console.log('\n--- Message 2: Test recall ---');
  // TODO: Send "What's my name?" with the SAME memoryConfig
  // TODO: Print the response (should mention "Alex")

  console.log('\n--- Message 3: Test deeper recall ---');
  // TODO: Send "What programming language do I love?" with SAME memoryConfig
  // TODO: Print the response (should mention "TypeScript")
}

// ─── TODO 4: Test thread isolation ──────────────────────────
// Send a message in a DIFFERENT thread and verify the agent
// does NOT remember the previous conversation.
//
// This proves memory is scoped to threads.

export async function testThreadIsolation() {
  const differentThread = {
    memory: {
      thread: { id: 'test-thread-2' },   // ← different thread!
      resource: 'user-alex',              // ← same user
    },
  };

  console.log('--- Different thread: should NOT know my name ---');
  // TODO: Send "What's my name?" in the different thread
  // TODO: Print the response (should NOT know "Alex")
}

// ─── TODO 5: Multi-agent memory delegation scoping ──────────
// When a SUPERVISOR delegates to a subagent, Mastra auto-isolates
// the subagent's memory. Here's exactly what happens:
//
//   Thread ID:    UNIQUE per delegation (fresh each time)
//   Resource ID:  Derived as {parentResourceId}-{agentName}
//                 → stable across delegations, so resource-scoped
//                   memory (working memory, semantic recall) persists
//   Memory:       Subagent inherits supervisor's Memory if it has
//                 none of its own. If it defines its own, that wins.
//
// Example: supervisor has resourceId 'user-123', subagent name 'writer'
//   → subagent resourceId = 'user-123-writer'
//   → subagent threadId = unique per delegation
//
// The supervisor forwards conversation context so the subagent
// has background, but ONLY the delegation prompt + response are
// saved to the subagent's memory.
//
// You can control what context reaches the subagent with messageFilter.
//
// Two different subagents under the same supervisor NEVER share
// a resourceId through delegation:
//   'user-123-writer' ≠ 'user-123-researcher'

// ─── TODO 6: Share memory between agents (direct calls) ─────
// Outside delegation, you control sharing via identifiers.
// Agents with the SAME resourceId + threadId share everything.
//
// RESOURCE-SCOPED sharing (most common):
//   Working memory and semantic recall default to scope: 'resource'.
//   Same resourceId → shared observations, working mem, embeddings.
//
//   await researcher.generate('Find info about quantum computing.', {
//     memory: { resource: 'project-42', thread: 'research-session' },
//   });
//   await writer.generate('Write a summary from the research.', {
//     memory: { resource: 'project-42', thread: 'writing-session' },
//   });
//   // Different threads but same resource → writer sees researcher's
//   // working memory, semantic embeddings, and observations.
//
// THREAD-SCOPED sharing (tighter coupling):
//   Observational memory uses scope: 'thread' by default.
//   Same resource AND thread → agents share full message history.
//
//   await agentA.generate('Step 1 done.', {
//     memory: { resource: 'project-42', thread: 'shared-thread' },
//   });
//   await agentB.generate('Continue from step 1.', {
//     memory: { resource: 'project-42', thread: 'shared-thread' },
//   });
//   // agentB sees agentA's messages in the same thread.

// ─── TODO 7: RequestContext for per-request memory switching ─
// Swap memory configuration based on request context (e.g., user tier):
//
//   import { RequestContext } from '@mastra/core';
//
//   const premiumMemory = new Memory({ ... });
//   const standardMemory = new Memory({ ... });
//
//   const agent = new Agent({
//     id: 'adaptive-agent',
//     memory: ({ requestContext }) => {
//       const tier = requestContext.get('user-tier');
//       return tier === 'enterprise' ? premiumMemory : standardMemory;
//     },
//   });
//
// This is useful in server contexts where different users
// need different memory backends or configurations.

// ─── Run all tests ──────────────────────────────────────────
export async function runTest() {
  console.log('=== Memory Basics ===\n');
  await testMemoryBasics();

  console.log('\n\n=== Thread Isolation ===\n');
  await testThreadIsolation();
}
