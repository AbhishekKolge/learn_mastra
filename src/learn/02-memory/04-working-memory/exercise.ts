/**
 * ============================================================
 *  MODULE 12: Working Memory
 * ============================================================
 *
 *  THEORY
 *  ------
 *  Message history stores raw conversation. But what about
 *  structured facts ABOUT the user? That's working memory.
 *
 *  Think of it as the agent's SCRATCHPAD — a persistent notepad
 *  where it writes down key information to remember later.
 *
 *  ANALOGY:
 *    Message History = full chat transcript
 *    Working Memory  = sticky notes on your monitor
 *
 *  Example: After 50 messages, the agent knows:
 *    - User name: Alex
 *    - Preferred language: TypeScript
 *    - Timezone: PST
 *    - Current project: E-commerce app
 *    ...without needing to re-read all 50 messages.
 *
 *  TWO FORMATS:
 *
 *  1. TEMPLATE (Markdown) — free-form, flexible
 *     ```
 *     workingMemory: {
 *       enabled: true,
 *       template: `
 *         ## User Profile
 *         - Name:
 *         - Role:
 *         - Preferences:
 *       `,
 *     }
 *     ```
 *     Agent fills in values as it learns them.
 *
 *  2. SCHEMA (Zod) — structured JSON, type-safe
 *     ```
 *     workingMemory: {
 *       enabled: true,
 *       schema: z.object({
 *         name: z.string().optional(),
 *         role: z.string().optional(),
 *         preferences: z.array(z.string()).optional(),
 *       }),
 *     }
 *     ```
 *     Agent updates specific fields via merge semantics:
 *       - Only changed fields are updated
 *       - Set a field to null to remove it
 *       - Arrays replace entirely (no element merge)
 *
 *  SCOPING:
 *    - Resource-scoped (default): Persists across ALL threads for a user
 *      → "Remember my name everywhere"
 *    - Thread-scoped: Isolated to one thread
 *      → "Remember task-specific context only here"
 *
 *  READ-ONLY MODE:
 *    Set `readOnly: true` to let agents ACCESS working memory
 *    but not MODIFY it. Useful for routing agents or sub-agents
 *    that shouldn't change the user profile.
 *
 *  PROGRAMMATIC INIT:
 *    You can pre-populate working memory without agent interaction:
 *      memory.updateWorkingMemory(threadId, resourceId, initialData)
 *
 *  EXERCISE
 *  --------
 *  Create an agent that uses working memory to build a user profile
 *  across conversations.
 * ============================================================
 */

import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { z } from 'zod';

// ─── TODO 1: Create memory with template-based working memory ─
// Use a markdown template for flexible working memory:
//
//   workingMemory: {
//     enabled: true,
//     template: `
//       ## User Profile
//       - Name:
//       - Occupation:
//       - Location:
//       - Interests:
//       - Preferred Language:
//       ## Conversation Notes
//       - Key topics discussed:
//       - Open questions:
//     `,
//   }
//
// The agent will fill in these fields as it learns about the user.

const templateMemory = undefined as any; // ← replace

export const templateAgent = undefined as any; // ← replace

// ─── TODO 2: Test template working memory ───────────────────
// Send several messages revealing different pieces of user info.
// After each message, the agent should update its working memory.
//
// Then verify by asking the agent to summarize what it knows.

export async function testTemplateMemory() {
  const memConfig = {
    memory: { thread: { id: 'wm-template-thread' }, resource: 'user-wm-test' },
  };

  console.log('--- Feeding user info across messages ---');

  // TODO: Message 1: "Hi, I'm Priya. I'm a data scientist in Mumbai."
  // TODO: Message 2: "I'm really into machine learning and photography."
  // TODO: Message 3: "I mostly code in Python but I'm learning Rust."
  // TODO: Message 4: "Can you summarize everything you know about me?"
  //       → Agent should recall all details from working memory!

  console.log('TODO: implement');
}

// ─── TODO 3: Create memory with schema-based working memory ──
// Use a Zod schema for structured, type-safe working memory:
//
//   workingMemory: {
//     enabled: true,
//     schema: z.object({
//       userName: z.string().optional(),
//       role: z.string().optional(),
//       skills: z.array(z.string()).optional(),
//       preferences: z.object({
//         theme: z.string().optional(),
//         language: z.string().optional(),
//       }).optional(),
//     }),
//   }
//
// Schema memory uses MERGE semantics:
//   - Only changed fields are updated
//   - null removes a field
//   - Arrays replace entirely

