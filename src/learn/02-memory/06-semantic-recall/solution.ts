/**
 * MODULE 14: Semantic Recall — SOLUTION
 */

import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore, LibSQLVector } from '@mastra/libsql';
import { ModelRouterEmbeddingModel } from '@mastra/core/llm';

// ─── TODO 1: Memory with semantic recall ────────────────────
const semanticMemory = new Memory({
  storage: new LibSQLStore({ id: 'sr-storage', url: 'file:./semantic.db' }),
  vector: new LibSQLVector({ id: 'sr-vector', url: 'file:./semantic.db' }),
  embedder: new ModelRouterEmbeddingModel('openai/text-embedding-3-small'),
  options: {
    lastMessages: 5,
    semanticRecall: {
      topK: 3,
      messageRange: 1,
    },
  },
});

export const semanticAgent = new Agent({
  id: 'semantic-agent',
  name: 'Semantic Recall Agent',
  instructions: `
    You are a helpful assistant with excellent memory.
    You can recall past conversations even from long ago.
    When answering, mention if you're recalling from earlier conversations.
    Keep responses concise.
  `,
  model: 'anthropic/claude-sonnet-4-5',
  memory: semanticMemory,
});

// ─── TODO 2: Build history ──────────────────────────────────
export async function buildHistory() {
  const memConfig = {
    memory: { thread: { id: 'semantic-thread' }, resource: 'user-semantic' },
  };

  const messages = [
    'My birthday is March 15th and I always celebrate with sushi.',
    "I've been working on a machine learning project using PyTorch.",
    "My dog's name is Biscuit and he's a golden retriever.",
    'The deployment pipeline uses GitHub Actions and Docker.',
    'I really enjoy hiking in the mountains on weekends.',
    'The database schema has 15 tables with complex relationships.',
    'My favorite book is Dune by Frank Herbert.',
    'We use Redis for caching and RabbitMQ for message queues.',
    "I'm allergic to peanuts but love all other nuts.",
    'The frontend is built with Next.js and Tailwind CSS.',
  ];

  for (const msg of messages) {
    console.log(`Sending: ${msg}`);
    await semanticAgent.generate(msg, memConfig);
  }
}

// ─── TODO 3: Test semantic recall ───────────────────────────
export async function testSemanticRecall() {
  const memConfig = {
    memory: { thread: { id: 'semantic-thread' }, resource: 'user-semantic' },
  };

  console.log('--- Testing recall (lastMessages: 5) ---\n');

  const r1 = await semanticAgent.generate('When is my birthday?', memConfig);
  console.log('Q: When is my birthday?');
  console.log('A:', r1.text, '\n');

  const r2 = await semanticAgent.generate("What's my pet's name?", memConfig);
  console.log("Q: What's my pet's name?");
  console.log('A:', r2.text, '\n');

  const r3 = await semanticAgent.generate('What ML framework do I use?', memConfig);
  console.log('Q: What ML framework do I use?');
  console.log('A:', r3.text);
}

// ─── TODO 4: Manual recall ──────────────────────────────────
export async function testManualRecall() {
  console.log('--- Manual semantic search ---\n');

  const mem = await semanticAgent.getMemory();
  if (!mem) {
    console.log('No memory configured!');
    return;
  }

  const { messages } = await mem.recall({
    threadId: 'semantic-thread',
    vectorSearchString: 'food allergies',
    threadConfig: {
      semanticRecall: true,
    },
  });

  console.log(`Found ${messages.length} relevant messages:`);
  for (const msg of messages) {
    const content = typeof msg.content === 'string'
      ? msg.content.slice(0, 100)
      : JSON.stringify(msg.content).slice(0, 100);
    console.log(`  [${msg.role}] ${content}`);
  }
}

export async function runTest() {
  console.log('=== Building Conversation History ===\n');
  await buildHistory();

  console.log('\n=== Testing Semantic Recall ===\n');
  await testSemanticRecall();

  console.log('\n=== Manual Recall ===\n');
  await testManualRecall();
}
