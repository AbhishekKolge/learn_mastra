/**
 * ============================================================
 *  MODULE 28: Piping Agent Streams to Tools
 * ============================================================
 *
 *  THEORY
 *  ------
 *  Sometimes a tool needs to call an agent as part of its work.
 *  For example, a "summarizer" tool that uses an agent to generate
 *  a summary. Without streaming, the user waits silently until
 *  the entire summary is generated.
 *
 *  With PIPING, the tool can forward the agent's stream directly
 *  into its own writer. The user sees the agent's tokens arrive
 *  in real-time, even though they're flowing through a tool.
 *
 *  THE PATTERN:
 *    Tool → calls Agent.stream() → pipes fullStream → tool's writer
 *
 *    execute: async (inputData, context) => {
 *      const agent = context?.mastra?.getAgent('myAgent')
 *      const stream = await agent?.stream('prompt')
 *
 *      // Pipe the agent's full stream to the tool's writer
 *      await stream!.fullStream.pipeTo(context?.writer!)
 *
 *      return { value: await stream!.text }
 *    }
 *
 *  KEY DETAILS:
 *
 *  1. Use `fullStream` (not textStream):
 *     fullStream is a ReadableStream that includes ALL events
 *     (text-delta, tool-call, tool-result, etc.).
 *     textStream only has text — you'd lose tool events.
 *
 *  2. pipeTo() connects two streams:
 *     It reads from the agent's fullStream and writes each
 *     chunk into the tool's writer. This is a Web Streams API
 *     method — it returns a Promise, so always await it.
 *
 *  3. Usage aggregation:
 *     Mastra automatically aggregates the agent's token usage
 *     into the tool run. You don't need to track it manually.
 *
 *  4. After piping, get the text:
 *     The `stream.text` promise still works — it resolves to
 *     the full text after the stream ends. Use it for the
 *     tool's return value.
 *
 *  WHY NOT textStream.pipeTo()?
 *    textStream yields plain strings, but the writer expects
 *    structured chunks. fullStream yields the right format.
 *    Also, fullStream preserves tool-call events from the
 *    inner agent, which may be useful for the UI.
 *
 *  NESTED TOOL STREAMING:
 *    If the inner agent also uses tools with writers, those
 *    events propagate through the pipe automatically. The
 *    entire event tree is visible to the end consumer.
 *
 *  EXERCISE
 *  --------
 *  Build tools that use agents internally and pipe their
 *  streams to the tool's writer for real-time output.
 * ============================================================
 */

import { Agent } from '@mastra/core/agent';
import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

// ─── TODO 1: Create a helper agent ──────────────────────────
// This agent will be called FROM WITHIN tools.
// Register it in src/mastra/index.ts so tools can access
// it via context.mastra.getAgent().
//
// new Agent({
//   id: 'summarizer',
//   name: 'Summarizer',
//   instructions: 'You summarize text concisely in 2-3 sentences.',
//   model: 'anthropic/claude-sonnet-4-5',
// })

export const summarizerAgent = undefined as any; // ← replace

// ─── TODO 2: Create a tool that pipes agent stream ──────────
// Build a "summarize" tool that:
//   1. Gets the summarizer agent from context.mastra
//   2. Calls agent.stream() with the input text
//   3. Pipes fullStream to context.writer
//   4. Returns the full text as the tool result
//
// createTool({
//   id: 'summarize-text',
//   description: 'Summarizes a given text using an AI agent',
//   inputSchema: z.object({ text: z.string() }),
//   outputSchema: z.object({ summary: z.string() }),
//   execute: async (inputData, context) => {
//     const agent = context?.mastra?.getAgent('summarizer')
//     const stream = await agent?.stream(
//       `Summarize this text:\n${inputData.text}`
//     )
//
//     // Pipe agent's stream to tool's writer
//     await stream!.fullStream.pipeTo(context?.writer!)
//
//     return { summary: await stream!.text }
//   },
// })

const summarizeTool = undefined as any; // ← replace

// ─── TODO 3: Create a more complex piping tool ──────────────
// Build a "research-and-summarize" tool that:
//   1. Writes a "researching" progress event
//   2. Simulates research (setTimeout)
//   3. Writes a "summarizing" progress event
//   4. Pipes an agent stream for the summary
//   5. Returns the summary
//
// This shows how you can MIX custom writer events with piped
// agent streams in the same tool.
//
// Note: You cannot write to context.writer AFTER piping
// (pipeTo closes the writer). So write your custom events
// BEFORE the pipe call.

const researchAndSummarize = undefined as any; // ← replace

// ─── TODO 4: Create a parent agent with the tools ────────────
// Create an agent that has both tools and can decide which to use.
//
// new Agent({
//   id: 'research-assistant',
//   name: 'Research Assistant',
//   instructions: 'You help users research and summarize topics. Use tools.',
//   model: 'anthropic/claude-sonnet-4-5',
//   tools: { summarizeTool, researchAndSummarize },
// })

export const researchAssistant = undefined as any; // ← replace

// ─── TODO 5: Test basic agent-to-tool piping ─────────────────
// Stream the research assistant asking it to summarize text.
// You should see the summarizer agent's tokens arriving in
// real-time through the tool's stream.
//
// Hint:
//   const stream = await researchAssistant.stream(
//     'Summarize this: Mastra is an open-source TypeScript framework...'
//   )
//   for await (const chunk of stream) {
//     if (chunk.type === 'text-delta') {
//       process.stdout.write(chunk.payload.textDelta)
//     }
//   }

export async function testBasicPiping() {
  console.log('--- Basic Agent→Tool Piping ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 6: Test mixed events + piping ──────────────────────
// Stream using the research-and-summarize tool.
// Observe both custom progress events and piped agent tokens.

export async function testMixedPiping() {
  console.log('--- Mixed Events + Piping ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── Run all tests ───────────────────────────────────────────
export async function runTest() {
  console.log('=== Agent→Tool Piping ===\n');

  await testBasicPiping();

  console.log('\n\n');
  await testMixedPiping();
}
