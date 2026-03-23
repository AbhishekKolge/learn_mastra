/**
 * ============================================================
 *  MODULE 35: Retrieval & Filtering
 * ============================================================
 *
 *  THEORY
 *  ------
 *  Storing embeddings is step 1. RETRIEVING the right chunks
 *  for a given query is step 2 — and it's where RAG quality
 *  is made or broken.
 *
 *  HOW RETRIEVAL WORKS:
 *    1. User asks a question
 *    2. The question is embedded (same model as stored docs!)
 *    3. Vector database finds the most similar stored vectors
 *    4. Similar chunks are returned with scores and metadata
 *    5. Chunks are injected into the LLM prompt as context
 *
 *  BASIC QUERY:
 *    const results = await store.query({
 *      indexName: 'docs',
 *      queryVector: embedding,
 *      topK: 5,      // max results to return
 *    })
 *
 *  RESULT STRUCTURE:
 *    Each result has:
 *      { score: number, metadata: { text: string, ... } }
 *
 *    score: 0 to 1 (higher = more similar)
 *    metadata: whatever you stored with the embedding
 *
 *  topK:
 *    The maximum number of results. Higher topK = more context
 *    but also more noise. Typical values: 3-10.
 *
 *  METADATA FILTERING:
 *    You can narrow search with metadata filters using a
 *    unified MongoDB-style query syntax across ALL vector stores.
 *
 *    COMPARISON OPERATORS:
 *      $eq    → equals (default, can be omitted)
 *      $ne    → not equals
 *      $gt    → greater than
 *      $gte   → greater than or equal
 *      $lt    → less than
 *      $lte   → less than or equal
 *      $in    → value in array
 *      $nin   → value not in array
 *
 *    LOGICAL OPERATORS:
 *      $and   → all conditions must match
 *      $or    → any condition must match
 *
 *    EXAMPLES:
 *      // Simple equality (shorthand)
 *      filter: { category: 'tech' }
 *
 *      // Numeric comparison
 *      filter: { price: { $gt: 100 } }
 *
 *      // Multiple conditions (implicit $and)
 *      filter: { category: 'tech', year: { $gte: 2024 } }
 *
 *      // Array membership
 *      filter: { tags: { $in: ['ai', 'ml'] } }
 *
 *      // Explicit logical operators
 *      filter: {
 *        $or: [
 *          { category: 'agents' },
 *          { category: 'workflows' },
 *        ],
 *        $and: [
 *          { year: { $gte: 2024 } },
 *          { year: { $lte: 2025 } },
 *        ],
 *      }
 *
 *  HYBRID SEARCH:
 *    Combining vector similarity with metadata filters is
 *    sometimes called "hybrid vector search" — you get the
 *    best of both semantic search and structured filtering.
 *
 *  EXERCISE
 *  --------
 *  Build a rich dataset, then practice different retrieval
 *  patterns: basic, filtered, and combined.
 * ============================================================
 */

import { embedMany, embed } from 'ai';
import { ModelRouterEmbeddingModel } from '@mastra/core/llm';
import { LibSQLVector } from '@mastra/core/vector/libsql';

const embeddingModel = new ModelRouterEmbeddingModel('openai/text-embedding-3-small');

// ─── Sample dataset ──────────────────────────────────────────
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

// ─── TODO 1: Set up the dataset ──────────────────────────────
// Create a store, index, embed all documents, and store them.
// Return the store for subsequent tests.
//
// Use metadata: { text, category, difficulty, year }

async function setupDataset(): Promise<LibSQLVector> {
  // TODO: implement
  console.log('TODO: implement setup');
  return undefined as any;
}

// ─── TODO 2: Basic semantic search ──────────────────────────
// Query: 'What programming languages are good for beginners?'
// Use topK: 3. Print results with scores.

export async function testBasicSearch() {
  console.log('--- Basic Semantic Search ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 3: Filter by category ──────────────────────────────
// Same query but filtered to only 'languages' category.
// Compare results with the unfiltered version.

export async function testCategoryFilter() {
  console.log('--- Category Filter ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 4: Numeric comparison filter ──────────────────────
// Query: 'modern development tools'
// Filter: year >= 2024
//
// filter: { year: { $gte: 2024 } }

export async function testNumericFilter() {
  console.log('--- Numeric Filter ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 5: Combined filters ────────────────────────────────
// Query: 'web development'
// Filter: category is 'frameworks' AND difficulty is NOT 'advanced'
//
// filter: { category: 'frameworks', difficulty: { $ne: 'advanced' } }

export async function testCombinedFilters() {
  console.log('--- Combined Filters ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 6: $or filter ─────────────────────────────────────
// Query: 'developer productivity'
// Filter: category is 'tools' OR category is 'devops'
//
// filter: {
//   $or: [{ category: 'tools' }, { category: 'devops' }],
// }

export async function testOrFilter() {
  console.log('--- $or Filter ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 7: $in filter ─────────────────────────────────────
// Query: 'easy to learn technologies'
// Filter: difficulty is 'beginner' or 'intermediate'
//
// filter: { difficulty: { $in: ['beginner', 'intermediate'] } }

export async function testInFilter() {
  console.log('--- $in Filter ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 8: Experiment with topK ───────────────────────────
// Run the same query with topK: 1, 3, 5, 10.
// Observe how more results = more context but also lower-scoring results.

export async function testTopK() {
  console.log('--- topK Comparison ---');
  // TODO: implement
  console.log('TODO: implement');
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
