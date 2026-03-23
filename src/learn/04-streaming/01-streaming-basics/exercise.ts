/**
 * ============================================================
 *  MODULE 24: Streaming Basics
 * ============================================================
 *
 *  THEORY
 *  ------
 *  When you call `agent.generate()`, the entire response is computed
 *  before anything is returned. This is fine for short replies, but
 *  for chat interfaces, long-form content, or any scenario where
 *  immediate feedback matters, you want to see output AS it's generated.
 *
 *  That's what streaming does — it breaks the response into small
 *  chunks (tokens) and delivers them incrementally in real-time.
 *
 *  GENERATE vs STREAM:
 *    generate() → waits for full response → returns { text, usage, ... }
 *    stream()   → yields tokens as they arrive → { textStream, text, ... }
 *
 *  Think of it like downloading a video:
 *    generate() = download the whole file, then play
 *    stream()   = play while downloading (buffering)
 *
 *  CALLING agent.stream():
 *    const stream = await agent.stream('your prompt')
 *
 *    You can pass prompts in three forms:
 *      1. A single string:   agent.stream('Hello')
 *      2. Array of strings:  agent.stream(['context1', 'context2'])
 *      3. Message objects:   agent.stream([{ role: 'user', content: 'Hello' }])
 *
 *  STREAM PROPERTIES:
 *    stream.textStream    → AsyncIterable of text chunks (most common)
 *    stream.text          → Promise<string> — full text after stream ends
 *    stream.finishReason  → Promise<string> — why the stream stopped
 *                           ('stop', 'length', 'tool-calls', 'content-filter', 'error')
 *    stream.usage         → Promise<{ promptTokens, completionTokens, totalTokens }>
 *
 *  CONSUMING textStream:
 *    for await (const chunk of stream.textStream) {
 *      process.stdout.write(chunk)  // write without newlines
 *    }
 *
 *  WHY process.stdout.write() instead of console.log()?
 *    console.log() adds a newline after each call.
 *    process.stdout.write() outputs the exact string — no extra newlines.
 *    Since each chunk is a fragment (e.g., "Hel", "lo ", "wor", "ld"),
 *    you want them glued together seamlessly.
 *
 *  AWAITING FULL TEXT:
 *    Sometimes you need the complete response after streaming.
 *    const fullText = await stream.text
 *    This resolves only after the stream finishes.
 *
 *  AI SDK v5+ COMPATIBILITY:
 *    If you're integrating with AI SDK v5+ (LanguageModelV2), use:
 *      import { toAISdkV5Stream } from '@mastra/ai-sdk'
 *      const aiStream = toAISdkV5Stream(stream, { from: 'agent' })
 *
 *    For message format conversion:
 *      import { toAISdkV5Messages } from '@mastra/ai-sdk/ui'
 *      const msgs = toAISdkV5Messages(messages)
 *
 *  EXERCISE
 *  --------
 *  Build a "Story Writer" agent and explore all stream properties.
 *
 *  To test:
 *    1. Register the agent in src/mastra/index.ts
 *    2. Run `pnpm dev` → open http://localhost:4111
 *    3. Chat with your agent in Mastra Studio
 *    — OR —
 *    Run the runTest() function from a script
 * ============================================================
 */

import { Agent } from '@mastra/core/agent';

// ─── TODO 1: Create a Story Writer agent ─────────────────────
// Create and export an agent with:
//   id:           'story-writer'
//   name:         'Story Writer'
//   instructions: Tell the agent it's a creative fiction writer.
//                 It writes short stories (2-3 paragraphs) with
//                 vivid descriptions and engaging plots.
//   model:        'anthropic/claude-sonnet-4-5'

export const storyWriter = undefined as any; // ← replace

// ─── TODO 2: Basic text streaming ────────────────────────────
// Call agent.stream() with a prompt asking for a short story.
// Iterate over stream.textStream and write each chunk to stdout.
//
// Hint:
//   const stream = await storyWriter.stream('...')
//   for await (const chunk of stream.textStream) {
//     process.stdout.write(chunk)
//   }

export async function testTextStream() {
  console.log('--- Text Stream ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 3: Await full text after streaming ─────────────────
// Sometimes you want to stream to the user AND keep the full text.
// Use stream.text (a Promise) to get the complete response.
//
// Hint:
//   const stream = await storyWriter.stream('...')
//   for await (const chunk of stream.textStream) {
//     process.stdout.write(chunk)
//   }
//   const fullText = await stream.text
//   console.log('\n\nFull text length:', fullText.length)

export async function testFullText() {
  console.log('--- Full Text After Stream ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 4: Check stream metadata ──────────────────────────
// After streaming, inspect finishReason and usage.
//
// Hint:
//   const stream = await storyWriter.stream('...')
//   for await (const chunk of stream.textStream) { /* consume */ }
//   const reason = await stream.finishReason
//   const usage = await stream.usage
//   console.log('Finish reason:', reason)
//   console.log('Usage:', usage)

export async function testStreamMetadata() {
  console.log('--- Stream Metadata ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 5: Stream with message objects ─────────────────────
// Instead of a plain string, pass an array of message objects
// with role and content. This gives you precise control over
// the conversation flow.
//
// Hint:
//   const stream = await storyWriter.stream([
//     { role: 'user', content: 'Write a story about a robot learning to paint' },
//   ])

export async function testMessageObjects() {
  console.log('--- Message Objects ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 6: Compare generate() vs stream() timing ──────────
// Call both generate() and stream() with the same prompt.
// Measure time-to-first-output for each.
//
// For generate():
//   const start = Date.now()
//   const response = await storyWriter.generate('...')
//   console.log(`generate() first output: ${Date.now() - start}ms`)
//
// For stream():
//   const start = Date.now()
//   const stream = await storyWriter.stream('...')
//   for await (const chunk of stream.textStream) {
//     console.log(`stream() first chunk: ${Date.now() - start}ms`)
//     break  // only measure first chunk
//   }

export async function testTimingComparison() {
  console.log('--- Timing Comparison ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── Run all tests ───────────────────────────────────────────
export async function runTest() {
  console.log('=== Streaming Basics ===\n');

  await testTextStream();

  console.log('\n\n');
  await testFullText();

  console.log('\n\n');
  await testStreamMetadata();

  console.log('\n\n');
  await testMessageObjects();

  console.log('\n\n');
  await testTimingComparison();
}
