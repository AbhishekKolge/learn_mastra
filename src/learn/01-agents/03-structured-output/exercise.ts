/**
 * ============================================================
 *  MODULE 3: Structured Output
 * ============================================================
 *
 *  THEORY
 *  ------
 *  By default, agents return free-form text. But often you need
 *  a typed object — for an API response, UI rendering, or piping
 *  data into the next step of your app.
 *
 *  Structured output forces the agent to return a JSON object
 *  matching a schema you define.
 *
 *  How it works:
 *    1. Define a Zod schema for your desired output shape
 *    2. Pass it as `structuredOutput: { schema }` to generate() or stream()
 *    3. Access the result via `response.object` (not response.text)
 *
 *  Error handling strategies:
 *    - 'strict'   (default) — throws if output doesn't match schema
 *    - 'warn'     — logs a warning, continues execution
 *    - 'fallback' — returns a fallback value you provide
 *
 *  Advanced patterns:
 *    - Use a separate `model` for structuring when the primary model
 *      struggles with complex schemas (makes 2 LLM calls)
 *    - Use `jsonPromptInjection: true` for models that don't support
 *      structured output natively (like Gemini 2.5 with tools)
 *
 *  EXERCISE
 *  --------
 *  Create an agent that analyzes programming languages and returns
 *  structured data you can use in a UI.
 * ============================================================
 */

import { Agent } from "@mastra/core/agent";
import { createTool } from "@mastra/core/tools";
import { z } from "zod";

const languageAnalyzer = createTool({
  id: "language-analyzer",
  description: "Analyzes a programming language",
  inputSchema: z.object({ language: z.string() }),
  outputSchema: z.object({
    name: z.string(),
    paradigms: z.array(z.string()),
    strengths: z.array(z.string()),
    weaknesses: z.array(z.string()),
    useCases: z.array(
      z.object({ scenario: z.string(), reasoning: z.string() }),
    ),
    rating: z.number(),
    summary: z.string(),
  }),
  execute: async ({ language }) => {
    return {
      name: language,
      paradigms: ["object-oriented", "functional"],
      strengths: ["Type safety", "Strong typing", "Static analysis"],
      weaknesses: ["Slower compilation", "Steep learning curve"],
      useCases: [
        {
          scenario: "Web development",
          reasoning:
            "TypeScript is a statically typed programming language that is a superset of JavaScript. It is a great choice for web development because it is a statically typed language that helps catch errors at compile time.",
        },
      ],
      rating: 9,
      summary:
        "TypeScript is a statically typed programming language that is a superset of JavaScript. It is a great choice for web development because it is a statically typed language that helps catch errors at compile time.",
    };
  },
});

// ─── Setup: Create a simple analysis agent ──────────────────
export const analysisAgent = new Agent({
  id: "language-analyst",
  name: "Language Analyst",
  instructions: `
    You are a programming language expert. When asked about a language,
    provide detailed, accurate analysis including strengths, weaknesses,
    and common use cases. Be objective and thorough.
  `,
  model: "anthropic/claude-haiku-4-5",
});

// ─── TODO 1: Define a Zod schema for language analysis ──────
// Create a schema with these fields:
//   - name: string
//   - paradigms: array of strings (e.g., ["object-oriented", "functional"])
//   - strengths: array of strings
//   - weaknesses: array of strings
//   - useCases: array of objects with { scenario: string, reasoning: string }
//   - rating: number (1-10)
//   - summary: string

const languageAnalysisSchema = z.object({
  name: z.string(),
  paradigms: z.array(z.string()),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  useCases: z.array(z.object({ scenario: z.string(), reasoning: z.string() })),
  rating: z.number(),
  summary: z.string(),
});

// ─── TODO 2: Use structured output with generate() ──────────
// Call analysisAgent.generate() with:
//   - A prompt asking about TypeScript
//   - structuredOutput: { schema: languageAnalysisSchema }
// Print response.object (not response.text!)

export async function testStructuredGenerate() {
  // TODO: implement
  const response = await analysisAgent.generate(
    "Analyze TypeScript as a programming language.",
    {
      structuredOutput: {
        schema: languageAnalysisSchema,
      },
    },
  );
  console.log(response.object);
}

// ─── TODO 3: Use structured output with stream() ────────────
// Same idea but with streaming. Access the final object with:
//   await stream.object
//
// Also iterate over stream.fullStream and look for chunks
// where chunk.type === 'object-result'

export async function testStructuredStream() {
  // TODO: implement
  const stream = await analysisAgent.stream(
    "Analyze TypeScript as a programming language.",
    {
      structuredOutput: {
        schema: languageAnalysisSchema,
      },
    },
  );
  for await (const chunk of stream.fullStream) {
    if (chunk.type === "object-result") {
      console.log(chunk.object);
    }
  }

  const obj = await stream.object;
  console.log(obj);
}

