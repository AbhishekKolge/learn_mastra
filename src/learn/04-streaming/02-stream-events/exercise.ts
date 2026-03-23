/**
 * ============================================================
 *  MODULE 25: Stream Events
 * ============================================================
 *
 *  THEORY
 *  ------
 *  In Module 24 we used `stream.textStream` to get text chunks.
 *  But there's more happening under the hood. Every stream emits
 *  a sequence of TYPED EVENTS that describe exactly what's
 *  happening at each moment.
 *
 *  Instead of just getting text, you can inspect the raw stream
 *  to see events like "the agent started", "a tool was called",
 *  "the tool returned a result", "the agent finished", etc.
 *
 *  EVENT TYPES (Agent streams):
 *    'start'        → Agent run begins
 *    'step-start'   → A generation step begins (messageId, etc.)
 *    'text-delta'   → Incremental text chunk from the LLM
 *    'tool-call'    → Agent decided to use a tool (toolName, args)
 *    'tool-result'  → Tool returned a result
 *    'step-finish'  → A step completed (finishReason, etc.)
 *    'finish'       → Agent run complete (usage statistics)
 *
 *  EVENT STRUCTURE:
 *    Each event has:
 *      { type: string, from: 'AGENT', payload: { ... } }
 *
 *    'from' tells you the source: 'AGENT' or 'WORKFLOW'
 *
 *  INSPECTING THE RAW STREAM:
 *    Instead of iterating `stream.textStream`, iterate the
 *    stream itself:
 *
 *      const stream = await agent.stream('prompt')
 *      for await (const chunk of stream) {
 *        console.log(chunk.type, chunk.payload)
 *      }
 *
 *  FILTERING EVENTS:
 *    You can filter by type to handle specific events:
 *
 *      for await (const chunk of stream) {
 *        if (chunk.type === 'tool-call') {
 *          console.log('Tool called:', chunk.payload.toolName)
 *        }
 *        if (chunk.type === 'text-delta') {
 *          process.stdout.write(chunk.payload.textDelta)
 *        }
 *      }
 *
 *  WORKFLOW EVENTS:
 *    Workflows emit different events:
 *      'workflow-start'         → Workflow run begins
 *      'workflow-step-start'    → A step begins (stepName, args)
 *      'workflow-step-progress' → Foreach iteration progress
 *      'workflow-step-finish'   → A step completes
 *      'workflow-finish'        → Workflow run complete
 *
 *    Workflow events include runId and from: 'WORKFLOW'
 *
 *  FOREACH PROGRESS EVENTS:
 *    When using .foreach(), each iteration emits progress:
 *      {
 *        type: 'workflow-step-progress',
 *        payload: {
 *          id, completedCount, totalCount,
 *          currentIndex, iterationStatus, iterationOutput
 *        }
 *      }
 *
 *  EXERCISE
 *  --------
 *  Create an agent with a tool, stream it, and inspect all
 *  event types that are emitted.
 * ============================================================
 */

import { Agent } from '@mastra/core/agent';
import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

// ─── TODO 1: Create a tool for the agent ─────────────────────
// Create a simple calculator tool that adds two numbers.
// This will let us see tool-call and tool-result events.
//
// createTool({
//   id: 'calculator',
//   description: 'Add two numbers together',
//   inputSchema: z.object({ a: z.number(), b: z.number() }),
//   outputSchema: z.object({ result: z.number() }),
//   execute: async ({ context: { a, b } }) => ({ result: a + b }),
// })

const calculatorTool = undefined as any; // ← replace

// ─── TODO 2: Create an agent with the tool ───────────────────
// Create a "Math Tutor" agent that has the calculator tool.
//
// id: 'math-tutor'
// instructions: You are a math tutor. Use the calculator tool
//               to compute results. Explain your reasoning.
// model: 'anthropic/claude-sonnet-4-5'
// tools: { calculatorTool }

export const mathTutor = undefined as any; // ← replace

// ─── TODO 3: Inspect all raw stream events ───────────────────
// Stream a prompt that will trigger tool use, then log every
// event with its type.
//
// Hint:
//   const stream = await mathTutor.stream('What is 42 + 58?')
//   for await (const chunk of stream) {
//     console.log(`[${chunk.type}]`, JSON.stringify(chunk.payload).slice(0, 100))
//   }

export async function testRawEvents() {
  console.log('--- Raw Stream Events ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 4: Filter specific event types ─────────────────────
// Stream a prompt and only handle specific events:
//   - 'text-delta'  → write text to stdout
//   - 'tool-call'   → log the tool name and arguments
//   - 'tool-result' → log the tool result
//   - 'finish'      → log usage stats
//
// Hint:
//   for await (const chunk of stream) {
//     switch (chunk.type) {
//       case 'text-delta':
//         process.stdout.write(chunk.payload.textDelta)
//         break
//       case 'tool-call':
//         console.log('\nTool:', chunk.payload.toolName, chunk.payload.args)
//         break
//       // ... etc
//     }
//   }

export async function testFilterEvents() {
  console.log('--- Filtered Events ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 5: Count events by type ────────────────────────────
// Stream a prompt and count how many of each event type occur.
// Print a summary at the end.
//
// Hint:
//   const counts: Record<string, number> = {}
//   for await (const chunk of stream) {
//     counts[chunk.type] = (counts[chunk.type] || 0) + 1
//   }
//   console.log('Event counts:', counts)

export async function testCountEvents() {
  console.log('--- Event Counts ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 6: Build a simple event logger ─────────────────────
// Create a function that takes an agent and a prompt, streams
// it, and returns a structured log of all events with timestamps.
//
// type EventLog = { timestamp: number; type: string; summary: string }[]
//
// For each event:
//   'start'       → summary: 'Agent started'
//   'text-delta'  → summary: first 30 chars of textDelta
//   'tool-call'   → summary: `Called ${toolName}`
//   'tool-result' → summary: `Result from ${toolName}`
//   'step-finish' → summary: `Step finished: ${finishReason}`
//   'finish'      → summary: `Done. Tokens: ${totalTokens}`

export async function testEventLogger() {
  console.log('--- Event Logger ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── Run all tests ───────────────────────────────────────────
export async function runTest() {
  console.log('=== Stream Events ===\n');

  await testRawEvents();

  console.log('\n\n');
  await testFilterEvents();

  console.log('\n\n');
  await testCountEvents();

  console.log('\n\n');
  await testEventLogger();
}
