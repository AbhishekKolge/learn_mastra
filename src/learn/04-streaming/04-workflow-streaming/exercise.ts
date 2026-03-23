/**
 * ============================================================
 *  MODULE 27: Workflow Streaming
 * ============================================================
 *
 *  THEORY
 *  ------
 *  Agent streaming sends you text tokens. Workflow streaming
 *  sends you STRUCTURED EVENTS about the workflow's lifecycle:
 *  which step is running, what it produced, when it finishes.
 *
 *  This is fundamentally different:
 *    Agent stream  → incremental TEXT chunks
 *    Workflow stream → LIFECYCLE events (step started, step finished, etc.)
 *
 *  CREATING AND STREAMING A WORKFLOW:
 *    const run = await workflow.createRun()
 *    const stream = await run.stream({
 *      inputData: { value: 'initial data' },
 *    })
 *
 *    for await (const chunk of stream) {
 *      console.log(chunk)
 *    }
 *
 *  WORKFLOW STREAM EVENTS:
 *    Each chunk has:
 *      { type, runId, from: 'WORKFLOW', payload }
 *
 *    Event types:
 *      'workflow-start'         → Run began
 *      'workflow-step-start'    → Step executing (stepName, args, status)
 *      'workflow-step-progress' → Foreach iteration progress
 *      'workflow-step-finish'   → Step completed
 *      'workflow-finish'        → Entire run completed
 *
 *  STREAM PROPERTIES:
 *    stream.status  → status of the workflow run
 *    stream.result  → full result after completion
 *    stream.usage   → total token usage across all steps
 *
 *  THE WRITER ARGUMENT:
 *    Just like tools have context.writer, workflow steps have a
 *    `writer` argument in their execute function:
 *
 *      createStep({
 *        execute: async ({ inputData, writer }) => {
 *          await writer?.write({
 *            type: 'custom-event',
 *            status: 'processing',
 *          })
 *          // ... do work ...
 *          return { result: 'done' }
 *        },
 *      })
 *
 *    IMPORTANT: Always `await` writer.write() calls!
 *
 *  INSPECTING CUSTOM PAYLOADS:
 *    Custom events from writer.write() appear in the stream:
 *
 *      for await (const chunk of stream) {
 *        console.log(chunk)
 *      }
 *
 *  RESUMING AN INTERRUPTED STREAM:
 *    If a stream connection drops, you can resume observing:
 *
 *      const newStream = await run.resumeStream()
 *      for await (const chunk of newStream) {
 *        console.log(chunk)
 *      }
 *
 *  RESUMING A SUSPENDED WORKFLOW WITH STREAMING:
 *    If a workflow suspends (e.g., for human approval), resume
 *    it with streaming using resumeStream():
 *
 *      const resumedStream = await run.resumeStream({
 *        resumeData: { value: 'resume data' },
 *      })
 *      for await (const chunk of resumedStream) {
 *        console.log(chunk)
 *      }
 *
 *  EXERCISE
 *  --------
 *  Build a multi-step workflow that streams progress updates
 *  via the writer argument and observe all lifecycle events.
 * ============================================================
 */

import { createWorkflow, createStep } from '@mastra/core/workflows';
import { z } from 'zod';

// ─── TODO 1: Create a step with writer ───────────────────────
// Build a "validate" step that uses writer to send progress.
//
// createStep({
//   id: 'validate',
//   inputSchema: z.object({ data: z.string() }),
//   outputSchema: z.object({ data: z.string(), isValid: z.boolean() }),
//   execute: async ({ inputData, writer }) => {
//     await writer?.write({ type: 'validation', status: 'checking-format' })
//     await new Promise(r => setTimeout(r, 300))
//
//     await writer?.write({ type: 'validation', status: 'checking-length' })
//     await new Promise(r => setTimeout(r, 300))
//
//     const isValid = inputData.data.length > 0
//     await writer?.write({ type: 'validation', status: 'complete', isValid })
//
//     return { data: inputData.data, isValid }
//   },
// })

const validateStep = undefined as any; // ← replace

// ─── TODO 2: Create a "transform" step with writer ───────────
// Transforms the data and writes progress updates.
//
// createStep({
//   id: 'transform',
//   inputSchema: z.object({ data: z.string(), isValid: z.boolean() }),
//   outputSchema: z.object({ transformed: z.string(), operations: z.number() }),
//   execute: async ({ inputData, writer }) => {
//     if (!inputData.isValid) {
//       return { transformed: '', operations: 0 }
//     }
//
//     const ops = ['trim', 'lowercase', 'reverse']
//     let result = inputData.data
//
//     for (const op of ops) {
//       await writer?.write({ type: 'transform', operation: op, status: 'running' })
//       await new Promise(r => setTimeout(r, 200))
//
//       switch (op) {
//         case 'trim': result = result.trim(); break
//         case 'lowercase': result = result.toLowerCase(); break
//         case 'reverse': result = result.split('').reverse().join(''); break
//       }
//
//       await writer?.write({ type: 'transform', operation: op, status: 'done' })
//     }
//
//     return { transformed: result, operations: ops.length }
//   },
// })

const transformStep = undefined as any; // ← replace

// ─── TODO 3: Create a "report" step ─────────────────────────
// Produces a summary report.
//
// createStep({
//   id: 'report',
//   inputSchema: z.object({ transformed: z.string(), operations: z.number() }),
//   outputSchema: z.object({ report: z.string() }),
//   execute: async ({ inputData, writer }) => {
//     await writer?.write({ type: 'report', status: 'generating' })
//     const report = `Processed "${inputData.transformed}" with ${inputData.operations} operations`
//     await writer?.write({ type: 'report', status: 'done' })
//     return { report }
//   },
// })

const reportStep = undefined as any; // ← replace

// ─── TODO 4: Create the workflow ─────────────────────────────
// Chain validate → transform → report
//
// createWorkflow({
//   id: 'data-pipeline',
//   inputSchema: z.object({ data: z.string() }),
//   outputSchema: z.object({ report: z.string() }),
// })
//   .then(validateStep)
//   .then(transformStep)
//   .then(reportStep)
//   .commit()

export const dataPipeline = undefined as any; // ← replace

// ─── TODO 5: Stream and observe lifecycle events ─────────────
// Create a run, stream it, and log all chunk types.
// Separate lifecycle events from custom events.
//
// Hint:
//   const run = await dataPipeline.createRun()
//   const stream = await run.stream({
//     inputData: { data: '  Hello World  ' },
//   })
//
//   for await (const chunk of stream) {
//     if (chunk.type.startsWith('workflow-')) {
//       console.log('[LIFECYCLE]', chunk.type, chunk.payload?.stepName || '')
//     } else {
//       console.log('[CUSTOM]', chunk)
//     }
//   }

export async function testLifecycleEvents() {
  console.log('--- Lifecycle Events ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 6: Filter custom writer events ─────────────────────
// Stream the workflow and only log events from the writer
// (type: 'validation', 'transform', 'report').

export async function testCustomEvents() {
  console.log('--- Custom Writer Events ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 7: Access stream result and status ─────────────────
// After consuming the stream, access the final result.
//
// Hint:
//   const run = await dataPipeline.createRun()
//   const stream = await run.stream({ inputData: { data: 'test' } })
//   for await (const chunk of stream) { /* consume */ }
//
//   // stream properties are available on run after consumption
//   console.log('Result:', result)

export async function testStreamResult() {
  console.log('--- Stream Result ---');
  // TODO: implement
  console.log('TODO: implement');
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
