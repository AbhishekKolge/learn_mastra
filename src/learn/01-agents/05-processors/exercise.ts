/**
 * ============================================================
 *  MODULE 5: Processors
 * ============================================================
 *
 *  THEORY
 *  ------
 *  Processors are middleware for your agent's message pipeline.
 *  Think of them like Express middleware — they intercept messages
 *  at specific points and can transform, validate, or block them.
 *
 *  Pipeline flow:
 *    User Message
 *      → inputProcessors (transform input)
 *        → LLM processes
 *          → outputProcessors (transform output)
 *            → Response to user
 *
 *  Processor methods (implement any combination):
 *    - processInput(messages)        — runs ONCE at agent start
 *    - processInputStep(step)        — runs at EACH loop iteration
 *    - processOutputResult(result)   — transforms final response
 *    - processOutputStream(chunks)   — filters streaming chunks
 *    - processOutputStep(step)       — validates after each LLM step
 *
 *  Key patterns:
 *    - processInputStep can modify model, tools, and config per-step
 *    - processOutputStep can request RETRIES with feedback
 *    - Processors can abort() to stop execution entirely
 *    - `maxProcessorRetries` (default 3) limits retry loops
 *
 *  Built-in processors:
 *    - TokenLimiter  — prevents context overflow
 *    - ToolCallFilter — removes tool calls from history to save tokens
 *    - ToolSearchProcessor — dynamic tool discovery for large tool libraries
 *
 *  EXERCISE
 *  --------
 *  Create custom processors that:
 *    1. Log all messages (input processor)
 *    2. Add timestamps to responses (output processor)
 *    3. Enforce a word limit with retries (output step processor)
 * ============================================================
 */

import { Agent } from '@mastra/core/agent';

// ─── TODO 1: Create a logging input processor ───────────────
// This processor should:
//   - Implement processInput()
//   - Log all user messages to the console
//   - Return the messages unchanged
//
// A processor is a plain object (or class) with the processor methods.
// For input processors, implement:
//   {
//     processInput({ messages, systemMessages }) {
//       // log messages
//       return { messages, systemMessages }
//     }
//   }
//
// Note: processInput receives and returns { messages, systemMessages }

const loggingProcessor = undefined as any; // ← replace

// ─── TODO 2: Create a timestamp output processor ────────────
// This processor should:
//   - Implement processOutputResult()
//   - Append a timestamp to the response text
//   - Return the modified result
//
// processOutputResult receives the full result object:
//   { messages, response, ... }
// You need to modify the assistant message content.

const timestampProcessor = undefined as any; // ← replace

// ─── TODO 3: Create a word-limit processor ──────────────────
// This processor should:
//   - Implement processOutputStep()
//   - Check if the response exceeds 100 words
//   - If too long, return { retry: true, feedback: 'Too long...' }
//   - If OK, return { retry: false }
//
// processOutputStep receives:
//   { result, abort, retry }
// Return { retry: true, feedback: '...' } to request a retry.
// The agent will re-run with the feedback injected.

const wordLimitProcessor = undefined as any; // ← replace

// ─── TODO 4: Create an agent with all processors ────────────
// Register:
//   - loggingProcessor as an inputProcessor
//   - timestampProcessor and wordLimitProcessor as outputProcessors
//
// Set maxProcessorRetries to 2 to limit retry attempts.

export const processedAgent = undefined as any; // ← replace

// ─── TODO 5: Test the agent ─────────────────────────────────
export async function testProcessors() {
  console.log('=== Processor Test ===\n');
  // TODO: Call processedAgent.generate() with a question
  // Observe:
  //   - The logging processor printing input messages
  //   - The response having a timestamp appended
  //   - If response is too long, the word limit processor triggering retries
  console.log('TODO: implement');
}

// ─── TODO 6: processInputStep — per-step configuration ──────
// processInputStep runs at EACH agentic loop iteration.
// Use it to change model, tools, or config per step.
//
// Example: Use a fast model for step 0, disable tools after step 5:
//
//   const dynamicProcessor: Processor = {
//     processInputStep({ stepNumber }) {
//       if (stepNumber === 0) {
//         return { model: 'openai/gpt-4o-mini' };
//       }
//       if (stepNumber > 5) {
//         return { toolChoice: 'none' };  // force text, no more tools
//       }
//       return {};
//     },
//   };
//
// prepareStep() in generate/stream is shorthand for this:
//   agent.generate('...', { prepareStep: async ({ stepNumber }) => {...} })

// ─── TODO 7: processOutputStream — filter stream chunks ─────
// processOutputStream transforms chunks BEFORE they reach the client.
// Return null to filter out a chunk, or modify and return it.
//
//   const streamFilter: Processor = {
//     processOutputStream({ part }) {
//       // Filter out reasoning parts from the stream
//       if (part.type === 'reasoning') return null;
//       return part;
//     },
//   };
//
// Set processDataParts = true to also receive custom data-* chunks
// emitted by tools via writer.custom().

