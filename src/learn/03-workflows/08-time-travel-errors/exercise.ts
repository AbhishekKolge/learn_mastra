/**
 * ============================================================
 *  MODULE 23: Time Travel & Error Handling
 * ============================================================
 *
 *  THEORY — TIME TRAVEL
 *  --------------------
 *  Re-execute a workflow from ANY step, using saved snapshots
 *  or custom context. Perfect for debugging and recovery.
 *
 *  ── run.timeTravel() ──
 *    const result = await run.timeTravel({
 *      step: 'step2',                    // target step (ID or reference)
 *      inputData: { value: 'fixed' },    // input for that step
 *    })
 *
 *  How it works:
 *    1. Load snapshot from storage (if available)
 *    2. Reconstruct step results before the target
 *    3. Execute from the target step forward
 *
 *  Specify target step:
 *    step: step2                        // step reference (type-safe)
 *    step: 'step2'                      // step ID (string)
 *    step: 'nestedWorkflow.step3'       // nested (dot notation)
 *    step: ['nestedWorkflow', 'step3']  // nested (array)
 *
 *  Provide custom context (override step results):
 *    await run.timeTravel({
 *      step: 'step2',
 *      context: {
 *        step1: {
 *          status: 'success',
 *          payload: { value: 0 },
 *          output: { result: 'fixed' },
 *          startedAt: Date.now(),
 *          endedAt: Date.now(),
 *        },
 *      },
 *    })
 *
 *  Stream time travel events:
 *    const stream = run.timeTravelStream({ step: 'step2' })
 *    for await (const event of stream.fullStream) { ... }
 *    const result = await stream.result
 *
 *  Time travel with initial state:
 *    await run.timeTravel({
 *      step: 'step2',
 *      initialState: { counter: 5 },
 *    })
 *
 *  Nested workflow context:
 *    await run.timeTravel({
 *      step: 'nestedWf.step3',
 *      nestedStepsContext: {
 *        nestedWf: {
 *          step2: { status: 'success', output: { ... }, ... },
 *        },
 *      },
 *    })
 *
 *  Use cases:
 *    - Debug: re-run failed step with same context
 *    - Test: run a specific step with custom input
 *    - Recover: fix transient failures without full re-run
 *
 *  THEORY — ERROR HANDLING
 *  -----------------------
 *  ── Result status checks ──
 *    result.status: 'success' | 'failed' | 'suspended' | 'tripwire'
 *    result.steps: individual step results
 *
 *  ── Retries ──
 *  Workflow-level:
 *    createWorkflow({ retryConfig: { attempts: 5, delay: 2000 } })
 *
 *  Step-level (overrides workflow):
 *    createStep({ retries: 3, execute: async () => { ... } })
 *
 *  ── bail() ──
 *  Exit early with success. Output = bail payload. No error.
 *    execute: async ({ bail }) => bail({ result: 'skipped' })
 *
 *  ── throw Error ──
 *  Exit with failure. Step and workflow fail.
 *    execute: async () => { throw new Error('fatal') }
 *
 *  ── Lifecycle callbacks ──
 *  onFinish: Called on ANY completion (success, failed, suspended):
 *    createWorkflow({
 *      options: {
 *        onFinish: async (result) => {
 *          await db.log(result.status, result.runId);
 *        },
 *      },
 *    })
 *
 *  onError: Called ONLY on failure/tripwire:
 *    options: {
 *      onError: async (info) => {
 *        await alertService.notify(info.error?.message);
 *      },
 *    }
 *
 *  Both callbacks receive: status, runId, workflowId, steps, state,
 *  getInitData(), mastra, requestContext, logger.
 *  Errors in callbacks are caught and logged — they don't break the workflow.
 *
 *  ── Conditional branching for error recovery ──
 *    step1 returns { status: 'ok' | 'error' } with try/catch
 *    .branch([
 *      [async ({ inputData }) => inputData.status === 'ok', successStep],
 *      [async ({ inputData }) => inputData.status === 'error', fallbackStep],
 *    ])
 *
 *  ── getStepResult() ──
 *  Inspect a previous step's result from within another step:
 *    execute: async ({ getStepResult }) => {
 *      const prev = getStepResult(step1);
 *      return { value: prev.output };
 *    }
 *
 *  ── RequestContext in workflows ──
 *    execute: async ({ requestContext }) => {
 *      const tier = requestContext.get('user-tier');
 *      return { maxResults: tier === 'enterprise' ? 1000 : 50 };
 *    }
 *
 *  EXERCISE
 *  --------
 *  Practice error handling and time travel debugging.
 * ============================================================
 */