const schemaMemory = undefined as any; // ← replace

export const schemaAgent = undefined as any; // ← replace

// ─── TODO 4: Test schema working memory ─────────────────────
export async function testSchemaMemory() {
  const memConfig = {
    memory: { thread: { id: 'wm-schema-thread' }, resource: 'user-wm-schema' },
  };

  console.log('--- Testing schema-based working memory ---');

  // TODO: Message 1: "I'm Jordan, a frontend developer"
  //       → Should set userName and role
  // TODO: Message 2: "I know React, Vue, and Svelte"
  //       → Should set skills array
  // TODO: Message 3: "I prefer dark theme and code in TypeScript"
  //       → Should set preferences
  // TODO: Message 4: "What do you know about me? List everything."
  //       → Should recall structured data

  console.log('TODO: implement');
}

// ─── TODO 5: Test cross-thread persistence ──────────────────
// Working memory is resource-scoped by default.
// Information learned in thread A should be available in thread B
// for the SAME user.

export async function testCrossThread() {
  console.log('--- Cross-thread persistence ---');

  // TODO: Use the same schemaAgent
  // TODO: Start a NEW thread (different thread id) but same resource
  // TODO: Ask "What's my name?" → should know from previous thread
  console.log('TODO: implement');
}

// ─── TODO 6: Thread-scoped working memory ───────────────────
// By default, working memory is resource-scoped (shared across threads).
// For thread-scoped (isolated per thread):
//
//   workingMemory: {
//     enabled: true,
//     scope: 'thread',      // ← each thread has its own memory
//     template: '...',
//   }
//
// Use thread-scoped for:
//   - Task-specific context that shouldn't leak across conversations
//   - Ephemeral sessions where memory should stay isolated

// ─── TODO 7: Read-only working memory ───────────────────────
// Prevent the agent from modifying working memory.
// Useful for routing agents or sub-agents that should
// READ the user profile but NOT change it.
//
//   await agent.generate('What do you know about me?', {
//     memory: {
//       thread: 'thread-1',
//       resource: 'user-1',
//       options: { readOnly: true },  // ← can read, can't write
//     },
//   })

// ─── TODO 8: Programmatic initialization ────────────────────
// Pre-populate working memory WITHOUT agent interaction.
// Three ways:
//
// A) Via thread metadata when creating a thread:
//   await memory.createThread({
//     threadId: 'thread-1',
//     resourceId: 'user-1',
//     metadata: {
//       workingMemory: `# Patient Profile\n- Name: John Doe\n- Blood Type: O+`,
//     },
//   });
//
// B) Update existing thread metadata:
//   await memory.updateThread({
//     id: 'thread-1',
//     title: thread.title,
//     metadata: { ...thread.metadata, workingMemory: '...' },
//   });
//
// C) Direct update method:
//   await memory.updateWorkingMemory({
//     threadId: 'thread-1',
//     resourceId: 'user-1',
//     workingMemory: 'Updated content...',
//   });

// ─── TODO 9: Merge semantics deep-dive ──────────────────────
// Schema working memory uses MERGE semantics:
//
//   Current state: { name: "Alex", skills: ["React"], prefs: { theme: "dark" } }
//
//   Agent updates: { skills: ["Vue", "Svelte"] }
//   Result:        { name: "Alex", skills: ["Vue", "Svelte"], prefs: { theme: "dark" } }
//                    ↑ unchanged    ↑ REPLACED (not merged)     ↑ unchanged
//
//   Agent updates: { prefs: null }
//   Result:        { name: "Alex", skills: ["Vue", "Svelte"] }
//                                                               ↑ REMOVED (null = delete)
//
// Key rules:
//   - Object fields: deep merged (only provided fields change)
//   - Arrays: replace entirely (NOT merged element-by-element)
//   - null: explicitly removes the field
//   - Omitted fields: unchanged

// ─── Run all tests ──────────────────────────────────────────
export async function runTest() {
  console.log('=== Template Working Memory ===\n');
  await testTemplateMemory();

  console.log('\n=== Schema Working Memory ===\n');
  await testSchemaMemory();

  console.log('\n=== Cross-Thread Persistence ===\n');
  await testCrossThread();
}
