import type { CompleteCapsule } from './capsule-compiler/types'

/**
 * Image Processing & Scaling Capsules
 * Support for image manipulation, resizing, optimization, and transformations
 */

export const imageProcessingCapsules: CompleteCapsule[] = [
  // ============================================
  // IMAGE SCALING & RESIZING
  // ============================================

  {
    id: 'img-sharp-resize',
    name: 'Sharp Image Resize',
    category: 'content' as any,
    icon: '📐',
    color: '#10B981',
    description: 'High-performance image resizing with Sharp (fastest Node.js library)',
    configFields: [
      {
        name: 'width',
        type: 'number',
        required: false,
        description: 'Target width (px)',
        placeholder: '800'
      },
      {
        name: 'height',
        type: 'number',
        required: false,
        description: 'Target height (px)',
        placeholder: '600'
      },
      {
        name: 'fit',
        type: 'select',
        required: false,
        description: 'Fit mode',
        options: ['cover', 'contain', 'fill', 'inside', 'outside'],
        default: 'cover'
      },
      {
        name: 'position',
        type: 'select',
        required: false,
        description: 'Position (for cover/contain)',
        options: ['center', 'top', 'right top', 'right', 'right bottom', 'bottom', 'left bottom', 'left', 'left top'],
        default: 'center'
      },
      {
        name: 'withoutEnlargement',
        type: 'boolean',
        required: false,
        description: 'Don\'t enlarge if input is smaller',
        default: false
      },
      {
        name: 'format',
        type: 'select',
        required: false,
        description: 'Output format',
        options: ['jpeg', 'png', 'webp', 'avif', 'tiff', 'gif'],
        default: 'jpeg'
      },
      {
        name: 'quality',
        type: 'number',
        required: false,
        description: 'Quality (1-100)',
        default: 80
      },
    ],
    inputPorts: [
      {
        id: 'image',
        name: 'Image',
        type: ['string', 'buffer'],
        required: true,
        description: 'Input image (path, URL, or buffer)'
      },
    ],
    outputPorts: [
      {
        id: 'buffer',
        name: 'Image Buffer',
        type: 'buffer',
        description: 'Resized image as buffer'
      },
      {
        id: 'url',
        name: 'Image URL',
        type: 'string',
        description: 'URL to saved image'
      },
      {
        id: 'metadata',
        name: 'Metadata',
        type: 'object',
        description: 'Image info (width, height, format, size)'
      },
      {
        id: 'error',
        name: 'Error',
        type: 'string',
        description: 'Error message if failed'
      },
    ],
    npmPackage: 'sharp',
    documentation: 'https://sharp.pixelplumbing.com/',
    codeTemplate: `
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Load image
let imageInput;
if (typeof inputs.image === 'string') {
  if (inputs.image.startsWith('http')) {
    const response = await axios.get(inputs.image, { responseType: 'arraybuffer' });
    imageInput = Buffer.from(response.data);
  } else {
    imageInput = inputs.image; // file path
  }
} else {
  imageInput = inputs.image; // buffer
}

// Process image
let pipeline = sharp(imageInput);

// Resize
if (config.width || config.height) {
  pipeline = pipeline.resize({
    width: config.width,
    height: config.height,
    fit: config.fit,
    position: config.position,
    withoutEnlargement: config.withoutEnlargement
  });
}

// Convert format and set quality
pipeline = pipeline[config.format]({ quality: config.quality });

// Get buffer
const buffer = await pipeline.toBuffer();

// Get metadata
const metadata = await sharp(buffer).metadata();

// Save to file
const outputPath = path.join('/tmp', \`sharp-\${Date.now()}.\${config.format}\`);
fs.writeFileSync(outputPath, buffer);

return {
  buffer,
  url: outputPath,
  metadata: {
    width: metadata.width,
    height: metadata.height,
    format: metadata.format,
    size: buffer.length
  }
};
    `,
  },

  {
    id: 'img-jimp-resize',
    name: 'Jimp Image Resize',
    category: 'content' as any,
    icon: '🖼️',
    color: '#10B981',
    description: 'Pure JavaScript image processing (no native dependencies)',
    configFields: [
      {
        name: 'width',
        type: 'number',
        required: true,
        description: 'Target width (px or AUTO)',
        placeholder: '800'
      },
      {
        name: 'height',
        type: 'number',
        required: true,
        description: 'Target height (px or AUTO)',
        placeholder: '600'
      },
      {
        name: 'mode',
        type: 'select',
        required: false,
        description: 'Resize mode',
        options: ['RESIZE_BILINEAR', 'RESIZE_NEAREST_NEIGHBOR', 'RESIZE_BICUBIC', 'RESIZE_HERMITE', 'RESIZE_BEZIER'],
        default: 'RESIZE_BILINEAR'
      },
      {
        name: 'quality',
        type: 'number',
        required: false,
        description: 'JPEG quality (1-100)',
        default: 80
      },
    ],
    inputPorts: [
      {
        id: 'image',
        name: 'Image',
        type: ['string', 'buffer'],
        required: true,
        description: 'Input image (path, URL, or buffer)'
      },
    ],
    outputPorts: [
      {
        id: 'buffer',
        name: 'Image Buffer',
        type: 'buffer',
        description: 'Resized image as buffer'
      },
      {
        id: 'url',
        name: 'Image URL',
        type: 'string',
        description: 'URL to saved image'
      },
      {
        id: 'width',
        name: 'Width',
        type: 'number',
        description: 'Final width'
      },
      {
        id: 'height',
        name: 'Height',
        type: 'number',
        description: 'Final height'
      },
      {
        id: 'error',
        name: 'Error',
        type: 'string',
        description: 'Error message if failed'
      },
    ],
    npmPackage: 'jimp',
    documentation: 'https://github.com/jimp-dev/jimp',
    codeTemplate: `
const Jimp = require('jimp');
const path = require('path');

// Load image
const image = await Jimp.read(inputs.image);

// Resize (AUTO means maintain aspect ratio)
const width = config.width === 'AUTO' ? Jimp.AUTO : config.width;
const height = config.height === 'AUTO' ? Jimp.AUTO : config.height;

image.resize(width, height, Jimp[config.mode]);

// Set quality
image.quality(config.quality);

// Get buffer
const buffer = await image.getBufferAsync(Jimp.MIME_JPEG);

// Save to file
const outputPath = path.join('/tmp', \`jimp-\${Date.now()}.jpg\`);
await image.writeAsync(outputPath);

return {
  buffer,
  url: outputPath,
  width: image.getWidth(),
  height: image.getHeight()
};
    `,
  },

  {
    id: 'img-imagemagick-resize',
    name: 'ImageMagick Resize',
    category: 'content' as any,
    icon: '🎩',
    color: '#10B981',
    description: 'Industrial-strength image processing with ImageMagick',
    configFields: [
      {
        name: 'width',
        type: 'number',
        required: false,
        description: 'Target width (px)',
        placeholder: '800'
      },
      {
        name: 'height',
        type: 'number',
        required: false,
        description: 'Target height (px)',
        placeholder: '600'
      },
      {
        name: 'gravity',
        type: 'select',
        required: false,
        description: 'Gravity (for cropping)',
        options: ['Center', 'North', 'NorthEast', 'East', 'SouthEast', 'South', 'SouthWest', 'West', 'NorthWest'],
        default: 'Center'
      },
      {
        name: 'filter',
        type: 'select',
        required: false,
        description: 'Resize filter',
        options: ['Lanczos', 'Mitchell', 'Catrom', 'Triangle', 'Box', 'Gaussian'],
        default: 'Lanczos'
      },
      {
        name: 'quality',
        type: 'number',
        required: false,
        description: 'Quality (1-100)',
        default: 90
      },
    ],
    inputPorts: [
      {
        id: 'image',
        name: 'Image',
        type: ['string'],
        required: true,
        description: 'Input image path'
      },
    ],
    outputPorts: [
      {
        id: 'url',
        name: 'Image URL',
        type: 'string',
        description: 'URL to resized image'
      },
      {
        id: 'error',
        name: 'Error',
        type: 'string',
        description: 'Error message if failed'
      },
    ],
    npmPackage: 'imagemagick',
    documentation: 'https://imagemagick.org/',
    codeTemplate: `
const im = require('imagemagick');
const path = require('path');
const { promisify } = require('util');
const resize = promisify(im.resize);

const outputPath = path.join('/tmp', \`magick-\${Date.now()}.jpg\`);

await resize({
  srcPath: inputs.image,
  dstPath: outputPath,
  width: config.width,
  height: config.height,
  gravity: config.gravity,
  filter: config.filter,
  quality: config.quality / 100
});

return {
  url: outputPath
};
    `,
  },

  // ============================================
  // IMAGE OPTIMIZATION
  // ============================================

  {
    id: 'img-optimize',
    name: 'Image Optimizer',
    category: 'content' as any,
    icon: '⚡',
    color: '#F59E0B',
    description: 'Compress and optimize images for web (lossless & lossy)',
    configFields: [
      {
        name: 'method',
        type: 'select',
        required: true,
        description: 'Optimization method',
        options: ['sharp', 'imagemin', 'squoosh'],
        default: 'sharp'
      },
      {
        name: 'quality',
        type: 'number',
        required: false,
        description: 'Quality (1-100)',
        default: 80
      },
      {
        name: 'lossless',
        type: 'boolean',
        required: false,
        description: 'Lossless compression',
        default: false
      },
      {
        name: 'stripMetadata',
        type: 'boolean',
        required: false,
        description: 'Remove EXIF metadata',
        default: true
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
    ],
    outputPorts: [
      {
        id: 'buffer',
        name: 'Optimized Buffer',
        type: 'buffer',
        description: 'Optimized image buffer'
      },
      {
        id: 'url',
        name: 'Image URL',
        type: 'string',
        description: 'URL to optimized image'
      },
      {
        id: 'originalSize',
        name: 'Original Size',
        type: 'number',
        description: 'Original file size (bytes)'
      },
      {
        id: 'optimizedSize',
        name: 'Optimized Size',
        type: 'number',
        description: 'Optimized file size (bytes)'
      },
      {
        id: 'savedBytes',
        name: 'Saved Bytes',
        type: 'number',
        description: 'Bytes saved'
      },
      {
        id: 'savedPercent',
        name: 'Saved Percent',
        type: 'number',
        description: 'Percentage saved'
      },
      {
        id: 'error',
        name: 'Error',
        type: 'string',
        description: 'Error message if failed'
      },
    ],
    npmPackage: 'sharp',
    documentation: 'https://sharp.pixelplumbing.com/',
    codeTemplate: `
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Load image
let imageBuffer;
if (typeof inputs.image === 'string') {
  if (inputs.image.startsWith('http')) {
    const axios = require('axios');
    const response = await axios.get(inputs.image, { responseType: 'arraybuffer' });
    imageBuffer = Buffer.from(response.data);
  } else {
    imageBuffer = fs.readFileSync(inputs.image);
  }
} else {
  imageBuffer = inputs.image;
}

const originalSize = imageBuffer.length;

// Optimize with Sharp
let pipeline = sharp(imageBuffer);

if (config.stripMetadata) {
  pipeline = pipeline.withMetadata({});
}

// Auto-detect format and optimize
const metadata = await sharp(imageBuffer).metadata();
const format = metadata.format;

if (format === 'jpeg' || format === 'jpg') {
  pipeline = pipeline.jpeg({
    quality: config.quality,
    mozjpeg: true // Better compression
  });
} else if (format === 'png') {
  pipeline = pipeline.png({
    quality: config.quality,
    compressionLevel: 9,
    adaptiveFiltering: true
  });
} else if (format === 'webp') {
  pipeline = pipeline.webp({
    quality: config.quality,
    lossless: config.lossless
  });
}

const buffer = await pipeline.toBuffer();
const optimizedSize = buffer.length;
const savedBytes = originalSize - optimizedSize;
const savedPercent = ((savedBytes / originalSize) * 100).toFixed(2);

// Save to file
const outputPath = path.join('/tmp', \`optimized-\${Date.now()}.\${format}\`);
fs.writeFileSync(outputPath, buffer);

return {
  buffer,
  url: outputPath,
  originalSize,
  optimizedSize,
  savedBytes,
  savedPercent: parseFloat(savedPercent)
};
    `,
  },

  {
    id: 'img-webp-converter',
    name: 'WebP Converter',
    category: 'content' as any,
    icon: '🌐',
    color: '#F59E0B',
    description: 'Convert images to WebP format (25-35% smaller than JPEG)',
    configFields: [
      {
        name: 'quality',
        type: 'number',
        required: false,
        description: 'Quality (1-100)',
        default: 80
      },
      {
        name: 'lossless',
        type: 'boolean',
        required: false,
        description: 'Lossless compression',
        default: false
      },
      {
        name: 'nearLossless',
        type: 'boolean',
        required: false,
        description: 'Near-lossless (better quality)',
        default: false
      },
      {
        name: 'effort',
        type: 'number',
        required: false,
        description: 'CPU effort (0-6, higher=smaller)',
        default: 4
      },
    ],
    inputPorts: [
      {
        id: 'image',
        name: 'Image',
        type: ['string', 'buffer'],
        required: true,
        description: 'Input image (any format)'
      },
    ],
    outputPorts: [
      {
        id: 'buffer',
        name: 'WebP Buffer',
        type: 'buffer',
        description: 'WebP image buffer'
      },
      {
        id: 'url',
        name: 'WebP URL',
        type: 'string',
        description: 'URL to WebP image'
      },
      {
        id: 'originalSize',
        name: 'Original Size',
        type: 'number',
        description: 'Original file size'
      },
      {
        id: 'webpSize',
        name: 'WebP Size',
        type: 'number',
        description: 'WebP file size'
      },
      {
        id: 'compressionRatio',
        name: 'Compression Ratio',
        type: 'number',
        description: 'Compression ratio'
      },
      {
        id: 'error',
        name: 'Error',
        type: 'string',
        description: 'Error message if failed'
      },
    ],
    npmPackage: 'sharp',
    documentation: 'https://developers.google.com/speed/webp',
    codeTemplate: `
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Load image
let imageBuffer;
if (typeof inputs.image === 'string') {
  if (inputs.image.startsWith('http')) {
    const axios = require('axios');
    const response = await axios.get(inputs.image, { responseType: 'arraybuffer' });
    imageBuffer = Buffer.from(response.data);
  } else {
    imageBuffer = fs.readFileSync(inputs.image);
  }
} else {
  imageBuffer = inputs.image;
}

const originalSize = imageBuffer.length;

// Convert to WebP
const webpBuffer = await sharp(imageBuffer)
  .webp({
    quality: config.quality,
    lossless: config.lossless,
    nearLossless: config.nearLossless,
    effort: config.effort
  })
  .toBuffer();

const webpSize = webpBuffer.length;
const compressionRatio = ((1 - (webpSize / originalSize)) * 100).toFixed(2);

// Save to file
const outputPath = path.join('/tmp', \`webp-\${Date.now()}.webp\`);
fs.writeFileSync(outputPath, webpBuffer);

return {
  buffer: webpBuffer,
  url: outputPath,
  originalSize,
  webpSize,
  compressionRatio: parseFloat(compressionRatio)
};
    `,
  },

  // ============================================
  // IMAGE TRANSFORMATIONS
  // ============================================

  {
    id: 'img-crop',
    name: 'Image Crop',
    category: 'content' as any,
    icon: '✂️',
    color: '#6366F1',
    description: 'Crop images to specific dimensions or aspect ratios',
    configFields: [
      {
        name: 'width',
        type: 'number',
        required: true,
        description: 'Crop width (px)',
        placeholder: '500'
      },
      {
        name: 'height',
        type: 'number',
        required: true,
        description: 'Crop height (px)',
        placeholder: '500'
      },
      {
        name: 'x',
        type: 'number',
        required: false,
        description: 'X offset (px)',
        default: 0
      },
      {
        name: 'y',
        type: 'number',
        required: false,
        description: 'Y offset (px)',
        default: 0
      },
      {
        name: 'gravity',
        type: 'select',
        required: false,
        description: 'Auto-crop gravity',
        options: ['center', 'north', 'northeast', 'east', 'southeast', 'south', 'southwest', 'west', 'northwest', 'smart'],
        default: 'center'
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
    ],
    outputPorts: [
      {
        id: 'buffer',
        name: 'Cropped Buffer',
        type: 'buffer',
        description: 'Cropped image buffer'
      },
      {
        id: 'url',
        name: 'Cropped URL',
        type: 'string',
        description: 'URL to cropped image'
      },
      {
        id: 'error',
        name: 'Error',
        type: 'string',
        description: 'Error message if failed'
      },
    ],
    npmPackage: 'sharp',
    codeTemplate: `
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Load image
let imageInput = inputs.image;
if (typeof inputs.image === 'string' && inputs.image.startsWith('http')) {
  const axios = require('axios');
  const response = await axios.get(inputs.image, { responseType: 'arraybuffer' });
  imageInput = Buffer.from(response.data);
}

// Crop using gravity or manual offset
const buffer = await sharp(imageInput)
  .extract({
    left: config.x,
    top: config.y,
    width: config.width,
    height: config.height
  })
  .toBuffer();

// Save to file
const outputPath = path.join('/tmp', \`cropped-\${Date.now()}.jpg\`);
fs.writeFileSync(outputPath, buffer);

return {
  buffer,
  url: outputPath
};
    `,
  },

  {
    id: 'img-rotate',
    name: 'Image Rotate',
    category: 'content' as any,
    icon: '🔄',
    color: '#6366F1',
    description: 'Rotate images by any angle',
    configFields: [
      {
        name: 'angle',
        type: 'number',
        required: true,
        description: 'Rotation angle (degrees)',
        placeholder: '90'
      },
      {
        name: 'background',
        type: 'string',
        required: false,
        description: 'Background color (hex)',
        default: '#ffffff',
        placeholder: '#ffffff'
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
    ],
    outputPorts: [
      {
        id: 'buffer',
        name: 'Rotated Buffer',
        type: 'buffer',
        description: 'Rotated image buffer'
      },
      {
        id: 'url',
        name: 'Rotated URL',
        type: 'string',
        description: 'URL to rotated image'
      },
      {
        id: 'error',
        name: 'Error',
        type: 'string',
        description: 'Error message if failed'
      },
    ],
    npmPackage: 'sharp',
    codeTemplate: `
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

let imageInput = inputs.image;
if (typeof inputs.image === 'string' && inputs.image.startsWith('http')) {
  const axios = require('axios');
  const response = await axios.get(inputs.image, { responseType: 'arraybuffer' });
  imageInput = Buffer.from(response.data);
}

const buffer = await sharp(imageInput)
  .rotate(config.angle, {
    background: config.background
  })
  .toBuffer();

const outputPath = path.join('/tmp', \`rotated-\${Date.now()}.jpg\`);
fs.writeFileSync(outputPath, buffer);

return {
  buffer,
  url: outputPath
};
    `,
  },

  {
    id: 'img-filters',
    name: 'Image Filters',
    category: 'content' as any,
    icon: '🎨',
    color: '#6366F1',
    description: 'Apply filters: grayscale, blur, sharpen, brightness, contrast',
    configFields: [
      {
        name: 'grayscale',
        type: 'boolean',
        required: false,
        description: 'Convert to grayscale',
        default: false
      },
      {
        name: 'blur',
        type: 'number',
        required: false,
        description: 'Blur amount (0.3-1000)',
        placeholder: '5'
      },
      {
        name: 'sharpen',
        type: 'number',
        required: false,
        description: 'Sharpen amount (0-10)',
        placeholder: '2'
      },
      {
        name: 'brightness',
        type: 'number',
        required: false,
        description: 'Brightness multiplier (0.5-2.0)',
        default: 1.0
      },
      {
        name: 'contrast',
        type: 'number',
        required: false,
        description: 'Contrast multiplier (0.5-2.0)',
        default: 1.0
      },
      {
        name: 'saturation',
        type: 'number',
        required: false,
        description: 'Saturation multiplier (0-2)',
        default: 1.0
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
    ],
    outputPorts: [
      {
        id: 'buffer',
        name: 'Filtered Buffer',
        type: 'buffer',
        description: 'Filtered image buffer'
      },
      {
        id: 'url',
        name: 'Filtered URL',
        type: 'string',
        description: 'URL to filtered image'
      },
      {
        id: 'error',
        name: 'Error',
        type: 'string',
        description: 'Error message if failed'
      },
    ],
    npmPackage: 'sharp',
    codeTemplate: `
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

let imageInput = inputs.image;
if (typeof inputs.image === 'string' && inputs.image.startsWith('http')) {
  const axios = require('axios');
  const response = await axios.get(inputs.image, { responseType: 'arraybuffer' });
  imageInput = Buffer.from(response.data);
}

let pipeline = sharp(imageInput);

if (config.grayscale) {
  pipeline = pipeline.grayscale();
}

if (config.blur) {
  pipeline = pipeline.blur(config.blur);
}

if (config.sharpen) {
  pipeline = pipeline.sharpen(config.sharpen);
}

if (config.brightness !== 1.0 || config.contrast !== 1.0 || config.saturation !== 1.0) {
  pipeline = pipeline.modulate({
    brightness: config.brightness,
    saturation: config.saturation
  });

  if (config.contrast !== 1.0) {
    const contrastValue = Math.round((config.contrast - 1) * 100);
    pipeline = pipeline.linear(config.contrast, -(128 * config.contrast) + 128);
  }
}

const buffer = await pipeline.toBuffer();

const outputPath = path.join('/tmp', \`filtered-\${Date.now()}.jpg\`);
fs.writeFileSync(outputPath, buffer);

return {
  buffer,
  url: outputPath
};
    `,
  },

  {
    id: 'img-watermark',
    name: 'Image Watermark',
    category: 'content' as any,
    icon: '©️',
    color: '#EC4899',
    description: 'Add text or image watermark to images',
    configFields: [
      {
        name: 'type',
        type: 'select',
        required: true,
        description: 'Watermark type',
        options: ['text', 'image'],
        default: 'text'
      },
      {
        name: 'text',
        type: 'string',
        required: false,
        description: 'Watermark text',
        placeholder: '© 2024 MyCompany'
      },
      {
        name: 'position',
        type: 'select',
        required: false,
        description: 'Position',
        options: ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'center'],
        default: 'bottom-right'
      },
      {
        name: 'opacity',
        type: 'number',
        required: false,
        description: 'Opacity (0-1)',
        default: 0.5
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
        id: 'watermarkImage',
        name: 'Watermark Image',
        type: ['string', 'buffer'],
        required: false,
        description: 'Watermark image (if type=image)'
      },
    ],
    outputPorts: [
      {
        id: 'buffer',
        name: 'Watermarked Buffer',
        type: 'buffer',
        description: 'Watermarked image buffer'
      },
      {
        id: 'url',
        name: 'Watermarked URL',
        type: 'string',
        description: 'URL to watermarked image'
      },
      {
        id: 'error',
        name: 'Error',
        type: 'string',
        description: 'Error message if failed'
      },
    ],
    npmPackage: 'sharp',
    codeTemplate: `
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

let imageInput = inputs.image;
if (typeof inputs.image === 'string' && inputs.image.startsWith('http')) {
  const axios = require('axios');
  const response = await axios.get(inputs.image, { responseType: 'arraybuffer' });
  imageInput = Buffer.from(response.data);
}

// Get image dimensions
const metadata = await sharp(imageInput).metadata();

let watermarkBuffer;
if (config.type === 'text') {
  // Create text watermark using SVG
  const svg = \`
    <svg width="\${metadata.width}" height="\${metadata.height}">
      <text x="50%" y="95%"
            font-family="Arial"
            font-size="24"
            fill="white"
            fill-opacity="\${config.opacity}"
            text-anchor="middle">
        \${config.text}
      </text>
    </svg>
  \`;
  watermarkBuffer = Buffer.from(svg);
} else {
  watermarkBuffer = inputs.watermarkImage;
}

// Composite watermark
const buffer = await sharp(imageInput)
  .composite([{
    input: watermarkBuffer,
    gravity: config.position,
    blend: 'over'
  }])
  .toBuffer();

const outputPath = path.join('/tmp', \`watermarked-\${Date.now()}.jpg\`);
fs.writeFileSync(outputPath, buffer);

return {
  buffer,
  url: outputPath
};
    `,
  },

  {
    id: 'img-metadata',
    name: 'Image Metadata Extractor',
    category: 'content' as any,
    icon: 'ℹ️',
    color: '#64748B',
    description: 'Extract metadata (EXIF, dimensions, format, etc.)',
    configFields: [],
    inputPorts: [
      {
        id: 'image',
        name: 'Image',
        type: ['string', 'buffer'],
        required: true,
        description: 'Input image'
      },
    ],
    outputPorts: [
      {
        id: 'metadata',
        name: 'Metadata',
        type: 'object',
        description: 'Complete image metadata'
      },
      {
        id: 'width',
        name: 'Width',
        type: 'number',
        description: 'Image width'
      },
      {
        id: 'height',
        name: 'Height',
        type: 'number',
        description: 'Image height'
      },
      {
        id: 'format',
        name: 'Format',
        type: 'string',
        description: 'Image format'
      },
      {
        id: 'size',
        name: 'Size',
        type: 'number',
        description: 'File size in bytes'
      },
      {
        id: 'exif',
        name: 'EXIF Data',
        type: 'object',
        description: 'EXIF metadata'
      },
      {
        id: 'error',
        name: 'Error',
        type: 'string',
        description: 'Error message if failed'
      },
    ],
    npmPackage: 'sharp',
    codeTemplate: `
const sharp = require('sharp');

let imageInput = inputs.image;
if (typeof inputs.image === 'string' && inputs.image.startsWith('http')) {
  const axios = require('axios');
  const response = await axios.get(inputs.image, { responseType: 'arraybuffer' });
  imageInput = Buffer.from(response.data);
}

const metadata = await sharp(imageInput).metadata();

return {
  metadata,
  width: metadata.width,
  height: metadata.height,
  format: metadata.format,
  size: metadata.size,
  exif: metadata.exif || {}
};
    `,
  },
]
