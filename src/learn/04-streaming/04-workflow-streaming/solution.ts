/**
 * MODULE 27: Workflow Streaming — SOLUTION
 */

import { createWorkflow, createStep } from '@mastra/core/workflows';
import { z } from 'zod';

// ─── TODO 1: Create a step with writer ───────────────────────
const validateStep = createStep({
  id: 'validate',
  inputSchema: z.object({ data: z.string() }),
  outputSchema: z.object({ data: z.string(), isValid: z.boolean() }),
  execute: async ({ inputData, writer }) => {
    await writer?.write({ type: 'validation', status: 'checking-format' });
    await new Promise(r => setTimeout(r, 300));

    await writer?.write({ type: 'validation', status: 'checking-length' });
    await new Promise(r => setTimeout(r, 300));

    const isValid = inputData.data.length > 0;
    await writer?.write({ type: 'validation', status: 'complete', isValid });

    return { data: inputData.data, isValid };
  },
});

// ─── TODO 2: Create a "transform" step with writer ───────────
const transformStep = createStep({
  id: 'transform',
  inputSchema: z.object({ data: z.string(), isValid: z.boolean() }),
  outputSchema: z.object({ transformed: z.string(), operations: z.number() }),
  execute: async ({ inputData, writer }) => {
    if (!inputData.isValid) {
      return { transformed: '', operations: 0 };
    }

    const ops = ['trim', 'lowercase', 'reverse'];
    let result = inputData.data;

    for (const op of ops) {
      await writer?.write({ type: 'transform', operation: op, status: 'running' });
      await new Promise(r => setTimeout(r, 200));

      switch (op) {
        case 'trim': result = result.trim(); break;
        case 'lowercase': result = result.toLowerCase(); break;
        case 'reverse': result = result.split('').reverse().join(''); break;
      }

      await writer?.write({ type: 'transform', operation: op, status: 'done' });
    }

    return { transformed: result, operations: ops.length };
  },
});

// ─── TODO 3: Create a "report" step ─────────────────────────
const reportStep = createStep({
  id: 'report',
  inputSchema: z.object({ transformed: z.string(), operations: z.number() }),
  outputSchema: z.object({ report: z.string() }),
  execute: async ({ inputData, writer }) => {
    await writer?.write({ type: 'report', status: 'generating' });
    const report = `Processed "${inputData.transformed}" with ${inputData.operations} operations`;
    await writer?.write({ type: 'report', status: 'done' });
    return { report };
  },
});

// ─── TODO 4: Create the workflow ─────────────────────────────
export const dataPipeline = createWorkflow({
  id: 'data-pipeline',
  inputSchema: z.object({ data: z.string() }),
  outputSchema: z.object({ report: z.string() }),
})
  .then(validateStep)
  .then(transformStep)
  .then(reportStep)
  .commit();

// ─── TODO 5: Stream and observe lifecycle events ─────────────
export async function testLifecycleEvents() {
  console.log('--- Lifecycle Events ---');

  const run = await dataPipeline.createRun();
  const stream = await run.stream({
    inputData: { data: '  Hello World  ' },
  });

  for await (const chunk of stream) {
    if (chunk.type?.startsWith('workflow-')) {
      console.log(
        `[LIFECYCLE] ${chunk.type}`,
        chunk.payload?.stepName || '',
        chunk.payload?.status || ''
      );
    } else {
      console.log(`[CUSTOM] ${JSON.stringify(chunk).slice(0, 100)}`);
    }
  }
}

// ─── TODO 6: Filter custom writer events ─────────────────────
export async function testCustomEvents() {
  console.log('--- Custom Writer Events ---');

  const run = await dataPipeline.createRun();
  const stream = await run.stream({
    inputData: { data: '  Streaming Is Cool  ' },
  });

  for await (const chunk of stream) {
    const payload = chunk.payload;
    if (payload?.type === 'validation') {
      console.log(`[VALIDATE] ${payload.status}${payload.isValid !== undefined ? ` → valid: ${payload.isValid}` : ''}`);
    } else if (payload?.type === 'transform') {
      console.log(`[TRANSFORM] ${payload.operation}: ${payload.status}`);
    } else if (payload?.type === 'report') {
      console.log(`[REPORT] ${payload.status}`);
    }
  }
}

// ─── TODO 7: Access stream result and status ─────────────────
export async function testStreamResult() {
  console.log('--- Stream Result ---');

  const run = await dataPipeline.createRun();
  const stream = await run.stream({
    inputData: { data: '  Test Data  ' },
  });

  // Consume the stream
  for await (const chunk of stream) {
    // consume all events
  }

  // Access result via run.start() on a fresh run
  const run2 = await dataPipeline.createRun();
  const result = await run2.start({
    inputData: { data: '  Test Data  ' },
  });

  console.log('Status:', result.status);
  if (result.status === 'success') {
    console.log('Result:', result.result);
  }
  console.log('Steps:', JSON.stringify(result.steps, null, 2));
}

// ─── Run all tests ───────────────────────────────────────────
export async function runTest() {
  console.log('=== Workflow Streaming ===\n');

  await testLifecycleEvents();

  console.log('\n\n');
  await testCustomEvents();

  console.log('\n\n');
  await testStreamResult();
}
