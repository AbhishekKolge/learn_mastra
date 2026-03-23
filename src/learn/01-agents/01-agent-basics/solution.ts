/**
 * MODULE 1: Agent Basics — SOLUTION
 */

import { Agent } from '@mastra/core/agent';

// ─── TODO 1: Create an agent ────────────────────────────────
export const codeReviewAgent = new Agent({
  id: 'code-reviewer',
  name: 'Code Reviewer',
  instructions: `
    You are a senior code reviewer with 15 years of experience.
    When given a code snippet:
    - Identify bugs, type errors, and edge cases
    - Suggest concrete improvements with code examples
    - Rate code quality from 1-10 with justification
    - Keep feedback concise and actionable
    - Use bullet points for clarity
  `,
  model: 'anthropic/claude-sonnet-4-5',
});

// ─── TODO 2: Test with generate() ──────────────────────────
export async function testGenerate() {
  const codeSnippet = `
    function add(a, b) {
      return a + b;
    }
    const result = add("1", 2);
    console.log(result);
  `;

  const response = await codeReviewAgent.generate(
    `Review this code snippet:\n${codeSnippet}`
  );

  console.log('Review:\n', response.text);
  console.log('\nToken usage:', response.usage);
}

// ─── TODO 3: Test with stream() ─────────────────────────────
export async function testStream() {
  const codeSnippet = `
    async function fetchUsers() {
      const res = await fetch('/api/users');
      const data = res.json();
      return data;
    }
  `;

  const stream = await codeReviewAgent.stream(
    `Review this code snippet:\n${codeSnippet}`
  );

  for await (const chunk of stream.textStream) {
    process.stdout.write(chunk);
  }
}

// ─── Run both tests ─────────────────────────────────────────
export async function runTest() {
  console.log('=== generate() test ===\n');
  await testGenerate();

  console.log('\n\n=== stream() test ===\n');
  await testStream();
}
