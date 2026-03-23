/**
 * ============================================================
 *  MODULE 42: Workspace Tool Configuration
 * ============================================================
 *
 *  THEORY
 *  ------
 *  By default, workspace tools are all enabled with no
 *  restrictions. But in production, you want fine-grained
 *  control over what agents can do.
 *
 *  WORKSPACE_TOOLS CONSTANTS:
 *    import { WORKSPACE_TOOLS } from '@mastra/core/workspace'
 *
 *    WORKSPACE_TOOLS.FILESYSTEM.READ_FILE
 *    WORKSPACE_TOOLS.FILESYSTEM.WRITE_FILE
 *    WORKSPACE_TOOLS.FILESYSTEM.EDIT_FILE
 *    WORKSPACE_TOOLS.FILESYSTEM.LIST_FILES
 *    WORKSPACE_TOOLS.FILESYSTEM.LIST_DIRECTORY
 *    WORKSPACE_TOOLS.FILESYSTEM.DELETE
 *    WORKSPACE_TOOLS.FILESYSTEM.STAT
 *    WORKSPACE_TOOLS.FILESYSTEM.COPY
 *    WORKSPACE_TOOLS.FILESYSTEM.MOVE
 *    WORKSPACE_TOOLS.FILESYSTEM.GREP
 *    WORKSPACE_TOOLS.FILESYSTEM.MKDIR
 *    WORKSPACE_TOOLS.SANDBOX.EXECUTE_COMMAND
 *    WORKSPACE_TOOLS.SANDBOX.GET_PROCESS_OUTPUT
 *    WORKSPACE_TOOLS.SANDBOX.KILL_PROCESS
 *
 *  GLOBAL DEFAULTS:
 *    tools: {
 *      enabled: true,          // all tools enabled by default
 *      requireApproval: false, // no approval needed
 *    }
 *
 *  PER-TOOL OVERRIDES:
 *    tools: {
 *      [WORKSPACE_TOOLS.FILESYSTEM.WRITE_FILE]: {
 *        requireApproval: true,          // user must approve writes
 *        requireReadBeforeWrite: true,   // must read before overwriting
 *      },
 *      [WORKSPACE_TOOLS.FILESYSTEM.DELETE]: {
 *        enabled: false,  // disable file deletion entirely
 *      },
 *      [WORKSPACE_TOOLS.SANDBOX.EXECUTE_COMMAND]: {
 *        requireApproval: true,  // approve commands before execution
 *      },
 *    }
 *
 *  TOOL OPTIONS:
 *    enabled                → boolean, is the tool available?
 *    requireApproval        → boolean, needs user approval?
 *    requireReadBeforeWrite → boolean, must read file before write?
 *    name                   → string, custom tool name
 *    maxOutputTokens        → number, max output size (default: 2000)
 *
 *  TOOL NAME REMAPPING:
 *    Rename tools to match your agent's conventions:
 *
 *    tools: {
 *      [WORKSPACE_TOOLS.FILESYSTEM.READ_FILE]: { name: 'view' },
 *      [WORKSPACE_TOOLS.FILESYSTEM.GREP]: { name: 'search_content' },
 *    }
 *
 *    Names must be unique — duplicates throw an error.
 *
 *  requireReadBeforeWrite:
 *    Prevents overwriting files the agent hasn't seen.
 *    Two safety layers:
 *      1. Tool layer: checks if file was read since last modification
 *      2. Filesystem layer: compares modification time (expectedMtime)
 *
 *    New files can be written without reading (they don't exist yet).
 *    Externally modified files require re-reading.
 *
 *  maxOutputTokens:
 *    Large command output is truncated to avoid overflowing
 *    the LLM context. Default: 2000 tokens.
 *    ANSI escape codes are stripped automatically.
 *
 *  EXERCISE
 *  --------
 *  Configure workspace tools with different safety levels
 *  and explore approval, read-before-write, and remapping.
 * ============================================================
 */

