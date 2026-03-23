/**
 * ============================================================
 *  MODULE 10: Memory Storage
 * ============================================================
 *
 *  THEORY
 *  ------
 *  Memory needs a place to persist data. Mastra supports 10+
 *  storage providers. The storage handles:
 *    - Saving/loading messages
 *    - Managing threads and resources
 *    - Storing working memory state
 *    - Persisting observations
 *
 *  STORAGE LEVELS:
 *
 *    1. Instance-level (in Mastra config)
 *       → All agents share this storage
 *       → You already have this: LibSQLStore in index.ts
 *
 *    2. Agent-level (in Memory config)
 *       → Overrides instance storage for specific agents
 *       → Useful when one agent needs a different DB
 *
 *    3. Composite storage
 *       → Routes different domains to different providers
 *       → e.g., memory → LibSQL, workflows → PostgreSQL
 *
 *  SUPPORTED PROVIDERS:
 *    ┌──────────────────┬──────────────────────────────────┐
 *    │ Provider         │ Best for                         │
 *    ├──────────────────┼──────────────────────────────────┤
 *    │ LibSQL           │ Local dev, small apps (no server)│
 *    │ PostgreSQL       │ Production, scalability          │
 *    │ MongoDB          │ Document-oriented data           │
 *    │ Upstash          │ Serverless, edge functions       │
 *    │ Cloudflare D1/KV │ Cloudflare Workers               │
 *    │ DynamoDB         │ AWS infrastructure               │
 *    │ LanceDB          │ Vector-native storage            │
 *    │ Convex           │ Real-time sync                   │
 *    │ MSSQL            │ Enterprise / .NET ecosystems     │
 *    └──────────────────┴──────────────────────────────────┘
 *
 *  THREADS AND RESOURCES:
 *
 *    A Thread is a conversation session:
 *      { id: 'thread-123', title: 'Bug discussion', metadata: {...} }
 *
 *    A Resource is the owner (user, org, etc.):
 *      'user-456'
 *
 *    One resource can have many threads.
 *    Messages belong to threads.
 *
 *    Thread also supports optional properties:
 *      - title: descriptive name (can be auto-generated!)
 *      - metadata: arbitrary key-value pairs for filtering
 *
 *  AUTO TITLE GENERATION:
 *    Memory can auto-generate thread titles from the first message:
 *      new Memory({
 *        options: { generateTitle: true }
 *      })
 *    Or with a custom model:
 *      generateTitle: {
 *        model: 'openai/gpt-4o-mini',
 *        instructions: 'Generate a 3-word title',
 *      }
 *
 *  IMPORTANT NOTES:
 *    - Relative DB paths (file:./x.db) resolve per process CWD
 *      Use absolute paths when running multiple processes
 *    - Storage auto-initializes tables on first interaction
 *    - The memory system does NOT enforce access control
 *      → Verify authorization before querying any resourceId
 *
 *  EXERCISE
 *  --------
 *  This module is more conceptual since you already have
 *  LibSQLStore configured. We'll explore thread management
 *  and auto-title generation.
 * ============================================================
 */

import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';

// ─── TODO 1: Create an agent with auto title generation ─────
// Create an agent with memory that auto-generates thread titles.
//
// Hint:
//   new Memory({
//     options: {
//       lastMessages: 10,
//       generateTitle: true,
//     },
//   })
//
// This will automatically create a descriptive title for each
// thread based on the first message.

export const titledAgent = undefined as any; // ← replace

// ─── TODO 2: Test with thread metadata ──────────────────────
// When calling the agent, you can pass metadata on the thread:
//
//   memory: {
//     thread: {
//       id: 'support-123',
//       title: 'Billing Question',
//       metadata: { category: 'billing', priority: 'high' },
//     },
//     resource: 'user-1',
//   }
//
// This metadata can later be used to filter and search threads.

export async function testThreadMetadata() {
  console.log('--- Thread with metadata ---');
  // TODO: Call titledAgent.generate() with a thread that has metadata
  //       e.g., category: 'technical', priority: 'medium'
  // TODO: Print the response
  console.log('TODO: implement');
}

