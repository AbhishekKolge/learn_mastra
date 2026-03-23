/**
 * ============================================================
 *  MODULE 48: Custom Scorers
 * ============================================================
 *
 *  THEORY
 *  ------
 *  Built-in scorers cover common cases, but your domain has
 *  unique evaluation needs. Custom scorers let you define
 *  exactly what "good output" means for YOUR use case.
 *
 *  THE createScorer FACTORY:
 *    import { createScorer } from '@mastra/core/evals'
 *
 *    const myScorer = createScorer({
 *      id: 'my-scorer',
 *      description: 'What this scorer evaluates',
 *      judge: {                  // optional, for LLM steps
 *        model: 'openai/gpt-5-mini',
 *        instructions: 'You are...',
 *      },
 *    })
 *      .preprocess(...)    // optional: prepare data
 *      .analyze(...)       // optional: perform analysis
 *      .generateScore(...) // REQUIRED: return 0-1 score
 *      .generateReason(...) // optional: explain the score
 *
 *  THE 4-STEP PIPELINE:
 *    1. preprocess  → prepare/transform input data
 *    2. analyze     → evaluate and gather insights
 *    3. generateScore → convert analysis to a number (0-1)
 *    4. generateReason → explain why in human-readable text
 *
 *    Only generateScore is required. Others are optional.
 *
 *  TWO APPROACHES PER STEP:
 *
 *  FUNCTION (deterministic):
 *    .generateScore(({ run, results }) => {
 *      return run.output.includes('TypeScript') ? 1 : 0
 *    })
 *
 *  PROMPT OBJECT (LLM-judged):
 *    .analyze({
 *      description: 'Analyze for X',
 *      outputSchema: z.object({ hasX: z.boolean() }),
 *      createPrompt: ({ run }) => `Check: ${run.output}`,
 *    })
 *
 *  You can MIX approaches — e.g., function preprocess + LLM analyze.
 *
 *  DATA FLOW BETWEEN STEPS:
 *    preprocess result → results.preprocessStepResult
 *    analyze result    → results.analyzeStepResult
 *    score             → available in generateReason as `score`
 *
 *  RUNNING A SCORER:
 *    const result = await myScorer.run({
 *      input: 'the question',
 *      output: 'the answer',
 *    })
 *    console.log(result.score)  // 0-1
 *    console.log(result.reason) // explanation
 *
 *  EXERCISE
 *  --------
 *  Build custom scorers using both function-based and
 *  LLM-based approaches.
 * ============================================================
 */

import { createScorer } from '@mastra/core/evals';
import { z } from 'zod';

// ─── TODO 1: Simple function-only scorer ─────────────────────
// Create a scorer that checks if the output contains code blocks.
// Score: 1 if contains ```, 0 if not.
//
// const codeBlockScorer = createScorer({
//   id: 'code-block-checker',
//   description: 'Checks if the output contains code blocks',
// })
//   .generateScore(({ run }) => {
//     return run.output.includes('```') ? 1 : 0
//   })
//   .generateReason(({ score }) => {
//     return score === 1
//       ? 'Output contains code blocks'
//       : 'Output does not contain code blocks'
//   })

const codeBlockScorer = undefined as any; // ← replace

// ─── TODO 2: Word count scorer (preprocess + score) ──────────
// Create a scorer that measures if output meets a minimum word count.
// preprocess: extract word count
// generateScore: 1 if >= 50 words, proportional if less
//
// .preprocess(({ run }) => {
//   const words = run.output.split(/\s+/).filter(Boolean)
//   return { wordCount: words.length }
// })
// .generateScore(({ results }) => {
//   const { wordCount } = results.preprocessStepResult
//   return Math.min(wordCount / 50, 1)  // 50 words = score 1.0
// })
// .generateReason(({ results, score }) => {
//   return `Word count: ${results.preprocessStepResult.wordCount}. Score: ${score.toFixed(2)}`
// })

const wordCountScorer = undefined as any; // ← replace

// ─── TODO 3: LLM-judged scorer (analyze with prompt object) ──
// Create a scorer that uses an LLM to judge response quality.
// Uses a prompt object for the analyze step.
//
// createScorer({
//   id: 'professionalism',
//   description: 'Checks if the response is professional in tone',
//   judge: { model: 'anthropic/claude-sonnet-4-5', instructions: 'You evaluate text professionalism.' },
// })
//   .analyze({
//     description: 'Analyze professionalism',
//     outputSchema: z.object({
//       isProfessional: z.boolean(),
//       issues: z.array(z.string()),
//       formalityScore: z.number().min(0).max(10),
//     }),
//     createPrompt: ({ run }) => `Analyze the professionalism of this text:
//       "${run.output}"
//       Is it professional? List any issues. Rate formality 0-10.`,
//   })
//   .generateScore(({ results }) => {
//     return results.analyzeStepResult.formalityScore / 10
//   })
//   .generateReason(({ results, score }) => {
//     const { isProfessional, issues } = results.analyzeStepResult
//     return isProfessional
//       ? `Professional (${score.toFixed(2)})`
//       : `Unprofessional: ${issues.join(', ')}`
//   })

const professionalismScorer = undefined as any; // ← replace

// ─── TODO 4: Test the code block scorer ──────────────────────
export async function testCodeBlockScorer() {
  console.log('--- Code Block Scorer ---');
  // TODO: Run on output with and without code blocks
  console.log('TODO: implement');
}

// ─── TODO 5: Test the word count scorer ──────────────────────
export async function testWordCountScorer() {
  console.log('--- Word Count Scorer ---');
  // TODO: Run on short (10 words) and long (100 words) outputs
  console.log('TODO: implement');
}

// ─── TODO 6: Test the professionalism scorer ────────────────
export async function testProfessionalismScorer() {
  console.log('--- Professionalism Scorer ---');
  // TODO: Run on professional and casual outputs
  console.log('TODO: implement');
}

// ─── TODO 7: Build a domain-specific scorer ──────────────────
// Create a scorer for YOUR domain. Ideas:
//   - JSON validator (does output contain valid JSON?)
//   - Security checker (does response avoid exposing secrets?)
//   - Brand voice (does response match company tone?)
//   - API compliance (does response follow API conventions?)

export async function testDomainScorer() {
  console.log('--- Domain-Specific Scorer ---');
  // TODO: implement your own scorer
  console.log('TODO: implement');
}

// ─── Run all tests ───────────────────────────────────────────
export async function runTest() {
  console.log('=== Custom Scorers ===\n');

  await testCodeBlockScorer();
  console.log('\n');
  await testWordCountScorer();
  console.log('\n');
  await testProfessionalismScorer();
  console.log('\n');
  await testDomainScorer();
}