import { createWorkflow, createStep } from '@mastra/core/workflows';
import { z } from 'zod';

// ─── TODO 1: Create a workflow with retry config ────────────
// Workflow-level retries apply to ALL steps.

const flakeyStep = createStep({
  id: 'flakey',
  inputSchema: z.object({ value: z.string() }),
  outputSchema: z.object({ result: z.string() }),
  retries: 3,  // step-level overrides workflow-level
  execute: async ({ inputData }) => {
    // Simulate flaky operation
    if (Math.random() < 0.5) throw new Error('Transient failure');
    return { result: `Processed: ${inputData.value}` };
  },
});

export const retryWorkflow = createWorkflow({
  id: 'retry-workflow',
  inputSchema: z.object({ value: z.string() }),
  outputSchema: z.object({ result: z.string() }),
  retryConfig: { attempts: 2, delay: 1000 },  // workflow-level default
})
  .then(flakeyStep)
  .commit();

// ─── TODO 2: Create a workflow with lifecycle callbacks ──────
//
// export const callbackWorkflow = createWorkflow({
//   id: 'callback-workflow',
//   inputSchema: z.object({ value: z.string() }),
//   outputSchema: z.object({ result: z.string() }),
//   options: {
//     onFinish: async (result) => {
//       console.log(`[onFinish] Status: ${result.status}, RunId: ${result.runId}`);
//     },
//     onError: async (info) => {
//       console.error(`[onError] Error: ${info.error?.message}`);
//     },
//   },
// }).then(someStep).commit();

// ─── TODO 3: Test error handling ────────────────────────────
export async function testErrors() {
  console.log('--- Error Handling ---');
  // TODO: Run retryWorkflow
  // TODO: Check result.status
  // TODO: If failed, inspect result.steps to find which step failed
  // TODO: Print result.error
  console.log('TODO: implement');
}

// ─── TODO 4: Test time travel — debug a failure ─────────────
export async function testTimeTravel() {
  console.log('--- Time Travel ---');
  // TODO: Create a multi-step workflow
  // TODO: Run it — if step2 fails, use timeTravel to re-run from step2
  //
  //   const run = await workflow.createRun();
  //   const result = await run.start({ inputData: { ... } });
  //   if (result.status === 'failed') {
  //     const fixed = await run.timeTravel({
  //       step: 'step2',
  //       inputData: { correctedValue: 'fixed' },
  //     });
  //   }
  console.log('TODO: implement');
}

// ─── TODO 5: Conditional error recovery with .branch() ──────
// Instead of failing the workflow, catch errors in the step
// and branch to a fallback:
//
//   const riskyStep = createStep({
//     execute: async ({ inputData }) => {
//       try {
//         const result = await riskyOperation();
//         return { status: 'ok' as const, data: result };
//       } catch {
//         return { status: 'error' as const, data: null };
//       }
//     },
//   });
//
//   workflow
//     .then(riskyStep)
//     .branch([
//       [async ({ inputData }) => inputData.status === 'ok', processStep],
//       [async ({ inputData }) => inputData.status === 'error', fallbackStep],
//     ])
//     .commit()

// ─── TODO 6: bail() vs throw ────────────────────────────────
// bail(): graceful exit, status = 'success', output = bail payload
// throw: error exit, status = 'failed', error captured
//
//   execute: async ({ inputData, bail }) => {
//     if (inputData.skip) {
//       return bail({ result: 'Skipped — not needed' });
//     }
//     if (inputData.invalid) {
//       throw new Error('Invalid input — cannot process');
//     }
//     return { result: 'Processed successfully' };
//   }

// ─── TODO 7: Stream time travel for real-time debugging ─────
//   const stream = run.timeTravelStream({
//     step: 'step2',
//     inputData: { value: 10 },
//   });
//   for await (const event of stream.fullStream) {
//     console.log(event.type, event.payload);
//   }
//   const result = await stream.result;

// ─── TODO 8: Monitor errors with stream() ───────────────────
//   const stream = run.stream({ inputData: { ... } });
//   for await (const chunk of stream.fullStream) {
//     if (chunk.type === 'step-error') {
//       console.error('Step failed:', chunk.payload);
//     }
//   }

export async function runTest() {
  console.log('=== Error Handling ===\n');
  await testErrors();
  console.log('\n=== Time Travel ===\n');
  await testTimeTravel();
}
