/**
 * ============================================================
 *  MODULE 7: Agent Approval (Human-in-the-Loop)
 * ============================================================
 *
 *  THEORY
 *  ------
 *  Some tool actions are dangerous — deleting records, sending emails,
 *  making payments. Agent Approval lets you pause execution and wait
 *  for a human to approve or decline before proceeding.
 *
 *  Two mechanisms:
 *
 *  1. PRE-EXECUTION APPROVAL
 *     The LLM decides which tool to call + arguments, but execution
 *     is paused until a human approves.
 *
 *     Trigger with:
 *       - `requireToolApproval: true` on generate/stream (pauses ALL tools)
 *       - `requireApproval: true` on a specific tool (pauses THAT tool only)
 *
 *     Approve/decline with:
 *       - agent.approveToolCall({ runId })
 *       - agent.declineToolCall({ runId })
 *
 *  2. RUNTIME SUSPENSION
 *     A tool can call `suspend(data)` mid-execution to pause and
 *     request additional user input.
 *
 *     Resume with:
 *       - agent.resumeStream(data, { runId })
 *
 *  IMPORTANT: Agent approval uses snapshots. You MUST configure a
 *  storage provider on your Mastra instance or you'll get
 *  "snapshot not found" errors.
 *
 *  In supervisor agents, approval requests bubble up through the
 *  delegation chain — so a supervisor can handle approvals for
 *  all its subagents.
 *
 *  EXERCISE
 *  --------
 *  Create a "Database Admin" agent with tools that require approval
 *  before executing destructive operations.
 * ============================================================
 */

import { Agent } from '@mastra/core/agent';
import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

// ─── Simulated database ─────────────────────────────────────
const database: Record<string, { name: string; email: string }> = {
  '1': { name: 'Alice', email: 'alice@example.com' },
  '2': { name: 'Bob', email: 'bob@example.com' },
  '3': { name: 'Charlie', email: 'charlie@example.com' },
}

// ─── TODO 1: Create a "read" tool (no approval needed) ──────
// This tool queries the database and returns a user record.
// It's a safe, read-only operation — no approval needed.

export const readUserTool = createTool({
  id: 'read-user',
  description: 'Look up a user by ID and return their name and email. Safe read-only operation.',
  inputSchema: z.object({
    userId: z.string().describe('The user ID to look up'),
  }),
  outputSchema: z.object({
    found: z.boolean(),
    user: z.object({
      name: z.string(),
      email: z.string(),
    }).optional(),
  }),
  execute: async ({ userId }) => {
    const user = database[userId];
    if (!user) return { found: false };
    return { found: true, user };
  },
})

// ─── TODO 2: Create a "delete" tool (REQUIRES approval) ─────
// This tool deletes a user from the database.
// Since it's destructive, set `requireApproval: true`.
//
// Hint:
//   createTool({
//     id: 'delete-user',
//     requireApproval: true,  // ← This pauses before execute runs
//     ...
//   })

export const deleteUserTool = createTool({
  id: 'delete-user',
  description: 'Delete a user from the database by ID. This is a DESTRUCTIVE operation that cannot be undone.',
  requireApproval: true,
  inputSchema: z.object({
    userId: z.string().describe('The user ID to delete'),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    deletedUser: z.object({
      name: z.string(),
      email: z.string(),
    }).optional(),
    message: z.string(),
  }),
  execute: async ({ userId }) => {
    const user = database[userId];
    if (!user) return { success: false, message: `User ${userId} not found` };
    const deleted = { ...user };
    delete database[userId];
    return { success: true, deletedUser: deleted, message: `User ${userId} (${deleted.name}) has been deleted` };
  },
})

// ─── TODO 3: Create the Database Admin agent ────────────────
// Register both tools. The agent should be able to read and delete users.

export const dbAdminAgent = new Agent({
  id: 'db-admin',
  name: 'Database Admin',
  instructions: 'You are a database administrator. You can read and delete users using the readUserTool and deleteUserTool tools respectively.',
  tools: { readUserTool, deleteUserTool },
  model: 'anthropic/claude-haiku-4-5',
})

// ─── TODO 4: Test approval flow ─────────────────────────────
// This is best tested in Mastra Studio (pnpm dev) where the UI
// shows approval dialogs automatically.
//
// For programmatic testing:
//   1. Call agent.stream('Delete user 2', { requireToolApproval: true })
//   2. The stream will pause when it hits the delete tool
//   3. Call agent.approveToolCall({ runId }) or agent.declineToolCall({ runId })
//   4. Call agent.resumeStream(data, { runId }) to continue
//
// Note: The full programmatic flow requires async coordination.
// Mastra Studio handles this for you with a nice UI.

