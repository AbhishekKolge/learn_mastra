/**
 * MODULE 9: Memory Basics — SOLUTION
 */

import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';

// ─── TODO 1: Memory instance ────────────────────────────────
const memory = new Memory({
  options: {
    lastMessages: 20,
  },
});

// ─── TODO 2: Agent with memory ──────────────────────────────
export const memoryAgent = new Agent({
  id: 'memory-agent',
  name: 'Personal Assistant',
  instructions: `
    You are a friendly personal assistant with memory.
    - Remember everything the user tells you about themselves
    - Refer back to earlier messages when relevant
    - Be warm and personal — use their name if they've told you
    - If asked about something mentioned earlier, recall it accurately
  `,
  model: 'anthropic/claude-sonnet-4-5',
  memory,
});

// ─── TODO 3: Test memory across messages ────────────────────
export async function testMemoryBasics() {
  const memoryConfig = {
    memory: {
      thread: { id: 'test-thread-1' },
      resource: 'user-alex',
    },
  };

  console.log('--- Message 1: Introduce myself ---');
  const r1 = await memoryAgent.generate(
    'My name is Alex and I love TypeScript',
    memoryConfig,
  );
  console.log('Agent:', r1.text);

  console.log('\n--- Message 2: Test recall ---');
  const r2 = await memoryAgent.generate(
    "What's my name?",
    memoryConfig,
  );
  console.log('Agent:', r2.text);

  console.log('\n--- Message 3: Test deeper recall ---');
  const r3 = await memoryAgent.generate(
    'What programming language do I love?',
    memoryConfig,
  );
  console.log('Agent:', r3.text);
}

// ─── TODO 4: Thread isolation ───────────────────────────────
export async function testThreadIsolation() {
  const differentThread = {
    memory: {
      thread: { id: 'test-thread-2' },
      resource: 'user-alex',
    },
  };

  console.log('--- Different thread: should NOT know my name ---');
  const r = await memoryAgent.generate(
    "What's my name?",
    differentThread,
  );
  console.log('Agent:', r.text);
}

// ─── Run all tests ──────────────────────────────────────────
export async function runTest() {
  console.log('=== Memory Basics ===\n');
  await testMemoryBasics();

  console.log('\n\n=== Thread Isolation ===\n');
  await testThreadIsolation();
}
