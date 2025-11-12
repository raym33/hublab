// ============================================
// CLOUDINARY INTEGRATION HELPERS
// Media management, optimization, and transformation
// ============================================

import { v2 as cloudinary } from 'cloudinary'

export type CloudinaryConfig = {
  cloudName: string
  apiKey: string
  apiSecret: string
}

export type UploadOptions = {
  folder?: string
  publicId?: string
  tags?: string[]
  transformation?: any
  overwrite?: boolean
  resourceType?: 'image' | 'video' | 'raw' | 'auto'
}

export type TransformOptions = {
  width?: number
  height?: number
  crop?: 'scale' | 'fit' | 'fill' | 'thumb' | 'crop'
  quality?: number | 'auto'
  format?: 'jpg' | 'png' | 'webp' | 'avif' | 'auto'
  gravity?: 'auto' | 'face' | 'center' | 'north' | 'south' | 'east' | 'west'
  effect?: string
  overlay?: string
  radius?: number | 'max'
  angle?: number
  background?: string
}

// ============================================
// CLOUDINARY CLIENT
// ============================================

let isConfigured = false

export function configureCloudinary(config?: CloudinaryConfig) {
  if (!isConfigured) {
    const cloudName = config?.cloudName || process.env.CLOUDINARY_CLOUD_NAME
    const apiKey = config?.apiKey || process.env.CLOUDINARY_API_KEY
    const apiSecret = config?.apiSecret || process.env.CLOUDINARY_API_SECRET

    if (!cloudName || !apiKey || !apiSecret) {
      throw new Error('Cloudinary credentials are required')
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    })

    isConfigured = true
  }

  return cloudinary
}

// ============================================
// UPLOAD FILES
// ============================================

export async function uploadImage(
  file: string | Buffer,
  options?: UploadOptions
) {
  configureCloudinary()

  const result = await cloudinary.uploader.upload(file, {
    folder: options?.folder,
    public_id: options?.publicId,
    tags: options?.tags,
    transformation: options?.transformation,
    overwrite: options?.overwrite,
    resource_type: options?.resourceType || 'image',
  })

  return {
    publicId: result.public_id,
    url: result.secure_url,
    width: result.width,
    height: result.height,
    format: result.format,
    bytes: result.bytes,
  }
}

export async function uploadVideo(
  file: string | Buffer,
  options?: UploadOptions
) {
  configureCloudinary()

  const result = await cloudinary.uploader.upload(file, {
    folder: options?.folder,
    public_id: options?.publicId,
    tags: options?.tags,
    overwrite: options?.overwrite,
    resource_type: 'video',
  })

  return {
    publicId: result.public_id,
    url: result.secure_url,
    width: result.width,
    height: result.height,
    format: result.format,
    duration: result.duration,
    bytes: result.bytes,
  }
}

export async function uploadRaw(
  file: string | Buffer,
  options?: UploadOptions
) {
  configureCloudinary()

  const result = await cloudinary.uploader.upload(file, {
    folder: options?.folder,
    public_id: options?.publicId,
    tags: options?.tags,
    overwrite: options?.overwrite,
    resource_type: 'raw',
  })

  return {
    publicId: result.public_id,
    url: result.secure_url,
    format: result.format,
    bytes: result.bytes,
  }
}

// ============================================
// DELETE FILES
// ============================================

export async function deleteImage(publicId: string) {
  configureCloudinary()
  const result = await cloudinary.uploader.destroy(publicId)
  return { success: result.result === 'ok', publicId }
}

export async function deleteVideo(publicId: string) {
  configureCloudinary()
  const result = await cloudinary.uploader.destroy(publicId, { resource_type: 'video' })
  return { success: result.result === 'ok', publicId }
}

export async function deleteMultiple(publicIds: string[], resourceType: 'image' | 'video' = 'image') {
  configureCloudinary()
  const result = await cloudinary.api.delete_resources(publicIds, { resource_type: resourceType })
  return result
}

// ============================================
// IMAGE TRANSFORMATIONS
// ============================================

