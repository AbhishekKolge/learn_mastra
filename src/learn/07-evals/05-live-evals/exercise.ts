/**
 * ============================================================
 *  MODULE 50: Live Evaluations
 * ============================================================
 *
 *  THEORY
 *  ------
 *  Running scorers manually is useful for testing, but in
 *  production you want CONTINUOUS quality monitoring. Live
 *  evaluations run scorers automatically on agent outputs
 *  without blocking the response.
 *
 *  HOW IT WORKS:
 *    1. Agent generates a response (no delay)
 *    2. Scorers run ASYNCHRONOUSLY in the background
 *    3. Scores are stored in the mastra_scorers table
 *    4. You can analyze trends in Mastra Studio
 *
 *  ADDING SCORERS TO AGENTS:
 *    new Agent({
 *      id: 'my-agent',
 *      model: '...',
 *      scorers: {
 *        relevancy: {
 *          scorer: createAnswerRelevancyScorer({ model }),
 *          sampling: { type: 'ratio', rate: 0.5 },
 *        },
 *        safety: {
 *          scorer: createToxicityScorer({ model }),
 *          sampling: { type: 'ratio', rate: 1 },
 *        },
 *      },
 *    })
 *
 *  SAMPLING:
 *    Controls what percentage of outputs get scored.
 *    sampling: { type: 'ratio', rate: N }
 *
 *    rate: 1.0 → score EVERY response (100%)
 *    rate: 0.5 → score half (50%)
 *    rate: 0.1 → score 10%
 *    rate: 0.0 → disabled
 *
 *    Why not always 1.0? Scorers (especially LLM-based) cost
 *    money and add latency. For high-volume agents, sample.
 *
 *  ADDING SCORERS TO WORKFLOW STEPS:
 *    createStep({
 *      id: 'content-step',
 *      scorers: {
 *        quality: {
 *          scorer: myScorer(),
 *          sampling: { type: 'ratio', rate: 1 },
 *        },
 *      },
 *      inputSchema: ...,
 *      outputSchema: ...,
 *      execute: async ({ inputData }) => { ... },
 *    })
 *
 *  AUTOMATIC STORAGE:
 *    Scores are stored in your configured database automatically
 *    (mastra_scorers table). You need storage configured:
 *
 *    new Mastra({
 *      storage: new LibSQLStore({ url: 'file:./mastra.db' }),
 *    })
 *
 *  VIEWING RESULTS:
 *    - Mastra Studio (pnpm dev → http://localhost:4111)
 *    - Programmatic queries to the storage
 *
 *  EXERCISE
 *  --------
 *  Attach live scorers to agents and workflow steps.
 * ============================================================
 */

import { Agent } from '@mastra/core/agent';
import { Mastra } from '@mastra/core/mastra';
import { LibSQLStore } from '@mastra/libsql';
import { createAnswerRelevancyScorer, createToxicityScorer, createCompletenessScorer } from '@mastra/evals/scorers/prebuilt';

// ─── TODO 1: Create an agent with live scorers ──────────────
// Add relevancy (50% sampling) and toxicity (100% sampling).
//
// const evaluatedAgent = new Agent({
//   id: 'evaluated-agent',
//   instructions: 'You answer questions helpfully and safely.',
//   model: 'anthropic/claude-sonnet-4-5',
//   scorers: {
//     relevancy: {
//       scorer: createAnswerRelevancyScorer({ model: 'anthropic/claude-sonnet-4-5' }),
//       sampling: { type: 'ratio', rate: 0.5 },
//     },
//     safety: {
//       scorer: createToxicityScorer({ model: 'anthropic/claude-sonnet-4-5' }),
//       sampling: { type: 'ratio', rate: 1 },
//     },
//   },
// })

export const evaluatedAgent = undefined as any; // ← replace

// ─── TODO 2: Register with Mastra (for storage) ─────────────
// const mastra = new Mastra({
//   agents: { evaluatedAgent },
//   storage: new LibSQLStore({ url: 'file:./evals.db' }),
// })

// ─── TODO 3: Test live scoring ───────────────────────────────
// Generate several responses. Scores run in the background.
// The agent response is NOT delayed by scoring.
//
// const agent = mastra.getAgent('evaluatedAgent')
// const r1 = await agent.generate('What is TypeScript?')
// const r2 = await agent.generate('How does React work?')
// const r3 = await agent.generate('Explain REST APIs')

export async function testLiveScoring() {
  console.log('--- Live Scoring ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 4: Test different sampling rates ──────────────────
// Create agents with rate: 1.0, 0.5, and 0.0.
// Generate 10 responses from each.
// Verify that scoring happens at the expected frequency.

export async function testSamplingRates() {
  console.log('--- Sampling Rates ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 5: Multiple scorers on one agent ──────────────────
// Create an agent with 3+ scorers at different rates.
// Show how each scorer runs independently.

export async function testMultipleScorers() {
  console.log('--- Multiple Scorers ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── Run all tests ───────────────────────────────────────────
export async function runTest() {
  console.log('=== Live Evaluations ===\n');

  await testLiveScoring();
  console.log('\n');
  await testSamplingRates();
  console.log('\n');
  await testMultipleScorers();
}
