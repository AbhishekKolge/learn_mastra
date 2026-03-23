/**
 * MODULE 16: Workflow Basics — SOLUTION
 */

import { createWorkflow, createStep } from '@mastra/core/workflows';
import { z } from 'zod';

const normalizeStep = createStep({
  id: 'normalize',
  inputSchema: z.object({ message: z.string() }),
  outputSchema: z.object({ normalized: z.string() }),
  execute: async ({ inputData }) => ({
    normalized: inputData.message.trim().toLowerCase(),
  }),
});

const wordCountStep = createStep({
  id: 'word-count',
  inputSchema: z.object({ normalized: z.string() }),
  outputSchema: z.object({ normalized: z.string(), wordCount: z.number() }),
  execute: async ({ inputData }) => ({
    normalized: inputData.normalized,
    wordCount: inputData.normalized.split(/\s+/).filter(Boolean).length,
  }),
});

const formatStep = createStep({
  id: 'format',
  inputSchema: z.object({ normalized: z.string(), wordCount: z.number() }),
  outputSchema: z.object({ summary: z.string() }),
  execute: async ({ inputData }) => ({
    summary: `"${inputData.normalized}" has ${inputData.wordCount} words`,
  }),
});

export const textPipeline = createWorkflow({
  id: 'text-pipeline',
  inputSchema: z.object({ message: z.string() }),
  outputSchema: z.object({ summary: z.string() }),
})
  .then(normalizeStep)
  .then(wordCountStep)
  .then(formatStep)
  .commit();

export async function testStart() {
  console.log('--- run.start() ---');
  const run = await textPipeline.createRun();
  const result = await run.start({ inputData: { message: '  Hello World  ' } });

  if (result.status === 'success') {
    console.log('Result:', result.result);
  } else if (result.status === 'failed') {
    console.error('Error:', result.error);
  }
  console.log('Steps:', JSON.stringify(result.steps, null, 2));
}

export async function testStream() {
  console.log('--- run.stream() ---');
  const run = await textPipeline.createRun();
  const stream = run.stream({ inputData: { message: '  Hello World  ' } });

  for await (const chunk of stream.fullStream) {
    console.log('Chunk:', chunk.type, chunk.payload);
  }

  const result = await stream.result;
  if (result.status === 'success') {
    console.log('Final:', result.result);
  }
}

export async function runTest() {
  console.log('=== Workflow Start ===\n');
  await testStart();
  console.log('\n=== Workflow Stream ===\n');
  await testStream();
}
