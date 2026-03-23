/**
 * MODULE 26: Tool Streaming — SOLUTION
 */

import { Agent } from '@mastra/core/agent';
import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

// ─── TODO 1: Create a tool with context.writer ──────────────
const dataFetcher = createTool({
  id: 'data-fetcher',
  description: 'Fetches data from multiple sources with progress updates',
  inputSchema: z.object({ query: z.string() }),
  outputSchema: z.object({ results: z.array(z.string()), totalSources: z.number() }),
  execute: async (inputData, context) => {
    const sources = ['database', 'cache', 'api'];
    const results: string[] = [];

    for (const source of sources) {
      await context?.writer?.write({
        type: 'fetch-progress',
        source,
        status: 'fetching',
      });

      await new Promise(r => setTimeout(r, 500));
      results.push(`Result from ${source} for "${inputData.query}"`);

      await context?.writer?.write({
        type: 'fetch-progress',
        source,
        status: 'done',
      });
    }

    return { results, totalSources: sources.length };
  },
});

// ─── TODO 2: Create a tool with writer.custom() ─────────────
const buildRunner = createTool({
  id: 'build-runner',
  description: 'Runs a simulated build process with live progress',
  inputSchema: z.object({ project: z.string() }),
  outputSchema: z.object({ success: z.boolean(), duration: z.number() }),
  execute: async (inputData, context) => {
    const steps = ['lint', 'compile', 'test', 'bundle'];
    const start = Date.now();

    for (let i = 0; i < steps.length; i++) {
      await context?.writer?.custom({
        type: 'data-build-progress',
        data: {
          step: steps[i],
          progress: Math.round(((i + 1) / steps.length) * 100),
        },
      });
      await new Promise(r => setTimeout(r, 300));
    }

    return { success: true, duration: Date.now() - start };
  },
});

// ─── TODO 3: Create a tool with transient chunks ─────────────
const logStreamer = createTool({
  id: 'log-streamer',
  description: 'Streams verbose logs during execution',
  inputSchema: z.object({ task: z.string() }),
  outputSchema: z.object({ linesEmitted: z.number() }),
  execute: async (inputData, context) => {
    const logs = [
      'Starting task...',
      'Loading configuration...',
      'Processing input data...',
      'Running transformations...',
      'Finalizing output...',
    ];

    for (const line of logs) {
      await context?.writer?.custom({
        type: 'data-build-log',
        data: { line, task: inputData.task },
        transient: true,
      });
      await new Promise(r => setTimeout(r, 200));
    }

    return { linesEmitted: logs.length };
  },
});

// ─── TODO 4: Create a tool with lifecycle hooks ──────────────
const weatherLookup = createTool({
  id: 'weather-lookup',
  description: 'Look up weather for a city',
  inputSchema: z.object({ city: z.string() }),
  outputSchema: z.object({ temperature: z.number(), conditions: z.string() }),
  onInputAvailable: ({ input, toolCallId }) => {
    console.log(`[HOOK onInputAvailable] Weather requested for: ${(input as any).city} (${toolCallId})`);
  },
  execute: async (input) => {
    return { temperature: 72, conditions: 'Sunny' };
  },
  onOutput: ({ output, toolName }) => {
    console.log(`[HOOK onOutput] ${toolName} result: ${(output as any).temperature}°F, ${(output as any).conditions}`);
  },
});

// ─── TODO 5: Create an agent with all tools ──────────────────
export const toolStreamAgent = new Agent({
  id: 'tool-stream-agent',
  name: 'Tool Stream Agent',
  instructions: `
    You are a helpful assistant with access to several tools:
    - data-fetcher: Use this to fetch data about a topic
    - build-runner: Use this to run a build process for a project
    - log-streamer: Use this to stream logs for a task
    - weather-lookup: Use this to look up weather for a city
    Always use the appropriate tool when asked.
  `,
  model: 'anthropic/claude-sonnet-4-5',
  tools: { dataFetcher, buildRunner, logStreamer, weatherLookup },
});

// ─── TODO 6: Test writer.write() — inspect nested payloads ──
export async function testWriterWrite() {
  console.log('--- writer.write() ---');

  const stream = await toolStreamAgent.stream(
    'Fetch data about TypeScript frameworks'
  );

  for await (const chunk of stream) {
    // writer.write() data appears inside tool-result payloads
    if (chunk.payload?.output?.type === 'fetch-progress') {
      console.log('Progress:', chunk.payload.output);
    }
    if (chunk.type === 'text-delta') {
      process.stdout.write(chunk.payload.textDelta);
    }
  }
}

// ─── TODO 7: Test writer.custom() — top-level chunks ─────────
export async function testWriterCustom() {
  console.log('--- writer.custom() ---');

  const stream = await toolStreamAgent.stream(
    'Run a build for the "my-app" project'
  );

  for await (const chunk of stream) {
    // writer.custom() emits top-level chunks with data-* types
    if (chunk.type === 'data-build-progress') {
      console.log('Build:', (chunk as any).data);
    }
    if (chunk.type === 'text-delta') {
      process.stdout.write(chunk.payload.textDelta);
    }
  }
}

// ─── TODO 8: Test lifecycle hooks ────────────────────────────
export async function testLifecycleHooks() {
  console.log('--- Lifecycle Hooks ---');

  const stream = await toolStreamAgent.stream(
    'What is the weather in San Francisco?'
  );

  // Hooks log to console automatically via onInputAvailable and onOutput
  for await (const chunk of stream) {
    if (chunk.type === 'text-delta') {
      process.stdout.write(chunk.payload.textDelta);
    }
  }
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
