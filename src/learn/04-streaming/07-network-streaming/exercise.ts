/**
 * ============================================================
 *  MODULE 30: Multi-Agent Streaming (Supervisor Agents)
 * ============================================================
 *
 *  THEORY
 *  ------
 *  So far we've streamed from a single agent or workflow.
 *  But what if you have MULTIPLE agents that need to collaborate?
 *
 *  Mastra's answer is SUPERVISOR AGENTS — an agent that has
 *  access to other agents (subagents) and delegates tasks to them.
 *  The supervisor uses `agent.stream()` or `agent.generate()`
 *  to orchestrate multiple specialists.
 *
 *  NOTE: `agent.network()` is DEPRECATED. Supervisor agents
 *  using `agents: [...]` with `.stream()` are the recommended
 *  replacement. They provide the same multi-agent coordination
 *  with a simpler API and easier debugging.
 *
 *  THE SUPERVISOR PATTERN:
 *    1. Create specialist agents (with `description` — critical!)
 *    2. Create a supervisor agent with `agents: [specialist1, specialist2]`
 *    3. Call supervisor.stream() — it delegates to specialists automatically
 *
 *    const researcher = new Agent({
 *      id: 'researcher',
 *      description: 'Researches topics and returns bullet points',  // ← required!
 *      instructions: '...',
 *      model: '...',
 *    })
 *
 *    const writer = new Agent({
 *      id: 'writer',
 *      description: 'Writes polished content from research notes',
 *      instructions: '...',
 *      model: '...',
 *    })
 *
 *    const supervisor = new Agent({
 *      id: 'supervisor',
 *      instructions: 'Delegate research to researcher, writing to writer',
 *      model: '...',
 *      agents: [researcher, writer],  // ← subagents
 *    })
 *
 *  HOW IT WORKS INTERNALLY:
 *    When you call supervisor.stream(), the supervisor sees each
 *    subagent as a TOOL it can call. The `description` you set on
 *    each subagent becomes the tool description, so the supervisor
 *    knows when to use each one.
 *
 *    The stream emits events like:
 *      'tool-call'   → supervisor decides to call a subagent
 *      'tool-result' → subagent returns its response
 *      'text-delta'  → supervisor's own text output
 *
 *  STREAMING MULTI-AGENT:
 *    const stream = await supervisor.stream('Research AI then write a report')
 *
 *    for await (const chunk of stream) {
 *      switch (chunk.type) {
 *        case 'text-delta':
 *          process.stdout.write(chunk.payload.textDelta)
 *          break
 *        case 'tool-call':
 *          // Supervisor is calling a subagent
 *          console.log('Delegating to:', chunk.payload.toolName)
 *          break
 *        case 'tool-result':
 *          // Subagent returned a result
 *          console.log('Result from:', chunk.payload.toolName)
 *          break
 *      }
 *    }
 *
 *  DESCRIPTION IS CRITICAL:
 *    Without a `description` on subagents, the supervisor can't
 *    decide which agent to use. Think of it as the "when to use"
 *    documentation for each specialist.
 *
 *  DELEGATION HOOKS (optional, from Module 4):
 *    onDelegationStart: ({ agentId, input }) => { ... }
 *    onDelegationComplete: ({ agentId, output }) => { ... }
 *
 *    These fire during streaming and are great for logging.
 *
 *  SUPERVISORS + TOOLS + WORKFLOWS:
 *    A supervisor can also have tools and even call workflows.
 *    The subagents themselves can have their own tools.
 *    Everything composes — the stream shows the full event tree.
 *
 *  COMPARING APPROACHES:
 *    agent.network() (deprecated):
 *      - Separate routing loop with special event types
 *      - Required memory
 *      - Harder to debug
 *
 *    Supervisor agents (recommended):
 *      - Standard agent.stream() / agent.generate()
 *      - Subagents appear as tool calls in the stream
 *      - Same event types as regular agents
 *      - No special memory requirement
 *      - Much easier to debug and understand
 *
 *  EXERCISE
 *  --------
 *  Build a multi-agent system with a supervisor and observe
 *  how delegation appears in the stream.
 * ============================================================
 */

import { Agent } from '@mastra/core/agent';
import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

// ─── TODO 1: Create specialist agents ────────────────────────
// Create two specialist agents with DESCRIPTIONS.
// The description tells the supervisor when to use each one.
//
// Poet agent:
//   id: 'poet'
//   description: 'Writes creative poems, haikus, and verses on any topic.
//                 Use when the user asks for poetry or creative writing.'
//   instructions: You are a poet. Write short, vivid poems.
//
// Analyst agent:
//   id: 'data-analyst'
//   description: 'Analyzes numerical data, identifies trends, and explains
//                 patterns. Use when the user provides numbers or asks
//                 for data analysis.'
//   instructions: You analyze data. Identify trends, calculate growth
//                 rates, and explain what the numbers mean.

