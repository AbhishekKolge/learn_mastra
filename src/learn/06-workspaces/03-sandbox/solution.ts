/**
 * MODULE 41: Sandbox — SOLUTION
 */

import { Agent } from '@mastra/core/agent';
import { Workspace, LocalFilesystem, LocalSandbox, WORKSPACE_TOOLS } from '@mastra/core/workspace';

// ─── TODO 1 & 2: Workspace and agent ────────────────────────
const workspace = new Workspace({
  filesystem: new LocalFilesystem({ basePath: './sandbox-workspace' }),
  sandbox: new LocalSandbox({ workingDirectory: './sandbox-workspace' }),
});

export const devAgent = new Agent({
  id: 'dev-agent',
  name: 'Dev Agent',
  instructions: `
    You are a development assistant with access to a workspace.
    You can manage files and execute shell commands.
    Always report command output including exit codes.
  `,
  model: 'anthropic/claude-sonnet-4-5',
  workspace,
});

// ─── TODO 3: Test basic command execution ────────────────────
export async function testBasicCommands() {
  console.log('--- Basic Commands ---');
  await workspace.init();

  const commands = [
    'Run: echo "Hello from sandbox"',
    'Run: ls -la',
    'Run: node --version',
  ];

  for (const cmd of commands) {
    const r = await devAgent.generate(cmd);
    console.log(`${cmd}:`);
    console.log(`  ${r.text.slice(0, 100)}`);
  }
}

// ─── TODO 4: Test file + command workflow ─────────────────────
export async function testFileAndCommand() {
  console.log('--- File + Command Workflow ---');

  // Write a script file, then execute it
  let r = await devAgent.generate(
    'Write a file called greet.sh with this content: #!/bin/bash\necho "Hello from script!"'
  );
  console.log('Write:', r.text.slice(0, 80));

  r = await devAgent.generate('Run: bash greet.sh');
  console.log('Execute:', r.text.slice(0, 80));

  // Write a Node.js file and run it
  r = await devAgent.generate(
    'Write a file called hello.js with: console.log("Sum:", 2 + 3)'
  );
  console.log('Write JS:', r.text.slice(0, 80));

  r = await devAgent.generate('Run: node hello.js');
  console.log('Run JS:', r.text.slice(0, 80));
}

// ─── TODO 5: Test background processes ──────────────────────
export async function testBackgroundProcess() {
  console.log('--- Background Processes ---');

  // Start a background process
  let r = await devAgent.generate(
    'Start this as a background process: for i in 1 2 3; do echo "tick $i"; sleep 1; done'
  );
  console.log('Start bg:', r.text.slice(0, 100));

  // Check output
  r = await devAgent.generate('Check the output of the background process you just started');
  console.log('Check output:', r.text.slice(0, 100));

  // Kill it
  r = await devAgent.generate('Kill the background process');
  console.log('Kill:', r.text.slice(0, 80));
}

// ─── TODO 6: Create workspace with process callbacks ────────
export async function testProcessCallbacks() {
  console.log('--- Process Callbacks ---');

  const callbackWs = new Workspace({
    filesystem: new LocalFilesystem({ basePath: './sandbox-workspace' }),
    sandbox: new LocalSandbox({ workingDirectory: './sandbox-workspace' }),
    tools: {
      [WORKSPACE_TOOLS.SANDBOX.EXECUTE_COMMAND]: {
        backgroundProcesses: {
          onStdout: (data: string, { pid }: { pid: number }) => {
            console.log(`  [stdout:${pid}] ${data.trim()}`);
          },
          onStderr: (data: string, { pid }: { pid: number }) => {
            console.error(`  [stderr:${pid}] ${data.trim()}`);
          },
          onExit: ({ pid, exitCode }: { pid: number; exitCode: number }) => {
            console.log(`  [exit:${pid}] code=${exitCode}`);
          },
        },
      },
    },
  });

  const agent = new Agent({
    id: 'callback-agent',
    instructions: 'Run commands when asked.',
    model: 'anthropic/claude-sonnet-4-5',
    workspace: callbackWs,
  });

  await callbackWs.init();

  // The callbacks will fire as output arrives
  const r = await agent.generate(
    'Run this as a background process: for i in 1 2 3; do echo "Line $i"; sleep 0.5; done'
  );
  console.log('Agent response:', r.text.slice(0, 80));

  // Wait a bit for background output
  await new Promise(resolve => setTimeout(resolve, 3000));
}

// ─── TODO 7: Sandbox-only workspace ─────────────────────────
export async function testSandboxOnly() {
  console.log('--- Sandbox Only ---');

  const sandboxOnly = new Workspace({
    sandbox: new LocalSandbox({ workingDirectory: './sandbox-workspace' }),
  });

  const agent = new Agent({
    id: 'sandbox-only-agent',
    instructions: 'You can only run commands. You have no file management tools.',
    model: 'anthropic/claude-sonnet-4-5',
    workspace: sandboxOnly,
  });

  // Command should work
  const r1 = await agent.generate('Run: echo "I can run commands"');
  console.log('Command (ok):', r1.text.slice(0, 80));

  // File operation should fail (no file tools)
  const r2 = await agent.generate('List all files in the workspace');
  console.log('File op (no tools):', r2.text.slice(0, 100));
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
