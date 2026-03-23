/**
 * MODULE 19: Workflow State — SOLUTION
 */
import { createWorkflow, createStep } from '@mastra/core/workflows';
import { z } from 'zod';

const processStep = createStep({
  id: 'process',
  inputSchema: z.object({ item: z.string() }),
  outputSchema: z.object({ item: z.string() }),
  stateSchema: z.object({ processedItems: z.array(z.string()), count: z.number() }),
  execute: async ({ inputData, state, setState }) => {
    await setState({
      processedItems: [...state.processedItems, inputData.item],
      count: state.count + 1,
    });
    return { item: inputData.item };
  },
});

const summaryStep = createStep({
  id: 'summary',
  inputSchema: z.object({ item: z.string() }),
  outputSchema: z.object({ summary: z.string() }),
  stateSchema: z.object({ processedItems: z.array(z.string()), count: z.number() }),
  execute: async ({ state }) => ({
    summary: `Processed ${state.count} items: ${state.processedItems.join(', ')}`,
  }),
});

export const stateWorkflow = createWorkflow({
  id: 'state-workflow',
  inputSchema: z.object({ item: z.string() }),
  outputSchema: z.object({ summary: z.string() }),
  stateSchema: z.object({ processedItems: z.array(z.string()), count: z.number() }),
})
  .then(processStep)
  .then(summaryStep)
  .commit();

export async function testState() {
  const run = await stateWorkflow.createRun();
  const result = await run.start({
    inputData: { item: 'hello' },
    initialState: { processedItems: [], count: 0 },
  });
  if (result.status === 'success') console.log('Result:', result.result);
  if (result.state) console.log('Final state:', result.state);
}

export async function runTest() { await testState(); }