// ─── TODO 4: Error handling with fallback ───────────────────
// Use errorStrategy: 'fallback' with a fallbackValue.
// This protects your app when the LLM returns unexpected data.
//
// Create a schema that's intentionally hard to satisfy,
// and provide a sensible fallback.

export async function testFallbackStrategy() {
  // TODO: Define a strict schema
  // TODO: Call generate with errorStrategy: 'fallback' and a fallbackValue
  // TODO: Print the result
  const response = await analysisAgent.generate(
    "Analyze TypeScript as a programming language.",
    {
      structuredOutput: {
        schema: languageAnalysisSchema,
        errorStrategy: "fallback",
        fallbackValue: {
          name: "TypeScript",
          paradigms: ["object-oriented", "functional"],
          strengths: ["Type safety", "Strong typing", "Static analysis"],
          weaknesses: ["Slower compilation", "Steep learning curve"],
          useCases: [
            {
              scenario: "Web development",
              reasoning:
                "TypeScript is a statically typed programming language that is a superset of JavaScript. It is a great choice for web development because it is a statically typed language that helps catch errors at compile time.",
            },
          ],
          rating: 9,
          summary:
            "TypeScript is a statically typed programming language that is a superset of JavaScript. It is a great choice for web development because it is a statically typed language that helps catch errors at compile time.",
        },
      },
    },
  );
  console.log(JSON.stringify(response.object));
}

// ─── TODO 5 (BONUS): Structuring agent pattern ─────────────
// When a complex schema is hard for one model to fill,
// use a second model to extract/structure the output:
//
//   structuredOutput: {
//     schema: complexSchema,
//     model: 'anthropic/claude-sonnet-4-5',  // second model for extraction
//   }
//
// This makes TWO LLM calls — one for content, one for structuring.
// Try it with a very complex nested schema.

export async function testStructuringAgent() {
  // TODO: (bonus) implement
  const response = await analysisAgent.generate(
    "Analyze TypeScript as a programming language.",
    {
      structuredOutput: {
        schema: languageAnalysisSchema,
        model: "anthropic/claude-opus-4-6",
      },
    },
  );
  console.log(response.object);
}

// ─── TODO 6: prepareStep for multi-step tool + structured output ─
// Some models can't use tools AND structured output at the same time.
// prepareStep separates them across steps:
//
//   Step 0: Use tools to gather data
//   Step 1+: Use structured output to format the result
//
// This is a callback you pass to generate() or stream():
//
//  const response = await analysisAgent.generate('Analyze TypeScript as a programming language.', {
//     prepareStep: async ({ stepNumber }) => {
//       if (stepNumber === 0) {
//         return {
//           tools: { languageAnalyzer },
//           toolChoice: 'required',
//         };
//       }
//       return {
//         tools: undefined,
//         structuredOutput: {
//           schema: z.object({
//             temperature: z.number(),
//             humidity: z.number(),
//           }),
//         },
//       };
//     },
//   })
//
// This is also the shorthand for processInputStep() without needing
// to create a Processor class.

export async function testPrepareStep() {
  // TODO: (bonus) Create an agent with a tool, then use prepareStep
  //       to do tool calling in step 0 and structured output in step 1
  const response = await analysisAgent.generate(
    "Analyze TypeScript as a programming language.",
    {
      prepareStep: ({ stepNumber }) => {
        if (stepNumber === 0) {
          return {
            tools: { languageAnalyzer },
            toolChoice: "required",
          };
        }
        return {
          tools: undefined,
          structuredOutput: { schema: languageAnalysisSchema },
        };
      },
    },
  );
  console.log(response.object);
}

// ─── TODO 7: jsonPromptInjection for incompatible models ────
// Gemini 2.5 models can't combine response_format with function calling.
// Set jsonPromptInjection: true to inject the schema into the system
// prompt instead of using the API's response_format parameter:
//
//   structuredOutput: {
//     schema: mySchema,
//     jsonPromptInjection: true,  // ← schema goes in prompt, not API
//   }
//
// This works with ANY model, even those without native structured output.

// ─── TODO 8: JSON Schema alternative (instead of Zod) ──────
// You can use raw JSON Schema if you prefer language-agnostic specs:
//
//   structuredOutput: {
//     schema: {
//       type: 'object',
//       properties: {
//         name: { type: 'string' },
//         rating: { type: 'number' },
//       },
//       required: ['name', 'rating'],
//     },
//   }
//
// Both Zod and JSON Schema work identically. Zod gives you
// TypeScript type inference; JSON Schema is language-agnostic.

// ─── Run all tests ──────────────────────────────────────────
export async function runTest() {
  // console.log('=== Structured Generate ===\n');
  // await testStructuredGenerate();
  // console.log('\n=== Structured Stream ===\n');
  // await testStructuredStream();
  // console.log('\n=== Fallback Strategy ===\n');
  // await testFallbackStrategy();
  // console.log('\n=== Structuring Agent (Bonus) ===\n');
  // await testStructuringAgent();
  // console.log('\n=== prepareStep (Bonus) ===\n');
  // await testPrepareStep();
}
