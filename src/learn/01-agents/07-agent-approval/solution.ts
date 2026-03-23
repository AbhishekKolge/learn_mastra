/**
 * MODULE 7: Agent Approval — SOLUTION
 */

import { Agent } from '@mastra/core/agent';
import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

// ─── Simulated database ─────────────────────────────────────
const database: Record<string, { name: string; email: string }> = {
  '1': { name: 'Alice', email: 'alice@example.com' },
  '2': { name: 'Bob', email: 'bob@example.com' },
  '3': { name: 'Charlie', email: 'charlie@example.com' },
};

// ─── TODO 1: Read tool (safe, no approval) ──────────────────
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
});

// ─── TODO 2: Delete tool (requires approval) ────────────────
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
    if (!user) {
      return { success: false, message: `User ${userId} not found` };
    }
    const deleted = { ...user };
    delete database[userId];
    return {
      success: true,
      deletedUser: deleted,
      message: `User ${userId} (${deleted.name}) has been deleted`,
    };
  },
});

// ─── TODO 3: Database Admin agent ───────────────────────────
export const dbAdminAgent = new Agent({
  id: 'db-admin',
  name: 'Database Admin',
  instructions: `
    You are a database administrator. You can read and delete user records.
    - For read operations, use the read-user tool
    - For delete operations, use the delete-user tool
    - Always confirm what you're about to do before deleting
    - Report the results clearly
  `,
  model: 'anthropic/claude-sonnet-4-5',
  tools: { readUserTool, deleteUserTool },
});

// ─── TODO 4: Test ───────────────────────────────────────────
export async function runTest() {
  console.log('=== Approval Test ===\n');
  console.log('Best tested in Mastra Studio (pnpm dev → http://localhost:4111)\n');

  // Quick test: read (no approval needed)
  console.log('--- Read test (no approval) ---');
  const readResponse = await dbAdminAgent.generate('Show me user 1');
  console.log('Response:', readResponse.text);
  console.log('Tool calls:', readResponse.toolCalls?.map(tc => tc.toolName));

  console.log('\n--- Delete test (needs approval in Studio) ---');
  console.log('Try "Delete user 2" in Mastra Studio to see the approval flow!');
}
