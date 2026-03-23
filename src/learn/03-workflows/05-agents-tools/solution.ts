/**
 * MODULE 20: Agents & Tools in Workflows — SOLUTION
 */
import { createWorkflow, createStep } from '@mastra/core/workflows';
import { createTool } from '@mastra/core/tools';
import { Agent } from '@mastra/core/agent';
import { z } from 'zod';

const wordCountTool = createTool({
  id: 'word-count-tool',
  description: 'Counts words in text',
  inputSchema: z.object({ text: z.string() }),
  outputSchema: z.object({ count: z.number(), text: z.string() }),
  execute: async ({ text }) => ({
    count: text.split(/\s+/).filter(Boolean).length,
    text,
  }),
});

const summaryAgent = new Agent({
  id: 'summary-agent',
  name: 'Summary Agent',
  instructions: 'You summarize text in exactly one sentence.',
  model: 'anthropic/claude-sonnet-4-5',
});

const toolCallStep = createStep({
  id: 'tool-call',
  inputSchema: z.object({ text: z.string() }),
  outputSchema: z.object({ count: z.number(), text: z.string() }),
  execute: async ({ inputData, requestContext }) => {
    return await wordCountTool.execute({ text: inputData.text }, { requestContext });
  },
});

const agentCallStep = createStep({
  id: 'agent-call',
  inputSchema: z.object({ count: z.number(), text: z.string() }),
  outputSchema: z.object({ count: z.number(), summary: z.string() }),
  execute: async ({ inputData }) => {
    const response = await summaryAgent.generate(
      `Summarize this in one sentence: ${inputData.text}`
    );
    return { count: inputData.count, summary: response.text };
  },
});

export const combinedWorkflow = createWorkflow({
  id: 'combined-workflow',
  inputSchema: z.object({ text: z.string() }),
  outputSchema: z.object({ count: z.number(), summary: z.string() }),
})
  .then(toolCallStep)
  .then(agentCallStep)
  .commit();

export async function runTest() {
  const run = await combinedWorkflow.createRun();
  const result = await run.start({
    inputData: { text: 'Mastra workflows let you define complex sequences of tasks using clear structured steps.' },
  });
  if (result.status === 'success') console.log('Result:', result.result);
}
