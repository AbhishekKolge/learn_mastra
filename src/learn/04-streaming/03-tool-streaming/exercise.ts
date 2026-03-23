/**
 * ============================================================
 *  MODULE 26: Tool Streaming
 * ============================================================
 *
 *  THEORY
 *  ------
 *  In Modules 24-25, we streamed agent output — the LLM's text
 *  response. But what about TOOLS? Normally, a tool runs and
 *  returns its result only when finished. The user waits in silence.
 *
 *  Tool streaming fixes this. It lets tools send INCREMENTAL
 *  results while they execute. Think: a search tool showing
 *  results one-by-one, or a build tool showing compile progress.
 *
 *  HOW IT WORKS:
 *  Every tool's execute() function receives a `context` object.
 *  Inside context is a `writer` — a writable stream you can
 *  push updates into as the tool runs.
 *
 *  context.writer:
 *    Two methods for emitting data:
 *
 *    1. writer.write(data)
 *       Writes into the tool-result payload. Downstream consumers
 *       see it inside chunk.payload.output when inspecting the stream.
 *
 *       await context.writer.write({
 *         type: 'custom-event',
 *         status: 'pending',
 *       })
 *
 *    2. writer.custom(data)
 *       Emits a TOP-LEVEL stream chunk (not nested in tool-result).
 *       Useful for UI frameworks that listen for specific data types.
 *
 *       await context.writer.custom({
 *         type: 'data-progress',
 *         data: { percent: 50 },
 *       })
 *
 *  CRITICAL RULE:
 *    You MUST `await` every writer.write() and writer.custom() call.
 *    Forgetting `await` locks the stream → "WritableStream is locked" error.
 *
 *  TRANSIENT CHUNKS:
 *    By default, data-* chunks from writer.custom() are persisted
 *    to storage as part of message history. For high-frequency or
 *    verbose data that's only needed during live streaming, set
 *    `transient: true`:
 *
 *      await context.writer.custom({
 *        type: 'data-build-log',
 *        data: { line: 'Compiling module 3 of 12...' },
 *        transient: true,  // not saved to DB
 *      })
 *
 *    After a page refresh, transient chunks are gone — only the
 *    tool's return value and non-transient chunks are loaded.
 *
 *  TOOL LIFECYCLE HOOKS:
 *    Tools support hooks to monitor execution stages:
 *
 *    onInputStart({ toolCallId })
 *      → Tool call input streaming begins
 *
 *    onInputDelta({ delta, toolCallId })
 *      → Each chunk of input as it streams in
 *
 *    onInputAvailable({ input, toolCallId })
 *      → Complete input is parsed and validated
 *
 *    onOutput({ output, toolName })
 *      → Tool executed successfully, output available
 *
 *    These are great for logging, analytics, or progress tracking.
 *
 *  INSPECTING TOOL STREAM PAYLOADS:
 *    Events written by the tool appear in the agent's stream:
 *
 *      for await (const chunk of stream) {
 *        if (chunk.payload?.output?.type === 'custom-event') {
 *          console.log(chunk.payload.output)
 *        }
 *      }
 *
 *  EXERCISE
 *  --------
 *  Build tools that stream progress updates as they execute,
 *  use lifecycle hooks, and explore transient chunks.
 * ============================================================
 */

import { Agent } from '@mastra/core/agent';
import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

// ─── TODO 1: Create a tool with context.writer ──────────────
// Build a "data-fetcher" tool that simulates fetching data
// in stages, writing progress updates via context.writer.
//
// createTool({
//   id: 'data-fetcher',
//   description: 'Fetches data from multiple sources with progress updates',
//   inputSchema: z.object({ query: z.string() }),
//   outputSchema: z.object({ results: z.array(z.string()), totalSources: z.number() }),
//   execute: async (inputData, context) => {
//     const sources = ['database', 'cache', 'api'];
//     const results: string[] = [];
//
//     for (const source of sources) {
//       await context?.writer?.write({
//         type: 'fetch-progress',
//         source,
//         status: 'fetching',
//       });
//
//       // Simulate async work
//       await new Promise(r => setTimeout(r, 500));
//       results.push(`Result from ${source} for "${inputData.query}"`);
//
//       await context?.writer?.write({
//         type: 'fetch-progress',
//         source,
//         status: 'done',
//       });
//     }
//
//     return { results, totalSources: sources.length };
//   },
// })

