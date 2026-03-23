/**
 * MODULE 18: Looping — SOLUTION
 */
import { createWorkflow, createStep } from '@mastra/core/workflows';
import { z } from 'zod';

const doubleStep = createStep({
  id: 'double',
  inputSchema: z.object({ value: z.number() }),
  outputSchema: z.object({ value: z.number() }),
  execute: async ({ inputData }) => ({ value: inputData.value * 2 }),
});

const sumStep = createStep({
  id: 'sum',
  inputSchema: z.array(z.object({ value: z.number() })),
  outputSchema: z.object({ total: z.number() }),
  execute: async ({ inputData }) => ({
    total: inputData.reduce((sum, item) => sum + item.value, 0),
  }),
});

const incrementStep = createStep({
  id: 'increment',
  inputSchema: z.object({ count: z.number() }),
  outputSchema: z.object({ count: z.number() }),
  execute: async ({ inputData }) => ({ count: inputData.count + 1 }),
});

export const foreachWorkflow = createWorkflow({
  id: 'foreach-workflow',
  inputSchema: z.array(z.object({ value: z.number() })),
  outputSchema: z.array(z.object({ value: z.number() })),
})
  .foreach(doubleStep)
  .commit();

export const foreachSumWorkflow = createWorkflow({
  id: 'foreach-sum-workflow',
  inputSchema: z.array(z.object({ value: z.number() })),
  outputSchema: z.object({ total: z.number() }),
})
  .foreach(doubleStep)
  .then(sumStep)
  .commit();

export const dountilWorkflow = createWorkflow({
  id: 'dountil-workflow',
  inputSchema: z.object({ count: z.number() }),
  outputSchema: z.object({ count: z.number() }),
})
  .dountil(incrementStep, async ({ inputData }) => inputData.count >= 5)
  .commit();

export const dowhileWorkflow = createWorkflow({
  id: 'dowhile-workflow',
  inputSchema: z.object({ count: z.number() }),
  outputSchema: z.object({ count: z.number() }),
})
  .dowhile(incrementStep, async ({ inputData }) => inputData.count < 5)
  .commit();

export async function runTest() {
  const r1 = await (await foreachWorkflow.createRun()).start({
    inputData: [{ value: 1 }, { value: 2 }, { value: 3 }],
  });
  if (r1.status === 'success') console.log('foreach:', r1.result);

  const r2 = await (await foreachSumWorkflow.createRun()).start({
    inputData: [{ value: 1 }, { value: 2 }, { value: 3 }],
  });
  if (r2.status === 'success') console.log('foreach+sum:', r2.result);

  const r3 = await (await dountilWorkflow.createRun()).start({
    inputData: { count: 0 },
  });
  if (r3.status === 'success') console.log('dountil:', r3.result);

  const r4 = await (await dowhileWorkflow.createRun()).start({
    inputData: { count: 0 },
  });
  if (r4.status === 'success') console.log('dowhile:', r4.result);
}
