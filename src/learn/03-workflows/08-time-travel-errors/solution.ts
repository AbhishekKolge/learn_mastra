/**
 * MODULE 23: Time Travel & Error Handling — SOLUTION
 */
import { createWorkflow, createStep } from '@mastra/core/workflows';
import { z } from 'zod';

const step1 = createStep({
  id: 'step1',
  inputSchema: z.object({ value: z.number() }),
  outputSchema: z.object({ doubled: z.number() }),
  execute: async ({ inputData }) => ({ doubled: inputData.value * 2 }),
});

const step2 = createStep({
  id: 'step2',
  inputSchema: z.object({ doubled: z.number() }),
  outputSchema: z.object({ result: z.string() }),
  retries: 2,
  execute: async ({ inputData }) => {
    if (inputData.doubled > 100) throw new Error('Value too large');
    return { result: `Final: ${inputData.doubled}` };
  },
});

export const debugWorkflow = createWorkflow({
  id: 'debug-workflow',
  inputSchema: z.object({ value: z.number() }),
  outputSchema: z.object({ result: z.string() }),
  options: {
    onFinish: async (result) => {
      console.log(`[onFinish] ${result.status}`);
    },
    onError: async (info) => {
      console.error(`[onError] ${info.error?.message}`);
    },
  },
})
  .then(step1)
  .then(step2)
  .commit();

export async function testErrors() {
  console.log('--- Normal run ---');
  const run1 = await debugWorkflow.createRun();
  const r1 = await run1.start({ inputData: { value: 5 } });
  console.log('Status:', r1.status);
  if (r1.status === 'success') console.log('Result:', r1.result);

  console.log('\n--- Failing run ---');
  const run2 = await debugWorkflow.createRun();
  const r2 = await run2.start({ inputData: { value: 100 } });
  console.log('Status:', r2.status);
  if (r2.status === 'failed') {
    console.log('Error:', r2.error);
    for (const [id, step] of Object.entries(r2.steps)) {
      if (step.status === 'failed') console.log(`  Step ${id} failed`);
    }
  }
}

export async function testTimeTravel() {
  console.log('--- Time travel to fix failure ---');
  const run = await debugWorkflow.createRun();

  // First run fails (100 * 2 = 200 > 100)
  const failed = await run.start({ inputData: { value: 100 } });
  console.log('Initial status:', failed.status);

  if (failed.status === 'failed') {
    // Time travel to step2 with a safe value
    const fixed = await run.timeTravel({
      step: 'step2',
      inputData: { doubled: 42 },
    });
    console.log('After time travel:', fixed.status);
    if (fixed.status === 'success') console.log('Result:', fixed.result);
  }
}

export async function runTest() {
  await testErrors();
  console.log('');
  await testTimeTravel();
}
