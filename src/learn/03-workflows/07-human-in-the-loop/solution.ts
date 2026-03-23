/**
 * MODULE 22: Human-in-the-Loop — SOLUTION
 */
import { createWorkflow, createStep } from '@mastra/core/workflows';
import { z } from 'zod';

const approvalStep = createStep({
  id: 'human-approval',
  inputSchema: z.object({ action: z.string(), target: z.string() }),
  outputSchema: z.object({ result: z.string() }),
  resumeSchema: z.object({ approved: z.boolean() }),
  suspendSchema: z.object({ reason: z.string() }),
  execute: async ({ inputData, resumeData, suspend, bail }) => {
    const { approved } = resumeData ?? {};
    if (approved === false) {
      return bail({ result: `Rejected: ${inputData.action} on ${inputData.target}` });
    }
    if (!approved) {
      return await suspend({
        reason: `Please approve: ${inputData.action} on ${inputData.target}`,
      });
    }
    return { result: `Executed: ${inputData.action} on ${inputData.target}` };
  },
});

export const hitlWorkflow = createWorkflow({
  id: 'hitl-workflow',
  inputSchema: z.object({ action: z.string(), target: z.string() }),
  outputSchema: z.object({ result: z.string() }),
})
  .then(approvalStep)
  .commit();

export async function testApproval() {
  const run = await hitlWorkflow.createRun();
  const result = await run.start({
    inputData: { action: 'delete', target: 'database-prod' },
  });

  if (result.status === 'suspended') {
    const payload = result.steps['human-approval']?.suspendPayload;
    console.log('User sees:', payload?.reason);

    const resumed = await run.resume({
      step: 'human-approval',
      resumeData: { approved: true },
    });
    if (resumed.status === 'success') console.log('Result:', resumed.result);
  }
}

export async function testRejection() {
  const run = await hitlWorkflow.createRun();
  await run.start({ inputData: { action: 'delete', target: 'database-prod' } });

  const resumed = await run.resume({
    step: 'human-approval',
    resumeData: { approved: false },
  });
  console.log('Status:', resumed.status);
  if (resumed.status === 'success') console.log('Result:', resumed.result);
}

export async function runTest() {
  await testApproval();
  await testRejection();
}
