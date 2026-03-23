/**
 * MODULE 48: Custom Scorers — SOLUTION
 */

import { createScorer } from '@mastra/core/evals';
import { z } from 'zod';

// ─── TODO 1: Simple function-only scorer ─────────────────────
const codeBlockScorer = createScorer({
  id: 'code-block-checker',
  description: 'Checks if the output contains code blocks',
})
  .generateScore(({ run }) => {
    return run.output.includes('```') ? 1 : 0;
  })
  .generateReason(({ score }) => {
    return score === 1
      ? 'Output contains code blocks — good for technical responses.'
      : 'Output does not contain code blocks. Consider adding code examples.';
  });

// ─── TODO 2: Word count scorer ───────────────────────────────
const wordCountScorer = createScorer({
  id: 'word-count',
  description: 'Measures if output meets minimum word count (50 words)',
})
  .preprocess(({ run }) => {
    const words = run.output.split(/\s+/).filter(Boolean);
    return { wordCount: words.length };
  })
  .generateScore(({ results }) => {
    const { wordCount } = results.preprocessStepResult;
    return Math.min(wordCount / 50, 1);
  })
  .generateReason(({ results, score }) => {
    const { wordCount } = results.preprocessStepResult;
    if (score >= 1) return `Sufficient length: ${wordCount} words (meets 50-word minimum).`;
    return `Too short: ${wordCount} words (needs ${50 - wordCount} more to reach minimum).`;
  });

// ─── TODO 3: LLM-judged professionalism scorer ──────────────
const professionalismScorer = createScorer({
  id: 'professionalism',
  description: 'Checks if the response is professional in tone',
  judge: {
    model: 'anthropic/claude-sonnet-4-5',
    instructions: 'You evaluate text for professionalism and formality.',
  },
})
  .analyze({
    description: 'Analyze professionalism of the response',
    outputSchema: z.object({
      isProfessional: z.boolean(),
      issues: z.array(z.string()),
      formalityScore: z.number().min(0).max(10),
    }),
    createPrompt: ({ run }) => `Analyze the professionalism of this text:
"${run.output}"

Check for:
- Appropriate language and tone
- Grammar and spelling
- Slang or informal language
- Respectful communication

Rate formality from 0 (very casual) to 10 (very formal).
Return JSON: { isProfessional, issues, formalityScore }`,
  })
  .generateScore(({ results }) => {
    return results.analyzeStepResult.formalityScore / 10;
  })
  .generateReason(({ results, score }) => {
    const { isProfessional, issues } = results.analyzeStepResult;
    if (isProfessional) {
      return `Professional tone (${score.toFixed(2)}). No issues found.`;
    }
    return `Unprofessional tone (${score.toFixed(2)}). Issues: ${issues.join(', ')}`;
  });

// ─── TODO 4: Test the code block scorer ──────────────────────
export async function testCodeBlockScorer() {
  console.log('--- Code Block Scorer ---');

  const withCode = await codeBlockScorer.run({
    input: 'How do I create a function?',
    output: 'Here is how:\n```typescript\nfunction hello() { return "hi" }\n```',
  });

  const withoutCode = await codeBlockScorer.run({
    input: 'How do I create a function?',
    output: 'Use the function keyword followed by a name and parameters.',
  });

  console.log(`With code blocks:    ${withCode.score} — ${withCode.reason}`);
  console.log(`Without code blocks: ${withoutCode.score} — ${withoutCode.reason}`);
}

// ─── TODO 5: Test the word count scorer ──────────────────────
export async function testWordCountScorer() {
  console.log('--- Word Count Scorer ---');

  const short = await wordCountScorer.run({
    input: 'Explain recursion',
    output: 'Recursion is when a function calls itself.',
  });

  const long = await wordCountScorer.run({
    input: 'Explain recursion',
    output: 'Recursion is a programming technique where a function calls itself to solve a problem by breaking it down into smaller subproblems. Each recursive call works on a smaller version of the original problem until it reaches a base case that can be solved directly. The base case is essential to prevent infinite recursion. Common examples include calculating factorials, traversing tree data structures, and implementing divide-and-conquer algorithms like merge sort.',
  });

  console.log(`Short (${(short as any).preprocessStepResult?.wordCount} words): ${short.score.toFixed(3)} — ${short.reason}`);
  console.log(`Long (${(long as any).preprocessStepResult?.wordCount} words):  ${long.score.toFixed(3)} — ${long.reason}`);
}

// ─── TODO 6: Test the professionalism scorer ────────────────
export async function testProfessionalismScorer() {
  console.log('--- Professionalism Scorer ---');

  const professional = await professionalismScorer.run({
    input: 'Explain our refund policy',
    output: 'Our refund policy allows returns within 30 days of purchase. Please contact our customer support team with your order number for assistance.',
  });

  const casual = await professionalismScorer.run({
    input: 'Explain our refund policy',
    output: 'lol yeah just send it back within like 30 days or whatever. hit us up if u need help with that stuff',
  });

  console.log(`Professional: ${professional.score.toFixed(3)} — ${professional.reason}`);
  console.log(`Casual:       ${casual.score.toFixed(3)} — ${casual.reason}`);
}

// ─── TODO 7: Build a domain-specific scorer ──────────────────
export async function testDomainScorer() {
  console.log('--- Domain-Specific Scorer (JSON Validator) ---');

  const jsonValidatorScorer = createScorer({
    id: 'json-validator',
    description: 'Checks if the output contains valid JSON',
  })
    .preprocess(({ run }) => {
      const jsonMatch = run.output.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
      if (!jsonMatch) return { hasJson: false, isValid: false, json: null };
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        return { hasJson: true, isValid: true, json: parsed };
      } catch {
        return { hasJson: true, isValid: false, json: null };
      }
    })
    .generateScore(({ results }) => {
      const { hasJson, isValid } = results.preprocessStepResult;
      if (!hasJson) return 0;
      return isValid ? 1 : 0.5;
    })
    .generateReason(({ results, score }) => {
      const { hasJson, isValid } = results.preprocessStepResult;
      if (!hasJson) return 'No JSON found in output.';
      if (isValid) return 'Valid JSON found and parsed successfully.';
      return 'JSON-like content found but it is malformed.';
    });

  const valid = await jsonValidatorScorer.run({
    input: 'Return user data as JSON',
    output: 'Here is the data: {"name": "Alice", "age": 30}',
  });

  const invalid = await jsonValidatorScorer.run({
    input: 'Return user data as JSON',
    output: 'Here is the data: {name: Alice, age: 30}',
  });

  const none = await jsonValidatorScorer.run({
    input: 'Return user data as JSON',
    output: 'The user is Alice and she is 30 years old.',
  });

  console.log(`Valid JSON:   ${valid.score} — ${valid.reason}`);
  console.log(`Invalid JSON: ${invalid.score} — ${invalid.reason}`);
  console.log(`No JSON:      ${none.score} — ${none.reason}`);
}

// ─── Run all tests ───────────────────────────────────────────
export async function runTest() {
  console.log('=== Custom Scorers ===\n');

  await testCodeBlockScorer();
  console.log('\n');
  await testWordCountScorer();
  console.log('\n');
  await testProfessionalismScorer();
  console.log('\n');
  await testDomainScorer();
}
