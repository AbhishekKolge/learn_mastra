/**
 * MODULE 30: Multi-Agent Streaming (Supervisor Agents) — SOLUTION
 */

import { Agent } from '@mastra/core/agent';
import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

// ─── TODO 1: Create specialist agents ────────────────────────
export const poetAgent = new Agent({
  id: 'poet',
  name: 'Poet',
  description:
    'Writes creative poems, haikus, and verses on any topic. Use when the user asks for poetry or creative writing.',
  instructions: `
    You are a poet. Write short, vivid poems with sensory imagery.
    For haiku, follow the 5-7-5 syllable pattern strictly.
    Keep poems concise — no more than 12 lines unless asked.
  `,
  model: 'anthropic/claude-sonnet-4-5',
});

export const analystAgent = new Agent({
  id: 'data-analyst',
  name: 'Data Analyst',
  description:
    'Analyzes numerical data, identifies trends, and explains patterns. Use when the user provides numbers or asks for data analysis.',
  instructions: `
    You analyze data and provide insights.
    - Identify trends (linear, exponential, etc.)
    - Calculate growth rates between data points
    - Explain what the pattern suggests
    - Be precise with numbers, round to 2 decimal places.
  `,
  model: 'anthropic/claude-sonnet-4-5',
});

// ─── TODO 2: Create the supervisor agent ─────────────────────
export const contentSupervisor = new Agent({
  id: 'content-supervisor',
  name: 'Content Supervisor',
  instructions: `
    You coordinate between specialist agents.
    - For creative writing requests (poems, haiku, verses), delegate to the poet agent
    - For data analysis requests (trends, numbers, patterns), delegate to the data-analyst agent
    - For mixed requests, use both agents appropriately
    Always delegate to specialists. Do not do their work yourself.
    After receiving results from specialists, present them cleanly to the user.
  `,
  model: 'anthropic/claude-sonnet-4-5',
  agents: [poetAgent, analystAgent],
});

// ─── TODO 3: Stream and observe delegation ───────────────────
export async function testSupervisorStream() {
  console.log('--- Supervisor Streaming ---');

  const stream = await contentSupervisor.stream(
    'Write a haiku about mountains'
  );

  for await (const chunk of stream) {
    switch (chunk.type) {
      case 'text-delta':
        process.stdout.write(chunk.payload.textDelta);
        break;
      case 'tool-call':
        console.log(`\n[DELEGATING TO] ${chunk.payload.toolName}`);
        console.log(`  Args: ${JSON.stringify(chunk.payload.args).slice(0, 100)}`);
        break;
      case 'tool-result':
        console.log(`\n[RESULT FROM] ${chunk.payload.toolName}`);
        console.log(`  Result: ${JSON.stringify(chunk.payload.result).slice(0, 100)}...`);
        break;
    }
  }
}

// ─── TODO 4: Stream a multi-delegation request ──────────────
export async function testMultiDelegation() {
  console.log('--- Multi-Agent Delegation ---');

  const stream = await contentSupervisor.stream(
    'Write a poem about exponential growth, then analyze this data trend: 2, 4, 8, 16, 32, 64'
  );

  let delegationCount = 0;

  for await (const chunk of stream) {
    switch (chunk.type) {
      case 'text-delta':
        process.stdout.write(chunk.payload.textDelta);
        break;
      case 'tool-call':
        delegationCount++;
        console.log(`\n[DELEGATION #${delegationCount}] → ${chunk.payload.toolName}`);
        break;
      case 'tool-result':
        console.log(`[COMPLETED] ${chunk.payload.toolName}`);
        break;
    }
  }

  console.log(`\n\nTotal delegations: ${delegationCount}`);
}

