/**
 * ============================================================
 *  MODULE 20: Agents & Tools in Workflows
 * ============================================================
 *
 *  THEORY
 *  ------
 *  Workflow steps can call agents (for LLM reasoning) or tools
 *  (for type-safe operations). Two ways to use them:
 *
 *  ── CALLING agents inside execute ──
 *  More control: access memory, structured output, etc.
 *
 *    const step = createStep({
 *      execute: async ({ inputData, mastra }) => {
 *        const agent = mastra.getAgent('myAgent');
 *        const response = await agent.generate(
 *          `Process: ${inputData.message}`,
 *          { memory: { thread: 'x', resource: 'y' } },
 *        );
 *        return { result: response.text };
 *      },
 *    });
 *
 *  ── AGENTS as steps (compose directly) ──
 *  Simpler: just wrap the agent as a step.
 *  Default schema: input = { prompt: string }, output = { text: string }
 *  Use .map() to transform previous output into { prompt: ... }
 *
 *    import { testAgent } from '../agents/test-agent';
 *    const agentStep = createStep(testAgent);
 *
 *    workflow
 *      .map(async ({ inputData }) => ({
 *        prompt: `Summarize: ${inputData.data}`,
 *      }))
 *      .then(agentStep)  // returns { text: string }
 *      .commit()
 *
 *  ── AGENTS with structured output ──
 *  Get typed objects from agent steps:
 *
 *    const agentStep = createStep(testAgent, {
 *      structuredOutput: { schema: z.object({ title: z.string(), tags: z.array(z.string()) }) },
 *    });
 *    // Next step's inputSchema matches the schema above
 *
 *  ── CALLING tools inside execute ──
 *    import { myTool } from '../tools/my-tool';
 *    const step = createStep({
 *      execute: async ({ inputData, requestContext }) => {
 *        const result = await myTool.execute(
 *          { text: inputData.message },
 *          { requestContext },
 *        );
 *        return { processed: result.output };
 *      },
 *    });
 *
 *  ── TOOLS as steps ──
 *    import { myTool } from '../tools/my-tool';
 *    const toolStep = createStep(myTool);
 *
 *    workflow
 *      .then(step1)
 *      .map(async ({ inputData }) => ({
 *        text: inputData.formatted,
 *      }))
 *      .then(toolStep)
 *      .commit()
 *
 *  EXERCISE
 *  --------
 *  Build a workflow that uses both an agent and a tool.
 * ============================================================
 */

import { createWorkflow, createStep } from '@mastra/core/workflows';
import { createTool } from '@mastra/core/tools';
import { Agent } from '@mastra/core/agent';
import { z } from 'zod';

// ─── Setup: A simple tool ───────────────────────────────────
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

// ─── Setup: A simple agent ──────────────────────────────────
const summaryAgent = new Agent({
  id: 'summary-agent',
  name: 'Summary Agent',
  instructions: 'You summarize text in exactly one sentence.',
  model: 'anthropic/claude-sonnet-4-5',
});

// ─── TODO 1: Create a step that CALLS the agent ─────────────
// Use mastra.getAgent() or import directly.
// Call agent.generate() inside execute.

const agentCallStep = createStep({
  id: 'agent-call',
  inputSchema: z.object({ text: z.string() }),
  outputSchema: z.object({ summary: z.string() }),
  execute: async ({ inputData }) => {
    // TODO: Call summaryAgent.generate() with the text
    // TODO: Return { summary: response.text }
    return { summary: 'TODO: implement' };
  },
});

// ─── TODO 2: Create a step that CALLS the tool ──────────────
const toolCallStep = createStep({
  id: 'tool-call',
  inputSchema: z.object({ text: z.string() }),
  outputSchema: z.object({ count: z.number(), text: z.string() }),
  execute: async ({ inputData, requestContext }) => {
    // TODO: Call wordCountTool.execute({ text: inputData.text }, { requestContext })
    // TODO: Return the result
    return { count: 0, text: inputData.text };
  },
});

// ─── TODO 3: Compose agent as a step (no execute needed) ────
// Use createStep(agent) directly.
// Default: input = { prompt: string }, output = { text: string }
//
//   const agentStep = createStep(summaryAgent);
//
//   workflow
//     .map(async ({ inputData }) => ({
//       prompt: `Summarize this: ${inputData.text}`,
//     }))
//     .then(agentStep)
//     .commit()

// ─── TODO 4: Agent step with structured output ──────────────
// Get typed data from an agent step:
//
//   const articleSchema = z.object({
//     title: z.string(),
//     summary: z.string(),
//     tags: z.array(z.string()),
//   });
//
//   const structuredAgentStep = createStep(summaryAgent, {
//     structuredOutput: { schema: articleSchema },
//   });
//
//   // Next step gets { title, summary, tags } as inputData
//   const processStep = createStep({
//     inputSchema: articleSchema,
//     execute: async ({ inputData }) => ({
//       tagCount: inputData.tags.length,  // fully typed!
//     }),
//   });

// ─── TODO 5: Compose tool as a step ─────────────────────────
// Use createStep(tool) directly:
//
//   const toolStep = createStep(wordCountTool);
//
//   workflow
//     .then(step1)
//     .map(async ({ inputData }) => ({
//       text: inputData.processed,
//     }))
//     .then(toolStep)
//     .commit()

// ─── TODO 6: Build a combined workflow ──────────────────────
// Create a workflow that:
// 1. Takes { text: string }
// 2. Counts words (tool)
// 3. Generates a summary (agent)
// 4. Returns { count, summary }

export const combinedWorkflow = undefined as any; // ← replace

export async function runTest() {
  console.log('=== Agents & Tools in Workflows ===\n');
  // TODO: Test combinedWorkflow with some text
  console.log('TODO: implement');
}
