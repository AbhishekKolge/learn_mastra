/**
 * ============================================================
 *  MODULE 34: Vector Databases
 * ============================================================
 *
 *  THEORY
 *  ------
 *  Vector databases are specialized for storing and searching
 *  EMBEDDINGS. Unlike regular databases that match exact values,
 *  vector databases find the most SIMILAR vectors — enabling
 *  semantic search.
 *
 *  Mastra provides a UNIFIED INTERFACE across 14+ vector stores:
 *    PgVector, Pinecone, Qdrant, MongoDB, Chroma, Astra,
 *    LibSQL, Upstash, Cloudflare, OpenSearch, Elasticsearch,
 *    Couchbase, Lance, S3 Vectors
 *
 *  All stores share the same API:
 *    store.createIndex({ indexName, dimension })
 *    store.upsert({ indexName, vectors, metadata })
 *    store.query({ indexName, queryVector, topK })
 *    store.deleteVectors({ indexName, filter })
 *
 *  THREE OPERATIONS:
 *
 *  1. CREATE INDEX — defines a collection for embeddings
 *     await store.createIndex({
 *       indexName: 'my_docs',
 *       dimension: 1536,  // must match your embedding model!
 *     })
 *
 *  2. UPSERT — store embeddings with metadata
 *     await store.upsert({
 *       indexName: 'my_docs',
 *       vectors: embeddings,
 *       metadata: chunks.map(c => ({
 *         text: c.text,          // the original text (critical!)
 *         source: 'article.md',  // custom metadata for filtering
 *         category: 'tech',
 *       })),
 *     })
 *
 *     "Upsert" = insert OR update. If an ID already exists,
 *     the vector is updated. Otherwise it's created.
 *
 *  3. QUERY — find similar vectors
 *     const results = await store.query({
 *       indexName: 'my_docs',
 *       queryVector: embedding,
 *       topK: 5,
 *     })
 *
 *  METADATA IS CRITICAL:
 *    Without metadata, you'd only get numerical vectors back —
 *    useless for generating answers. Always store at least the
 *    original `text` as metadata. You can also add:
 *      - source (filename, URL)
 *      - category, tags
 *      - timestamps (createdAt)
 *      - author, version
 *
 *  DELETING VECTORS:
 *    Delete by metadata filter:
 *      await store.deleteVectors({
 *        indexName: 'my_docs',
 *        filter: { source: 'old-article.md' },
 *      })
 *
 *    Delete by IDs:
 *      await store.deleteVectors({
 *        indexName: 'my_docs',
 *        ids: ['vec-1', 'vec-2'],
 *      })
 *
 *  DIMENSION RULES:
 *    - Index dimension MUST match embedding model output
 *    - Can't change dimension after creation
 *    - To change: delete index, recreate with new dimension
 *
 *  USING LibSQLVector (built-in):
 *    import { LibSQLVector } from '@mastra/core/vector/libsql'
 *    const store = new LibSQLVector({ url: 'file:./my.db' })
 *
 *    LibSQL is great for local development — file-based,
 *    no separate server needed, already in your dependencies.
 *
 *  EXERCISE
 *  --------
 *  Master vector database operations: create, upsert, query,
 *  metadata, and delete.
 * ============================================================
 */

import { MDocument } from '@mastra/rag';
import { embedMany, embed } from 'ai';
import { ModelRouterEmbeddingModel } from '@mastra/core/llm';
import { LibSQLVector } from '@mastra/core/vector/libsql';

const embeddingModel = new ModelRouterEmbeddingModel('openai/text-embedding-3-small');

// ─── TODO 1: Create a vector store and index ─────────────────
// Initialize LibSQLVector and create an index.
//
// const store = new LibSQLVector({ url: 'file:./vector-db-exercise.db' })
// await store.createIndex({ indexName: 'articles', dimension: 1536 })

export async function testCreateIndex() {
  console.log('--- Create Index ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 2: Upsert with rich metadata ───────────────────────
// Store embeddings with metadata including text, source, and category.
//
// const articles = [
//   { text: 'AI agents can use tools to interact with external systems.', source: 'agents.md', category: 'agents' },
//   { text: 'Workflows define step-by-step processes with schemas.', source: 'workflows.md', category: 'workflows' },
//   { text: 'Memory allows agents to remember past conversations.', source: 'memory.md', category: 'memory' },
//   { text: 'RAG retrieves relevant context before generating answers.', source: 'rag.md', category: 'rag' },
//   { text: 'Streaming delivers tokens incrementally for real-time UIs.', source: 'streaming.md', category: 'streaming' },
// ]
//
// const { embeddings } = await embedMany({
//   model: embeddingModel,
//   values: articles.map(a => a.text),
// })
//
// await store.upsert({
//   indexName: 'articles',
//   vectors: embeddings,
//   metadata: articles.map(a => ({
//     text: a.text,
//     source: a.source,
//     category: a.category,
//     createdAt: new Date().toISOString(),
//   })),
// })

export async function testUpsertWithMetadata() {
  console.log('--- Upsert with Metadata ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 3: Basic query ─────────────────────────────────────
// Query for similar content. Try different topK values.
//
// const { embedding } = await embed({
//   model: embeddingModel,
//   value: 'How do I make an agent remember things?',
// })
// const results = await store.query({
//   indexName: 'articles',
//   queryVector: embedding,
//   topK: 3,
// })

export async function testBasicQuery() {
  console.log('--- Basic Query ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 4: Query with metadata filter ──────────────────────
// Use a filter to only search within a specific category.
//
// const results = await store.query({
//   indexName: 'articles',
//   queryVector: embedding,
//   topK: 3,
//   filter: { category: 'agents' },
// })

export async function testFilteredQuery() {
  console.log('--- Filtered Query ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 5: Upsert updates (not duplicates) ────────────────
// Upsert the same text with updated metadata.
// Query to verify the update took effect.
// (Upsert with the same content re-embeds and updates.)

export async function testUpsertUpdate() {
  console.log('--- Upsert Updates ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 6: Delete vectors by filter ────────────────────────
// Delete all vectors from a specific source.
// Query before and after to verify deletion.
//
// await store.deleteVectors({
//   indexName: 'articles',
//   filter: { source: 'streaming.md' },
// })

export async function testDeleteByFilter() {
  console.log('--- Delete by Filter ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 7: Multi-document pipeline ─────────────────────────
// Process two different documents (fromText and fromMarkdown),
// chunk both, embed, and store in the same index with different
// source metadata. Then query and observe results from both sources.

export async function testMultiDocument() {
  console.log('--- Multi-Document Pipeline ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── Run all tests ───────────────────────────────────────────
export async function runTest() {
  console.log('=== Vector Databases ===\n');

  await testCreateIndex();
  console.log('\n');
  await testUpsertWithMetadata();
  console.log('\n');
  await testBasicQuery();
  console.log('\n');
  await testFilteredQuery();
  console.log('\n');
  await testUpsertUpdate();
  console.log('\n');
  await testDeleteByFilter();
  console.log('\n');
  await testMultiDocument();
}