// ─── TODO 5: Track all delegations ──────────────────────────
export async function testDelegationTracking() {
  console.log('--- Delegation Tracking ---');

  const delegations: { agent: string; startTime: number; endTime?: number }[] = [];
  const startTime = Date.now();

  const stream = await contentSupervisor.stream(
    'Write a short verse about data, then analyze: 10, 20, 40, 80'
  );

  for await (const chunk of stream) {
    if (chunk.type === 'tool-call') {
      delegations.push({
        agent: chunk.payload.toolName,
        startTime: Date.now() - startTime,
      });
    }
    if (chunk.type === 'tool-result') {
      const last = delegations[delegations.length - 1];
      if (last && !last.endTime) {
        last.endTime = Date.now() - startTime;
      }
    }
    if (chunk.type === 'text-delta') {
      process.stdout.write(chunk.payload.textDelta);
    }
  }

  const fullText = await stream.text;

  console.log('\n\nDelegation log:');
  for (const d of delegations) {
    const duration = d.endTime ? d.endTime - d.startTime : 'unknown';
    console.log(`  ${d.agent}: started at ${d.startTime}ms, took ${duration}ms`);
  }
  console.log(`Full response length: ${fullText.length} chars`);
}

// ─── TODO 6: Supervisor with tools AND subagents ─────────────
export async function testHybridSupervisor() {
  console.log('--- Hybrid Supervisor (Tools + Agents) ---');

  const calculator = createTool({
    id: 'calculator',
    description: 'Adds two numbers together. Use for simple arithmetic calculations.',
    inputSchema: z.object({ a: z.number(), b: z.number() }),
    outputSchema: z.object({ result: z.number() }),
    execute: async (input) => ({ result: input.a + input.b }),
  });

  const hybridSupervisor = new Agent({
    id: 'hybrid-supervisor',
    name: 'Hybrid Supervisor',
    instructions: `
      You have access to specialist agents and tools.
      - Use the calculator tool for simple arithmetic
      - Use the poet agent for creative writing
      - Use the data-analyst agent for data analysis
      Always use the most appropriate resource for each part of the request.
    `,
    model: 'anthropic/claude-sonnet-4-5',
    agents: [poetAgent, analystAgent],
    tools: { calculator },
  });

  const stream = await hybridSupervisor.stream(
    'What is 42 + 58? Then write a haiku about the number 100.'
  );

  for await (const chunk of stream) {
    switch (chunk.type) {
      case 'text-delta':
        process.stdout.write(chunk.payload.textDelta);
        break;
      case 'tool-call':
        console.log(`\n[CALLING] ${chunk.payload.toolName} (${
          chunk.payload.toolName === 'calculator' ? 'tool' : 'agent'
        })`);
        break;
      case 'tool-result':
        console.log(`[RESULT] ${chunk.payload.toolName}:`, JSON.stringify(chunk.payload.result).slice(0, 80));
        break;
    }
  }
}

// ─── TODO 7: Full event inspection ───────────────────────────
export async function testEventInspection() {
  console.log('--- Full Event Inspection ---');

  const stream = await contentSupervisor.stream(
    'Write a couplet about code, then analyze: 1, 1, 2, 3, 5, 8'
  );

  const categories: Record<string, number> = {
    'supervisor-text': 0,
    'delegation': 0,
    'metadata': 0,
    'other': 0,
  };

  for await (const chunk of stream) {
    if (chunk.type === 'text-delta') {
      categories['supervisor-text']++;
    } else if (chunk.type === 'tool-call' || chunk.type === 'tool-result') {
      categories['delegation']++;
    } else if (['start', 'step-start', 'step-finish', 'finish'].includes(chunk.type)) {
      categories['metadata']++;
    } else {
      categories['other']++;
    }
  }

  console.log('Event categories:');
  for (const [category, count] of Object.entries(categories)) {
    console.log(`  ${category}: ${count}`);
  }
}

// ─── Run all tests ───────────────────────────────────────────
export async function runTest() {
  console.log('=== Multi-Agent Streaming (Supervisor) ===\n');

  await testSupervisorStream();

  console.log('\n\n');
  await testMultiDelegation();

  console.log('\n\n');
  await testDelegationTracking();

  console.log('\n\n');
  await testHybridSupervisor();

  console.log('\n\n');
  await testEventInspection();
}
