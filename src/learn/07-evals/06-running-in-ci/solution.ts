/**
 * MODULE 51: Running Scorers in CI — SOLUTION
 */

import { createScorer, runEvals } from '@mastra/core/evals';
import { createAnswerRelevancyScorer, createCompletenessScorer } from '@mastra/evals/scorers/prebuilt';
import { Agent } from '@mastra/core/agent';

const evalModel = 'anthropic/claude-sonnet-4-5';

// ─── TODO 1 & 2: Agent and scorers ──────────────────────────
const testAgent = new Agent({
  id: 'ci-test-agent',
  instructions: 'You are a helpful programming assistant. Always include code examples when relevant. Answer concisely.',
  model: 'anthropic/claude-sonnet-4-5',
});

const relevancyScorer = createAnswerRelevancyScorer({ model: evalModel });
const completenessScorer = createCompletenessScorer({ model: evalModel });

// ─── TODO 3: Basic runEvals ──────────────────────────────────
export async function testBasicRunEvals() {
  console.log('--- Basic runEvals ---');

  const result = await runEvals({
    data: [
      { input: 'What is TypeScript?' },
      { input: 'Explain async/await in JavaScript' },
      { input: 'What are React hooks?' },
    ],
    target: testAgent,
    scorers: [relevancyScorer, completenessScorer],
  });

  console.log('Scores:');
  for (const [scorer, score] of Object.entries(result.scores)) {
    console.log(`  ${scorer}: ${(score as number).toFixed(3)}`);
  }
  console.log(`Total items evaluated: ${result.summary.totalItems}`);
}

// ─── TODO 4: Assert score thresholds ─────────────────────────
export async function testThresholds() {
  console.log('--- Score Thresholds ---');

  const result = await runEvals({
    data: [
      { input: 'How do I create a REST API in Express?' },
      { input: 'What is the difference between let and const?' },
    ],
    target: testAgent,
    scorers: [relevancyScorer, completenessScorer],
  });

  const thresholds: Record<string, number> = {
    'answer-relevancy': 0.7,
    'completeness': 0.6,
  };

  console.log('Threshold checks:');
  for (const [scorer, threshold] of Object.entries(thresholds)) {
    const score = (result.scores as any)[scorer] ?? 0;
    const passed = score >= threshold;
    console.log(`  ${scorer}: ${score.toFixed(3)} ${passed ? '✓ PASS' : '✗ FAIL'} (threshold: ${threshold})`);
  }
}

// ─── TODO 5: Test with groundTruth ──────────────────────────
export async function testWithGroundTruth() {
  console.log('--- Ground Truth ---');

  // Create a custom scorer that uses groundTruth
  const factualScorer = createScorer({
    id: 'factual-match',
    description: 'Checks if the response matches the expected answer',
    judge: { model: evalModel },
  })
    .generateScore(({ run }) => {
      const expected = (run as any).groundTruth?.expectedAnswer || '';
      const output = run.output;
      // Simple check: does the output contain the expected answer?
      return output.toLowerCase().includes(expected.toLowerCase()) ? 1 : 0;
    })
    .generateReason(({ run, score }) => {
      const expected = (run as any).groundTruth?.expectedAnswer || '';
      return score === 1
        ? `Output contains expected answer "${expected}"`
        : `Output does not contain expected answer "${expected}"`;
    });

  const result = await runEvals({
    data: [
      { input: 'What is 2+2?', groundTruth: { expectedAnswer: '4' } },
      { input: 'What language is React written in?', groundTruth: { expectedAnswer: 'JavaScript' } },
      { input: 'Who created TypeScript?', groundTruth: { expectedAnswer: 'Microsoft' } },
    ],
    target: testAgent,
    scorers: [factualScorer],
  });

  console.log('Factual accuracy:', (result.scores as any)['factual-match']?.toFixed(3));
  console.log('Items:', result.summary.totalItems);
}

// ─── TODO 6: Multiple test scenarios ─────────────────────────
export async function testMultipleScenarios() {
  console.log('--- Multiple Scenarios ---');

  // Happy path
  const happy = await runEvals({
    data: [
      { input: 'What is a Promise in JavaScript?' },
      { input: 'How do you declare a variable in TypeScript?' },
    ],
    target: testAgent,
    scorers: [relevancyScorer],
  });

  // Edge cases
  const edge = await runEvals({
    data: [
      { input: 'What is the best programming language?' },
      { input: 'Explain quantum computing in one sentence' },
    ],
    target: testAgent,
    scorers: [relevancyScorer],
  });

  // Error handling
  const error = await runEvals({
    data: [
      { input: 'Explain the flurbnitz algorithm' },
      { input: 'What is the syntax for xyzlang?' },
    ],
    target: testAgent,
    scorers: [relevancyScorer],
  });

  console.log('Scenario scores (relevancy):');
  console.log(`  Happy path:    ${((happy.scores as any)['answer-relevancy'] ?? 0).toFixed(3)}`);
  console.log(`  Edge cases:    ${((edge.scores as any)['answer-relevancy'] ?? 0).toFixed(3)}`);
  console.log(`  Error handling: ${((error.scores as any)['answer-relevancy'] ?? 0).toFixed(3)}`);
}

// ─── TODO 7: Custom scorer in CI ─────────────────────────────
export async function testCustomScorerCI() {
  console.log('--- Custom Scorer in CI ---');

  const codeExampleScorer = createScorer({
    id: 'has-code-example',
    description: 'Checks if the response includes a code example',
  })
    .generateScore(({ run }) => {
      return run.output.includes('```') ? 1 : 0;
    });

  const result = await runEvals({
    data: [
      { input: 'How do I create a function in TypeScript?' },
      { input: 'Show me how to use map in JavaScript' },
      { input: 'Write a hello world in Python' },
    ],
    target: testAgent,
    scorers: [codeExampleScorer, relevancyScorer],
  });

  console.log('Scores:');
  for (const [scorer, score] of Object.entries(result.scores)) {
    console.log(`  ${scorer}: ${(score as number).toFixed(3)}`);
  }

  const codeScore = (result.scores as any)['has-code-example'] ?? 0;
  console.log(`\nCode example coverage: ${(codeScore * 100).toFixed(0)}% of responses include code`);
}

// ─── Run all tests ───────────────────────────────────────────
export async function runTest() {
  console.log('=== Running in CI ===\n');

  await testBasicRunEvals();
  console.log('\n');
  await testThresholds();
  console.log('\n');
  await testWithGroundTruth();
  console.log('\n');
  await testMultipleScenarios();
  console.log('\n');
  await testCustomScorerCI();
}
