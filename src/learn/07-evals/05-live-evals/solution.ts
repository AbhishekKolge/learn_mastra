/**
 * MODULE 50: Live Evaluations — SOLUTION
 */

import { Agent } from '@mastra/core/agent';
import { Mastra } from '@mastra/core/mastra';
import { LibSQLStore } from '@mastra/libsql';
import { createAnswerRelevancyScorer, createToxicityScorer, createCompletenessScorer } from '@mastra/evals/scorers/prebuilt';

const evalModel = 'anthropic/claude-sonnet-4-5';

// ─── TODO 1: Create an agent with live scorers ──────────────
export const evaluatedAgent = new Agent({
  id: 'evaluated-agent',
  name: 'Evaluated Agent',
  instructions: 'You answer questions helpfully and safely. Keep responses concise.',
  model: 'anthropic/claude-sonnet-4-5',
  scorers: {
    relevancy: {
      scorer: createAnswerRelevancyScorer({ model: evalModel }),
      sampling: { type: 'ratio' as const, rate: 0.5 },
    },
    safety: {
      scorer: createToxicityScorer({ model: evalModel }),
      sampling: { type: 'ratio' as const, rate: 1 },
    },
  },
});

// ─── TODO 2: Register with Mastra ───────────────────────────
const mastra = new Mastra({
  agents: { evaluatedAgent },
  storage: new LibSQLStore({
    url: 'file:./evals.db',
  }),
});

// ─── TODO 3: Test live scoring ───────────────────────────────
export async function testLiveScoring() {
  console.log('--- Live Scoring ---');

  const agent = mastra.getAgent('evaluatedAgent');

  const questions = [
    'What is TypeScript?',
    'How does React work?',
    'Explain REST APIs',
  ];

  for (const q of questions) {
    const start = Date.now();
    const r = await agent.generate(q);
    const elapsed = Date.now() - start;

    console.log(`Q: "${q}"`);
    console.log(`  A: ${r.text.slice(0, 80)}... (${elapsed}ms)`);
    console.log('  Scorers run asynchronously — no delay on response');
  }

  // Wait a bit for async scorers to complete
  console.log('\nWaiting for background scorers...');
  await new Promise(r => setTimeout(r, 3000));
  console.log('Scores should now be stored in mastra_scorers table');
  console.log('View them in Mastra Studio at http://localhost:4111');
}

// ─── TODO 4: Test different sampling rates ──────────────────
export async function testSamplingRates() {
  console.log('--- Sampling Rates ---');

  // Create agents with different rates
  const rates = [1.0, 0.5, 0.0];

  for (const rate of rates) {
    const agent = new Agent({
      id: `rate-${rate}`,
      instructions: 'Answer briefly.',
      model: 'anthropic/claude-sonnet-4-5',
      scorers: {
        relevancy: {
          scorer: createAnswerRelevancyScorer({ model: evalModel }),
          sampling: { type: 'ratio' as const, rate },
        },
      },
    });

    console.log(`\nRate: ${rate} (${rate * 100}% of responses scored)`);
    console.log(`  rate=1.0 → every response scored`);
    console.log(`  rate=0.5 → ~half scored`);
    console.log(`  rate=0.0 → none scored (disabled)`);
  }
}

// ─── TODO 5: Multiple scorers on one agent ──────────────────
export async function testMultipleScorers() {
  console.log('--- Multiple Scorers ---');

  const multiScorerAgent = new Agent({
    id: 'multi-scorer-agent',
    instructions: 'You are a comprehensive assistant.',
    model: 'anthropic/claude-sonnet-4-5',
    scorers: {
      relevancy: {
        scorer: createAnswerRelevancyScorer({ model: evalModel }),
        sampling: { type: 'ratio' as const, rate: 1.0 },
      },
      completeness: {
        scorer: createCompletenessScorer({ model: evalModel }),
        sampling: { type: 'ratio' as const, rate: 0.5 },
      },
      safety: {
        scorer: createToxicityScorer({ model: evalModel }),
        sampling: { type: 'ratio' as const, rate: 0.3 },
      },
    },
  });

  console.log('Agent with 3 scorers:');
  console.log('  relevancy:    100% sampling (every response)');
  console.log('  completeness: 50% sampling (half of responses)');
  console.log('  safety:       30% sampling (cost-effective for low-risk)');
  console.log('\nEach scorer runs independently — different rates, same agent.');
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
