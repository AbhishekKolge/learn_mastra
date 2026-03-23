/**
 * MODULE 13: Observational Memory — SOLUTION
 *
 * Observational Memory (OM) is Mastra's system for long-context memory.
 * Two background agents — Observer and Reflector — watch conversations
 * and maintain a dense observation log that replaces raw message history
 * as it grows.
 *
 * 3-TIER ARCHITECTURE:
 *   Tier 1: Recent messages     → exact conversation (full fidelity)
 *   Tier 2: Observations        → compressed notes (5-40x compression)
 *   Tier 3: Reflections         → condensed observations (meta-compression)
 *
 * HOW IT TRIGGERS:
 *   - Observer runs when message tokens exceed `messageTokens` threshold (default 30K)
 *   - Reflector runs when observation tokens exceed `observationTokens` threshold (default 40K)
 *   - With async buffering (default), observations are pre-computed in the background
 *
 * OBSERVATION FORMAT:
 *   Date: 2026-01-15
 *   - 🔴 12:10 User is building a Next.js app with Supabase auth
 *     - 🟡 12:12 User asked about middleware configuration
 *     - 🔴 12:15 App name is "Acme Dashboard"
 *
 * SCOPES:
 *   - 'thread' (default): Each thread has its own observations
 *   - 'resource' (experimental): Observations shared across all threads for a user
 */

import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';

// ─── TODO 1: Basic OM setup ────────────────────────────────
// Just set observationalMemory: true to use defaults (google/gemini-2.5-flash)
const basicOMMemory = new Memory({
  options: {
    lastMessages: 20,
    observationalMemory: true, // Uses google/gemini-2.5-flash by default
  },
});

// ─── TODO 2: Custom OM configuration ───────────────────────
// Specify model, scope, and token thresholds
const customOMMemory = new Memory({
  options: {
    lastMessages: 20,
    observationalMemory: {
      model: 'anthropic/claude-haiku-4-5',
      scope: 'thread',
      observation: {
        messageTokens: 30_000,   // When to run Observer (default 30K)
        bufferTokens: 0.2,       // Pre-compute every 20% of threshold (~6K tokens)
        bufferActivation: 0.8,   // On activation, keep only 20% of messageTokens
        blockAfter: 1.2,         // Force synchronous at 1.2x threshold (36K)
        previousObserverTokens: 2000, // Limit context sent to Observer
      },
      reflection: {
        observationTokens: 40_000,  // When to run Reflector (default 40K)
        bufferActivation: 0.5,      // Start background reflection at 50%
        blockAfter: 1.2,            // Force synchronous at 1.2x threshold
      },
    },
  },
});

// ─── TODO 3: Resource-scoped OM (experimental) ──────────────
// Observations shared across ALL threads for a user.
// Caution: one thread may see context from another thread.
const resourceOMMemory = new Memory({
  options: {
    lastMessages: 20,
    observationalMemory: {
      model: 'anthropic/claude-haiku-4-5',
      scope: 'resource', // Cross-thread memory
    },
  },
});

// ─── TODO 4: OM with retrieval mode (experimental) ──────────
// Keeps observation groups linked to source messages.
// Agent gets a `recall` tool to page through original messages.
const retrievalOMMemory = new Memory({
  options: {
    lastMessages: 20,
    observationalMemory: {
      model: 'anthropic/claude-haiku-4-5',
      scope: 'thread',
      retrieval: true, // Links observations to source messages
    },
  },
});

// ─── Agent with OM ──────────────────────────────────────────
export const omAgent = new Agent({
  id: 'om-agent',
  name: 'Observational Memory Agent',
  instructions: `
    You are a helpful assistant for long-running projects.
    Your memory system automatically compresses older messages into
    dense observations, so you can maintain context across very long
    conversations without losing important details.
    Always reference earlier context when relevant.
  `,
  model: 'anthropic/claude-sonnet-4-5',
  memory: customOMMemory,
});

