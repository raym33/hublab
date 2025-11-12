import type { CompleteCapsule } from './capsule-compiler/types'

/**
 * Text-to-Speech (TTS) Capsules
 * Support for open-source and commercial TTS solutions
 */

export const ttsCapsules: CompleteCapsule[] = [
  // ============================================
  // OPEN-SOURCE TTS (Local)
  // ============================================

  {
    id: 'tts-coqui',
    name: 'Coqui TTS (Open-Source)',
    category: 'ai' as any,
    icon: '🗣️',
    color: '#10B981',
    description: 'High-quality open-source TTS with 1000+ voices (Mozilla TTS fork)',
    configFields: [
      {
        name: 'model',
        type: 'select',
        required: true,
        description: 'TTS Model',
        options: [
          'tts_models/en/ljspeech/tacotron2-DDC',
          'tts_models/en/ljspeech/glow-tts',
          'tts_models/en/ljspeech/fast_pitch',
          'tts_models/en/vctk/vits',
          'tts_models/multilingual/multi-dataset/xtts_v2',
          'tts_models/es/css10/vits',
          'tts_models/fr/css10/vits',
          'tts_models/de/css10/vits',
          'custom'
        ],
        default: 'tts_models/en/ljspeech/tacotron2-DDC'
      },
      {
        name: 'customModel',
        type: 'string',
        required: false,
        description: 'Custom model path (if model=custom)',
        placeholder: '/path/to/model'
      },
      {
        name: 'language',
        type: 'select',
        required: false,
        description: 'Language (for multilingual models)',
        options: ['en', 'es', 'fr', 'de', 'it', 'pt', 'pl', 'tr', 'ru', 'nl', 'cs', 'ar', 'zh-cn'],
        default: 'en'
      },
      {
        name: 'speakerIdx',
        type: 'number',
        required: false,
        description: 'Speaker ID (for multi-speaker models)',
        placeholder: '0'
      },
      {
        name: 'outputFormat',
        type: 'select',
        required: false,
        description: 'Audio format',
        options: ['wav', 'mp3'],
        default: 'wav'
      },
    ],
    inputPorts: [
      {
        id: 'text',
        name: 'Text',
        type: ['string'],
        required: true,
        description: 'Text to convert to speech'
      },
    ],
    outputPorts: [
      {
        id: 'audioBuffer',
        name: 'Audio Buffer',
        type: 'buffer',
        description: 'Audio data as buffer'
      },
      {
        id: 'audioUrl',
        name: 'Audio URL',
        type: 'string',
        description: 'URL to audio file (if saved)'
      },
      {
        id: 'duration',
        name: 'Duration',
        type: 'number',
        description: 'Audio duration in seconds'
      },
      {
        id: 'error',
        name: 'Error',
        type: 'string',
        description: 'Error message if failed'
      },
    ],
    npmPackage: '@coqui-ai/tts',
    documentation: 'https://github.com/coqui-ai/TTS',
    codeTemplate: `
const TTS = require('@coqui-ai/tts');
const fs = require('fs');
const path = require('path');

const tts = new TTS(config.model === 'custom' ? config.customModel : config.model);

// Configure language and speaker if applicable
const options = {};
if (config.language) options.language = config.language;
if (config.speakerIdx !== undefined) options.speaker_idx = config.speakerIdx;

// Generate speech
const audioBuffer = await tts.tts(inputs.text, options);

// Save to file if needed
const outputPath = path.join('/tmp', \`tts-\${Date.now()}.\${config.outputFormat}\`);
fs.writeFileSync(outputPath, audioBuffer);

// Get audio duration (approximate)
const duration = audioBuffer.length / (22050 * 2); // assuming 22kHz, 16-bit

return {
  audioBuffer,
  audioUrl: outputPath,
  duration
};
    `,
  },

  {
    id: 'tts-piper',
    name: 'Piper TTS (Fast & Local)',
    category: 'ai' as any,
    icon: '⚡',
    color: '#10B981',
    description: 'Ultra-fast neural TTS that runs locally (Rhasspy project)',
    configFields: [
      {
        name: 'voice',
        type: 'select',
        required: true,
        description: 'Voice',
        options: [
          'en_US-lessac-medium',
          'en_US-libritts_r-medium',
          'en_GB-alan-medium',
          'es_ES-davefx-medium',
          'fr_FR-upmc-medium',
          'de_DE-thorsten-medium',
        ],
        default: 'en_US-lessac-medium'
      },
      {
        name: 'speakingRate',
        type: 'number',
        required: false,
        description: 'Speaking rate (0.5-2.0)',
        default: 1.0
      },
      {
        name: 'outputFormat',
        type: 'select',
        required: false,
        description: 'Audio format',
        options: ['wav', 'mp3'],
        default: 'wav'
      },
    ],
    inputPorts: [
      {
        id: 'text',
        name: 'Text',
        type: ['string'],
        required: true,
        description: 'Text to convert to speech'
      },
    ],
    outputPorts: [
      {
        id: 'audioBuffer',
        name: 'Audio Buffer',
        type: 'buffer',
        description: 'Audio data as buffer'
      },
      {
        id: 'audioUrl',
        name: 'Audio URL',
        type: 'string',
        description: 'URL to audio file'
      },
      {
        id: 'duration',
        name: 'Duration',
        type: 'number',
        description: 'Audio duration in seconds'
      },
      {
        id: 'error',
        name: 'Error',
        type: 'string',
        description: 'Error message if failed'
      },
    ],
    npmPackage: 'piper-tts',
    documentation: 'https://github.com/rhasspy/piper',
    codeTemplate: `
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const util = require('util');
const execPromise = util.promisify(exec);

// Piper uses command-line interface
const outputPath = path.join('/tmp', \`piper-\${Date.now()}.\${config.outputFormat}\`);

const command = \`echo "\${inputs.text}" | piper --model \${config.voice} --output_file \${outputPath} --length_scale \${1.0 / config.speakingRate}\`;

await execPromise(command);

const audioBuffer = fs.readFileSync(outputPath);
const stats = fs.statSync(outputPath);
const duration = stats.size / (22050 * 2); // approximate

return {
  audioBuffer,
  audioUrl: outputPath,
  duration
};
    `,
  },

  {
    id: 'tts-bark',
    name: 'Bark TTS (Suno AI)',
    category: 'ai' as any,
    icon: '🐕',
    color: '#10B981',
    description: 'Transformer-based TTS with realistic voice, emotions, and sound effects',
    configFields: [
      {
        name: 'voice',
        type: 'select',
        required: false,
        description: 'Voice preset',
        options: [
          'v2/en_speaker_0',
          'v2/en_speaker_1',
          'v2/en_speaker_2',
          'v2/en_speaker_3',
          'v2/en_speaker_4',
          'v2/en_speaker_5',
          'v2/en_speaker_6',
          'v2/en_speaker_7',
          'v2/en_speaker_8',
          'v2/en_speaker_9',
        ],
        default: 'v2/en_speaker_6'
      },
      {
        name: 'temperature',
        type: 'number',
        required: false,
        description: 'Generation temperature (0.1-1.0)',
        default: 0.7
      },
    ],
    inputPorts: [
      {
        id: 'text',
        name: 'Text',
        type: ['string'],
        required: true,
        description: 'Text with [laughs], [sighs], etc. for emotions'
      },
    ],
    outputPorts: [
      {
        id: 'audioBuffer',
        name: 'Audio Buffer',
        type: 'buffer',
        description: 'Audio data as buffer'
      },
      {
        id: 'sampleRate',
        name: 'Sample Rate',
        type: 'number',
        description: 'Audio sample rate'
      },
      {
        id: 'error',
        name: 'Error',
        type: 'string',
        description: 'Error message if failed'
      },
    ],
    npmPackage: 'bark-tts',
    documentation: 'https://github.com/suno-ai/bark',
    codeTemplate: `
const bark = require('bark-tts');

const audio = await bark.generate({
  text: inputs.text,
  voice: config.voice,
  temperature: config.temperature
});

return {
  audioBuffer: audio.audio,
  sampleRate: audio.sample_rate || 24000
};
    `,
  },

  // ============================================
  // COMMERCIAL TTS APIs
  // ============================================

  {
    id: 'tts-elevenlabs',
    name: 'ElevenLabs TTS',
    category: 'ai' as any,
    icon: '🎙️',
    color: '#8B5CF6',
    description: 'Best-in-class AI voice generation with emotion and intonation',
    configFields: [
      {
        name: 'apiKey',
        type: 'string',
        required: true,
        description: 'ElevenLabs API key',
        placeholder: 'sk_...'
      },
      {
        name: 'voiceId',
        type: 'select',
        required: true,
        description: 'Voice',
        options: [
          '21m00Tcm4TlvDq8ikWAM', // Rachel
          'AZnzlk1XvdvUeBnXmlld', // Domi
          'EXAVITQu4vr4xnSDxMaL', // Bella
          'ErXwobaYiN019PkySvjV', // Antoni
          'MF3mGyEYCl7XYWbV9V6O', // Elli
          'TxGEqnHWrfWFTfGW9XjX', // Josh
          'VR6AewLTigWG4xSOukaG', // Arnold
          'pNInz6obpgDQGcFmaJgB', // Adam
          'yoZ06aMxZJJ28mfd3POQ', // Sam
          'custom'
        ],
        default: '21m00Tcm4TlvDq8ikWAM'
      },
      {
        name: 'customVoiceId',
        type: 'string',
        required: false,
        description: 'Custom voice ID (if voice=custom)',
        placeholder: 'your-voice-id'
      },
      {
        name: 'model',
        type: 'select',
        required: false,
        description: 'Model',
        options: ['eleven_multilingual_v2', 'eleven_monolingual_v1', 'eleven_turbo_v2'],
        default: 'eleven_multilingual_v2'
      },
      {
        name: 'stability',
        type: 'number',
        required: false,
        description: 'Stability (0-1)',
        default: 0.5
      },
      {
        name: 'similarityBoost',
        type: 'number',
        required: false,
        description: 'Similarity Boost (0-1)',
        default: 0.75
      },
    ],
    inputPorts: [
      {
        id: 'text',
        name: 'Text',
        type: ['string'],
        required: true,
        description: 'Text to convert to speech'
      },
    ],
    outputPorts: [
      {
        id: 'audioBuffer',
        name: 'Audio Buffer',
        type: 'buffer',
        description: 'Audio data as buffer (MP3)'
      },
      {
        id: 'audioUrl',
        name: 'Audio URL',
        type: 'string',
        description: 'URL to audio file'
      },
      {
        id: 'characterCount',
        name: 'Character Count',
        type: 'number',
        description: 'Characters processed'
      },
      {
        id: 'error',
        name: 'Error',
        type: 'string',
        description: 'Error message if failed'
      },
    ],
    npmPackage: 'elevenlabs-node',
    documentation: 'https://elevenlabs.io/docs',
    codeTemplate: `
const { ElevenLabs } = require('elevenlabs-node');
const fs = require('fs');
const path = require('path');

const elevenlabs = new ElevenLabs({
  apiKey: config.apiKey
});

const voiceId = config.voiceId === 'custom' ? config.customVoiceId : config.voiceId;

const audio = await elevenlabs.textToSpeech({
  voiceId,
  text: inputs.text,
  modelId: config.model,
  voiceSettings: {
    stability: config.stability,
    similarity_boost: config.similarityBoost
  }
});

// Save to file
const outputPath = path.join('/tmp', \`elevenlabs-\${Date.now()}.mp3\`);
fs.writeFileSync(outputPath, audio);

return {
  audioBuffer: audio,
  audioUrl: outputPath,
  characterCount: inputs.text.length
};
    `,
  },

  {
    id: 'tts-openai',
    name: 'OpenAI TTS',
    category: 'ai' as any,
    icon: '🎵',
    color: '#10B981',
    description: 'High-quality TTS with 6 voices (alloy, echo, fable, onyx, nova, shimmer)',
    configFields: [
      {
        name: 'apiKey',
        type: 'string',
        required: true,
        description: 'OpenAI API key',
        placeholder: 'sk-...'
      },
      {
        name: 'model',
        type: 'select',
        required: false,
        description: 'Model',
        options: ['tts-1', 'tts-1-hd'],
        default: 'tts-1'
      },
      {
        name: 'voice',
        type: 'select',
        required: true,
        description: 'Voice',
        options: ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'],
        default: 'alloy'
      },
      {
        name: 'speed',
        type: 'number',
        required: false,
        description: 'Speed (0.25-4.0)',
        default: 1.0
      },
      {
        name: 'responseFormat',
        type: 'select',
        required: false,
        description: 'Audio format',
        options: ['mp3', 'opus', 'aac', 'flac', 'wav', 'pcm'],
        default: 'mp3'
      },
    ],
    inputPorts: [
      {
        id: 'text',
        name: 'Text',
        type: ['string'],
        required: true,
        description: 'Text to convert to speech (max 4096 chars)'
      },
    ],
    outputPorts: [
      {
        id: 'audioBuffer',
        name: 'Audio Buffer',
        type: 'buffer',
        description: 'Audio data as buffer'
      },
      {
        id: 'audioUrl',
        name: 'Audio URL',
        type: 'string',
        description: 'URL to audio file'
      },
      {
        id: 'error',
        name: 'Error',
        type: 'string',
        description: 'Error message if failed'
      },
    ],
    npmPackage: 'openai',
    documentation: 'https://platform.openai.com/docs/guides/text-to-speech',
    codeTemplate: `
const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');

const openai = new OpenAI({
  apiKey: config.apiKey
});

const response = await openai.audio.speech.create({
  model: config.model,
  voice: config.voice,
  input: inputs.text,
  speed: config.speed,
  response_format: config.responseFormat
});

const audioBuffer = Buffer.from(await response.arrayBuffer());

// Save to file
const outputPath = path.join('/tmp', \`openai-tts-\${Date.now()}.\${config.responseFormat}\`);
fs.writeFileSync(outputPath, audioBuffer);

return {
  audioBuffer,
  audioUrl: outputPath
};
    `,
  },

  {
    id: 'tts-google',
    name: 'Google Cloud TTS',
    category: 'ai' as any,
    icon: '🔊',
    color: '#4285F4',
    description: 'Google Cloud Text-to-Speech with 400+ voices in 50+ languages',
    configFields: [
      {
        name: 'apiKey',
        type: 'string',
        required: true,
        description: 'Google Cloud API key or credentials',
        placeholder: 'AIza...'
      },
      {
        name: 'languageCode',
        type: 'select',
        required: true,
        description: 'Language',
        options: [
          'en-US', 'en-GB', 'en-AU', 'en-IN',
          'es-ES', 'es-US', 'fr-FR', 'de-DE',
          'it-IT', 'pt-BR', 'pt-PT', 'ja-JP',
          'ko-KR', 'zh-CN', 'zh-TW', 'ru-RU',
          'ar-XA', 'hi-IN', 'tr-TR', 'nl-NL',
        ],
        default: 'en-US'
      },
      {
        name: 'voiceName',
        type: 'string',
        required: false,
        description: 'Voice name (e.g., en-US-Neural2-A)',
        placeholder: 'en-US-Neural2-A'
      },
      {
        name: 'gender',
        type: 'select',
        required: false,
        description: 'Voice gender',
        options: ['MALE', 'FEMALE', 'NEUTRAL'],
        default: 'NEUTRAL'
      },
      {
        name: 'speakingRate',
        type: 'number',
        required: false,
        description: 'Speaking rate (0.25-4.0)',
        default: 1.0
      },
      {
        name: 'pitch',
        type: 'number',
        required: false,
        description: 'Pitch (-20.0 to 20.0)',
        default: 0.0
      },
    ],
    inputPorts: [
      {
        id: 'text',
        name: 'Text',
        type: ['string'],
        required: true,
        description: 'Text or SSML to convert to speech'
      },
    ],
    outputPorts: [
      {
        id: 'audioBuffer',
        name: 'Audio Buffer',
        type: 'buffer',
        description: 'Audio data as buffer (MP3)'
      },
      {
        id: 'audioUrl',
        name: 'Audio URL',
        type: 'string',
        description: 'URL to audio file'
      },
      {
        id: 'error',
        name: 'Error',
        type: 'string',
        description: 'Error message if failed'
      },
    ],
    npmPackage: '@google-cloud/text-to-speech',
    documentation: 'https://cloud.google.com/text-to-speech/docs',
    codeTemplate: `
const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const path = require('path');

const client = new textToSpeech.TextToSpeechClient({
  apiKey: config.apiKey
});

const request = {
  input: { text: inputs.text },
  voice: {
    languageCode: config.languageCode,
    name: config.voiceName,
    ssmlGender: config.gender
  },
  audioConfig: {
    audioEncoding: 'MP3',
    speakingRate: config.speakingRate,
    pitch: config.pitch
  }
};

const [response] = await client.synthesizeSpeech(request);
const audioBuffer = response.audioContent;

// Save to file
const outputPath = path.join('/tmp', \`google-tts-\${Date.now()}.mp3\`);
fs.writeFileSync(outputPath, audioBuffer);

return {
  audioBuffer,
  audioUrl: outputPath
};
    `,
  },

  {
    id: 'tts-azure',
    name: 'Azure Cognitive TTS',
    category: 'ai' as any,
    icon: '☁️',
    color: '#0078D4',
    description: 'Microsoft Azure Text-to-Speech with neural voices',
    configFields: [
      {
        name: 'subscriptionKey',
        type: 'string',
        required: true,
        description: 'Azure subscription key',
        placeholder: 'your-key'
      },
      {
        name: 'region',
        type: 'string',
        required: true,
        description: 'Azure region',
        placeholder: 'eastus',
        default: 'eastus'
      },
      {
        name: 'voice',
        type: 'select',
        required: true,
        description: 'Voice',
        options: [
          'en-US-AriaNeural',
          'en-US-JennyNeural',
          'en-US-GuyNeural',
          'en-GB-SoniaNeural',
          'es-ES-ElviraNeural',
          'fr-FR-DeniseNeural',
          'de-DE-KatjaNeural',
          'it-IT-ElsaNeural',
          'ja-JP-NanamiNeural',
          'zh-CN-XiaoxiaoNeural',
        ],
        default: 'en-US-AriaNeural'
      },
      {
        name: 'speakingRate',
        type: 'number',
        required: false,
        description: 'Speaking rate (0.5-2.0)',
        default: 1.0
      },
      {
        name: 'pitch',
        type: 'string',
        required: false,
        description: 'Pitch (e.g., +10%, -5%, medium)',
        default: 'default'
      },
    ],
    inputPorts: [
      {
        id: 'text',
        name: 'Text',
        type: ['string'],
        required: true,
        description: 'Text or SSML to convert to speech'
      },
    ],
    outputPorts: [
      {
        id: 'audioBuffer',
        name: 'Audio Buffer',
        type: 'buffer',
        description: 'Audio data as buffer'
      },
      {
        id: 'audioUrl',
        name: 'Audio URL',
        type: 'string',
        description: 'URL to audio file'
      },
      {
        id: 'error',
        name: 'Error',
        type: 'string',
        description: 'Error message if failed'
      },
    ],
    npmPackage: 'microsoft-cognitiveservices-speech-sdk',
    documentation: 'https://learn.microsoft.com/en-us/azure/cognitive-services/speech-service/text-to-speech',
    codeTemplate: `
const sdk = require('microsoft-cognitiveservices-speech-sdk');
const fs = require('fs');
const path = require('path');

const speechConfig = sdk.SpeechConfig.fromSubscription(
  config.subscriptionKey,
  config.region
);

speechConfig.speechSynthesisVoiceName = config.voice;

const outputPath = path.join('/tmp', \`azure-tts-\${Date.now()}.wav\`);
const audioConfig = sdk.AudioConfig.fromAudioFileOutput(outputPath);

const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

const ssml = \`<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
  <voice name="\${config.voice}">
    <prosody rate="\${config.speakingRate}" pitch="\${config.pitch}">
      \${inputs.text}
    </prosody>
  </voice>
</speak>\`;

const result = await new Promise((resolve, reject) => {
  synthesizer.speakSsmlAsync(
    ssml,
    result => resolve(result),
    error => reject(error)
  );
});

synthesizer.close();

const audioBuffer = fs.readFileSync(outputPath);

return {
  audioBuffer,
  audioUrl: outputPath
};
    `,
  },

  // ============================================
  // UTILITY TTS CAPSULES
  // ============================================

  {
    id: 'tts-stream',
    name: 'Streaming TTS',
    category: 'ai' as any,
    icon: '📡',
    color: '#6366F1',
    description: 'Stream audio as it\'s generated for lower latency',
    configFields: [
      {
        name: 'provider',
        type: 'select',
        required: true,
        description: 'TTS Provider',
        options: ['elevenlabs', 'openai', 'azure'],
        default: 'elevenlabs'
      },
      {
        name: 'apiKey',
        type: 'string',
        required: true,
        description: 'API key',
        placeholder: 'sk-...'
      },
      {
        name: 'voice',
        type: 'string',
        required: true,
        description: 'Voice ID or name',
        placeholder: 'alloy, 21m00Tcm4TlvDq8ikWAM'
      },
      {
        name: 'chunkSize',
        type: 'number',
        required: false,
        description: 'Chunk size in bytes',
        default: 4096
      },
    ],
    inputPorts: [
      {
        id: 'text',
        name: 'Text',
        type: ['string'],
        required: true,
        description: 'Text to convert to speech'
      },
      {
        id: 'onChunk',
        name: 'On Chunk',
        type: ['function'],
        required: false,
        description: 'Callback for each audio chunk'
      },
    ],
    outputPorts: [
      {
        id: 'stream',
        name: 'Audio Stream',
        type: 'stream',
        description: 'Readable audio stream'
      },
      {
        id: 'error',
        name: 'Error',
        type: 'string',
        description: 'Error message if failed'
      },
    ],
    npmPackage: 'stream',
    codeTemplate: `
// Implementation varies by provider
// All support streaming for low latency
const { Readable } = require('stream');

let audioStream;

if (config.provider === 'elevenlabs') {
  const { ElevenLabs } = require('elevenlabs-node');
  const elevenlabs = new ElevenLabs({ apiKey: config.apiKey });

  audioStream = await elevenlabs.textToSpeechStream({
    voiceId: config.voice,
    text: inputs.text
  });
} else if (config.provider === 'openai') {
  const OpenAI = require('openai');
  const openai = new OpenAI({ apiKey: config.apiKey });

  const response = await openai.audio.speech.create({
    model: 'tts-1',
    voice: config.voice,
    input: inputs.text
  });

  audioStream = Readable.from(response.body);
}

// Emit chunks to callback if provided
if (inputs.onChunk) {
  audioStream.on('data', chunk => inputs.onChunk(chunk));
}

return {
  stream: audioStream
};
    `,
  },

  {
    id: 'tts-multilang',
    name: 'Multi-Language TTS',
    category: 'ai' as any,
    icon: '🌍',
    color: '#F59E0B',
    description: 'Automatically detect language and use appropriate voice',
    configFields: [
      {
        name: 'provider',
        type: 'select',
        required: true,
        description: 'TTS Provider',
        options: ['google', 'azure', 'elevenlabs'],
        default: 'google'
      },
      {
        name: 'apiKey',
        type: 'string',
        required: true,
        description: 'API key',
        placeholder: 'your-key'
      },
      {
        name: 'autoDetectLanguage',
        type: 'boolean',
        required: false,
        description: 'Auto-detect language',
        default: true
      },
    ],
    inputPorts: [
      {
        id: 'text',
        name: 'Text',
        type: ['string'],
        required: true,
        description: 'Text in any language'
      },
      {
        id: 'languageHint',
        name: 'Language Hint',
        type: ['string'],
        required: false,
        description: 'Language code hint (en, es, fr, etc.)'
      },
    ],
    outputPorts: [
      {
        id: 'audioBuffer',
        name: 'Audio Buffer',
        type: 'buffer',
        description: 'Audio data as buffer'
      },
      {
        id: 'detectedLanguage',
        name: 'Detected Language',
        type: 'string',
        description: 'Detected language code'
      },
      {
        id: 'voiceUsed',
        name: 'Voice Used',
        type: 'string',
        description: 'Voice that was used'
      },
      {
        id: 'error',
        name: 'Error',
        type: 'string',
        description: 'Error message if failed'
      },
    ],
    npmPackage: 'franc',
    documentation: 'Multi-language TTS with auto-detection',
    codeTemplate: `
const franc = require('franc');

// Detect language
let language = inputs.languageHint;
if (config.autoDetectLanguage && !language) {
  const detected = franc(inputs.text);
  language = detected === 'und' ? 'en' : detected;
}

// Map to voice based on provider and language
const voiceMap = {
  google: {
    en: 'en-US-Neural2-A',
    es: 'es-ES-Standard-A',
    fr: 'fr-FR-Standard-A',
    de: 'de-DE-Standard-A',
  },
  // Add more mappings...
};

const voice = voiceMap[config.provider]?.[language] || voiceMap[config.provider].en;

// Generate speech using detected language/voice
// (implementation depends on provider)

return {
  audioBuffer,
  detectedLanguage: language,
  voiceUsed: voice
};
    `,
  },
]