export const poetAgent = undefined as any; // ← replace
export const analystAgent = undefined as any; // ← replace

// ─── TODO 2: Create the supervisor agent ─────────────────────
// The supervisor coordinates the specialists.
// It uses `agents: [poetAgent, analystAgent]` to register them.
//
// new Agent({
//   id: 'content-supervisor',
//   name: 'Content Supervisor',
//   instructions: `You coordinate between specialist agents.
//     - For creative writing requests, delegate to the poet agent
//     - For data analysis requests, delegate to the data-analyst agent
//     - For mixed requests, use both agents appropriately
//     Always delegate to specialists. Do not do their work yourself.`,
//   model: 'anthropic/claude-sonnet-4-5',
//   agents: [poetAgent, analystAgent],
// })

export const contentSupervisor = undefined as any; // ← replace

// ─── TODO 3: Stream and observe delegation ───────────────────
// Call supervisor.stream() and watch for tool-call events.
// When the supervisor delegates to a subagent, it appears as
// a tool call in the stream.
//
// Hint:
//   const stream = await contentSupervisor.stream(
//     'Write a haiku about mountains'
//   )
//   for await (const chunk of stream) {
//     switch (chunk.type) {
//       case 'text-delta':
//         process.stdout.write(chunk.payload.textDelta)
//         break
//       case 'tool-call':
//         console.log('\n[DELEGATING]', chunk.payload.toolName)
//         break
//       case 'tool-result':
//         console.log('\n[RESULT FROM]', chunk.payload.toolName)
//         break
//     }
//   }

export async function testSupervisorStream() {
  console.log('--- Supervisor Streaming ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 4: Stream a multi-delegation request ──────────────
// Send a request that requires BOTH agents.
// The supervisor should delegate to poet AND analyst.
//
// Example prompt:
//   'Write a poem about exponential growth, then analyze: 2, 4, 8, 16, 32'
//
// Observe the stream — you should see multiple tool-call events,
// one for each subagent.

export async function testMultiDelegation() {
  console.log('--- Multi-Agent Delegation ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 5: Track all delegations ──────────────────────────
// Stream a request and build a log of all delegations:
//   - Which agent was called
//   - How long each delegation took
//   - The full text of the supervisor's final response
//
// Hint:
//   const delegations: { agent: string; startTime: number; endTime?: number }[] = []
//
//   for await (const chunk of stream) {
//     if (chunk.type === 'tool-call') {
//       delegations.push({ agent: chunk.payload.toolName, startTime: Date.now() })
//     }
//     if (chunk.type === 'tool-result') {
//       const last = delegations[delegations.length - 1]
//       if (last) last.endTime = Date.now()
//     }
//   }

export async function testDelegationTracking() {
  console.log('--- Delegation Tracking ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 6: Supervisor with tools AND subagents ─────────────
// Create a supervisor that has both subagents and its own tools.
// The supervisor can choose between calling a subagent or a tool.
//
// Create a simple tool (e.g., a calculator) and add it to
// the supervisor alongside the subagents:
//
//   const calculator = createTool({
//     id: 'calculator',
//     description: 'Adds two numbers. Use for simple arithmetic.',
//     inputSchema: z.object({ a: z.number(), b: z.number() }),
//     outputSchema: z.object({ result: z.number() }),
//     execute: async (input) => ({ result: input.a + input.b }),
//   })
//
//   const hybridSupervisor = new Agent({
//     id: 'hybrid-supervisor',
//     instructions: 'Use the calculator for simple math, poet for poems,
//                    analyst for data analysis.',
//     model: 'anthropic/claude-sonnet-4-5',
//     agents: [poetAgent, analystAgent],
//     tools: { calculator },
//   })
//
// Stream: 'What is 42+58? Then write a poem about the answer.'
// You should see both a tool call (calculator) and a delegation (poet).

export async function testHybridSupervisor() {
  console.log('--- Hybrid Supervisor (Tools + Agents) ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 7: Full event inspection ───────────────────────────
// Stream a supervisor call and categorize ALL events:
//   - supervisor: text-delta from the supervisor itself
//   - delegation: tool-call / tool-result for subagents
//   - metadata: start, step-start, step-finish, finish
//
// Print a summary with counts per category.

export async function testEventInspection() {
  console.log('--- Full Event Inspection ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── Run all tests ───────────────────────────────────────────
export async function runTest() {
  console.log('=== Multi-Agent Streaming (Supervisor) ===\n');

  await testSupervisorStream();

  console.log('\n\n');
  await testMultiDelegation();

  console.log('\n\n');
  await testDelegationTracking();

  console.log('\n\n');
  await testHybridSupervisor();

  console.log('\n\n');
  await testEventInspection();
}
