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

// ─── TODO 5: Supervisor with delegation hooks ───────────────
// Hooks give you fine-grained control over delegation behavior.
// They can be set in `defaultOptions` (apply to ALL calls) or
// per-call via the `delegation` option.
export const hookedSupervisor = new Agent({
  id: 'hooked-blog-supervisor',
  name: 'Blog Post Factory (Hooked)',
  description: 'Coordinates research and writing with delegation hooks for logging and control.',
  instructions: `
    You are a blog production manager. When given a topic:
    1. Delegate to the researcher agent for key points
    2. Delegate to the writer agent for a polished post
    3. Return the final blog post
  `,
  model: 'anthropic/claude-sonnet-4-5',
  agents: [researcherAgent, writerAgent],
  defaultOptions: {
    // ─── onDelegationStart: Intercept BEFORE delegation ─────
    onDelegationStart: async (ctx) => {
      console.log(`[HOOK] Delegating to: ${ctx.primitiveId} (iteration ${ctx.iteration})`);
      console.log(`[HOOK] Prompt preview: ${ctx.prompt.slice(0, 80)}...`);

      // Modify prompt for the researcher to focus on recent data
      if (ctx.primitiveId === 'researcher') {
        return {
          proceed: true,
          modifiedPrompt: `${ctx.prompt}\n\nFocus on 2024-2025 trends and data.`,
          modifiedMaxSteps: 5,
        };
      }

      // Block delegation after too many iterations
      if (ctx.iteration > 8) {
        return {
          proceed: false,
          rejectionReason: 'Maximum iterations reached. Synthesize current findings.',
        };
      }

      return { proceed: true };
    },

    // ─── onDelegationComplete: Run AFTER delegation ─────────
    onDelegationComplete: async (ctx) => {
      if (ctx.error) {
        console.log(`[HOOK] Delegation to ${ctx.primitiveId} FAILED: ${ctx.error}`);
        // Inject feedback so the supervisor knows what happened
        return {
          feedback: `${ctx.primitiveId} failed: ${ctx.error}. Try a different approach.`,
        };
      }
      console.log(`[HOOK] ${ctx.primitiveId} completed successfully`);
      // You can also call ctx.bail() to stop the supervisor loop immediately
    },

    // ─── onIterationComplete: Monitor each supervisor loop ──
    onIterationComplete: async (ctx) => {
      console.log(`[HOOK] Iteration ${ctx.iteration}/${ctx.maxIterations} — finish: ${ctx.finishReason}`);

      // Stop early if we have a long enough response
      if (ctx.text && ctx.text.length > 1000 && ctx.finishReason === 'stop') {
        console.log('[HOOK] Response is sufficient, stopping.');
        return { continue: false };
      }

      // Inject feedback if the response is missing a conclusion
      if (ctx.text && !ctx.text.includes('conclusion')) {
        return { continue: true, feedback: 'Please include a conclusion section.' };
      }

      return { continue: true };
    },
  },
});

// ─── TODO 4: Test basic supervisor ──────────────────────────
export async function testBasicSupervisor() {
  console.log('=== Blog Post Factory (Basic) ===\n');

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

// ─── TODO 5b: Test per-call hooks + messageFilter ───────────
export async function testHookedSupervisor() {
  console.log('=== Blog Post Factory (Hooked) ===\n');

  // Per-call delegation hooks override defaultOptions for THIS call only
  const stream = await hookedSupervisor.stream(
    'Write a blog post about WebAssembly in 2025',
    {
      maxSteps: 10,
      delegation: {
        // ─── messageFilter: Control what subagents see ──────
        // Remove sensitive messages and limit context size
        messageFilter: ({ messages, primitiveId }) => {
          console.log(`[FILTER] Filtering ${messages.length} messages for ${primitiveId}`);
          return messages
            .filter(msg => {
              const content = typeof msg.content === 'string'
                ? msg.content : JSON.stringify(msg.content);
              return !content.includes('confidential');
            })
            .slice(-10); // Only pass the last 10 messages
        },
      },
    },
  );

  for await (const chunk of stream.textStream) {
    process.stdout.write(chunk);
  }

  console.log('\n\n--- Hooked supervisor complete ---');
}

// ─── Run all tests ──────────────────────────────────────────
export async function runTest() {
  await testBasicSupervisor();
  console.log('\n\n');
  await testHookedSupervisor();
}
