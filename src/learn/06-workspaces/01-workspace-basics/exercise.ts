/**
 * ============================================================
 *  MODULE 39: Workspace Basics
 * ============================================================
 *
 *  THEORY
 *  ------
 *  Agents are smart, but they live in a bubble — they can think
 *  and use tools, but they don't have a persistent ENVIRONMENT.
 *  They can't read files, run commands, or store results between
 *  conversations.
 *
 *  A WORKSPACE gives agents a persistent environment:
 *    - Filesystem: read/write/manage files
 *    - Sandbox: execute shell commands
 *    - Search: find content across indexed files
 *    - Skills: reusable instruction sets
 *
 *  Think of it like giving an agent a computer to work on,
 *  not just a chat window.
 *
 *  CREATING A WORKSPACE:
 *    import { Workspace, LocalFilesystem, LocalSandbox } from '@mastra/core/workspace'
 *
 *    const workspace = new Workspace({
 *      filesystem: new LocalFilesystem({ basePath: './workspace' }),
 *      sandbox: new LocalSandbox({ workingDirectory: './workspace' }),
 *    })
 *
 *  WHAT EACH PIECE DOES:
 *    filesystem → gives agent file tools (read, write, list, delete, grep)
 *    sandbox    → gives agent command execution (execute_command)
 *    Both are optional — use what you need.
 *
 *  ASSIGNING TO AN AGENT:
 *    When you assign a workspace, the agent automatically gets
 *    the relevant tools. No manual tool registration needed.
 *
 *    const agent = new Agent({
 *      id: 'dev-agent',
 *      model: 'anthropic/claude-sonnet-4-5',
 *      workspace,  // ← agent now has file + command tools
 *    })
 *
 *  TWO LEVELS:
 *
 *  1. GLOBAL workspace (on Mastra instance):
 *     All agents inherit this workspace unless they override it.
 *
 *     const mastra = new Mastra({
 *       workspace,  // ← every agent gets this
 *       agents: { myAgent },
 *     })
 *
 *  2. AGENT-LEVEL workspace:
 *     Overrides the global workspace for a specific agent.
 *
 *     const agent = new Agent({
 *       id: 'special-agent',
 *       workspace: differentWorkspace,  // ← this agent only
 *     })
 *
 *  INITIALIZATION:
 *    workspace.init() is optional in most cases — providers
 *    initialize on first operation. Call it manually when:
 *      - Using outside Mastra (standalone scripts, tests)
 *      - Need to pre-create directories before first use
 *      - Using auto-indexing for search
 *
 *    await workspace.init()
 *
 *  CONFIGURATION PATTERNS:
 *    filesystem + sandbox → full-featured local dev
 *    filesystem only     → file access, no commands
 *    sandbox only        → commands, no file tools
 *    mounts + sandbox    → cloud storage in sandbox
 *
 *  EXERCISE
 *  --------
 *  Create workspaces with different configurations and
 *  assign them to agents.
 * ============================================================
 */

import { Agent } from '@mastra/core/agent';
import { Mastra } from '@mastra/core/mastra';
import { Workspace, LocalFilesystem, LocalSandbox } from '@mastra/core/workspace';

// ─── TODO 1: Create a basic workspace ────────────────────────
// Create a workspace with both filesystem and sandbox.
// Use basePath: './exercise-workspace' for both.
//
// const workspace = new Workspace({
//   filesystem: new LocalFilesystem({ basePath: './exercise-workspace' }),
//   sandbox: new LocalSandbox({ workingDirectory: './exercise-workspace' }),
// })

const workspace = undefined as any; // ← replace

// ─── TODO 2: Create an agent with the workspace ─────────────
// The agent should be a helpful file management assistant.
// Once workspace is assigned, it automatically gets file and
// command tools — no need to register them manually.
//
// const fileAgent = new Agent({
//   id: 'file-agent',
//   name: 'File Agent',
//   instructions: 'You are a helpful file management assistant. Use workspace tools to manage files and run commands.',
//   model: 'anthropic/claude-sonnet-4-5',
//   workspace,
// })

export const fileAgent = undefined as any; // ← replace

// ─── TODO 3: Test the agent lists files ──────────────────────
// Ask the agent to list files in the workspace.
// The agent will use the list_directory tool automatically.
//
// await workspace.init()  // pre-create the directory
// const response = await fileAgent.generate('List all files in the workspace')
// console.log(response.text)

export async function testListFiles() {
  console.log('--- List Files ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 4: Test the agent creates a file ──────────────────
// Ask the agent to create a file with specific content.
// The agent will use the write_file tool.
//
// const response = await fileAgent.generate(
//   'Create a file called hello.txt with the content "Hello from workspace!"'
// )

export async function testCreateFile() {
  console.log('--- Create File ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 5: Test the agent reads a file ─────────────────────
// Ask the agent to read the file it just created.

export async function testReadFile() {
  console.log('--- Read File ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 6: Test the agent runs a command ───────────────────
// Ask the agent to run a shell command.
//
// const response = await fileAgent.generate('Run the command: echo "Hello from sandbox"')

export async function testRunCommand() {
  console.log('--- Run Command ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 7: Create a filesystem-only workspace ──────────────
// No sandbox — agent can only manage files, not run commands.
//
// const readOnlyWorkspace = new Workspace({
//   filesystem: new LocalFilesystem({
//     basePath: './exercise-workspace',
//     readOnly: true,
//   }),
// })
//
// Assign to an agent and verify it can read but not write.

export async function testFilesystemOnly() {
  console.log('--- Filesystem Only ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 8: Global workspace on Mastra ──────────────────────
// Create a Mastra instance with a global workspace.
// All agents inherit it.
//
// const mastra = new Mastra({
//   workspace,
//   agents: { fileAgent, anotherAgent },
// })
//
// Both agents now have workspace tools.

export async function testGlobalWorkspace() {
  console.log('--- Global Workspace ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── Run all tests ───────────────────────────────────────────
export async function runTest() {
  console.log('=== Workspace Basics ===\n');

  await testListFiles();
  console.log('\n');
  await testCreateFile();
  console.log('\n');
  await testReadFile();
  console.log('\n');
  await testRunCommand();
  console.log('\n');
  await testFilesystemOnly();
  console.log('\n');
  await testGlobalWorkspace();
}
