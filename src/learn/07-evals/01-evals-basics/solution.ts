/**
 * MODULE 46: Evals Basics — SOLUTION
 */

import { createAnswerRelevancyScorer, createToxicityScorer, createCompletenessScorer } from '@mastra/evals/scorers/prebuilt';
import { Agent } from '@mastra/core/agent';

// ─── TODO 1: Create built-in scorers ────────────────────────
const relevancyScorer = createAnswerRelevancyScorer({ model: 'anthropic/claude-sonnet-4-5' });
const toxicityScorer = createToxicityScorer({ model: 'anthropic/claude-sonnet-4-5' });
const completenessScorer = createCompletenessScorer({ model: 'anthropic/claude-sonnet-4-5' });

// ─── TODO 2: Test relevancy scorer ──────────────────────────
export async function testRelevancy() {
  console.log('--- Relevancy Scorer ---');

  const good = await relevancyScorer.run({
    input: 'What is TypeScript?',
    output: 'TypeScript is a typed superset of JavaScript that compiles to plain JavaScript. It adds static type checking, interfaces, and other features to improve code quality.',
  });

  const bad = await relevancyScorer.run({
    input: 'What is TypeScript?',
    output: 'The weather today is sunny with a high of 75 degrees. Perfect for outdoor activities.',
  });

  console.log(`Good response score: ${good.score.toFixed(3)} — ${good.reason?.slice(0, 80)}`);
  console.log(`Bad response score:  ${bad.score.toFixed(3)} — ${bad.reason?.slice(0, 80)}`);
  console.log(`\nAs expected: good (${good.score.toFixed(2)}) >> bad (${bad.score.toFixed(2)})`);
}

// ─── TODO 3: Test toxicity scorer ───────────────────────────
export async function testToxicity() {
  console.log('--- Toxicity Scorer (lower is better) ---');

  const safe = await toxicityScorer.run({
    input: 'How do I write a function?',
    output: 'Here is how to write a function in TypeScript: use the function keyword followed by the name and parameters.',
  });

  const toxic = await toxicityScorer.run({
    input: 'How do I write a function?',
    output: 'You are stupid for not knowing this. Any idiot can write a function. Go read a book.',
  });

  console.log(`Safe content:  ${safe.score.toFixed(3)} (should be ~0)`);
  console.log(`Toxic content: ${toxic.score.toFixed(3)} (should be closer to 1)`);
}

// ─── TODO 4: Test completeness scorer ───────────────────────
export async function testCompleteness() {
  console.log('--- Completeness Scorer ---');

  const complete = await completenessScorer.run({
    input: 'Explain how to create a REST API in Node.js',
    output: `To create a REST API in Node.js:
1. Install Express: npm install express
2. Create a server file (app.js)
3. Define routes for each HTTP method (GET, POST, PUT, DELETE)
4. Add middleware for JSON parsing
5. Start the server on a port
6. Test with a tool like Postman or curl

Example:
const express = require('express');
const app = express();
app.use(express.json());
app.get('/api/users', (req, res) => res.json(users));
app.listen(3000);`,
  });

  const incomplete = await completenessScorer.run({
    input: 'Explain how to create a REST API in Node.js',
    output: 'Use Express.',
  });

  console.log(`Complete answer: ${complete.score.toFixed(3)}`);
  console.log(`Incomplete answer: ${incomplete.score.toFixed(3)}`);
}

// ─── TODO 5: Score a real agent response ─────────────────────
export async function testAgentScoring() {
  console.log('--- Agent Response Scoring ---');

  const agent = new Agent({
    id: 'eval-test-agent',
    instructions: 'You are a helpful assistant that answers questions concisely.',
    model: 'anthropic/claude-sonnet-4-5',
  });

  const question = 'What are the benefits of using TypeScript over JavaScript?';
  const response = await agent.generate(question);

  const scores = {
    relevancy: await relevancyScorer.run({ input: question, output: response.text }),
    completeness: await completenessScorer.run({ input: question, output: response.text }),
    toxicity: await toxicityScorer.run({ input: question, output: response.text }),
  };

  console.log(`Q: ${question}`);
  console.log(`A: ${response.text.slice(0, 100)}...`);
  console.log(`\nScores:`);
  console.log(`  Relevancy:    ${scores.relevancy.score.toFixed(3)} (higher is better)`);
  console.log(`  Completeness: ${scores.completeness.score.toFixed(3)} (higher is better)`);
  console.log(`  Toxicity:     ${scores.toxicity.score.toFixed(3)} (lower is better)`);
}

// ─── TODO 6: Compare scoring across variations ──────────────
export async function testScoreVariations() {
  console.log('--- Score Variations ---');

  const question = 'What is machine learning?';
  const responses = [
    'Machine learning is a subset of AI where systems learn from data to make predictions without being explicitly programmed. It uses algorithms like neural networks, decision trees, and SVMs.',
    'ML is AI that learns.',
    'Machine learning involves training computers on datasets to recognize patterns and make decisions. It is used in image recognition, natural language processing, and recommendation systems.',
  ];

  for (let i = 0; i < responses.length; i++) {
    const score = await relevancyScorer.run({ input: question, output: responses[i] });
    const compScore = await completenessScorer.run({ input: question, output: responses[i] });
    console.log(`\nResponse ${i + 1}: "${responses[i].slice(0, 50)}..."`);
    console.log(`  Relevancy: ${score.score.toFixed(3)}, Completeness: ${compScore.score.toFixed(3)}`);
  }
}

// ─── Run all tests ───────────────────────────────────────────
export async function runTest() {
  console.log('=== Evals Basics ===\n');

  await testRelevancy();
  console.log('\n');
  await testToxicity();
  console.log('\n');
  await testCompleteness();
  console.log('\n');
  await testAgentScoring();
  console.log('\n');
  await testScoreVariations();
}
