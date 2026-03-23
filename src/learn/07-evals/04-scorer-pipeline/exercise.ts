/**
 * ============================================================
 *  MODULE 49: Scorer Pipeline Deep Dive
 * ============================================================
 *
 *  THEORY
 *  ------
 *  Module 48 introduced the 4-step pipeline. This module goes
 *  deeper into each step, mixing functions and prompt objects,
 *  and understanding the data flow.
 *
 *  THE PIPELINE IN DETAIL:
 *
 *  Step 1: preprocess ({ run, results }) → any
 *    Transforms raw input/output into a structured form.
 *    Results available as: results.preprocessStepResult
 *
 *  Step 2: analyze ({ run, results }) → any
 *    Performs the core evaluation logic.
 *    Can access: results.preprocessStepResult
 *    Results available as: results.analyzeStepResult
 *
 *  Step 3: generateScore ({ run, results }) → number
 *    The ONLY required step. Returns 0-1.
 *    Can access: results.preprocessStepResult, results.analyzeStepResult
 *
 *  Step 4: generateReason ({ run, results, score }) → string
 *    Explains the score in plain language.
 *    Can access: everything above + the score
 *
 *  MIXING APPROACHES:
 *    You can use functions for some steps and prompt objects
 *    for others in the same scorer:
 *
 *    createScorer(...)
 *      .preprocess(fn)          // function: extract data
 *      .analyze(promptObject)   // LLM: judge quality
 *      .generateScore(fn)       // function: convert to number
 *      .generateReason(promptObject) // LLM: explain
 *
 *  PROMPT OBJECT STRUCTURE:
 *    {
 *      description: string,       // what this step does
 *      outputSchema: z.object(), // expected LLM output shape
 *      createPrompt: ({ run, results }) => string, // the prompt
 *    }
 *
 *    For generateReason, no outputSchema is needed (returns string).
 *
 *  run OBJECT:
 *    run.input  → the original input
 *    run.output → the agent's output (string or object)
 *    run.context → optional context array
 *
 *  EXERCISE
 *  --------
 *  Build complex scorers that use all 4 steps with mixed
 *  function and prompt object approaches.
 * ============================================================
 */

import { createScorer } from '@mastra/core/evals';
import { z } from 'zod';

// ─── TODO 1: Full pipeline scorer (all functions) ────────────
// Build a "technical accuracy" scorer with ALL 4 steps as functions.
//
// preprocess: extract key claims from the output (split by sentences)
// analyze: check each claim for technical keywords
// generateScore: ratio of technical sentences to total
// generateReason: explain what was found
//
// This shows the full data flow without any LLM calls.

const technicalAccuracyScorer = undefined as any; // ← replace

// ─── TODO 2: Full pipeline scorer (all prompt objects) ───────
// Build a "helpfulness" scorer with ALL steps as prompt objects.
//
// preprocess: extract the user's intent from the input
// analyze: judge how well the output addresses the intent
// generateScore: convert the analysis to a score (use calculateScore)
// generateReason: explain the score in plain language

const helpfulnessScorer = undefined as any; // ← replace

// ─── TODO 3: Mixed pipeline scorer ──────────────────────────
// Build a "conciseness" scorer that mixes approaches:
//   preprocess (function): count words, sentences, avg sentence length
//   analyze (prompt object): LLM judges if the text is concise
//   generateScore (function): combine word count and LLM judgment
//   generateReason (function): template-based reason

const concisenessScorer = undefined as any; // ← replace

// ─── TODO 4: Test full function pipeline ────────────────────
export async function testFunctionPipeline() {
  console.log('--- All-Function Pipeline ---');
  // TODO: Run technicalAccuracyScorer on technical and non-technical outputs
  console.log('TODO: implement');
}

// ─── TODO 5: Test full prompt pipeline ──────────────────────
export async function testPromptPipeline() {
  console.log('--- All-Prompt Pipeline ---');
  // TODO: Run helpfulnessScorer on helpful and unhelpful outputs
  console.log('TODO: implement');
}

// ─── TODO 6: Test mixed pipeline ─────────────────────────────
export async function testMixedPipeline() {
  console.log('--- Mixed Pipeline ---');
  // TODO: Run concisenessScorer on concise and verbose outputs
  console.log('TODO: implement');
}

// ─── TODO 7: Inspect step results ───────────────────────────
// Run a scorer and inspect the intermediate step results
// (preprocessStepResult, analyzeStepResult) to understand
// the data flow.

export async function testStepResults() {
  console.log('--- Step Results Inspection ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── Run all tests ───────────────────────────────────────────
export async function runTest() {
  console.log('=== Scorer Pipeline ===\n');

  await testFunctionPipeline();
  console.log('\n');
  await testPromptPipeline();
  console.log('\n');
  await testMixedPipeline();
  console.log('\n');
  await testStepResults();
}