export function getTransformedImageUrl(
  publicId: string,
  transforms: TransformOptions
): string {
  configureCloudinary()

  const url = cloudinary.url(publicId, {
    width: transforms.width,
    height: transforms.height,
    crop: transforms.crop,
    quality: transforms.quality,
    fetch_format: transforms.format,
    gravity: transforms.gravity,
    effect: transforms.effect,
    radius: transforms.radius,
    angle: transforms.angle,
    background: transforms.background,
    secure: true,
  })

  return url
}

// ============================================
// COMMON TRANSFORMATIONS
// ============================================

export function getResponsiveImageUrl(publicId: string, width: number) {
  return getTransformedImageUrl(publicId, {
    width,
    quality: 'auto',
    format: 'auto',
  })
}

export function getThumbnailUrl(publicId: string, size: number = 200) {
  return getTransformedImageUrl(publicId, {
    width: size,
    height: size,
    crop: 'thumb',
    gravity: 'auto',
    quality: 'auto',
    format: 'auto',
  })
}

export function getAvatarUrl(publicId: string, size: number = 100) {
  return getTransformedImageUrl(publicId, {
    width: size,
    height: size,
    crop: 'fill',
    gravity: 'face',
    radius: 'max',
    quality: 'auto',
    format: 'auto',
  })
}

export function getOptimizedImageUrl(publicId: string, maxWidth: number = 1920) {
  return getTransformedImageUrl(publicId, {
    width: maxWidth,
    quality: 'auto',
    format: 'auto',
    crop: 'scale',
  })
}

export function getBlurredImageUrl(publicId: string) {
  return getTransformedImageUrl(publicId, {
    width: 400,
    quality: 'auto',
    format: 'auto',
    effect: 'blur:1000',
  })
}

// ============================================
// VIDEO TRANSFORMATIONS
// ============================================

export function getVideoThumbnail(publicId: string, width: number = 400) {
  configureCloudinary()

  const url = cloudinary.url(publicId, {
    resource_type: 'video',
    transformation: [
      { width, crop: 'scale' },
      { quality: 'auto' },
      { fetch_format: 'jpg' },
    ],
    secure: true,
  })

  return url
}

export function getOptimizedVideoUrl(publicId: string, width: number = 1280) {
  configureCloudinary()

  const url = cloudinary.url(publicId, {
    resource_type: 'video',
    transformation: [
      { width, crop: 'scale' },
      { quality: 'auto' },
      { fetch_format: 'auto' },
    ],
    secure: true,
  })

  return url
}

// ============================================
// SEARCH & LIST
// ============================================

export async function listImages(options?: { folder?: string; maxResults?: number }) {
  configureCloudinary()

  const result = await cloudinary.api.resources({
    type: 'upload',
    resource_type: 'image',
    prefix: options?.folder,
    max_results: options?.maxResults || 100,
  })

  return result.resources.map((resource: any) => ({
    publicId: resource.public_id,
    url: resource.secure_url,
    width: resource.width,
    height: resource.height,
    format: resource.format,
    createdAt: resource.created_at,
  }))
}

export async function searchImages(expression: string) {
  configureCloudinary()

  const result = await cloudinary.search
    .expression(expression)
    .sort_by('created_at', 'desc')
    .max_results(30)
    .execute()

  return result.resources
}

// ============================================
// HELPER FUNCTIONS
// ============================================

export async function uploadBase64Image(
  base64String: string,
  options?: UploadOptions
) {
  const dataUrl = base64String.startsWith('data:')
    ? base64String
    : `data:image/png;base64,${base64String}`

  return uploadImage(dataUrl, options)
}

export async function uploadFromUrl(
  url: string,
  options?: UploadOptions
) {
  return uploadImage(url, options)
}

export function extractPublicId(cloudinaryUrl: string): string {
  const match = cloudinaryUrl.match(/\/v\d+\/(.+)\.[a-z]+$/i)
  return match ? match[1] : ''
}

// ============================================
// EXAMPLE USAGE
// ============================================

