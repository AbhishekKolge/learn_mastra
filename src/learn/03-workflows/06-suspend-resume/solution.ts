/**
 * MODULE 21: Suspend, Resume & Snapshots — SOLUTION
 */
import { createWorkflow, createStep } from '@mastra/core/workflows';
import { z } from 'zod';

const approvalStep = createStep({
  id: 'approval',
  inputSchema: z.object({ amount: z.number(), description: z.string() }),
  outputSchema: z.object({ result: z.string() }),
  resumeSchema: z.object({ approved: z.boolean() }),
  suspendSchema: z.object({ reason: z.string(), amount: z.number() }),
  execute: async ({ inputData, resumeData, suspend }) => {
    if (!resumeData?.approved) {
      return await suspend({
        reason: `Approval needed for $${inputData.amount}`,
        amount: inputData.amount,
      });
    }
    return { result: `Approved: ${inputData.description} for $${inputData.amount}` };
  },
});

export const approvalWorkflow = createWorkflow({
  id: 'approval-workflow',
  inputSchema: z.object({ amount: z.number(), description: z.string() }),
  outputSchema: z.object({ result: z.string() }),
})
  .then(approvalStep)
  .commit();

export async function testSuspendResume() {
  const run = await approvalWorkflow.createRun();

  // Start — should suspend
  const result = await run.start({
    inputData: { amount: 500, description: 'Server upgrade' },
  });

  console.log('Status:', result.status);
  if (result.status === 'suspended') {
    console.log('Suspended at:', result.suspended);
    const payload = result.steps['approval']?.suspendPayload;
    console.log('Suspend payload:', payload);

    // Resume with approval
    const resumed = await run.resume({
      step: 'approval',
      resumeData: { approved: true },
    });

    if (resumed.status === 'success') {
      console.log('Final result:', resumed.result);
    }
  }
}

export async function runTest() { await testSuspendResume(); }
