/**
 * ============================================================
 *  MODULE 21: Suspend, Resume & Snapshots
 * ============================================================
 *
 *  THEORY
 *  ------
 *  Workflows can PAUSE mid-execution. Why?
 *    - Wait for human approval
 *    - Wait for an API callback
 *    - Throttle costly operations
 *    - Collect additional data
 *
 *  ── suspend() ──
 *  Pauses execution at a step. Define the suspend condition
 *  using resumeData — if missing, suspend. If present, continue.
 *
 *    const step = createStep({
 *      resumeSchema: z.object({ approved: z.boolean() }),
 *      execute: async ({ inputData, resumeData, suspend }) => {
 *        if (!resumeData?.approved) {
 *          return await suspend({});  // pause here
 *        }
 *        return { result: 'approved!' };
 *      },
 *    });
 *
 *  ── resume() ──
 *  Restarts from the paused step with data matching resumeSchema.
 *
 *    const result = await run.resume({
 *      step: 'step-1',       // or pass step object for type safety
 *      resumeData: { approved: true },
 *    });
 *
 *  If only ONE step is suspended, you can omit `step`:
 *    await run.resume({ resumeData: { approved: true } })
 *
 *  Resume with runId (when you only have the ID):
 *    const run = await workflow.createRun({ runId: '123' })
 *    await run.resume({ resumeData: { ... } })
 *
 *  ── suspend with payload ──
 *  Pass context data when suspending (via suspendSchema):
 *
 *    suspendSchema: z.object({ reason: z.string() }),
 *    execute: async ({ suspend }) => {
 *      return await suspend({ reason: 'Need manager approval' });
 *    }
 *
 *  ── suspendData ──
 *  Access the data passed to suspend() when the step resumes:
 *
 *    execute: async ({ resumeData, suspendData }) => {
 *      if (resumeData) {
 *        console.log('Original reason:', suspendData?.reason);
 *      }
 *    }
 *
 *  ── Identifying suspended steps ──
 *    if (result.status === 'suspended') {
 *      console.log(result.suspended)  // ['step-1'] or ['nested-wf', 'step-2']
 *      console.log(result.suspendPayload)
 *    }
 *
 *  ── SNAPSHOTS ──
 *  When a workflow suspends, Mastra saves a SNAPSHOT:
 *    - Current state of each step (success, suspended, etc.)
 *    - Outputs of completed steps
 *    - Execution path taken
 *    - Retry attempts remaining
 *    - Stored in configured storage (libSQL, PostgreSQL, etc.)
 *
 *  Snapshots are automatic — you don't create them manually.
 *  They enable resuming from EXACTLY where execution paused,
 *  even after server restarts or deployments.
 *
 *  ── sleep() / sleepUntil() ──
 *  Pause at the workflow level (status = 'waiting', not 'suspended'):
 *    workflow.then(step1).sleep(5000).then(step2)       // ms
 *    workflow.then(step1).sleepUntil(midnight).then(step2) // date
 *
 *  EXERCISE
 *  --------
 *  Build a workflow that suspends for approval then resumes.
 * ============================================================
 */

import { createWorkflow, createStep } from '@mastra/core/workflows';
import { z } from 'zod';

// ─── TODO 1: Create a step that suspends ────────────────────
// This step processes a request but needs approval first.
// If resumeData.approved is not true, suspend with a reason.

const approvalStep = createStep({
  id: 'approval',
  inputSchema: z.object({ amount: z.number(), description: z.string() }),
  outputSchema: z.object({ result: z.string() }),
  resumeSchema: z.object({ approved: z.boolean() }),
  suspendSchema: z.object({ reason: z.string(), amount: z.number() }),
  execute: async ({ inputData, resumeData, suspend, suspendData }) => {
    const { approved } = resumeData ?? {};

    if (!approved) {
      // TODO: suspend with reason and amount
      return await suspend({
        reason: `Approval needed for $${inputData.amount}`,
        amount: inputData.amount,
      });
    }

    // After resume, suspendData has the original suspend payload
    return {
      result: `Approved: ${inputData.description} for $${inputData.amount}`,
    };
  },
});

// ─── TODO 2: Create the workflow ────────────────────────────
export const approvalWorkflow = createWorkflow({
  id: 'approval-workflow',
  inputSchema: z.object({ amount: z.number(), description: z.string() }),
  outputSchema: z.object({ result: z.string() }),
})
  .then(approvalStep)
  .commit();

// ─── TODO 3: Test suspend and resume ────────────────────────
export async function testSuspendResume() {
  console.log('--- Suspend & Resume ---');
  // TODO: Create run
  // TODO: Start the workflow — it should suspend
  // TODO: Check result.status === 'suspended'
  // TODO: Print result.suspended (step path)
  // TODO: Access the suspendPayload from result.steps
  // TODO: Resume with { approved: true }
  // TODO: Print the final result
  console.log('TODO: implement');
}

// ─── TODO 4: Resume by runId (from a different context) ─────
// In a real app, suspend happens in one request, resume in another.
// Save the runId, then create a new run reference to resume:
//
//   // Request 1: Start and get runId
//   const run = await workflow.createRun();
//   const result = await run.start({ inputData: { ... } });
//   const savedRunId = run.runId;  // save this (DB, session, etc.)
//
//   // Request 2: Resume with saved runId
//   const resumeRun = await workflow.createRun({ runId: savedRunId });
//   const resumedResult = await resumeRun.resume({
//     step: 'approval',
//     resumeData: { approved: true },
//   });

// ─── TODO 5: Multi-step suspend ─────────────────────────────
// Multiple steps can suspend. Resume each in sequence:
//
//   const step1 = createStep({
//     id: 'step-1',
//     resumeSchema: z.object({ approved: z.boolean() }),
//     execute: async ({ resumeData, suspend }) => {
//       if (!resumeData?.approved) return await suspend({});
//       return { ... };
//     },
//   });
//   const step2 = createStep({
//     id: 'step-2',
//     resumeSchema: z.object({ confirmed: z.boolean() }),
//     execute: async ({ resumeData, suspend }) => {
//       if (!resumeData?.confirmed) return await suspend({});
//       return { ... };
//     },
//   });
//
//   // Resume each separately:
//   await run.resume({ step: 'step-1', resumeData: { approved: true } });
//   await run.resume({ step: 'step-2', resumeData: { confirmed: true } });

// ─── TODO 6: Snapshot best practices ────────────────────────
// 1. Ensure serializability: all data in the workflow must be JSON-safe
// 2. Minimize snapshot size: store IDs, not full objects
// 3. Handle resume context carefully: it merges with snapshot
// 4. Monitor suspended workflows: they can pile up
// 5. Scale storage: many suspends = many snapshots

export async function runTest() {
  await testSuspendResume();
}
