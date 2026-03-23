/**
 * ============================================================
 *  MODULE 31: RAG Basics
 * ============================================================
 *
 *  THEORY
 *  ------
 *  LLMs are powerful, but they only know what's in their training
 *  data. When you need an LLM to answer questions about YOUR data
 *  — company docs, personal notes, product catalogs — it needs
 *  context. That's what RAG does.
 *
 *  RAG = Retrieval-Augmented Generation
 *    1. RETRIEVAL: Find relevant chunks of YOUR data
 *    2. AUGMENTED: Inject those chunks into the prompt as context
 *    3. GENERATION: LLM generates an answer grounded in your data
 *
 *  Think of it like an open-book exam:
 *    Without RAG: LLM answers from memory (training data only)
 *    With RAG:    LLM looks up the relevant pages first, then answers
 *
 *  THE RAG PIPELINE (5 steps):
 *
 *    1. DOCUMENT → Create an MDocument from text, HTML, markdown, or JSON
 *       const doc = MDocument.fromText('Your content here...')
 *
 *    2. CHUNK → Split into small, meaningful pieces
 *       const chunks = await doc.chunk({ strategy: 'recursive', size: 512 })
 *
 *    3. EMBED → Convert chunks to numerical vectors (embeddings)
 *       const { embeddings } = await embedMany({
 *         model: new ModelRouterEmbeddingModel('openai/text-embedding-3-small'),
 *         values: chunks.map(c => c.text),
 *       })
 *
 *    4. STORE → Save embeddings in a vector database
 *       await vectorStore.upsert({ indexName: 'docs', vectors: embeddings })
 *
 *    5. QUERY → Find similar chunks for a user's question
 *       const results = await vectorStore.query({
 *         indexName: 'docs', queryVector: queryEmbedding, topK: 3,
 *       })
 *
 *  WHY CHUNKS?
 *    LLMs have limited context windows. A 100-page document won't
 *    fit. Even if it did, the LLM performs better with focused,
 *    relevant snippets than with an entire document.
 *
 *  WHY EMBEDDINGS?
 *    Text similarity is hard for computers. "dog" and "puppy" are
 *    similar to humans but different strings to a computer.
 *    Embeddings convert text to vectors (arrays of numbers) where
 *    similar meanings are close together in vector space.
 *    This enables SEMANTIC search — finding text by meaning.
 *
 *  WHY VECTOR DATABASES?
 *    Regular databases search by exact match or keywords.
 *    Vector databases search by SIMILARITY — finding the vectors
 *    closest to a query vector. This is what enables semantic search.
 *
 *  MDocument FORMATS:
 *    MDocument.fromText('plain text')
 *    MDocument.fromHTML('<html>...</html>')
 *    MDocument.fromMarkdown('# Heading\n...')
 *    MDocument.fromJSON('{"key": "value"}')
 *
 *  PACKAGES NEEDED:
 *    pnpm add @mastra/rag ai
 *    (You already have @mastra/core and @mastra/libsql)
 *
 *  EXERCISE
 *  --------
 *  Build the complete RAG pipeline from scratch:
 *  document → chunks → embeddings → store → query.
 * ============================================================
 */

import { MDocument } from '@mastra/rag';
import { embedMany, embed } from 'ai';
import { ModelRouterEmbeddingModel } from '@mastra/core/llm';
import { LibSQLVector } from '@mastra/core/vector/libsql';

// ─── TODO 1: Create a document ───────────────────────────────
// Create an MDocument from text. Use a multi-paragraph string
// so we have enough content to chunk meaningfully.
//
// const doc = MDocument.fromText(`
//   Mastra is an open-source TypeScript framework for building AI agents.
//   It provides tools for creating agents, workflows, memory systems,
//   and RAG pipelines. Agents can use tools, have memory, and produce
//   structured output.
//
//   Workflows in Mastra let you define step-by-step processes.
//   Each step has an input schema and output schema. Steps can run
//   in parallel, branch conditionally, or loop. Workflows support
//   suspend and resume for human-in-the-loop patterns.
//
//   Memory in Mastra gives agents the ability to remember conversations.
//   It supports working memory, semantic recall, and observational memory.
//   Multiple storage providers are available including LibSQL and PostgreSQL.
//
//   RAG (Retrieval-Augmented Generation) enhances LLM outputs by
//   incorporating relevant context from your own data sources.
//   It uses chunking, embeddings, and vector databases to find
//   relevant information for each query.
// `)

const doc = undefined as any; // ← replace

// ─── TODO 2: Chunk the document ──────────────────────────────
// Split the document into chunks using the 'recursive' strategy.
//
// const chunks = await doc.chunk({
//   strategy: 'recursive',
//   size: 200,
//   overlap: 20,
// })
// console.log(`Created ${chunks.length} chunks`)
// chunks.forEach((c, i) => console.log(`  Chunk ${i}: ${c.text.slice(0, 50)}...`))

export async function testChunking() {
  console.log('--- Step 2: Chunking ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 3: Generate embeddings ─────────────────────────────
// Convert chunks to embeddings using ModelRouterEmbeddingModel.
//
// const { embeddings } = await embedMany({
//   model: new ModelRouterEmbeddingModel('openai/text-embedding-3-small'),
//   values: chunks.map(c => c.text),
// })
// console.log(`Generated ${embeddings.length} embeddings`)
// console.log(`Embedding dimension: ${embeddings[0].length}`)

export async function testEmbeddings() {
  console.log('--- Step 3: Embeddings ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 4: Store in a vector database ──────────────────────
// Use LibSQLVector (you already have @mastra/libsql installed).
//
// const vectorStore = new LibSQLVector({
//   url: 'file:./rag-exercise.db',
// })
//
// await vectorStore.createIndex({
//   indexName: 'rag_basics',
//   dimension: 1536,  // matches text-embedding-3-small
// })
//
// await vectorStore.upsert({
//   indexName: 'rag_basics',
//   vectors: embeddings,
//   metadata: chunks.map(c => ({ text: c.text })),
// })

export async function testStorage() {
  console.log('--- Step 4: Storage ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 5: Query for similar chunks ────────────────────────
// Embed a query string and find the most similar chunks.
//
// const { embedding: queryEmbedding } = await embed({
//   model: new ModelRouterEmbeddingModel('openai/text-embedding-3-small'),
//   value: 'How does memory work in Mastra?',
// })
//
// const results = await vectorStore.query({
//   indexName: 'rag_basics',
//   queryVector: queryEmbedding,
//   topK: 2,
// })
//
// results.forEach((r, i) => {
//   console.log(`Result ${i + 1} (score: ${r.score.toFixed(3)}):`)
//   console.log(`  ${r.metadata?.text}`)
// })

export async function testQuery() {
  console.log('--- Step 5: Query ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 6: Complete pipeline in one function ───────────────
// Combine all 5 steps into a single end-to-end pipeline.
// Then query with two different questions to see how
// different queries retrieve different chunks.
//
// Question 1: 'What are workflows in Mastra?'
// Question 2: 'How does RAG work?'

export async function testFullPipeline() {
  console.log('--- Full Pipeline ---');
  // TODO: implement
  console.log('TODO: implement');
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
