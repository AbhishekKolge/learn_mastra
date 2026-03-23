/**
 * MODULE 12: Working Memory — SOLUTION
 */

import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { z } from 'zod';

// ─── TODO 1: Template-based working memory ──────────────────
const templateMemory = new Memory({
  options: {
    lastMessages: 10,
    workingMemory: {
      enabled: true,
      template: `
## User Profile
- Name:
- Occupation:
- Location:
- Interests:
- Preferred Language:

## Conversation Notes
- Key topics discussed:
- Open questions:
      `,
    },
  },
});

export const templateAgent = new Agent({
  id: 'template-wm-agent',
  name: 'Template Working Memory Agent',
  instructions: `
    You are a personal assistant. As users share information about
    themselves, update your working memory to remember it.
    When asked to summarize, refer to your working memory.
    Keep responses concise.
  `,
  model: 'anthropic/claude-sonnet-4-5',
  memory: templateMemory,
});

// ─── TODO 2: Test template memory ───────────────────────────
export async function testTemplateMemory() {
  const memConfig = {
    memory: { thread: { id: 'wm-template-thread' }, resource: 'user-wm-test' },
  };

  console.log('--- Feeding user info across messages ---\n');

  const r1 = await templateAgent.generate(
    "Hi, I'm Priya. I'm a data scientist in Mumbai.",
    memConfig,
  );
  console.log('Agent:', r1.text, '\n');

  const r2 = await templateAgent.generate(
    "I'm really into machine learning and photography.",
    memConfig,
  );
  console.log('Agent:', r2.text, '\n');

  const r3 = await templateAgent.generate(
    "I mostly code in Python but I'm learning Rust.",
    memConfig,
  );
  console.log('Agent:', r3.text, '\n');

  const r4 = await templateAgent.generate(
    'Can you summarize everything you know about me?',
    memConfig,
  );
  console.log('Agent:', r4.text);
}

// ─── TODO 3: Schema-based working memory ────────────────────
const schemaMemory = new Memory({
  options: {
    lastMessages: 10,
    workingMemory: {
      enabled: true,
      schema: z.object({
        userName: z.string().optional(),
        role: z.string().optional(),
        skills: z.array(z.string()).optional(),
        preferences: z.object({
          theme: z.string().optional(),
          language: z.string().optional(),
        }).optional(),
      }),
    },
  },
});

export const schemaAgent = new Agent({
  id: 'schema-wm-agent',
  name: 'Schema Working Memory Agent',
  instructions: `
    You are a personal assistant with structured memory.
    As users share info, update the relevant fields in working memory.
    When asked to summarize, list all known fields.
  `,
  model: 'anthropic/claude-sonnet-4-5',
  memory: schemaMemory,
});

// ─── TODO 4: Test schema memory ─────────────────────────────
export async function testSchemaMemory() {
  const memConfig = {
    memory: { thread: { id: 'wm-schema-thread' }, resource: 'user-wm-schema' },
  };

  console.log('--- Testing schema-based working memory ---\n');

  const r1 = await schemaAgent.generate(
    "I'm Jordan, a frontend developer",
    memConfig,
  );
  console.log('Agent:', r1.text, '\n');

  const r2 = await schemaAgent.generate(
    'I know React, Vue, and Svelte',
    memConfig,
  );
  console.log('Agent:', r2.text, '\n');

  const r3 = await schemaAgent.generate(
    'I prefer dark theme and code in TypeScript',
    memConfig,
  );
  console.log('Agent:', r3.text, '\n');

  const r4 = await schemaAgent.generate(
    'What do you know about me? List everything.',
    memConfig,
  );
  console.log('Agent:', r4.text);
}

// ─── TODO 5: Cross-thread persistence ───────────────────────
export async function testCrossThread() {
  console.log('--- Cross-thread persistence ---\n');

  const r = await schemaAgent.generate("What's my name?", {
    memory: {
      thread: { id: 'wm-different-thread' },  // different thread
      resource: 'user-wm-schema',              // same resource
    },
  });
  console.log('Agent:', r.text);
  console.log('\n(Should know "Jordan" from working memory across threads!)');
}

export async function runTest() {
  console.log('=== Template Working Memory ===\n');
  await testTemplateMemory();

  console.log('\n=== Schema Working Memory ===\n');
  await testSchemaMemory();

  console.log('\n=== Cross-Thread Persistence ===\n');
  await testCrossThread();
}
