/**
 * ============================================================
 *  MODULE 17: Control Flow & Data Mapping
 * ============================================================
 *
 *  THEORY
 *  ------
 *  Workflows aren't just linear. You can run steps in parallel,
 *  branch based on conditions, and transform data between steps.
 *
 *  ── .then(step) ──
 *  Sequential: step2 receives step1's output.
 *    workflow.then(step1).then(step2).commit()
 *
 *  ── .parallel([stepA, stepB]) ──
 *  Simultaneous: ALL steps run at the same time on the SAME input.
 *  Output is an object keyed by step IDs:
 *    { 'stepA': { ...stepA output }, 'stepB': { ...stepB output } }
 *
 *  The NEXT step's inputSchema must match this keyed structure:
 *    inputSchema: z.object({
 *      'stepA': z.object({ ... }),
 *      'stepB': z.object({ ... }),
 *    })
 *
 *  All parallel steps MUST complete before the next step runs.
 *  If any step throws, the entire parallel block fails.
 *  Handle errors with try/catch INSIDE steps for resilience.
 *
 *  ── .branch([...conditions]) ──
 *  Conditional: Only ONE branch runs based on conditions.
 *  All branches must have the SAME inputSchema and outputSchema.
 *  Conditions are evaluated in order — first true wins.
 *
 *    .branch([
 *      [async ({ inputData }) => inputData.value > 10, highStep],
 *      [async ({ inputData }) => inputData.value <= 10, lowStep],
 *    ])
 *
 *  Output is keyed by executed step's ID:
 *    { 'highStep': { ...output } }  // only one key present
 *
 *  Next step should use OPTIONAL fields since only one branch ran:
 *    inputSchema: z.object({
 *      'highStep': z.object({ ... }).optional(),
 *      'lowStep': z.object({ ... }).optional(),
 *    })
 *
 *  ── .map(fn) ──
 *  Transform data between steps when schemas don't match.
 *    .then(step1)
 *    .map(async ({ inputData }) => ({
 *      newField: inputData.oldField + ' transformed',
 *    }))
 *    .then(step2)
 *
 *  .map() helpers:
 *    - getStepResult(stepId): Access a specific step's output
 *    - getInitData(): Access the workflow's original input
 *    - mapVariable(): Declarative field extraction
 *
 *  EXERCISE
 *  --------
 *  Build a data processing workflow with parallel, branch, and map.
 * ============================================================
 */

import { createWorkflow, createStep } from '@mastra/core/workflows';
import { z } from 'zod';

// ─── TODO 1: Create steps for parallel execution ────────────
// Step A: Takes { message: string }, returns { upper: string }
// Step B: Takes { message: string }, returns { length: number }
// Both run at the same time on the same input.

const toUpperStep = createStep({
  id: 'to-upper',
  inputSchema: z.object({ message: z.string() }),
  outputSchema: z.object({ upper: z.string() }),
  execute: async ({ inputData }) => ({
    upper: inputData.message.toUpperCase(),
  }),
});

const countLengthStep = createStep({
  id: 'count-length',
  inputSchema: z.object({ message: z.string() }),
  outputSchema: z.object({ length: z.number() }),
  execute: async ({ inputData }) => ({
    length: inputData.message.length,
  }),
});

// TODO: Create a combineStep that receives BOTH parallel outputs.
// inputSchema must match the parallel output structure:
//   { 'to-upper': { upper: string }, 'count-length': { length: number } }
// outputSchema: { combined: string }
// execute: return `${upper} (${length} chars)`

const combineStep = undefined as any; // ← replace

// ─── TODO 2: Create the parallel workflow ───────────────────
// .parallel([toUpperStep, countLengthStep])
// .then(combineStep)

export const parallelWorkflow = undefined as any; // ← replace

// ─── TODO 3: Create steps for branching ─────────────────────
// Create a workflow that:
//   - Takes { value: number }
//   - If value > 100: run "expensive" step (return "premium processing")
//   - If value <= 100: run "cheap" step (return "standard processing")
//
// IMPORTANT: Both branch steps need the SAME input and output schemas.
//
// After the branch, use .map() or a step with optional fields
// to combine the result.

const expensiveStep = createStep({
  id: 'expensive',
  inputSchema: z.object({ value: z.number() }),
  outputSchema: z.object({ result: z.string() }),
  execute: async ({ inputData }) => ({
    result: `Premium processing for value ${inputData.value}`,
  }),
});

const cheapStep = createStep({
  id: 'cheap',
  inputSchema: z.object({ value: z.number() }),
  outputSchema: z.object({ result: z.string() }),
  execute: async ({ inputData }) => ({
    result: `Standard processing for value ${inputData.value}`,
  }),
});

// TODO: Create a branchWorkflow that:
//   .branch([
//     [async ({ inputData }) => inputData.value > 100, expensiveStep],
//     [async ({ inputData }) => inputData.value <= 100, cheapStep],
//   ])
//   .map() to extract the result from whichever branch ran
//   .commit()

export const branchWorkflow = undefined as any; // ← replace

// ─── TODO 4: Use .map() for data transformation ────────────
// Sometimes step A's output doesn't match step B's input.
// Use .map() to transform between them:
//
//   .then(stepA)
//   .map(async ({ inputData }) => ({
//     newField: `transformed: ${inputData.oldField}`,
//   }))
//   .then(stepB)
//
// .map() also has helpers:
//   .map(async ({ inputData, getStepResult, getInitData }) => {
//     const step1Output = getStepResult('step-1');
//     const originalInput = getInitData();
//     return { ... };
//   })

// ─── TODO 5: Handle parallel failures gracefully ────────────
// If any parallel step THROWS, the entire parallel block fails.
// For resilience, handle errors INSIDE the step:
//
//   const resilientStep = createStep({
//     id: 'resilient',
//     execute: async ({ inputData }) => {
//       try {
//         const result = await riskyOperation();
//         return { data: result, failed: false };
//       } catch {
//         return { data: null, failed: true };
//       }
//     },
//   });
//
// Downstream steps can then filter out failed results.

// ─── TODO 6: Test the workflows ─────────────────────────────
export async function testParallel() {
  console.log('--- Parallel Workflow ---');
  // TODO: Create run, start with { message: 'hello world' }
  // TODO: Print result
  console.log('TODO: implement');
}

export async function testBranch() {
  console.log('--- Branch Workflow ---');
  // TODO: Create run, start with { value: 150 } (should hit expensive)
  // TODO: Create another run with { value: 50 } (should hit cheap)
  // TODO: Print both results
  console.log('TODO: implement');
}

export async function runTest() {
  console.log('=== Parallel ===\n');
  await testParallel();
  console.log('\n=== Branch ===\n');
  await testBranch();
}
