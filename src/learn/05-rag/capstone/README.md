# Capstone 5: AI Knowledge Base

Build a full-stack **AI Knowledge Base** using Express + React + shadcn/ui + AI SDK, applying everything from Section 5 (Modules 1-8).

## What you'll build

A web app where users upload documents, search them with AI, and get grounded answers:
1. Upload documents (text, markdown, HTML) and process them (Module 1)
2. Auto-select chunking strategy per format (Module 2)
3. Embed chunks and store in a vector database (Modules 3, 4)
4. Agent retrieves relevant context for user questions (Modules 5, 6)
5. Graph RAG follows connections for complex queries (Module 7)
6. Re-ranking improves precision for ambiguous questions (Module 8)

## Concepts practiced

| Module | Concept | How it's used |
|--------|---------|---------------|
| 1 | RAG pipeline, MDocument | Document upload and processing |
| 2 | Chunking strategies | Auto-select strategy by file type |
| 3 | Embeddings, dimensions | Generate and manage embeddings |
| 4 | Vector databases, metadata | Store with metadata, delete old docs |
| 5 | Retrieval, metadata filters | Search with filters (source, date) |
| 6 | RAG agents, vector query tool | Agent-driven retrieval |
| 7 | Graph RAG | Follow connections between documents |
| 8 | Re-ranking | Precision refinement |

## Tech stack

- **Backend**: Express.js + Mastra RAG + LibSQLVector
- **Frontend**: Vite + React + shadcn/ui
- **Streaming**: AI SDK for chat, REST for upload/search

## Project structure

```
capstone-5-knowledge-base/
├── server/
│   ├── index.ts
│   ├── routes/
│   │   ├── upload.ts               ← POST /api/upload — ingest documents
│   │   ├── chat.ts                 ← POST /api/chat — RAG agent stream
│   │   ├── documents.ts            ← GET/DELETE /api/documents
│   │   └── search.ts               ← POST /api/search — direct vector search
│   └── mastra/
│       ├── index.ts                ← Mastra with vectors registered
│       ├── agents/
│       │   └── knowledge-agent.ts  ← Agent with vector + graph tools
│       ├── tools/
│       │   ├── vector-query.ts     ← createVectorQueryTool
│       │   └── graph-query.ts      ← createGraphRAGTool
│       └── lib/
│           ├── ingest.ts           ← Document processing pipeline
│           └── reranker.ts         ← Re-ranking configuration
├── client/
│   ├── src/
│   │   ├── App.tsx                 ← Main layout (sidebar + chat)
│   │   ├── components/
│   │   │   ├── ui/                 ← shadcn (button, card, input, badge, tabs, dialog, dropdown-menu)
│   │   │   ├── document-upload.tsx ← Drag-and-drop file upload
│   │   │   ├── document-list.tsx   ← List uploaded documents
│   │   │   ├── chat-interface.tsx  ← Ask questions, see answers
│   │   │   ├── source-citations.tsx ← Show which chunks were used
│   │   │   └── search-mode.tsx     ← Toggle: vector / graph / hybrid
├── package.json
└── tsconfig.json
```

## Step-by-step instructions

### 1. Backend: Document ingestion

**server/mastra/lib/ingest.ts**
```typescript
// TODO: Create ingestDocument(content, format, metadata)
// 1. MDocument.fromText/fromMarkdown/fromHTML based on format
// 2. Auto-select chunking strategy: 'markdown' for .md, 'html' for .html, 'recursive' for .txt
// 3. Chunk with size: 512, overlap: 50
// 4. embedMany() with ModelRouterEmbeddingModel('openai/text-embedding-3-small')
// 5. vector.upsert() with metadata: { text, source, format, uploadedAt, docId }
// 6. Return { chunksCreated, docId }
```

### 2. Backend: RAG agent with both tools

**server/mastra/agents/knowledge-agent.ts**
```typescript
// TODO: Knowledge agent with vector + graph query tools
// - createVectorQueryTool({ vectorStoreName, indexName, model })
// - createGraphRAGTool({ vectorStoreName, indexName, model, graphOptions: { threshold: 0.7 } })
// - Instructions: use vectorQueryTool for simple queries, graphQueryTool for relationships
// - Include LIBSQL_PROMPT for filter syntax guidance
```

### 3. Backend: Express routes

**server/routes/upload.ts**
```typescript
// TODO: POST /api/upload
// Accept multipart form data (file + metadata)
// Call ingestDocument() and return chunk count
```

**server/routes/chat.ts**
```typescript
// TODO: POST /api/chat
// Stream RAG agent response with AI SDK format
```

**server/routes/search.ts**
```typescript
// TODO: POST /api/search — direct vector search (no agent)
// Accept { query, topK, filters, mode: 'vector' | 'graph' }
// Optionally re-rank results before returning
```

### 4. Frontend: Document upload with shadcn

**client/src/components/document-upload.tsx**
```tsx
// TODO: Build using shadcn Card + Button + Dialog
// 1. Drag-and-drop zone or file picker
// 2. Accept .txt, .md, .html files
// 3. Show upload progress
// 4. Display chunk count after processing
```

**client/src/components/chat-interface.tsx**
```tsx
// TODO: Build using shadcn Card + Input + ScrollArea
// 1. useChat({ api: 'http://localhost:3001/api/chat' })
// 2. Show streaming agent responses
// 3. Parse tool-result parts to extract source citations
// 4. Render citations in SourceCitations component
```

**client/src/components/search-mode.tsx**
```tsx
// TODO: Build using shadcn DropdownMenu
// Toggle between: Vector (fast), Graph (relationships), Hybrid (both)
// Pass mode to agent via request body
```

**client/src/components/source-citations.tsx**
```tsx
// TODO: Build using shadcn Badge + Card
// Show which document chunks were used to answer
// Display: source filename, similarity score, text preview
// Click to expand full chunk text
```

## How to run

```bash
cd server && npx tsx index.ts
cd client && pnpm dev
```

## Test scenarios

1. **Single document**: Upload a markdown file → ask questions → get cited answers
2. **Multi-document**: Upload 3+ files → ask cross-document questions → graph RAG finds connections
3. **Filtered search**: Upload docs with categories → filter by category
4. **Re-ranking**: Ask ambiguous question → compare with/without re-ranking
5. **Document management**: Upload, query, delete a document → verify removal

## Bonus challenges

1. Add PDF support using a PDF parser
2. Add confidence meter showing similarity scores of retrieved chunks
3. Add conversation memory so follow-up questions use prior context
4. Add visual knowledge graph showing chunk connections (for graph RAG)
5. Add metadata-based date filtering: "What was uploaded this week?"
6. Add shadcn DataTable for document list with sorting and filtering