import { Agent } from '@mastra/core/agent';
import { Workspace, LocalFilesystem, LocalSandbox, WORKSPACE_TOOLS } from '@mastra/core/workspace';

// ─── TODO 1: Safe workspace (approval on writes/commands) ────
// Create a workspace where:
//   - writes require approval
//   - deletes are disabled
//   - commands require approval
//   - reads are unrestricted
//
// new Workspace({
//   filesystem: new LocalFilesystem({ basePath: './tools-workspace' }),
//   sandbox: new LocalSandbox({ workingDirectory: './tools-workspace' }),
//   tools: {
//     [WORKSPACE_TOOLS.FILESYSTEM.WRITE_FILE]: { requireApproval: true },
//     [WORKSPACE_TOOLS.FILESYSTEM.DELETE]: { enabled: false },
//     [WORKSPACE_TOOLS.SANDBOX.EXECUTE_COMMAND]: { requireApproval: true },
//   },
// })

const safeWorkspace = undefined as any; // ← replace

// ─── TODO 2: Read-before-write workspace ─────────────────────
// Requires reading a file before overwriting it.
//
// tools: {
//   [WORKSPACE_TOOLS.FILESYSTEM.WRITE_FILE]: {
//     requireReadBeforeWrite: true,
//   },
// }

const rbwWorkspace = undefined as any; // ← replace

// ─── TODO 3: Renamed tools workspace ─────────────────────────
// Rename tools to simpler names:
//   read_file → 'view'
//   write_file → 'edit'
//   grep → 'search'
//   execute_command → 'run'
//
// tools: {
//   [WORKSPACE_TOOLS.FILESYSTEM.READ_FILE]: { name: 'view' },
//   [WORKSPACE_TOOLS.FILESYSTEM.WRITE_FILE]: { name: 'edit' },
//   [WORKSPACE_TOOLS.FILESYSTEM.GREP]: { name: 'search' },
//   [WORKSPACE_TOOLS.SANDBOX.EXECUTE_COMMAND]: { name: 'run' },
// }

const renamedWorkspace = undefined as any; // ← replace

// ─── TODO 4: Test safe workspace ─────────────────────────────
// Create an agent with safeWorkspace.
// Ask it to:
//   a) Read a file (should work, no approval)
//   b) Write a file (should require approval)
//   c) Delete a file (should fail — disabled)
//   d) Run a command (should require approval)

export async function testSafeWorkspace() {
  console.log('--- Safe Workspace ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 5: Test read-before-write ──────────────────────────
// Create an agent with rbwWorkspace.
// Ask it to:
//   a) Write a NEW file (should work — new files don't need read)
//   b) Overwrite the file WITHOUT reading (should fail)
//   c) Read the file, then overwrite (should work)

export async function testReadBeforeWrite() {
  console.log('--- Read Before Write ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 6: Test renamed tools ──────────────────────────────
// Create an agent with renamedWorkspace.
// The agent should see 'view', 'edit', 'search', 'run'
// instead of the default workspace tool names.

export async function testRenamedTools() {
  console.log('--- Renamed Tools ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 7: Test maxOutputTokens ────────────────────────────
// Create a workspace with a low maxOutputTokens on execute_command.
// Run a command that produces lots of output.
// Verify the output is truncated.
//
// tools: {
//   [WORKSPACE_TOOLS.SANDBOX.EXECUTE_COMMAND]: {
//     maxOutputTokens: 100,
//   },
// }

export async function testOutputTruncation() {
  console.log('--- Output Truncation ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── Run all tests ───────────────────────────────────────────
export async function runTest() {
  console.log('=== Workspace Tools ===\n');

  await testSafeWorkspace();
  console.log('\n');
  await testReadBeforeWrite();
  console.log('\n');
  await testRenamedTools();
  console.log('\n');
  await testOutputTruncation();
}
