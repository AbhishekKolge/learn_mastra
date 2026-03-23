# Capstone: AI Code Review App (Agents Section)

Build a full-stack **AI Code Review** app using everything from Modules 1-8.

## What you'll build

A Next.js app where users paste code, and a multi-agent system reviews it:
- **Reviewer Agent** — finds bugs and suggests improvements (Module 1, 2)
- **Security Agent** — checks for vulnerabilities (Module 2, 6)
- **Supervisor Agent** — coordinates both and returns structured output (Module 4, 3)
- Guardrails block prompt injection attempts (Module 6)
- Tool approval required before running "auto-fix" suggestions (Module 7)
- Streaming UI shows review in real-time (Module 1, AI SDK UI)

## Concepts practiced

| Module | Concept | How it's used |
|--------|---------|---------------|
| 1 | Agent, generate, stream | Core agent creation and invocation |
| 2 | Tools, toolChoice | Code analysis tool, lint tool |
| 3 | Structured output | Return typed `{ bugs, suggestions, score }` |
| 4 | Supervisor agents | Coordinator delegates to reviewer + security |
| 5 | Processors | Token limiter for large code inputs |
| 6 | Guardrails | Block injection in code input |
| 7 | Agent approval | Approve before auto-fixing code |
| 8 | Voice (optional) | Speak the review summary aloud |

## Project structure

```
app/
├── api/
│   └── chat/
│       └── route.ts          ← handleChatStream + Next.js route
├── page.tsx                  ← Chat UI with useChat()
├── components/
│   ├── code-input.tsx        ← Code paste area
│   ├── review-card.tsx       ← Structured review display
│   └── approval-dialog.tsx   ← Tool approval UI
src/
├── mastra/
│   ├── agents/
│   │   ├── reviewer-agent.ts
│   │   ├── security-agent.ts
│   │   └── supervisor-agent.ts
│   ├── tools/
│   │   ├── lint-tool.ts
│   │   └── autofix-tool.ts   ← requireApproval: true
│   └── index.ts
```

## Step-by-step instructions

### 1. Backend: Create the tools

**src/mastra/tools/lint-tool.ts**
```typescript
// TODO: Create a lint tool using createTool
// id: 'lint-code'
// description: 'Analyzes code for common issues and returns findings'
// inputSchema: { code: string, language: string }
// outputSchema: { issues: Array<{ line: number, message: string, severity: string }> }
// execute: Parse the code and find issues (can be simple pattern matching)
```

**src/mastra/tools/autofix-tool.ts**
```typescript
// TODO: Create an autofix tool with requireApproval: true
// id: 'autofix-code'
// description: 'Automatically fixes identified issues in code'
// requireApproval: true  ← human must approve before running
// inputSchema: { code: string, issues: Array<...> }
// outputSchema: { fixedCode: string, fixesApplied: string[] }
```

### 2. Backend: Create the agents

**src/mastra/agents/reviewer-agent.ts**
```typescript
// TODO: Create the Reviewer Agent
// - Has the lint-tool
// - Instructions: find bugs, suggest improvements, rate 1-10
// - Has a clear `description` for the supervisor
```

**src/mastra/agents/security-agent.ts**
```typescript
// TODO: Create the Security Agent
// - Instructions: check for XSS, SQL injection, secrets in code
// - Has a clear `description` for the supervisor
```

**src/mastra/agents/supervisor-agent.ts**
```typescript
// TODO: Create the Supervisor Agent
// - agents: [reviewerAgent, securityAgent]
// - Instructions: delegate review to reviewer, security check to security agent
// - Has the autofix-tool (with requireApproval)
// - Add PromptInjectionDetector as input processor (Module 6)
// - Add TokenLimiter as input processor (Module 5)
```

### 3. Backend: API route

**app/api/chat/route.ts**
```typescript
// TODO: Set up the Next.js route using handleChatStream
//
// import { handleChatStream } from '@mastra/ai-sdk';
// import { createUIMessageStreamResponse } from 'ai';
// import { mastra } from '@/src/mastra';
//
// export async function POST(req: Request) {
//   const params = await req.json();
//   const stream = await handleChatStream({
//     mastra,
//     agentId: 'supervisor-agent',
//     params,
//   });
//   return createUIMessageStreamResponse({ stream });
// }
```

### 4. Frontend: Chat UI

**app/page.tsx**
```tsx
// TODO: Build the chat interface using useChat()
//
// import { useChat } from '@ai-sdk/react';
// import { DefaultChatTransport } from 'ai';
//
// Key features to implement:
// 1. Code input area (textarea or code editor)
// 2. Send code for review via sendMessage()
// 3. Render message.parts:
//    - part.type === 'text' → show agent's text response
//    - part.type === 'tool-lintTool' → show lint results as a list
//    - part.type === 'tool-autofixTool' → show approval dialog
//       state === 'input-available' → "Agent wants to autofix. Approve?"
//       state === 'output-available' → show fixed code
// 4. Handle tool-call-approval for autofix (Module 7)
```

### 5. Frontend: Structured review display

**app/components/review-card.tsx**
```tsx
// TODO: Create a ReviewCard component
// Props: { bugs: string[], suggestions: string[], score: number }
// Display:
//   - Score badge (color based on 1-10)
//   - Bug list with severity icons
//   - Suggestion list
//   - "Auto-fix" button that triggers the autofix tool
```

## How to run

```bash
# Install AI SDK packages
pnpm add @mastra/ai-sdk @ai-sdk/react ai

# Run Next.js dev server
pnpm dev

# In another terminal, run Mastra (if using Mastra server)
# pnpm run mastra:dev
```

## Bonus challenges

1. Add voice: let the agent speak the review summary (Module 8)
2. Add structured output: return `{ bugs, suggestions, score }` as a typed object (Module 3)
3. Add delegation hooks: log which agent is reviewing, reject after 5 iterations (Module 4)
4. Add custom stream events: show "Analyzing security..." progress (Module 5 - writer.custom)
