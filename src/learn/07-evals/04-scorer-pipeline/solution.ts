/**
 * MODULE 49: Scorer Pipeline Deep Dive — SOLUTION
 */

import { createScorer } from '@mastra/core/evals';
import { z } from 'zod';

// ─── TODO 1: Full pipeline scorer (all functions) ────────────
const technicalAccuracyScorer = createScorer({
  id: 'technical-accuracy',
  description: 'Measures technical keyword density in the output',
})
  .preprocess(({ run }) => {
    const sentences = run.output.split(/[.!?]+/).map(s => s.trim()).filter(Boolean);
    return { sentences, totalCount: sentences.length };
  })
  .analyze(({ results }) => {
    const techKeywords = ['function', 'class', 'type', 'interface', 'async', 'await', 'const', 'let', 'return', 'import', 'export', 'array', 'object', 'string', 'number', 'boolean', 'api', 'database', 'server', 'client'];
    const { sentences } = results.preprocessStepResult;

    const technicalSentences = sentences.filter((s: string) =>
      techKeywords.some(kw => s.toLowerCase().includes(kw))
    );

    return {
      technicalCount: technicalSentences.length,
      totalCount: sentences.length,
      foundKeywords: [...new Set(techKeywords.filter(kw =>
        sentences.some((s: string) => s.toLowerCase().includes(kw))
      ))],
    };
  })
  .generateScore(({ results }) => {
    const { technicalCount, totalCount } = results.analyzeStepResult;
    if (totalCount === 0) return 0;
    return technicalCount / totalCount;
  })
  .generateReason(({ results, score }) => {
    const { technicalCount, totalCount, foundKeywords } = results.analyzeStepResult;
    return `${technicalCount}/${totalCount} sentences are technical (${(score * 100).toFixed(0)}%). Keywords: ${foundKeywords.join(', ')}`;
  });

// ─── TODO 2: Full pipeline scorer (all prompt objects) ───────
const helpfulnessScorer = createScorer({
  id: 'helpfulness',
  description: 'Judges how helpful the response is',
  judge: {
    model: 'anthropic/claude-sonnet-4-5',
    instructions: 'You evaluate how helpful AI responses are.',
  },
})
  .preprocess({
    description: 'Extract the user intent from the input',
    outputSchema: z.object({
      intent: z.string(),
      expectedTopics: z.array(z.string()),
    }),
    createPrompt: ({ run }) => `What is the user trying to achieve with this input?
Input: "${run.input}"
Return JSON with intent (one sentence) and expectedTopics (array of topics they'd want covered).`,
  })
  .analyze({
    description: 'Judge how well the output addresses the intent',
    outputSchema: z.object({
      addressesIntent: z.boolean(),
      coveredTopics: z.array(z.string()),
      missingTopics: z.array(z.string()),
      helpfulnessRating: z.number().min(0).max(10),
    }),
    createPrompt: ({ run, results }) => `Judge how well this response helps the user.

User intent: ${results.preprocessStepResult.intent}
Expected topics: ${results.preprocessStepResult.expectedTopics.join(', ')}

Response: "${run.output}"

Return JSON: { addressesIntent, coveredTopics, missingTopics, helpfulnessRating (0-10) }`,
  })
  .generateScore(({ results }) => {
    return results.analyzeStepResult.helpfulnessRating / 10;
  })
  .generateReason({
    description: 'Explain the helpfulness score',
    createPrompt: ({ results, score }) => `Explain in one sentence why this response scored ${score.toFixed(2)} for helpfulness.
Covered: ${results.analyzeStepResult.coveredTopics.join(', ')}
Missing: ${results.analyzeStepResult.missingTopics.join(', ') || 'nothing'}`,
  });

