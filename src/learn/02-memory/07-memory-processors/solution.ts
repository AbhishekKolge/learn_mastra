/**
 * MODULE 15: Memory Processors — SOLUTION
 */

import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import type { Processor } from '@mastra/core/agent';

// ─── TODO 1: Pipeline logger ────────────────────────────────
const pipelineLogger: Processor = {
  processInput({ messages, systemMessages }) {
    console.log(`  [CUSTOM INPUT] Processing ${messages.length} messages:`);
    for (const msg of messages) {
      const content = typeof msg.content === 'string'
        ? msg.content.slice(0, 60)
        : '(complex)';
      console.log(`    [${msg.role}] ${content}`);
    }
    return { messages, systemMessages };
  },

  processOutputResult({ result }) {
    console.log(`  [CUSTOM OUTPUT] Processing result with ${result.messages.length} messages`);
    return result;
  },
};

// ─── TODO 2: Agent with memory + custom processor ───────────
const memory = new Memory({
  options: {
    lastMessages: 5,
  },
});

export const pipelineAgent = new Agent({
  id: 'pipeline-agent',
  name: 'Pipeline Agent',
  instructions: 'You are a helpful assistant. Keep responses under 2 sentences.',
  model: 'anthropic/claude-sonnet-4-5',
  memory,
  inputProcessors: [pipelineLogger],
  outputProcessors: [pipelineLogger],
});

// ─── TODO 3: Test pipeline ──────────────────────────────────
export async function testPipeline() {
  const memConfig = {
    memory: { thread: { id: 'pipeline-thread' }, resource: 'user-pipeline' },
  };

  console.log('=== Message 1 ===');
  const r1 = await pipelineAgent.generate('Hello, my name is Sam', memConfig);
  console.log(`  Agent: ${r1.text}\n`);

  console.log('=== Message 2 ===');
  const r2 = await pipelineAgent.generate('I like pizza', memConfig);
  console.log(`  Agent: ${r2.text}\n`);

  console.log('=== Message 3 ===');
  const r3 = await pipelineAgent.generate('What do you know about me?', memConfig);
  console.log(`  Agent: ${r3.text}`);

  console.log('\n--- Pipeline Execution Order ---');
  console.log('INPUT:  Memory fetches history → Custom logger sees history + new message');
  console.log('OUTPUT: Custom logger runs → Memory persists new messages');
  console.log('\nNotice how message count grows: 1 → 3 → 5 as history builds up');
}

export async function runTest() {
  await testPipeline();
}
