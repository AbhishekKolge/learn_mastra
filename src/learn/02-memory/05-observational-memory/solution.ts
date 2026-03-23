/**
 * MODULE 13: Observational Memory — SOLUTION
 */

import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';

// ─── TODO 1: OM memory ──────────────────────────────────────
const omMemory = new Memory({
  options: {
    lastMessages: 20,
    observationalMemory: {
      model: 'anthropic/claude-haiku-4-5',
      scope: 'thread',
    },
  },
});

export const omAgent = new Agent({
  id: 'om-agent',
  name: 'Observational Memory Agent',
  instructions: `
    You are a helpful assistant for long-running projects.
    You can handle very long conversations because your memory
    system automatically compresses older messages into summaries.
    Always be helpful and reference earlier context when relevant.
  `,
  model: 'anthropic/claude-sonnet-4-5',
  memory: omMemory,
});

// ─── TODO 2: Basic OM test ──────────────────────────────────
export async function testBasicOM() {
  const memConfig = {
    memory: { thread: { id: 'om-test-thread' }, resource: 'user-om' },
  };

  console.log('--- OM enabled, short conversation ---\n');

  const r1 = await omAgent.generate(
    "I'm building an e-commerce app with Next.js and Stripe",
    memConfig,
  );
  console.log('Agent:', r1.text, '\n');

  const r2 = await omAgent.generate(
    'The app needs user auth, product catalog, and a shopping cart',
    memConfig,
  );
  console.log('Agent:', r2.text, '\n');

  const r3 = await omAgent.generate(
    "What am I building? Summarize the project so far.",
    memConfig,
  );
  console.log('Agent:', r3.text);

  console.log('\n(OM is active but not yet compressing — below 30K token threshold)');
  console.log('In a real project, after 100+ messages, you\'d see observations kick in');
}

// ─── Advanced OM config (for reference) ─────────────────────
// Uncomment to use custom thresholds:
//
// const advancedOMMemory = new Memory({
//   options: {
//     lastMessages: 20,
//     observationalMemory: {
//       model: 'anthropic/claude-haiku-4-5',
//       scope: 'thread',
//       observation: {
//         messageTokens: 30_000,
//         bufferTokens: 0.2,
//         bufferActivation: 0.8,
//         blockAfter: 1.2,
//         previousObserverTokens: 2000,
//       },
//       reflection: {
//         observationTokens: 40_000,
//         bufferActivation: 0.5,
//         blockAfter: 1.2,
//       },
//     },
//   },
// });

export async function runTest() {
  console.log('=== Observational Memory ===\n');
  await testBasicOM();

  console.log('\n--- OM Architecture Summary ---');
  console.log('Tier 1: Recent messages (raw, full fidelity)');
  console.log('Tier 2: Observations (compressed at ~30K tokens)');
  console.log('Tier 3: Reflections (compressed observations at ~40K tokens)');
  console.log('\nOM runs in background — agent never pauses');
  console.log('Use fast models: gemini-2.5-flash, gpt-4o-mini, claude-haiku-4-5');
}
