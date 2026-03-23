/**
 * ============================================================
 *  MODULE 14: Semantic Recall
 * ============================================================
 *
 *  THEORY
 *  ------
 *  Message history gives you the LAST N messages.
 *  But what if the relevant message was 200 messages ago?
 *
 *  Semantic Recall = RAG for conversations.
 *  It finds past messages by MEANING, not position.
 *
 *  HOW IT WORKS:
 *
 *    ┌──────────────┐     ┌──────────────────┐
 *    │ User message  │────→│ Embed into vector │
 *    └──────────────┘     └────────┬─────────┘
 *                                  │
 *                                  ▼
 *                         ┌────────────────┐
 *                         │  Vector DB      │
 *                         │  (similarity    │
 *                         │   search)       │
 *                         └────────┬───────┘
 *                                  │
 *                                  ▼
 *                         ┌────────────────┐
 *                         │ Top K similar   │
 *                         │ past messages   │
 *                         │ + surrounding   │
 *                         │ context         │
 *                         └────────────────┘
 *
 *    1. Every message gets embedded and stored in a vector DB
 *    2. When a new message arrives, it's embedded and searched
 *       against all previous messages
 *    3. The top K most similar messages are retrieved
 *    4. Surrounding context (messageRange) is included
 *    5. These are prepended to the LLM context
 *
 *  CONFIG OPTIONS:
 *    semanticRecall: {
 *      topK: 3,           // number of similar messages to find
 *      messageRange: 2,   // include N messages before/after each match
 *      scope: 'thread',   // 'thread' or 'resource'
 *    }
 *
 *  REQUIRES:
 *    - A vector store (LibSQLVector, PgVector, Pinecone, etc.)
 *    - An embedding model (OpenAI text-embedding-3-small, etc.)
 *    - Storage for messages
 *
 *  EMBEDDING MODELS:
 *    - ModelRouterEmbeddingModel('openai/text-embedding-3-small') — cloud
 *    - fastembed — local, no API key needed
 *
 *  SCOPE:
 *    - 'thread': Search within current thread only
 *    - 'resource': Search across ALL threads for this user
 *
 *  DISABLE:
 *    For performance-sensitive apps (like real-time voice),
 *    disable with: semanticRecall: false
 *
 *  recall() METHOD:
 *    You can also search manually:
 *      memory.recall({
 *        threadId: 'x',
 *        vectorSearchString: 'project deadline discussion',
 *        threadConfig: { semanticRecall: true },
 *      })
 *
 *  EXERCISE
 *  --------
 *  Set up semantic recall and test that the agent can find
 *  old messages by meaning.
 *
 *  NOTE: Semantic recall requires a vector store. If you don't
 *  have one set up, this module is conceptual. LibSQLVector
 *  works with your existing LibSQL setup.
 * ============================================================
 */

import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore, LibSQLVector } from '@mastra/libsql';

// ─── TODO 1: Create memory with semantic recall ─────────────
// You need:
//   - storage: LibSQLStore (for messages)
//   - vector: LibSQLVector (for embeddings)
//   - embedder: an embedding model
//   - semanticRecall config
//
// For the embedder, use ModelRouterEmbeddingModel:
//   import { ModelRouterEmbeddingModel } from '@mastra/core/llm';
//   new ModelRouterEmbeddingModel('openai/text-embedding-3-small')
//
// OR if you don't have an OpenAI key, use fastembed:
//   import { fastembed } from '@mastra/fastembed';
//
// Full config:
//   new Memory({
//     storage: new LibSQLStore({ id: 'sr-storage', url: 'file:./semantic.db' }),
//     vector: new LibSQLVector({ id: 'sr-vector', url: 'file:./semantic.db' }),
//     embedder: new ModelRouterEmbeddingModel('openai/text-embedding-3-small'),
//     options: {
//       lastMessages: 5,
//       semanticRecall: {
//         topK: 3,
//         messageRange: 1,
//       },
//     },
//   })

const semanticMemory = undefined as any; // ← replace

export const semanticAgent = undefined as any; // ← replace

// ─── TODO 2: Build a conversation with diverse topics ───────
// Send 10+ messages covering different topics, so we have
// varied content in the vector store.

