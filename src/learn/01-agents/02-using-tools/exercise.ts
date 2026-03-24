/**
 * ============================================================
 *  MODULE 2: Using Tools
 * ============================================================
 *
 *  THEORY
 *  ------
 *  Tools give agents the power to **do things** — call APIs, query
 *  databases, run calculations, etc. Without tools, an agent can
 *  only generate text from its training data.
 *
 *  A tool has 5 parts:
 *    - `id`           — unique identifier
 *    - `description`  — CRITICAL: the agent reads this to decide WHEN to call the tool
 *    - `inputSchema`  — Zod schema defining what inputs the tool needs
 *    - `outputSchema` — Zod schema defining what the tool returns
 *    - `execute`      — async function that does the actual work
 *
 *  The flow:
 *    1. User sends a message
 *    2. Agent reads the message + tool descriptions
 *    3. Agent decides which tool(s) to call and with what arguments
 *    4. Tool executes and returns results
 *    5. Agent uses results to form a response
 *    6. Agent may call more tools or return a final answer
 *
 *  RUNTIME TOOL CONTROL:
 *    - `toolChoice: 'required'`  → force the agent to use a tool
 *    - `toolChoice: { type: 'tool', toolName: 'x' }` → force a specific tool
 *    - `activeTools: ['tool1']`  → restrict which tools are available
 *
 *  toModelOutput (ADVANCED):
 *    By default, the full tool result is sent to the LLM. But rich data
 *    (large JSON, images) wastes tokens. `toModelOutput` lets you send a
 *    simplified version to the LLM while your app gets the full result:
 *
 *      createTool({
 *        execute: async () => ({ data: hugeObject, imageUrl: '...' }),
 *        toModelOutput: (output) => ({
 *          type: 'content',
 *          value: [
 *            { type: 'text', text: `Summary: ${output.data.summary}` },
 *            { type: 'image-url', url: output.imageUrl },
 *          ],
 *        }),
 *      })
 *
 *  toolName IN STREAMS:
 *    The toolName in stream responses comes from the OBJECT KEY, not the
 *    tool's `id` property:
 *      tools: { myWeather: weatherTool }  → toolName: "myWeather"
 *      tools: { weatherTool }             → toolName: "weatherTool"
 *      tools: { [weatherTool.id]: weatherTool } → toolName: "get-weather"
 *
 *  SUBAGENTS & WORKFLOWS AS TOOLS:
 *    - `agents: [agentA]`     → auto-creates tool named "agent-<key>"
 *    - `workflows: { myFlow }` → auto-creates tool named "workflow-<key>"
 *    These let agents delegate to other agents or trigger workflows.
 *
 *  EXERCISE
 *  --------
 *  Create a "Math Tutor" agent with two tools:
 *    1. A calculator tool (evaluate math expressions)
 *    2. A random number generator tool
 *
 *  Then test that the agent can use them to answer math questions.
 * ============================================================
 */

import { Agent } from '@mastra/core/agent';
import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

// ─── TODO 1: Create a calculator tool ───────────────────────
// This tool should:
//   - Take an `expression` string (e.g. "2 + 3 * 4")
//   - Evaluate it (you can use Function('return ' + expression)() for simple math)
//   - Return the result as a number
//
// Hint:
//   createTool({
//     id: '...',
//     description: '...',
//     inputSchema: z.object({ ... }),
//     outputSchema: z.object({ ... }),
//     execute: async ({ expression }) => { ... },
//   })

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

// ─── TODO 2: Create a random number tool ────────────────────
// This tool should:
//   - Take `min` and `max` numbers
//   - Return a random integer between min and max (inclusive)
//
// Hint: Math.floor(Math.random() * (max - min + 1)) + min

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

// ─── TODO 3: Create the Math Tutor agent ────────────────────
// Create an agent that:
//   - Has both tools registered
//   - Has instructions telling it to use the tools to answer math questions
//   - Uses a model of your choice
//
// Register both tools in the `tools` object.

export const mathTutorAgent = new Agent({
  id: 'math-tutor',
  name: 'Math Tutor',
  instructions: `You are a math tutor.
    - Use the calculator tool for any arithmetic calculations
    - Use the random number tool when asked for random numbers
    - Show your work: explain what you calculated and why
    - For multi-step problems, use tools step by step`,
  model: 'anthropic/claude-haiku-4-5',
  tools: { calculatorTool, randomNumberTool },
});

// ─── TODO 4: Test the agent ─────────────────────────────────
// Write tests that verify the agent calls the right tools.
//
// Test 1: Ask it to calculate something — it should use calculatorTool
// Test 2: Ask it for a random number — it should use randomNumberTool
// Test 3: Ask a complex question that needs both tools
//         e.g., "Pick a random number between 1 and 10 and multiply it by 7"
//
// Check response.toolCalls to see which tools were called.
// Check response.toolResults to see the results.

export async function runTest() {
  console.log('=== Test 1: Calculator ===\n');
  // TODO: Ask agent to calculate (15 + 27) * 3 and print response
  // const response1 = await mathTutorAgent.generate('What is (15 + 27) * 3?');
  // console.log(response1.text);

  // console.log('\n=== Test 2: Random Number ===\n');
  // TODO: Ask agent for a random number between 1 and 100
  // const response2 = await mathTutorAgent.generate('Give me a random number between 1 and 100');
  // console.log(response2.text);

  // console.log('\n=== Test 3: Combined ===\n');
  // TODO: Ask agent a question that requires both tools
  // const response3 = await mathTutorAgent.generate('Pick a random number between 1 and 10 and multiply it by 7');
  // console.log(response3.text)

  // console.log('\n=== Test 4: Force a specific tool ===\n');
  // TODO: Use toolChoice to force the calculator tool
  // Hint: agent.generate('...', { toolChoice: { type: 'tool', toolName: 'calculatorTool' } })
  // const response4 = await mathTutorAgent.generate('What is 42 + 58?', { toolChoice: { type: 'tool', toolName: 'calculatorTool' } });
  // console.log(response4.text);

  // console.log('\n=== Test 5: Restrict available tools with activeTools ===\n');
  // TODO: Use activeTools to make ONLY the randomNumberTool available
  // Then ask a math calculation question — the agent can't use the calculator!
  // Hint: agent.generate('...', { activeTools: ['randomNumberTool'] })
  // const response5 = await mathTutorAgent.generate('What is 100 / 4?', { activeTools: ['randomNumberTool'] });
  // console.log(response5.toolCalls);

  // console.log('\n=== Test 6: Observe toolName in streams ===\n');
  // TODO: Use agent.stream() and iterate over stream.fullStream
  // Look at each chunk — when chunk.type includes 'tool', print chunk.toolName
  // Notice: toolName comes from the OBJECT KEY (e.g., 'calculatorTool'),
  // NOT the tool's id property (e.g., 'calculator')
  //
  // const stream = await mathTutorAgent.stream('What is 100 / 4?')
  // for await (const chunk of stream.fullStream) {
  //   console.log(chunk);
    
  //   if (chunk.type === 'tool-call') console.log('Tool called:', chunk.payload.toolName)
  //   if (chunk.type === 'tool-result') console.log('Tool result:', chunk.payload.result)
  // }
}

runTest();