export async function runTest() {


  // asked to delete user 1
  const result = await dbAdminAgent.stream('Delete user 1');

  for await (const chunk of result.fullStream) {
    // can i delete user 1?
   if(chunk.type === 'tool-call-approval') {
    setTimeout(async () => {
      // yes
      const approved = await dbAdminAgent.approveToolCall({
        runId: chunk.runId,
      });

      for await (const chunk of approved.textStream) {
        console.log(chunk);
      }
      
    }, 5000);
   }
  }

  

 

  // Quick test: read (no approval needed)
  // TODO: Call dbAdminAgent.generate('Show me user 1')
  // TODO: Print the response
}

// runTest()
// ─── TODO 5: Programmatic approval with stream() ────────────
// Full programmatic flow:
//
//   const stream = await dbAdminAgent.stream('Delete user 2');
//
//   for await (const chunk of stream.fullStream) {
//     if (chunk.type === 'tool-call-approval') {
//       console.log('Tool:', chunk.payload.toolName);
//       console.log('Args:', chunk.payload.args);
//
//       // Approve and continue
//       const approved = await dbAdminAgent.approveToolCall({
//         runId: stream.runId,
//       });
//       for await (const c of approved.textStream) {
//         process.stdout.write(c);
//       }
//
//       // OR decline:
//       // const declined = await dbAdminAgent.declineToolCall({
//       //   runId: stream.runId,
//       // });
//     }
//   }

// ─── TODO 6: Programmatic approval with generate() ──────────
// Non-streaming flow uses finishReason:
//
//   const output = await dbAdminAgent.generate('Delete user 2', {
//     requireToolApproval: true,
//   });
//
//   if (output.finishReason === 'suspended') {
//     console.log('Tool:', output.suspendPayload.toolName);
//
//     // Approve
//     const result = await dbAdminAgent.approveToolCallGenerate({
//       runId: output.runId,
//       toolCallId: output.suspendPayload.toolCallId,
//     });
//     console.log('Result after approval:', result.text);
//   }

// export async function runTest2() {
//   const result = await dbAdminAgent.generate('Delete user 1');
 
//   if(result.finishReason === 'suspended') {

//     const toolName = result.suspendPayload?.toolName;

//     console.log(`asking permission for ${toolName}`);

//     if(toolName && result.runId) {
//       const approved = await dbAdminAgent.approveToolCallGenerate({
//         runId: result.runId,
//       })
//       console.log(approved.text);
//     }
//   }
  
 
// }
// runTest2()

// ─── TODO 7: Runtime suspension with suspend() ──────────────
// Unlike pre-execution approval (pauses BEFORE execute),
// suspend() pauses DURING execution when extra input is needed.
//
// Example: A tool that needs city confirmation:
//
//   const weatherTool = createTool({
//     id: 'weather',
//     suspendSchema: z.object({ message: z.string() }),
//     resumeSchema: z.object({ city: z.string() }),
//     execute: async (input, context) => {
//       const { resumeData, suspend } = context?.agent ?? {};
//
//       // If no city and no resume data, suspend and ask
//       if (!input.city && !resumeData?.city) {
//         return suspend?.({ message: 'What city do you want weather for?' });
//       }
//
//       const city = resumeData?.city ?? input.city;
//       const res = await fetch(`https://wttr.in/${city}?format=3`);
//       return { weather: await res.text() };
//     },
//   });
//
// Resume the suspended tool:
//   const resumed = await agent.resumeStream(
//     { city: 'London' },       // data matching resumeSchema
//     { runId: stream.runId }   // the paused run
//   );

// ─── TODO 8: Auto-resume suspended tools ────────────────────
// Instead of manually resuming, enable auto-resume:
//
//   new Agent({
//     defaultOptions: { autoResumeSuspendedTools: true },
//     memory: new Memory(),  // required for auto-resume
//   })
//
// With auto-resume, the agent:
//   1. Detects suspended tools from message history
//   2. Extracts resumeData based on the tool's resumeSchema
//   3. Automatically resumes the tool on the next user message
//
// Requirements: memory config, same thread, resumeSchema defined.

// ─── TODO 9: Supervisor approval propagation ────────────────
// Approval requests bubble UP through delegation chains:
//
//   Supervisor → Subagent A → Subagent B (has requireApproval tool)
//   ↑ approval request surfaces HERE at the supervisor level
//
// Listen for 'tool-call-approval' chunks on the SUPERVISOR's stream:
//
//   const stream = await supervisor.stream('Find user 12345');
//   for await (const chunk of stream.fullStream) {
//     if (chunk.type === 'tool-call-approval') {
//       const resumed = await supervisor.approveToolCall({
//         runId: stream.runId,
//         toolCallId: chunk.payload.toolCallId,
//       });
//     }
//   }
