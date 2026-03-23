/**
 * MODULE 20: Agents & Tools in Workflows — SOLUTION
 *
 * Two ways to use agents/tools in workflows:
 *   1. CALL inside execute()    — more control (custom prompts, memory, etc.)
 *   2. COMPOSE as step directly — simpler, uses .map() for data shaping
 */
import { createWorkflow, createStep } from '@mastra/core/workflows';
import { createTool } from '@mastra/core/tools';
import { Agent } from '@mastra/core/agent';
import { z } from 'zod';

// ─── Setup: Tool and Agent ──────────────────────────────────
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
  description: 'Summarizes text concisely in one sentence.',
  instructions: 'You summarize text in exactly one sentence.',
  model: 'anthropic/claude-sonnet-4-5',
});

// ═══════════════════════════════════════════════════════════
//  APPROACH 1: Call agents/tools inside execute()
// ═══════════════════════════════════════════════════════════
// More control — you decide the prompt, can use memory, etc.

const toolCallStep = createStep({
  id: 'tool-call',
  inputSchema: z.object({ text: z.string() }),
  outputSchema: z.object({ count: z.number(), text: z.string() }),
  execute: async ({ inputData, requestContext }) => {
    // Call tool directly inside the step
    return await wordCountTool.execute({ text: inputData.text }, { requestContext });
  },
});

const agentCallStep = createStep({
  id: 'agent-call',
  inputSchema: z.object({ count: z.number(), text: z.string() }),
  outputSchema: z.object({ count: z.number(), summary: z.string() }),
  execute: async ({ inputData }) => {
    // Call agent inside the step — full control over the prompt
    const response = await summaryAgent.generate(
      `Summarize this in one sentence: ${inputData.text}`
    );
    return { count: inputData.count, summary: response.text };
  },
});

export const callingWorkflow = createWorkflow({
  id: 'calling-workflow',
  inputSchema: z.object({ text: z.string() }),
  outputSchema: z.object({ count: z.number(), summary: z.string() }),
})
  .then(toolCallStep)
  .then(agentCallStep)
  .commit();

// ═══════════════════════════════════════════════════════════
//  APPROACH 2: Compose agents/tools directly as steps
// ═══════════════════════════════════════════════════════════
// Simpler — use createStep(agent) or createStep(tool).
// Use .map() to transform data between steps.

// ─── Tool as step ───────────────────────────────────────────
// createStep(tool) wraps the tool so it runs as a workflow step.
// The step's inputSchema = tool's inputSchema,
// and outputSchema = tool's outputSchema.
const toolAsStep = createStep(wordCountTool);

// ─── Agent as step ──────────────────────────────────────────
// createStep(agent) wraps the agent so it runs as a workflow step.
// Default schema: input = { prompt: string }, output = { text: string }
const agentAsStep = createStep(summaryAgent);

// ─── Agent as step with structured output ───────────────────
// Pass structuredOutput to get typed results instead of plain text.
const structuredAgentStep = createStep(summaryAgent, {
  structuredOutput: {
    schema: z.object({
      summary: z.string(),
      keyTopics: z.array(z.string()),
      wordEstimate: z.number(),
    }),
  },
});

export const composingWorkflow = createWorkflow({
  id: 'composing-workflow',
  inputSchema: z.object({ text: z.string() }),
  outputSchema: z.object({ text: z.string() }),
})
  // Step 1: Run tool directly as step (inputSchema matches tool's inputSchema)
  .then(toolAsStep)
  // Step 2: Transform tool output → agent input using .map()
  // Agent expects { prompt: string }, tool returns { count, text }
  .map(async ({ inputData }) => ({
    prompt: `Summarize this in one sentence (it has ${inputData.count} words): ${inputData.text}`,
  }))
  // Step 3: Run agent directly as step (receives { prompt } → returns { text })
  .then(agentAsStep)
  .commit();

// ─── Structured output workflow ─────────────────────────────
export const structuredWorkflow = createWorkflow({
  id: 'structured-workflow',
  inputSchema: z.object({ text: z.string() }),
  outputSchema: z.object({
    summary: z.string(),
    keyTopics: z.array(z.string()),
    wordEstimate: z.number(),
  }),
})
  .map(async ({ inputData }) => ({
    prompt: `Analyze this text and provide a summary, key topics, and estimated word count: ${inputData.text}`,
  }))
  .then(structuredAgentStep)
  .commit();

// ─── Tests ──────────────────────────────────────────────────
const SAMPLE_TEXT = 'Mastra workflows let you define complex sequences of tasks using clear structured steps. They give you full control over how data flows between steps and which primitives are called at each stage.';

export async function testCallingWorkflow() {
  console.log('=== Approach 1: Call inside execute() ===\n');
  const run = await callingWorkflow.createRun();
  const result = await run.start({ inputData: { text: SAMPLE_TEXT } });
  if (result.status === 'success') {
    console.log('Word count:', result.result.count);
    console.log('Summary:', result.result.summary);
  }
}

export async function testComposingWorkflow() {
  console.log('\n=== Approach 2: Compose as steps ===\n');
  const run = await composingWorkflow.createRun();
  const result = await run.start({ inputData: { text: SAMPLE_TEXT } });
  if (result.status === 'success') {
    console.log('Agent summary:', result.result.text);
  }
}

export async function testStructuredWorkflow() {
  console.log('\n=== Agent Step with Structured Output ===\n');
  const run = await structuredWorkflow.createRun();
  const result = await run.start({ inputData: { text: SAMPLE_TEXT } });
  if (result.status === 'success') {
    console.log('Summary:', result.result.summary);
    console.log('Key topics:', result.result.keyTopics);
    console.log('Word estimate:', result.result.wordEstimate);
  }
}

export async function runTest() {
  await testCallingWorkflow();
  await testComposingWorkflow();
  await testStructuredWorkflow();

  console.log('\n--- Comparison ---');
  console.log('Call inside execute():  More control (custom prompts, memory, error handling)');
  console.log('Compose as step:       Simpler, use .map() for data transformation');
  console.log('Structured agent step: Typed objects instead of plain text');
}
