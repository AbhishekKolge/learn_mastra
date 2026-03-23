/**
 * ============================================================
 *  MODULE 47: Built-in Scorers
 * ============================================================
 *
 *  THEORY
 *  ------
 *  Mastra provides a comprehensive set of built-in scorers
 *  organized into three categories. Each has a specific purpose
 *  and scoring direction.
 *
 *  ── ACCURACY & RELIABILITY (higher is better) ──
 *
 *  answer-relevancy (0-1 ↑)
 *    Does the response address the input query?
 *    createAnswerRelevancyScorer({ model })
 *
 *  answer-similarity (0-1 ↑)
 *    How close is the output to a ground-truth answer?
 *    Great for CI/CD testing with expected answers.
 *    createAnswerSimilarityScorer({ model })
 *
 *  faithfulness (0-1 ↑)
 *    Does the response accurately represent the provided context?
 *    Essential for RAG — catches when agent ignores context.
 *    createFaithfulnessScorer({ model })
 *
 *  hallucination (0-1 ↓)
 *    Does the response make unsupported claims?
 *    LOWER is better — 0 means no hallucination.
 *    createHallucinationScorer({ model })
 *
 *  completeness (0-1 ↑)
 *    Does the response include all necessary information?
 *    createCompletenessScorer({ model })
 *
 *  content-similarity (0-1 ↑)
 *    Character-level text similarity.
 *    createContentSimilarityScorer()
 *
 *  textual-difference (0-1 ↑)
 *    Measures text differences (higher = more similar).
 *    createTextualDifferenceScorer()
 *
 *  tool-call-accuracy (0-1 ↑)
 *    Did the agent pick the right tool?
 *    createToolCallAccuracyScorer({ model })
 *
 *  prompt-alignment (0-1 ↑)
 *    Does the output match prompt intent and format?
 *    createPromptAlignmentScorer({ model })
 *
 *  ── CONTEXT QUALITY (higher is better) ──
 *
 *  context-precision (0-1 ↑)
 *    Is relevant context ranked early? (Mean Average Precision)
 *    Use for RAG ranking evaluation.
 *    createContextPrecisionScorer({ model })
 *
 *  context-relevance (0-1 ↑)
 *    How useful is the context? Tracks usage and gaps.
 *    createContextRelevanceScorer({ model })
 *
 *  ── OUTPUT QUALITY ──
 *
 *  tone-consistency (0-1 ↑)
 *    Consistent formality and style.
 *    createToneConsistencyScorer({ model })
 *
 *  toxicity (0-1 ↓)
 *    Harmful or inappropriate content. LOWER is better.
 *    createToxicityScorer({ model })
 *
 *  bias (0-1 ↓)
 *    Detects potential biases. LOWER is better.
 *    createBiasScorer({ model })
 *
 *  keyword-coverage (0-1 ↑)
 *    Technical terminology coverage.
 *    createKeywordCoverageScorer({ model })
 *
 *  EXERCISE
 *  --------
 *  Use multiple built-in scorers to evaluate different
 *  aspects of agent output quality.
 * ============================================================
 */

import {
  createAnswerRelevancyScorer,
  createFaithfulnessScorer,
  createHallucinationScorer,
  createCompletenessScorer,
  createToxicityScorer,
  createBiasScorer,
  createToneConsistencyScorer,
} from '@mastra/evals/scorers/prebuilt';

const model = 'anthropic/claude-sonnet-4-5';

// ─── TODO 1: Create all scorers ──────────────────────────────
// Create instances of each scorer with your model.

const scorers = {
  relevancy: undefined as any,    // ← createAnswerRelevancyScorer({ model })
  faithfulness: undefined as any,  // ← createFaithfulnessScorer({ model })
  hallucination: undefined as any, // ← createHallucinationScorer({ model })
  completeness: undefined as any,  // ← createCompletenessScorer({ model })
  toxicity: undefined as any,      // ← createToxicityScorer({ model })
  bias: undefined as any,          // ← createBiasScorer({ model })
  tone: undefined as any,          // ← createToneConsistencyScorer({ model })
};

// ─── TODO 2: Test faithfulness with context ──────────────────
// Faithfulness checks if the response accurately represents context.
// Provide context and check if the response is faithful to it.
//
// Faithful response: uses information from the context
// Unfaithful response: adds facts not in the context
//
// await faithfulnessScorer.run({
//   input: 'What is Mastra?',
//   output: 'Mastra is an open-source TypeScript framework for AI agents.',
//   context: ['Mastra is an open-source TypeScript framework for building AI agents, workflows, and tools.'],
// })

export async function testFaithfulness() {
  console.log('--- Faithfulness ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 3: Test hallucination ──────────────────────────────
// Run on a response that sticks to facts vs one that hallucinates.
// Remember: LOWER score is better for hallucination.
//
// No hallucination: "Paris is the capital of France."
// Hallucination: "Paris is the capital of France, founded in 52 BC by Julius Caesar."

export async function testHallucination() {
  console.log('--- Hallucination ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 4: Test bias detection ─────────────────────────────
// Run on a neutral response vs a biased one.
// LOWER score is better.

export async function testBias() {
  console.log('--- Bias ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 5: Test tone consistency ──────────────────────────
// Run on a response with consistent tone vs mixed tone.

export async function testToneConsistency() {
  console.log('--- Tone Consistency ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 6: Multi-scorer evaluation ─────────────────────────
// Run ALL scorers on the same response and print a scorecard.
// This is how you'd evaluate an agent response holistically.

export async function testMultiScorer() {
  console.log('--- Multi-Scorer Evaluation ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── Run all tests ───────────────────────────────────────────
export async function runTest() {
  console.log('=== Built-in Scorers ===\n');

  await testFaithfulness();
  console.log('\n');
  await testHallucination();
  console.log('\n');
  await testBias();
  console.log('\n');
  await testToneConsistency();
  console.log('\n');
  await testMultiScorer();
}