// ─── TODO 5: Test basic OM conversation ─────────────────────
export async function testBasicOM() {
  const memConfig = {
    memory: { thread: { id: 'om-test-thread' }, resource: 'user-om' },
  };

  console.log('--- Building project context ---\n');

  const r1 = await omAgent.generate(
    "I'm building an e-commerce app with Next.js and Stripe integration",
    memConfig,
  );
  console.log('1:', r1.text.slice(0, 100), '...\n');

  const r2 = await omAgent.generate(
    'The app needs user auth with Clerk, a product catalog with search, and a shopping cart',
    memConfig,
  );
  console.log('2:', r2.text.slice(0, 100), '...\n');

  const r3 = await omAgent.generate(
    'I also need an admin dashboard for managing orders and inventory',
    memConfig,
  );
  console.log('3:', r3.text.slice(0, 100), '...\n');

  // Ask the agent to recall everything — tests memory retention
  const r4 = await omAgent.generate(
    'Summarize everything we have discussed about this project so far.',
    memConfig,
  );
  console.log('4 (Summary):', r4.text, '\n');

  console.log('Note: OM is active but not yet compressing — conversation is below 30K token threshold.');
  console.log('In production with 100+ messages, the Observer would create compressed observations.');
}

// ─── TODO 6: Demonstrate the 3-tier concept ────────────────
export async function demonstrateThreeTiers() {
  console.log('--- 3-Tier Memory Architecture ---\n');

  console.log('TIER 1 — Recent Messages (always available):');
  console.log('  Raw conversation text, full fidelity');
  console.log('  → "User said they need Stripe integration for payments"');
  console.log('  → "Assistant suggested using Stripe Checkout for simplicity"\n');

  console.log('TIER 2 — Observations (created at ~30K message tokens):');
  console.log('  Dense notes created by the Observer agent');
  console.log('  Typically 5-40x compression ratio');
  console.log('  Example observation log:');
  console.log('    Date: 2026-03-24');
  console.log('    - 🔴 14:10 User building e-commerce app with Next.js + Stripe');
  console.log('      - 🔴 14:10 Auth: Clerk, Catalog: search, Cart: persistent');
  console.log('      - 🟡 14:15 Admin dashboard needed for orders + inventory');
  console.log('      - 🟢 14:20 Suggested starting with Stripe Checkout\n');

  console.log('TIER 3 — Reflections (created at ~40K observation tokens):');
  console.log('  Condensed observations — the Reflector merges related items');
  console.log('  Example reflection:');
  console.log('    "User is building a full e-commerce platform: Next.js frontend,');
  console.log('     Clerk auth, Stripe payments, search-enabled catalog, admin dashboard.');
  console.log('     Key decisions: Stripe Checkout preferred over custom flow."\n');

  console.log('ASYNC BUFFERING (default behavior):');
  console.log('  - Observer pre-computes in background as conversation grows');
  console.log('  - When threshold is hit, buffered observations activate instantly');
  console.log('  - Agent NEVER pauses — zero-latency context management');
  console.log('  - Reflector also runs in background when observations grow\n');

  console.log('TOKEN COUNTING:');
  console.log('  - Uses fast local estimation (not LLM calls) for threshold checks');
  console.log('  - Image parts use provider-aware heuristics');
  console.log('  - Per-part estimates are cached in message metadata');
}

// ─── TODO 7: OM model recommendations ──────────────────────
export async function showModelRecommendations() {
  console.log('\n--- OM Model Recommendations ---\n');
  console.log('Observer/Reflector run in the background. Use fast, high-context models:\n');
  console.log('  google/gemini-2.5-flash  — default, fast, 1M context');
  console.log('  anthropic/claude-haiku-4-5 — fast, reliable');
  console.log('  openai/gpt-4o-mini       — cheap, decent quality');
  console.log('  deepseek/deepseek-reasoner — fast, good quality');
  console.log('\nRequirements: 128K+ context window, fast inference');
  console.log('\nOM vs Working Memory:');
  console.log('  Working Memory = small structured scratchpad (name, preferences)');
  console.log('  Observational Memory = automatic long-context compression');
  console.log('  OM replaces both working memory and manual message history management');
}

// ─── Run all tests ──────────────────────────────────────────
export async function runTest() {
  console.log('=== Observational Memory ===\n');
  await testBasicOM();

  console.log('\n');
  await demonstrateThreeTiers();

  await showModelRecommendations();
}
