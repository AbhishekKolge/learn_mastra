/**
 * MODULE 4: Supervisor Agents — SOLUTION
 */

import { Agent } from '@mastra/core/agent';

// ─── TODO 1: Researcher agent ───────────────────────────────
export const researcherAgent = new Agent({
  id: 'researcher',
  name: 'Researcher',
  description: 'Researches a topic and returns structured bullet-point notes covering key facts, statistics, and talking points. Use this agent when you need background research on a topic before writing.',
  instructions: `
    You are an expert researcher. When given a topic:
    - Identify 5-7 key points or facts
    - Include relevant statistics or data points where possible
    - Organize findings into clear bullet points
    - Note any controversies or different perspectives
    - Keep research factual and well-structured
  `,
  model: 'anthropic/claude-sonnet-4-5',
});

// ─── TODO 2: Writer agent ───────────────────────────────────
export const writerAgent = new Agent({
  id: 'writer',
  name: 'Writer',
  description: 'Writes polished blog posts from research notes. Takes research or bullet points as input and produces a complete, engaging blog post with title, introduction, body sections, and conclusion.',
  instructions: `
    You are a skilled blog writer. When given research notes:
    - Create an engaging title
    - Write a hook introduction (2-3 sentences)
    - Organize the body into 3-4 sections with subheadings
    - Include a strong conclusion with a call to action
    - Keep tone conversational but informative
    - Target 500-800 words
  `,
  model: 'anthropic/claude-sonnet-4-5',
});

// ─── TODO 3: Supervisor agent ───────────────────────────────
export const blogSupervisor = new Agent({
  id: 'blog-supervisor',
  name: 'Blog Post Factory',
  description: 'Coordinates research and writing to produce complete blog posts.',
  instructions: `
    You are a blog production manager. When given a topic:
    1. FIRST: Delegate to the researcher agent to gather key points and facts
    2. THEN: Take the research results and delegate to the writer agent
       to produce a polished blog post
    3. FINALLY: Review the output and return the complete blog post

    Always use both agents — research first, then write.
    Do not write content yourself; always delegate to the specialists.
  `,
  model: 'anthropic/claude-sonnet-4-5',
  agents: [researcherAgent, writerAgent],
});

// ─── TODO 4: Test ───────────────────────────────────────────
export async function runTest() {
  console.log('=== Blog Post Factory ===\n');

  const response = await blogSupervisor.generate(
    'Write a blog post about the rise of AI agents in software development'
  );

  console.log('Final Blog Post:\n');
  console.log(response.text);

  console.log('\n--- Delegation Chain ---');
  console.log('Steps:', response.steps?.length);
  for (const step of response.steps || []) {
    console.log(`  Step: ${step.toolCalls?.map(tc => tc.toolName).join(', ') || 'text response'}`);
  }
}
