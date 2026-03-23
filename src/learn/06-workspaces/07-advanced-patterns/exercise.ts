/**
 * ============================================================
 *  MODULE 45: Advanced Workspace Patterns
 * ============================================================
 *
 *  THEORY
 *  ------
 *  Modules 39-44 covered local development. This module covers
 *  ADVANCED PATTERNS for production and cloud deployments.
 *
 *  ── MOUNTS (cloud storage in sandboxes) ──
 *  When you need cloud storage accessible inside a sandbox,
 *  use `mounts`. This FUSE-mounts cloud filesystems into the
 *  sandbox so commands can access files at the mount path.
 *
 *    new Workspace({
 *      mounts: {
 *        '/data': new S3Filesystem({
 *          bucket: 'my-bucket',
 *          region: 'us-east-1',
 *          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
 *          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
 *        }),
 *        '/skills': new GCSFilesystem({
 *          bucket: 'agent-skills',
 *        }),
 *      },
 *      sandbox: new E2BSandbox({ id: 'dev-sandbox' }),
 *    })
 *
 *  MOUNT ROUTING:
 *    read_file('/data/input.csv') → reads from S3
 *    write_file('/skills/guide.md', ...) → writes to GCS
 *    list_directory('/') → returns ['/data', '/skills']
 *    Commands in sandbox: ls /data → sees S3 files
 *
 *  RULES:
 *    - filesystem and mounts are MUTUALLY EXCLUSIVE
 *    - Mount paths must be unique and non-overlapping
 *    - Can't nest mounts (/data and /data/sub)
 *
 *  WHEN TO USE:
 *    filesystem → single provider, no sandbox mounting
 *    mounts     → cloud storage in sandbox, or multiple providers
 *
 *  ── CLOUD SANDBOXES ──
 *  For isolated execution (security, multi-tenant):
 *
 *    E2BSandbox     → E2B cloud sandbox
 *    DaytonaSandbox → Daytona cloud sandbox
 *    BlaxelSandbox  → Blaxel cloud sandbox
 *
 *    new Workspace({
 *      sandbox: new E2BSandbox({ id: 'my-sandbox' }),
 *    })
 *
 *  ── CONFIGURATION PATTERN REFERENCE ──
 *
 *  | Scenario                         | Pattern                    |
 *  |----------------------------------|----------------------------|
 *  | Local dev (files + commands)     | filesystem + sandbox       |
 *  | Cloud storage in cloud sandbox   | mounts + sandbox           |
 *  | Multiple cloud providers         | mounts + sandbox           |
 *  | File access only                 | filesystem only            |
 *  | Command execution only           | sandbox only               |
 *
 *  ── COMBINING EVERYTHING ──
 *  A full production workspace might include:
 *    - Cloud storage mounts (S3, GCS)
 *    - Cloud sandbox (E2B)
 *    - BM25 + vector search
 *    - Skills
 *    - Tool safety (approval, read-before-write)
 *
 *  ── AGENT-LEVEL OVERRIDES ──
 *  Different agents can have different workspaces:
 *    - Code agent: full filesystem + sandbox + skills
 *    - Research agent: read-only filesystem + search
 *    - Admin agent: full access with approval on deletes
 *
 *  EXERCISE
 *  --------
 *  Design workspace configurations for different scenarios
 *  and implement multi-agent setups with different permissions.
 * ============================================================
 */

import { Agent } from '@mastra/core/agent';
import { Mastra } from '@mastra/core/mastra';
import { Workspace, LocalFilesystem, LocalSandbox, WORKSPACE_TOOLS } from '@mastra/core/workspace';

// ─── TODO 1: Design a "dev agent" workspace ──────────────────
// Full-featured: filesystem + sandbox + search + skills
// Approval on: file writes, command execution
// Disabled: file deletion
//
// new Workspace({
//   filesystem: new LocalFilesystem({ basePath: './multi-workspace' }),
//   sandbox: new LocalSandbox({ workingDirectory: './multi-workspace' }),
//   skills: ['/skills'],
//   bm25: true,
//   tools: {
//     [WORKSPACE_TOOLS.FILESYSTEM.WRITE_FILE]: { requireApproval: true, requireReadBeforeWrite: true },
//     [WORKSPACE_TOOLS.FILESYSTEM.DELETE]: { enabled: false },
//     [WORKSPACE_TOOLS.SANDBOX.EXECUTE_COMMAND]: { requireApproval: true },
//   },
// })

const devWorkspace = undefined as any; // ← replace

// ─── TODO 2: Design a "research agent" workspace ─────────────
// Read-only filesystem + search, no commands.
// Perfect for an agent that only reads and analyzes.

const researchWorkspace = undefined as any; // ← replace

// ─── TODO 3: Design an "ops agent" workspace ────────────────
// Sandbox only (no file tools). Can run commands but not
// directly manage files. Useful for deployment agents.

const opsWorkspace = undefined as any; // ← replace

// ─── TODO 4: Create agents with different workspaces ────────
// devAgent:      full dev workspace
// researchAgent: read-only research workspace
// opsAgent:      ops workspace

export const devAgent = undefined as any; // ← replace
export const researchAgent = undefined as any; // ← replace
export const opsAgent = undefined as any; // ← replace

// ─── TODO 5: Test different agent capabilities ──────────────
// Ask each agent to do the same three things:
//   a) List files
//   b) Create a file
//   c) Run a command
// Compare what each can and can't do.

export async function testDifferentCapabilities() {
  console.log('--- Different Capabilities ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 6: Global + override workspace ─────────────────────
// Set a global workspace on Mastra, then override for one agent.
//
// const mastra = new Mastra({
//   workspace: devWorkspace,  // global default
//   agents: { devAgent, researchAgent, opsAgent },
// })
//
// researchAgent has its own workspace → overrides global.
// devAgent uses global.

export async function testGlobalOverride() {
  console.log('--- Global + Override ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 7: Design a multi-team workspace ──────────────────
// Scenario: Two teams share a codebase but have different permissions.
//
// Team A (frontend):
//   basePath: './workspace/frontend'
//   Can read shared config but only write to frontend/
//
// Team B (backend):
//   basePath: './workspace/backend'
//   Can read shared config but only write to backend/
//
// Create workspaces for each team with appropriate containment.

export async function testMultiTeam() {
  console.log('--- Multi-Team Workspace ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 8: Production workspace checklist ──────────────────
// Design a production workspace configuration.
// Consider:
//   1. Security: containment, approval, read-before-write
//   2. Search: BM25 for code, auto-index paths
//   3. Skills: team skills directory
//   4. Output: maxOutputTokens to prevent context overflow
//   5. Tool names: remapped for clarity
//
// Don't implement — just write the configuration as comments.

export async function testProductionChecklist() {
  console.log('--- Production Workspace Checklist ---');

  // TODO: Write the ideal production workspace config as comments
  // Think about what you'd want in a real deployment.
  console.log('TODO: implement');
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
