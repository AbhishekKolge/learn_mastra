/**
 * ============================================================
 *  MODULE 52: Trace Evaluations
 * ============================================================
 *
 *  THEORY
 *  ------
 *  Live evals score responses in real-time. CI evals gate
 *  deployments. TRACE EVALS score HISTORICAL interactions —
 *  past conversations you've already collected.
 *
 *  WHY TRACE EVALS?
 *    - Analyze past performance ("how did we do last week?")
 *    - Debug issues ("why did this conversation go wrong?")
 *    - Batch evaluate ("score all last 1000 responses")
 *    - Compare models ("did switching models improve quality?")
 *
 *  PREREQUISITES:
 *    Trace evals require OBSERVABILITY configured so that
 *    traces are collected and stored.
 *
 *    new Mastra({
 *      observability: new Observability({
 *        exporters: [new DefaultExporter()],
 *      }),
 *    })
 *
 *  REGISTERING SCORERS ON MASTRA:
 *    To score traces in Studio, register scorers on the Mastra instance:
 *
 *    const mastra = new Mastra({
 *      scorers: {
 *        answerRelevancy: myRelevancyScorer,
 *        responseQuality: myQualityScorer,
 *      },
 *    })
 *
 *    Once registered, you can run them against traces in Studio
 *    under the Observability section.
 *
 *  STUDIO TRACE SCORING:
 *    1. Open Mastra Studio (pnpm dev → http://localhost:4111)
 *    2. Go to the Observability section
 *    3. Select a trace
 *    4. Choose a scorer to run against it
 *    5. View the score and reason
 *
 *  TYPE 'agent' FOR TRACE COMPATIBILITY:
 *    For scorers that work with both live agent scoring AND
 *    trace scoring, use type: 'agent':
 *
 *    const myScorer = createScorer({
 *      type: 'agent',
 *      id: 'my-scorer',
 *      description: '...',
 *    }).generateScore(({ run }) => {
 *      // run.output is typed as ScorerRunOutputForAgent
 *      return run.output.text.length > 100 ? 1 : 0
 *    })
 *
 *  COMBINING ALL THREE EVAL MODES:
 *    1. Live evals: continuous monitoring in production
 *    2. CI evals: quality gates before deployment
 *    3. Trace evals: historical analysis and debugging
 *
 *    Together they create a complete quality assurance system.
 *
 *  EXERCISE
 *  --------
 *  Register scorers with Mastra for trace evaluation and
 *  design a complete eval strategy.
 * ============================================================
 */

import { Agent } from '@mastra/core/agent';
import { Mastra } from '@mastra/core/mastra';
import { LibSQLStore } from '@mastra/libsql';
import { PinoLogger } from '@mastra/loggers';
import { Observability, DefaultExporter } from '@mastra/observability';
import { createScorer } from '@mastra/core/evals';
import { createAnswerRelevancyScorer, createCompletenessScorer, createToxicityScorer } from '@mastra/evals/scorers/prebuilt';

const evalModel = 'anthropic/claude-sonnet-4-5';

// ─── TODO 1: Create scorers for trace evaluation ─────────────
// Create scorers that can work with both live and trace modes.
//
// const relevancyScorer = createAnswerRelevancyScorer({ model: evalModel })
// const completenessScorer = createCompletenessScorer({ model: evalModel })
// const toxicityScorer = createToxicityScorer({ model: evalModel })

// ─── TODO 2: Register scorers with Mastra ────────────────────
// const mastra = new Mastra({
//   agents: { myAgent },
//   scorers: {
//     answerRelevancy: relevancyScorer,
//     completeness: completenessScorer,
//     safety: toxicityScorer,
//   },
//   storage: new LibSQLStore({ url: 'file:./trace-evals.db' }),
//   observability: new Observability({
//     configs: {
//       default: {
//         serviceName: 'evals-exercise',
//         exporters: [new DefaultExporter()],
//       },
//     },
//   }),
// })

// ─── TODO 3: Generate some traces ───────────────────────────
// Run the agent several times to generate trace data.
// These traces can then be scored in Studio.

export async function testGenerateTraces() {
  console.log('--- Generate Traces ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 4: Create an agent-type scorer for traces ──────────
// Use type: 'agent' for trace compatibility.
//
// const agentScorer = createScorer({
//   type: 'agent',
//   id: 'response-length',
//   description: 'Checks if agent response is sufficiently detailed',
// }).generateScore(({ run }) => {
//   const wordCount = run.output.text.split(/\s+/).length
//   return Math.min(wordCount / 50, 1)
// })

export async function testAgentTypeScorer() {
  console.log('--- Agent Type Scorer ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 5: Design a complete eval strategy ────────────────
// Plan which scorers to use for each eval mode:
//
// LIVE (production monitoring):
//   - toxicity (100% — always check safety)
//   - relevancy (50% — sample for cost)
//
// CI (deployment gates):
//   - relevancy (threshold: > 0.8)
//   - completeness (threshold: > 0.7)
//   - custom domain scorer (threshold: > 0.9)
//
// TRACE (historical analysis):
//   - all above scorers
//   - run on-demand via Studio
//
// Print the strategy as a structured report.

export async function testEvalStrategy() {
  console.log('--- Complete Eval Strategy ---');
  // TODO: implement the strategy report
  console.log('TODO: implement');
}

// ─── Run all tests ───────────────────────────────────────────
export async function runTest() {
  console.log('=== Trace Evaluations ===\n');

  await testGenerateTraces();
  console.log('\n');
  await testAgentTypeScorer();
  console.log('\n');
  await testEvalStrategy();
}
