/**
 * ============================================================
 *  MODULE 40: Filesystem
 * ============================================================
 *
 *  THEORY
 *  ------
 *  The filesystem gives agents file management superpowers.
 *  When configured on a workspace, agents get tools for ALL
 *  standard file operations:
 *
 *  FILE TOOLS (auto-registered):
 *    read_file      → Read file contents
 *    write_file     → Create or update files
 *    edit_file      → Edit parts of existing files
 *    list_directory → Browse directories (optional glob filtering)
 *    list_files     → List files matching glob patterns
 *    delete         → Remove files and directories
 *    stat           → Get file metadata (size, modified time)
 *    copy           → Copy files between locations
 *    move           → Move/rename files
 *    grep           → Search file contents with regex
 *    mkdir          → Create directories
 *
 *  SUPPORTED PROVIDERS:
 *    LocalFilesystem  → files on disk (simplest, no setup needed)
 *    S3Filesystem     → Amazon S3 or S3-compatible (R2, MinIO)
 *    GCSFilesystem    → Google Cloud Storage
 *    AgentFSFilesystem → Turso/SQLite database-backed storage
 *
 *  CONTAINMENT (security):
 *    By default, LocalFilesystem runs in CONTAINED mode —
 *    all paths are restricted to stay within basePath.
 *    This prevents path traversal attacks (../../etc/passwd).
 *
 *    Relative paths: resolve against basePath
 *    Absolute paths: must be within basePath (or allowedPaths)
 *    Tilde paths: expand to home dir, same containment rules
 *
 *    ALLOWING SPECIFIC OUTSIDE PATHS:
 *      new LocalFilesystem({
 *        basePath: './workspace',
 *        allowedPaths: ['~/.config/myapp', '../shared-data'],
 *      })
 *
 *    DYNAMIC allowedPaths:
 *      filesystem.setAllowedPaths(prev => [...prev, '/new/path'])
 *
 *    DISABLE CONTAINMENT (unrestricted):
 *      new LocalFilesystem({ basePath: './workspace', contained: false })
 *
 *  READ-ONLY MODE:
 *    Prevents all write operations. Agent can read and list,
 *    but NOT write, delete, or create directories.
 *
 *    new LocalFilesystem({
 *      basePath: './workspace',
 *      readOnly: true,
 *    })
 *
 *  USING THE FILESYSTEM PROGRAMMATICALLY:
 *    Beyond agent tools, you can use the filesystem directly:
 *
 *    const fs = workspace.filesystem
 *    const content = await fs.readFile('/docs/readme.md')
 *    await fs.writeFile('/docs/new.md', 'content')
 *    const files = await fs.listDirectory('/docs')
 *    const stat = await fs.stat('/docs/readme.md')
 *
 *  EXERCISE
 *  --------
 *  Create agents with different filesystem configurations
 *  and explore all file operations.
 * ============================================================
 */

import { Agent } from '@mastra/core/agent';
import { Workspace, LocalFilesystem } from '@mastra/core/workspace';

// ─── TODO 1: Create a workspace with filesystem ─────────────
// new Workspace({
//   filesystem: new LocalFilesystem({ basePath: './fs-workspace' }),
// })

const workspace = undefined as any; // ← replace

// ─── TODO 2: Create an agent ────────────────────────────────
// new Agent({
//   id: 'fs-agent',
//   instructions: 'You are a file management assistant...',
//   model: 'anthropic/claude-sonnet-4-5',
//   workspace,
// })

export const fsAgent = undefined as any; // ← replace

// ─── TODO 3: Test file operations via agent ──────────────────
// a) Create a directory structure: /docs, /src
// b) Write files: /docs/readme.md, /src/index.ts
// c) List all files
// d) Read a specific file
// e) Grep for a pattern across files
// f) Copy a file
// g) Delete a file
//
// Use agent.generate() for each operation.

export async function testFileOperations() {
  console.log('--- File Operations ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 4: Test containment ────────────────────────────────
// Create a contained filesystem and verify that:
// a) Relative paths work fine
// b) Paths outside basePath are blocked
//
// const contained = new Workspace({
//   filesystem: new LocalFilesystem({ basePath: './fs-workspace' }),
// })
// const agent = new Agent({ ..., workspace: contained })
//
// Try: agent.generate('Read the file /etc/passwd')
// Should fail with a containment error.

export async function testContainment() {
  console.log('--- Containment ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 5: Test allowedPaths ──────────────────────────────
// Allow access to a specific path outside basePath.
//
// new LocalFilesystem({
//   basePath: './fs-workspace',
//   allowedPaths: ['./exercise-workspace'],
// })

export async function testAllowedPaths() {
  console.log('--- Allowed Paths ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 6: Test read-only mode ─────────────────────────────
// Create a read-only workspace. Verify:
// a) Reading works
// b) Writing is blocked (tool not available)
//
// new LocalFilesystem({ basePath: './fs-workspace', readOnly: true })

export async function testReadOnly() {
  console.log('--- Read-Only Mode ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 7: Programmatic filesystem access ──────────────────
// Use the filesystem directly (not through agent):
//
// const fs = workspace.filesystem
// await fs.writeFile('/test.txt', 'Hello from code!')
// const content = await fs.readFile('/test.txt')
// const stat = await fs.stat('/test.txt')
// const files = await fs.listDirectory('/')
// console.log(content, stat, files)

export async function testProgrammaticAccess() {
  console.log('--- Programmatic Access ---');
  // TODO: implement
  console.log('TODO: implement');
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
