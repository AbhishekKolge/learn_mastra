/**
 * MODULE 25: Stream Events — SOLUTION
 */

import { Agent } from '@mastra/core/agent';
import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

// ─── TODO 1: Create a tool for the agent ─────────────────────
const calculatorTool = createTool({
  id: 'calculator',
  description: 'Add two numbers together',
  inputSchema: z.object({ a: z.number(), b: z.number() }),
  outputSchema: z.object({ result: z.number() }),
  execute: async (input) => ({ result: input.a + input.b }),
});

// ─── TODO 2: Create an agent with the tool ───────────────────
export const mathTutor = new Agent({
  id: 'math-tutor',
  name: 'Math Tutor',
  instructions: `
    You are a math tutor. Use the calculator tool to compute results.
    Always show your work and explain your reasoning step by step.
  `,
  model: 'anthropic/claude-sonnet-4-5',
  tools: { calculatorTool },
});

// ─── TODO 3: Inspect all raw stream events ───────────────────
export async function testRawEvents() {
  console.log('--- Raw Stream Events ---');

  const stream = await mathTutor.stream('What is 42 + 58?');

  for await (const chunk of stream) {
    const payloadStr = JSON.stringify(chunk.payload ?? {}).slice(0, 120);
    console.log(`[${chunk.type}] ${payloadStr}`);
  }
}

// ─── TODO 4: Filter specific event types ─────────────────────
export async function testFilterEvents() {
  console.log('--- Filtered Events ---');

  const stream = await mathTutor.stream(
    'Calculate 123 + 456 and explain why addition is commutative.'
  );

  for await (const chunk of stream) {
    switch (chunk.type) {
      case 'text-delta':
        process.stdout.write(chunk.payload.textDelta);
        break;
      case 'tool-call':
        console.log('\n[TOOL CALL]', chunk.payload.toolName, chunk.payload.args);
        break;
      case 'tool-result':
        console.log('[TOOL RESULT]', chunk.payload.result);
        break;
      case 'finish':
        console.log('\n[FINISH] Usage:', chunk.payload.usage);
        break;
    }
  }
}

// ─── TODO 5: Count events by type ────────────────────────────
export async function testCountEvents() {
  console.log('--- Event Counts ---');

  const stream = await mathTutor.stream('What is 10 + 20? Then what is 30 + 40?');

  const counts: Record<string, number> = {};
  for await (const chunk of stream) {
    counts[chunk.type] = (counts[chunk.type] || 0) + 1;
  }

  console.log('Event counts:');
  for (const [type, count] of Object.entries(counts).sort()) {
    console.log(`  ${type}: ${count}`);
  }
}

// ─── TODO 6: Build a simple event logger ─────────────────────
type EventLog = { timestamp: number; type: string; summary: string };

async function logStream(agent: Agent, prompt: string): Promise<EventLog[]> {
  const log: EventLog[] = [];
  const startTime = Date.now();

  const stream = await agent.stream(prompt);

  for await (const chunk of stream) {
    const timestamp = Date.now() - startTime;
    let summary = '';

    switch (chunk.type) {
      case 'start':
        summary = 'Agent started';
        break;
      case 'text-delta':
        summary = (chunk.payload.textDelta as string).slice(0, 30);
        break;
      case 'tool-call':
        summary = `Called ${chunk.payload.toolName}`;
        break;
      case 'tool-result':
        summary = `Result from ${chunk.payload.toolName}`;
        break;
      case 'step-finish':
        summary = `Step finished: ${chunk.payload.finishReason}`;
        break;
      case 'finish':
        summary = `Done. Tokens: ${(chunk.payload as any).usage?.totalTokens ?? 'N/A'}`;
        break;
      default:
        summary = chunk.type;
    }

    log.push({ timestamp, type: chunk.type, summary });
  }

  return log;
}

export async function testEventLogger() {
  console.log('--- Event Logger ---');

  const log = await logStream(mathTutor, 'What is 7 + 8?');

  console.log('\nEvent timeline:');
  for (const entry of log) {
    // Only show non-text-delta or first few text-deltas to keep output clean
    if (entry.type !== 'text-delta') {
      console.log(`  [${entry.timestamp}ms] ${entry.type}: ${entry.summary}`);
    }
  }

  const textDeltas = log.filter(e => e.type === 'text-delta').length;
  console.log(`  ... plus ${textDeltas} text-delta events`);
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
