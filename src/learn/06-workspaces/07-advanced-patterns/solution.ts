/**
 * MODULE 45: Advanced Workspace Patterns — SOLUTION
 */

import { Agent } from '@mastra/core/agent';
import { Mastra } from '@mastra/core/mastra';
import { Workspace, LocalFilesystem, LocalSandbox, WORKSPACE_TOOLS } from '@mastra/core/workspace';

// ─── TODO 1: Dev agent workspace ─────────────────────────────
const devWorkspace = new Workspace({
  filesystem: new LocalFilesystem({ basePath: './multi-workspace' }),
  sandbox: new LocalSandbox({ workingDirectory: './multi-workspace' }),
  bm25: true,
  tools: {
    [WORKSPACE_TOOLS.FILESYSTEM.WRITE_FILE]: {
      requireApproval: true,
      requireReadBeforeWrite: true,
    },
    [WORKSPACE_TOOLS.FILESYSTEM.DELETE]: { enabled: false },
    [WORKSPACE_TOOLS.SANDBOX.EXECUTE_COMMAND]: { requireApproval: true },
  },
});

// ─── TODO 2: Research agent workspace ────────────────────────
const researchWorkspace = new Workspace({
  filesystem: new LocalFilesystem({
    basePath: './multi-workspace',
    readOnly: true,
  }),
  bm25: true,
});

// ─── TODO 3: Ops agent workspace ─────────────────────────────
const opsWorkspace = new Workspace({
  sandbox: new LocalSandbox({ workingDirectory: './multi-workspace' }),
  tools: {
    [WORKSPACE_TOOLS.SANDBOX.EXECUTE_COMMAND]: {
      maxOutputTokens: 3000,
    },
  },
});

// ─── TODO 4: Create agents ──────────────────────────────────
export const devAgent = new Agent({
  id: 'dev-agent',
  name: 'Dev Agent',
  instructions: 'You are a full-featured development assistant with file, command, and search tools.',
  model: 'anthropic/claude-sonnet-4-5',
  workspace: devWorkspace,
});

export const researchAgent = new Agent({
  id: 'research-agent',
  name: 'Research Agent',
  instructions: 'You are a read-only research assistant. You can search and read files but never modify them.',
  model: 'anthropic/claude-sonnet-4-5',
  workspace: researchWorkspace,
});

export const opsAgent = new Agent({
  id: 'ops-agent',
  name: 'Ops Agent',
  instructions: 'You are an operations agent. You run commands for deployment and monitoring. You have no file tools.',
  model: 'anthropic/claude-sonnet-4-5',
  workspace: opsWorkspace,
});

// ─── TODO 5: Test different agent capabilities ──────────────
export async function testDifferentCapabilities() {
  console.log('--- Different Capabilities ---');
  await devWorkspace.init();

  // Write a test file first
  const fs = devWorkspace.filesystem!;
  await fs.writeFile('/test.txt', 'Test content for capability comparison.');

  const tasks = [
    'List files in the workspace',
    'Create a file called new.txt with "hello"',
    'Run: echo "capability test"',
  ];

  for (const agent of [devAgent, researchAgent, opsAgent]) {
    console.log(`\n  ${agent.name}:`);
    for (const task of tasks) {
      const r = await agent.generate(task);
      const status = r.text.length > 0 ? r.text.slice(0, 60) : '(empty)';
      console.log(`    "${task.slice(0, 40)}..." → ${status}...`);
    }
  }
}

// ─── TODO 6: Global + override workspace ─────────────────────
export async function testGlobalOverride() {
  console.log('--- Global + Override ---');

  const globalAgent = new Agent({
    id: 'global-user',
    name: 'Global User',
    instructions: 'You use the global workspace.',
    model: 'anthropic/claude-sonnet-4-5',
    // No workspace — inherits global
  });

  const overrideAgent = new Agent({
    id: 'override-user',
    name: 'Override User',
    instructions: 'You use your own workspace.',
    model: 'anthropic/claude-sonnet-4-5',
    workspace: researchWorkspace,  // overrides global
  });

  const mastra = new Mastra({
    workspace: devWorkspace,  // global default
    agents: { globalUser: globalAgent, overrideUser: overrideAgent },
  });

  const g = mastra.getAgent('globalUser');
  const o = mastra.getAgent('overrideUser');

  // Global agent has full dev workspace
  const r1 = await g.generate('Can you run commands?');
  console.log('Global agent (dev workspace):', r1.text.slice(0, 80));

  // Override agent has read-only research workspace
  const r2 = await o.generate('Can you create files?');
  console.log('Override agent (research workspace):', r2.text.slice(0, 80));
}

