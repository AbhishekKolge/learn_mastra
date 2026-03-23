/**
 * MODULE 31: RAG Basics — SOLUTION
 */

import { MDocument } from '@mastra/rag';
import { embedMany, embed } from 'ai';
import { ModelRouterEmbeddingModel } from '@mastra/core/llm';
import { LibSQLVector } from '@mastra/core/vector/libsql';

// ─── TODO 1: Create a document ───────────────────────────────
const doc = MDocument.fromText(`
  Mastra is an open-source TypeScript framework for building AI agents.
  It provides tools for creating agents, workflows, memory systems,
  and RAG pipelines. Agents can use tools, have memory, and produce
  structured output.

  Workflows in Mastra let you define step-by-step processes.
  Each step has an input schema and output schema. Steps can run
  in parallel, branch conditionally, or loop. Workflows support
  suspend and resume for human-in-the-loop patterns.

  Memory in Mastra gives agents the ability to remember conversations.
  It supports working memory, semantic recall, and observational memory.
  Multiple storage providers are available including LibSQL and PostgreSQL.

  RAG (Retrieval-Augmented Generation) enhances LLM outputs by
  incorporating relevant context from your own data sources.
  It uses chunking, embeddings, and vector databases to find
  relevant information for each query.
`);

const embeddingModel = new ModelRouterEmbeddingModel('openai/text-embedding-3-small');

// ─── TODO 2: Chunk the document ──────────────────────────────
export async function testChunking() {
  console.log('--- Step 2: Chunking ---');

  const chunks = await doc.chunk({
    strategy: 'recursive',
    size: 200,
    overlap: 20,
  });

  console.log(`Created ${chunks.length} chunks`);
  chunks.forEach((c, i) => console.log(`  Chunk ${i}: "${c.text.slice(0, 60)}..."`));
  return chunks;
}

// ─── TODO 3: Generate embeddings ─────────────────────────────
export async function testEmbeddings() {
  console.log('--- Step 3: Embeddings ---');

  const chunks = await doc.chunk({ strategy: 'recursive', size: 200, overlap: 20 });

  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: chunks.map(c => c.text),
  });

  console.log(`Generated ${embeddings.length} embeddings`);
  console.log(`Embedding dimension: ${embeddings[0].length}`);
  console.log(`First 5 values of embedding[0]: [${embeddings[0].slice(0, 5).map(v => v.toFixed(4)).join(', ')}...]`);
  return { chunks, embeddings };
}

// ─── TODO 4: Store in a vector database ──────────────────────
export async function testStorage() {
  console.log('--- Step 4: Storage ---');

  const chunks = await doc.chunk({ strategy: 'recursive', size: 200, overlap: 20 });
  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: chunks.map(c => c.text),
  });

  const vectorStore = new LibSQLVector({
    url: 'file:./rag-exercise.db',
  });

  await vectorStore.createIndex({
    indexName: 'rag_basics',
    dimension: 1536,
  });

  await vectorStore.upsert({
    indexName: 'rag_basics',
    vectors: embeddings,
    metadata: chunks.map(c => ({ text: c.text })),
  });

  console.log(`Stored ${embeddings.length} vectors in 'rag_basics' index`);
  return vectorStore;
}

// ─── TODO 5: Query for similar chunks ────────────────────────
export async function testQuery() {
  console.log('--- Step 5: Query ---');

  // Re-setup (in practice, you'd keep the store reference)
  const vectorStore = new LibSQLVector({ url: 'file:./rag-exercise.db' });

  const { embedding: queryEmbedding } = await embed({
    model: embeddingModel,
    value: 'How does memory work in Mastra?',
  });

  const results = await vectorStore.query({
    indexName: 'rag_basics',
    queryVector: queryEmbedding,
    topK: 2,
  });

  console.log('Query: "How does memory work in Mastra?"');
  results.forEach((r, i) => {
    console.log(`  Result ${i + 1} (score: ${r.score.toFixed(3)}):`);
    console.log(`    ${(r.metadata as any)?.text?.slice(0, 80)}...`);
  });
}

// ─── TODO 6: Complete pipeline in one function ───────────────
export async function testFullPipeline() {
  console.log('--- Full Pipeline ---');

  // 1. Document
  const doc = MDocument.fromText(`
    Mastra is an open-source TypeScript framework for building AI agents.
    It provides tools for creating agents, workflows, memory systems,
    and RAG pipelines. Agents can use tools, have memory, and produce
    structured output.

    Workflows in Mastra let you define step-by-step processes.
    Each step has an input schema and output schema. Steps can run
    in parallel, branch conditionally, or loop. Workflows support
    suspend and resume for human-in-the-loop patterns.

    Memory in Mastra gives agents the ability to remember conversations.
    It supports working memory, semantic recall, and observational memory.
    Multiple storage providers are available including LibSQL and PostgreSQL.

    RAG (Retrieval-Augmented Generation) enhances LLM outputs by
    incorporating relevant context from your own data sources.
    It uses chunking, embeddings, and vector databases to find
    relevant information for each query.
  `);

  // 2. Chunk
  const chunks = await doc.chunk({ strategy: 'recursive', size: 200, overlap: 20 });

  // 3. Embed
  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: chunks.map(c => c.text),
  });

  // 4. Store
  const store = new LibSQLVector({ url: 'file:./rag-pipeline.db' });
  await store.createIndex({ indexName: 'pipeline_test', dimension: 1536 });
  await store.upsert({
    indexName: 'pipeline_test',
    vectors: embeddings,
    metadata: chunks.map(c => ({ text: c.text })),
  });

  // 5. Query — two different questions
  const questions = [
    'What are workflows in Mastra?',
    'How does RAG work?',
  ];

  for (const question of questions) {
    const { embedding } = await embed({ model: embeddingModel, value: question });
    const results = await store.query({
      indexName: 'pipeline_test',
      queryVector: embedding,
      topK: 2,
    });

    console.log(`\nQ: "${question}"`);
    results.forEach((r, i) => {
      console.log(`  ${i + 1}. (${r.score.toFixed(3)}) ${(r.metadata as any)?.text?.slice(0, 70)}...`);
    });
  }
}

// ─── Run all tests ───────────────────────────────────────────
export async function runTest() {
  console.log('=== RAG Basics ===\n');

  await testChunking();
  console.log('\n');
  await testEmbeddings();
  console.log('\n');
  await testStorage();
  console.log('\n');
  await testQuery();
  console.log('\n');
  await testFullPipeline();
}
