/**
 * MODULE 36: RAG Agents — SOLUTION
 */

import { Agent } from '@mastra/core/agent';
import { Mastra } from '@mastra/core/mastra';
import { MDocument, createVectorQueryTool } from '@mastra/rag';
import { embedMany } from 'ai';
import { ModelRouterEmbeddingModel } from '@mastra/core/llm';
import { LibSQLVector } from '@mastra/core/vector/libsql';

const embeddingModel = new ModelRouterEmbeddingModel('openai/text-embedding-3-small');

const knowledgeBase = `
# Mastra Framework

## Agents
Agents in Mastra wrap an LLM with instructions, tools, and memory. They handle open-ended tasks where the exact steps aren't known in advance. Agents reason about requests, pick tools, and iterate until they produce a final answer. You create agents with the Agent class, providing an id, instructions, model, and optional tools.

## Tools
Tools give agents the ability to perform actions. Each tool has an id, description, inputSchema, outputSchema, and execute function. The description is critical — it tells the agent WHEN to use the tool. Tools can call external APIs, query databases, or perform computations.

## Workflows
Workflows are for deterministic step-by-step processes. Each step has an inputSchema and outputSchema. Steps can run in sequence with .then(), in parallel with .parallel(), or conditionally with .branch(). Workflows support suspend and resume for human-in-the-loop patterns.

## Memory
Memory gives agents persistent context across conversations. It supports threads (conversations), working memory (structured state), semantic recall (vector search over past messages), and observational memory (automatic reflection). Memory processors control how context is built.

## Streaming
Streaming delivers tokens incrementally for real-time user experiences. Agents use .stream() to return textStream, tools can write progress via context.writer, and workflows emit lifecycle events. Agent streams can be piped through tools and workflow steps.

## RAG
RAG (Retrieval-Augmented Generation) enhances LLM outputs with your own data. The pipeline is: document → chunk → embed → store → query. Mastra supports 9 chunking strategies, multiple embedding providers, and 14+ vector databases. Agents can query vector stores directly with createVectorQueryTool.
`;

// ─── TODO 1: Set up the knowledge base ───────────────────────
let store: LibSQLVector;
let mastraInstance: Mastra;

async function setupKnowledgeBase() {
  const doc = MDocument.fromMarkdown(knowledgeBase);
  const chunks = await doc.chunk({ strategy: 'markdown', size: 300 });

  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: chunks.map(c => c.text),
  });

  store = new LibSQLVector({ url: 'file:./rag-agent.db' });
  await store.createIndex({ indexName: 'knowledge', dimension: 1536 });
  await store.upsert({
    indexName: 'knowledge',
    vectors: embeddings,
    metadata: chunks.map(c => ({ text: c.text })),
  });

  console.log(`Knowledge base: ${chunks.length} chunks stored`);
  return store;
}

// ─── TODO 2: Create a vector query tool ──────────────────────
const vectorQueryTool = createVectorQueryTool({
  vectorStoreName: 'knowledgeStore',
  indexName: 'knowledge',
  model: embeddingModel,
});

// ─── TODO 4: Create a RAG agent ─────────────────────────────
export const ragAgent = new Agent({
  id: 'rag-agent',
  name: 'Knowledge Base Agent',
  instructions: `
    You answer questions about the Mastra framework.
    Use the vector query tool to search the knowledge base before answering.
    Base your answers on the retrieved context — do not make up information.
    If the context doesn't contain enough information, say so clearly.
    Keep answers concise and direct.
  `,
  model: 'anthropic/claude-sonnet-4-5',
  tools: { vectorQueryTool },
});

// ─── TODO 5: Test the RAG agent ──────────────────────────────
export async function testRAGAgent() {
  console.log('--- RAG Agent ---');

  // Set up
  const store = await setupKnowledgeBase();

  // TODO 3: Create Mastra instance
  mastraInstance = new Mastra({
    vectors: { knowledgeStore: store },
    agents: { ragAgent },
  });

  const agent = mastraInstance.getAgent('ragAgent');
  const response = await agent.generate('What are agents in Mastra and how do they work?');

  console.log('Q: What are agents in Mastra and how do they work?');
  console.log('A:', response.text);
  console.log('\nSteps:', response.steps?.length);
  console.log('Tool calls:', response.steps?.flatMap(s => s.toolCalls || []).map(tc => tc.toolName));
}

// ─── TODO 6: Stream the RAG agent ───────────────────────────
export async function testRAGStream() {
  console.log('--- RAG Agent Streaming ---');

  const agent = mastraInstance.getAgent('ragAgent');
  const stream = await agent.stream('How do workflows differ from agents?');

  for await (const chunk of stream) {
    switch (chunk.type) {
      case 'tool-call':
        console.log(`\n[SEARCHING] ${chunk.payload.toolName}`);
        break;
      case 'tool-result':
        console.log(`[FOUND CONTEXT] ${JSON.stringify(chunk.payload.result).slice(0, 80)}...`);
        break;
      case 'text-delta':
        process.stdout.write(chunk.payload.textDelta);
        break;
    }
  }
}

// ─── TODO 7: Multiple questions ──────────────────────────────
export async function testMultipleQuestions() {
  console.log('--- Multiple Questions ---');

  const agent = mastraInstance.getAgent('ragAgent');
  const questions = [
    'What chunking strategies does Mastra support?',
    'How does memory work in Mastra?',
    'What is streaming used for?',
  ];

  for (const question of questions) {
    const response = await agent.generate(question);
    console.log(`\nQ: ${question}`);
    console.log(`A: ${response.text.slice(0, 150)}...`);
    console.log(`  (Used ${response.steps?.flatMap(s => s.toolCalls || []).length || 0} tool calls)`);
  }
}

// ─── Run all tests ───────────────────────────────────────────
export async function runTest() {
  console.log('=== RAG Agents ===\n');

  await testRAGAgent();
  console.log('\n\n');
  await testRAGStream();
  console.log('\n\n');
  await testMultipleQuestions();
}
