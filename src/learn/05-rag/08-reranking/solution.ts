/**
 * MODULE 38: Re-ranking — SOLUTION
 */

import { rerankWithScorer as rerank, MastraAgentRelevanceScorer } from '@mastra/rag';
import { embedMany, embed } from 'ai';
import { ModelRouterEmbeddingModel } from '@mastra/core/llm';
import { LibSQLVector } from '@mastra/core/vector/libsql';

const embeddingModel = new ModelRouterEmbeddingModel('openai/text-embedding-3-small');

const documents = [
  'TypeScript 5.0 introduced decorators and const type parameters for safer code patterns.',
  'TypeScript improves JavaScript with static types, interfaces, and better tooling.',
  'JavaScript is a dynamically typed language that runs in web browsers.',
  'Python type hints were introduced in PEP 484 to improve code readability.',
  'The TypeScript compiler can catch type errors before runtime.',
  'React components can be written in TypeScript for better prop validation.',
  'Static analysis tools like ESLint help find JavaScript bugs early.',
  'TypeScript generics enable writing reusable, type-safe functions and classes.',
  'Rust ownership model provides memory safety at compile time without garbage collection.',
  'TypeScript declaration files (.d.ts) provide types for JavaScript libraries.',
];

let store: LibSQLVector;
const scorer = new MastraAgentRelevanceScorer('reranker', 'anthropic/claude-sonnet-4-5');

// ─── TODO 1: Set up the dataset ──────────────────────────────
async function setupDataset(): Promise<LibSQLVector> {
  store = new LibSQLVector({ url: 'file:./reranking.db' });
  await store.createIndex({ indexName: 'rerank_docs', dimension: 1536 });

  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: documents,
  });

  await store.upsert({
    indexName: 'rerank_docs',
    vectors: embeddings,
    metadata: documents.map(text => ({ text })),
  });

  console.log(`Stored ${documents.length} documents`);
  return store;
}

async function getResults(query: string, topK: number = 5) {
  const { embedding } = await embed({ model: embeddingModel, value: query });
  return store.query({
    indexName: 'rerank_docs',
    queryVector: embedding,
    topK,
  });
}

function printResults(results: { score: number; metadata: any }[], label: string) {
  console.log(`  ${label}:`);
  results.forEach((r, i) => {
    console.log(`    ${i + 1}. (${r.score.toFixed(3)}) ${(r.metadata as any)?.text?.slice(0, 70)}...`);
  });
}

// ─── TODO 2: Query without re-ranking ────────────────────────
export async function testWithoutReranking() {
  console.log('--- Without Re-ranking ---');
  await setupDataset();

  const results = await getResults('What are the key features of TypeScript?');
  printResults(results, 'Vector search results');
}

// ─── TODO 3: Re-rank with balanced weights ──────────────────
export async function testBalancedReranking() {
  console.log('--- Balanced Re-ranking ---');

  const query = 'What are the key features of TypeScript?';
  const initial = await getResults(query);

  console.log('Before re-ranking:');
  printResults(initial, 'Vector search');

  const reranked = await rerank({
    results: initial,
    query,
    scorer,
    options: {
      weights: { semantic: 0.5, vector: 0.3, position: 0.2 },
      topK: 5,
    },
  });

  console.log('\nAfter re-ranking (semantic=0.5, vector=0.3, position=0.2):');
  printResults(reranked, 'Re-ranked');
}

// ─── TODO 4: Experiment with weight configurations ──────────
export async function testWeightConfigs() {
  console.log('--- Weight Configurations ---');

  const query = 'What are the key features of TypeScript?';
  const initial = await getResults(query, 7);

  const configs = [
    { name: 'Semantic-heavy', weights: { semantic: 0.8, vector: 0.1, position: 0.1 } },
    { name: 'Vector-heavy', weights: { semantic: 0.2, vector: 0.7, position: 0.1 } },
    { name: 'Position-heavy', weights: { semantic: 0.2, vector: 0.2, position: 0.6 } },
  ];

  for (const config of configs) {
    const reranked = await rerank({
      results: initial,
      query,
      scorer,
      options: { weights: config.weights, topK: 3 },
    });

    console.log(`\n${config.name} (${JSON.stringify(config.weights)}):`);
    reranked.forEach((r, i) => {
      console.log(`  ${i + 1}. (${r.score.toFixed(3)}) ${(r.metadata as any)?.text?.slice(0, 60)}...`);
    });
  }
}

// ─── TODO 5: Re-rank a larger result set ─────────────────────
export async function testLargeToSmall() {
  console.log('--- Large → Small Re-ranking ---');

  const query = 'TypeScript type safety features';

  // Wide net: topK=10
  const initial = await getResults(query, 10);
  console.log(`Vector search: ${initial.length} results`);
  printResults(initial, 'All 10');

  // Refined: re-rank to topK=3
  const reranked = await rerank({
    results: initial,
    query,
    scorer,
    options: {
      weights: { semantic: 0.6, vector: 0.3, position: 0.1 },
      topK: 3,
    },
  });

  console.log(`\nRe-ranked to top 3:`);
  printResults(reranked, 'Best 3');
}

// ─── TODO 6: Compare with an ambiguous query ────────────────
export async function testAmbiguousQuery() {
  console.log('--- Ambiguous Query ---');

  const query = 'How do types prevent bugs at compile time?';

  const initial = await getResults(query, 7);
  console.log('Vector search (ambiguous — matches TS, Python, Rust, ESLint):');
  printResults(initial, 'Before re-ranking');

  const reranked = await rerank({
    results: initial,
    query,
    scorer,
    options: {
      weights: { semantic: 0.7, vector: 0.2, position: 0.1 },
      topK: 3,
    },
  });

  console.log('\nAfter re-ranking (semantic-heavy):');
  printResults(reranked, 'Re-ranked');
  console.log('\n  Note: Re-ranking should prefer results that specifically discuss compile-time type checking');
}

// ─── Run all tests ───────────────────────────────────────────
export async function runTest() {
  console.log('=== Re-ranking ===\n');

  await testWithoutReranking();
  console.log('\n');
  await testBalancedReranking();
  console.log('\n');
  await testWeightConfigs();
  console.log('\n');
  await testLargeToSmall();
  console.log('\n');
  await testAmbiguousQuery();
}
