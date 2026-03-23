/**
 * MODULE 2: Using Tools — SOLUTION
 */

import { Agent } from '@mastra/core/agent';
import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

// ─── TODO 1: Calculator tool ────────────────────────────────
export const calculatorTool = createTool({
  id: 'calculator',
  description: 'Evaluates a mathematical expression and returns the numeric result. Use for any arithmetic calculation.',
  inputSchema: z.object({
    expression: z.string().describe('A math expression like "2 + 3 * 4"'),
  }),
  outputSchema: z.object({
    result: z.number(),
    expression: z.string(),
  }),
  execute: async ({ expression }) => {
    // Simple eval for math — in production, use a proper math parser
    const result = new Function('return ' + expression)() as number;
    return { result, expression };
  },
});

// ─── TODO 2: Random number tool ─────────────────────────────
export const randomNumberTool = createTool({
  id: 'random-number',
  description: 'Generates a random integer between min and max (inclusive). Use when the user asks for a random number.',
  inputSchema: z.object({
    min: z.number().describe('Minimum value (inclusive)'),
    max: z.number().describe('Maximum value (inclusive)'),
  }),
  outputSchema: z.object({
    value: z.number(),
    min: z.number(),
    max: z.number(),
  }),
  execute: async ({ min, max }) => {
    const value = Math.floor(Math.random() * (max - min + 1)) + min;
    return { value, min, max };
  },
});

// ─── TODO 3: Math Tutor agent ───────────────────────────────
export const mathTutorAgent = new Agent({
  id: 'math-tutor',
  name: 'Math Tutor',
  instructions: `
    You are a friendly math tutor. Use your tools to answer questions accurately.
    - Use the calculator tool for any arithmetic calculations
    - Use the random number tool when asked for random numbers
    - Show your work: explain what you calculated and why
    - For multi-step problems, use tools step by step
  `,
  model: 'anthropic/claude-sonnet-4-5',
  tools: { calculatorTool, randomNumberTool },
});

// ─── TODO 4: Tests ──────────────────────────────────────────
export async function runTest() {
  console.log('=== Test 1: Calculator ===\n');
  const r1 = await mathTutorAgent.generate('What is (15 + 27) * 3?');
  console.log('Answer:', r1.text);
  console.log('Tools called:', r1.toolCalls?.map(tc => tc.toolName));
  console.log('Tool results:', r1.toolResults);

  console.log('\n=== Test 2: Random Number ===\n');
  const r2 = await mathTutorAgent.generate('Give me a random number between 1 and 100');
  console.log('Answer:', r2.text);
  console.log('Tools called:', r2.toolCalls?.map(tc => tc.toolName));

  console.log('\n=== Test 3: Combined ===\n');
  const r3 = await mathTutorAgent.generate(
    'Pick a random number between 1 and 10, then multiply it by 7'
  );
  console.log('Answer:', r3.text);
  console.log('Tools called:', r3.toolCalls?.map(tc => tc.toolName));

  console.log('\n=== Test 4: Force a specific tool ===\n');
  const r4 = await mathTutorAgent.generate('What is 42 + 58?', {
    toolChoice: { type: 'tool', toolName: 'calculatorTool' },
  });
  console.log('Answer:', r4.text);
  console.log('Tools called:', r4.toolCalls?.map(tc => tc.toolName));

  console.log('\n=== Test 5: Restrict available tools with activeTools ===\n');
  // Only make randomNumberTool available — agent CAN'T use the calculator
  const r5 = await mathTutorAgent.generate('What is 100 / 4?', {
    activeTools: ['randomNumberTool'],
  });
  console.log('Answer:', r5.text);
  console.log('Tools called:', r5.toolCalls?.map(tc => tc.toolName));
  // The agent will either answer from knowledge or say it can't calculate

  console.log('\n=== Test 6: Observe toolName in streams ===\n');
  // toolName in stream events comes from the OBJECT KEY used when
  // registering tools, NOT the tool's `id` property.
  //   tools: { calculatorTool }  → toolName: "calculatorTool"
  //   tools: { [calculatorTool.id]: calculatorTool } → toolName: "calculator"
  const stream = await mathTutorAgent.stream('What is 100 / 4?');
  for await (const chunk of stream.fullStream) {
    if (chunk.type === 'tool-call') {
      console.log('Tool called:', chunk.toolName, '| args:', JSON.stringify(chunk.args));
      // Notice: toolName is "calculatorTool" (the object key), NOT "calculator" (the id)
    }
    if (chunk.type === 'tool-result') {
      console.log('Tool result:', JSON.stringify(chunk.result));
    }
  }
}