/*
// Example 1: Upload Image from File
import { uploadImage } from '@/lib/integrations/cloudinary'
import fs from 'fs'

const buffer = fs.readFileSync('/path/to/image.jpg')

const result = await uploadImage(buffer, {
  folder: 'avatars',
  tags: ['user', 'profile'],
})

console.log('Image URL:', result.url)

// Example 2: Upload Image from URL
import { uploadFromUrl } from '@/lib/integrations/cloudinary'

const result = await uploadFromUrl('https://example.com/image.jpg', {
  folder: 'products',
  publicId: 'product-123',
})

// Example 3: Upload Base64 Image
import { uploadBase64Image } from '@/lib/integrations/cloudinary'

const base64 = 'iVBORw0KGgoAAAANSUhEUgA...'
const result = await uploadBase64Image(base64, {
  folder: 'uploads',
})

// Example 4: Get Responsive Image
import { getResponsiveImageUrl } from '@/lib/integrations/cloudinary'

const url = getResponsiveImageUrl('avatars/user-123', 800)
console.log(url)

// Example 5: Get Avatar (circular, cropped to face)
import { getAvatarUrl } from '@/lib/integrations/cloudinary'

const avatarUrl = getAvatarUrl('avatars/user-123', 200)

// Example 6: Get Thumbnail
import { getThumbnailUrl } from '@/lib/integrations/cloudinary'

const thumbUrl = getThumbnailUrl('products/product-123', 300)

// Example 7: Custom Transformations
import { getTransformedImageUrl } from '@/lib/integrations/cloudinary'

const url = getTransformedImageUrl('banner', {
  width: 1200,
  height: 600,
  crop: 'fill',
  quality: 80,
  format: 'webp',
  gravity: 'center',
})

// Example 8: Upload Video
import { uploadVideo } from '@/lib/integrations/cloudinary'

const videoResult = await uploadVideo(videoBuffer, {
  folder: 'videos',
  publicId: 'demo-video',
})

console.log('Video URL:', videoResult.url)

// Example 9: Get Video Thumbnail
import { getVideoThumbnail } from '@/lib/integrations/cloudinary'

const thumbUrl = getVideoThumbnail('videos/demo-video', 640)

// Example 10: Delete Image
import { deleteImage } from '@/lib/integrations/cloudinary'

await deleteImage('avatars/user-123')

// Example 11: List Images in Folder
import { listImages } from '@/lib/integrations/cloudinary'

const images = await listImages({ folder: 'products', maxResults: 50 })
images.forEach((img) => {
  console.log(img.publicId, img.url)
})

// Example 12: Search Images
import { searchImages } from '@/lib/integrations/cloudinary'

const results = await searchImages('folder:products AND tags:featured')
console.log('Found:', results.length)

// Example 13: API Route for Image Upload
import { uploadImage } from '@/lib/integrations/cloudinary'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get('file') as File

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())

  try {
    const result = await uploadImage(buffer, {
      folder: 'uploads',
      tags: ['user-upload'],
    })

    return NextResponse.json({
      url: result.url,
      publicId: result.publicId,
      width: result.width,
      height: result.height,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}

// Example 14: Next.js Image Component with Cloudinary
import Image from 'next/image'
import { getResponsiveImageUrl } from '@/lib/integrations/cloudinary'

function ProductImage({ publicId }: { publicId: string }) {
  return (
    <Image
      src={getResponsiveImageUrl(publicId, 800)}
      alt="Product"
      width={800}
      height={600}
      className="rounded-lg"
    />
  )
}

// Example 15: Image Gallery with Different Sizes
import { getThumbnailUrl, getOptimizedImageUrl } from '@/lib/integrations/cloudinary'

function ImageGallery({ images }: { images: string[] }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {images.map((publicId) => (
        <a
          key={publicId}
          href={getOptimizedImageUrl(publicId)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={getThumbnailUrl(publicId, 300)}
            alt="Gallery image"
            className="w-full h-full object-cover rounded-lg"
          />
        </a>
      ))}
    </div>
  )
}

// Example 16: Upload with Progress (using fetch)
async function uploadWithProgress(file: File, onProgress: (percent: number) => void) {
  const formData = new FormData()
  formData.append('file', file)

  const xhr = new XMLHttpRequest()

  xhr.upload.addEventListener('progress', (e) => {
    if (e.lengthComputable) {
      const percent = (e.loaded / e.total) * 100
      onProgress(percent)
    }
  })

  return new Promise((resolve, reject) => {
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        resolve(JSON.parse(xhr.responseText))
      } else {
        reject(new Error('Upload failed'))
      }
    })

    xhr.addEventListener('error', () => reject(new Error('Upload error')))

    xhr.open('POST', '/api/upload')
    xhr.send(formData)
  })
}
*/
