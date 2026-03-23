/**
 * ============================================================
 *  MODULE 18: Looping & Iteration
 * ============================================================
 *
 *  THEORY
 *  ------
 *  Three looping methods let you repeat steps:
 *
 *  ── .foreach(step, { concurrency }) ──
 *  Run the SAME step for EACH item in an array.
 *  Input must be an array. Output is always an array.
 *
 *    workflow
 *      .foreach(processItem, { concurrency: 5 })
 *      .then(aggregateStep)  // receives the full array
 *      .commit()
 *
 *  concurrency (default: 1):
 *    1  → sequential (one at a time)
 *    5  → up to 5 items processed simultaneously
 *
 *  Output: [step_output_1, step_output_2, ...]
 *  The next step receives this entire array as inputData.
 *
 *  AGGREGATING after foreach:
 *    .foreach(processStep)
 *    .then(aggregateStep)  // inputSchema: z.array(...)
 *    // OR
 *    .foreach(processStep)
 *    .map(async ({ inputData }) => ({
 *      total: inputData.reduce((sum, item) => sum + item.value, 0),
 *    }))
 *
 *  CHAINING foreach: Creates array of arrays!
 *    .foreach(step1)  → [a, b, c]
 *    .foreach(step2)  → [[x], [y], [z]]  // nested!
 *    Use .map() with .flat() to flatten, or use nested workflows.
 *
 *  NESTED WORKFLOWS in foreach (recommended for multi-step per item):
 *    const perItemPipeline = createWorkflow({...})
 *      .then(downloadStep)
 *      .then(parseStep)
 *      .then(embedStep)
 *      .commit();
 *
 *    workflow.foreach(perItemPipeline, { concurrency: 3 }).commit()
 *
 *    Why: Each item runs its FULL pipeline before results collect.
 *    With concurrency: 3, up to 3 items run their pipelines in parallel.
 *
 *  ── .dountil(step, condition) ──
 *  Repeat step UNTIL condition becomes TRUE.
 *  The step's output is fed back as its input for the next iteration.
 *
 *    .dountil(incrementStep, async ({ inputData }) => inputData.count > 10)
 *
 *  ── .dowhile(step, condition) ──
 *  Repeat step WHILE condition remains TRUE.
 *
 *    .dowhile(incrementStep, async ({ inputData }) => inputData.count < 10)
 *
 *  ABORTING LOOPS:
 *    Use iterationCount in the condition to prevent infinite loops:
 *    .dountil(step, async ({ inputData: { iterationCount } }) => {
 *      if (iterationCount >= 10) throw new Error('Max iterations');
 *      return someCondition;
 *    })
 *
 *  SYNCHRONIZATION:
 *    Both .parallel() and .foreach() are sync points —
 *    the next step only runs after ALL items/branches complete.
 *
 *  EXERCISE
 *  --------
 *  Build workflows using all three loop types.
 * ============================================================
 */

import { createWorkflow, createStep } from '@mastra/core/workflows';
import { z } from 'zod';

// ─── TODO 1: foreach — process an array of items ────────────
// Create a step that doubles a number.
// Then create a workflow that processes an array of numbers.

const doubleStep = createStep({
  id: 'double',
  inputSchema: z.object({ value: z.number() }),
  outputSchema: z.object({ value: z.number() }),
  execute: async ({ inputData }) => ({
    value: inputData.value * 2,
  }),
});

// TODO: Create a workflow that takes z.array(z.object({ value: z.number() }))
// and uses .foreach(doubleStep) to double each one.
// Output: z.array(z.object({ value: z.number() }))

export const foreachWorkflow = undefined as any; // ← replace

// ─── TODO 2: foreach with aggregation ───────────────────────
// After foreach, aggregate results.
// Create a step that sums all values.

const sumStep = createStep({
  id: 'sum',
  inputSchema: z.array(z.object({ value: z.number() })),
  outputSchema: z.object({ total: z.number() }),
  execute: async ({ inputData }) => ({
    total: inputData.reduce((sum, item) => sum + item.value, 0),
  }),
});

// TODO: Create a workflow: .foreach(doubleStep).then(sumStep).commit()
export const foreachSumWorkflow = undefined as any; // ← replace

// ─── TODO 3: foreach with concurrency ───────────────────────
// Process items in parallel batches.
//
//   .foreach(step, { concurrency: 4 })  // 4 items at a time
//
// For I/O-bound operations, increase concurrency:
//   .foreach(fetchStep, { concurrency: 10 })

// ─── TODO 4: dountil — repeat until condition ───────────────
// Create a step that increments a counter.
// Loop until the counter reaches 5.

const incrementStep = createStep({
  id: 'increment',
  inputSchema: z.object({ count: z.number() }),
  outputSchema: z.object({ count: z.number() }),
  execute: async ({ inputData }) => ({
    count: inputData.count + 1,
  }),
});

// TODO: Create a workflow that starts at { count: 0 }
// and uses .dountil() to increment until count >= 5
export const dountilWorkflow = undefined as any; // ← replace

// ─── TODO 5: dowhile — repeat while condition ───────────────
// Same as above but with dowhile (while count < 5)
export const dowhileWorkflow = undefined as any; // ← replace

// ─── TODO 6: Nested workflow in foreach ─────────────────────
// For multi-step processing PER ITEM, use a nested workflow:
//
//   const perItem = createWorkflow({
//     id: 'per-item',
//     inputSchema: z.object({ url: z.string() }),
//     outputSchema: z.object({ data: z.string() }),
//   })
//     .then(downloadStep)
//     .then(parseStep)
//     .commit();
//
//   const batchWorkflow = createWorkflow({
//     id: 'batch',
//     inputSchema: z.array(z.object({ url: z.string() })),
//     outputSchema: z.array(z.object({ data: z.string() })),
//   })
//     .foreach(perItem, { concurrency: 3 })
//     .commit();
//
// Why nested vs chained foreach:
//   Chained: ALL items do step1, wait, ALL do step2 → nested arrays
//   Nested:  Each item does step1→step2→step3 independently → flat array
//   Nested is cleaner and allows better parallelism.

// ─── TODO 7: Quick reference table ──────────────────────────
// | Method             | Input | Output           | Concurrency        |
// |--------------------|-------|------------------|--------------------|
// | .then(step)        | T     | U                | N/A (sequential)   |
// | .parallel([a, b])  | T     | { a: U, b: V }  | All simultaneous   |
// | .foreach(step)     | T[]   | U[]              | Configurable (1)   |
// | .branch([...])     | T     | { selected: U }  | Only one branch    |
// | .dountil(step, fn) | T     | T                | N/A (loop)         |
// | .dowhile(step, fn) | T     | T                | N/A (loop)         |

export async function runTest() {
  console.log('=== foreach ===\n');
  // TODO: Test foreachWorkflow with [{ value: 1 }, { value: 2 }, { value: 3 }]

  console.log('\n=== foreach + sum ===\n');
  // TODO: Test foreachSumWorkflow

  console.log('\n=== dountil ===\n');
  // TODO: Test dountilWorkflow with { count: 0 }

  console.log('\n=== dowhile ===\n');
  // TODO: Test dowhileWorkflow with { count: 0 }

  console.log('TODO: implement');
}
