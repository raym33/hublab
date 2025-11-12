import type { CompleteCapsule } from './capsule-compiler/types'

/**
 * Local & Remote LLM Capsules
 * Support for Ollama, LM Studio, Groq, Together AI, and more
 */

export const llmCapsules: CompleteCapsule[] = [
  // ============================================
  // LOCAL LLMs
  // ============================================

  {
    id: 'llm-ollama',
    name: 'Ollama Local LLM',
    category: 'ai' as any,
    icon: '🦙',
    color: '#3B82F6',
    description: 'Run local LLMs with Ollama (Llama, Mistral, Phi, etc.)',
    configFields: [
      {
        name: 'baseUrl',
        type: 'string',
        required: false,
        description: 'Ollama server URL',
        default: 'http://localhost:11434',
        placeholder: 'http://localhost:11434'
      },
      {
        name: 'model',
        type: 'select',
        required: true,
        description: 'Model name',
        options: [
          'llama3.2:latest',
          'llama3.1:8b',
          'llama3.1:70b',
          'mistral:latest',
          'mistral:7b',
          'phi3:latest',
          'codellama:latest',
          'qwen2.5:latest',
          'deepseek-r1:latest',
          'custom'
        ],
        default: 'llama3.2:latest'
      },
      {
        name: 'customModel',
        type: 'string',
        required: false,
        description: 'Custom model name (if model=custom)',
        placeholder: 'your-model:tag'
      },
      {
        name: 'temperature',
        type: 'number',
        required: false,
        description: 'Temperature (0-2)',
        default: 0.7
      },
      {
        name: 'maxTokens',
        type: 'number',
        required: false,
        description: 'Max tokens',
        default: 2000
      },
      {
        name: 'stream',
        type: 'boolean',
        required: false,
        description: 'Stream response',
        default: false
      },
    ],
    inputPorts: [
      {
        id: 'prompt',
        name: 'Prompt',
        type: ['string'],
        required: true,
        description: 'User prompt'
      },
      {
        id: 'systemPrompt',
        name: 'System Prompt',
        type: ['string'],
        required: false,
        description: 'System instructions'
      },
      {
        id: 'context',
        name: 'Context',
        type: ['array'],
        required: false,
        description: 'Previous messages for conversation'
      },
    ],
    outputPorts: [
      {
        id: 'response',
        name: 'Response',
        type: 'string',
        description: 'LLM response text'
      },
      {
        id: 'model',
        name: 'Model Used',
        type: 'string',
        description: 'Model that was used'
      },
      {
        id: 'tokensUsed',
        name: 'Tokens Used',
        type: 'number',
        description: 'Total tokens consumed'
      },
      {
        id: 'error',
        name: 'Error',
        type: 'string',
        description: 'Error message if failed'
      },
    ],
    npmPackage: 'ollama',
    codeTemplate: `
const ollama = require('ollama');

const client = new ollama.Ollama({
  host: config.baseUrl
});

const modelName = config.model === 'custom' ? config.customModel : config.model;

const response = await client.chat({
  model: modelName,
  messages: [
    ...(inputs.systemPrompt ? [{ role: 'system', content: inputs.systemPrompt }] : []),
    ...(inputs.context || []),
    { role: 'user', content: inputs.prompt }
  ],
  options: {
    temperature: config.temperature,
    num_predict: config.maxTokens,
  },
  stream: config.stream
});

return {
  response: response.message.content,
  model: modelName,
  tokensUsed: response.eval_count || 0
};
    `,
  },

  {
    id: 'llm-lmstudio',
    name: 'LM Studio Local LLM',
    category: 'ai' as any,
    icon: '🎛️',
    color: '#3B82F6',
    description: 'Run local LLMs with LM Studio',
    configFields: [
      {
        name: 'baseUrl',
        type: 'string',
        required: false,
        description: 'LM Studio server URL',
        default: 'http://localhost:1234/v1',
        placeholder: 'http://localhost:1234/v1'
      },
      {
        name: 'model',
        type: 'string',
        required: false,
        description: 'Model name (leave empty to use loaded model)',
        placeholder: 'local-model'
      },
      {
        name: 'temperature',
        type: 'number',
        required: false,
        description: 'Temperature (0-2)',
        default: 0.7
      },
      {
        name: 'maxTokens',
        type: 'number',
        required: false,
        description: 'Max tokens',
        default: 2000
      },
    ],
    inputPorts: [
      {
        id: 'prompt',
        name: 'Prompt',
        type: ['string'],
        required: true,
        description: 'User prompt'
      },
      {
        id: 'systemPrompt',
        name: 'System Prompt',
        type: ['string'],
        required: false,
        description: 'System instructions'
      },
    ],
    outputPorts: [
      {
        id: 'response',
        name: 'Response',
        type: 'string',
        description: 'LLM response text'
      },
      {
        id: 'tokensUsed',
        name: 'Tokens Used',
        type: 'number',
        description: 'Total tokens consumed'
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

const client = new OpenAI({
  baseURL: config.baseUrl,
  apiKey: 'lm-studio' // LM Studio doesn't need a real API key
});

const messages = [
  ...(inputs.systemPrompt ? [{ role: 'system', content: inputs.systemPrompt }] : []),
  { role: 'user', content: inputs.prompt }
];

const response = await client.chat.completions.create({
  model: config.model || 'local-model',
  messages,
  temperature: config.temperature,
  max_tokens: config.maxTokens,
});

return {
  response: response.choices[0].message.content,
  tokensUsed: response.usage?.total_tokens || 0
};
    `,
  },

  // ============================================
  // REMOTE API LLMs
  // ============================================

  {
    id: 'llm-groq',
    name: 'Groq Fast LLM',
    category: 'ai' as any,
    icon: '⚡',
    color: '#F97316',
    description: 'Ultra-fast LLM inference with Groq (Llama, Mixtral, Gemma)',
    configFields: [
      {
        name: 'apiKey',
        type: 'string',
        required: true,
        description: 'Groq API key',
        placeholder: 'gsk_...'
      },
      {
        name: 'model',
        type: 'select',
        required: true,
        description: 'Model',
        options: [
          'llama-3.3-70b-versatile',
          'llama-3.1-70b-versatile',
          'llama-3.1-8b-instant',
          'mixtral-8x7b-32768',
          'gemma2-9b-it',
          'gemma-7b-it',
        ],
        default: 'llama-3.3-70b-versatile'
      },
      {
        name: 'temperature',
        type: 'number',
        required: false,
        description: 'Temperature (0-2)',
        default: 0.7
      },
      {
        name: 'maxTokens',
        type: 'number',
        required: false,
        description: 'Max tokens',
        default: 2000
      },
    ],
    inputPorts: [
      {
        id: 'prompt',
        name: 'Prompt',
        type: ['string'],
        required: true,
        description: 'User prompt'
      },
      {
        id: 'systemPrompt',
        name: 'System Prompt',
        type: ['string'],
        required: false,
        description: 'System instructions'
      },
    ],
    outputPorts: [
      {
        id: 'response',
        name: 'Response',
        type: 'string',
        description: 'LLM response text'
      },
      {
        id: 'tokensUsed',
        name: 'Tokens Used',
        type: 'number',
        description: 'Total tokens consumed'
      },
      {
        id: 'model',
        name: 'Model Used',
        type: 'string',
        description: 'Model that was used'
      },
      {
        id: 'error',
        name: 'Error',
        type: 'string',
        description: 'Error message if failed'
      },
    ],
    npmPackage: 'groq-sdk',
    documentation: 'https://console.groq.com/docs',
    codeTemplate: `
const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: config.apiKey
});

const messages = [
  ...(inputs.systemPrompt ? [{ role: 'system', content: inputs.systemPrompt }] : []),
  { role: 'user', content: inputs.prompt }
];

const response = await groq.chat.completions.create({
  model: config.model,
  messages,
  temperature: config.temperature,
  max_tokens: config.maxTokens,
});

return {
  response: response.choices[0].message.content,
  tokensUsed: response.usage?.total_tokens || 0,
  model: config.model
};
    `,
  },

  {
    id: 'llm-together',
    name: 'Together AI',
    category: 'ai' as any,
    icon: '🤝',
    color: '#8B5CF6',
    description: 'Run 100+ open-source models via Together AI API',
    configFields: [
      {
        name: 'apiKey',
        type: 'string',
        required: true,
        description: 'Together AI API key',
        placeholder: 'sk-...'
      },
      {
        name: 'model',
        type: 'select',
        required: true,
        description: 'Model',
        options: [
          'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo',
          'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo',
          'mistralai/Mixtral-8x7B-Instruct-v0.1',
          'mistralai/Mistral-7B-Instruct-v0.2',
          'Qwen/Qwen2.5-72B-Instruct-Turbo',
          'deepseek-ai/deepseek-llm-67b-chat',
          'NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO',
          'codellama/CodeLlama-34b-Instruct-hf',
        ],
        default: 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo'
      },
      {
        name: 'temperature',
        type: 'number',
        required: false,
        description: 'Temperature (0-1)',
        default: 0.7
      },
      {
        name: 'maxTokens',
        type: 'number',
        required: false,
        description: 'Max tokens',
        default: 2000
      },
    ],
    inputPorts: [
      {
        id: 'prompt',
        name: 'Prompt',
        type: ['string'],
        required: true,
        description: 'User prompt'
      },
      {
        id: 'systemPrompt',
        name: 'System Prompt',
        type: ['string'],
        required: false,
        description: 'System instructions'
      },
    ],
    outputPorts: [
      {
        id: 'response',
        name: 'Response',
        type: 'string',
        description: 'LLM response text'
      },
      {
        id: 'tokensUsed',
        name: 'Tokens Used',
        type: 'number',
        description: 'Total tokens consumed'
      },
      {
        id: 'model',
        name: 'Model Used',
        type: 'string',
        description: 'Model that was used'
      },
      {
        id: 'error',
        name: 'Error',
        type: 'string',
        description: 'Error message if failed'
      },
    ],
    npmPackage: 'together-ai',
    documentation: 'https://docs.together.ai/',
    codeTemplate: `
const Together = require('together-ai');

const together = new Together({
  apiKey: config.apiKey
});

const messages = [
  ...(inputs.systemPrompt ? [{ role: 'system', content: inputs.systemPrompt }] : []),
  { role: 'user', content: inputs.prompt }
];

const response = await together.chat.completions.create({
  model: config.model,
  messages,
  temperature: config.temperature,
  max_tokens: config.maxTokens,
});

return {
  response: response.choices[0].message.content,
  tokensUsed: response.usage?.total_tokens || 0,
  model: config.model
};
    `,
  },

  {
    id: 'llm-huggingface',
    name: 'Hugging Face Inference',
    category: 'ai' as any,
    icon: '🤗',
    color: '#FFD21E',
    description: 'Run any Hugging Face model via Inference API',
    configFields: [
      {
        name: 'apiKey',
        type: 'string',
        required: true,
        description: 'Hugging Face API token',
        placeholder: 'hf_...'
      },
      {
        name: 'model',
        type: 'string',
        required: true,
        description: 'Model ID',
        placeholder: 'meta-llama/Meta-Llama-3-8B-Instruct',
        default: 'mistralai/Mistral-7B-Instruct-v0.2'
      },
      {
        name: 'temperature',
        type: 'number',
        required: false,
        description: 'Temperature (0-2)',
        default: 0.7
      },
      {
        name: 'maxTokens',
        type: 'number',
        required: false,
        description: 'Max new tokens',
        default: 1000
      },
    ],
    inputPorts: [
      {
        id: 'prompt',
        name: 'Prompt',
        type: ['string'],
        required: true,
        description: 'User prompt'
      },
    ],
    outputPorts: [
      {
        id: 'response',
        name: 'Response',
        type: 'string',
        description: 'LLM response text'
      },
      {
        id: 'model',
        name: 'Model Used',
        type: 'string',
        description: 'Model that was used'
      },
      {
        id: 'error',
        name: 'Error',
        type: 'string',
        description: 'Error message if failed'
      },
    ],
    npmPackage: '@huggingface/inference',
    documentation: 'https://huggingface.co/docs/api-inference/',
    codeTemplate: `
const { HfInference } = require('@huggingface/inference');

const hf = new HfInference(config.apiKey);

const response = await hf.textGeneration({
  model: config.model,
  inputs: inputs.prompt,
  parameters: {
    temperature: config.temperature,
    max_new_tokens: config.maxTokens,
    return_full_text: false,
  }
});

return {
  response: response.generated_text,
  model: config.model
};
    `,
  },

  {
    id: 'llm-replicate',
    name: 'Replicate AI',
    category: 'ai' as any,
    icon: '🔮',
    color: '#EC4899',
    description: 'Run open-source models on Replicate cloud',
    configFields: [
      {
        name: 'apiToken',
        type: 'string',
        required: true,
        description: 'Replicate API token',
        placeholder: 'r8_...'
      },
      {
        name: 'model',
        type: 'select',
        required: true,
        description: 'Model',
        options: [
          'meta/meta-llama-3-70b-instruct',
          'meta/meta-llama-3-8b-instruct',
          'mistralai/mixtral-8x7b-instruct-v0.1',
          'mistralai/mistral-7b-instruct-v0.2',
          'replicate/flan-t5-xl',
        ],
        default: 'meta/meta-llama-3-70b-instruct'
      },
      {
        name: 'temperature',
        type: 'number',
        required: false,
        description: 'Temperature (0-1)',
        default: 0.7
      },
      {
        name: 'maxTokens',
        type: 'number',
        required: false,
        description: 'Max tokens',
        default: 500
      },
    ],
    inputPorts: [
      {
        id: 'prompt',
        name: 'Prompt',
        type: ['string'],
        required: true,
        description: 'User prompt'
      },
      {
        id: 'systemPrompt',
        name: 'System Prompt',
        type: ['string'],
        required: false,
        description: 'System instructions'
      },
    ],
    outputPorts: [
      {
        id: 'response',
        name: 'Response',
        type: 'string',
        description: 'LLM response text'
      },
      {
        id: 'model',
        name: 'Model Used',
        type: 'string',
        description: 'Model that was used'
      },
      {
        id: 'error',
        name: 'Error',
        type: 'string',
        description: 'Error message if failed'
      },
    ],
    npmPackage: 'replicate',
    documentation: 'https://replicate.com/docs',
    codeTemplate: `
const Replicate = require('replicate');

const replicate = new Replicate({
  auth: config.apiToken,
});

const systemPrompt = inputs.systemPrompt || '';
const fullPrompt = systemPrompt
  ? \`System: \${systemPrompt}\\n\\nUser: \${inputs.prompt}\`
  : inputs.prompt;

const output = await replicate.run(config.model, {
  input: {
    prompt: fullPrompt,
    temperature: config.temperature,
    max_tokens: config.maxTokens,
  }
});

// Output is an async generator for streaming models
let response = '';
for await (const chunk of output) {
  response += chunk;
}

return {
  response: response.trim(),
  model: config.model
};
    `,
  },

  // ============================================
  // SPECIALIZED LLM CAPSULES
  // ============================================

  {
    id: 'llm-embedding',
    name: 'Text Embeddings',
    category: 'ai' as any,
    icon: '🧬',
    color: '#10B981',
    description: 'Generate text embeddings for semantic search',
    configFields: [
      {
        name: 'provider',
        type: 'select',
        required: true,
        description: 'Embedding provider',
        options: ['openai', 'ollama', 'huggingface'],
        default: 'openai'
      },
      {
        name: 'apiKey',
        type: 'string',
        required: false,
        description: 'API key (if using remote provider)',
        placeholder: 'sk-...'
      },
      {
        name: 'model',
        type: 'string',
        required: false,
        description: 'Model name',
        default: 'text-embedding-3-small',
        placeholder: 'text-embedding-3-small, nomic-embed-text'
      },
      {
        name: 'baseUrl',
        type: 'string',
        required: false,
        description: 'Base URL (for Ollama)',
        placeholder: 'http://localhost:11434'
      },
    ],
    inputPorts: [
      {
        id: 'text',
        name: 'Text',
        type: ['string', 'array'],
        required: true,
        description: 'Text or array of texts to embed'
      },
    ],
    outputPorts: [
      {
        id: 'embeddings',
        name: 'Embeddings',
        type: 'array',
        description: 'Vector embeddings'
      },
      {
        id: 'dimensions',
        name: 'Dimensions',
        type: 'number',
        description: 'Vector dimensions'
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
// Implementation varies by provider
if (config.provider === 'openai') {
  const OpenAI = require('openai');
  const client = new OpenAI({ apiKey: config.apiKey });

  const response = await client.embeddings.create({
    model: config.model,
    input: inputs.text,
  });

  return {
    embeddings: response.data.map(d => d.embedding),
    dimensions: response.data[0].embedding.length
  };
} else if (config.provider === 'ollama') {
  const ollama = require('ollama');
  const client = new ollama.Ollama({ host: config.baseUrl });

  const texts = Array.isArray(inputs.text) ? inputs.text : [inputs.text];
  const embeddings = await Promise.all(
    texts.map(t => client.embeddings({ model: config.model, prompt: t }))
  );

  return {
    embeddings: embeddings.map(e => e.embedding),
    dimensions: embeddings[0].embedding.length
  };
}
    `,
  },

  {
    id: 'llm-json-mode',
    name: 'Structured JSON Output',
    category: 'ai' as any,
    icon: '📋',
    color: '#6366F1',
    description: 'Get structured JSON responses from LLMs',
    configFields: [
      {
        name: 'provider',
        type: 'select',
        required: true,
        description: 'LLM provider',
        options: ['openai', 'groq', 'ollama'],
        default: 'openai'
      },
      {
        name: 'apiKey',
        type: 'string',
        required: false,
        description: 'API key',
        placeholder: 'sk-...'
      },
      {
        name: 'model',
        type: 'string',
        required: true,
        description: 'Model name',
        placeholder: 'gpt-4o-mini, llama3.2:latest'
      },
      {
        name: 'temperature',
        type: 'number',
        required: false,
        description: 'Temperature',
        default: 0.3
      },
    ],
    inputPorts: [
      {
        id: 'prompt',
        name: 'Prompt',
        type: ['string'],
        required: true,
        description: 'User prompt'
      },
      {
        id: 'schema',
        name: 'JSON Schema',
        type: ['object'],
        required: true,
        description: 'Expected JSON structure'
      },
    ],
    outputPorts: [
      {
        id: 'data',
        name: 'Parsed Data',
        type: 'object',
        description: 'Structured JSON data'
      },
      {
        id: 'raw',
        name: 'Raw Response',
        type: 'string',
        description: 'Raw LLM response'
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
const systemPrompt = \`You must respond with valid JSON matching this schema:
\${JSON.stringify(inputs.schema, null, 2)}

Only return the JSON, no other text.\`;

// Use provider-specific JSON mode
let response;
if (config.provider === 'openai') {
  const OpenAI = require('openai');
  const client = new OpenAI({ apiKey: config.apiKey });

  const completion = await client.chat.completions.create({
    model: config.model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: inputs.prompt }
    ],
    response_format: { type: 'json_object' },
    temperature: config.temperature,
  });

  response = completion.choices[0].message.content;
}

const data = JSON.parse(response);

return {
  data,
  raw: response
};
    `,
  },
]
