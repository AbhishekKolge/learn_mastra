/**
 * ============================================================
 *  MODULE 41: Sandbox
 * ============================================================
 *
 *  THEORY
 *  ------
 *  The filesystem lets agents manage files. The SANDBOX lets
 *  agents EXECUTE COMMANDS. Together, they give an agent the
 *  full power of a development environment.
 *
 *  WHAT THE SANDBOX PROVIDES:
 *    execute_command    → Run shell commands (ls, npm, git, etc.)
 *    get_process_output → Check output of background processes
 *    kill_process       → Stop background processes
 *
 *  SUPPORTED PROVIDERS:
 *    LocalSandbox   → executes on the local machine
 *    E2BSandbox     → isolated E2B cloud sandbox
 *    DaytonaSandbox → isolated Daytona cloud sandbox
 *    BlaxelSandbox  → isolated Blaxel cloud sandbox
 *
 *  LocalSandbox:
 *    import { LocalSandbox } from '@mastra/core/workspace'
 *    new LocalSandbox({ workingDirectory: './workspace' })
 *
 *  COMMAND EXECUTION:
 *    The agent calls execute_command with:
 *      command: string      — the shell command to run
 *      background?: boolean — run in background (returns PID)
 *      tail?: number        — limit output to last N lines
 *
 *    Returns: { stdout, stderr, exitCode }
 *
 *  BACKGROUND PROCESSES:
 *    For long-running commands (dev servers, watchers):
 *      1. Agent calls execute_command with background: true
 *      2. Returns immediately with a PID
 *      3. Use get_process_output(pid) to check output
 *      4. Use kill_process(pid) to stop it
 *
 *    Example flow:
 *      Agent: execute_command('npm run dev', { background: true })
 *      → { pid: 12345 }
 *      Agent: get_process_output(12345, { tail: 10 })
 *      → { stdout: '...', status: 'running' }
 *      Agent: kill_process(12345)
 *      → { stdout: '...' }
 *
 *  BACKGROUND PROCESS CALLBACKS:
 *    Listen for output in real-time via tool config:
 *
 *    tools: {
 *      [WORKSPACE_TOOLS.SANDBOX.EXECUTE_COMMAND]: {
 *        backgroundProcesses: {
 *          onStdout: (data, { pid }) => console.log(`[${pid}]`, data),
 *          onStderr: (data, { pid }) => console.error(`[${pid}]`, data),
 *          onExit: ({ pid, exitCode }) => console.log(`Exit: ${exitCode}`),
 *        },
 *      },
 *    }
 *
 *  ABORT SIGNAL:
 *    By default, background processes inherit the agent's abort
 *    signal and are killed when the agent disconnects.
 *
 *    To keep processes alive after agent shutdown:
 *      backgroundProcesses: { abortSignal: null }
 *
 *  OUTPUT TRUNCATION:
 *    Large outputs are automatically truncated:
 *      1. Line-based: last 200 lines (configurable via tail)
 *      2. Token-based: 2000 tokens max (configurable)
 *    ANSI escape codes are stripped automatically.
 *
 *  EXERCISE
 *  --------
 *  Create agents with sandbox capabilities and explore
 *  command execution and background processes.
 * ============================================================
 */

import { Agent } from '@mastra/core/agent';
import { Workspace, LocalFilesystem, LocalSandbox, WORKSPACE_TOOLS } from '@mastra/core/workspace';

// ─── TODO 1: Create a workspace with sandbox ────────────────
// new Workspace({
//   filesystem: new LocalFilesystem({ basePath: './sandbox-workspace' }),
//   sandbox: new LocalSandbox({ workingDirectory: './sandbox-workspace' }),
// })

const workspace = undefined as any; // ← replace

// ─── TODO 2: Create a dev agent ──────────────────────────────
// new Agent({
//   id: 'dev-agent',
//   instructions: 'You are a development assistant. Run commands when asked.',
//   model: 'anthropic/claude-sonnet-4-5',
//   workspace,
// })

export const devAgent = undefined as any; // ← replace

// ─── TODO 3: Test basic command execution ────────────────────
// Ask the agent to run simple commands:
//   'Run: echo "Hello from sandbox"'
//   'Run: ls -la'
//   'Run: node --version'

export async function testBasicCommands() {
  console.log('--- Basic Commands ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 4: Test file + command workflow ─────────────────────
// Ask the agent to:
//   1. Create a file (write_file)
//   2. Run a command that uses the file (execute_command)
//   This shows filesystem + sandbox working together.
//
// Example: 'Write a file test.sh with "echo Hello World" then run it with bash'

export async function testFileAndCommand() {
  console.log('--- File + Command Workflow ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 5: Test background processes ──────────────────────
// Ask the agent to start a long-running process:
//   'Start a background process: sleep 30 && echo done'
// Then check its output, and finally kill it.
//
// This tests the background: true, get_process_output, and
// kill_process tools.

export async function testBackgroundProcess() {
  console.log('--- Background Processes ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 6: Create workspace with process callbacks ────────
// Configure background process callbacks to see real-time output.
//
// new Workspace({
//   filesystem: new LocalFilesystem({ basePath: './sandbox-workspace' }),
//   sandbox: new LocalSandbox({ workingDirectory: './sandbox-workspace' }),
//   tools: {
//     [WORKSPACE_TOOLS.SANDBOX.EXECUTE_COMMAND]: {
//       backgroundProcesses: {
//         onStdout: (data, { pid }) => console.log(`[stdout:${pid}]`, data),
//         onStderr: (data, { pid }) => console.error(`[stderr:${pid}]`, data),
//         onExit: ({ pid, exitCode }) => console.log(`[exit:${pid}]`, exitCode),
//       },
//     },
//   },
// })

export async function testProcessCallbacks() {
  console.log('--- Process Callbacks ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 7: Sandbox-only workspace ─────────────────────────
// Create a workspace with only a sandbox (no filesystem).
// Agent can run commands but has no file tools.
//
// new Workspace({
//   sandbox: new LocalSandbox({ workingDirectory: './sandbox-workspace' }),
// })

export async function testSandboxOnly() {
  console.log('--- Sandbox Only ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── Run all tests ───────────────────────────────────────────
export async function runTest() {
  console.log('=== Sandbox ===\n');

  await testBasicCommands();
  console.log('\n');
  await testFileAndCommand();
  console.log('\n');
  await testBackgroundProcess();
  console.log('\n');
  await testProcessCallbacks();
  console.log('\n');
  await testSandboxOnly();
}
