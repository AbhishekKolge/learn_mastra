/**
 * MODULE 8: Adding Voice — SOLUTION
 *
 * This is a conceptual module. The "solution" demonstrates the
 * patterns with comments since voice requires additional packages
 * and audio hardware.
 *
 * To actually use voice:
 *   pnpm add @mastra/voice-openai
 *   # or any other voice provider package
 */

import { Agent } from '@mastra/core/agent';
// Uncomment when you have the packages:
// import { OpenAIVoice } from '@mastra/voice-openai';
// import { CompositeVoice } from '@mastra/core/voice';
// import { createReadStream, createWriteStream } from 'fs';
// import path from 'path';

// ─── Pattern 1: Single provider ─────────────────────────────
// const voice = new OpenAIVoice();
// export const voiceAgent = new Agent({
//   id: 'voice-agent',
//   name: 'Voice Agent',
//   instructions: 'Keep responses short and conversational.',
//   model: 'anthropic/claude-sonnet-4-5',
//   voice,
// });

// For the demo, use text-only:
export const voiceAgent = new Agent({
  id: 'voice-agent',
  name: 'Voice Agent',
  instructions: `
    You are a helpful voice assistant. Keep responses short and
    conversational — they'll be spoken aloud.
    Use simple sentences. Avoid bullet points. Stay under 3 sentences.
  `,
  model: 'anthropic/claude-sonnet-4-5',
});

// ─── Pattern 2: TTS (Text-to-Speech) ────────────────────────
// async function speakResponse(text: string) {
//   const audio = await voiceAgent.voice.speak(text, { filetype: 'mp3' });
//   const writer = createWriteStream(path.join(process.cwd(), 'output.mp3'));
//   audio.pipe(writer);
//   await new Promise<void>((resolve, reject) => {
//     writer.on('finish', resolve);
//     writer.on('error', reject);
//   });
//   console.log('Audio saved to output.mp3');
// }

// ─── Pattern 3: STT (Speech-to-Text) ────────────────────────
// async function transcribeAndRespond(audioPath: string) {
//   const audioStream = createReadStream(audioPath);
//   const transcript = await voiceAgent.voice.listen(audioStream, {
//     filetype: 'm4a',
//   });
//   console.log('User said:', transcript);
//   const response = await voiceAgent.generate(transcript);
//   console.log('Agent response:', response.text);
//   // Optionally speak the response
//   // await speakResponse(response.text);
// }

// ─── Pattern 4: Full voice loop ─────────────────────────────
// async function voiceConversation() {
//   // 1. Listen to user
//   const transcript = await voiceAgent.voice.listen(micStream);
//   // 2. Generate response
//   const response = await voiceAgent.generate(transcript);
//   // 3. Speak response
//   const audio = await voiceAgent.voice.speak(response.text);
//   // 4. Play audio to user
//   playAudio(audio);
// }

export async function runTest() {
  console.log('=== Voice Agent Test ===\n');

  const response = await voiceAgent.generate(
    'What is the weather like today? Respond as if speaking to me.'
  );
  console.log('Response:', response.text);

  console.log('\n--- Key Voice Patterns ---');
  console.log('1. Single Provider: new OpenAIVoice() for both TTS+STT');
  console.log('2. Composite: OpenAI for STT + ElevenLabs for TTS');
  console.log('3. Realtime: OpenAIRealtimeVoice for live conversation');
  console.log('4. AI SDK: Vercel AI SDK transcription/speech models');
}
