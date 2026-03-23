/**
 * MODULE 3: Structured Output — SOLUTION
 */

import { Agent } from '@mastra/core/agent';
import { z } from 'zod';

export const analysisAgent = new Agent({
  id: 'language-analyst',
  name: 'Language Analyst',
  instructions: `
    You are a programming language expert. When asked about a language,
    provide detailed, accurate analysis including strengths, weaknesses,
    and common use cases. Be objective and thorough.
  `,
  model: 'anthropic/claude-sonnet-4-5',
});

// ─── TODO 1: Schema ─────────────────────────────────────────
const languageAnalysisSchema = z.object({
  name: z.string(),
  paradigms: z.array(z.string()),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  useCases: z.array(
    z.object({
      scenario: z.string(),
      reasoning: z.string(),
    })
  ),
  rating: z.number().min(1).max(10),
  summary: z.string(),
});

// ─── TODO 2: Structured generate ────────────────────────────
export async function testStructuredGenerate() {
  const response = await analysisAgent.generate('Analyze TypeScript as a programming language.', {
    structuredOutput: {
      schema: languageAnalysisSchema,
    },
  });

  const data = response.object;
  console.log('Name:', data.name);
  console.log('Paradigms:', data.paradigms.join(', '));
  console.log('Rating:', data.rating, '/ 10');
  console.log('Strengths:', data.strengths);
  console.log('Use Cases:', data.useCases);
  console.log('Summary:', data.summary);
}

// ─── TODO 3: Structured stream ──────────────────────────────
export async function testStructuredStream() {
  const stream = await analysisAgent.stream('Analyze Rust as a programming language.', {
    structuredOutput: {
      schema: languageAnalysisSchema,
    },
  });

  // Watch the full stream for the object-result event
  for await (const chunk of stream.fullStream) {
    if (chunk.type === 'object-result') {
      console.log('\nGot structured result!');
      console.log(JSON.stringify(chunk, null, 2));
    }
  }

  // Or just await the final object
  const obj = await stream.object;
  console.log('\nFinal object:', obj);
}

// ─── TODO 4: Fallback strategy ──────────────────────────────
export async function testFallbackStrategy() {
  const strictSchema = z.object({
    name: z.string(),
    yearCreated: z.number(),
    isCompiled: z.boolean(),
    features: z.array(z.string()).min(5),
  });

  const response = await analysisAgent.generate('Tell me about Python.', {
    structuredOutput: {
      schema: strictSchema,
      errorStrategy: 'fallback',
      fallbackValue: {
        name: 'Python',
        yearCreated: 1991,
        isCompiled: false,
        features: ['Dynamic typing', 'GC', 'Multi-paradigm', 'Large stdlib', 'Readable syntax'],
      },
    },
  });

  console.log('Result:', response.object);
}

// ─── TODO 5: Structuring agent ──────────────────────────────
export async function testStructuringAgent() {
  const complexSchema = z.object({
    overview: z.string(),
    strengths: z.array(z.string()),
    weaknesses: z.array(z.string()),
    useCases: z.array(
      z.object({
        scenario: z.string(),
        reasoning: z.string(),
      })
    ),
    comparison: z.object({
      similarTo: z.array(z.string()),
      differentiators: z.array(z.string()),
    }),
  });

  const response = await analysisAgent.generate('Analyze the Go programming language in depth.', {
    structuredOutput: {
      schema: complexSchema,
      model: 'anthropic/claude-sonnet-4-5', // second model for extraction
    },
  });

  console.log('Structured result:', JSON.stringify(response.object, null, 2));
}

// ─── Run all tests ──────────────────────────────────────────
export async function runTest() {
  console.log('=== Structured Generate ===\n');
  await testStructuredGenerate();

  console.log('\n=== Structured Stream ===\n');
  await testStructuredStream();

  console.log('\n=== Fallback Strategy ===\n');
  await testFallbackStrategy();

  console.log('\n=== Structuring Agent (Bonus) ===\n');
  await testStructuringAgent();
}
