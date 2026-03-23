/**
 * MODULE 28: Piping Agent Streams to Tools — SOLUTION
 */

import { Agent } from '@mastra/core/agent';
import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

// ─── TODO 1: Create a helper agent ──────────────────────────
export const summarizerAgent = new Agent({
  id: 'summarizer',
  name: 'Summarizer',
  instructions: `
    You summarize text concisely in 2-3 sentences.
    Focus on the key points and main ideas.
    Be clear and direct.
  `,
  model: 'anthropic/claude-sonnet-4-5',
});

// ─── TODO 2: Create a tool that pipes agent stream ──────────
const summarizeTool = createTool({
  id: 'summarize-text',
  description: 'Summarizes a given text using an AI agent',
  inputSchema: z.object({ text: z.string() }),
  outputSchema: z.object({ summary: z.string() }),
  execute: async (inputData, context) => {
    const agent = context?.mastra?.getAgent('summarizer');
    const stream = await agent?.stream(
      `Summarize this text:\n${inputData.text}`
    );

    // Pipe agent's full stream to tool's writer
    await stream!.fullStream.pipeTo(context?.writer!);

    return { summary: await stream!.text };
  },
});

// ─── TODO 3: Create a more complex piping tool ──────────────
const researchAndSummarize = createTool({
  id: 'research-and-summarize',
  description: 'Researches a topic then summarizes findings using an AI agent',
  inputSchema: z.object({ topic: z.string() }),
  outputSchema: z.object({ summary: z.string(), researchTime: z.number() }),
  execute: async (inputData, context) => {
    // Write custom progress events BEFORE piping
    await context?.writer?.write({
      type: 'research-progress',
      status: 'researching',
      topic: inputData.topic,
    });

    // Simulate research
    const start = Date.now();
    await new Promise(r => setTimeout(r, 500));

    const fakeResearch = `
      Research findings on "${inputData.topic}":
      - It is a widely discussed topic in technology
      - Multiple frameworks and approaches exist
      - The community is actively developing best practices
      - Performance and developer experience are key concerns
    `;

    await context?.writer?.write({
      type: 'research-progress',
      status: 'summarizing',
    });

    const researchTime = Date.now() - start;

    // Now pipe the agent stream (this closes the writer when done)
    const agent = context?.mastra?.getAgent('summarizer');
    const stream = await agent?.stream(
      `Summarize these research findings:\n${fakeResearch}`
    );

    await stream!.fullStream.pipeTo(context?.writer!);

    return {
      summary: await stream!.text,
      researchTime,
    };
  },
});

// ─── TODO 4: Create a parent agent with the tools ────────────
export const researchAssistant = new Agent({
  id: 'research-assistant',
  name: 'Research Assistant',
  instructions: `
    You help users research and summarize topics.
    - Use summarize-text when given text to summarize
    - Use research-and-summarize when asked to research a topic
    Always use the appropriate tool.
  `,
  model: 'anthropic/claude-sonnet-4-5',
  tools: { summarizeTool, researchAndSummarize },
});

// ─── TODO 5: Test basic agent-to-tool piping ─────────────────
export async function testBasicPiping() {
  console.log('--- Basic Agent→Tool Piping ---');

  const stream = await researchAssistant.stream(
    `Summarize this text: Mastra is an open-source TypeScript framework
    for building AI agents, workflows, and tools. It provides streaming
    support, memory management, structured output, and multi-agent
    coordination out of the box. It integrates with multiple LLM
    providers and supports both synchronous and streaming execution.`
  );

  for await (const chunk of stream) {
    if (chunk.type === 'text-delta') {
      process.stdout.write(chunk.payload.textDelta);
    } else if (chunk.type === 'tool-call') {
      console.log(`\n[TOOL CALL] ${chunk.payload.toolName}`);
    } else if (chunk.type === 'tool-result') {
      console.log(`[TOOL RESULT] Summary received`);
    }
  }
}

// ─── TODO 6: Test mixed events + piping ──────────────────────
export async function testMixedPiping() {
  console.log('--- Mixed Events + Piping ---');

  const stream = await researchAssistant.stream(
    'Research and summarize the topic of "TypeScript streaming patterns"'
  );

  for await (const chunk of stream) {
    // Custom progress events from before the pipe
    if (chunk.payload?.output?.type === 'research-progress') {
      console.log('[PROGRESS]', chunk.payload.output.status);
    }
    // Text from the piped agent stream
    if (chunk.type === 'text-delta') {
      process.stdout.write(chunk.payload.textDelta);
    }
  }
}

// ─── Run all tests ───────────────────────────────────────────
export async function runTest() {
  console.log('=== Agent→Tool Piping ===\n');

  await testBasicPiping();

  console.log('\n\n');
  await testMixedPiping();
}
