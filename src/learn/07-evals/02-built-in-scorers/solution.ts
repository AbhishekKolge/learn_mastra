/**
 * MODULE 47: Built-in Scorers — SOLUTION
 */

import {
  createAnswerRelevancyScorer,
  createFaithfulnessScorer,
  createHallucinationScorer,
  createCompletenessScorer,
  createToxicityScorer,
  createBiasScorer,
  createToneConsistencyScorer,
} from '@mastra/evals/scorers/prebuilt';

const model = 'anthropic/claude-sonnet-4-5';

// ─── TODO 1: Create all scorers ──────────────────────────────
const scorers = {
  relevancy: createAnswerRelevancyScorer({ model }),
  faithfulness: createFaithfulnessScorer({ model }),
  hallucination: createHallucinationScorer({ model }),
  completeness: createCompletenessScorer({ model }),
  toxicity: createToxicityScorer({ model }),
  bias: createBiasScorer({ model }),
  tone: createToneConsistencyScorer({ model }),
};

// ─── TODO 2: Test faithfulness with context ──────────────────
export async function testFaithfulness() {
  console.log('--- Faithfulness (higher = more faithful to context) ---');

  const faithful = await scorers.faithfulness.run({
    input: 'What is Mastra?',
    output: 'Mastra is an open-source TypeScript framework for building AI agents and workflows.',
    context: ['Mastra is an open-source TypeScript framework for building AI agents, workflows, and tools.'],
  });

  const unfaithful = await scorers.faithfulness.run({
    input: 'What is Mastra?',
    output: 'Mastra is a Python machine learning library created by Google in 2015 for deep learning.',
    context: ['Mastra is an open-source TypeScript framework for building AI agents, workflows, and tools.'],
  });

  console.log(`Faithful:   ${faithful.score.toFixed(3)}`);
  console.log(`Unfaithful: ${unfaithful.score.toFixed(3)}`);
}

// ─── TODO 3: Test hallucination ──────────────────────────────
export async function testHallucination() {
  console.log('--- Hallucination (lower = less hallucination) ---');

  const grounded = await scorers.hallucination.run({
    input: 'What is Paris?',
    output: 'Paris is the capital of France.',
    context: ['Paris is the capital and largest city of France.'],
  });

  const hallucinated = await scorers.hallucination.run({
    input: 'What is Paris?',
    output: 'Paris is the capital of France, founded in 52 BC by Julius Caesar as a Roman military outpost named Lutetia.',
    context: ['Paris is the capital and largest city of France.'],
  });

  console.log(`Grounded:     ${grounded.score.toFixed(3)} (should be ~0)`);
  console.log(`Hallucinated: ${hallucinated.score.toFixed(3)} (should be higher)`);
}

// ─── TODO 4: Test bias detection ─────────────────────────────
export async function testBias() {
  console.log('--- Bias (lower = less bias) ---');

  const neutral = await scorers.bias.run({
    input: 'Compare Python and JavaScript',
    output: 'Python and JavaScript are both popular programming languages. Python excels in data science, while JavaScript dominates web development. Both have large ecosystems and active communities.',
  });

  const biased = await scorers.bias.run({
    input: 'Compare Python and JavaScript',
    output: 'JavaScript is clearly the superior language. Only beginners use Python. Real programmers know JavaScript is the only language that matters.',
  });

  console.log(`Neutral: ${neutral.score.toFixed(3)} (should be ~0)`);
  console.log(`Biased:  ${biased.score.toFixed(3)} (should be higher)`);
}

// ─── TODO 5: Test tone consistency ──────────────────────────
export async function testToneConsistency() {
  console.log('--- Tone Consistency (higher = more consistent) ---');

  const consistent = await scorers.tone.run({
    input: 'Explain recursion',
    output: 'Recursion is when a function calls itself. It requires a base case to stop. Each call adds to the call stack. For example, factorial(n) = n * factorial(n-1).',
  });

  const inconsistent = await scorers.tone.run({
    input: 'Explain recursion',
    output: 'Recursion is a sophisticated computational paradigm. LOL it just calls itself bro! The mathematical foundations derive from lambda calculus. its literally so easy tho why r u asking??',
  });

  console.log(`Consistent:   ${consistent.score.toFixed(3)}`);
  console.log(`Inconsistent: ${inconsistent.score.toFixed(3)}`);
}

// ─── TODO 6: Multi-scorer evaluation ─────────────────────────
export async function testMultiScorer() {
  console.log('--- Multi-Scorer Evaluation ---');

  const input = 'Explain the benefits of TypeScript';
  const output = `TypeScript offers several key benefits over JavaScript:

1. **Static Type Checking**: Catch errors at compile time rather than runtime
2. **Better IDE Support**: Autocompletion, refactoring, and navigation
3. **Code Documentation**: Types serve as living documentation
4. **Safer Refactoring**: The compiler catches breaking changes
5. **Modern Features**: Supports latest ECMAScript features with backward compatibility

TypeScript compiles to plain JavaScript, so it works everywhere JavaScript does.`;

  const context = [
    'TypeScript is a typed superset of JavaScript that adds static type checking.',
    'TypeScript improves developer productivity through better tooling and error detection.',
  ];

  console.log(`Input: "${input}"`);
  console.log(`Output: "${output.slice(0, 60)}..."\n`);

  const results = await Promise.all([
    scorers.relevancy.run({ input, output }),
    scorers.faithfulness.run({ input, output, context }),
    scorers.hallucination.run({ input, output, context }),
    scorers.completeness.run({ input, output }),
    scorers.toxicity.run({ input, output }),
    scorers.bias.run({ input, output }),
    scorers.tone.run({ input, output }),
  ]);

  const names = ['relevancy ↑', 'faithfulness ↑', 'hallucination ↓', 'completeness ↑', 'toxicity ↓', 'bias ↓', 'tone ↑'];
  console.log('Scorecard:');
  results.forEach((r, i) => {
    const bar = '█'.repeat(Math.round(r.score * 20)).padEnd(20, '░');
    console.log(`  ${names[i].padEnd(18)} ${bar} ${r.score.toFixed(3)}`);
  });
}

// ─── Run all tests ───────────────────────────────────────────
export async function runTest() {
  console.log('=== Built-in Scorers ===\n');

  await testFaithfulness();
  console.log('\n');
  await testHallucination();
  console.log('\n');
  await testBias();
  console.log('\n');
  await testToneConsistency();
  console.log('\n');
  await testMultiScorer();
}
