/**
 * MODULE 33: Embeddings — SOLUTION
 */

import { embedMany, embed } from 'ai';
import { ModelRouterEmbeddingModel } from '@mastra/core/llm';

const embeddingModel = new ModelRouterEmbeddingModel('openai/text-embedding-3-small');

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0, magA = 0, magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

// ─── TODO 1: Embed multiple texts ───────────────────────────
export async function testEmbedMany() {
  console.log('--- embedMany() ---');

  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: [
      'The cat sat on the mat',
      'A kitten rested on the rug',
      'Quantum physics explores subatomic particles',
    ],
  });

  console.log(`Embedded ${embeddings.length} texts`);
  console.log(`Dimension: ${embeddings[0].length}`);
  console.log(`First 5 values: [${embeddings[0].slice(0, 5).map(v => v.toFixed(4)).join(', ')}...]`);
}

// ─── TODO 2: Embed a single query ───────────────────────────
export async function testEmbedSingle() {
  console.log('--- embed() ---');

  const { embedding } = await embed({
    model: embeddingModel,
    value: 'How do cats behave?',
  });

  console.log(`Dimension: ${embedding.length}`);
  console.log(`First 5 values: [${embedding.slice(0, 5).map(v => v.toFixed(4)).join(', ')}...]`);
}

// ─── TODO 3: Measure similarity ──────────────────────────────
export async function testSimilarity() {
  console.log('--- Cosine Similarity ---');

  const texts = [
    'Dogs are loyal companions that love their owners',      // A
    'Puppies are faithful pets devoted to their families',   // B
    'The stock market crashed significantly today',          // C
  ];

  const { embeddings } = await embedMany({ model: embeddingModel, values: texts });

  const simAB = cosineSimilarity(embeddings[0], embeddings[1]);
  const simAC = cosineSimilarity(embeddings[0], embeddings[2]);
  const simBC = cosineSimilarity(embeddings[1], embeddings[2]);

  console.log(`  A↔B (dogs & puppies): ${simAB.toFixed(4)}`);
  console.log(`  A↔C (dogs & stocks):  ${simAC.toFixed(4)}`);
  console.log(`  B↔C (puppies & stocks): ${simBC.toFixed(4)}`);
  console.log(`\n  As expected: A↔B (${simAB.toFixed(2)}) >> A↔C (${simAC.toFixed(2)})`);
}

// ─── TODO 4: Custom dimensions ───────────────────────────────
export async function testDimensions() {
  console.log('--- Custom Dimensions ---');

  const { embeddings: full } = await embedMany({
    model: embeddingModel,
    values: ['Hello world'],
  });

  const { embeddings: reduced } = await embedMany({
    model: embeddingModel,
    values: ['Hello world'],
    options: { dimensions: 256 },
  });

  console.log(`Full dimension: ${full[0].length}`);
  console.log(`Reduced dimension: ${reduced[0].length}`);
  console.log(`Storage savings: ${((1 - reduced[0].length / full[0].length) * 100).toFixed(0)}%`);
}

// ─── TODO 5: Batch efficiency ────────────────────────────────
export async function testBatchEfficiency() {
  console.log('--- Batch Efficiency ---');

  const texts = Array.from({ length: 10 }, (_, i) => `This is test sentence number ${i + 1}`);

  // Batched: one call
  const batchStart = Date.now();
  await embedMany({ model: embeddingModel, values: texts });
  const batchTime = Date.now() - batchStart;

  // Sequential: 10 calls
  const seqStart = Date.now();
  for (const text of texts) {
    await embed({ model: embeddingModel, value: text });
  }
  const seqTime = Date.now() - seqStart;

  console.log(`Batched (1 call):     ${batchTime}ms`);
  console.log(`Sequential (10 calls): ${seqTime}ms`);
  console.log(`Speedup: ${(seqTime / batchTime).toFixed(1)}x`);
}

// ─── TODO 6: Semantic clusters ───────────────────────────────
export async function testSemanticClusters() {
  console.log('--- Semantic Clusters ---');

  const texts = [
    // Topic A: cooking (indices 0-2)
    'How to make a perfect sourdough bread',
    'The best pasta sauce recipe with fresh tomatoes',
    'Kitchen tips for beginner chefs',
    // Topic B: programming (indices 3-5)
    'Introduction to TypeScript generics',
    'How to write clean JavaScript functions',
    'Best practices for React component design',
  ];

  const { embeddings } = await embedMany({ model: embeddingModel, values: texts });

  // Within-topic similarities
  const cookingPairs = [[0, 1], [0, 2], [1, 2]];
  const progPairs = [[3, 4], [3, 5], [4, 5]];
  const crossPairs = [[0, 3], [1, 4], [2, 5]];

  const avgSim = (pairs: number[][]) => {
    const sims = pairs.map(([i, j]) => cosineSimilarity(embeddings[i], embeddings[j]));
    return sims.reduce((a, b) => a + b, 0) / sims.length;
  };

  console.log(`  Cooking↔Cooking (within topic):     ${avgSim(cookingPairs).toFixed(4)}`);
  console.log(`  Programming↔Programming (within):   ${avgSim(progPairs).toFixed(4)}`);
  console.log(`  Cooking↔Programming (cross topic):  ${avgSim(crossPairs).toFixed(4)}`);
  console.log(`\n  Within-topic similarity is higher than cross-topic!`);
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
