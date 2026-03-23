/**
 * ============================================================
 *  MODULE 11: Message History
 * ============================================================
 *
 *  THEORY
 *  ------
 *  Message history is the FOUNDATION of memory. It's the raw
 *  record of who said what and when.
 *
 *  HOW IT WORKS:
 *    1. Agent receives a message
 *    2. Memory fetches last N messages from the thread
 *    3. Those messages are prepended to the LLM context
 *    4. LLM responds with full conversation context
 *    5. New messages (user + assistant) are persisted to storage
 *
 *  CONFIG:
 *    lastMessages: 10   → include last 10 messages in context
 *    lastMessages: false → include ALL messages (careful with tokens!)
 *
 *  MESSAGE STRUCTURE:
 *    Each message has:
 *      - role: 'user' | 'assistant' | 'system' | 'tool'
 *      - content: string or structured content parts
 *      - id: unique message ID
 *      - createdAt: timestamp
 *
 *  QUERYING MESSAGES:
 *    The `recall()` method is the primary way to query messages:
 *
 *    // Basic — get last N messages
 *    memory.recall({ threadId, perPage: 50 })
 *
 *    // Paginated
 *    memory.recall({ threadId, page: 0, perPage: 50 })
 *
 *    // Date range
 *    memory.recall({
 *      threadId,
 *      filter: {
 *        dateRange: { start: new Date('2025-01-01'), end: new Date('2025-06-01') },
 *      },
 *    })
 *
 *    // By ID with surrounding context
 *    memory.recall({
 *      threadId,
 *      include: [{ id: 'msg-123', withPreviousMessages: 3 }],
 *    })
 *
 *  THREAD OPERATIONS:
 *    memory.listThreads({ filter: { resourceId: 'user-1' } })
 *    memory.getThreadById({ threadId: 'thread-1' })
 *    memory.cloneThread({ sourceThreadId: 'thread-1', title: 'Branch' })
 *    memory.deleteMessages(threadId, messageIds)
 *
 *  EXERCISE
 *  --------
 *  Build a conversation, then query the message history
 *  programmatically to understand how storage works.
 * ============================================================
 */

import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';

// ─── Setup: Agent with memory ───────────────────────────────
const memory = new Memory({
  options: {
    lastMessages: 20,
  },
});

export const historyAgent = new Agent({
  id: 'history-agent',
  name: 'History Test Agent',
  instructions: 'You are a helpful assistant. Keep responses under 2 sentences.',
  model: 'anthropic/claude-sonnet-4-5',
  memory,
});

// ─── TODO 1: Build a conversation ───────────────────────────
// Send 5 messages in the same thread to build up history.
// Use different topics so we can search for them later.

const THREAD_ID = 'history-test-thread';
const RESOURCE_ID = 'user-history-test';

export async function buildConversation() {
  const memConfig = {
    memory: { thread: { id: THREAD_ID }, resource: RESOURCE_ID },
  };

  const messages = [
    'My favorite color is blue.',
    'I work as a software engineer at a startup.',
    'I have two cats named Luna and Mochi.',
    'I prefer dark mode in all my editors.',
    "My current project uses TypeScript and React.",
  ];

  for (const msg of messages) {
    console.log(`User: ${msg}`);
    // TODO: Send each message to historyAgent with memConfig
    // TODO: Print the agent's response
  }
}

// ─── TODO 2: Query message history with recall() ────────────
// After building the conversation, use memory.recall() to
// retrieve and inspect the stored messages.
//
// Get the memory instance from the agent:
//   const mem = await historyAgent.getMemory();
//
// Then use recall():
//   const { messages } = await mem.recall({ threadId: THREAD_ID });

export async function queryHistory() {
  console.log('--- Fetching message history ---\n');
  // TODO: Get memory from agent
  // TODO: Call recall({ threadId: THREAD_ID, perPage: false })
  // TODO: Loop through messages and print role + content
  //       for each message
  console.log('TODO: implement');
}

// ─── TODO 3: List threads for a resource ────────────────────
// List all threads belonging to our test user.
//
//   const result = await mem.listThreads({
//     filter: { resourceId: RESOURCE_ID },
//   });

export async function listUserThreads() {
  console.log('--- Listing threads ---\n');
  // TODO: Get memory, list threads, print each thread's id and title
  console.log('TODO: implement');
}

// ─── TODO 4: Test lastMessages limit ────────────────────────
// Create an agent with lastMessages: 2 and send 5 messages.
// Then ask a question about message #1 — the agent should NOT
// remember it because only the last 2 messages are in context.
//
// This demonstrates the context window tradeoff:
//   More messages = better context, but more tokens = more cost

export async function testLastMessagesLimit() {
  const limitedMemory = new Memory({
    options: { lastMessages: 2 },
  });

  const limitedAgent = new Agent({
    id: 'limited-agent',
    name: 'Limited Memory Agent',
    instructions: 'You are a helpful assistant.',
    model: 'anthropic/claude-sonnet-4-5',
    memory: limitedMemory,
  });

  const memConfig = {
    memory: { thread: { id: 'limited-thread' }, resource: 'user-limited' },
  };

  console.log('--- Sending 5 messages with lastMessages: 2 ---\n');

  // TODO: Send message 1: "My secret code is ALPHA-777"
  // TODO: Send messages 2-5: casual conversation (anything)
  // TODO: Send message 6: "What is my secret code?"
  //       → Agent should NOT remember ALPHA-777
  // TODO: Print the response
  console.log('TODO: implement');
}

// ─── TODO 5: Paginated retrieval ─────────────────────────────
// For large threads, fetch messages in pages:
//
//   const page0 = await mem.recall({ threadId, page: 0, perPage: 10 });
//   const page1 = await mem.recall({ threadId, page: 1, perPage: 10 });

// ─── TODO 6: Date range filtering ───────────────────────────
// Find messages within a time window:
//
//   const { messages } = await mem.recall({
//     threadId,
//     filter: {
//       dateRange: {
//         start: new Date('2025-01-01'),
//         end: new Date('2025-06-01'),
//       },
//     },
//   });

// ─── TODO 7: Fetch specific messages with context ───────────
// Get a message by ID + surrounding messages for context:
//
//   const { messages } = await mem.recall({
//     threadId,
//     include: [
//       { id: 'msg-123' },                    // just this message
//       {
//         id: 'msg-456',
//         withPreviousMessages: 3,             // 3 messages before
//         withNextMessages: 1,                 // 1 message after
//       },
//     ],
//   });

// ─── TODO 8: Clone a thread ─────────────────────────────────
// Create a branch/fork of a conversation:
//
//   const { thread, clonedMessages } = await mem.cloneThread({
//     sourceThreadId: 'thread-123',
//     title: 'Branched conversation',
//   });
//
// The new thread has its own ID but copies all messages.
// Useful for "what if" scenarios or experimentation.

// ─── TODO 9: Delete messages ────────────────────────────────
// Remove specific messages from a thread:
//
//   await mem.deleteMessages(threadId, [messageId1, messageId2]);
//
// Or clear all messages from a thread.

// ─── Run all tests ──────────────────────────────────────────
export async function runTest() {
  console.log('=== Building Conversation ===\n');
  await buildConversation();

  console.log('\n=== Querying History ===\n');
  await queryHistory();

  console.log('\n=== Listing Threads ===\n');
  await listUserThreads();

  console.log('\n=== lastMessages Limit ===\n');
  await testLastMessagesLimit();
}
