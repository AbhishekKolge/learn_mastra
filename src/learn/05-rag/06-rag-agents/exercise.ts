/**
 * ============================================================
 *  MODULE 36: RAG Agents
 * ============================================================
 *
 *  THEORY
 *  ------
 *  So far we've done retrieval manually — embed query, call
 *  store.query(), inject results into a prompt. But what if
 *  the AGENT could do this itself?
 *
 *  Mastra provides `createVectorQueryTool` — a tool that lets
 *  agents query vector databases directly. The agent decides
 *  WHEN to search, WHAT to search for, and how to use the results.
 *
 *  createVectorQueryTool:
 *    import { createVectorQueryTool } from '@mastra/rag'
 *
 *    const vectorQueryTool = createVectorQueryTool({
 *      vectorStoreName: 'myStore',    // name used in Mastra instance
 *      indexName: 'embeddings',       // which index to query
 *      model: embeddingModel,         // embedding model for queries
 *    })
 *
 *  HOW IT WORKS:
 *    1. User asks the agent a question
 *    2. Agent decides to use the vector query tool
 *    3. Tool embeds the query text automatically
 *    4. Tool searches the vector database
 *    5. Results (with metadata.text) are returned to the agent
 *    6. Agent uses the context to generate a grounded answer
 *
 *  REGISTERING VECTOR STORES:
 *    For the tool to find the store by name, register it in
 *    the Mastra instance:
 *
 *    new Mastra({
 *      vectors: { myStore: vectorStoreInstance },
 *    })
 *
 *  VECTOR STORE PROMPTS:
 *    Each vector store exports a prompt string that tells the
 *    agent the valid filter syntax. Include it in instructions:
 *
 *    import { LIBSQL_PROMPT } from '@mastra/libsql'
 *
 *    new Agent({
 *      instructions: `Answer questions using context.
 *        ${LIBSQL_PROMPT}`,
 *      tools: { vectorQueryTool },
 *    })
 *
 *  TOOL NAME AND DESCRIPTION:
 *    The tool's name and description help the agent know when
 *    to use it. Customize them for your domain:
 *
 *    createVectorQueryTool({
 *      id: 'search-knowledge-base',
 *      description: 'Search the company documentation to find
 *                    information about products and features.',
 *      vectorStoreName: 'docs',
 *      indexName: 'company_docs',
 *      model: embeddingModel,
 *    })
 *
 *  DATABASE-SPECIFIC CONFIG:
 *    Some stores support extra query-time options:
 *
 *    createVectorQueryTool({
 *      vectorStoreName: 'pgVector',
 *      indexName: 'docs',
 *      model: embeddingModel,
 *      databaseConfig: {
 *        pgvector: {
 *          minScore: 0.7,   // filter low-quality results
 *          ef: 200,         // HNSW search parameter
 *        },
 *      },
 *    })
 *
 *  EXERCISE
 *  --------
 *  Build a RAG agent that can answer questions about a knowledge
 *  base using createVectorQueryTool.
 * ============================================================
 */

import { Agent } from '@mastra/core/agent';
import { Mastra } from '@mastra/core/mastra';
import { MDocument } from '@mastra/rag';
import { createVectorQueryTool } from '@mastra/rag';
import { embedMany } from 'ai';
import { ModelRouterEmbeddingModel } from '@mastra/core/llm';
import { LibSQLVector } from '@mastra/core/vector/libsql';

const embeddingModel = new ModelRouterEmbeddingModel('openai/text-embedding-3-small');

// ─── Knowledge base content ──────────────────────────────────
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
// Process the knowledge base: chunk, embed, store in LibSQLVector.
//
// const doc = MDocument.fromMarkdown(knowledgeBase)
// const chunks = await doc.chunk({ strategy: 'markdown', size: 300 })
// const { embeddings } = await embedMany({ model: embeddingModel, values: chunks.map(c => c.text) })
// const store = new LibSQLVector({ url: 'file:./rag-agent.db' })
// await store.createIndex({ indexName: 'knowledge', dimension: 1536 })
// await store.upsert({
//   indexName: 'knowledge',
//   vectors: embeddings,
//   metadata: chunks.map(c => ({ text: c.text })),
// })

async function setupKnowledgeBase(): Promise<LibSQLVector> {
  // TODO: implement
  return undefined as any;
}

// ─── TODO 2: Create a vector query tool ──────────────────────
// createVectorQueryTool({
//   vectorStoreName: 'knowledgeStore',
//   indexName: 'knowledge',
//   model: embeddingModel,
// })

const vectorQueryTool = undefined as any; // ← replace

// ─── TODO 3: Create a Mastra instance with the vector store ──
// new Mastra({
//   vectors: { knowledgeStore: store },
// })

// ─── TODO 4: Create a RAG agent ─────────────────────────────
// new Agent({
//   id: 'rag-agent',
//   name: 'Knowledge Base Agent',
//   instructions: `You answer questions about the Mastra framework.
//     Use the vector query tool to search the knowledge base.
//     Base your answers on the retrieved context.
//     If the context doesn't contain enough information, say so.`,
//   model: 'anthropic/claude-sonnet-4-5',
//   tools: { vectorQueryTool },
// })

export const ragAgent = undefined as any; // ← replace

// ─── TODO 5: Test the RAG agent ──────────────────────────────
// Ask the agent questions about the knowledge base.
// The agent should use the tool to retrieve context first.
//
// Questions to try:
//   'What are agents in Mastra?'
//   'How do workflows differ from agents?'
//   'What chunking strategies does Mastra support?'

export async function testRAGAgent() {
  console.log('--- RAG Agent ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 6: Stream the RAG agent ───────────────────────────
// Use agent.stream() and observe both tool-call events
// (the vector query) and text-delta events (the answer).

export async function testRAGStream() {
  console.log('--- RAG Agent Streaming ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 7: Multiple questions ──────────────────────────────
// Ask 3 different questions and observe how the agent retrieves
// different context for each one.

export async function testMultipleQuestions() {
  console.log('--- Multiple Questions ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── Run all tests ───────────────────────────────────────────
export async function runTest() {
  console.log('=== RAG Agents ===\n');

  await testRAGAgent();
  console.log('\n');
  await testRAGStream();
  console.log('\n');
  await testMultipleQuestions();
}
