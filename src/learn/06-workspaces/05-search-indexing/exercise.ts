/**
 * ============================================================
 *  MODULE 43: Search & Indexing
 * ============================================================
 *
 *  THEORY
 *  ------
 *  Reading every file to find information is slow. Workspace
 *  SEARCH lets agents find relevant content instantly by
 *  indexing files and querying them.
 *
 *  TWO PHASES:
 *    1. INDEXING: Content is tokenized and stored in a search index
 *    2. QUERYING: Agent searches the index to find relevant content
 *
 *  THREE SEARCH MODES:
 *
 *  BM25 (keyword search):
 *    Scores by term frequency and document length.
 *    Best for exact terms, code, specific terminology.
 *
 *    new Workspace({
 *      filesystem: new LocalFilesystem({ basePath: './ws' }),
 *      bm25: true,
 *    })
 *
 *    Custom BM25 parameters:
 *      bm25: { k1: 1.5, b: 0.75 }
 *      k1: term frequency saturation
 *      b: document length normalization
 *
 *  VECTOR (semantic search):
 *    Uses embeddings for semantic similarity.
 *    Best for natural language, conceptual queries.
 *    Requires vectorStore and embedder function.
 *
 *    new Workspace({
 *      filesystem: new LocalFilesystem({ basePath: './ws' }),
 *      vectorStore: pineconeVector,
 *      embedder: async (text) => {
 *        const { embedding } = await embed({ model, value: text })
 *        return embedding
 *      },
 *    })
 *
 *  HYBRID (both):
 *    Combines keyword matching with semantic understanding.
 *    Configure both bm25 and vectorStore/embedder.
 *
 *  INDEXING CONTENT:
 *
 *  Manual indexing:
 *    await workspace.index('/docs/guide.md', content)
 *    await workspace.index('/docs/api.md', content, {
 *      metadata: { category: 'api', version: '2.0' },
 *    })
 *
 *  Auto-indexing (on workspace.init()):
 *    new Workspace({
 *      filesystem: ...,
 *      bm25: true,
 *      autoIndexPaths: ['/docs', '/support/faq'],
 *    })
 *    await workspace.init()  // indexes all matching files
 *
 *  Glob patterns:
 *    autoIndexPaths: ['/docs/**\/*.md', '/support/**\/*.txt']
 *
 *  SEARCHING:
 *    const results = await workspace.search('password reset')
 *
 *    const results = await workspace.search('auth flow', {
 *      topK: 10,           // max results (default: 5)
 *      mode: 'hybrid',     // 'bm25', 'vector', or 'hybrid'
 *      minScore: 0.5,      // filter low-relevance
 *      vectorWeight: 0.5,  // 0=all BM25, 1=all vector
 *    })
 *
 *  RESULT STRUCTURE:
 *    {
 *      id: string,          // document ID (file path)
 *      content: string,     // matching content
 *      score: number,       // 0-1 relevance
 *      lineRange?: { start, end },
 *      metadata?: { ... },
 *      scoreDetails?: { vector?, bm25? },  // hybrid only
 *    }
 *
 *  WHEN TO USE EACH MODE:
 *    bm25   → exact terms, code search, config files
 *    vector → conceptual queries, natural language
 *    hybrid → general search, unknown query types
 *
 *  AGENT TOOLS:
 *    When search is configured, agents get search tools
 *    automatically. They can search and index content
 *    as part of their tasks.
 *
 *  EXERCISE
 *  --------
 *  Set up search indexing, index documents, and explore
 *  different search modes.
 * ============================================================
 */

import { Agent } from '@mastra/core/agent';
import { Workspace, LocalFilesystem } from '@mastra/core/workspace';

// ─── TODO 1: Create a BM25 search workspace ─────────────────
// new Workspace({
//   filesystem: new LocalFilesystem({ basePath: './search-workspace' }),
//   bm25: true,
// })

const workspace = undefined as any; // ← replace

// ─── TODO 2: Write and index documents manually ──────────────
// Use the filesystem to create files, then index them.
//
// await workspace.init()
// const fs = workspace.filesystem
// await fs.writeFile('/docs/agents.md', '# Agents\nAgents wrap LLMs with instructions and tools...')
// await fs.writeFile('/docs/workflows.md', '# Workflows\nWorkflows define step-by-step processes...')
// await fs.writeFile('/docs/memory.md', '# Memory\nMemory gives agents persistent context...')
//
// await workspace.index('/docs/agents.md', agentContent)
// await workspace.index('/docs/workflows.md', workflowContent)
// await workspace.index('/docs/memory.md', memoryContent)

export async function testManualIndexing() {
  console.log('--- Manual Indexing ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 3: Search with BM25 ───────────────────────────────
// Search for specific terms:
//   'LLM instructions tools'
//   'step-by-step processes'
//   'persistent context conversations'

export async function testBM25Search() {
  console.log('--- BM25 Search ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 4: Create auto-indexed workspace ──────────────────
// Use autoIndexPaths to index files automatically on init().
//
// new Workspace({
//   filesystem: new LocalFilesystem({ basePath: './search-workspace' }),
//   bm25: true,
//   autoIndexPaths: ['/docs'],
// })
// await workspace.init()  // triggers auto-indexing

export async function testAutoIndex() {
  console.log('--- Auto-Indexing ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 5: Search with options ─────────────────────────────
// Test different search options:
//   topK: 1 vs 5
//   minScore: 0.0 vs 0.5
// Compare results.

export async function testSearchOptions() {
  console.log('--- Search Options ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 6: Index with metadata ─────────────────────────────
// Index documents with metadata for richer results.
//
// await workspace.index('/docs/agents.md', content, {
//   metadata: { category: 'core', difficulty: 'beginner' },
// })

export async function testMetadataIndex() {
  console.log('--- Metadata Indexing ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 7: Agent-driven search ─────────────────────────────
// Create an agent with search workspace and let it
// search for information.
//
// const agent = new Agent({
//   id: 'search-agent',
//   instructions: 'Search the workspace for answers.',
//   workspace,
// })
// agent.generate('What do agents do in Mastra?')

export async function testAgentSearch() {
  console.log('--- Agent-Driven Search ---');
  // TODO: implement
  console.log('TODO: implement');
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
