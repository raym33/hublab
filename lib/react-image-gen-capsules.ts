import type { CompleteCapsule } from './capsule-compiler/types'

/**
 * AI Image Generation Capsules
 * Support for open-source and commercial image generation solutions
 */

export const imageGenCapsules: CompleteCapsule[] = [
  // ============================================
  // OPEN-SOURCE IMAGE GENERATION (Local)
  // ============================================

  {
    id: 'img-stable-diffusion',
    name: 'Stable Diffusion (Local)',
    category: 'ai' as any,
    icon: '🎨',
    color: '#8B5CF6',
    description: 'Run Stable Diffusion locally with Automatic1111 or ComfyUI',
    configFields: [
      {
        name: 'baseUrl',
        type: 'string',
        required: false,
        description: 'Stable Diffusion WebUI URL',
        default: 'http://127.0.0.1:7860',
        placeholder: 'http://127.0.0.1:7860'
      },
      {
        name: 'model',
        type: 'select',
        required: false,
        description: 'Model checkpoint',
        options: [
          'sd_xl_base_1.0.safetensors',
          'sd_xl_turbo_1.0.safetensors',
          'v1-5-pruned-emaonly.safetensors',
          'dreamshaper_8.safetensors',
          'realisticVision_v51.safetensors',
          'custom'
        ],
        default: 'sd_xl_base_1.0.safetensors'
      },
      {
        name: 'customModel',
        type: 'string',
        required: false,
        description: 'Custom model name (if model=custom)',
        placeholder: 'my-model.safetensors'
      },
      {
        name: 'width',
        type: 'number',
        required: false,
        description: 'Image width',
        default: 1024
      },
      {
        name: 'height',
        type: 'number',
        required: false,
        description: 'Image height',
        default: 1024
      },
      {
        name: 'steps',
        type: 'number',
        required: false,
        description: 'Sampling steps (20-100)',
        default: 30
      },
      {
        name: 'cfgScale',
        type: 'number',
        required: false,
        description: 'CFG Scale (1-30)',
        default: 7.5
      },
      {
        name: 'sampler',
        type: 'select',
        required: false,
        description: 'Sampling method',
        options: [
          'Euler a',
          'Euler',
          'DPM++ 2M',
          'DPM++ 2M Karras',
          'DPM++ SDE Karras',
          'DDIM',
        ],
        default: 'DPM++ 2M Karras'
      },
    ],
    inputPorts: [
      {
        id: 'prompt',
        name: 'Prompt',
        type: ['string'],
        required: true,
        description: 'Image description'
      },
      {
        id: 'negativePrompt',
        name: 'Negative Prompt',
        type: ['string'],
        required: false,
        description: 'What to avoid in the image'
      },
      {
        id: 'seed',
        name: 'Seed',
        type: ['number'],
        required: false,
        description: 'Random seed for reproducibility'
      },
    ],
    outputPorts: [
      {
        id: 'imageUrl',
        name: 'Image URL',
        type: 'string',
        description: 'URL to generated image'
      },
      {
        id: 'imageBuffer',
        name: 'Image Buffer',
        type: 'buffer',
        description: 'Image data as buffer'
      },
      {
        id: 'seed',
        name: 'Seed Used',
        type: 'number',
        description: 'Seed that was used'
      },
      {
        id: 'error',
        name: 'Error',
        type: 'string',
        description: 'Error message if failed'
      },
    ],
    npmPackage: 'axios',
    documentation: 'https://github.com/AUTOMATIC1111/stable-diffusion-webui',
    codeTemplate: `
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const modelName = config.model === 'custom' ? config.customModel : config.model;

const payload = {
  prompt: inputs.prompt,
  negative_prompt: inputs.negativePrompt || '',
  steps: config.steps,
  cfg_scale: config.cfgScale,
  width: config.width,
  height: config.height,
  sampler_name: config.sampler,
  seed: inputs.seed || -1,
  override_settings: {
    sd_model_checkpoint: modelName
  }
};

const response = await axios.post(\`\${config.baseUrl}/sdapi/v1/txt2img\`, payload);

// Decode base64 image
const imageBuffer = Buffer.from(response.data.images[0], 'base64');

// Save to file
const outputPath = path.join('/tmp', \`sd-\${Date.now()}.png\`);
fs.writeFileSync(outputPath, imageBuffer);

return {
  imageUrl: outputPath,
  imageBuffer,
  seed: response.data.parameters?.seed || inputs.seed || -1
};
    `,
  },

  {
    id: 'img-comfyui',
    name: 'ComfyUI (Advanced)',
    category: 'ai' as any,
    icon: '🖼️',
    color: '#8B5CF6',
    description: 'Advanced node-based Stable Diffusion interface',
    configFields: [
      {
        name: 'baseUrl',
        type: 'string',
        required: false,
        description: 'ComfyUI server URL',
        default: 'http://127.0.0.1:8188',
        placeholder: 'http://127.0.0.1:8188'
      },
      {
        name: 'workflow',
        type: 'textarea',
        required: true,
        description: 'ComfyUI workflow JSON',
        placeholder: '{ "nodes": [...] }'
      },
    ],
    inputPorts: [
      {
        id: 'prompt',
        name: 'Prompt',
        type: ['string'],
        required: true,
        description: 'Image description'
      },
      {
        id: 'workflowParams',
        name: 'Workflow Parameters',
        type: ['object'],
        required: false,
        description: 'Custom parameters for workflow'
      },
    ],
    outputPorts: [
      {
        id: 'images',
        name: 'Images',
        type: 'array',
        description: 'Array of generated images'
      },
      {
        id: 'error',
        name: 'Error',
        type: 'string',
        description: 'Error message if failed'
      },
    ],
    npmPackage: 'axios',
    documentation: 'https://github.com/comfyanonymous/ComfyUI',
    codeTemplate: `
const axios = require('axios');

// Parse workflow and inject prompt
const workflow = JSON.parse(config.workflow);

// Find prompt node and update
for (const nodeId in workflow) {
  const node = workflow[nodeId];
  if (node.class_type === 'CLIPTextEncode' && node.inputs?.text !== undefined) {
    node.inputs.text = inputs.prompt;
  }
  // Merge custom params if provided
  if (inputs.workflowParams) {
    Object.assign(node.inputs || {}, inputs.workflowParams[nodeId] || {});
  }
}

// Queue the workflow
const queueResponse = await axios.post(\`\${config.baseUrl}/prompt\`, {
  prompt: workflow
});

const promptId = queueResponse.data.prompt_id;

// Poll for completion
let images = [];
let completed = false;
while (!completed) {
  await new Promise(resolve => setTimeout(resolve, 1000));

  const historyResponse = await axios.get(\`\${config.baseUrl}/history/\${promptId}\`);
  const history = historyResponse.data[promptId];

  if (history?.outputs) {
    for (const nodeId in history.outputs) {
      const output = history.outputs[nodeId];
      if (output.images) {
        images = output.images.map(img =>
          \`\${config.baseUrl}/view?filename=\${img.filename}&subfolder=\${img.subfolder || ''}&type=\${img.type || 'output'}\`
        );
      }
    }
    completed = true;
  }
}

return {
  images
};
    `,
  },

  {
    id: 'img-invokeai',
    name: 'InvokeAI',
    category: 'ai' as any,
    icon: '✨',
    color: '#8B5CF6',
    description: 'Professional Stable Diffusion with unified canvas and nodes',
    configFields: [
      {
        name: 'baseUrl',
        type: 'string',
        required: false,
        description: 'InvokeAI server URL',
        default: 'http://127.0.0.1:9090',
        placeholder: 'http://127.0.0.1:9090'
      },
      {
        name: 'model',
        type: 'string',
        required: true,
        description: 'Model name',
        placeholder: 'stable-diffusion-xl-base-1-0'
      },
      {
        name: 'width',
        type: 'number',
        required: false,
        description: 'Image width',
        default: 1024
      },
      {
        name: 'height',
        type: 'number',
        required: false,
        description: 'Image height',
        default: 1024
      },
      {
        name: 'steps',
        type: 'number',
        required: false,
        description: 'Sampling steps',
        default: 30
      },
    ],
    inputPorts: [
      {
        id: 'prompt',
        name: 'Prompt',
        type: ['string'],
        required: true,
        description: 'Image description'
      },
      {
        id: 'negativePrompt',
        name: 'Negative Prompt',
        type: ['string'],
        required: false,
        description: 'What to avoid'
      },
    ],
    outputPorts: [
      {
        id: 'imageUrl',
        name: 'Image URL',
        type: 'string',
        description: 'URL to generated image'
      },
      {
        id: 'error',
        name: 'Error',
        type: 'string',
        description: 'Error message if failed'
      },
    ],
    npmPackage: 'axios',
    documentation: 'https://github.com/invoke-ai/InvokeAI',
    codeTemplate: `
const axios = require('axios');

const response = await axios.post(\`\${config.baseUrl}/api/v1/generate\`, {
  model: config.model,
  prompt: inputs.prompt,
  negative_prompt: inputs.negativePrompt || '',
  width: config.width,
  height: config.height,
  steps: config.steps
});

return {
  imageUrl: \`\${config.baseUrl}\${response.data.url}\`
};
    `,
  },

  // ============================================
  // COMMERCIAL IMAGE GENERATION APIs
  // ============================================

  {
    id: 'img-dalle',
    name: 'DALL-E (OpenAI)',
    category: 'ai' as any,
    icon: '🎨',
    color: '#10B981',
    description: 'OpenAI DALL-E 3 - High quality image generation',
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
        options: ['dall-e-3', 'dall-e-2'],
        default: 'dall-e-3'
      },
      {
        name: 'size',
        type: 'select',
        required: false,
        description: 'Image size',
        options: ['1024x1024', '1792x1024', '1024x1792'],
        default: '1024x1024'
      },
      {
        name: 'quality',
        type: 'select',
        required: false,
        description: 'Quality (DALL-E 3 only)',
        options: ['standard', 'hd'],
        default: 'standard'
      },
      {
        name: 'style',
        type: 'select',
        required: false,
        description: 'Style (DALL-E 3 only)',
        options: ['vivid', 'natural'],
        default: 'vivid'
      },
    ],
    inputPorts: [
      {
        id: 'prompt',
        name: 'Prompt',
        type: ['string'],
        required: true,
        description: 'Image description (max 4000 chars)'
      },
    ],
    outputPorts: [
      {
        id: 'imageUrl',
        name: 'Image URL',
        type: 'string',
        description: 'URL to generated image'
      },
      {
        id: 'revisedPrompt',
        name: 'Revised Prompt',
        type: 'string',
        description: 'DALL-E 3 revised prompt'
      },
      {
        id: 'error',
        name: 'Error',
        type: 'string',
        description: 'Error message if failed'
      },
    ],
    npmPackage: 'openai',
    documentation: 'https://platform.openai.com/docs/guides/images',
    codeTemplate: `
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: config.apiKey
});

const response = await openai.images.generate({
  model: config.model,
  prompt: inputs.prompt,
  size: config.size,
  quality: config.model === 'dall-e-3' ? config.quality : undefined,
  style: config.model === 'dall-e-3' ? config.style : undefined,
  n: 1,
});

return {
  imageUrl: response.data[0].url,
  revisedPrompt: response.data[0].revised_prompt
};
    `,
  },

  {
    id: 'img-midjourney',
    name: 'Midjourney (via Replicate)',
    category: 'ai' as any,
    icon: '🌌',
    color: '#EC4899',
    description: 'Midjourney-style generation via Replicate',
    configFields: [
      {
        name: 'apiToken',
        type: 'string',
        required: true,
        description: 'Replicate API token',
        placeholder: 'r8_...'
      },
      {
        name: 'aspectRatio',
        type: 'select',
        required: false,
        description: 'Aspect ratio',
        options: ['1:1', '16:9', '9:16', '4:3', '3:4', '21:9'],
        default: '1:1'
      },
    ],
    inputPorts: [
      {
        id: 'prompt',
        name: 'Prompt',
        type: ['string'],
        required: true,
        description: 'Image description'
      },
    ],
    outputPorts: [
      {
        id: 'imageUrl',
        name: 'Image URL',
        type: 'string',
        description: 'URL to generated image'
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

// Using Midjourney-style model
const output = await replicate.run(
  "prompthero/openjourney:9936c2001faa2194a261c01381f90e65261879985476014a0a37a334593a05eb",
  {
    input: {
      prompt: inputs.prompt,
      width: 512,
      height: 512,
      num_outputs: 1,
    }
  }
);

return {
  imageUrl: Array.isArray(output) ? output[0] : output
};
    `,
  },

  {
    id: 'img-flux',
    name: 'Flux (Black Forest Labs)',
    category: 'ai' as any,
    icon: '⚡',
    color: '#F59E0B',
    description: 'Flux Pro/Dev - State-of-the-art image generation',
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
        description: 'Flux model',
        options: [
          'flux-pro',
          'flux-dev',
          'flux-schnell'
        ],
        default: 'flux-dev'
      },
      {
        name: 'aspectRatio',
        type: 'select',
        required: false,
        description: 'Aspect ratio',
        options: ['1:1', '16:9', '9:16', '4:3', '3:4', '3:2', '2:3'],
        default: '1:1'
      },
      {
        name: 'outputFormat',
        type: 'select',
        required: false,
        description: 'Output format',
        options: ['webp', 'jpg', 'png'],
        default: 'webp'
      },
      {
        name: 'steps',
        type: 'number',
        required: false,
        description: 'Steps (1-50)',
        default: 25
      },
    ],
    inputPorts: [
      {
        id: 'prompt',
        name: 'Prompt',
        type: ['string'],
        required: true,
        description: 'Image description'
      },
    ],
    outputPorts: [
      {
        id: 'imageUrl',
        name: 'Image URL',
        type: 'string',
        description: 'URL to generated image'
      },
      {
        id: 'error',
        name: 'Error',
        type: 'string',
        description: 'Error message if failed'
      },
    ],
    npmPackage: 'replicate',
    documentation: 'https://replicate.com/black-forest-labs',
    codeTemplate: `
const Replicate = require('replicate');

const replicate = new Replicate({
  auth: config.apiToken,
});

const modelMap = {
  'flux-pro': 'black-forest-labs/flux-pro',
  'flux-dev': 'black-forest-labs/flux-dev',
  'flux-schnell': 'black-forest-labs/flux-schnell'
};

const output = await replicate.run(
  modelMap[config.model],
  {
    input: {
      prompt: inputs.prompt,
      aspect_ratio: config.aspectRatio,
      output_format: config.outputFormat,
      num_inference_steps: config.steps
    }
  }
);

return {
  imageUrl: Array.isArray(output) ? output[0] : output
};
    `,
  },

  {
    id: 'img-leonardo',
    name: 'Leonardo.AI',
    category: 'ai' as any,
    icon: '🎭',
    color: '#6366F1',
    description: 'Leonardo.AI - Game assets and creative art generation',
    configFields: [
      {
        name: 'apiKey',
        type: 'string',
        required: true,
        description: 'Leonardo.AI API key',
        placeholder: 'your-api-key'
      },
      {
        name: 'modelId',
        type: 'select',
        required: false,
        description: 'Model',
        options: [
          'leonardo-diffusion-xl',
          'leonardo-vision-xl',
          'leonardo-anime-xl',
          'custom'
        ],
        default: 'leonardo-diffusion-xl'
      },
      {
        name: 'customModelId',
        type: 'string',
        required: false,
        description: 'Custom model ID',
        placeholder: 'your-model-id'
      },
      {
        name: 'width',
        type: 'number',
        required: false,
        description: 'Width (64-1024)',
        default: 1024
      },
      {
        name: 'height',
        type: 'number',
        required: false,
        description: 'Height (64-1024)',
        default: 1024
      },
      {
        name: 'numImages',
        type: 'number',
        required: false,
        description: 'Number of images (1-8)',
        default: 1
      },
    ],
    inputPorts: [
      {
        id: 'prompt',
        name: 'Prompt',
        type: ['string'],
        required: true,
        description: 'Image description'
      },
      {
        id: 'negativePrompt',
        name: 'Negative Prompt',
        type: ['string'],
        required: false,
        description: 'What to avoid'
      },
    ],
    outputPorts: [
      {
        id: 'images',
        name: 'Images',
        type: 'array',
        description: 'Array of generated image URLs'
      },
      {
        id: 'error',
        name: 'Error',
        type: 'string',
        description: 'Error message if failed'
      },
    ],
    npmPackage: 'axios',
    documentation: 'https://docs.leonardo.ai/',
    codeTemplate: `
const axios = require('axios');

const modelId = config.modelId === 'custom' ? config.customModelId : config.modelId;

const response = await axios.post(
  'https://cloud.leonardo.ai/api/rest/v1/generations',
  {
    prompt: inputs.prompt,
    negative_prompt: inputs.negativePrompt,
    modelId,
    width: config.width,
    height: config.height,
    num_images: config.numImages
  },
  {
    headers: {
      'Authorization': \`Bearer \${config.apiKey}\`,
      'Content-Type': 'application/json'
    }
  }
);

const generationId = response.data.sdGenerationJob.generationId;

// Poll for completion
let images = [];
let attempts = 0;
while (attempts < 60) {
  await new Promise(resolve => setTimeout(resolve, 2000));

  const statusResponse = await axios.get(
    \`https://cloud.leonardo.ai/api/rest/v1/generations/\${generationId}\`,
    {
      headers: {
        'Authorization': \`Bearer \${config.apiKey}\`
      }
    }
  );

  if (statusResponse.data.generations_by_pk?.status === 'COMPLETE') {
    images = statusResponse.data.generations_by_pk.generated_images.map(img => img.url);
    break;
  }

  attempts++;
}

return {
  images
};
    `,
  },

  // ============================================
  // SPECIALIZED IMAGE GENERATION
  // ============================================

  {
    id: 'img-controlnet',
    name: 'ControlNet (Pose/Edge)',
    category: 'ai' as any,
    icon: '🎯',
    color: '#8B5CF6',
    description: 'Generate images with pose, edge, or depth control',
    configFields: [
      {
        name: 'baseUrl',
        type: 'string',
        required: false,
        description: 'Stable Diffusion WebUI URL',
        default: 'http://127.0.0.1:7860',
        placeholder: 'http://127.0.0.1:7860'
      },
      {
        name: 'controlType',
        type: 'select',
        required: true,
        description: 'Control type',
        options: [
          'canny',
          'depth',
          'pose',
          'normal',
          'scribble',
          'seg'
        ],
        default: 'canny'
      },
      {
        name: 'model',
        type: 'string',
        required: false,
        description: 'ControlNet model',
        placeholder: 'control_v11p_sd15_canny'
      },
    ],
    inputPorts: [
      {
        id: 'prompt',
        name: 'Prompt',
        type: ['string'],
        required: true,
        description: 'Image description'
      },
      {
        id: 'controlImage',
        name: 'Control Image',
        type: ['string', 'buffer'],
        required: true,
        description: 'Input image (URL or base64)'
      },
    ],
    outputPorts: [
      {
        id: 'imageUrl',
        name: 'Image URL',
        type: 'string',
        description: 'URL to generated image'
      },
      {
        id: 'error',
        name: 'Error',
        type: 'string',
        description: 'Error message if failed'
      },
    ],
    npmPackage: 'axios',
    documentation: 'https://github.com/Mikubill/sd-webui-controlnet',
    codeTemplate: `
const axios = require('axios');
const fs = require('fs');

// Convert control image to base64 if needed
let controlImageBase64 = inputs.controlImage;
if (Buffer.isBuffer(inputs.controlImage)) {
  controlImageBase64 = inputs.controlImage.toString('base64');
} else if (inputs.controlImage.startsWith('http')) {
  const imgResponse = await axios.get(inputs.controlImage, { responseType: 'arraybuffer' });
  controlImageBase64 = Buffer.from(imgResponse.data).toString('base64');
}

const payload = {
  prompt: inputs.prompt,
  alwayson_scripts: {
    controlnet: {
      args: [{
        module: config.controlType,
        model: config.model,
        input_image: controlImageBase64,
        weight: 1.0
      }]
    }
  }
};

const response = await axios.post(\`\${config.baseUrl}/sdapi/v1/txt2img\`, payload);

const imageBuffer = Buffer.from(response.data.images[0], 'base64');
const outputPath = \`/tmp/controlnet-\${Date.now()}.png\`;
fs.writeFileSync(outputPath, imageBuffer);

return {
  imageUrl: outputPath
};
    `,
  },

  {
    id: 'img-upscale',
    name: 'AI Image Upscaler',
    category: 'ai' as any,
    icon: '🔍',
    color: '#10B981',
    description: 'Upscale images 2x-4x with AI enhancement',
    configFields: [
      {
        name: 'method',
        type: 'select',
        required: true,
        description: 'Upscaling method',
        options: [
          'esrgan',
          'realesrgan',
          'swinir',
          'replicate'
        ],
        default: 'realesrgan'
      },
      {
        name: 'scale',
        type: 'select',
        required: false,
        description: 'Scale factor',
        options: ['2', '4'],
        default: '4'
      },
      {
        name: 'apiToken',
        type: 'string',
        required: false,
        description: 'Replicate API token (if using Replicate)',
        placeholder: 'r8_...'
      },
    ],
    inputPorts: [
      {
        id: 'image',
        name: 'Image',
        type: ['string', 'buffer'],
        required: true,
        description: 'Input image (URL or buffer)'
      },
    ],
    outputPorts: [
      {
        id: 'imageUrl',
        name: 'Upscaled Image URL',
        type: 'string',
        description: 'URL to upscaled image'
      },
      {
        id: 'error',
        name: 'Error',
        type: 'string',
        description: 'Error message if failed'
      },
    ],
    npmPackage: 'replicate',
    documentation: 'https://github.com/xinntao/Real-ESRGAN',
    codeTemplate: `
const Replicate = require('replicate');

if (config.method === 'replicate') {
  const replicate = new Replicate({
    auth: config.apiToken,
  });

  const output = await replicate.run(
    "nightmareai/real-esrgan:42fed1c4974146d4d2414e2be2c5277c7fcf05fcc3a73abf41610695738c1d7b",
    {
      input: {
        image: inputs.image,
        scale: parseInt(config.scale)
      }
    }
  );

  return {
    imageUrl: output
  };
}
// Add local upscaling methods here
    `,
  },

  {
    id: 'img-inpaint',
    name: 'Image Inpainting',
    category: 'ai' as any,
    icon: '🖌️',
    color: '#EC4899',
    description: 'Remove or replace objects in images with AI',
    configFields: [
      {
        name: 'provider',
        type: 'select',
        required: true,
        description: 'Inpainting provider',
        options: ['stable-diffusion', 'dalle', 'replicate'],
        default: 'stable-diffusion'
      },
      {
        name: 'apiKey',
        type: 'string',
        required: false,
        description: 'API key (if using cloud)',
        placeholder: 'sk-... or r8_...'
      },
      {
        name: 'baseUrl',
        type: 'string',
        required: false,
        description: 'SD WebUI URL (if local)',
        placeholder: 'http://127.0.0.1:7860'
      },
    ],
    inputPorts: [
      {
        id: 'image',
        name: 'Image',
        type: ['string', 'buffer'],
        required: true,
        description: 'Input image'
      },
      {
        id: 'mask',
        name: 'Mask',
        type: ['string', 'buffer'],
        required: true,
        description: 'Mask image (white = inpaint area)'
      },
      {
        id: 'prompt',
        name: 'Prompt',
        type: ['string'],
        required: true,
        description: 'What to generate in masked area'
      },
    ],
    outputPorts: [
      {
        id: 'imageUrl',
        name: 'Inpainted Image URL',
        type: 'string',
        description: 'URL to inpainted image'
      },
      {
        id: 'error',
        name: 'Error',
        type: 'string',
        description: 'Error message if failed'
      },
    ],
    npmPackage: 'openai',
    documentation: 'https://platform.openai.com/docs/guides/images/edits',
    codeTemplate: `
if (config.provider === 'dalle') {
  const OpenAI = require('openai');
  const openai = new OpenAI({ apiKey: config.apiKey });

  const response = await openai.images.edit({
    image: inputs.image,
    mask: inputs.mask,
    prompt: inputs.prompt,
    n: 1,
    size: '1024x1024'
  });

  return {
    imageUrl: response.data[0].url
  };
}
// Add other providers...
    `,
  },
]
