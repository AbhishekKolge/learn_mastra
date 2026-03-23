/**
 * ============================================================
 *  MODULE 37: Graph RAG
 * ============================================================
 *
 *  THEORY
 *  ------
 *  Standard RAG finds chunks that are semantically SIMILAR to
 *  the query. But sometimes the answer isn't in one chunk —
 *  it's spread across CONNECTED chunks that reference each other.
 *
 *  Graph RAG solves this by adding a KNOWLEDGE GRAPH layer on
 *  top of vector search. It follows RELATIONSHIPS between chunks
 *  to find information that standard RAG would miss.
 *
 *  STANDARD RAG vs GRAPH RAG:
 *    Standard: "Find the 5 chunks most similar to the query"
 *    Graph:    "Find similar chunks, then follow connections
 *              to find related information"
 *
 *  WHEN TO USE GRAPH RAG:
 *    - Information is spread across MULTIPLE documents
 *    - Documents REFERENCE each other
 *    - You need to TRAVERSE relationships for complete answers
 *    - Understanding CONNECTIONS between concepts matters
 *
 *    Example: "How does Agent X affect Workflow Y?"
 *    Standard RAG finds chunks about X and Y separately.
 *    Graph RAG finds chunks about X, then follows connections
 *    to chunks that discuss X's relationship with Y.
 *
 *  WHEN NOT TO USE GRAPH RAG:
 *    - Simple fact-finding queries (use standard vector search)
 *    - Queries about isolated topics with no cross-references
 *    - When speed matters more than completeness
 *
 *  HOW IT WORKS:
 *    1. Initial vector search retrieves similar chunks
 *    2. A knowledge graph is built from retrieved chunks
 *    3. The graph is traversed to find connected information
 *    4. Results include BOTH directly similar AND connected chunks
 *
 *  createGraphRAGTool:
 *    import { createGraphRAGTool } from '@mastra/rag'
 *
 *    const graphTool = createGraphRAGTool({
 *      vectorStoreName: 'myStore',
 *      indexName: 'embeddings',
 *      model: embeddingModel,
 *      graphOptions: {
 *        threshold: 0.7,     // similarity threshold for connections
 *        dimension: 1536,    // must match embedding model
 *      },
 *    })
 *
 *  THRESHOLD:
 *    Controls how easily chunks get connected in the graph.
 *
 *    High (0.8-0.9): Strict — only strong connections
 *      → Fewer relationships, more precise, potentially incomplete
 *
 *    Medium (0.6-0.8): Balanced — good for most use cases
 *      → Start here (0.7 is a good default)
 *
 *    Low (0.4-0.6): Broad — many connections
 *      → More relationships, broader context, risk of noise
 *
 *  COMBINING TOOLS:
 *    Give an agent BOTH tools and let it decide which to use:
 *
 *    const agent = new Agent({
 *      instructions: `Use vector search for simple facts.
 *        Use graph search when you need relationships.`,
 *      tools: { vectorQueryTool, graphQueryTool },
 *    })
 *
 *  EXERCISE
 *  --------
 *  Build a knowledge base with interconnected documents and
 *  compare standard vector search vs graph-based retrieval.
 * ============================================================
 */

import { Agent } from '@mastra/core/agent';
import { Mastra } from '@mastra/core/mastra';
import { MDocument, createVectorQueryTool, createGraphRAGTool } from '@mastra/rag';
import { embedMany } from 'ai';
import { ModelRouterEmbeddingModel } from '@mastra/core/llm';
import { LibSQLVector } from '@mastra/core/vector/libsql';

const embeddingModel = new ModelRouterEmbeddingModel('openai/text-embedding-3-small');

// ─── Interconnected knowledge base ───────────────────────────
// These documents reference each other — ideal for GraphRAG.
const documents = [
  'The city council approved a new public transit system to reduce traffic congestion.',
  'Traffic congestion has increased 40% over the past five years, impacting local businesses.',
  'Local businesses report that delivery times have doubled due to worsening traffic.',
  'The new transit system will include electric buses and dedicated bike lanes.',
  'Electric buses produce zero emissions and can carry up to 80 passengers.',
  'Dedicated bike lanes have been shown to reduce car traffic by 15% in similar cities.',
  'The transit project is funded by a $500 million infrastructure bond.',
  'The infrastructure bond will be repaid through increased property tax revenue.',
  'Property values near transit stations typically increase by 10-25%.',
  'Increased property values benefit homeowners but may raise rents for tenants.',
];

// ─── TODO 1: Set up the knowledge base ───────────────────────
// Chunk, embed, and store all documents.
// Return the vector store instance.

async function setupKnowledgeBase(): Promise<LibSQLVector> {
  // TODO: implement
  return undefined as any;
}

// ─── TODO 2: Create a standard vector query tool ─────────────
// createVectorQueryTool({
//   vectorStoreName: 'graphStore',
//   indexName: 'graph_docs',
//   model: embeddingModel,
// })

const vectorQueryTool = undefined as any; // ← replace

// ─── TODO 3: Create a graph RAG tool ─────────────────────────
// createGraphRAGTool({
//   vectorStoreName: 'graphStore',
//   indexName: 'graph_docs',
//   model: embeddingModel,
//   graphOptions: {
//     threshold: 0.7,
//     dimension: 1536,
//   },
// })

const graphQueryTool = undefined as any; // ← replace

// ─── TODO 4: Create agents — one with each tool ─────────────
// Agent A: Standard RAG (vectorQueryTool only)
// Agent B: Graph RAG (graphQueryTool only)
// Agent C: Hybrid (both tools — can choose)

export const standardAgent = undefined as any; // ← replace
export const graphAgent = undefined as any; // ← replace
export const hybridAgent = undefined as any; // ← replace

// ─── TODO 5: Compare standard vs graph retrieval ─────────────
// Ask the same relationship question to both agents.
// The graph agent should provide a more connected answer.
//
// Question: 'How does the new transit system affect local businesses?'
// This requires connecting: transit → traffic → businesses

export async function testCompareRetrieval() {
  console.log('--- Standard vs Graph RAG ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 6: Test with a chain-of-connections query ──────────
// Ask a question that requires traversing multiple connections.
//
// Question: 'How does the infrastructure bond ultimately affect renters?'
// Chain: bond → property tax → property values → rents

export async function testChainQuery() {
  console.log('--- Chain of Connections ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 7: Test the hybrid agent ──────────────────────────
// Ask both a simple fact query and a relationship query.
// The hybrid agent should choose the appropriate tool.
//
// Simple: 'How many passengers can an electric bus carry?'
// Complex: 'What is the full economic impact of the transit project?'

export async function testHybridAgent() {
  console.log('--- Hybrid Agent ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 8: Experiment with threshold ──────────────────────
// Create two graph tools with different thresholds (0.5 vs 0.85).
// Ask the same question with each and compare result breadth.

export async function testThreshold() {
  console.log('--- Threshold Comparison ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── Run all tests ───────────────────────────────────────────
export async function runTest() {
  console.log('=== Graph RAG ===\n');

  await testCompareRetrieval();
  console.log('\n');
  await testChainQuery();
  console.log('\n');
  await testHybridAgent();
  console.log('\n');
  await testThreshold();
}
