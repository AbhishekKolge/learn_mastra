/**
 * MODULE 37: Graph RAG — SOLUTION
 */

import { Agent } from '@mastra/core/agent';
import { Mastra } from '@mastra/core/mastra';
import { MDocument, createVectorQueryTool, createGraphRAGTool } from '@mastra/rag';
import { embedMany } from 'ai';
import { ModelRouterEmbeddingModel } from '@mastra/core/llm';
import { LibSQLVector } from '@mastra/core/vector/libsql';

const embeddingModel = new ModelRouterEmbeddingModel('openai/text-embedding-3-small');

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

let store: LibSQLVector;
let mastraInstance: Mastra;

// ─── TODO 1: Set up the knowledge base ───────────────────────
async function setupKnowledgeBase(): Promise<LibSQLVector> {
  store = new LibSQLVector({ url: 'file:./graph-rag.db' });
  await store.createIndex({ indexName: 'graph_docs', dimension: 1536 });

  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: documents,
  });

  await store.upsert({
    indexName: 'graph_docs',
    vectors: embeddings,
    metadata: documents.map(text => ({ text })),
  });

  console.log(`Stored ${documents.length} interconnected documents`);
  return store;
}

// ─── TODO 2: Create a standard vector query tool ─────────────
const vectorQueryTool = createVectorQueryTool({
  vectorStoreName: 'graphStore',
  indexName: 'graph_docs',
  model: embeddingModel,
});

// ─── TODO 3: Create a graph RAG tool ─────────────────────────
const graphQueryTool = createGraphRAGTool({
  vectorStoreName: 'graphStore',
  indexName: 'graph_docs',
  model: embeddingModel,
  graphOptions: {
    threshold: 0.7,
    dimension: 1536,
  },
});

// ─── TODO 4: Create agents ──────────────────────────────────
export const standardAgent = new Agent({
  id: 'standard-rag',
  name: 'Standard RAG Agent',
  instructions: `Answer questions using the vector query tool to search the knowledge base.
    Base your answers on retrieved context. Be specific and cite the information you found.`,
  model: 'anthropic/claude-sonnet-4-5',
  tools: { vectorQueryTool },
});

export const graphAgent = new Agent({
  id: 'graph-rag',
  name: 'Graph RAG Agent',
  instructions: `Answer questions using the graph query tool to search the knowledge base.
    This tool follows relationships between documents. Base your answers on all retrieved context,
    including connected information. Explain the chain of connections you found.`,
  model: 'anthropic/claude-sonnet-4-5',
  tools: { graphQueryTool },
});

export const hybridAgent = new Agent({
  id: 'hybrid-rag',
  name: 'Hybrid RAG Agent',
  instructions: `You have two search tools:
    - vectorQueryTool: Simple semantic search. Use for straightforward fact-finding.
    - graphQueryTool: Graph-based search that follows relationships. Use when you need to understand connections between topics.
    Choose the right tool based on the query complexity.`,
  model: 'anthropic/claude-sonnet-4-5',
  tools: { vectorQueryTool, graphQueryTool },
});

async function setup() {
  const store = await setupKnowledgeBase();
  mastraInstance = new Mastra({
    vectors: { graphStore: store },
    agents: { standardAgent, graphAgent, hybridAgent },
  });
}

// ─── TODO 5: Compare standard vs graph retrieval ─────────────
export async function testCompareRetrieval() {
  console.log('--- Standard vs Graph RAG ---');
  await setup();

  const question = 'How does the new transit system affect local businesses?';

  const stdAgent = mastraInstance.getAgent('standardAgent');
  const grpAgent = mastraInstance.getAgent('graphAgent');

  console.log(`Q: ${question}\n`);

  const stdResponse = await stdAgent.generate(question);
  console.log('STANDARD RAG:');
  console.log(`  ${stdResponse.text.slice(0, 200)}...`);

  const grpResponse = await grpAgent.generate(question);
  console.log('\nGRAPH RAG:');
  console.log(`  ${grpResponse.text.slice(0, 200)}...`);

  console.log('\nNote: Graph RAG should connect transit → traffic reduction → business impact');
}

// ─── TODO 6: Test with a chain-of-connections query ──────────
export async function testChainQuery() {
  console.log('--- Chain of Connections ---');

  const question = 'How does the infrastructure bond ultimately affect renters?';
  const grpAgent = mastraInstance.getAgent('graphAgent');

  console.log(`Q: ${question}\n`);
  const response = await grpAgent.generate(question);
  console.log('Graph RAG answer:');
  console.log(`  ${response.text.slice(0, 300)}...`);
  console.log('\nExpected chain: bond → property tax → property values → rents');
}

// ─── TODO 7: Test the hybrid agent ──────────────────────────
export async function testHybridAgent() {
  console.log('--- Hybrid Agent ---');

  const hybrid = mastraInstance.getAgent('hybridAgent');

  // Simple fact query
  const simple = await hybrid.generate('How many passengers can an electric bus carry?');
  const simpleTools = simple.steps?.flatMap(s => s.toolCalls || []).map(tc => tc.toolName) || [];
  console.log('Simple query — tool used:', simpleTools.join(', '));
  console.log(`  A: ${simple.text.slice(0, 100)}...`);

  // Complex relationship query
  const complex = await hybrid.generate('What is the full economic impact chain of the transit project?');
  const complexTools = complex.steps?.flatMap(s => s.toolCalls || []).map(tc => tc.toolName) || [];
  console.log('\nComplex query — tool used:', complexTools.join(', '));
  console.log(`  A: ${complex.text.slice(0, 200)}...`);
}

// ─── TODO 8: Experiment with threshold ──────────────────────
export async function testThreshold() {
  console.log('--- Threshold Comparison ---');

  const broadTool = createGraphRAGTool({
    vectorStoreName: 'graphStore',
    indexName: 'graph_docs',
    model: embeddingModel,
    graphOptions: { threshold: 0.5, dimension: 1536 },
  });

  const strictTool = createGraphRAGTool({
    vectorStoreName: 'graphStore',
    indexName: 'graph_docs',
    model: embeddingModel,
    graphOptions: { threshold: 0.85, dimension: 1536 },
  });

  const broadAgent = new Agent({
    id: 'broad-graph',
    instructions: 'Answer using the graph tool. Be thorough.',
    model: 'anthropic/claude-sonnet-4-5',
    tools: { graphQueryTool: broadTool },
  });

  const strictAgent = new Agent({
    id: 'strict-graph',
    instructions: 'Answer using the graph tool. Be precise.',
    model: 'anthropic/claude-sonnet-4-5',
    tools: { graphQueryTool: strictTool },
  });

  const broadMastra = new Mastra({
    vectors: { graphStore: store },
    agents: { broadAgent, strictAgent },
  });

  const question = 'How are the transit system, property values, and businesses connected?';

  const broadResponse = await broadMastra.getAgent('broadAgent').generate(question);
  console.log('Broad (threshold=0.5):');
  console.log(`  ${broadResponse.text.slice(0, 200)}...`);

  const strictResponse = await broadMastra.getAgent('strictAgent').generate(question);
  console.log('\nStrict (threshold=0.85):');
  console.log(`  ${strictResponse.text.slice(0, 200)}...`);

  console.log('\nNote: Broad threshold finds more connections but may include weaker ones');
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