// ─── TODO 3: Mixed pipeline scorer ──────────────────────────
const concisenessScorer = createScorer({
  id: 'conciseness',
  description: 'Measures if the response is appropriately concise',
  judge: {
    model: 'anthropic/claude-sonnet-4-5',
    instructions: 'You evaluate text conciseness.',
  },
})
  .preprocess(({ run }) => {
    const words = run.output.split(/\s+/).filter(Boolean);
    const sentences = run.output.split(/[.!?]+/).filter(s => s.trim().length > 0);
    return {
      wordCount: words.length,
      sentenceCount: sentences.length,
      avgSentenceLength: sentences.length > 0 ? words.length / sentences.length : 0,
    };
  })
  .analyze({
    description: 'Judge if the text is unnecessarily verbose',
    outputSchema: z.object({
      isVerbose: z.boolean(),
      redundantPhrases: z.array(z.string()),
      concisenessRating: z.number().min(0).max(10),
    }),
    createPrompt: ({ run, results }) => `Judge the conciseness of this text.
Word count: ${results.preprocessStepResult.wordCount}
Avg sentence length: ${results.preprocessStepResult.avgSentenceLength.toFixed(1)} words

Text: "${run.output}"

Identify redundant phrases. Rate conciseness 0-10 (10 = perfectly concise).
Return JSON: { isVerbose, redundantPhrases, concisenessRating }`,
  })
  .generateScore(({ results }) => {
    const { concisenessRating } = results.analyzeStepResult;
    const { avgSentenceLength } = results.preprocessStepResult;

    // Combine LLM judgment with algorithmic check
    const llmScore = concisenessRating / 10;
    const lengthPenalty = avgSentenceLength > 25 ? 0.8 : 1.0;

    return Math.min(llmScore * lengthPenalty, 1);
  })
  .generateReason(({ results, score }) => {
    const { wordCount, avgSentenceLength } = results.preprocessStepResult;
    const { redundantPhrases } = results.analyzeStepResult;
    const issues = redundantPhrases.length > 0
      ? `Redundant: ${redundantPhrases.join(', ')}`
      : 'No redundancy';
    return `Conciseness: ${score.toFixed(2)}. ${wordCount} words, ${avgSentenceLength.toFixed(1)} avg/sentence. ${issues}`;
  });

// ─── TODO 4-7: Tests ────────────────────────────────────────
export async function testFunctionPipeline() {
  console.log('--- All-Function Pipeline ---');

  const technical = await technicalAccuracyScorer.run({
    input: 'Explain TypeScript',
    output: 'TypeScript adds static type checking to JavaScript. You can define interfaces and type annotations. Functions can have typed parameters and return types. The compiler catches errors before runtime.',
  });

  const nonTechnical = await technicalAccuracyScorer.run({
    input: 'Explain TypeScript',
    output: 'It is a nice thing that many people like to use. It helps with writing better programs. Many companies have adopted it.',
  });

  console.log(`Technical:     ${technical.score.toFixed(3)} — ${technical.reason}`);
  console.log(`Non-technical: ${nonTechnical.score.toFixed(3)} — ${nonTechnical.reason}`);
}

export async function testPromptPipeline() {
  console.log('--- All-Prompt Pipeline ---');

  const helpful = await helpfulnessScorer.run({
    input: 'How do I deploy a Node.js app to production?',
    output: 'To deploy a Node.js app: 1) Choose a hosting provider (AWS, Vercel, Railway). 2) Set up a Dockerfile or buildpack. 3) Configure environment variables. 4) Set up CI/CD for automated deploys. 5) Add monitoring and logging.',
  });

  const unhelpful = await helpfulnessScorer.run({
    input: 'How do I deploy a Node.js app to production?',
    output: 'Just deploy it somewhere.',
  });

  console.log(`Helpful:   ${helpful.score.toFixed(3)} — ${helpful.reason}`);
  console.log(`Unhelpful: ${unhelpful.score.toFixed(3)} — ${unhelpful.reason}`);
}

export async function testMixedPipeline() {
  console.log('--- Mixed Pipeline ---');

  const concise = await concisenessScorer.run({
    input: 'What is TypeScript?',
    output: 'TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.',
  });

  const verbose = await concisenessScorer.run({
    input: 'What is TypeScript?',
    output: 'Well, TypeScript is basically, essentially, and fundamentally what you might call a typed superset of JavaScript, which is to say that it is a programming language that takes the existing JavaScript language and adds additional features on top of it, specifically static type checking capabilities, and then it compiles down and transforms back into regular plain JavaScript code.',
  });

  console.log(`Concise: ${concise.score.toFixed(3)} — ${concise.reason}`);
  console.log(`Verbose: ${verbose.score.toFixed(3)} — ${verbose.reason}`);
}

export async function testStepResults() {
  console.log('--- Step Results Inspection ---');

  const result = await technicalAccuracyScorer.run({
    input: 'Explain async/await',
    output: 'The async keyword marks a function as asynchronous. The await keyword pauses execution until a Promise resolves. This makes asynchronous code easier to read.',
  });

  console.log('Score:', result.score.toFixed(3));
  console.log('Reason:', result.reason);
  console.log('Preprocess result:', (result as any).preprocessStepResult);
  console.log('Analyze result:', (result as any).analyzeStepResult);
}

// ─── Run all tests ───────────────────────────────────────────
export async function runTest() {
  console.log('=== Scorer Pipeline ===\n');

  await testFunctionPipeline();
  console.log('\n');
  await testPromptPipeline();
  console.log('\n');
  await testMixedPipeline();
  console.log('\n');
  await testStepResults();
}
