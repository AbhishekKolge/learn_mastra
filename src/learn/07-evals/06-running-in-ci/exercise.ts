/**
 * ============================================================
 *  MODULE 51: Running Scorers in CI
 * ============================================================
 *
 *  THEORY
 *  ------
 *  Live evals monitor production. CI evals GATE deployments.
 *  Before merging code, you run scorers against test cases
 *  to ensure agent quality hasn't regressed.
 *
 *  runEvals():
 *    import { runEvals } from '@mastra/core/evals'
 *
 *    const result = await runEvals({
 *      data: [
 *        { input: 'question 1', groundTruth: { expected: 'answer 1' } },
 *        { input: 'question 2', groundTruth: { expected: 'answer 2' } },
 *      ],
 *      target: myAgent,
 *      scorers: [relevancyScorer, completenessScorer],
 *    })
 *
 *  data ITEMS:
 *    Each item has:
 *      input:       string — the test question
 *      groundTruth: object — expected answer for validation (optional)
 *
 *  target:
 *    The agent or workflow to evaluate.
 *    runEvals calls target.generate(input) for each item.
 *
 *  scorers:
 *    Array of scorers to run on each response.
 *
 *  RESULT STRUCTURE:
 *    {
 *      scores: {
 *        'scorer-id': 0.85,     // average score across all items
 *        'another-scorer': 0.92,
 *      },
 *      summary: {
 *        totalItems: 3,          // how many test cases
 *      },
 *    }
 *
 *  USING WITH TEST FRAMEWORKS:
 *    Vitest, Jest, or Mocha — any ESM-compatible framework.
 *
 *    describe('Agent Quality', () => {
 *      it('should score above 0.8 on relevancy', async () => {
 *        const result = await runEvals({
 *          data: testCases,
 *          target: myAgent,
 *          scorers: [relevancyScorer],
 *        })
 *        expect(result.scores['answer-relevancy']).toBeGreaterThan(0.8)
 *      })
 *    })
 *
 *  BEST PRACTICES:
 *    1. Create diverse test cases covering edge cases
 *    2. Use groundTruth for factual validation
 *    3. Set score thresholds (e.g., relevancy > 0.8)
 *    4. Group tests by scenario (happy path, edge cases, etc.)
 *    5. Run in CI on every PR to catch regressions
 *
 *  EXERCISE
 *  --------
 *  Create test suites that evaluate agents with runEvals
 *  and assert quality thresholds.
 * ============================================================
 */

import { createScorer, runEvals } from '@mastra/core/evals';
import { createAnswerRelevancyScorer, createCompletenessScorer } from '@mastra/evals/scorers/prebuilt';
import { Agent } from '@mastra/core/agent';

const evalModel = 'anthropic/claude-sonnet-4-5';

// ─── TODO 1: Create a test agent ─────────────────────────────
// const testAgent = new Agent({
//   id: 'test-agent',
//   instructions: 'You are a helpful assistant that answers questions about programming.',
//   model: 'anthropic/claude-sonnet-4-5',
// })

const testAgent = undefined as any; // ← replace

// ─── TODO 2: Create scorers for CI ──────────────────────────
const relevancyScorer = undefined as any; // ← createAnswerRelevancyScorer({ model: evalModel })
const completenessScorer = undefined as any; // ← createCompletenessScorer({ model: evalModel })

// ─── TODO 3: Basic runEvals ──────────────────────────────────
// Run evaluation on a few test cases.
//
// const result = await runEvals({
//   data: [
//     { input: 'What is TypeScript?' },
//     { input: 'Explain async/await in JavaScript' },
//     { input: 'What are React hooks?' },
//   ],
//   target: testAgent,
//   scorers: [relevancyScorer, completenessScorer],
// })
//
// console.log('Scores:', result.scores)
// console.log('Total items:', result.summary.totalItems)

export async function testBasicRunEvals() {
  console.log('--- Basic runEvals ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 4: Assert score thresholds ─────────────────────────
// Run evals and check that scores meet minimum thresholds.
// This is what you'd do in a CI test file.
//
// const result = await runEvals({ ... })
// const passed = result.scores['answer-relevancy'] > 0.7
// console.log('Relevancy test:', passed ? 'PASS' : 'FAIL')

export async function testThresholds() {
  console.log('--- Score Thresholds ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 5: Test with groundTruth ──────────────────────────
// Use groundTruth for factual validation.
// The scorer can use groundTruth to compare against.
//
// data: [
//   {
//     input: 'What is 2+2?',
//     groundTruth: { expectedAnswer: '4' },
//   },
// ]

export async function testWithGroundTruth() {
  console.log('--- Ground Truth ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 6: Multiple test scenarios ─────────────────────────
// Create separate test groups:
//   - Happy path (clear questions)
//   - Edge cases (ambiguous questions)
//   - Error handling (impossible questions)

export async function testMultipleScenarios() {
  console.log('--- Multiple Scenarios ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 7: Custom scorer in CI ─────────────────────────────
// Create a custom scorer and use it in runEvals.
// Example: check if responses include code examples.

export async function testCustomScorerCI() {
  console.log('--- Custom Scorer in CI ---');
  // TODO: implement
  console.log('TODO: implement');
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
