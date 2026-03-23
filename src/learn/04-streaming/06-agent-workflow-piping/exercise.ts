/**
 * ============================================================
 *  MODULE 29: Piping Agent Streams to Workflow Steps
 * ============================================================
 *
 *  THEORY
 *  ------
 *  Module 28 showed piping agent streams into TOOLS.
 *  This module shows piping agent streams into WORKFLOW STEPS.
 *
 *  The concept is similar but the API differs slightly:
 *    Tool:     stream.fullStream.pipeTo(context.writer)
 *    Workflow: stream.textStream.pipeTo(writer)
 *
 *  WHY textStream FOR WORKFLOWS?
 *    Workflow steps receive a `writer` argument (not context.writer).
 *    This writer is a WritableStream<string> — it expects text chunks.
 *    So we pipe textStream (which yields strings) instead of
 *    fullStream (which yields structured objects).
 *
 *  THE PATTERN:
 *    Workflow step → calls Agent.stream() → pipes textStream → step writer
 *
 *    createStep({
 *      execute: async ({ inputData, mastra, writer }) => {
 *        const agent = mastra?.getAgent('myAgent')
 *        const stream = await agent?.stream('prompt')
 *
 *        // Pipe agent's text to the workflow step's writer
 *        await stream!.textStream.pipeTo(writer!)
 *
 *        return { value: await stream!.text }
 *      },
 *    })
 *
 *  KEY DETAILS:
 *
 *  1. The step's `writer` is different from a tool's `context.writer`:
 *     - Tool writer: accepts structured objects (write/custom methods)
 *     - Step writer: a WritableStream that accepts text chunks
 *
 *  2. Usage aggregation:
 *     Like tools, Mastra automatically aggregates the agent's usage
 *     into the workflow run. Access via stream.usage after completion.
 *
 *  3. Custom events + piping:
 *     You can write custom events with writer.write() BEFORE piping.
 *     After pipeTo() completes, the writer is closed.
 *     So: custom events first, then pipe.
 *
 *  WORKFLOW → AGENT → TOOL chain:
 *    You can even have a workflow step that calls an agent,
 *    which itself calls tools with streaming. The entire chain
 *    of events propagates up through the streams.
 *
 *  REAL-WORLD USE CASE:
 *    A content generation workflow where:
 *      Step 1: Gather requirements (pure logic)
 *      Step 2: Write draft (agent + textStream piped to writer)
 *      Step 3: Review (agent + textStream piped to writer)
 *      Step 4: Format output (pure logic)
 *
 *    The user sees the draft and review text stream in real-time,
 *    while the workflow controls the overall process.
 *
 *  EXERCISE
 *  --------
 *  Build a content generation workflow where agent streams
 *  are piped through workflow steps.
 * ============================================================
 */

import { Agent } from '@mastra/core/agent';
import { createWorkflow, createStep } from '@mastra/core/workflows';
import { z } from 'zod';

// ─── TODO 1: Create agents for the workflow ──────────────────
// Create two agents: a writer and an editor.
// Register both in src/mastra/index.ts.
//
// Writer agent:
//   id: 'draft-writer'
//   instructions: Write a short paragraph on any given topic.
//
// Editor agent:
//   id: 'draft-editor'
//   instructions: Edit text to be more concise and engaging.
//                 Return the improved version only.

export const draftWriter = undefined as any; // ← replace
export const draftEditor = undefined as any; // ← replace

// ─── TODO 2: Create a step that pipes agent textStream ──────
// Build a "write-draft" step that:
//   1. Gets the draft-writer agent from mastra
//   2. Calls agent.stream() with the topic
//   3. Pipes textStream to the step's writer
//   4. Returns the full text
//
// createStep({
//   id: 'write-draft',
//   inputSchema: z.object({ topic: z.string() }),
//   outputSchema: z.object({ draft: z.string() }),
//   execute: async ({ inputData, mastra, writer }) => {
//     const agent = mastra?.getAgent('draftWriter')
//     const stream = await agent?.stream(
//       `Write a paragraph about: ${inputData.topic}`
//     )
//
//     await stream!.textStream.pipeTo(writer!)
//
//     return { draft: await stream!.text }
//   },
// })

const writeDraftStep = undefined as any; // ← replace

// ─── TODO 3: Create an edit step that also pipes ─────────────
// Build an "edit-draft" step that:
//   1. Gets the draft-editor agent from mastra
//   2. Pipes the editor's textStream to the step writer
//   3. Returns the edited text
//
// createStep({
//   id: 'edit-draft',
//   inputSchema: z.object({ draft: z.string() }),
//   outputSchema: z.object({ edited: z.string() }),
//   execute: async ({ inputData, mastra, writer }) => {
//     const agent = mastra?.getAgent('draftEditor')
//     const stream = await agent?.stream(
//       `Edit this text:\n${inputData.draft}`
//     )
//
//     await stream!.textStream.pipeTo(writer!)
//
//     return { edited: await stream!.text }
//   },
// })

const editDraftStep = undefined as any; // ← replace

// ─── TODO 4: Create a pure logic step (no agent) ────────────
// Format the final output — no streaming needed here.
//
// createStep({
//   id: 'format-output',
//   inputSchema: z.object({ edited: z.string() }),
//   outputSchema: z.object({ article: z.string() }),
//   execute: async ({ inputData }) => {
//     const article = `--- Final Article ---\n\n${inputData.edited}\n\n--- End ---`
//     return { article }
//   },
// })

const formatStep = undefined as any; // ← replace

// ─── TODO 5: Create the workflow ─────────────────────────────
// Chain: write-draft → edit-draft → format-output
//
// createWorkflow({
//   id: 'content-generator',
//   inputSchema: z.object({ topic: z.string() }),
//   outputSchema: z.object({ article: z.string() }),
// })
//   .then(writeDraftStep)
//   .then(editDraftStep)
//   .then(formatStep)
//   .commit()

export const contentGenerator = undefined as any; // ← replace

// ─── TODO 6: Stream and observe agent text through workflow ──
// Create a run, stream it, and observe the agent's text
// flowing through the workflow steps.
//
// Hint:
//   const run = await contentGenerator.createRun()
//   const stream = await run.stream({
//     inputData: { topic: 'the future of AI' },
//   })
//
//   for await (const chunk of stream) {
//     if (chunk.type === 'workflow-step-start') {
//       console.log(`\n[STEP] ${chunk.payload.stepName} starting...`)
//     }
//     // Agent text piped through the step appears in the stream
//     console.log(chunk.type, JSON.stringify(chunk.payload).slice(0, 80))
//   }

export async function testAgentWorkflowPipe() {
  console.log('--- Agent→Workflow Piping ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 7: Get final result after streaming ────────────────
// Run with start() to get the final formatted article.

export async function testFinalResult() {
  console.log('--- Final Result ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── Run all tests ───────────────────────────────────────────
export async function runTest() {
  console.log('=== Agent→Workflow Piping ===\n');

  await testAgentWorkflowPipe();

  console.log('\n\n');
  await testFinalResult();
}
