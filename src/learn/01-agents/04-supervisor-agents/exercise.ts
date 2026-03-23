/**
 * ============================================================
 *  MODULE 4: Supervisor Agents
 * ============================================================
 *
 *  THEORY
 *  ------
 *  Instead of building one mega-agent with 20 tools, you can split
 *  work across specialized agents coordinated by a "supervisor."
 *
 *  Architecture:
 *    Supervisor Agent
 *      ├── Research Agent   (good at finding info)
 *      ├── Writer Agent     (good at writing content)
 *      └── Critic Agent     (good at reviewing)
 *
 *  How it works:
 *    1. User sends a message to the supervisor
 *    2. Supervisor reads subagent descriptions + its own instructions
 *    3. Supervisor delegates tasks to the right subagent
 *    4. Subagent processes and returns result
 *    5. Supervisor may delegate to another agent or return final answer
 *
 *  Key feature: Subagents are automatically converted to tools with
 *  an `agent-` prefix (e.g., agent-researcher).
 *
 *  DELEGATION HOOKS (set via defaultOptions or per-call):
 *
 *    onDelegationStart(ctx):
 *      Intercept BEFORE delegation. ctx has:
 *        - primitiveId: which subagent
 *        - prompt: what's being sent
 *        - iteration: current loop count
 *      Return:
 *        - { proceed: true }  → allow delegation
 *        - { proceed: true, modifiedPrompt: '...' }  → rewrite prompt
 *        - { proceed: true, modifiedMaxSteps: 5 }  → limit subagent steps
 *        - { proceed: false, rejectionReason: '...' }  → block delegation
 *
 *    onDelegationComplete(ctx):
 *      Run AFTER delegation. ctx has:
 *        - primitiveId, result, error, bail()
 *      Return:
 *        - { feedback: '...' } → inject guidance into supervisor memory
 *        - Call ctx.bail() → stop supervisor loop immediately
 *
 *    messageFilter({ messages, primitiveId, prompt }):
 *      Filter conversation history before passing to subagents.
 *      Use to remove sensitive data or limit context size.
 *      Return: filtered message array
 *
 *    onIterationComplete(ctx):
 *      Monitor EACH supervisor loop iteration. ctx has:
 *        - iteration, maxIterations, finishReason, text
 *      Return:
 *        - { continue: true }  → keep going
 *        - { continue: false } → stop
 *        - { continue: true, feedback: '...' } → inject guidance
 *
 *  TASK COMPLETION SCORING:
 *    Validate task completeness after each iteration using scorers:
 *      isTaskComplete: {
 *        scorers: [myScorer],
 *        strategy: 'all',  // all scorers must pass
 *        onComplete: async (result) => { ... }
 *      }
 *
 *  TOOL APPROVAL PROPAGATION:
 *    If a subagent's tool has requireApproval: true, the approval
 *    request bubbles UP to the supervisor (even through multiple
 *    delegation levels). Listen for 'tool-call-approval' chunks.
 *
 *  MEMORY ISOLATION:
 *    1. Full context forwarded to subagent for informed decisions
 *    2. Only delegation prompt + response saved to subagent memory
 *    3. Fresh thread ID per invocation — clean separation
 *
 *  EXERCISE
 *  --------
 *  Build a "Blog Post Factory" with 3 agents:
 *    1. Researcher — generates topic research
 *    2. Writer — writes the blog post
 *    3. Supervisor — coordinates with delegation hooks
 * ============================================================
 */

import { Agent } from '@mastra/core/agent';

// ─── TODO 1: Create the Researcher agent ────────────────────
// This agent should:
//   - Be good at gathering key points about a topic
//   - Return bullet-point research summaries
//   - Have a clear `description` (the supervisor reads this!)
//
// Important: The `description` field tells the supervisor WHEN to
// delegate to this agent. Make it specific!

export const researcherAgent = undefined as any; // ← replace

// ─── TODO 2: Create the Writer agent ────────────────────────
// This agent should:
//   - Take research notes and write a polished blog post
//   - Follow a clear structure: title, intro, body, conclusion
//   - Have a clear `description` for the supervisor

export const writerAgent = undefined as any; // ← replace

// ─── TODO 3: Create the Supervisor agent ────────────────────
// The supervisor should:
//   - Have both subagents registered via the `agents` property
//   - Have instructions telling it to:
//     1. First delegate research to the researcher
//     2. Then delegate writing to the writer using the research
//   - NOT have tools of its own — it delegates everything
//
// Hint:
//   new Agent({
//     ...config,
//     agents: [researcherAgent, writerAgent],
//   })

