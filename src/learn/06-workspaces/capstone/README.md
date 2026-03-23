# Capstone 6: AI Dev Assistant

Build a full-stack **AI Development Assistant** using Express + React + shadcn/ui + AI SDK, applying everything from Section 6 (Modules 1-7).

## What you'll build

An IDE-like web app where an AI agent manages a project workspace:
1. Agent has a persistent workspace with filesystem + sandbox (Module 1)
2. Users browse and edit files through the agent (Module 2)
3. Agent runs commands and manages background dev servers (Module 3)
4. Write safety and tool approvals protect against accidents (Module 4)
5. Agent searches code and docs via BM25 search (Module 5)
6. Agent loads skills for code review, testing, documentation (Module 6)
7. Multi-agent setup with different permissions per role (Module 7)

## Concepts practiced

| Module | Concept | How it's used |
|--------|---------|---------------|
| 1 | Workspace basics, global vs agent-level | Project workspace setup |
| 2 | Filesystem, containment, read-only | File management with safety |
| 3 | Sandbox, background processes | Dev server management |
| 4 | Tool config, approval, read-before-write | Safety guardrails |
| 5 | BM25 search, auto-indexing | Code and doc search |
| 6 | Skills, SKILL.md, skill tools | Code review and testing skills |
| 7 | Advanced patterns, multi-agent | Role-based workspace access |

## Tech stack

- **Backend**: Express.js + Mastra workspaces
- **Frontend**: Vite + React + shadcn/ui
- **Streaming**: AI SDK for chat, REST for file/command operations

## Project structure

```
capstone-6-dev-assistant/
├── server/
│   ├── index.ts
│   ├── routes/
│   │   ├── chat.ts                 ← POST /api/chat — agent streaming
│   │   ├── files.ts                ← GET/POST /api/files — file operations
│   │   └── commands.ts             ← POST /api/commands — run commands
│   └── mastra/
│       ├── index.ts
│       ├── agents/
│       │   ├── dev-agent.ts        ← Full dev assistant
│       │   ├── review-agent.ts     ← Read-only reviewer
│       │   └── ops-agent.ts        ← Deployment ops
│       ├── workspaces/
│       │   ├── dev-workspace.ts    ← Full workspace
│       │   ├── review-workspace.ts ← Read-only + search
│       │   └── ops-workspace.ts    ← Sandbox only
│       └── skills/
│           ├── code-review/
│           │   └── SKILL.md
│           ├── testing/
│           │   └── SKILL.md
│           └── documentation/
│               └── SKILL.md
├── client/
│   ├── src/
│   │   ├── App.tsx                 ← IDE-like layout
│   │   ├── components/
│   │   │   ├── ui/                 ← shadcn (button, card, tabs, dialog, scroll-area, textarea, resizable, dropdown-menu)
│   │   │   ├── file-tree.tsx       ← Workspace file browser
│   │   │   ├── editor.tsx          ← File editor with agent assist
│   │   │   ├── terminal.tsx        ← Command output viewer
│   │   │   ├── search-panel.tsx    ← Code search interface
│   │   │   ├── skill-picker.tsx    ← Load skills on demand
│   │   │   ├── approval-dialog.tsx ← Tool approval UI
│   │   │   └── agent-switcher.tsx  ← Switch between dev/review/ops
├── package.json
└── tsconfig.json
```

## Step-by-step instructions

### 1. Backend: Create workspaces

**server/mastra/workspaces/dev-workspace.ts**
```typescript
import { Workspace, LocalFilesystem, LocalSandbox, WORKSPACE_TOOLS } from '@mastra/core/workspace';

// TODO: Full dev workspace
// - LocalFilesystem with basePath: './project', containment, allowedPaths: ['~/.config']
// - LocalSandbox with workingDirectory: './project'
// - bm25: true with autoIndexPaths: ['/src', '/docs']
// - skills: ['/skills']
// - tools config:
//   - write_file: { requireApproval: true, requireReadBeforeWrite: true }
//   - delete: { enabled: false }
//   - execute_command: { requireApproval: true }
```

**server/mastra/workspaces/review-workspace.ts**
```typescript
// TODO: Read-only workspace for code review
// - LocalFilesystem with readOnly: true
// - bm25: true for searching
// - skills: ['/skills/code-review']
// - No sandbox (review agents can't run commands)
```

### 2. Backend: Create skills

**server/mastra/skills/code-review/SKILL.md**
```markdown
---
name: code-review
description: Reviews code for quality, style, and potential issues
version: 1.0.0
tags: [development, review]
---

# Code Review

When reviewing code:
1. Check for bugs and edge cases
2. Verify naming conventions and code style
3. Suggest improvements for readability
4. Rate code quality 1-10

## What to look for
- Unused variables and imports
- Missing error handling
- Security vulnerabilities
- Performance issues
```

### 3. Backend: Express routes

**server/routes/chat.ts**
```typescript
// TODO: POST /api/chat?agent=dev|review|ops
// Route to the correct agent based on query param
// Stream response with AI SDK format
```

### 4. Frontend: IDE-like interface with shadcn

**client/src/components/file-tree.tsx**
```tsx
// TODO: Build using shadcn ScrollArea + Button
// 1. Fetch file list from GET /api/files?path=/
// 2. Render as tree with folders and files
// 3. Click file → open in editor panel
// 4. Show containment badge (locked icon for outside basePath)
```

**client/src/components/terminal.tsx**
```tsx
// TODO: Build using shadcn Card + ScrollArea (dark theme)
// 1. Show command output from execute_command results
// 2. Background process output via polling get_process_output
// 3. "Kill" button for running processes
// 4. ANSI-stripped text display
```

**client/src/components/agent-switcher.tsx**
```tsx
// TODO: Build using shadcn DropdownMenu
// Switch between: Dev Agent (full), Review Agent (read-only), Ops Agent (commands only)
// Each has different capabilities shown via Badge
```

**client/src/components/approval-dialog.tsx**
```tsx
// TODO: Build using shadcn Dialog + Button + Alert
// Show when agent tries to write/delete/execute
// Display: what operation, which file, approve/deny buttons
// Uses requireApproval from workspace tools config
```

## How to run

```bash
cd server && npx tsx index.ts
cd client && pnpm dev
```

## Test scenarios

1. **File management**: Ask agent to create a new module (files + dirs)
2. **Code search**: Ask "where is error handling?" → BM25 search
3. **Code review**: Load code-review skill → review a file → feedback
4. **Dev server**: Ask to start a dev server as background process
5. **Safety**: Try to delete a file → approval dialog
6. **Multi-agent**: Switch between dev/review/ops → different capabilities
7. **Skills**: Ask agent what skills it has → load and use one

## Bonus challenges

1. Add diff view showing file changes before approval
2. Add terminal history with collapsible command groups
3. Add real-time background process output via SSE
4. Add shadcn Resizable panels for IDE layout
5. Add file watching: auto-reindex when files change
