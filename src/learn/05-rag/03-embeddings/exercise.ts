/**
 * ============================================================
 *  MODULE 33: Embeddings
 * ============================================================
 *
 *  THEORY
 *  ------
 *  Embeddings are the bridge between human text and vector math.
 *  They convert text into arrays of numbers (vectors) where
 *  SIMILAR MEANINGS are CLOSE TOGETHER in the vector space.
 *
 *  "dog" → [0.12, -0.34, 0.56, ...]     (1536 numbers)
 *  "puppy" → [0.13, -0.33, 0.55, ...]   (very close to "dog"!)
 *  "quantum physics" → [-0.8, 0.2, ...]  (far from "dog")
 *
 *  This is what makes SEMANTIC SEARCH possible — instead of
 *  matching keywords, you find text with SIMILAR MEANING.
 *
 *  TWO FUNCTIONS:
 *    embedMany() — embed multiple texts at once (for documents)
 *    embed()     — embed a single text (for queries)
 *
 *    import { embedMany, embed } from 'ai'
 *
 *  MODEL ROUTER:
 *    Mastra provides ModelRouterEmbeddingModel to use any provider
 *    with a simple 'provider/model' string:
 *
 *    import { ModelRouterEmbeddingModel } from '@mastra/core/llm'
 *    const model = new ModelRouterEmbeddingModel('openai/text-embedding-3-small')
 *
 *    Supported providers: OpenAI, Google, Cohere
 *    API keys are auto-detected from environment variables.
 *
 *  COMMON MODELS:
 *    openai/text-embedding-3-small  → 1536 dimensions (default)
 *    openai/text-embedding-3-large  → 3072 dimensions
 *    google/gemini-embedding-001    → 768 dimensions
 *
 *  DIMENSIONS:
 *    Each model outputs vectors with a fixed number of dimensions.
 *    Some models support REDUCING dimensions to save storage:
 *
 *    const { embeddings } = await embedMany({
 *      model: new ModelRouterEmbeddingModel('openai/text-embedding-3-small'),
 *      values: ['text1', 'text2'],
 *      options: { dimensions: 256 },  // reduce from 1536 to 256
 *    })
 *
 *    Fewer dimensions = less storage, faster search, slightly less accuracy.
 *
 *  CRITICAL RULE:
 *    The embedding model used for STORING must match the model
 *    used for QUERYING. If you embed documents with text-embedding-3-small,
 *    you must embed queries with text-embedding-3-small too.
 *    Mixing models produces meaningless similarity scores.
 *
 *  VECTOR DATABASE COMPATIBILITY:
 *    The index dimension must match your embedding model's output.
 *    createIndex({ dimension: 1536 }) for text-embedding-3-small.
 *    If they don't match → errors or data corruption.
 *
 *  COST CONSIDERATIONS:
 *    Embedding API calls cost money (much less than LLM calls).
 *    embedMany() batches automatically — one API call for many texts.
 *    embed() is one call per text — use for single queries.
 *
 *  EXERCISE
 *  --------
 *  Explore embedding generation, dimensions, and similarity.
 * ============================================================
 */

import { embedMany, embed } from 'ai';
import { ModelRouterEmbeddingModel } from '@mastra/core/llm';

const embeddingModel = new ModelRouterEmbeddingModel('openai/text-embedding-3-small');

// ─── TODO 1: Embed multiple texts ───────────────────────────
// Use embedMany() to embed an array of sentences.
// Print the count, dimension, and first few values.
//
// const { embeddings } = await embedMany({
//   model: embeddingModel,
//   values: [
//     'The cat sat on the mat',
//     'A kitten rested on the rug',
//     'Quantum physics explores subatomic particles',
//   ],
// })

export async function testEmbedMany() {
  console.log('--- embedMany() ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 2: Embed a single query ───────────────────────────
// Use embed() for a single text (typical for search queries).
//
// const { embedding } = await embed({
//   model: embeddingModel,
//   value: 'How do cats behave?',
// })

export async function testEmbedSingle() {
  console.log('--- embed() ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 3: Measure similarity ──────────────────────────────
// Embed 3 texts: two similar, one different.
// Calculate cosine similarity between all pairs.
// The similar pair should have a higher score.
//
// Cosine similarity formula:
//   function cosineSimilarity(a: number[], b: number[]): number {
//     let dot = 0, magA = 0, magB = 0;
//     for (let i = 0; i < a.length; i++) {
//       dot += a[i] * b[i];
//       magA += a[i] * a[i];
//       magB += b[i] * b[i];
//     }
//     return dot / (Math.sqrt(magA) * Math.sqrt(magB));
//   }
//
// Texts:
//   A: 'Dogs are loyal companions that love their owners'
//   B: 'Puppies are faithful pets devoted to their families'
//   C: 'The stock market crashed significantly today'
//
// Expected: similarity(A, B) >> similarity(A, C)

export async function testSimilarity() {
  console.log('--- Cosine Similarity ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 4: Custom dimensions ───────────────────────────────
// Embed the same text with default (1536) and reduced (256) dimensions.
// Compare the vector sizes.
//
// const { embeddings: full } = await embedMany({
//   model: embeddingModel,
//   values: ['Hello world'],
// })
//
// const { embeddings: reduced } = await embedMany({
//   model: embeddingModel,
//   values: ['Hello world'],
//   options: { dimensions: 256 },
// })
//
// console.log('Full:', full[0].length, 'Reduced:', reduced[0].length)

export async function testDimensions() {
  console.log('--- Custom Dimensions ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 5: Batch efficiency ────────────────────────────────
// Compare the time of embedding 10 texts with:
//   1. One embedMany() call with 10 values (batched)
//   2. Ten separate embed() calls (sequential)
// The batched version should be significantly faster.

export async function testBatchEfficiency() {
  console.log('--- Batch Efficiency ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 6: Semantic clusters ───────────────────────────────
// Embed 6 texts from 2 topics (3 each).
// Compute pairwise similarity to show that texts in the
// same topic cluster together.
//
// Topic A (cooking):
//   'How to make a perfect sourdough bread'
//   'The best pasta sauce recipe with fresh tomatoes'
//   'Kitchen tips for beginner chefs'
//
// Topic B (programming):
//   'Introduction to TypeScript generics'
//   'How to write clean JavaScript functions'
//   'Best practices for React component design'

export async function testSemanticClusters() {
  console.log('--- Semantic Clusters ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── Run all tests ───────────────────────────────────────────
export async function runTest() {
  console.log('=== Embeddings ===\n');

  await testEmbedMany();
  console.log('\n');
  await testEmbedSingle();
  console.log('\n');
  await testSimilarity();
  console.log('\n');
  await testDimensions();
  console.log('\n');
  await testBatchEfficiency();
  console.log('\n');
  await testSemanticClusters();
}
