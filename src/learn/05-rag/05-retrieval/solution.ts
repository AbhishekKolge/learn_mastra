/**
 * MODULE 35: Retrieval & Filtering — SOLUTION
 */

import { embedMany, embed } from 'ai';
import { ModelRouterEmbeddingModel } from '@mastra/core/llm';
import { LibSQLVector } from '@mastra/core/vector/libsql';

const embeddingModel = new ModelRouterEmbeddingModel('openai/text-embedding-3-small');

const documents = [
  { text: 'TypeScript adds static typing to JavaScript for safer code.', category: 'languages', difficulty: 'beginner', year: 2024 },
  { text: 'Rust provides memory safety without garbage collection.', category: 'languages', difficulty: 'advanced', year: 2024 },
  { text: 'Python is widely used for data science and machine learning.', category: 'languages', difficulty: 'beginner', year: 2023 },
  { text: 'React is a JavaScript library for building user interfaces.', category: 'frameworks', difficulty: 'intermediate', year: 2024 },
  { text: 'Next.js enables server-side rendering for React apps.', category: 'frameworks', difficulty: 'intermediate', year: 2024 },
  { text: 'Express.js is a minimal Node.js web framework.', category: 'frameworks', difficulty: 'beginner', year: 2023 },
  { text: 'Docker containers package applications with their dependencies.', category: 'devops', difficulty: 'intermediate', year: 2024 },
  { text: 'Kubernetes orchestrates container deployment at scale.', category: 'devops', difficulty: 'advanced', year: 2024 },
  { text: 'Git is the most popular version control system.', category: 'tools', difficulty: 'beginner', year: 2023 },
  { text: 'VS Code is a lightweight but powerful code editor.', category: 'tools', difficulty: 'beginner', year: 2023 },
];

let store: LibSQLVector;

async function setupDataset(): Promise<LibSQLVector> {
  store = new LibSQLVector({ url: 'file:./retrieval-exercise.db' });
  await store.createIndex({ indexName: 'tech_docs', dimension: 1536 });

  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: documents.map(d => d.text),
  });

  await store.upsert({
    indexName: 'tech_docs',
    vectors: embeddings,
    metadata: documents.map(d => ({
      text: d.text,
      category: d.category,
      difficulty: d.difficulty,
      year: d.year,
    })),
  });

  console.log(`Dataset: ${documents.length} documents stored`);
  return store;
}

async function queryAndPrint(query: string, options: { topK?: number; filter?: any } = {}) {
  const { embedding } = await embed({ model: embeddingModel, value: query });
  const results = await store.query({
    indexName: 'tech_docs',
    queryVector: embedding,
    topK: options.topK ?? 3,
    ...(options.filter ? { filter: options.filter } : {}),
  });

  console.log(`  Query: "${query}" (topK: ${options.topK ?? 3}${options.filter ? ', filtered' : ''})`);
  results.forEach((r, i) => {
    const m = r.metadata as any;
    console.log(`    ${i + 1}. (${r.score.toFixed(3)}) [${m?.category}/${m?.difficulty}/${m?.year}] ${m?.text}`);
  });
  return results;
}

// ─── TODO 2: Basic semantic search ──────────────────────────
export async function testBasicSearch() {
  console.log('--- Basic Semantic Search ---');
  await setupDataset();
  await queryAndPrint('What programming languages are good for beginners?');
}

// ─── TODO 3: Filter by category ──────────────────────────────
export async function testCategoryFilter() {
  console.log('--- Category Filter ---');

  console.log('Without filter:');
  await queryAndPrint('What programming languages are good for beginners?');

  console.log('\nWith filter (category: languages):');
  await queryAndPrint('What programming languages are good for beginners?', {
    filter: { category: 'languages' },
  });
}

// ─── TODO 4: Numeric comparison filter ──────────────────────
export async function testNumericFilter() {
  console.log('--- Numeric Filter ---');
  await queryAndPrint('modern development tools', {
    filter: { year: { $gte: 2024 } },
  });
}

// ─── TODO 5: Combined filters ────────────────────────────────
export async function testCombinedFilters() {
  console.log('--- Combined Filters ---');
  await queryAndPrint('web development', {
    filter: { category: 'frameworks', difficulty: { $ne: 'advanced' } },
  });
}

// ─── TODO 6: $or filter ─────────────────────────────────────
export async function testOrFilter() {
  console.log('--- $or Filter ---');
  await queryAndPrint('developer productivity', {
    filter: {
      $or: [{ category: 'tools' }, { category: 'devops' }],
    },
  });
}

// ─── TODO 7: $in filter ─────────────────────────────────────
export async function testInFilter() {
  console.log('--- $in Filter ---');
  await queryAndPrint('easy to learn technologies', {
    filter: { difficulty: { $in: ['beginner', 'intermediate'] } },
  });
}

// ─── TODO 8: Experiment with topK ───────────────────────────
export async function testTopK() {
  console.log('--- topK Comparison ---');

  const query = 'programming and development';
  const { embedding } = await embed({ model: embeddingModel, value: query });

  for (const topK of [1, 3, 5, 10]) {
    const results = await store.query({
      indexName: 'tech_docs',
      queryVector: embedding,
      topK,
    });

    const scores = results.map(r => r.score.toFixed(3));
    const minScore = results.length > 0 ? Math.min(...results.map(r => r.score)).toFixed(3) : 'N/A';
    console.log(`  topK=${topK.toString().padEnd(2)} → ${results.length} results, scores: [${scores.join(', ')}], lowest: ${minScore}`);
  }

  console.log('\n  Note: Higher topK gives more results but lower-scoring ones may be less relevant');
}

// ─── Run all tests ───────────────────────────────────────────
export async function runTest() {
  console.log('=== Retrieval & Filtering ===\n');

  await testBasicSearch();
  console.log('\n');
  await testCategoryFilter();
  console.log('\n');
  await testNumericFilter();
  console.log('\n');
  await testCombinedFilters();
  console.log('\n');
  await testOrFilter();
  console.log('\n');
  await testInFilter();
  console.log('\n');
  await testTopK();
}
