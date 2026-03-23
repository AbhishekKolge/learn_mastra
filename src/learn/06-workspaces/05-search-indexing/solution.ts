/**
 * MODULE 43: Search & Indexing — SOLUTION
 */

import { Agent } from '@mastra/core/agent';
import { Workspace, LocalFilesystem } from '@mastra/core/workspace';

const docs: Record<string, string> = {
  '/docs/agents.md': '# Agents\nAgents wrap LLMs with instructions and tools. They handle open-ended tasks where steps are not known in advance. Agents reason about requests, pick tools, and iterate until they produce a final answer.',
  '/docs/workflows.md': '# Workflows\nWorkflows define step-by-step processes with schemas. Each step has an input schema and output schema. Steps can run in parallel, branch conditionally, or loop.',
  '/docs/memory.md': '# Memory\nMemory gives agents persistent context across conversations. It supports working memory, semantic recall, and observational memory. Multiple storage providers are available.',
  '/docs/streaming.md': '# Streaming\nStreaming delivers tokens incrementally for real-time user experiences. Agents use .stream() to return textStream, tools can write progress via context.writer.',
  '/docs/rag.md': '# RAG\nRAG enhances LLM outputs with your own data. The pipeline is: document, chunk, embed, store, query. Supports 9 chunking strategies and 14+ vector databases.',
};

// ─── TODO 1: Create a BM25 search workspace ─────────────────
const workspace = new Workspace({
  filesystem: new LocalFilesystem({ basePath: './search-workspace' }),
  bm25: true,
});

// ─── TODO 2: Write and index documents manually ──────────────
export async function testManualIndexing() {
  console.log('--- Manual Indexing ---');
  await workspace.init();

  const fs = workspace.filesystem!;

  // Write files
  for (const [path, content] of Object.entries(docs)) {
    const dir = path.substring(0, path.lastIndexOf('/'));
    try { await fs.mkdir(dir); } catch {}
    await fs.writeFile(path, content);
  }
  console.log(`Wrote ${Object.keys(docs).length} files`);

  // Index them
  for (const [path, content] of Object.entries(docs)) {
    await workspace.index(path, content);
  }
  console.log(`Indexed ${Object.keys(docs).length} documents`);
}

// ─── TODO 3: Search with BM25 ───────────────────────────────
export async function testBM25Search() {
  console.log('--- BM25 Search ---');

  const queries = [
    'LLM instructions tools',
    'step-by-step processes schemas',
    'persistent context conversations',
  ];

  for (const query of queries) {
    const results = await workspace.search(query);
    console.log(`\n  Q: "${query}"`);
    results.forEach((r, i) => {
      console.log(`    ${i + 1}. (${r.score.toFixed(3)}) ${r.id} — ${r.content.slice(0, 60)}...`);
    });
  }
}

// ─── TODO 4: Create auto-indexed workspace ──────────────────
export async function testAutoIndex() {
  console.log('--- Auto-Indexing ---');

  const autoWs = new Workspace({
    filesystem: new LocalFilesystem({ basePath: './search-workspace' }),
    bm25: true,
    autoIndexPaths: ['/docs'],
  });
  await autoWs.init(); // triggers auto-indexing

  const results = await autoWs.search('vector databases');
  console.log('Auto-indexed search for "vector databases":');
  results.forEach((r, i) => {
    console.log(`  ${i + 1}. (${r.score.toFixed(3)}) ${r.id}`);
  });
}

// ─── TODO 5: Search with options ─────────────────────────────
export async function testSearchOptions() {
  console.log('--- Search Options ---');

  const query = 'agents tools';

  // topK comparison
  for (const topK of [1, 3, 5]) {
    const results = await workspace.search(query, { topK });
    console.log(`  topK=${topK}: ${results.length} results`);
  }

  // minScore comparison
  const allResults = await workspace.search(query, { topK: 10 });
  console.log(`\n  All scores: [${allResults.map(r => r.score.toFixed(3)).join(', ')}]`);

  const filtered = await workspace.search(query, { topK: 10, minScore: 0.5 });
  console.log(`  minScore=0.5: ${filtered.length} results (from ${allResults.length})`);
}

// ─── TODO 6: Index with metadata ─────────────────────────────
export async function testMetadataIndex() {
  console.log('--- Metadata Indexing ---');

  await workspace.index('/docs/agents.md', docs['/docs/agents.md'], {
    metadata: { category: 'core', difficulty: 'beginner' },
  });
  await workspace.index('/docs/rag.md', docs['/docs/rag.md'], {
    metadata: { category: 'advanced', difficulty: 'intermediate' },
  });

  const results = await workspace.search('LLM data');
  results.forEach((r, i) => {
    console.log(`  ${i + 1}. ${r.id} (score: ${r.score.toFixed(3)})`, r.metadata || '(no metadata)');
  });
}

// ─── TODO 7: Agent-driven search ─────────────────────────────
export async function testAgentSearch() {
  console.log('--- Agent-Driven Search ---');

  const agent = new Agent({
    id: 'search-agent',
    name: 'Search Agent',
    instructions: `
      You answer questions about the Mastra framework.
      Search the workspace for relevant documentation before answering.
      Cite which documents you found information in.
    `,
    model: 'anthropic/claude-sonnet-4-5',
    workspace,
  });

  const r = await agent.generate('What are the differences between agents and workflows in Mastra?');
  console.log('Agent answer:', r.text.slice(0, 200));

  const tools = r.steps?.flatMap(s => s.toolCalls || []).map(tc => tc.toolName);
  console.log('Tools used:', tools);
}

// ─── Run all tests ───────────────────────────────────────────
export async function runTest() {
  console.log('=== Search & Indexing ===\n');

  await testManualIndexing();
  console.log('\n');
  await testBM25Search();
  console.log('\n');
  await testAutoIndex();
  console.log('\n');
  await testSearchOptions();
  console.log('\n');
  await testMetadataIndex();
  console.log('\n');
  await testAgentSearch();
}