const dataFetcher = undefined as any; // ← replace

// ─── TODO 2: Create a tool with writer.custom() ─────────────
// Build a "build-runner" tool that emits top-level stream
// chunks using writer.custom(). These appear as first-class
// stream events, not nested inside tool-result.
//
// createTool({
//   id: 'build-runner',
//   description: 'Runs a simulated build process with live progress',
//   inputSchema: z.object({ project: z.string() }),
//   outputSchema: z.object({ success: z.boolean(), duration: z.number() }),
//   execute: async (inputData, context) => {
//     const steps = ['lint', 'compile', 'test', 'bundle'];
//     const start = Date.now();
//
//     for (let i = 0; i < steps.length; i++) {
//       await context?.writer?.custom({
//         type: 'data-build-progress',
//         data: {
//           step: steps[i],
//           progress: Math.round(((i + 1) / steps.length) * 100),
//         },
//       });
//       await new Promise(r => setTimeout(r, 300));
//     }
//
//     return { success: true, duration: Date.now() - start };
//   },
// })

const buildRunner = undefined as any; // ← replace

// ─── TODO 3: Create a tool with transient chunks ─────────────
// Build a "log-streamer" tool that emits verbose build logs
// as transient chunks (not persisted to storage).
//
// createTool({
//   id: 'log-streamer',
//   description: 'Streams verbose logs during execution',
//   inputSchema: z.object({ task: z.string() }),
//   outputSchema: z.object({ linesEmitted: z.number() }),
//   execute: async (inputData, context) => {
//     const logs = [
//       'Starting task...',
//       'Loading configuration...',
//       'Processing input data...',
//       'Running transformations...',
//       'Finalizing output...',
//     ];
//
//     for (const line of logs) {
//       await context?.writer?.custom({
//         type: 'data-build-log',
//         data: { line, task: inputData.task },
//         transient: true,  // won't be saved to DB
//       });
//       await new Promise(r => setTimeout(r, 200));
//     }
//
//     return { linesEmitted: logs.length };
//   },
// })

const logStreamer = undefined as any; // ← replace

// ─── TODO 4: Create a tool with lifecycle hooks ──────────────
// Build a tool with onInputAvailable and onOutput hooks.
//
// createTool({
//   id: 'weather-lookup',
//   description: 'Look up weather for a city',
//   inputSchema: z.object({ city: z.string() }),
//   outputSchema: z.object({ temperature: z.number(), conditions: z.string() }),
//   onInputAvailable: ({ input, toolCallId }) => {
//     console.log(`[HOOK] Weather requested for: ${input.city} (${toolCallId})`);
//   },
//   execute: async (input) => {
//     return { temperature: 72, conditions: 'Sunny' };
//   },
//   onOutput: ({ output, toolName }) => {
//     console.log(`[HOOK] ${toolName} result: ${output.temperature}°F, ${output.conditions}`);
//   },
// })

const weatherLookup = undefined as any; // ← replace

// ─── TODO 5: Create an agent with all tools ──────────────────
// Create an agent that has all four tools.

export const toolStreamAgent = undefined as any; // ← replace

// ─── TODO 6: Test writer.write() — inspect nested payloads ──
// Stream a prompt that uses the data-fetcher tool.
// Filter for chunks where payload.output.type === 'fetch-progress'.
//
// Hint:
//   const stream = await toolStreamAgent.stream('Fetch data about TypeScript')
//   for await (const chunk of stream) {
//     if (chunk.payload?.output?.type === 'fetch-progress') {
//       console.log('Progress:', chunk.payload.output)
//     }
//   }

export async function testWriterWrite() {
  console.log('--- writer.write() ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 7: Test writer.custom() — top-level chunks ─────────
// Stream a prompt that uses the build-runner tool.
// Look for chunks with type containing 'data-build-progress'.

export async function testWriterCustom() {
  console.log('--- writer.custom() ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 8: Test lifecycle hooks ────────────────────────────
// Stream a prompt using the weather tool.
// The hooks log to console automatically — just stream and observe.

export async function testLifecycleHooks() {
  console.log('--- Lifecycle Hooks ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── Run all tests ───────────────────────────────────────────
export async function runTest() {
  console.log('=== Tool Streaming ===\n');

  await testWriterWrite();

  console.log('\n\n');
  await testWriterCustom();

  console.log('\n\n');
  await testLifecycleHooks();
}
