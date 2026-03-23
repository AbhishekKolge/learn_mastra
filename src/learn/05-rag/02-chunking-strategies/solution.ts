/**
 * MODULE 32: Chunking Strategies — SOLUTION
 */

import { MDocument } from '@mastra/rag';

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

function printChunks(chunks: { text: string }[], label: string) {
  console.log(`  ${label}: ${chunks.length} chunks`);
  chunks.forEach((c, i) => {
    console.log(`    [${i}] (${c.text.length} chars) "${c.text.slice(0, 60).replace(/\n/g, '\\n')}..."`);
  });
}

// ─── TODO 1: Recursive chunking ─────────────────────────────
export async function testRecursive() {
  console.log('--- Recursive Chunking ---');
  const doc = MDocument.fromText(plainText);

  for (const size of [100, 200, 500]) {
    const chunks = await doc.chunk({ strategy: 'recursive', size, overlap: 20 });
    printChunks(chunks, `size=${size}`);
  }
}

// ─── TODO 2: Sentence chunking ──────────────────────────────
export async function testSentence() {
  console.log('--- Sentence Chunking ---');
  const doc = MDocument.fromText(plainText);

  const chunks = await doc.chunk({
    strategy: 'sentence',
    maxSize: 200,
    minSize: 30,
    overlap: 0,
    sentenceEnders: ['.', '!', '?'],
  });

  printChunks(chunks, 'sentence');
  console.log('\n  Note: Each chunk ends at a sentence boundary (., !, ?)');
}

// ─── TODO 3: Markdown chunking ──────────────────────────────
export async function testMarkdown() {
  console.log('--- Markdown Chunking ---');
  const doc = MDocument.fromMarkdown(markdownText);

  const chunks = await doc.chunk({ strategy: 'markdown', size: 300 });
  printChunks(chunks, 'markdown');
}

// ─── TODO 4: HTML chunking ──────────────────────────────────
export async function testHTML() {
  console.log('--- HTML Chunking ---');
  const doc = MDocument.fromHTML(htmlText);

  const chunks = await doc.chunk({ strategy: 'html', size: 200 });
  printChunks(chunks, 'html');
}

// ─── TODO 5: JSON chunking ──────────────────────────────────
export async function testJSON() {
  console.log('--- JSON Chunking ---');
  const doc = MDocument.fromJSON(jsonText);

  const chunks = await doc.chunk({ strategy: 'json', size: 200 });
  printChunks(chunks, 'json');
}

// ─── TODO 6: Compare overlap effects ─────────────────────────
export async function testOverlap() {
  console.log('--- Overlap Comparison ---');
  const doc = MDocument.fromText(plainText);

  const noOverlap = await doc.chunk({ strategy: 'recursive', size: 150, overlap: 0 });
  const withOverlap = await doc.chunk({ strategy: 'recursive', size: 150, overlap: 50 });

  console.log(`  No overlap: ${noOverlap.length} chunks`);
  console.log(`  With overlap (50): ${withOverlap.length} chunks`);

  console.log('\n  No overlap — chunk boundaries:');
  noOverlap.forEach((c, i) => {
    console.log(`    [${i}] ends with: "...${c.text.slice(-30).replace(/\n/g, '\\n')}"`);
  });

  console.log('\n  With overlap — notice repeated content:');
  for (let i = 0; i < withOverlap.length - 1; i++) {
    const endOfCurrent = withOverlap[i].text.slice(-50);
    const startOfNext = withOverlap[i + 1].text.slice(0, 50);
    console.log(`    [${i}→${i + 1}] overlap: "${endOfCurrent.slice(-30).replace(/\n/g, '\\n')}" → "${startOfNext.slice(0, 30).replace(/\n/g, '\\n')}"`);
  }
}

// ─── TODO 7: Compare all strategies ─────────────────────────
export async function testCompareAll() {
  console.log('--- Strategy Comparison ---');
  const doc = MDocument.fromText(plainText);

  const strategies = ['recursive', 'character', 'token', 'sentence'] as const;

  for (const strategy of strategies) {
    let chunks;
    if (strategy === 'sentence') {
      chunks = await doc.chunk({ strategy, maxSize: 200, minSize: 20 });
    } else {
      chunks = await doc.chunk({ strategy, size: 200 });
    }

    const avgLen = Math.round(chunks.reduce((sum, c) => sum + c.text.length, 0) / chunks.length);
    const midSentenceSplits = chunks.filter(c => {
      const trimmed = c.text.trim();
      return trimmed.length > 0 && !trimmed.endsWith('.') && !trimmed.endsWith('!') && !trimmed.endsWith('?');
    }).length;

    console.log(`  ${strategy.padEnd(12)} | ${chunks.length} chunks | avg ${avgLen} chars | ${midSentenceSplits} mid-sentence splits`);
  }
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
