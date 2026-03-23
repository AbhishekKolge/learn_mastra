/**
 * MODULE 42: Workspace Tool Configuration — SOLUTION
 */

import { Agent } from '@mastra/core/agent';
import { Workspace, LocalFilesystem, LocalSandbox, WORKSPACE_TOOLS } from '@mastra/core/workspace';

// ─── TODO 1: Safe workspace ─────────────────────────────────
const safeWorkspace = new Workspace({
  filesystem: new LocalFilesystem({ basePath: './tools-workspace' }),
  sandbox: new LocalSandbox({ workingDirectory: './tools-workspace' }),
  tools: {
    [WORKSPACE_TOOLS.FILESYSTEM.WRITE_FILE]: { requireApproval: true },
    [WORKSPACE_TOOLS.FILESYSTEM.DELETE]: { enabled: false },
    [WORKSPACE_TOOLS.SANDBOX.EXECUTE_COMMAND]: { requireApproval: true },
  },
});

// ─── TODO 2: Read-before-write workspace ─────────────────────
const rbwWorkspace = new Workspace({
  filesystem: new LocalFilesystem({ basePath: './tools-workspace' }),
  tools: {
    [WORKSPACE_TOOLS.FILESYSTEM.WRITE_FILE]: {
      requireReadBeforeWrite: true,
    },
  },
});

// ─── TODO 3: Renamed tools workspace ─────────────────────────
const renamedWorkspace = new Workspace({
  filesystem: new LocalFilesystem({ basePath: './tools-workspace' }),
  sandbox: new LocalSandbox({ workingDirectory: './tools-workspace' }),
  tools: {
    [WORKSPACE_TOOLS.FILESYSTEM.READ_FILE]: { name: 'view' },
    [WORKSPACE_TOOLS.FILESYSTEM.WRITE_FILE]: { name: 'edit' },
    [WORKSPACE_TOOLS.FILESYSTEM.GREP]: { name: 'search' },
    [WORKSPACE_TOOLS.SANDBOX.EXECUTE_COMMAND]: { name: 'run' },
  },
});

// ─── TODO 4: Test safe workspace ─────────────────────────────
export async function testSafeWorkspace() {
  console.log('--- Safe Workspace ---');
  await safeWorkspace.init();

  const agent = new Agent({
    id: 'safe-agent',
    instructions: 'You manage files and run commands. Report tool failures clearly.',
    model: 'anthropic/claude-sonnet-4-5',
    workspace: safeWorkspace,
  });

  // a) Read — no approval needed
  let r = await agent.generate('List all files in the workspace');
  console.log('Read (ok):', r.text.slice(0, 80));

  // b) Write — requires approval (will trigger approval flow)
  r = await agent.generate('Write a file test.txt with "hello"');
  console.log('Write (approval):', r.text.slice(0, 100));

  // c) Delete — disabled
  r = await agent.generate('Delete test.txt');
  console.log('Delete (disabled):', r.text.slice(0, 100));

  // d) Command — requires approval
  r = await agent.generate('Run: echo "test"');
  console.log('Command (approval):', r.text.slice(0, 100));
}

// ─── TODO 5: Test read-before-write ──────────────────────────
export async function testReadBeforeWrite() {
  console.log('--- Read Before Write ---');
  await rbwWorkspace.init();

  const agent = new Agent({
    id: 'rbw-agent',
    instructions: `You manage files. When updating existing files, always read them first.
      Report errors clearly if a write fails.`,
    model: 'anthropic/claude-sonnet-4-5',
    workspace: rbwWorkspace,
  });

  // a) New file — should work (doesn't exist yet)
  let r = await agent.generate('Write a new file /rbw-test.txt with content "version 1"');
  console.log('New file write:', r.text.slice(0, 80));

  // b) Overwrite without read — should fail
  r = await agent.generate('Overwrite /rbw-test.txt with "version 2" (do NOT read it first)');
  console.log('Overwrite (no read):', r.text.slice(0, 100));

  // c) Read then overwrite — should work
  r = await agent.generate('Read /rbw-test.txt, then update it to "version 2"');
  console.log('Read then write:', r.text.slice(0, 80));
}

// ─── TODO 6: Test renamed tools ──────────────────────────────
export async function testRenamedTools() {
  console.log('--- Renamed Tools ---');
  await renamedWorkspace.init();

  const agent = new Agent({
    id: 'renamed-agent',
    instructions: `You have tools named: view, edit, search, run.
      Use 'view' to read files, 'edit' to write, 'search' to grep, 'run' to execute commands.`,
    model: 'anthropic/claude-sonnet-4-5',
    workspace: renamedWorkspace,
  });

  const r = await agent.generate('View the contents of the workspace, then run: echo "tools renamed"');
  console.log('Response:', r.text.slice(0, 120));

  // Check which tool names were used
  const toolNames = r.steps?.flatMap(s => s.toolCalls || []).map(tc => tc.toolName);
  console.log('Tool names used:', toolNames);
}

// ─── TODO 7: Test maxOutputTokens ────────────────────────────
export async function testOutputTruncation() {
  console.log('--- Output Truncation ---');

  const truncatedWs = new Workspace({
    sandbox: new LocalSandbox({ workingDirectory: './tools-workspace' }),
    tools: {
      [WORKSPACE_TOOLS.SANDBOX.EXECUTE_COMMAND]: {
        maxOutputTokens: 100,
      },
    },
  });
  await truncatedWs.init();

  const agent = new Agent({
    id: 'truncated-agent',
    instructions: 'Run commands and report the output.',
    model: 'anthropic/claude-sonnet-4-5',
    workspace: truncatedWs,
  });

  // Generate lots of output
  const r = await agent.generate(
    'Run: for i in $(seq 1 100); do echo "Line $i: This is a test line with some content"; done'
  );
  console.log('Response:', r.text.slice(0, 150));
  console.log('(Output should be truncated to ~100 tokens)');
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
