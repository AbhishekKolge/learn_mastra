/**
 * ============================================================
 *  MODULE 44: Workspace Skills
 * ============================================================
 *
 *  THEORY
 *  ------
 *  Skills are REUSABLE INSTRUCTION SETS that teach agents how
 *  to perform specific tasks. They follow the open Agent Skills
 *  specification (agentskills.io).
 *
 *  Think of skills like recipes — an agent can load a "code review"
 *  skill and instantly know how to review code, what to look for,
 *  and what tools to use.
 *
 *  SKILL STRUCTURE:
 *    /skills/
 *      /code-review/
 *        SKILL.md            ← instructions + metadata
 *        /references/        ← supporting docs (optional)
 *          style-guide.md
 *        /scripts/           ← executable scripts (optional)
 *          lint.ts
 *        /assets/            ← images, files (optional)
 *
 *  SKILL.md FORMAT:
 *    ---
 *    name: code-review
 *    description: Reviews code for quality and style
 *    version: 1.0.0
 *    tags:
 *      - development
 *      - review
 *    ---
 *
 *    # Code Review
 *    You are a code reviewer. When reviewing code:
 *    1. Check for bugs and edge cases
 *    2. Verify style guide compliance
 *    3. Suggest improvements for readability
 *
 *  CONFIGURING SKILLS:
 *    new Workspace({
 *      filesystem: new LocalFilesystem({ basePath: './workspace' }),
 *      skills: ['/skills'],
 *    })
 *
 *    Multiple directories:
 *      skills: ['/skills', '/team-skills']
 *
 *    Glob patterns:
 *      skills: ['./**​/skills']  // find skills in any subdirectory
 *
 *  AGENT SKILL TOOLS:
 *    When skills are configured, agents get 3 tools:
 *
 *    skill         → Load a skill's full instructions
 *    skill_read    → Read files from a skill's references/scripts/assets
 *    skill_search  → Search across all skill content
 *
 *    This is STATELESS — there's no "active skill" state.
 *    If instructions leave the context window, the agent
 *    can call skill() again to reload them.
 *
 *  DYNAMIC SKILLS:
 *    For context-dependent skill paths:
 *
 *    skills: (context) => {
 *      const paths = ['/skills']
 *      if (context.user?.role === 'developer') {
 *        paths.push('/dev-skills')
 *      }
 *      return paths
 *    }
 *
 *  SKILL SEARCH:
 *    If BM25 or vector search is enabled on the workspace,
 *    skills are automatically indexed for search.
 *
 *    new Workspace({
 *      filesystem: ...,
 *      skills: ['/skills'],
 *      bm25: true,  // enables skill search
 *    })
 *
 *  EXERCISE
 *  --------
 *  Create skills, configure them on a workspace, and test
 *  how agents discover and use them.
 * ============================================================
 */

import { Agent } from '@mastra/core/agent';
import { Workspace, LocalFilesystem } from '@mastra/core/workspace';

// ─── TODO 1: Create skill files on the filesystem ───────────
// Set up the workspace and create skill directories/files:
//
// /skills/code-review/SKILL.md:
//   ---
//   name: code-review
//   description: Reviews code for quality, style, and bugs
//   version: 1.0.0
//   tags: [development, review]
//   ---
//   # Code Review
//   When reviewing code:
//   1. Check for bugs and edge cases
//   2. Look for missing error handling
//   3. Suggest improvements for readability
//   4. Rate quality from 1-10
//
// /skills/code-review/references/style-guide.md:
//   # Style Guide
//   - Use camelCase for variables
//   - Use PascalCase for classes
//   - Max line length: 100 characters
//
// /skills/writing/SKILL.md:
//   ---
//   name: writing
//   description: Writes and edits technical documentation
//   version: 1.0.0
//   tags: [documentation, writing]
//   ---
//   # Technical Writing
//   When writing documentation:
//   1. Start with a clear introduction
//   2. Use headings and bullet points
//   3. Include code examples
//   4. Keep sentences short and direct

export async function setupSkills() {
  // TODO: implement — create the skill files
  console.log('TODO: implement');
}

// ─── TODO 2: Create a workspace with skills ──────────────────
// new Workspace({
//   filesystem: new LocalFilesystem({ basePath: './skills-workspace' }),
//   skills: ['/skills'],
// })

const workspace = undefined as any; // ← replace

// ─── TODO 3: Create an agent with skills ─────────────────────
// new Agent({
//   id: 'skilled-agent',
//   instructions: 'You are a versatile assistant. Load and use skills as needed.',
//   model: 'anthropic/claude-sonnet-4-5',
//   workspace,
// })

export const skilledAgent = undefined as any; // ← replace

// ─── TODO 4: Test skill discovery ───────────────────────────
// Ask the agent what skills are available.
// The agent should list them from the system message.

export async function testSkillDiscovery() {
  console.log('--- Skill Discovery ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 5: Test loading a skill ───────────────────────────
// Ask the agent to load the code-review skill and then
// review a code snippet.
//
// 'Load the code-review skill, then review this code:
//  function add(a, b) { return a + b }
//  const result = add("1", 2)'

export async function testLoadSkill() {
  console.log('--- Load Skill ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 6: Test skill_read ────────────────────────────────
// Ask the agent to read the style guide from the code-review skill.

export async function testSkillRead() {
  console.log('--- Skill Read ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 7: Test skill search ──────────────────────────────
// Create a workspace with BM25 search + skills.
// Search for a term across skills.
//
// new Workspace({
//   filesystem: ...,
//   skills: ['/skills'],
//   bm25: true,
// })

export async function testSkillSearch() {
  console.log('--- Skill Search ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── Run all tests ───────────────────────────────────────────
export async function runTest() {
  console.log('=== Skills ===\n');

  await setupSkills();
  console.log('\n');
  await testSkillDiscovery();
  console.log('\n');
  await testLoadSkill();
  console.log('\n');
  await testSkillRead();
  console.log('\n');
  await testSkillSearch();
}
