/**
 * ============================================================
 *  MODULE 32: Chunking Strategies
 * ============================================================
 *
 *  THEORY
 *  ------
 *  Chunking is the most critical step in RAG. Bad chunks =
 *  bad retrieval = bad answers. The goal is to split documents
 *  into pieces that are:
 *    - Small enough to fit in context windows
 *    - Large enough to contain meaningful information
 *    - Aligned with natural document boundaries
 *
 *  Mastra supports 9 chunking strategies, each optimized for
 *  different document types:
 *
 *  ── 'recursive' (most versatile) ──
 *  Splits on separators (\n\n, \n, space) in priority order.
 *  Tries the first separator; if chunks are still too big,
 *  falls back to the next. Best for general-purpose text.
 *    doc.chunk({ strategy: 'recursive', size: 512, overlap: 50 })
 *
 *  ── 'character' (simplest) ──
 *  Splits at exact character boundaries. No intelligence,
 *  but predictable. Good for fixed-size windows.
 *    doc.chunk({ strategy: 'character', size: 500 })
 *
 *  ── 'token' (LLM-aware) ──
 *  Counts TOKENS, not characters. Important because LLMs
 *  measure input in tokens (1 token ≈ 4 chars in English).
 *    doc.chunk({ strategy: 'token', size: 200 })
 *
 *  ── 'sentence' (preserves sentences) ──
 *  Splits at sentence boundaries. Never breaks mid-sentence.
 *  Best for well-structured prose.
 *    doc.chunk({
 *      strategy: 'sentence',
 *      maxSize: 450,
 *      minSize: 50,
 *      overlap: 0,
 *      sentenceEnders: ['.', '!', '?'],
 *    })
 *
 *  ── 'markdown' (structure-aware) ──
 *  Splits at markdown heading boundaries (# ## ###).
 *  Preserves document structure and hierarchy.
 *    doc.chunk({ strategy: 'markdown', size: 500 })
 *
 *  ── 'semantic-markdown' (AI-powered) ──
 *  Groups related sections by semantic similarity.
 *  Uses an LLM to understand which headers belong together.
 *    doc.chunk({
 *      strategy: 'semantic-markdown',
 *      joinThreshold: 500,
 *      modelName: 'gpt-3.5-turbo',
 *    })
 *
 *  ── 'html' (DOM-aware) ──
 *  Splits at HTML tag boundaries (<p>, <div>, <section>).
 *  Preserves markup structure.
 *    doc.chunk({ strategy: 'html', size: 500 })
 *
 *  ── 'json' (key-aware) ──
 *  Splits JSON objects at key boundaries.
 *  Keeps related key-value pairs together.
 *    doc.chunk({ strategy: 'json', size: 500 })
 *
 *  ── 'latex' (academic) ──
 *  Splits at LaTeX structure boundaries (\section, \subsection).
 *    doc.chunk({ strategy: 'latex', size: 500 })
 *
 *  KEY PARAMETERS:
 *    size / maxSize: Maximum chunk size (chars or tokens)
 *    overlap:        Characters shared between consecutive chunks
 *                    (helps preserve context across boundaries)
 *    separators:     Custom separator strings for recursive strategy
 *    extract:        { metadata: true } to extract metadata via LLM
 *
 *  OVERLAP EXPLAINED:
 *    With overlap: 50, the last 50 chars of chunk N appear as
 *    the first 50 chars of chunk N+1. This ensures information
 *    at chunk boundaries isn't lost.
 *
 *    Without overlap: "The cat sat on the | mat and purred softly"
 *    With overlap:    "The cat sat on the | on the mat and purred softly"
 *
 *  EXERCISE
 *  --------
 *  Experiment with different chunking strategies and observe
 *  how they produce different results from the same document.
 * ============================================================
 */

import { MDocument } from '@mastra/rag';

// ─── Sample documents for testing ────────────────────────────
const plainText = `
Artificial intelligence has transformed the technology landscape.
Machine learning, a subset of AI, enables systems to learn from data.
Deep learning uses neural networks with many layers to find patterns.

Natural language processing allows computers to understand human language.
Large language models like GPT and Claude can generate human-like text.
These models are trained on vast amounts of internet text data.

Computer vision enables machines to interpret visual information.
Image recognition can identify objects, faces, and scenes in photos.
Self-driving cars rely heavily on computer vision technology.
`;