export const blogSupervisor = undefined as any; // ← replace

// ─── TODO 4: Test the supervisor ────────────────────────────
// Send a blog topic to the supervisor and watch it delegate.
// Print the final blog post.
//
// Check response.steps to see the delegation chain:
//   - Which agents were called?
//   - What prompts were sent to each?

// ─── TODO 5: Add delegation hooks ───────────────────────────
// Create a SECOND supervisor with hooks to control delegation.
// Pass hooks via defaultOptions:
//
//   new Agent({
//     ...config,
//     agents: [researcherAgent, writerAgent],
//     defaultOptions: {
//       onDelegationStart: async (ctx) => {
//         console.log(`Delegating to: ${ctx.primitiveId}`);
//         console.log(`Prompt: ${ctx.prompt.slice(0, 100)}...`);
//         // Modify the prompt for the researcher
//         if (ctx.primitiveId === 'researcher') {
//           return {
//             proceed: true,
//             modifiedPrompt: `${ctx.prompt}\n\nFocus on recent 2024-2025 data.`,
//             modifiedMaxSteps: 5,
//           };
//         }
//         // Block after too many iterations
//         if (ctx.iteration > 5) {
//           return { proceed: false, rejectionReason: 'Too many iterations.' };
//         }
//         return { proceed: true };
//       },
//       onDelegationComplete: async (ctx) => {
//         if (ctx.error) {
//           console.log(`Delegation failed: ${ctx.error}`);
//           return { feedback: `${ctx.primitiveId} failed. Try another approach.` };
//         }
//         console.log(`${ctx.primitiveId} completed successfully`);
//       },
//     },
//   })

export const hookedSupervisor = undefined as any; // ← replace (or skip for now)

// ─── TODO 5b: Per-call delegation hooks ─────────────────────
// Hooks can ALSO be passed per-call via the `delegation` option
// (not just defaultOptions). This is useful when you want
// different hook behavior for different requests:
//
//   const stream = await supervisor.stream('Research AI trends', {
//     maxSteps: 10,
//     delegation: {
//       onDelegationStart: async (ctx) => {
//         console.log(`Delegating to: ${ctx.primitiveId}`);
//         if (ctx.primitiveId === 'researcher') {
//           return {
//             proceed: true,
//             modifiedPrompt: `${ctx.prompt}\n\nFocus on 2024-2025 data.`,
//           };
//         }
//         return { proceed: true };
//       },
//       onDelegationComplete: async (ctx) => {
//         if (ctx.error) {
//           ctx.bail();
//           return { feedback: `Failed: ${ctx.error}` };
//         }
//       },
//       messageFilter: ({ messages }) => messages.slice(-10),
//     },
//   });
//
// Two places to set hooks:
//   - defaultOptions: applies to ALL calls to this supervisor
//   - per-call delegation: applies to THIS specific call only

// ─── TODO 6: Add a messageFilter ───────────────────────────
// Create a supervisor with a messageFilter that:
//   - Removes any messages containing "confidential"
//   - Only passes the last 10 messages to subagents
//
//   messageFilter: ({ messages, primitiveId }) => {
//     return messages
//       .filter(msg => {
//         const content = typeof msg.content === 'string'
//           ? msg.content : JSON.stringify(msg.content);
//         return !content.includes('confidential');
//       })
//       .slice(-10);
//   }

// ─── TODO 7: Add onIterationComplete ────────────────────────
// Monitor each supervisor loop for quality:
//
//   onIterationComplete: async (ctx) => {
//     console.log(`Iteration ${ctx.iteration}/${ctx.maxIterations}`);
//     // Stop if we have a long enough response
//     if (ctx.text?.length > 500 && ctx.finishReason === 'stop') {
//       return { continue: false };
//     }
//     // Inject feedback if missing key content
//     if (!ctx.text?.includes('conclusion')) {
//       return { continue: true, feedback: 'Add a conclusion section.' };
//     }
//     return { continue: true };
//   }

export async function runTest() {
  console.log('=== Blog Post Factory ===\n');
  // TODO: Call blogSupervisor.generate() with a blog topic
  // TODO: Print the final response
  // TODO: Inspect response.steps to see delegation chain
  console.log('TODO: implement');
}
