/**
 * MODULE 29: Piping Agent Streams to Workflow Steps — SOLUTION
 */

import { Agent } from '@mastra/core/agent';
import { createWorkflow, createStep } from '@mastra/core/workflows';
import { z } from 'zod';

// ─── TODO 1: Create agents for the workflow ──────────────────
export const draftWriter = new Agent({
  id: 'draft-writer',
  name: 'Draft Writer',
  instructions: `
    Write a short, engaging paragraph on any given topic.
    Use vivid language and concrete examples.
    Keep it to one paragraph (3-5 sentences).
  `,
  model: 'anthropic/claude-sonnet-4-5',
});

export const draftEditor = new Agent({
  id: 'draft-editor',
  name: 'Draft Editor',
  instructions: `
    Edit the given text to be more concise and engaging.
    Fix any grammar issues and improve clarity.
    Return ONLY the improved version, no explanations.
  `,
  model: 'anthropic/claude-sonnet-4-5',
});

// ─── TODO 2: Create a step that pipes agent textStream ──────
const writeDraftStep = createStep({
  id: 'write-draft',
  inputSchema: z.object({ topic: z.string() }),
  outputSchema: z.object({ draft: z.string() }),
  execute: async ({ inputData, mastra, writer }) => {
    const agent = mastra?.getAgent('draftWriter');
    const stream = await agent?.stream(
      `Write a paragraph about: ${inputData.topic}`
    );

    // Pipe agent's text stream to the workflow step's writer
    await stream!.textStream.pipeTo(writer!);

    return { draft: await stream!.text };
  },
});

// ─── TODO 3: Create an edit step that also pipes ─────────────
const editDraftStep = createStep({
  id: 'edit-draft',
  inputSchema: z.object({ draft: z.string() }),
  outputSchema: z.object({ edited: z.string() }),
  execute: async ({ inputData, mastra, writer }) => {
    const agent = mastra?.getAgent('draftEditor');
    const stream = await agent?.stream(
      `Edit this text to be more concise and engaging:\n${inputData.draft}`
    );

    await stream!.textStream.pipeTo(writer!);

    return { edited: await stream!.text };
  },
});

// ─── TODO 4: Create a pure logic step (no agent) ────────────
const formatStep = createStep({
  id: 'format-output',
  inputSchema: z.object({ edited: z.string() }),
  outputSchema: z.object({ article: z.string() }),
  execute: async ({ inputData }) => {
    const article = `--- Final Article ---\n\n${inputData.edited}\n\n--- End ---`;
    return { article };
  },
});

// ─── TODO 5: Create the workflow ─────────────────────────────
export const contentGenerator = createWorkflow({
  id: 'content-generator',
  inputSchema: z.object({ topic: z.string() }),
  outputSchema: z.object({ article: z.string() }),
})
  .then(writeDraftStep)
  .then(editDraftStep)
  .then(formatStep)
  .commit();

// ─── TODO 6: Stream and observe agent text through workflow ──
export async function testAgentWorkflowPipe() {
  console.log('--- Agent→Workflow Piping ---');

  const run = await contentGenerator.createRun();
  const stream = await run.stream({
    inputData: { topic: 'the future of AI assistants' },
  });

  for await (const chunk of stream) {
    if (chunk.type?.startsWith('workflow-step-start')) {
      console.log(`\n[STEP STARTED] ${chunk.payload?.stepName}`);
    } else if (chunk.type?.startsWith('workflow-step-finish')) {
      console.log(`\n[STEP FINISHED] ${chunk.payload?.stepName}`);
    } else if (chunk.type?.startsWith('workflow-')) {
      console.log(`[${chunk.type}]`);
    } else {
      // Agent text flowing through the step's writer
      console.log(`  [${chunk.type}] ${JSON.stringify(chunk.payload || chunk).slice(0, 80)}`);
    }
  }
}

// ─── TODO 7: Get final result after streaming ────────────────
export async function testFinalResult() {
  console.log('--- Final Result ---');

  const run = await contentGenerator.createRun();
  const result = await run.start({
    inputData: { topic: 'open-source software' },
  });

  if (result.status === 'success') {
    console.log(result.result);
  } else {
    console.error('Workflow failed:', result.status);
  }
}

// ─── Run all tests ───────────────────────────────────────────
export async function runTest() {
  console.log('=== Agent→Workflow Piping ===\n');

  await testAgentWorkflowPipe();

  console.log('\n\n');
  await testFinalResult();
}
