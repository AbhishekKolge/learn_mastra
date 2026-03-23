# Capstone 2: AI Personal Assistant

Build a full-stack **Personal Assistant** using Express + React + shadcn/ui + AI SDK, applying everything from Section 2 (Modules 1-7).

## What you'll build

A chat app where the AI remembers your name, preferences, and past conversations:
- Persistent message history across page refreshes
- Working memory tracks user profile (name, interests, goals)
- Semantic recall finds relevant past messages by meaning
- Thread sidebar shows all conversations with auto-titles
- Memory processors ensure safety (abort = no save)

## Concepts practiced

| Module | Concept | How it's used |
|--------|---------|---------------|
| 1 | Memory basics, threads, resources | Core memory setup with thread/resource IDs |
| 2 | Storage, thread metadata, auto-title | LibSQLStore, generateTitle, thread list |
| 3 | Message history, recall, listThreads | Fetch history for UI, query past messages |
| 4 | Working memory (template) | Track user name, preferences, goals |
| 5 | Observational memory (optional) | Long conversation compression |
| 6 | Semantic recall | Find relevant past messages by meaning |
| 7 | Memory processors | Token limiting, abort safety |

## Tech stack

- **Backend**: Express.js + Mastra + LibSQL storage
- **Frontend**: Vite + React + shadcn/ui
- **Streaming**: AI SDK (`@ai-sdk/react` useChat)

## Project structure

```
capstone-2-assistant/
├── server/
│   ├── index.ts                    ← Express server
│   ├── routes/
│   │   ├── chat.ts                 ← POST /api/chat — stream with memory
│   │   └── threads.ts              ← GET /api/threads — list sidebar threads
│   └── mastra/
│       ├── index.ts                ← Mastra with LibSQLStore
│       └── agents/
│           └── assistant-agent.ts  ← Agent with full memory config
├── client/
│   ├── src/
│   │   ├── App.tsx                 ← Main layout (sidebar + chat)
│   │   ├── components/
│   │   │   ├── ui/                 ← shadcn (button, card, input, scroll-area, separator, sheet)
│   │   │   ├── thread-sidebar.tsx  ← Conversation list
│   │   │   ├── chat-area.tsx       ← Messages + input
│   │   │   ├── memory-panel.tsx    ← Show working memory state
│   │   │   └── new-thread-btn.tsx  ← Create new conversation
│   │   └── hooks/
│   │       └── use-threads.ts      ← Fetch and manage threads
├── package.json
└── tsconfig.json
```

## Step-by-step instructions

### 1. Project setup

```bash
mkdir capstone-2-assistant && cd capstone-2-assistant
pnpm init
pnpm add express cors @mastra/core @mastra/memory @mastra/libsql @mastra/ai-sdk zod
pnpm add -D typescript @types/express @types/cors tsx

pnpm create vite client --template react-ts
cd client && pnpm add @ai-sdk/react ai && cd ..
cd client && npx shadcn@latest init && cd ..
cd client && npx shadcn@latest add button card input scroll-area separator sheet avatar && cd ..
```

### 2. Backend: Memory-enabled agent

**server/mastra/agents/assistant-agent.ts**
```typescript
// TODO: Create a personal assistant with full memory
//
// import { Agent } from '@mastra/core/agent';
// import { Memory } from '@mastra/memory';
// import { LibSQLVector } from '@mastra/libsql';
// import { ModelRouterEmbeddingModel } from '@mastra/core/llm';
//
// const memory = new Memory({
//   vector: new LibSQLVector({ id: 'assistant-vector', url: 'file:./assistant.db' }),
//   embedder: new ModelRouterEmbeddingModel('openai/text-embedding-3-small'),
//   options: {
//     lastMessages: 20,
//     generateTitle: true,
//     semanticRecall: { topK: 3, messageRange: 2 },
//     workingMemory: {
//       enabled: true,
//       template: `
// ## User Profile
// - Name:
// - Location:
// - Interests:
// ## Current Context
// - Active Project:
// - Open Questions:
//       `,
//     },
//   },
// });
//
// export const assistantAgent = new Agent({
//   id: 'assistant',
//   name: 'Personal Assistant',
//   instructions: 'Remember everything. Update working memory when you learn new facts.',
//   model: 'anthropic/claude-sonnet-4-5',
//   memory,
// });
```

### 3. Backend: Express routes

**server/routes/chat.ts**
```typescript
// TODO: POST /api/chat
// 1. Extract { messages, threadId, resourceId } from req.body
// 2. Get agent, call agent.stream(messages, { memory: { thread: threadId, resource: resourceId } })
// 3. Convert to AI SDK format and pipe as SSE response
```

**server/routes/threads.ts**
```typescript
// TODO: GET /api/threads?resourceId=...
// 1. Get agent memory: const memory = await agent.getMemory()
// 2. List threads: memory.listThreads({ filter: { resourceId }, orderBy: { field: 'createdAt', direction: 'DESC' } })
// 3. Return JSON array of threads (id, title, createdAt)
```

### 4. Frontend: Thread sidebar with shadcn

**client/src/components/thread-sidebar.tsx**
```tsx
// TODO: Build sidebar using shadcn Sheet + ScrollArea + Button
// 1. Fetch threads from GET /api/threads?resourceId=user-123
// 2. Render each thread as a Button with title + date
// 3. Click → switch threadId in parent state
// 4. "New Chat" button generates a new UUID threadId
// 5. Active thread highlighted with variant="secondary"
```

### 5. Frontend: Chat area with shadcn

**client/src/components/chat-area.tsx**
```tsx
// TODO: Build chat using shadcn Card + Input + ScrollArea + Avatar
// 1. useChat({ api: 'http://localhost:3001/api/chat' })
// 2. Pass threadId and resourceId via body
// 3. Render messages in ScrollArea with Avatar (user vs assistant)
// 4. Input at bottom with send Button
// 5. When threadId changes, clear and reload history
```

### 6. Frontend: Working memory panel

**client/src/components/memory-panel.tsx**
```tsx
// TODO: Show agent's working memory in a shadcn Sheet (slide-out panel)
// 1. Fetch from GET /api/memory?threadId=...&resourceId=...
// 2. Display the markdown template with filled values
// 3. Auto-refresh after each agent response
// 4. Highlight recently changed fields
```

## How to run

```bash
# Terminal 1
cd server && npx tsx index.ts

# Terminal 2
cd client && pnpm dev
```

## Test scenarios

1. **Introduce yourself**: "Hi, I'm Alex, a developer in Berlin" → working memory updates
2. **Cross-thread recall**: New thread → "What's my name?" → recalls "Alex" from working memory
3. **Semantic recall**: Mention a project early, chat about other topics, ask about it later → found by meaning
4. **Auto-titles**: Check sidebar — threads get auto-generated titles
5. **Thread switching**: Switch between threads → each has its own history

## Bonus challenges

1. Add observational memory for very long conversations (Module 5)
2. Add PII redaction output processor (Module 7 + Section 1 Module 6)
3. Add thread cloning: "Branch this conversation" button
4. Add message search with date range filtering using `recall()`
5. Add shadcn dark mode toggle with theme persistence
