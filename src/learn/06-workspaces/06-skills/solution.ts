/**
 * MODULE 44: Workspace Skills — SOLUTION
 */

import { Agent } from '@mastra/core/agent';
import { Workspace, LocalFilesystem } from '@mastra/core/workspace';

// ─── TODO 1: Create skill files on the filesystem ───────────
const skillFiles: Record<string, string> = {
  '/skills/code-review/SKILL.md': `---
name: code-review
description: Reviews code for quality, style, and bugs
version: 1.0.0
tags:
  - development
  - review
---

# Code Review

When reviewing code:
1. Check for bugs and edge cases
2. Look for missing error handling
3. Verify type safety
4. Suggest improvements for readability
5. Rate overall quality from 1-10

Always explain WHY something should change, not just what.`,

  '/skills/code-review/references/style-guide.md': `# Style Guide

## Naming
- Use camelCase for variables and functions
- Use PascalCase for classes and types
- Use UPPER_SNAKE for constants

## Formatting
- Max line length: 100 characters
- Use 2 spaces for indentation
- Always use semicolons

## Best Practices
- Prefer const over let
- Avoid any type
- Handle all error cases`,

  '/skills/writing/SKILL.md': `---
name: writing
description: Writes and edits technical documentation
version: 1.0.0
tags:
  - documentation
  - writing
---

# Technical Writing

When writing documentation:
1. Start with a clear introduction explaining the purpose
2. Use headings (##) and bullet points for structure
3. Include code examples for every API
4. Keep sentences short and direct (max 20 words)
5. End with a "Related" section linking to other docs`,
};

export async function setupSkills() {
  const tempWs = new Workspace({
    filesystem: new LocalFilesystem({ basePath: './skills-workspace' }),
  });
  await tempWs.init();

  const fs = tempWs.filesystem!;

  for (const [path, content] of Object.entries(skillFiles)) {
    // Create parent directories
    const parts = path.split('/').slice(0, -1);
    for (let i = 1; i <= parts.length; i++) {
      try { await fs.mkdir(parts.slice(0, i).join('/')); } catch {}
    }
    await fs.writeFile(path, content);
  }

  console.log(`Created ${Object.keys(skillFiles).length} skill files`);
}

// ─── TODO 2: Create a workspace with skills ──────────────────
const workspace = new Workspace({
  filesystem: new LocalFilesystem({ basePath: './skills-workspace' }),
  skills: ['/skills'],
});

// ─── TODO 3: Create an agent with skills ─────────────────────
export const skilledAgent = new Agent({
  id: 'skilled-agent',
  name: 'Skilled Agent',
  instructions: `
    You are a versatile assistant with access to skills.
    Skills teach you how to perform specific tasks.
    Load a skill when you need its guidance.
    Always follow the skill's instructions carefully.
  `,
  model: 'anthropic/claude-sonnet-4-5',
  workspace,
});

// ─── TODO 4: Test skill discovery ───────────────────────────
export async function testSkillDiscovery() {
  console.log('--- Skill Discovery ---');
  await workspace.init();

  const r = await skilledAgent.generate('What skills do you have available?');
  console.log('Available skills:', r.text.slice(0, 200));
}

// ─── TODO 5: Test loading a skill ───────────────────────────
export async function testLoadSkill() {
  console.log('--- Load Skill ---');

  const r = await skilledAgent.generate(`
    Load the code-review skill, then review this code:

    function add(a, b) {
      return a + b
    }
    const result = add("1", 2)
    console.log(result)
  `);

  console.log('Code review:', r.text.slice(0, 300));

  const tools = r.steps?.flatMap(s => s.toolCalls || []).map(tc => tc.toolName);
  console.log('Tools used:', tools);
}

// ─── TODO 6: Test skill_read ────────────────────────────────
export async function testSkillRead() {
  console.log('--- Skill Read ---');

  const r = await skilledAgent.generate(
    'Read the style guide from the code-review skill and summarize the naming conventions'
  );
  console.log('Style guide:', r.text.slice(0, 200));
}

// ─── TODO 7: Test skill search ──────────────────────────────
export async function testSkillSearch() {
  console.log('--- Skill Search ---');

  const searchWs = new Workspace({
    filesystem: new LocalFilesystem({ basePath: './skills-workspace' }),
    skills: ['/skills'],
    bm25: true,
  });
  await searchWs.init();

  const agent = new Agent({
    id: 'search-skill-agent',
    instructions: 'Search skills for relevant information.',
    model: 'anthropic/claude-sonnet-4-5',
    workspace: searchWs,
  });

  const r = await agent.generate('Search skills for information about error handling');
  console.log('Search result:', r.text.slice(0, 200));
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
