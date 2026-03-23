/**
 * ============================================================
 *  MODULE 46: Evals Basics
 * ============================================================
 *
 *  THEORY
 *  ------
 *  Traditional software tests have clear pass/fail conditions:
 *  "does add(2,3) return 5?" But AI outputs are NON-DETERMINISTIC
 *  — the same prompt can produce different answers each time.
 *
 *  How do you test something that changes every run?
 *  Answer: SCORERS — automated evaluations that return SCORES
 *  (numbers between 0 and 1) measuring output quality.
 *
 *  SCORERS are to AI what unit tests are to code:
 *    Unit test: "does this function return the right value?" → pass/fail
 *    Scorer:    "how relevant is this response?" → 0.0 to 1.0
 *
 *  TYPES OF SCORERS:
 *
 *  1. TEXTUAL SCORERS — evaluate accuracy and quality
 *     - answer-relevancy: does the response address the query?
 *     - faithfulness: does it accurately represent the context?
 *     - hallucination: does it make unsupported claims?
 *     - completeness: does it include all necessary info?
 *
 *  2. CLASSIFICATION SCORERS — measure categorization accuracy
 *     - tool-call-accuracy: did the agent pick the right tool?
 *     - prompt-alignment: does output match prompt intent?
 *
 *  3. OUTPUT QUALITY SCORERS — evaluate style and safety
 *     - toxicity: is the content harmful? (lower is better)
 *     - bias: is there detectable bias? (lower is better)
 *     - tone-consistency: is the style consistent?
 *
 *  SCORING SCALE:
 *    Most scorers return 0 to 1:
 *      1.0 = perfect (relevant, faithful, complete, etc.)
 *      0.0 = worst (irrelevant, hallucinated, empty, etc.)
 *
 *    Exception: toxicity, hallucination, bias → LOWER is better
 *      0.0 = no toxicity/hallucination/bias (good)
 *      1.0 = highly toxic/hallucinated/biased (bad)
 *
 *  TWO WAYS TO USE SCORERS:
 *
 *  1. LIVE EVALUATIONS — run in real-time alongside agents
 *     Scorers are attached to agents and run asynchronously
 *     on a sampling percentage of outputs.
 *
 *  2. CI/CD EVALUATIONS — run in test suites
 *     Use runEvals() to batch-evaluate against test cases
 *     with ground truth data.
 *
 *  RUNNING A SCORER MANUALLY:
 *    const result = await scorer.run({
 *      input: 'What is the capital of France?',
 *      output: 'Paris is the capital of France.',
 *    })
 *    console.log(result.score)  // 0.95
 *    console.log(result.reason) // 'The response directly...'
 *
 *  PACKAGE: @mastra/evals (you already have it installed)
 *
 *  EXERCISE
 *  --------
 *  Run built-in scorers on sample inputs and understand
 *  what scores mean.
 * ============================================================
 */

import { createScorer } from '@mastra/core/evals';
import { createAnswerRelevancyScorer, createToxicityScorer, createCompletenessScorer } from '@mastra/evals/scorers/prebuilt';

// ─── TODO 1: Create built-in scorers ────────────────────────
// Create instances of built-in scorers.
//
// const relevancyScorer = createAnswerRelevancyScorer({ model: 'openai/gpt-5-mini' })
// const toxicityScorer = createToxicityScorer({ model: 'openai/gpt-5-mini' })
// const completenessScorer = createCompletenessScorer({ model: 'openai/gpt-5-mini' })

const relevancyScorer = undefined as any; // ← replace
const toxicityScorer = undefined as any; // ← replace
const completenessScorer = undefined as any; // ← replace

// ─── TODO 2: Test relevancy scorer ──────────────────────────
// Run the relevancy scorer on a GOOD response and a BAD response.
// Compare scores.
//
// Good: Q: "What is TypeScript?" A: "TypeScript is a typed superset of JavaScript..."
// Bad:  Q: "What is TypeScript?" A: "The weather today is sunny..."
//
// const result = await relevancyScorer.run({
//   input: 'What is TypeScript?',
//   output: 'TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.',
// })

export async function testRelevancy() {
  console.log('--- Relevancy Scorer ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 3: Test toxicity scorer ───────────────────────────
// Run on safe content and toxic content.
// Remember: toxicity is LOWER is better (0 = safe, 1 = toxic)
//
// Safe: "Here's how to write a function in TypeScript..."
// Toxic: "You're stupid for not knowing this..."

export async function testToxicity() {
  console.log('--- Toxicity Scorer ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 4: Test completeness scorer ───────────────────────
// Run on a complete answer and an incomplete answer.
//
// Complete: Full explanation with examples
// Incomplete: One-word answer

export async function testCompleteness() {
  console.log('--- Completeness Scorer ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 5: Score a real agent response ─────────────────────
// Use your existing weatherAgent (or any agent) to generate
// a response, then score it with multiple scorers.
//
// const response = await agent.generate('What is the weather in Paris?')
// const relevancy = await relevancyScorer.run({
//   input: 'What is the weather in Paris?',
//   output: response.text,
// })

export async function testAgentScoring() {
  console.log('--- Agent Response Scoring ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 6: Compare scoring across variations ──────────────
// Generate 3 different responses to the same question
// and score each. See how scores vary with response quality.

export async function testScoreVariations() {
  console.log('--- Score Variations ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── Run all tests ───────────────────────────────────────────
export async function runTest() {
  console.log('=== Evals Basics ===\n');

  await testRelevancy();
  console.log('\n');
  await testToxicity();
  console.log('\n');
  await testCompleteness();
  console.log('\n');
  await testAgentScoring();
  console.log('\n');
  await testScoreVariations();
}
