/**
 * MODULE 34: Vector Databases — SOLUTION
 */

import { MDocument } from '@mastra/rag';
import { embedMany, embed } from 'ai';
import { ModelRouterEmbeddingModel } from '@mastra/core/llm';
import { LibSQLVector } from '@mastra/core/vector/libsql';

const embeddingModel = new ModelRouterEmbeddingModel('openai/text-embedding-3-small');
const store = new LibSQLVector({ url: 'file:./vector-db-exercise.db' });

const articles = [
  { text: 'AI agents can use tools to interact with external systems.', source: 'agents.md', category: 'agents' },
  { text: 'Workflows define step-by-step processes with schemas.', source: 'workflows.md', category: 'workflows' },
  { text: 'Memory allows agents to remember past conversations.', source: 'memory.md', category: 'memory' },
  { text: 'RAG retrieves relevant context before generating answers.', source: 'rag.md', category: 'rag' },
  { text: 'Streaming delivers tokens incrementally for real-time UIs.', source: 'streaming.md', category: 'streaming' },
];

// ─── TODO 1: Create a vector store and index ─────────────────
export async function testCreateIndex() {
  console.log('--- Create Index ---');
  await store.createIndex({ indexName: 'articles', dimension: 1536 });
  console.log('Created index "articles" with dimension 1536');
}

// ─── TODO 2: Upsert with rich metadata ───────────────────────
export async function testUpsertWithMetadata() {
  console.log('--- Upsert with Metadata ---');

  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: articles.map(a => a.text),
  });

  await store.upsert({
    indexName: 'articles',
    vectors: embeddings,
    metadata: articles.map(a => ({
      text: a.text,
      source: a.source,
      category: a.category,
      createdAt: new Date().toISOString(),
    })),
  });

  console.log(`Stored ${articles.length} vectors with metadata`);
}

// ─── TODO 3: Basic query ─────────────────────────────────────
export async function testBasicQuery() {
  console.log('--- Basic Query ---');

  const { embedding } = await embed({
    model: embeddingModel,
    value: 'How do I make an agent remember things?',
  });

  const results = await store.query({
    indexName: 'articles',
    queryVector: embedding,
    topK: 3,
  });

  console.log('Query: "How do I make an agent remember things?"');
  results.forEach((r, i) => {
    console.log(`  ${i + 1}. (${r.score.toFixed(3)}) [${(r.metadata as any)?.category}] ${(r.metadata as any)?.text}`);
  });
}

// ─── TODO 4: Query with metadata filter ──────────────────────
export async function testFilteredQuery() {
  console.log('--- Filtered Query ---');

  const { embedding } = await embed({
    model: embeddingModel,
    value: 'How do tools work?',
  });

  // Without filter
  const allResults = await store.query({
    indexName: 'articles',
    queryVector: embedding,
    topK: 3,
  });

  console.log('Without filter (all categories):');
  allResults.forEach((r, i) => {
    console.log(`  ${i + 1}. [${(r.metadata as any)?.category}] ${(r.metadata as any)?.text?.slice(0, 50)}...`);
  });

  // With filter — only agents category
  const filtered = await store.query({
    indexName: 'articles',
    queryVector: embedding,
    topK: 3,
    filter: { category: 'agents' },
  });

  console.log('\nWith filter (category: agents):');
  filtered.forEach((r, i) => {
    console.log(`  ${i + 1}. [${(r.metadata as any)?.category}] ${(r.metadata as any)?.text?.slice(0, 50)}...`);
  });
}

// ─── TODO 5: Upsert updates (not duplicates) ────────────────
export async function testUpsertUpdate() {
  console.log('--- Upsert Updates ---');

  const updatedText = 'RAG retrieves and ranks relevant context using vector similarity and re-ranking.';
  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: [updatedText],
  });

  await store.upsert({
    indexName: 'articles',
    vectors: embeddings,
    metadata: [{
      text: updatedText,
      source: 'rag.md',
      category: 'rag',
      version: '2.0',
      createdAt: new Date().toISOString(),
    }],
  });

  console.log('Upserted updated RAG article');

  const { embedding } = await embed({ model: embeddingModel, value: 'How does RAG work?' });
  const results = await store.query({
    indexName: 'articles',
    queryVector: embedding,
    topK: 2,
    filter: { category: 'rag' },
  });

  console.log('Query results for RAG:');
  results.forEach((r, i) => {
    console.log(`  ${i + 1}. ${(r.metadata as any)?.text?.slice(0, 70)}... (v${(r.metadata as any)?.version || '1.0'})`);
  });
}

// ─── TODO 6: Delete vectors by filter ────────────────────────
export async function testDeleteByFilter() {
  console.log('--- Delete by Filter ---');

  // Query before deletion
  const { embedding } = await embed({ model: embeddingModel, value: 'streaming tokens' });
  const before = await store.query({ indexName: 'articles', queryVector: embedding, topK: 5 });
  console.log(`Before delete: ${before.length} results`);
  before.forEach((r, i) => console.log(`  ${i + 1}. [${(r.metadata as any)?.source}] ${(r.metadata as any)?.text?.slice(0, 40)}...`));

  // Delete streaming articles
  await store.deleteVectors({
    indexName: 'articles',
    filter: { source: 'streaming.md' },
  });

  // Query after deletion
  const after = await store.query({ indexName: 'articles', queryVector: embedding, topK: 5 });
  console.log(`\nAfter delete: ${after.length} results`);
  after.forEach((r, i) => console.log(`  ${i + 1}. [${(r.metadata as any)?.source}] ${(r.metadata as any)?.text?.slice(0, 40)}...`));
}

// ─── TODO 7: Multi-document pipeline ─────────────────────────
export async function testMultiDocument() {
  console.log('--- Multi-Document Pipeline ---');

  const multiStore = new LibSQLVector({ url: 'file:./multi-doc.db' });
  await multiStore.createIndex({ indexName: 'multi_docs', dimension: 1536 });

  // Document 1: plain text
  const doc1 = MDocument.fromText('TypeScript is a strongly typed programming language built on JavaScript. It adds type safety and better tooling.');
  const chunks1 = await doc1.chunk({ strategy: 'recursive', size: 100, overlap: 10 });

  // Document 2: markdown
  const doc2 = MDocument.fromMarkdown('# Python\nPython is a versatile language used for web development, data science, and AI. It emphasizes readability.');
  const chunks2 = await doc2.chunk({ strategy: 'markdown', size: 100 });

  const allChunks = [...chunks1, ...chunks2];
  const sources = [...chunks1.map(() => 'typescript.txt'), ...chunks2.map(() => 'python.md')];

  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: allChunks.map(c => c.text),
  });

  await multiStore.upsert({
    indexName: 'multi_docs',
    vectors: embeddings,
    metadata: allChunks.map((c, i) => ({ text: c.text, source: sources[i] })),
  });

  console.log(`Stored ${allChunks.length} chunks from 2 documents`);

  // Query
  const { embedding } = await embed({ model: embeddingModel, value: 'Which language is good for AI?' });
  const results = await multiStore.query({ indexName: 'multi_docs', queryVector: embedding, topK: 3 });

  console.log('\nQuery: "Which language is good for AI?"');
  results.forEach((r, i) => {
    console.log(`  ${i + 1}. (${r.score.toFixed(3)}) [${(r.metadata as any)?.source}] ${(r.metadata as any)?.text?.slice(0, 60)}...`);
  });
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
