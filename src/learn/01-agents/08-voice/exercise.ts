/**
 * ============================================================
 *  MODULE 8: Adding Voice
 * ============================================================
 *
 *  THEORY
 *  ------
 *  Mastra agents can speak (TTS) and listen (STT). You can use
 *  a single provider or mix providers for different capabilities.
 *
 *  Three modes:
 *
 *  1. SINGLE PROVIDER
 *     One provider handles both TTS and STT:
 *       voice: new OpenAIVoice()
 *
 *  2. COMPOSITE VOICE
 *     Different providers for input vs output:
 *       voice: new CompositeVoice({
 *         input: new OpenAIVoice(),      // STT
 *         output: new ElevenLabsVoice(), // TTS
 *       })
 *
 *  3. REAL-TIME (speech-to-speech)
 *     For live conversation with streaming audio:
 *       voice: new OpenAIRealtimeVoice()
 *     Supports events: 'speaking', 'writing', 'error'
 *
 *  Key methods:
 *    - agent.voice.speak(text, options)    → returns audio stream
 *    - agent.voice.listen(audioStream)     → returns transcript text
 *    - agent.voice.connect()               → for realtime mode
 *    - agent.voice.send(micStream)         → send mic input (realtime)
 *    - agent.voice.on(event, handler)      → listen for events
 *
 *  Supported providers:
 *    | Provider        | Package                       | Features     |
 *    |-----------------|-------------------------------|--------------|
 *    | OpenAI          | @mastra/voice-openai          | TTS, STT     |
 *    | OpenAI Realtime | @mastra/voice-openai-realtime | Speech2Speech|
 *    | ElevenLabs      | @mastra/voice-elevenlabs      | High-Q TTS   |
 *    | Google          | @mastra/voice-google           | TTS, STT     |
 *    | Deepgram        | @mastra/voice-deepgram        | STT          |
 *    | Azure           | @mastra/voice-azure           | TTS, STT     |
 *
 *  You can also use Vercel AI SDK voice models:
 *    import { openai } from '@ai-sdk/openai'
 *    voice: new CompositeVoice({
 *      input: openai.transcription('whisper-1'),
 *      output: elevenlabs.speech('eleven_turbo_v2'),
 *    })
 *
 *  EXERCISE
 *  --------
 *  This module is more conceptual since voice requires audio
 *  hardware and API keys for voice providers. We'll create the
 *  agent configuration and mock the audio pipeline.
 *
 *  NOTE: To actually run voice, you'd need to install a voice
 *  package like: pnpm add @mastra/voice-openai
 * ============================================================
 */

import { Agent } from '@mastra/core/agent';

// ─── TODO 1: Create a voice-enabled agent (conceptual) ──────
// This shows the PATTERN even if you don't have the voice package.
// If you have @mastra/voice-openai installed, uncomment the
// voice import and configuration.
//
// import { OpenAIVoice } from '@mastra/voice-openai'
//
// const voice = new OpenAIVoice()
//
// export const voiceAgent = new Agent({
//   id: 'voice-agent',
//   name: 'Voice Agent',
//   instructions: 'You are a helpful assistant with voice capabilities.',
//   model: 'anthropic/claude-sonnet-4-5',
//   voice,
// })

// For now, create a regular agent that we'll describe voice patterns for:
export const voiceAgent = new Agent({
  id: 'voice-agent',
  name: 'Voice Agent',
  instructions: `
    You are a helpful voice assistant. Keep responses short and
    conversational — they'll be spoken aloud.
    - Use simple sentences
    - Avoid bullet points and formatting
    - Stay under 3 sentences per response
  `,
  model: 'anthropic/claude-sonnet-4-5',
});

// ─── TODO 2: Understand the TTS flow ────────────────────────
// If voice were configured, this is how you'd use TTS:
//
//   // Generate speech
//   const audioStream = await voiceAgent.voice.speak(
//     "Hello! How can I help you today?",
//     { filetype: 'mp3' }
//   );
//
//   // Save to file
//   import { createWriteStream } from 'fs';
//   const writer = createWriteStream('output.mp3');
//   audioStream.pipe(writer);
//
// QUESTION: Why would you want voice responses to be short?
// (Think about this — it's a UX consideration for voice interfaces)

// ─── TODO 3: Understand the STT flow ────────────────────────
// If voice were configured, this is how you'd use STT:
//
//   import { createReadStream } from 'fs';
//   const audioStream = createReadStream('recording.m4a');
//
//   const transcript = await voiceAgent.voice.listen(audioStream, {
//     filetype: 'm4a',
//   });
//
//   // Now use the transcript as a prompt
//   const response = await voiceAgent.generate(transcript);

// ─── TODO 4: Understand CompositeVoice ──────────────────────
// CompositeVoice lets you use the BEST provider for each job:
//
//   import { CompositeVoice } from '@mastra/core/voice';
//   import { OpenAIVoice } from '@mastra/voice-openai';
//   import { ElevenLabsVoice } from '@mastra/voice-elevenlabs';
//
//   const compositeVoiceAgent = new Agent({
//     ...config,
//     voice: new CompositeVoice({
//       input: new OpenAIVoice(),       // Whisper for STT (accurate)
//       output: new ElevenLabsVoice(),  // ElevenLabs for TTS (natural)
//     }),
//   });
//
// QUESTION: When would you use CompositeVoice vs a single provider?

// ─── TODO 5: Understand real-time voice ─────────────────────
// Real-time is for live conversation (think Siri/Alexa):
//
//   import { OpenAIRealtimeVoice } from '@mastra/voice-openai-realtime';
//   import { getMicrophoneStream } from '@mastra/node-audio';
//
//   const realtimeVoice = new OpenAIRealtimeVoice({
//     model: 'gpt-4o-realtime',
//     speaker: 'alloy',
//   });
//
//   const agent = new Agent({ ...config, voice: realtimeVoice });
//
//   // Connect and start talking
//   await agent.voice.connect();
//   agent.voice.speak("Hello!");
//
//   // Send microphone input
//   const mic = getMicrophoneStream();
//   agent.voice.send(mic);
//
//   // Listen for events
//   agent.voice.on('speaking', ({ audio }) => { /* play audio */ });
//   agent.voice.on('writing', ({ text }) => { console.log(text); });
//
//   // Cleanup
//   agent.voice.close();

// ─── Test: Generate a voice-friendly response ───────────────
export async function runTest() {
  console.log('=== Voice Agent Test (text-only demo) ===\n');

  const response = await voiceAgent.generate(
    'What is the weather like today? Give me a response as if you were speaking to me.'
  );
  console.log('Voice-friendly response:', response.text);

  console.log('\n--- Voice Architecture Summary ---');
  console.log('Single Provider:   voice: new OpenAIVoice()');
  console.log('Composite:         voice: new CompositeVoice({ input, output })');
  console.log('Realtime:          voice: new OpenAIRealtimeVoice()');
  console.log('\nMethods:');
  console.log('  .speak(text)    → audio stream (TTS)');
  console.log('  .listen(audio)  → transcript (STT)');
  console.log('  .connect()      → start realtime session');
  console.log('  .send(mic)      → stream mic to realtime');
  console.log('  .on(event, fn)  → listen for events');
}
