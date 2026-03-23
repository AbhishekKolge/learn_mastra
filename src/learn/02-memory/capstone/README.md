# Capstone: AI Personal Assistant (Memory Section)

Build a full-stack **Personal Assistant** that remembers you across conversations, using everything from Modules 9-15.

## What you'll build

A Next.js chat app where the AI remembers your name, preferences, and past conversations:
- Persistent message history across page refreshes (Module 9, 11)
- Working memory that tracks user profile (Module 12)
- Semantic recall finds relevant past messages (Module 14)
- Thread sidebar showing all conversations (Module 10, 11)
- Auto-generated thread titles (Module 10)
- Memory processors ensure safety (Module 15)

## Concepts practiced

| Module | Concept | How it's used |
|--------|---------|---------------|
| 9 | Memory basics, threads, resources | Core memory setup with thread/resource IDs |
| 10 | Storage, thread metadata, auto-title | LibSQLStore, generateTitle, thread list |
| 11 | Message history, recall, listThreads | Fetch history for UI, query past messages |
| 12 | Working memory (template) | Track user name, preferences, goals |
| 13 | Observational memory (optional) | Long conversation compression |
| 14 | Semantic recall | Find relevant past messages by meaning |
| 15 | Memory processors | Token limiting, abort safety |

## Project structure

```
app/
├── api/
│   ├── chat/
│   │   └── route.ts            ← handleChatStream with memory
│   └── threads/
│       └── route.ts            ← GET: list threads for sidebar
├── page.tsx                    ← Main chat layout
├── components/
│   ├── thread-sidebar.tsx      ← List of conversations
│   ├── chat-area.tsx           ← Messages + input
│   ├── memory-panel.tsx        ← Show working memory state
│   └── new-thread-button.tsx   ← Create new conversation
src/
├── mastra/
│   ├── agents/
│   │   └── assistant-agent.ts  ← Agent with full memory config
│   └── index.ts
```

## Step-by-step instructions

### 1. Backend: Create the memory-enabled agent

**src/mastra/agents/assistant-agent.ts**
```typescript
// TODO: Create a personal assistant with full memory
//
// import { Agent } from '@mastra/core/agent';
// import { Memory } from '@mastra/memory';
// import { LibSQLStore, LibSQLVector } from '@mastra/libsql';
// import { ModelRouterEmbeddingModel } from '@mastra/core/llm';
//
// const memory = new Memory({
//   storage: new LibSQLStore({ id: 'assistant-storage', url: 'file:./assistant.db' }),
//   vector: new LibSQLVector({ id: 'assistant-vector', url: 'file:./assistant.db' }),
//   embedder: new ModelRouterEmbeddingModel('openai/text-embedding-3-small'),
//   options: {
//     lastMessages: 20,
//     generateTitle: true,                         // Module 10
//     semanticRecall: { topK: 3, messageRange: 2 }, // Module 14
//     workingMemory: {                              // Module 12
//       enabled: true,
//       template: `
// ## User Profile
// - Name:
// - Location:
// - Interests:
// - Preferred Communication Style:
// ## Current Context
// - Active Project:
// - Key Deadlines:
// - Open Questions:
//       `,
//     },
//   },
// });
//
// export const assistantAgent = new Agent({
//   id: 'assistant',
//   name: 'Personal Assistant',
//   instructions: `You are a personal assistant with excellent memory.
//     - Remember everything the user tells you
//     - Update working memory when you learn new facts
//     - Refer back to past conversations naturally
//     - Use the user's name once you know it`,
//   model: 'anthropic/claude-sonnet-4-5',
//   memory,
// });
```

### 2. Backend: Chat API route with memory

**app/api/chat/route.ts**
```typescript
// TODO: Create the chat route that passes memory config
//
// import { handleChatStream } from '@mastra/ai-sdk';
// import { createUIMessageStreamResponse } from 'ai';
// import { mastra } from '@/src/mastra';
//
// export async function POST(req: Request) {
//   const { messages, threadId, resourceId } = await req.json();
//
//   const stream = await handleChatStream({
//     mastra,
//     agentId: 'assistant',
//     params: {
//       messages,
//       memory: {
//         thread: { id: threadId },
//         resource: resourceId,
//       },
//     },
//   });
//   return createUIMessageStreamResponse({ stream });
// }
```

### 3. Backend: Threads API for sidebar

**app/api/threads/route.ts**
```typescript
// TODO: Create a GET endpoint that lists threads for the sidebar
//
// import { mastra } from '@/src/mastra';
//
// export async function GET(req: Request) {
//   const { searchParams } = new URL(req.url);
//   const resourceId = searchParams.get('resourceId') || 'default-user';
//
//   const agent = mastra.getAgent('assistant');
//   const memory = await agent.getMemory();
//
//   const result = await memory!.listThreads({
//     filter: { resourceId },
//     orderBy: { field: 'createdAt', direction: 'DESC' },
//   });
//
//   return Response.json(result.threads);
// }
```

### 4. Frontend: Thread sidebar

**app/components/thread-sidebar.tsx**
```tsx
// TODO: Build a sidebar showing all threads
//
// Features:
// 1. Fetch threads from /api/threads?resourceId=...
// 2. Show thread title (auto-generated!) and date
// 3. Click a thread to switch to it (update threadId in state)
// 4. "New Chat" button generates a new threadId (e.g., uuid)
// 5. Current thread highlighted
```

### 5. Frontend: Chat area with useChat()

**app/components/chat-area.tsx**
```tsx
// TODO: Build the chat interface
//
// import { useChat } from '@ai-sdk/react';
// import { DefaultChatTransport } from 'ai';
//
// Key features:
// 1. useChat() with transport pointing to /api/chat
// 2. Pass threadId and resourceId via prepareSendMessagesRequest:
//    prepareSendMessagesRequest: ({ messages }) => ({
//      body: {
//        messages,
//        threadId: currentThreadId,
//        resourceId: 'user-123',
//      },
//    })
// 3. When threadId changes, load history from /api/threads/[id]/messages
//    and set as initialMessages (use toAISdkV5Messages to convert)
// 4. Show streaming responses
// 5. Auto-scroll to bottom
```

### 6. Frontend: Working memory panel (optional)

**app/components/memory-panel.tsx**
```tsx
// TODO: Show the agent's working memory state
//
// Create a GET endpoint that returns current working memory:
//   const memory = await agent.getMemory();
//   const wm = await memory.getWorkingMemory({ threadId, resourceId });
//
// Display it in a collapsible side panel so you can SEE
// the agent updating its profile of you in real-time.
```

## How to run

```bash
pnpm add @mastra/ai-sdk @ai-sdk/react ai @mastra/memory @mastra/libsql
pnpm dev
```

## Test scenarios

1. **Introduce yourself**: "Hi, I'm Alex. I'm a developer in Berlin."
   → Working memory should update with name + location
2. **New thread, same user**: Start a new chat and ask "What's my name?"
   → Agent should recall "Alex" from working memory (cross-thread!)
3. **Old topic recall**: Mention something early, chat about other topics,
   then ask about it later → Semantic recall should find it
4. **Thread titles**: Check sidebar — threads should have auto-generated titles

## Bonus challenges

1. Add observational memory for long conversations (Module 13)
2. Add PII redaction on output to mask emails/phones (Module 15, 6)
3. Add pagination to thread messages (Module 11)
4. Add thread cloning: "Branch this conversation" button (Module 11)