const markdownText = `
# Artificial Intelligence

## Machine Learning
Machine learning enables systems to learn from data without explicit programming.
Supervised learning uses labeled data. Unsupervised learning finds patterns in unlabeled data.

## Deep Learning
Deep learning uses neural networks with many layers.
It excels at image recognition, natural language processing, and game playing.

### Convolutional Neural Networks
CNNs are specialized for processing grid-like data such as images.

### Recurrent Neural Networks
RNNs are designed for sequential data like text and time series.

## Applications
AI is used in healthcare, finance, transportation, and entertainment.
`;

const htmlText = `
<html>
<body>
  <h1>AI Overview</h1>
  <section>
    <h2>What is AI?</h2>
    <p>Artificial intelligence is the simulation of human intelligence by machines.</p>
    <p>It encompasses machine learning, natural language processing, and robotics.</p>
  </section>
  <section>
    <h2>Machine Learning</h2>
    <p>ML is a subset of AI focused on learning from data.</p>
    <ul>
      <li>Supervised learning</li>
      <li>Unsupervised learning</li>
      <li>Reinforcement learning</li>
    </ul>
  </section>
</body>
</html>
`;

const jsonText = JSON.stringify({
  company: 'Mastra',
  products: [
    { name: 'Agents', description: 'AI agents with tools and memory' },
    { name: 'Workflows', description: 'Step-by-step process automation' },
    { name: 'RAG', description: 'Retrieval-augmented generation pipeline' },
  ],
  features: {
    streaming: 'Real-time token streaming',
    memory: 'Persistent conversation memory',
    observability: 'Built-in tracing and logging',
  },
});

// ─── TODO 1: Recursive chunking ─────────────────────────────
// Chunk plainText with 'recursive' strategy.
// Try different sizes (100, 200, 500) and observe chunk count.
//
// const doc = MDocument.fromText(plainText)
// const chunks = await doc.chunk({ strategy: 'recursive', size: 200, overlap: 20 })

export async function testRecursive() {
  console.log('--- Recursive Chunking ---');
  // TODO: implement — try sizes 100, 200, 500
  console.log('TODO: implement');
}

// ─── TODO 2: Sentence chunking ──────────────────────────────
// Chunk plainText with 'sentence' strategy.
// Compare how it preserves sentence boundaries vs recursive.
//
// const chunks = await doc.chunk({
//   strategy: 'sentence',
//   maxSize: 200,
//   minSize: 30,
//   overlap: 0,
//   sentenceEnders: ['.', '!', '?'],
// })

export async function testSentence() {
  console.log('--- Sentence Chunking ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 3: Markdown chunking ──────────────────────────────
// Chunk markdownText with 'markdown' strategy.
// Observe how it splits at heading boundaries.
//
// const doc = MDocument.fromMarkdown(markdownText)
// const chunks = await doc.chunk({ strategy: 'markdown', size: 300 })

export async function testMarkdown() {
  console.log('--- Markdown Chunking ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 4: HTML chunking ──────────────────────────────────
// Chunk htmlText with 'html' strategy.
// Observe how it respects HTML structure.
//
// const doc = MDocument.fromHTML(htmlText)
// const chunks = await doc.chunk({ strategy: 'html', size: 200 })

export async function testHTML() {
  console.log('--- HTML Chunking ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 5: JSON chunking ──────────────────────────────────
// Chunk jsonText with 'json' strategy.
//
// const doc = MDocument.fromJSON(jsonText)
// const chunks = await doc.chunk({ strategy: 'json', size: 200 })

export async function testJSON() {
  console.log('--- JSON Chunking ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 6: Compare overlap effects ─────────────────────────
// Chunk the same text with overlap: 0 vs overlap: 50.
// Print each chunk and highlight the overlapping content.

export async function testOverlap() {
  console.log('--- Overlap Comparison ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── TODO 7: Compare all strategies ─────────────────────────
// Chunk the same plainText with recursive, character, token,
// and sentence strategies (all size ~200). Compare:
//   - Number of chunks produced
//   - Average chunk length
//   - Whether sentences are split mid-way

export async function testCompareAll() {
  console.log('--- Strategy Comparison ---');
  // TODO: implement
  console.log('TODO: implement');
}

// ─── Run all tests ───────────────────────────────────────────
export async function runTest() {
  console.log('=== Chunking Strategies ===\n');

  await testRecursive();
  console.log('\n');
  await testSentence();
  console.log('\n');
  await testMarkdown();
  console.log('\n');
  await testHTML();
  console.log('\n');
  await testJSON();
  console.log('\n');
  await testOverlap();
  console.log('\n');
  await testCompareAll();
}
