/**
 * ============================================================
 *  MODULE 1: Agent Basics
 * ============================================================
 *
 *  THEORY
 *  ------
 *  An Agent in Mastra wraps an LLM with:
 *    - `instructions` — a system prompt that tells the model who it is and how to behave
 *    - `model`        — which LLM to use, in "provider/model-name" format
 *    - `tools`        — (optional) functions the agent can call
 *    - `memory`       — (optional) persistent conversation memory
 *
 *  Agents are best for **open-ended tasks** where the exact steps aren't known
 *  in advance. The agent reasons about your request, picks tools, and iterates
 *  until it produces a final answer.
 *
 *  Two ways to call an agent:
 *    1. `agent.generate(prompt)` — returns the full response at once
 *       → { text, toolCalls, toolResults, steps, usage }
 *
 *    2. `agent.stream(prompt)` — streams tokens as they arrive
 *       → { textStream, toolCalls, toolResults, ... }
 *
 *  EXERCISE
 *  --------
 *  Fill in the TODOs below to create a "Code Reviewer" agent and test
 *  both generate() and stream() methods.
 *
 *  To test:
 *    1. Register the agent in src/mastra/index.ts
 *    2. Run `pnpm dev` → open http://localhost:4111
 *    3. Chat with your agent in Mastra Studio
 *    — OR —
 *    Run the runTest() function from a script
 * ============================================================
 */

import { Agent } from "@mastra/core/agent";

// ─── TODO 1: Create an agent ────────────────────────────────
// Create and export an agent with:
//   id:           'code-reviewer'
//   name:         'Code Reviewer'
//   instructions: Tell the agent it's a senior code reviewer that gives
//                 concise, actionable feedback on code snippets.
//                 It should point out bugs, suggest improvements,
//                 and rate code quality from 1-10.
//   model:        Use 'anthropic/claude-sonnet-4-5' (or any model you have access to)
//
// Hint: new Agent({ id, name, instructions, model })

export const codeReviewAgent = new Agent({
  id: "code-reviewer",
  name: "Code Reviewer",
  instructions:
    "You are a senior developer whose task includes reviewing code of your team and give a concise and actionable feedback on code snippets that could be better. You should point out possible bugs, suggest any code improvements and rate the overall code quality between 1-10 as a constructive feedback. You will be precise and respectful while giving the feedback",
  model: "anthropic/claude-sonnet-4-5",
});

// ─── TODO 2: Test with generate() ──────────────────────────
// Write a function that calls agent.generate() with a code snippet
// and prints the response text and token usage.
//
// Hint:
//   const response = await agent.generate('...')
//   response.text   → the full text reply
//   response.usage  → { promptTokens, completionTokens, totalTokens }

export async function testGenerate() {
  const codeSnippet = `
    function add(a, b) {
      return a + b;
    }
    const result = add("1", 2);
    console.log(result);
  `;

  const response = await codeReviewAgent.generate(`
    Review this code snippet:
    ${codeSnippet}
  `);
  console.log(response.text);
  console.log(response.usage);
}

// ─── TODO 3: Test with stream() ─────────────────────────────
// Write a function that calls agent.stream() and prints tokens
// as they arrive in real-time.
//
// Hint:
//   const stream = await agent.stream('...')
//   for await (const chunk of stream.textStream) {
//     process.stdout.write(chunk)
//   }

export async function testStream() {
  const codeSnippet = `
    async function fetchUsers() {
      const res = await fetch('/api/users');
      const data = res.json();
      return data;
    }
  `;

  const stream = await codeReviewAgent.stream(`
    Review this code snippet:
    ${codeSnippet}
  `);
  for await (const chunk of stream.textStream) {
    process.stdout.write(chunk);
  }
}

// ─── Run both tests ─────────────────────────────────────────
export async function runTest() {
  console.log("=== generate() test ===\n");
  await testGenerate();

  console.log("\n\n=== stream() test ===\n");
  await testStream();
}