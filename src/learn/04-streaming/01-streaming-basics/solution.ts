/**
 * MODULE 24: Streaming Basics — SOLUTION
 */

import { Agent } from '@mastra/core/agent';

// ─── TODO 1: Create a Story Writer agent ─────────────────────
export const storyWriter = new Agent({
  id: 'story-writer',
  name: 'Story Writer',
  instructions: `
    You are a creative fiction writer.
    Write short stories (2-3 paragraphs) with vivid descriptions
    and engaging plots. Use sensory details and compelling characters.
    Keep stories concise but impactful.
  `,
  model: 'anthropic/claude-sonnet-4-5',
});

// ─── TODO 2: Basic text streaming ────────────────────────────
export async function testTextStream() {
  console.log('--- Text Stream ---');

  const stream = await storyWriter.stream(
    'Write a short story about a lighthouse keeper who discovers a message in a bottle.'
  );

  for await (const chunk of stream.textStream) {
    process.stdout.write(chunk);
  }
}

// ─── TODO 3: Await full text after streaming ─────────────────
export async function testFullText() {
  console.log('--- Full Text After Stream ---');

  const stream = await storyWriter.stream(
    'Write a short story about a cat that learns to play piano.'
  );

  for await (const chunk of stream.textStream) {
    process.stdout.write(chunk);
  }

  const fullText = await stream.text;
  console.log('\n\nFull text length:', fullText.length, 'characters');
}

// ─── TODO 4: Check stream metadata ──────────────────────────
export async function testStreamMetadata() {
  console.log('--- Stream Metadata ---');

  const stream = await storyWriter.stream(
    'Write a one-paragraph story about rain.'
  );

  for await (const chunk of stream.textStream) {
    process.stdout.write(chunk);
  }

  const reason = await stream.finishReason;
  const usage = await stream.usage;

  console.log('\n\nFinish reason:', reason);
  console.log('Usage:', JSON.stringify(usage, null, 2));
}

// ─── TODO 5: Stream with message objects ─────────────────────
export async function testMessageObjects() {
  console.log('--- Message Objects ---');

  const stream = await storyWriter.stream([
    { role: 'user', content: 'Write a story about a robot learning to paint' },
  ]);

  for await (const chunk of stream.textStream) {
    process.stdout.write(chunk);
  }
}

// ─── TODO 6: Compare generate() vs stream() timing ──────────
export async function testTimingComparison() {
  console.log('--- Timing Comparison ---');

  const prompt = 'Write a two-sentence story about a sunrise.';

  // generate() — must wait for full response
  const genStart = Date.now();
  const response = await storyWriter.generate(prompt);
  const genTime = Date.now() - genStart;
  console.log(`generate() total time: ${genTime}ms`);
  console.log(`generate() response: ${response.text.slice(0, 80)}...`);

  console.log('');

  // stream() — first chunk arrives much sooner
  const streamStart = Date.now();
  const stream = await storyWriter.stream(prompt);
  let firstChunkTime = 0;
  let chunkCount = 0;

  for await (const chunk of stream.textStream) {
    chunkCount++;
    if (chunkCount === 1) {
      firstChunkTime = Date.now() - streamStart;
      process.stdout.write(chunk);
    } else {
      process.stdout.write(chunk);
    }
  }

  const totalStreamTime = Date.now() - streamStart;
  console.log(`\n\nstream() first chunk: ${firstChunkTime}ms`);
  console.log(`stream() total time: ${totalStreamTime}ms`);
  console.log(`stream() chunks received: ${chunkCount}`);
  console.log(`\nKey insight: stream() first chunk (${firstChunkTime}ms) vs generate() total (${genTime}ms)`);
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
