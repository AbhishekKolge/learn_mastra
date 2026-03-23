/**
 * MODULE 52: Trace Evaluations — SOLUTION
 */

import { Agent } from '@mastra/core/agent';
import { Mastra } from '@mastra/core/mastra';
import { LibSQLStore } from '@mastra/libsql';
import { PinoLogger } from '@mastra/loggers';
import { Observability, DefaultExporter } from '@mastra/observability';
import { createScorer } from '@mastra/core/evals';
import { createAnswerRelevancyScorer, createCompletenessScorer, createToxicityScorer } from '@mastra/evals/scorers/prebuilt';

const evalModel = 'anthropic/claude-sonnet-4-5';

// ─── TODO 1: Create scorers ─────────────────────────────────
const relevancyScorer = createAnswerRelevancyScorer({ model: evalModel });
const completenessScorer = createCompletenessScorer({ model: evalModel });
const toxicityScorer = createToxicityScorer({ model: evalModel });

// ─── TODO 2: Register with Mastra ───────────────────────────
const testAgent = new Agent({
  id: 'trace-test-agent',
  instructions: 'You are a helpful programming assistant. Answer concisely with examples.',
  model: 'anthropic/claude-sonnet-4-5',
});

const mastra = new Mastra({
  agents: { traceTestAgent: testAgent },
  scorers: {
    answerRelevancy: relevancyScorer,
    completeness: completenessScorer,
    safety: toxicityScorer,
  },
  storage: new LibSQLStore({ url: 'file:./trace-evals.db' }),
  logger: new PinoLogger({ name: 'evals', level: 'info' }),
  observability: new Observability({
    configs: {
      default: {
        serviceName: 'evals-exercise',
        exporters: [new DefaultExporter()],
      },
    },
  }),
});

// ─── TODO 3: Generate some traces ───────────────────────────
export async function testGenerateTraces() {
  console.log('--- Generate Traces ---');

  const agent = mastra.getAgent('traceTestAgent');
  const questions = [
    'What is a closure in JavaScript?',
    'How do Promises work?',
    'Explain the event loop',
    'What are generics in TypeScript?',
    'How does async/await work?',
  ];

  for (const q of questions) {
    const r = await agent.generate(q);
    console.log(`  Q: "${q}" → ${r.text.slice(0, 50)}...`);
  }

  console.log(`\nGenerated ${questions.length} traces.`);
  console.log('View and score them in Studio: http://localhost:4111');
  console.log('Go to Observability → select a trace → run a scorer');
}

// ─── TODO 4: Create an agent-type scorer for traces ──────────
export async function testAgentTypeScorer() {
  console.log('--- Agent Type Scorer ---');

  const responseLengthScorer = createScorer({
    type: 'agent',
    id: 'response-length',
    description: 'Checks if agent response is sufficiently detailed (50+ words)',
  })
    .preprocess(({ run }) => {
      const text = typeof run.output === 'string' ? run.output : (run.output as any)?.text || '';
      const wordCount = text.split(/\s+/).filter(Boolean).length;
      return { wordCount };
    })
    .generateScore(({ results }) => {
      return Math.min(results.preprocessStepResult.wordCount / 50, 1);
    })
    .generateReason(({ results, score }) => {
      const { wordCount } = results.preprocessStepResult;
      return `Response has ${wordCount} words (${score >= 1 ? 'sufficient' : 'needs more detail'}).`;
    });

  // Test it manually
  const result = await responseLengthScorer.run({
    input: 'Explain closures',
    output: 'A closure is a function that captures variables from its outer scope. Even after the outer function returns, the inner function retains access to those variables. This is useful for data encapsulation and creating factory functions.',
  });

  console.log(`Score: ${result.score.toFixed(3)}`);
  console.log(`Reason: ${result.reason}`);
  console.log('\nThis scorer works for both live agent scoring and trace scoring.');
}

// ─── TODO 5: Design a complete eval strategy ────────────────
export async function testEvalStrategy() {
  console.log('--- Complete Eval Strategy ---');

  console.log(`
╔══════════════════════════════════════════════════════╗
║           AGENT QUALITY ASSURANCE STRATEGY           ║
╠══════════════════════════════════════════════════════╣
║                                                      ║
║  1. LIVE EVALS (Production Monitoring)               ║
║  ─────────────────────────────────────               ║
║  • toxicity       → 100% sampling (safety first)     ║
║  • relevancy      → 50% sampling (cost balance)      ║
║  • response-length → 100% (cheap, no LLM call)       ║
║                                                      ║
║  Purpose: Continuous monitoring, alert on anomalies   ║
║  Storage: mastra_scorers table (auto)                ║
║                                                      ║
║  2. CI EVALS (Deployment Gates)                      ║
║  ──────────────────────────────                      ║
║  • relevancy      → threshold: > 0.80               ║
║  • completeness   → threshold: > 0.70               ║
║  • code-examples  → threshold: > 0.80               ║
║  • factual-match  → threshold: > 0.90               ║
║                                                      ║
║  Purpose: Block bad deployments, regression testing   ║
║  Test cases: 20+ per scorer, diverse scenarios        ║
║                                                      ║
║  3. TRACE EVALS (Historical Analysis)                ║
║  ────────────────────────────────────                ║
║  • All above scorers available in Studio             ║
║  • Run on-demand against any historical trace        ║
║  • Compare before/after model changes                ║
║  • Debug specific conversation failures              ║
║                                                      ║
║  Purpose: Debugging, model comparison, trend analysis ║
║  Requires: Observability + DefaultExporter           ║
║                                                      ║
╚══════════════════════════════════════════════════════╝
  `);
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