// ─── TODO 8: Custom stream events via writer ────────────────
// Output processors receive a `writer` object for emitting custom
// chunks to the client during streaming. Chunk types MUST use
// the 'data-' prefix.
//
//   const customEventProcessor: Processor = {
//     async processOutputResult({ messages, writer }) {
//       await writer?.custom({
//         type: 'data-analysis-complete',
//         data: { score: 0.95, model: 'gpt-4o' },
//       });
//       return messages;
//     },
//   };
//
// Client listens for these:
//   for await (const chunk of stream.fullStream) {
//     if (chunk.type === 'data-analysis-complete') {
//       console.log('Score:', chunk.data.score);
//     }
//   }

// ─── TODO 9: Built-in TokenLimiter ──────────────────────────
// TokenLimiter prevents context overflow by removing older messages.
// It keeps system messages and recent messages intact.
//
//   import { TokenLimiter } from '@mastra/core/processors';
//
//   new Agent({
//     inputProcessors: [new TokenLimiter(127000)],  // max tokens
//   })
//
// Runs AFTER memory loads history but BEFORE the LLM processes.

// ─── TODO 10: Built-in ToolCallFilter ───────────────────────
// ToolCallFilter removes tool calls and results from LLM input
// to save tokens on verbose tool interactions.
// - Only affects what the LLM sees (still saved to memory)
// - Optionally exclude specific tools from filtering
//
//   import { ToolCallFilter } from '@mastra/core/processors';
//
//   new Agent({
//     inputProcessors: [new ToolCallFilter()],
//   })

// ─── TODO 11: Built-in ToolSearchProcessor ──────────────────
// For agents with MANY tools (50+), loading all descriptions
// wastes tokens. ToolSearchProcessor provides meta-tools:
//   - search_tools: find tools by keyword
//   - load_tool: load a specific tool into context
// The agent discovers and loads tools on demand.
//
//   import { ToolSearchProcessor } from '@mastra/core/processors';
//
//   new Agent({
//     inputProcessors: [new ToolSearchProcessor()],
//     tools: { ...fiftyTools },
//   })

// ─── TODO 12: Workflow composition of processors ────────────
// Run multiple processors in PARALLEL using Mastra workflows.
// This is useful when guardrails are independent (block only):
//
//   import { createWorkflow, createStep } from '@mastra/core/workflows';
//   import { ProcessorStepSchema } from '@mastra/core/processors';
//
//   const pipeline = createWorkflow({
//     id: 'guardrail-pipeline',
//     inputSchema: ProcessorStepSchema,
//     outputSchema: ProcessorStepSchema,
//   })
//     .parallel([
//       createStep(new PIIDetector({ strategy: 'redact' })),
//       createStep(new ModerationProcessor({ strategy: 'block' })),
//     ])
//     .map(async ({ inputData }) => {
//       return inputData['processor:pii-detector'];
//     })
//     .commit();
//
//   new Agent({ inputProcessors: [pipeline] })

// ─── TODO 13: EnsureFinalResponseProcessor pattern ──────────
// When using maxSteps, the agent may try a tool call on the
// final step and return an empty response. This processor forces
// a text summary on the last step:
//
//   class EnsureFinalResponseProcessor implements Processor {
//     id = 'ensure-final-response';
//     private maxSteps: number;
//     constructor(maxSteps: number) { this.maxSteps = maxSteps; }
//
//     async processInputStep({ stepNumber, systemMessages }) {
//       if (stepNumber === this.maxSteps - 1) {
//         return {
//           tools: {},
//           toolChoice: 'none',
//           systemMessages: [
//             ...systemMessages,
//             {
//               role: 'system',
//               content: 'Summarize your progress. Do not call any tools.',
//             },
//           ],
//         };
//       }
//       return {};
//     }
//   }
//
//   const MAX_STEPS = 5;
//   new Agent({
//     inputProcessors: [new EnsureFinalResponseProcessor(MAX_STEPS)],
//   })
//   await agent.generate('...', { maxSteps: MAX_STEPS })

// ─── TODO 14: Add metadata to messages ──────────────────────
// Attach custom metadata to assistant messages in processOutputResult.
// Access it via response.response?.uiMessages:
//
//   const metadataProcessor: Processor = {
//     processOutputResult({ messages }) {
//       return messages.map(msg => {
//         if (msg.role === 'assistant') {
//           return {
//             ...msg,
//             content: {
//               ...msg.content,
//               metadata: {
//                 ...msg.content.metadata,
//                 processedAt: new Date().toISOString(),
//                 customData: 'your data here',
//               },
//             },
//           };
//         }
//         return msg;
//       });
//     },
//   };
//
// Access:
//   const result = await agent.generate('Hello');
//   const msg = result.response?.uiMessages?.find(m => m.role === 'assistant');
//   console.log(msg?.metadata?.customData);

export async function runTest() {
  await testProcessors();
}
