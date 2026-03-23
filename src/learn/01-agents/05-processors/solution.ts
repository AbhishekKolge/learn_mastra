/**
 * MODULE 5: Processors — SOLUTION
 */

import { Agent } from '@mastra/core/agent';
import type { Processor } from '@mastra/core/agent';

// ─── TODO 1: Logging input processor ────────────────────────
const loggingProcessor: Processor = {
  processInput({ messages, systemMessages }) {
    console.log('[LOG] Input messages:');
    for (const msg of messages) {
      console.log(`  [${msg.role}]: ${typeof msg.content === 'string' ? msg.content.slice(0, 80) : '(complex content)'}`);
    }
    // Return unchanged — we're just observing
    return { messages, systemMessages };
  },
};

// ─── TODO 2: Timestamp output processor ─────────────────────
const timestampProcessor: Processor = {
  processOutputResult({ result }) {
    const timestamp = new Date().toISOString();
    // Append timestamp to each assistant message
    const messages = result.messages.map((msg) => {
      if (msg.role === 'assistant' && typeof msg.content === 'string') {
        return {
          ...msg,
          content: `${msg.content}\n\n---\n_Generated at ${timestamp}_`,
        };
      }
      return msg;
    });
    return { ...result, messages };
  },
};

// ─── TODO 3: Word-limit processor ───────────────────────────
const wordLimitProcessor: Processor = {
  processOutputStep({ result }) {
    // Find the assistant message and count words
    const assistantMsg = result.messages.find((m) => m.role === 'assistant');
    if (assistantMsg && typeof assistantMsg.content === 'string') {
      const wordCount = assistantMsg.content.split(/\s+/).length;
      console.log(`[WORD LIMIT] Response has ${wordCount} words`);

      if (wordCount > 100) {
        console.log('[WORD LIMIT] Too long! Requesting retry...');
        return {
          retry: true,
          feedback: `Your response was ${wordCount} words. Please keep it under 100 words. Be more concise.`,
        };
      }
    }
    return { retry: false };
  },
};

// ─── TODO 4: Agent with processors ──────────────────────────
export const processedAgent = new Agent({
  id: 'processed-agent',
  name: 'Processed Agent',
  instructions: 'You are a helpful, concise assistant. Keep answers brief.',
  model: 'anthropic/claude-sonnet-4-5',
  inputProcessors: [loggingProcessor],
  outputProcessors: [timestampProcessor, wordLimitProcessor],
  maxProcessorRetries: 2,
});

// ─── TODO 5: Test ───────────────────────────────────────────
export async function runTest() {
  console.log('=== Processor Test ===\n');

  const response = await processedAgent.generate(
    'Explain what a closure is in JavaScript'
  );

  console.log('\nFinal response:\n', response.text);
}
