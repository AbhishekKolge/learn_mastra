/**
 * ============================================================
 *  MODULE 16: Workflow Basics
 * ============================================================
 *
 *  THEORY
 *  ------
 *  Agents are great for open-ended tasks. But when you know the
 *  EXACT steps in advance, workflows give you full control.
 *
 *  AGENT vs WORKFLOW:
 *    Agent:    "Here's the goal — figure out the steps"
 *    Workflow: "Here are the exact steps — execute them in order"
 *
 *  A workflow is a sequence of STEPS. Each step:
 *    - Has an inputSchema (what data it needs)
 *    - Has an outputSchema (what data it returns)
 *    - Has an execute function (what it does)
 *    - Receives the previous step's output as its inputData
 *
 *  CREATING A STEP:
 *    createStep({
 *      id: 'my-step',
 *      inputSchema: z.object({ message: z.string() }),
 *      outputSchema: z.object({ result: z.string() }),
 *      execute: async ({ inputData }) => {
 *        return { result: inputData.message.toUpperCase() };
 *      },
 *    })
 *
 *  CREATING A WORKFLOW:
 *    createWorkflow({
 *      id: 'my-workflow',
 *      inputSchema: z.object({ message: z.string() }),
 *      outputSchema: z.object({ result: z.string() }),
 *    })
 *      .then(step1)
 *      .then(step2)
 *      .commit()        // ← finalize the workflow
 *
 *  SCHEMA RULES (critical!):
 *    1. First step's inputSchema MUST match workflow's inputSchema
 *    2. Last step's outputSchema MUST match workflow's outputSchema
 *    3. Each step's outputSchema MUST match the next step's inputSchema
 *    4. If schemas don't match, use .map() to transform data
 *
 *  RUNNING A WORKFLOW:
 *    const run = await workflow.createRun()
 *
 *    // Option 1: Start (waits for full result)
 *    const result = await run.start({ inputData: { message: 'hello' } })
 *
 *    // Option 2: Stream (emits events during execution)
 *    const stream = run.stream({ inputData: { message: 'hello' } })
 *    for await (const chunk of stream.fullStream) { console.log(chunk) }
 *    const result = await stream.result
 *
 *  RESULT STATUS (discriminated union):
 *    result.status can be:
 *      'success'   → result.result has the output
 *      'failed'    → result.error has the error
 *      'suspended' → result.suspendPayload + result.suspended[]
 *      'tripwire'  → result.tripwire (reason, processorId)
 *      'paused'    → only common properties
 *
 *    Always check result.status first!
 *    result.steps has individual step results regardless of status.
 *
 *  REGISTRATION:
 *    Register in Mastra instance for shared access:
 *      new Mastra({ workflows: { myWorkflow } })
 *    Retrieve with: mastra.getWorkflow('myWorkflow')
 *
 *  WORKFLOWS AS STEPS:
 *    Use a workflow as a step inside another workflow:
 *      parentWorkflow.then(childWorkflow).commit()
 *
 *  CLONE WORKFLOW:
 *    Reuse logic under a new ID for separate tracking:
 *      const cloned = cloneWorkflow(original, { id: 'cloned' })
 *
 *  RESTARTING ACTIVE RUNS:
 *    workflow.restartAllActiveWorkflowRuns()  → restart all
 *    run.restart()                            → restart one
 *    workflow.listActiveWorkflowRuns()        → find active runs
 *
 *  EXERCISE
 *  --------
 *  Build a text processing pipeline with 3 steps.
 * ============================================================
 */

import { createWorkflow, createStep } from '@mastra/core/workflows';
import { z } from 'zod';

// ─── TODO 1: Create Step 1 — Normalize ──────────────────────
// Takes a message string, returns it trimmed and lowercased.
//
// inputSchema:  { message: z.string() }
// outputSchema: { normalized: z.string() }
// execute: trim + lowercase the message

const normalizeStep = undefined as any; // ← replace

// ─── TODO 2: Create Step 2 — Word Count ─────────────────────
// Takes the normalized string, returns word count.
//
// inputSchema:  { normalized: z.string() }
// outputSchema: { normalized: z.string(), wordCount: z.number() }
// execute: split by spaces and count

const wordCountStep = undefined as any; // ← replace

// ─── TODO 3: Create Step 3 — Format Output ──────────────────
// Takes normalized + wordCount, returns a summary string.
//
// inputSchema:  { normalized: z.string(), wordCount: z.number() }
// outputSchema: { summary: z.string() }
// execute: return `"${normalized}" has ${wordCount} words`

const formatStep = undefined as any; // ← replace

// ─── TODO 4: Create the workflow ─────────────────────────────
// Chain all 3 steps with .then() and .commit()
//
// inputSchema must match step 1's inputSchema
// outputSchema must match step 3's outputSchema

export const textPipeline = undefined as any; // ← replace

// ─── TODO 5: Run the workflow with start() ──────────────────
export async function testStart() {
  console.log('--- run.start() ---');
  // TODO: const run = await textPipeline.createRun()
  // TODO: const result = await run.start({ inputData: { message: '  Hello World  ' } })
  // TODO: Check result.status and print result.result or result.error
  // TODO: Print result.steps to see each step's output
  console.log('TODO: implement');
}

// ─── TODO 6: Run the workflow with stream() ─────────────────
export async function testStream() {
  console.log('--- run.stream() ---');
  // TODO: const run = await textPipeline.createRun()
  // TODO: const stream = run.stream({ inputData: { message: '  Hello World  ' } })
  // TODO: Iterate over stream.fullStream and print each chunk
  // TODO: const result = await stream.result
  // TODO: Print the final result
  console.log('TODO: implement');
}

// ─── TODO 7: Workflows as steps ─────────────────────────────
// Create a child workflow and use it inside a parent workflow:
//
//   const childWorkflow = createWorkflow({
//     id: 'child',
//     inputSchema: z.object({ message: z.string() }),
//     outputSchema: z.object({ summary: z.string() }),
//   })
//     .then(normalizeStep)
//     .then(wordCountStep)
//     .then(formatStep)
//     .commit();
//
//   const parentWorkflow = createWorkflow({
//     id: 'parent',
//     inputSchema: z.object({ message: z.string() }),
//     outputSchema: z.object({ summary: z.string() }),
//   })
//     .then(childWorkflow)  // ← workflow used as a step
//     .commit();

// ─── TODO 8: Clone a workflow ───────────────────────────────
// Reuse logic with a new ID for separate tracking:
//
//   import { cloneWorkflow } from '@mastra/core/workflows';
//   const cloned = cloneWorkflow(textPipeline, { id: 'cloned-pipeline' });
//
// Each clone runs independently in logs and observability.

export async function runTest() {
  console.log('=== Workflow Start ===\n');
  await testStart();

  console.log('\n=== Workflow Stream ===\n');
  await testStream();
}