// ─── TODO 7: Design a multi-team workspace ──────────────────
export async function testMultiTeam() {
  console.log('--- Multi-Team Workspace ---');

  const frontendWs = new Workspace({
    filesystem: new LocalFilesystem({
      basePath: './multi-workspace/frontend',
      allowedPaths: ['../shared'],
    }),
    sandbox: new LocalSandbox({ workingDirectory: './multi-workspace/frontend' }),
  });

  const backendWs = new Workspace({
    filesystem: new LocalFilesystem({
      basePath: './multi-workspace/backend',
      allowedPaths: ['../shared'],
    }),
    sandbox: new LocalSandbox({ workingDirectory: './multi-workspace/backend' }),
  });

  await frontendWs.init();
  await backendWs.init();

  const feAgent = new Agent({
    id: 'fe-agent',
    instructions: 'You work on frontend code. You can read shared config but only write to your own directory.',
    model: 'anthropic/claude-sonnet-4-5',
    workspace: frontendWs,
  });

  const beAgent = new Agent({
    id: 'be-agent',
    instructions: 'You work on backend code. You can read shared config but only write to your own directory.',
    model: 'anthropic/claude-sonnet-4-5',
    workspace: backendWs,
  });

  console.log('Frontend agent basePath: ./multi-workspace/frontend');
  console.log('Backend agent basePath: ./multi-workspace/backend');
  console.log('Both can read: ../shared');
  console.log('Neither can access the other team\'s directory');
}

// ─── TODO 8: Production workspace checklist ──────────────────
export async function testProductionChecklist() {
  console.log('--- Production Workspace Checklist ---');

  // The ideal production workspace configuration:
  const _productionWorkspace = new Workspace({
    filesystem: new LocalFilesystem({
      basePath: '/app/workspace',
      // Security: contained by default, explicit allowed paths
      allowedPaths: ['/app/shared-config'],
    }),
    sandbox: new LocalSandbox({
      workingDirectory: '/app/workspace',
    }),
    // Search: BM25 for code, auto-index docs
    bm25: true,
    autoIndexPaths: ['/docs/**/*.md', '/src/**/*.ts'],
    // Skills
    skills: ['/skills'],
    // Tool safety
    tools: {
      // Writes need approval and must read first
      [WORKSPACE_TOOLS.FILESYSTEM.WRITE_FILE]: {
        requireApproval: true,
        requireReadBeforeWrite: true,
        name: 'edit_file',
      },
      // No deletion in production
      [WORKSPACE_TOOLS.FILESYSTEM.DELETE]: { enabled: false },
      // Commands need approval
      [WORKSPACE_TOOLS.SANDBOX.EXECUTE_COMMAND]: {
        requireApproval: true,
        maxOutputTokens: 3000,
        name: 'run',
      },
      // Clearer tool names
      [WORKSPACE_TOOLS.FILESYSTEM.READ_FILE]: { name: 'view' },
      [WORKSPACE_TOOLS.FILESYSTEM.GREP]: { name: 'search_code' },
      [WORKSPACE_TOOLS.FILESYSTEM.LIST_FILES]: { name: 'find_files' },
    },
  });

  console.log('Production workspace checklist:');
  console.log('  [x] Containment: basePath with explicit allowedPaths');
  console.log('  [x] Approval: writes and commands require approval');
  console.log('  [x] Safety: read-before-write prevents blind overwrites');
  console.log('  [x] No deletes: file deletion disabled');
  console.log('  [x] Search: BM25 with auto-indexed docs and code');
  console.log('  [x] Skills: team skills directory configured');
  console.log('  [x] Output: maxOutputTokens set on commands');
  console.log('  [x] Names: tools remapped for clarity');
}

// ─── Run all tests ───────────────────────────────────────────
export async function runTest() {
  console.log('=== Advanced Patterns ===\n');

  await testDifferentCapabilities();
  console.log('\n');
  await testGlobalOverride();
  console.log('\n');
  await testMultiTeam();
  console.log('\n');
  await testProductionChecklist();
}
