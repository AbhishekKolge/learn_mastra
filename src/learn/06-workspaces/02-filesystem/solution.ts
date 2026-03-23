/**
 * MODULE 40: Filesystem — SOLUTION
 */

import { Agent } from '@mastra/core/agent';
import { Workspace, LocalFilesystem } from '@mastra/core/workspace';

// ─── TODO 1 & 2: Workspace and agent ────────────────────────
const workspace = new Workspace({
  filesystem: new LocalFilesystem({ basePath: './fs-workspace' }),
});

export const fsAgent = new Agent({
  id: 'fs-agent',
  name: 'File Agent',
  instructions: `
    You are a file management assistant.
    Use workspace tools to create, read, list, search, copy, move, and delete files.
    Always confirm what you did after each operation.
  `,
  model: 'anthropic/claude-sonnet-4-5',
  workspace,
});

// ─── TODO 3: Test file operations via agent ──────────────────
export async function testFileOperations() {
  console.log('--- File Operations ---');
  await workspace.init();

  // a) Create directories
  let r = await fsAgent.generate('Create directories: /docs and /src');
  console.log('Create dirs:', r.text.slice(0, 80));

  // b) Write files
  r = await fsAgent.generate('Write a file /docs/readme.md with content "# My Project\\nA cool project."');
  console.log('Write readme:', r.text.slice(0, 80));

  r = await fsAgent.generate('Write a file /src/index.ts with content "console.log(\'hello\')"');
  console.log('Write index:', r.text.slice(0, 80));

  // c) List files
  r = await fsAgent.generate('List all files in the workspace recursively');
  console.log('List files:', r.text.slice(0, 120));

  // d) Read a file
  r = await fsAgent.generate('Read /docs/readme.md');
  console.log('Read file:', r.text.slice(0, 80));

  // e) Grep
  r = await fsAgent.generate('Search for "hello" across all files');
  console.log('Grep:', r.text.slice(0, 80));

  // f) Copy
  r = await fsAgent.generate('Copy /docs/readme.md to /docs/readme-backup.md');
  console.log('Copy:', r.text.slice(0, 80));

  // g) Delete
  r = await fsAgent.generate('Delete /docs/readme-backup.md');
  console.log('Delete:', r.text.slice(0, 80));
}

// ─── TODO 4: Test containment ────────────────────────────────
export async function testContainment() {
  console.log('--- Containment ---');

  const containedWs = new Workspace({
    filesystem: new LocalFilesystem({ basePath: './fs-workspace' }),
  });
  const agent = new Agent({
    id: 'contained-agent',
    instructions: 'You read files when asked.',
    model: 'anthropic/claude-sonnet-4-5',
    workspace: containedWs,
  });

  // This should work
  const r1 = await agent.generate('List files in the workspace');
  console.log('Inside basePath:', r1.text.slice(0, 80));

  // This should fail — outside basePath
  const r2 = await agent.generate('Read the file /etc/hostname');
  console.log('Outside basePath:', r2.text.slice(0, 100));
  console.log('(Should show containment error or refusal)');
}

// ─── TODO 5: Test allowedPaths ──────────────────────────────
export async function testAllowedPaths() {
  console.log('--- Allowed Paths ---');

  const ws = new Workspace({
    filesystem: new LocalFilesystem({
      basePath: './fs-workspace',
      allowedPaths: ['./exercise-workspace'],
    }),
  });
  const agent = new Agent({
    id: 'allowed-agent',
    instructions: 'You read files when asked.',
    model: 'anthropic/claude-sonnet-4-5',
    workspace: ws,
  });

  const r = await agent.generate('List files in ./exercise-workspace');
  console.log('Allowed path access:', r.text.slice(0, 100));
}

// ─── TODO 6: Test read-only mode ─────────────────────────────
export async function testReadOnly() {
  console.log('--- Read-Only Mode ---');

  const roWs = new Workspace({
    filesystem: new LocalFilesystem({
      basePath: './fs-workspace',
      readOnly: true,
    }),
  });
  const agent = new Agent({
    id: 'readonly-agent',
    instructions: 'You are a read-only assistant. Report if you cannot perform an action.',
    model: 'anthropic/claude-sonnet-4-5',
    workspace: roWs,
  });

  // Reading should work
  const r1 = await agent.generate('List all files');
  console.log('Read (ok):', r1.text.slice(0, 80));

  // Writing should fail
  const r2 = await agent.generate('Create a file called test.txt with "hello"');
  console.log('Write (blocked):', r2.text.slice(0, 100));
}

// ─── TODO 7: Programmatic filesystem access ──────────────────
export async function testProgrammaticAccess() {
  console.log('--- Programmatic Access ---');

  const fs = workspace.filesystem!;

  await fs.writeFile('/programmatic.txt', 'Hello from code!');
  console.log('Wrote /programmatic.txt');

  const content = await fs.readFile('/programmatic.txt');
  console.log('Read:', content);

  const stat = await fs.stat('/programmatic.txt');
  console.log('Stat:', JSON.stringify(stat));

  const files = await fs.listDirectory('/');
  console.log('Files:', files.map((f: any) => f.name || f.path).join(', '));

  await fs.deleteFile('/programmatic.txt');
  console.log('Deleted /programmatic.txt');
}

// ─── Run all tests ───────────────────────────────────────────
export async function runTest() {
  console.log('=== Filesystem ===\n');

  await testFileOperations();
  console.log('\n');
  await testContainment();
  console.log('\n');
  await testAllowedPaths();
  console.log('\n');
  await testReadOnly();
  console.log('\n');
  await testProgrammaticAccess();
}