export async function buildHistory() {
  const memConfig = {
    memory: { thread: { id: 'semantic-thread' }, resource: 'user-semantic' },
  };

  const messages = [
    'My birthday is March 15th and I always celebrate with sushi.',
    "I've been working on a machine learning project using PyTorch.",
    "My dog's name is Biscuit and he's a golden retriever.",
    'The deployment pipeline uses GitHub Actions and Docker.',
    'I really enjoy hiking in the mountains on weekends.',
    'The database schema has 15 tables with complex relationships.',
    'My favorite book is Dune by Frank Herbert.',
    'We use Redis for caching and RabbitMQ for message queues.',
    "I'm allergic to peanuts but love all other nuts.",
    'The frontend is built with Next.js and Tailwind CSS.',
  ];

  for (const msg of messages) {
    console.log(`Sending: ${msg}`);
    // TODO: Send each message to semanticAgent with memConfig
  }
}

// ─── TODO 3: Test semantic recall ───────────────────────────
// Now ask questions that relate to EARLIER messages
// (beyond the lastMessages: 5 window).
//
// The agent should find relevant past messages via vector search!

export async function testSemanticRecall() {
  const memConfig = {
    memory: { thread: { id: 'semantic-thread' }, resource: 'user-semantic' },
  };

  console.log('--- Testing recall (lastMessages: 5) ---\n');

  // These topics were discussed EARLY (outside the 5-message window)
  // Semantic recall should find them by meaning!

  // TODO: Ask "When is my birthday?" → should recall March 15th
  // TODO: Ask "What's my pet's name?" → should recall Biscuit
  // TODO: Ask "What ML framework do I use?" → should recall PyTorch

  console.log('TODO: implement');
}

// ─── TODO 4: Manual recall with vectorSearchString ──────────
// Use the recall() method directly to search by meaning.

export async function testManualRecall() {
  console.log('--- Manual semantic search ---\n');

  // TODO: Get memory from agent
  // TODO: Call memory.recall({
  //   threadId: 'semantic-thread',
  //   vectorSearchString: 'food allergies',
  //   threadConfig: { semanticRecall: true },
  // })
  // TODO: Print the retrieved messages
  //       → Should find the peanut allergy message

  console.log('TODO: implement');
}

// ─── TODO 5: FastEmbed — local embeddings (no API key) ──────
// If you don't have an OpenAI key, use FastEmbed for local embeddings:
//
//   pnpm add @mastra/fastembed
//
//   import { fastembed } from '@mastra/fastembed';
//
//   new Memory({
//     embedder: fastembed,  // runs locally, no API needed
//     ...
//   })
//
// Trade-off: slightly lower quality than OpenAI embeddings,
// but zero cost and no network latency.

// ─── TODO 6: OpenRouter embedding config ────────────────────
// Use OpenRouter to access various embedding providers:
//
//   new ModelRouterEmbeddingModel({
//     providerId: 'openrouter',
//     modelId: 'openai/text-embedding-3-small',
//   })
//
// Set OPENROUTER_API_KEY in environment. Auto-detected.

// ─── TODO 7: Resource scope — cross-thread search ───────────
// By default, semantic recall searches within the current thread.
// With resource scope, it searches ALL threads for the same user:
//
//   semanticRecall: {
//     topK: 3,
//     messageRange: 2,
//     scope: 'resource',  // ← search all threads for this user
//   }
//
// Use when: "What did we discuss about X?" across conversations.

// ─── TODO 8: PostgreSQL index optimization ──────────────────
// For large-scale production with PostgreSQL:
//
//   import { PgVector } from '@mastra/pg';
//
//   semanticRecall: {
//     topK: 5,
//     messageRange: 2,
//     indexConfig: {
//       type: 'hnsw',           // or 'ivfflat'
//       metric: 'dotproduct',   // best for OpenAI embeddings
//       m: 16,                  // HNSW: max connections per node
//       efConstruction: 64,     // HNSW: build-time accuracy
//     },
//   }
//
// HNSW is typically faster than IVFFlat for OpenAI embeddings.

// ─── TODO 9: Disabling semantic recall ──────────────────────
// Semantic recall adds latency (embedding + vector query).
// Disable for performance-sensitive apps (e.g., realtime voice):
//
//   new Memory({
//     options: {
//       semanticRecall: false,  // ← no vector search
//     },
//   })

// ─── TODO 10: Supported vector stores ───────────────────────
// 17 vector stores are supported:
//   Astra, Chroma, Cloudflare Vectorize, Convex, Couchbase,
//   DuckDB, Elasticsearch, LanceDB, libSQL, MongoDB, OpenSearch,
//   Pinecone, PostgreSQL, Qdrant, S3 Vectors, Turbopuffer, Upstash

// ─── Run all tests ──────────────────────────────────────────
export async function runTest() {
  console.log('=== Building Conversation History ===\n');
  await buildHistory();

  console.log('\n=== Testing Semantic Recall ===\n');
  await testSemanticRecall();

  console.log('\n=== Manual Recall ===\n');
  await testManualRecall();
}
