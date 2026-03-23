/**
 * MODULE 11: Message History — SOLUTION
 */

import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';

const memory = new Memory({
  options: {
    lastMessages: 20,
  },
});

export const historyAgent = new Agent({
  id: 'history-agent',
  name: 'History Test Agent',
  instructions: 'You are a helpful assistant. Keep responses under 2 sentences.',
  model: 'anthropic/claude-sonnet-4-5',
  memory,
});

const THREAD_ID = 'history-test-thread';
const RESOURCE_ID = 'user-history-test';

// ─── TODO 1: Build conversation ─────────────────────────────
export async function buildConversation() {
  const memConfig = {
    memory: { thread: { id: THREAD_ID }, resource: RESOURCE_ID },
  };

  const messages = [
    'My favorite color is blue.',
    'I work as a software engineer at a startup.',
    'I have two cats named Luna and Mochi.',
    'I prefer dark mode in all my editors.',
    'My current project uses TypeScript and React.',
  ];

  for (const msg of messages) {
    console.log(`User: ${msg}`);
    const response = await historyAgent.generate(msg, memConfig);
    console.log(`Agent: ${response.text}\n`);
  }
}

// ─── TODO 2: Query history ──────────────────────────────────
export async function queryHistory() {
  console.log('--- Fetching message history ---\n');

  const mem = await historyAgent.getMemory();
  if (!mem) {
    console.log('No memory configured!');
    return;
  }

  const { messages } = await mem.recall({
    threadId: THREAD_ID,
    perPage: false,
  });

  for (const msg of messages) {
    const content = typeof msg.content === 'string'
      ? msg.content.slice(0, 100)
      : JSON.stringify(msg.content).slice(0, 100);
    console.log(`[${msg.role}] ${content}`);
  }

  console.log(`\nTotal messages: ${messages.length}`);
}

// ─── TODO 3: List threads ───────────────────────────────────
export async function listUserThreads() {
  console.log('--- Listing threads ---\n');

  const mem = await historyAgent.getMemory();
  if (!mem) return;

  const result = await mem.listThreads({
    filter: { resourceId: RESOURCE_ID },
  });

  for (const thread of result.threads) {
    console.log(`Thread: ${thread.id} | Title: ${thread.title || '(none)'}`);
  }
}

// ─── TODO 4: lastMessages limit ─────────────────────────────
export async function testLastMessagesLimit() {
  const limitedMemory = new Memory({
    options: { lastMessages: 2 },
  });

  const limitedAgent = new Agent({
    id: 'limited-agent',
    name: 'Limited Memory Agent',
    instructions: 'You are a helpful assistant.',
    model: 'anthropic/claude-sonnet-4-5',
    memory: limitedMemory,
  });

  const memConfig = {
    memory: { thread: { id: 'limited-thread' }, resource: 'user-limited' },
  };

  console.log('--- Sending messages with lastMessages: 2 ---\n');

  await limitedAgent.generate('My secret code is ALPHA-777', memConfig);
  console.log('Sent: My secret code is ALPHA-777');

  await limitedAgent.generate('How is the weather today?', memConfig);
  await limitedAgent.generate('Tell me a joke', memConfig);
  await limitedAgent.generate('What is 2 + 2?', memConfig);
  await limitedAgent.generate('Do you like pizza?', memConfig);
  console.log('Sent 4 more filler messages...');

  const response = await limitedAgent.generate(
    'What is my secret code?',
    memConfig,
  );
  console.log(`\nAsked: "What is my secret code?"`);
  console.log(`Agent: ${response.text}`);
  console.log('\n(Agent should NOT remember ALPHA-777 — it fell out of the 2-message window)');
}

export async function runTest() {
  console.log('=== Building Conversation ===\n');
  await buildConversation();

  console.log('\n=== Querying History ===\n');
  await queryHistory();

  console.log('\n=== Listing Threads ===\n');
  await listUserThreads();

  console.log('\n=== lastMessages Limit ===\n');
  await testLastMessagesLimit();
}