// ─── TODO 3: Create multiple threads for one user ───────────
// Send messages to 3 different threads for the same resource.
// This simulates one user having multiple conversations.
//
// Thread 1: Ask about cooking
// Thread 2: Ask about coding
// Thread 3: Ask about fitness
//
// Verify each thread is independent.

export async function testMultipleThreads() {
  const threads = [
    { topic: 'cooking', id: 'cooking-thread' },
    { topic: 'coding', id: 'coding-thread' },
    { topic: 'fitness', id: 'fitness-thread' },
  ];

  for (const t of threads) {
    console.log(`\n--- Thread: ${t.topic} ---`);
    // TODO: Send a question about t.topic to thread t.id
    //       with resource 'user-multi'
    // TODO: Print the response
  }
}

// ─── TODO 4: Understand storage architecture ────────────────
// CONCEPTUAL — answer these questions in your head:
//
// Q1: You have 3 agents. Agent A uses LibSQL, Agent B needs
//     PostgreSQL for scale. How would you configure this?
//     → Answer: Instance-level LibSQL + agent-level PgStore on B
//
// Q2: Your app runs both Mastra Studio and a web server.
//     Both use file:./mastra.db. What problem might occur?
//     → Answer: Different CWDs = different files. Use absolute paths.
//
// Q3: You're building a multi-tenant SaaS. How do you organize
//     resourceIds and threadIds?
//     → Answer: resourceId = tenant/user ID, threadId = conversation ID
//              Filter threads by resourceId to scope access.
//
// Q4: Memory doesn't enforce access control. What should you do?
//     → Answer: Verify authorization BEFORE querying any resourceId.
//              Don't let user A access user B's threads.

// ─── TODO 5: Composite storage ──────────────────────────────
// Route different data types to different storage backends:
//
//   import { MastraCompositeStore } from '@mastra/core/storage';
//
//   new Mastra({
//     storage: new MastraCompositeStore({
//       id: 'composite',
//       domains: {
//         memory: new LibSQLStore({ url: 'file:./memory.db' }),
//         workflows: new PgStore({ connectionString: process.env.DB_URL }),
//       },
//     }),
//   })
//
// Use when different data has different performance requirements:
//   - Memory → fast local DB (LibSQL)
//   - Workflows → scalable shared DB (PostgreSQL)
//   - Observability → analytics DB (ClickHouse)

// ─── TODO 6: Agent-level storage override ───────────────────
// Override instance storage for a specific agent:
//
//   new Agent({
//     id: 'special-agent',
//     memory: new Memory({
//       storage: new PgStore({
//         id: 'agent-storage',
//         connectionString: process.env.AGENT_DB_URL,
//       }),
//     }),
//   })
//
// The agent uses its OWN storage, not the instance-level one.
// Note: Not supported with Mastra Cloud Store.

// ─── TODO 7: Attachment handling for size-limited providers ──
// DynamoDB: 400KB limit. Convex/Cloudflare D1: 1MiB limit.
// Solution: upload attachments externally, replace with URLs.
//
//   class AttachmentUploader implements Processor {
//     id = 'attachment-uploader';
//
//     async processInput({ messages }) {
//       return Promise.all(messages.map(msg => {
//         const attachments = msg.content.experimental_attachments;
//         if (!attachments?.length) return msg;
//         // Upload data URIs to S3/R2/etc, replace with URLs
//         return { ...msg, content: { ...msg.content, ... } };
//       }));
//     }
//   }
//
//   new Agent({
//     memory: new Memory({ storage: dynamoStore }),
//     inputProcessors: [new AttachmentUploader()],
//   })

// ─── TODO 8: Absolute paths for multi-process ───────────────
// When running Mastra Studio (pnpm dev) alongside your app:
//
//   BAD:  url: 'file:./mastra.db'        // resolves per CWD
//   GOOD: url: 'file:/abs/path/mastra.db' // same DB for both

// ─── TODO 9: Custom title generation model ──────────────────
// Use a cheap model for title generation to save costs:
//
//   generateTitle: {
//     model: 'openai/gpt-4o-mini',
//     instructions: 'Generate a 3-word title',
//   }
//
// Title generation runs async — no impact on response latency.

export async function runTest() {
  console.log('=== Thread Metadata ===\n');
  await testThreadMetadata();

  console.log('\n=== Multiple Threads ===\n');
  await testMultipleThreads();
}
