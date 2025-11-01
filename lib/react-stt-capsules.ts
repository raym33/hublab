import type { CompleteCapsule } from './capsule-compiler/types'

/**
 * Speech-to-Text (STT) Capsules
 * Support for audio transcription using open-source and commercial solutions
 */

export const sttCapsules: CompleteCapsule[] = [
  // ============================================
  // OPEN-SOURCE STT (Local)
  // ============================================

  {
    id: 'stt-whisper-local',
    name: 'Whisper (Local)',
    category: 'ai' as any,
    icon: '🎤',
    color: '#10B981',
    description: 'OpenAI Whisper running locally - SOTA open-source transcription',
    configFields: [
      {
        name: 'model',
        type: 'select',
        required: true,
        description: 'Model size',
        options: [
          'tiny',
          'tiny.en',
          'base',
          'base.en',
          'small',
          'small.en',
          'medium',
          'medium.en',
          'large-v2',
          'large-v3'
        ],
        default: 'base'
      },
      {
        name: 'language',
        type: 'select',
        required: false,
        description: 'Language (auto-detect if not specified)',
        options: [
          'auto',
          'en', 'es', 'fr', 'de', 'it', 'pt', 'nl', 'ru', 'zh', 'ja', 'ko',
          'ar', 'hi', 'tr', 'pl', 'uk', 'vi', 'th', 'id', 'ms', 'fa'
        ],
        default: 'auto'
      },
      {
        name: 'task',
        type: 'select',
        required: false,
        description: 'Task',
        options: ['transcribe', 'translate'],
        default: 'transcribe'
      },
      {
        name: 'temperature',
        type: 'number',
        required: false,
        description: 'Temperature (0-1)',
        default: 0.0
      },
      {
        name: 'timestampGranularity',
        type: 'select',
        required: false,
        description: 'Timestamp granularity',
        options: ['word', 'segment', 'none'],
        default: 'segment'
      },
    ],
    inputPorts: [
      {
        id: 'audio',
        name: 'Audio',
        type: ['string', 'buffer'],
        required: true,
        description: 'Audio file (path, URL, or buffer)'
      },
    ],
    outputPorts: [
      {
        id: 'text',
        name: 'Text',
        type: 'string',
        description: 'Transcribed text'
      },
      {
        id: 'segments',
        name: 'Segments',
        type: 'array',
        description: 'Timestamped segments'
      },
      {
        id: 'language',
        name: 'Detected Language',
        type: 'string',
        description: 'Detected language code'
      },
      {
        id: 'duration',
        name: 'Audio Duration',
        type: 'number',
        description: 'Duration in seconds'
      },
      {
        id: 'error',
        name: 'Error',
        type: 'string',
        description: 'Error message if failed'
      },
    ],
    npmPackage: '@xenova/transformers',
    documentation: 'https://github.com/openai/whisper',
    codeTemplate: `
const { pipeline } = require('@xenova/transformers');
const fs = require('fs');

// Load audio
let audioPath = inputs.audio;
if (typeof inputs.audio === 'string' && inputs.audio.startsWith('http')) {
  // Download audio
  const axios = require('axios');
  const response = await axios.get(inputs.audio, { responseType: 'arraybuffer' });
  audioPath = '/tmp/audio-' + Date.now() + '.mp3';
  fs.writeFileSync(audioPath, Buffer.from(response.data));
} else if (Buffer.isBuffer(inputs.audio)) {
  audioPath = '/tmp/audio-' + Date.now() + '.mp3';
  fs.writeFileSync(audioPath, inputs.audio);
}

// Initialize Whisper pipeline
const transcriber = await pipeline(
  'automatic-speech-recognition',
  \`openai/whisper-\${config.model}\`
);

// Transcribe
const result = await transcriber(audioPath, {
  language: config.language === 'auto' ? null : config.language,
  task: config.task,
  return_timestamps: config.timestampGranularity !== 'none',
  chunk_length_s: 30,
  stride_length_s: 5
});

return {
  text: result.text,
  segments: result.chunks || [],
  language: result.language || config.language,
  duration: result.duration || 0
};
    `,
  },

  {
    id: 'stt-vosk',
    name: 'Vosk Offline STT',
    category: 'ai' as any,
    icon: '🔇',
    color: '#10B981',
    description: 'Vosk - Lightweight offline speech recognition for mobile & IoT',
    configFields: [
      {
        name: 'modelPath',
        type: 'string',
        required: true,
        description: 'Path to Vosk model directory',
        placeholder: '/path/to/vosk-model-en'
      },
      {
        name: 'sampleRate',
        type: 'number',
        required: false,
        description: 'Audio sample rate (Hz)',
        default: 16000
      },
      {
        name: 'maxAlternatives',
        type: 'number',
        required: false,
        description: 'Max alternatives',
        default: 1
      },
    ],
    inputPorts: [
      {
        id: 'audio',
        name: 'Audio',
        type: ['string', 'buffer'],
        required: true,
        description: 'Audio file (WAV format, mono, 16kHz)'
      },
    ],
    outputPorts: [
      {
        id: 'text',
        name: 'Text',
        type: 'string',
        description: 'Transcribed text'
      },
      {
        id: 'alternatives',
        name: 'Alternatives',
        type: 'array',
        description: 'Alternative transcriptions'
      },
      {
        id: 'confidence',
        name: 'Confidence',
        type: 'number',
        description: 'Confidence score'
      },
      {
        id: 'error',
        name: 'Error',
        type: 'string',
        description: 'Error message if failed'
      },
    ],
    npmPackage: 'vosk',
    documentation: 'https://github.com/alphacep/vosk-api',
    codeTemplate: `
const vosk = require('vosk');
const fs = require('fs');
const { Readable } = require('stream');

// Load model
const model = new vosk.Model(config.modelPath);
const rec = new vosk.Recognizer({
  model,
  sampleRate: config.sampleRate
});

rec.setMaxAlternatives(config.maxAlternatives);

// Read audio
let audioBuffer;
if (typeof inputs.audio === 'string') {
  audioBuffer = fs.readFileSync(inputs.audio);
} else {
  audioBuffer = inputs.audio;
}

// Process audio
const stream = Readable.from(audioBuffer);
let text = '';
let alternatives = [];

for await (const chunk of stream) {
  rec.acceptWaveform(chunk);
}

const result = JSON.parse(rec.finalResult());
text = result.text;
alternatives = result.alternatives || [{ text, confidence: result.confidence || 1.0 }];

rec.free();
model.free();

return {
  text,
  alternatives,
  confidence: alternatives[0]?.confidence || 1.0
};
    `,
  },

  {
    id: 'stt-coqui',
    name: 'Coqui STT',
    category: 'ai' as any,
    icon: '🗣️',
    color: '#10B981',
    description: 'Coqui STT - Open-source speech-to-text (Mozilla DeepSpeech fork)',
    configFields: [
      {
        name: 'modelPath',
        type: 'string',
        required: true,
        description: 'Path to model file (.tflite)',
        placeholder: '/path/to/model.tflite'
      },
      {
        name: 'scorerPath',
        type: 'string',
        required: false,
        description: 'Path to scorer file (.scorer)',
        placeholder: '/path/to/scorer.scorer'
      },
    ],
    inputPorts: [
      {
        id: 'audio',
        name: 'Audio',
        type: ['string', 'buffer'],
        required: true,
        description: 'Audio file (WAV, 16kHz, mono)'
      },
    ],
    outputPorts: [
      {
        id: 'text',
        name: 'Text',
        type: 'string',
        description: 'Transcribed text'
      },
      {
        id: 'confidence',
        name: 'Confidence',
        type: 'number',
        description: 'Confidence score'
      },
      {
        id: 'error',
        name: 'Error',
        type: 'string',
        description: 'Error message if failed'
      },
    ],
    npmPackage: 'coqui-stt',
    documentation: 'https://github.com/coqui-ai/STT',
    codeTemplate: `
const stt = require('coqui-stt');
const fs = require('fs');

// Load model
const model = new stt.Model(config.modelPath);

if (config.scorerPath) {
  model.enableExternalScorer(config.scorerPath);
}

// Read audio
let audioBuffer;
if (typeof inputs.audio === 'string') {
  audioBuffer = fs.readFileSync(inputs.audio);
} else {
  audioBuffer = inputs.audio;
}

// Transcribe
const text = model.stt(audioBuffer);

return {
  text,
  confidence: 1.0 // Coqui doesn't provide confidence by default
};
    `,
  },

  // ============================================
  // COMMERCIAL STT APIs
  // ============================================

  {
    id: 'stt-openai-whisper',
    name: 'OpenAI Whisper API',
    category: 'ai' as any,
    icon: '🎙️',
    color: '#10B981',
    description: 'OpenAI Whisper API - Best accuracy, 98+ languages',
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
        options: ['whisper-1'],
        default: 'whisper-1'
      },
      {
        name: 'language',
        type: 'string',
        required: false,
        description: 'Language code (optional, auto-detect if not specified)',
        placeholder: 'en'
      },
      {
        name: 'prompt',
        type: 'string',
        required: false,
        description: 'Optional context/prompt to guide the model',
        placeholder: 'This is a medical conversation...'
      },
      {
        name: 'temperature',
        type: 'number',
        required: false,
        description: 'Temperature (0-1)',
        default: 0.0
      },
      {
        name: 'responseFormat',
        type: 'select',
        required: false,
        description: 'Response format',
        options: ['json', 'text', 'srt', 'verbose_json', 'vtt'],
        default: 'verbose_json'
      },
    ],
    inputPorts: [
      {
        id: 'audio',
        name: 'Audio',
        type: ['string', 'buffer'],
        required: true,
        description: 'Audio file (mp3, mp4, mpeg, mpga, m4a, wav, webm, max 25MB)'
      },
    ],
    outputPorts: [
      {
        id: 'text',
        name: 'Text',
        type: 'string',
        description: 'Transcribed text'
      },
      {
        id: 'segments',
        name: 'Segments',
        type: 'array',
        description: 'Timestamped segments (if verbose_json)'
      },
      {
        id: 'language',
        name: 'Detected Language',
        type: 'string',
        description: 'Detected language'
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
    npmPackage: 'openai',
    documentation: 'https://platform.openai.com/docs/guides/speech-to-text',
    codeTemplate: `
const OpenAI = require('openai');
const fs = require('fs');
const FormData = require('form-data');

const openai = new OpenAI({
  apiKey: config.apiKey
});

// Prepare audio file
let audioFile;
if (typeof inputs.audio === 'string') {
  if (inputs.audio.startsWith('http')) {
    const axios = require('axios');
    const response = await axios.get(inputs.audio, { responseType: 'arraybuffer' });
    const tempPath = '/tmp/audio-' + Date.now() + '.mp3';
    fs.writeFileSync(tempPath, Buffer.from(response.data));
    audioFile = fs.createReadStream(tempPath);
  } else {
    audioFile = fs.createReadStream(inputs.audio);
  }
} else {
  const tempPath = '/tmp/audio-' + Date.now() + '.mp3';
  fs.writeFileSync(tempPath, inputs.audio);
  audioFile = fs.createReadStream(tempPath);
}

// Transcribe
const response = await openai.audio.transcriptions.create({
  file: audioFile,
  model: config.model,
  language: config.language,
  prompt: config.prompt,
  temperature: config.temperature,
  response_format: config.responseFormat
});

let text, segments, language, duration;

if (config.responseFormat === 'verbose_json') {
  text = response.text;
  segments = response.segments || [];
  language = response.language;
  duration = response.duration;
} else if (config.responseFormat === 'json') {
  text = response.text;
  language = response.language;
} else {
  text = response; // plain text response
}

return {
  text,
  segments: segments || [],
  language: language || config.language,
  duration: duration || 0
};
    `,
  },

  {
    id: 'stt-google-cloud',
    name: 'Google Cloud STT',
    category: 'ai' as any,
    icon: '🔊',
    color: '#4285F4',
    description: 'Google Cloud Speech-to-Text - 125+ languages, streaming support',
    configFields: [
      {
        name: 'apiKey',
        type: 'string',
        required: true,
        description: 'Google Cloud API key',
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
          'ar-SA', 'hi-IN', 'tr-TR', 'nl-NL'
        ],
        default: 'en-US'
      },
      {
        name: 'model',
        type: 'select',
        required: false,
        description: 'Model',
        options: ['default', 'command_and_search', 'phone_call', 'video', 'medical_conversation'],
        default: 'default'
      },
      {
        name: 'enableAutomaticPunctuation',
        type: 'boolean',
        required: false,
        description: 'Enable automatic punctuation',
        default: true
      },
      {
        name: 'enableWordTimeOffsets',
        type: 'boolean',
        required: false,
        description: 'Enable word-level timestamps',
        default: false
      },
    ],
    inputPorts: [
      {
        id: 'audio',
        name: 'Audio',
        type: ['string', 'buffer'],
        required: true,
        description: 'Audio file'
      },
    ],
    outputPorts: [
      {
        id: 'text',
        name: 'Text',
        type: 'string',
        description: 'Transcribed text'
      },
      {
        id: 'confidence',
        name: 'Confidence',
        type: 'number',
        description: 'Confidence score (0-1)'
      },
      {
        id: 'words',
        name: 'Words',
        type: 'array',
        description: 'Word-level timestamps'
      },
      {
        id: 'error',
        name: 'Error',
        type: 'string',
        description: 'Error message if failed'
      },
    ],
    npmPackage: '@google-cloud/speech',
    documentation: 'https://cloud.google.com/speech-to-text/docs',
    codeTemplate: `
const speech = require('@google-cloud/speech');
const fs = require('fs');

const client = new speech.SpeechClient({
  apiKey: config.apiKey
});

// Read audio
let audioBytes;
if (typeof inputs.audio === 'string') {
  if (inputs.audio.startsWith('http')) {
    const axios = require('axios');
    const response = await axios.get(inputs.audio, { responseType: 'arraybuffer' });
    audioBytes = Buffer.from(response.data).toString('base64');
  } else {
    audioBytes = fs.readFileSync(inputs.audio).toString('base64');
  }
} else {
  audioBytes = inputs.audio.toString('base64');
}

const request = {
  audio: { content: audioBytes },
  config: {
    languageCode: config.languageCode,
    model: config.model,
    enableAutomaticPunctuation: config.enableAutomaticPunctuation,
    enableWordTimeOffsets: config.enableWordTimeOffsets
  }
};

const [response] = await client.recognize(request);
const transcription = response.results
  .map(result => result.alternatives[0])
  .filter(alt => alt);

const text = transcription.map(alt => alt.transcript).join(' ');
const confidence = transcription[0]?.confidence || 0;
const words = transcription[0]?.words || [];

return {
  text,
  confidence,
  words
};
    `,
  },

  {
    id: 'stt-assemblyai',
    name: 'AssemblyAI STT',
    category: 'ai' as any,
    icon: '🎯',
    color: '#6366F1',
    description: 'AssemblyAI - Advanced features: speaker diarization, sentiment, entities',
    configFields: [
      {
        name: 'apiKey',
        type: 'string',
        required: true,
        description: 'AssemblyAI API key',
        placeholder: 'your-api-key'
      },
      {
        name: 'languageCode',
        type: 'select',
        required: false,
        description: 'Language',
        options: [
          'en', 'es', 'fr', 'de', 'it', 'pt', 'nl', 'hi', 'ja', 'zh', 'ko'
        ],
        default: 'en'
      },
      {
        name: 'speakerLabels',
        type: 'boolean',
        required: false,
        description: 'Enable speaker diarization',
        default: false
      },
      {
        name: 'autoHighlights',
        type: 'boolean',
        required: false,
        description: 'Auto-detect key phrases',
        default: false
      },
      {
        name: 'sentimentAnalysis',
        type: 'boolean',
        required: false,
        description: 'Analyze sentiment',
        default: false
      },
      {
        name: 'entityDetection',
        type: 'boolean',
        required: false,
        description: 'Detect entities (names, locations, etc.)',
        default: false
      },
    ],
    inputPorts: [
      {
        id: 'audio',
        name: 'Audio',
        type: ['string'],
        required: true,
        description: 'Audio file URL or local path'
      },
    ],
    outputPorts: [
      {
        id: 'text',
        name: 'Text',
        type: 'string',
        description: 'Transcribed text'
      },
      {
        id: 'utterances',
        name: 'Utterances',
        type: 'array',
        description: 'Speaker-separated utterances'
      },
      {
        id: 'highlights',
        name: 'Highlights',
        type: 'array',
        description: 'Key phrases'
      },
      {
        id: 'sentiment',
        name: 'Sentiment',
        type: 'object',
        description: 'Sentiment analysis results'
      },
      {
        id: 'entities',
        name: 'Entities',
        type: 'array',
        description: 'Detected entities'
      },
      {
        id: 'confidence',
        name: 'Confidence',
        type: 'number',
        description: 'Confidence score'
      },
      {
        id: 'error',
        name: 'Error',
        type: 'string',
        description: 'Error message if failed'
      },
    ],
    npmPackage: 'assemblyai',
    documentation: 'https://www.assemblyai.com/docs',
    codeTemplate: `
const { AssemblyAI } = require('assemblyai');

const client = new AssemblyAI({
  apiKey: config.apiKey
});

// Upload audio if local file
let audioUrl = inputs.audio;
if (!audioUrl.startsWith('http')) {
  const fs = require('fs');
  const audioData = fs.readFileSync(audioUrl);
  const uploadResponse = await client.files.upload(audioData);
  audioUrl = uploadResponse.upload_url;
}

// Transcribe
const transcript = await client.transcripts.create({
  audio_url: audioUrl,
  language_code: config.languageCode,
  speaker_labels: config.speakerLabels,
  auto_highlights: config.autoHighlights,
  sentiment_analysis: config.sentimentAnalysis,
  entity_detection: config.entityDetection
});

// Wait for completion
let completed = false;
while (!completed) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const status = await client.transcripts.get(transcript.id);

  if (status.status === 'completed') {
    completed = true;

    return {
      text: status.text,
      utterances: status.utterances || [],
      highlights: status.auto_highlights_result?.results || [],
      sentiment: status.sentiment_analysis_results || {},
      entities: status.entities || [],
      confidence: status.confidence || 0
    };
  } else if (status.status === 'error') {
    throw new Error(status.error);
  }
}
    `,
  },

  {
    id: 'stt-azure',
    name: 'Azure Speech STT',
    category: 'ai' as any,
    icon: '☁️',
    color: '#0078D4',
    description: 'Azure Cognitive Speech Services - Real-time & batch transcription',
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
        name: 'language',
        type: 'select',
        required: true,
        description: 'Language',
        options: [
          'en-US', 'en-GB', 'es-ES', 'es-MX',
          'fr-FR', 'de-DE', 'it-IT', 'pt-BR',
          'ja-JP', 'zh-CN', 'ko-KR', 'ru-RU'
        ],
        default: 'en-US'
      },
      {
        name: 'enableDiarization',
        type: 'boolean',
        required: false,
        description: 'Enable speaker diarization',
        default: false
      },
    ],
    inputPorts: [
      {
        id: 'audio',
        name: 'Audio',
        type: ['string', 'buffer'],
        required: true,
        description: 'Audio file'
      },
    ],
    outputPorts: [
      {
        id: 'text',
        name: 'Text',
        type: 'string',
        description: 'Transcribed text'
      },
      {
        id: 'speakers',
        name: 'Speakers',
        type: 'array',
        description: 'Speaker-separated text'
      },
      {
        id: 'confidence',
        name: 'Confidence',
        type: 'number',
        description: 'Confidence score'
      },
      {
        id: 'error',
        name: 'Error',
        type: 'string',
        description: 'Error message if failed'
      },
    ],
    npmPackage: 'microsoft-cognitiveservices-speech-sdk',
    documentation: 'https://learn.microsoft.com/en-us/azure/cognitive-services/speech-service/',
    codeTemplate: `
const sdk = require('microsoft-cognitiveservices-speech-sdk');
const fs = require('fs');

// Prepare audio
let audioPath = inputs.audio;
if (Buffer.isBuffer(inputs.audio)) {
  audioPath = '/tmp/audio-' + Date.now() + '.wav';
  fs.writeFileSync(audioPath, inputs.audio);
}

const speechConfig = sdk.SpeechConfig.fromSubscription(
  config.subscriptionKey,
  config.region
);
speechConfig.speechRecognitionLanguage = config.language;

const audioConfig = sdk.AudioConfig.fromWavFileInput(
  fs.readFileSync(audioPath)
);

const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

// Recognize
const result = await new Promise((resolve, reject) => {
  recognizer.recognizeOnceAsync(
    result => resolve(result),
    error => reject(error)
  );
});

recognizer.close();

if (result.reason === sdk.ResultReason.RecognizedSpeech) {
  return {
    text: result.text,
    speakers: [],
    confidence: result.properties?.getProperty('Confidence') || 0
  };
} else {
  throw new Error('Recognition failed: ' + result.errorDetails);
}
    `,
  },

  // ============================================
  // SPECIALIZED STT CAPSULES
  // ============================================

  {
    id: 'stt-realtime',
    name: 'Real-time STT Streaming',
    category: 'ai' as any,
    icon: '📡',
    color: '#EC4899',
    description: 'Real-time speech recognition with live streaming',
    configFields: [
      {
        name: 'provider',
        type: 'select',
        required: true,
        description: 'STT Provider',
        options: ['google', 'azure', 'assemblyai'],
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
        name: 'language',
        type: 'string',
        required: false,
        description: 'Language code',
        default: 'en-US'
      },
      {
        name: 'interimResults',
        type: 'boolean',
        required: false,
        description: 'Return interim results',
        default: true
      },
    ],
    inputPorts: [
      {
        id: 'audioStream',
        name: 'Audio Stream',
        type: ['stream'],
        required: true,
        description: 'Live audio stream'
      },
      {
        id: 'onTranscript',
        name: 'On Transcript',
        type: ['function'],
        required: false,
        description: 'Callback for each transcript'
      },
    ],
    outputPorts: [
      {
        id: 'stream',
        name: 'Transcript Stream',
        type: 'stream',
        description: 'Stream of transcripts'
      },
      {
        id: 'finalText',
        name: 'Final Text',
        type: 'string',
        description: 'Complete transcription'
      },
      {
        id: 'error',
        name: 'Error',
        type: 'string',
        description: 'Error message if failed'
      },
    ],
    npmPackage: '@google-cloud/speech',
    codeTemplate: `
// Real-time streaming implementation
const { Writable } = require('stream');
let finalText = '';

if (config.provider === 'google') {
  const speech = require('@google-cloud/speech');
  const client = new speech.SpeechClient({ apiKey: config.apiKey });

  const request = {
    config: {
      encoding: 'LINEAR16',
      sampleRateHertz: 16000,
      languageCode: config.language
    },
    interimResults: config.interimResults
  };

  const recognizeStream = client
    .streamingRecognize(request)
    .on('data', data => {
      const result = data.results[0];
      const transcript = result?.alternatives[0]?.transcript;

      if (transcript) {
        if (result.isFinal) {
          finalText += transcript + ' ';
        }

        if (inputs.onTranscript) {
          inputs.onTranscript({
            transcript,
            isFinal: result.isFinal,
            confidence: result.alternatives[0]?.confidence
          });
        }
      }
    });

  inputs.audioStream.pipe(recognizeStream);
}

return {
  stream: recognizeStream,
  finalText: finalText.trim()
};
    `,
  },

  {
    id: 'stt-translate',
    name: 'STT with Translation',
    category: 'ai' as any,
    icon: '🌍',
    color: '#F59E0B',
    description: 'Transcribe and translate to another language simultaneously',
    configFields: [
      {
        name: 'apiKey',
        type: 'string',
        required: true,
        description: 'OpenAI API key',
        placeholder: 'sk-...'
      },
      {
        name: 'targetLanguage',
        type: 'select',
        required: true,
        description: 'Target language',
        options: ['en', 'es', 'fr', 'de', 'it', 'pt', 'nl', 'ru', 'zh', 'ja', 'ko'],
        default: 'en'
      },
    ],
    inputPorts: [
      {
        id: 'audio',
        name: 'Audio',
        type: ['string', 'buffer'],
        required: true,
        description: 'Audio in any language'
      },
    ],
    outputPorts: [
      {
        id: 'originalText',
        name: 'Original Text',
        type: 'string',
        description: 'Transcription in original language'
      },
      {
        id: 'translatedText',
        name: 'Translated Text',
        type: 'string',
        description: 'Translation in target language'
      },
      {
        id: 'detectedLanguage',
        name: 'Detected Language',
        type: 'string',
        description: 'Original language code'
      },
      {
        id: 'error',
        name: 'Error',
        type: 'string',
        description: 'Error message if failed'
      },
    ],
    npmPackage: 'openai',
    codeTemplate: `
const OpenAI = require('openai');
const fs = require('fs');

const openai = new OpenAI({ apiKey: config.apiKey });

// Prepare audio
let audioFile;
if (typeof inputs.audio === 'string') {
  audioFile = fs.createReadStream(inputs.audio);
} else {
  const tempPath = '/tmp/audio-' + Date.now() + '.mp3';
  fs.writeFileSync(tempPath, inputs.audio);
  audioFile = fs.createReadStream(tempPath);
}

// First: Transcribe to detect language
const transcription = await openai.audio.transcriptions.create({
  file: audioFile,
  model: 'whisper-1',
  response_format: 'verbose_json'
});

// Then: Translate if needed
let translatedText = transcription.text;
if (transcription.language !== config.targetLanguage) {
  const translation = await openai.audio.translations.create({
    file: audioFile,
    model: 'whisper-1'
  });
  translatedText = translation.text;
}

return {
  originalText: transcription.text,
  translatedText,
  detectedLanguage: transcription.language
};
    `,
  },
]
