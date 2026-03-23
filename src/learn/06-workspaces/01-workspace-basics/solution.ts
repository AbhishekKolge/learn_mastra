/**
 * MODULE 39: Workspace Basics — SOLUTION
 */

import { Agent } from '@mastra/core/agent';
import { Mastra } from '@mastra/core/mastra';
import { Workspace, LocalFilesystem, LocalSandbox } from '@mastra/core/workspace';

// ─── TODO 1: Create a basic workspace ────────────────────────
const workspace = new Workspace({
  filesystem: new LocalFilesystem({ basePath: './exercise-workspace' }),
  sandbox: new LocalSandbox({ workingDirectory: './exercise-workspace' }),
});

// ─── TODO 2: Create an agent with the workspace ─────────────
export const fileAgent = new Agent({
  id: 'file-agent',
  name: 'File Agent',
  instructions: `
    You are a helpful file management assistant.
    Use workspace tools to manage files and run commands.
    When listing files, show paths and sizes.
    When creating files, confirm the path and content.
  `,
  model: 'anthropic/claude-sonnet-4-5',
  workspace,
});

// ─── TODO 3: Test the agent lists files ──────────────────────
export async function testListFiles() {
  console.log('--- List Files ---');
  await workspace.init();
  const response = await fileAgent.generate('List all files in the workspace');
  console.log('Response:', response.text);
  console.log('Tools used:', response.steps?.flatMap(s => s.toolCalls || []).map(tc => tc.toolName));
}

// ─── TODO 4: Test the agent creates a file ──────────────────
export async function testCreateFile() {
  console.log('--- Create File ---');
  const response = await fileAgent.generate(
    'Create a file called hello.txt with the content "Hello from workspace!"'
  );
  console.log('Response:', response.text);
}

// ─── TODO 5: Test the agent reads a file ─────────────────────
export async function testReadFile() {
  console.log('--- Read File ---');
  const response = await fileAgent.generate('Read the file hello.txt and show me its contents');
  console.log('Response:', response.text);
}

// ─── TODO 6: Test the agent runs a command ───────────────────
export async function testRunCommand() {
  console.log('--- Run Command ---');
  const response = await fileAgent.generate('Run the command: echo "Hello from sandbox"');
  console.log('Response:', response.text);
}

// ─── TODO 7: Create a filesystem-only workspace ──────────────
export async function testFilesystemOnly() {
  console.log('--- Filesystem Only ---');

  const readOnlyWorkspace = new Workspace({
    filesystem: new LocalFilesystem({
      basePath: './exercise-workspace',
      readOnly: true,
    }),
  });

  const readOnlyAgent = new Agent({
    id: 'readonly-agent',
    name: 'Read-Only Agent',
    instructions: 'You can only read files. You cannot write, delete, or run commands.',
    model: 'anthropic/claude-sonnet-4-5',
    workspace: readOnlyWorkspace,
  });

  // This should work — reading
  const readResponse = await readOnlyAgent.generate('Read hello.txt');
  console.log('Read response:', readResponse.text);

  // This should fail or not have the tool — writing
  const writeResponse = await readOnlyAgent.generate('Create a file called test.txt with content "test"');
  console.log('Write response:', writeResponse.text);
  console.log('(Write should fail or be unavailable in read-only mode)');
}

// ─── TODO 8: Global workspace on Mastra ──────────────────────
export async function testGlobalWorkspace() {
  console.log('--- Global Workspace ---');

  const agent1 = new Agent({
    id: 'agent-one',
    name: 'Agent One',
    instructions: 'You manage files.',
    model: 'anthropic/claude-sonnet-4-5',
  });

  const agent2 = new Agent({
    id: 'agent-two',
    name: 'Agent Two',
    instructions: 'You run commands.',
    model: 'anthropic/claude-sonnet-4-5',
  });

  const mastra = new Mastra({
    workspace,
    agents: { agentOne: agent1, agentTwo: agent2 },
  });

  // Both agents inherit the global workspace
  const a1 = mastra.getAgent('agentOne');
  const a2 = mastra.getAgent('agentTwo');

  const r1 = await a1.generate('List files in the workspace');
  console.log('Agent One:', r1.text.slice(0, 100));

  const r2 = await a2.generate('Run: echo "from agent two"');
  console.log('Agent Two:', r2.text.slice(0, 100));
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
