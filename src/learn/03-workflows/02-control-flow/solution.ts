/**
 * MODULE 17: Control Flow — SOLUTION
 */
import { createWorkflow, createStep } from '@mastra/core/workflows';
import { z } from 'zod';

const toUpperStep = createStep({
  id: 'to-upper',
  inputSchema: z.object({ message: z.string() }),
  outputSchema: z.object({ upper: z.string() }),
  execute: async ({ inputData }) => ({ upper: inputData.message.toUpperCase() }),
});

const countLengthStep = createStep({
  id: 'count-length',
  inputSchema: z.object({ message: z.string() }),
  outputSchema: z.object({ length: z.number() }),
  execute: async ({ inputData }) => ({ length: inputData.message.length }),
});

const combineStep = createStep({
  id: 'combine',
  inputSchema: z.object({
    'to-upper': z.object({ upper: z.string() }),
    'count-length': z.object({ length: z.number() }),
  }),
  outputSchema: z.object({ combined: z.string() }),
  execute: async ({ inputData }) => ({
    combined: `${inputData['to-upper'].upper} (${inputData['count-length'].length} chars)`,
  }),
});

export const parallelWorkflow = createWorkflow({
  id: 'parallel-workflow',
  inputSchema: z.object({ message: z.string() }),
  outputSchema: z.object({ combined: z.string() }),
})
  .parallel([toUpperStep, countLengthStep])
  .then(combineStep)
  .commit();

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

export const branchWorkflow = createWorkflow({
  id: 'branch-workflow',
  inputSchema: z.object({ value: z.number() }),
  outputSchema: z.object({ result: z.string() }),
})
  .branch([
    [async ({ inputData }) => inputData.value > 100, expensiveStep],
    [async ({ inputData }) => inputData.value <= 100, cheapStep],
  ])
  .map(async ({ inputData }) => {
    const result = inputData['expensive']?.result || inputData['cheap']?.result;
    return { result: result! };
  })
  .commit();

export async function testParallel() {
  const run = await parallelWorkflow.createRun();
  const result = await run.start({ inputData: { message: 'hello world' } });
  if (result.status === 'success') console.log('Result:', result.result);
}

export async function testBranch() {
  const run1 = await branchWorkflow.createRun();
  const r1 = await run1.start({ inputData: { value: 150 } });
  if (r1.status === 'success') console.log('High:', r1.result);

  const run2 = await branchWorkflow.createRun();
  const r2 = await run2.start({ inputData: { value: 50 } });
  if (r2.status === 'success') console.log('Low:', r2.result);
}

export async function runTest() {
  await testParallel();
  await testBranch();
}
