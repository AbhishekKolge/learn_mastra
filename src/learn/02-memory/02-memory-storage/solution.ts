/**
 * MODULE 10: Memory Storage — SOLUTION
 */

import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';

// ─── TODO 1: Agent with auto title generation ───────────────
export const titledAgent = new Agent({
  id: 'titled-agent',
  name: 'Titled Assistant',
  instructions: `
    You are a helpful assistant. Answer questions on any topic
    clearly and concisely.
  `,
  model: 'anthropic/claude-sonnet-4-5',
  memory: new Memory({
    options: {
      lastMessages: 10,
      generateTitle: true,
    },
  }),
});

// ─── TODO 2: Thread metadata ────────────────────────────────
export async function testThreadMetadata() {
  console.log('--- Thread with metadata ---');
  const response = await titledAgent.generate(
    'How do I fix a segmentation fault in C++?',
    {
      memory: {
        thread: {
          id: 'support-tech-001',
          title: 'C++ Debugging Help',
          metadata: { category: 'technical', priority: 'medium' },
        },
        resource: 'user-dev',
      },
    },
  );
  console.log('Response:', response.text);
}

// ─── TODO 3: Multiple threads ───────────────────────────────
export async function testMultipleThreads() {
  const threads = [
    { topic: 'cooking', id: 'cooking-thread', question: 'What is a good recipe for pasta carbonara?' },
    { topic: 'coding', id: 'coding-thread', question: 'How do I reverse a linked list?' },
    { topic: 'fitness', id: 'fitness-thread', question: 'What is a good beginner workout routine?' },
  ];

  for (const t of threads) {
    console.log(`\n--- Thread: ${t.topic} ---`);
    const response = await titledAgent.generate(t.question, {
      memory: {
        thread: { id: t.id },
        resource: 'user-multi',
      },
    });
    console.log('Response:', response.text.slice(0, 200) + '...');
  }
}

export async function runTest() {
  console.log('=== Thread Metadata ===\n');
  await testThreadMetadata();

  console.log('\n=== Multiple Threads ===\n');
  await testMultipleThreads();
}
