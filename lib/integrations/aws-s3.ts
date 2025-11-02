// ============================================
// AWS S3 INTEGRATION HELPERS
// Cloud file storage and management
// ============================================

import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ListObjectsV2Command, HeadObjectCommand, CopyObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

export type S3Config = {
  accessKeyId: string
  secretAccessKey: string
  region: string
  bucket: string
}

export type UploadConfig = {
  key: string
  body: Buffer | Uint8Array | Blob | string
  contentType?: string
  metadata?: Record<string, string>
  acl?: 'private' | 'public-read' | 'public-read-write' | 'authenticated-read'
}

export type DownloadConfig = {
  key: string
}

export type ListConfig = {
  prefix?: string
  maxKeys?: number
  continuationToken?: string
}

export type SignedUrlConfig = {
  key: string
  expiresIn?: number // seconds
  operation?: 'getObject' | 'putObject'
}

// ============================================
// S3 CLIENT
// ============================================

let s3Client: S3Client | null = null
let s3Config: S3Config | null = null

export function getS3Client(config?: S3Config) {
  if (!s3Client) {
    const accessKeyId = config?.accessKeyId || process.env.AWS_ACCESS_KEY_ID
    const secretAccessKey = config?.secretAccessKey || process.env.AWS_SECRET_ACCESS_KEY
    const region = config?.region || process.env.AWS_REGION || 'us-east-1'
    const bucket = config?.bucket || process.env.AWS_S3_BUCKET

    if (!accessKeyId || !secretAccessKey || !bucket) {
      throw new Error('AWS S3 credentials and bucket are required')
    }

    s3Config = { accessKeyId, secretAccessKey, region, bucket }
    s3Client = new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    })
  }

  return { client: s3Client, config: s3Config! }
}

// ============================================
// UPLOAD FILES
// ============================================

export async function uploadFile(config: UploadConfig) {
  const { client, config: s3Conf } = getS3Client()

  const command = new PutObjectCommand({
    Bucket: s3Conf.bucket,
    Key: config.key,
    Body: config.body,
    ContentType: config.contentType,
    Metadata: config.metadata,
    ACL: config.acl,
  })

  const response = await client.send(command)

  return {
    key: config.key,
    etag: response.ETag,
    url: `https://${s3Conf.bucket}.s3.${s3Conf.region}.amazonaws.com/${config.key}`,
  }
}

export async function uploadMultipleFiles(files: UploadConfig[]) {
  const results = await Promise.allSettled(files.map((file) => uploadFile(file)))
  return results
}

// ============================================
// DOWNLOAD FILES
// ============================================

export async function downloadFile(config: DownloadConfig) {
  const { client, config: s3Conf } = getS3Client()

  const command = new GetObjectCommand({
    Bucket: s3Conf.bucket,
    Key: config.key,
  })

  const response = await client.send(command)

  // Convert stream to buffer
  const chunks: Uint8Array[] = []
  const stream = response.Body as any

  for await (const chunk of stream) {
    chunks.push(chunk)
  }

  return {
    body: Buffer.concat(chunks),
    contentType: response.ContentType,
    metadata: response.Metadata,
  }
}

export async function getFileUrl(key: string) {
  const { config: s3Conf } = getS3Client()
  return `https://${s3Conf.bucket}.s3.${s3Conf.region}.amazonaws.com/${key}`
}

// ============================================
// SIGNED URLS (temporary access)
// ============================================

export async function getSignedDownloadUrl(config: SignedUrlConfig) {
  const { client, config: s3Conf } = getS3Client()

  const command = new GetObjectCommand({
    Bucket: s3Conf.bucket,
    Key: config.key,
  })

  const url = await getSignedUrl(client, command, {
    expiresIn: config.expiresIn || 3600, // 1 hour default
  })

  return url
}

export async function getSignedUploadUrl(config: SignedUrlConfig) {
  const { client, config: s3Conf } = getS3Client()

  const command = new PutObjectCommand({
    Bucket: s3Conf.bucket,
    Key: config.key,
  })

  const url = await getSignedUrl(client, command, {
    expiresIn: config.expiresIn || 3600, // 1 hour default
  })

  return url
}

// ============================================
// DELETE FILES
// ============================================

export async function deleteFile(key: string) {
  const { client, config: s3Conf } = getS3Client()

  const command = new DeleteObjectCommand({
    Bucket: s3Conf.bucket,
    Key: key,
  })

  await client.send(command)

  return { success: true, key }
}

export async function deleteMultipleFiles(keys: string[]) {
  const results = await Promise.allSettled(keys.map((key) => deleteFile(key)))
  return results
}

// ============================================
// LIST FILES
// ============================================

export async function listFiles(config?: ListConfig) {
  const { client, config: s3Conf } = getS3Client()

  const command = new ListObjectsV2Command({
    Bucket: s3Conf.bucket,
    Prefix: config?.prefix,
    MaxKeys: config?.maxKeys,
    ContinuationToken: config?.continuationToken,
  })

  const response = await client.send(command)

  return {
    files: response.Contents?.map((item) => ({
      key: item.Key!,
      size: item.Size!,
      lastModified: item.LastModified!,
      etag: item.ETag!,
    })) || [],
    isTruncated: response.IsTruncated,
    nextContinuationToken: response.NextContinuationToken,
  }
}

// ============================================
// FILE METADATA
// ============================================

export async function getFileMetadata(key: string) {
  const { client, config: s3Conf } = getS3Client()

  const command = new HeadObjectCommand({
    Bucket: s3Conf.bucket,
    Key: key,
  })

  const response = await client.send(command)

  return {
    contentType: response.ContentType,
    contentLength: response.ContentLength,
    lastModified: response.LastModified,
    metadata: response.Metadata,
    etag: response.ETag,
  }
}

export async function fileExists(key: string) {
  try {
    await getFileMetadata(key)
    return true
  } catch (error) {
    return false
  }
}

// ============================================
// COPY FILES
// ============================================

export async function copyFile(sourceKey: string, destinationKey: string) {
  const { client, config: s3Conf } = getS3Client()

  const command = new CopyObjectCommand({
    Bucket: s3Conf.bucket,
    CopySource: `${s3Conf.bucket}/${sourceKey}`,
    Key: destinationKey,
  })

  await client.send(command)

  return {
    sourceKey,
    destinationKey,
    url: `https://${s3Conf.bucket}.s3.${s3Conf.region}.amazonaws.com/${destinationKey}`,
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

export async function uploadImageFile(
  key: string,
  file: Buffer,
  contentType: string = 'image/jpeg'
) {
  return uploadFile({
    key,
    body: file,
    contentType,
    acl: 'public-read',
  })
}

export async function uploadJSONFile(key: string, data: any) {
  return uploadFile({
    key,
    body: JSON.stringify(data),
    contentType: 'application/json',
  })
}

export async function downloadJSONFile(key: string) {
  const result = await downloadFile({ key })
  return JSON.parse(result.body.toString('utf-8'))
}

export function getPublicUrl(key: string) {
  const { config: s3Conf } = getS3Client()
  return `https://${s3Conf.bucket}.s3.${s3Conf.region}.amazonaws.com/${key}`
}

// ============================================
// FOLDER OPERATIONS
// ============================================

export async function listFilesInFolder(folderPath: string) {
  // Ensure folder path ends with /
  const prefix = folderPath.endsWith('/') ? folderPath : `${folderPath}/`
  return listFiles({ prefix })
}

export async function deleteFolder(folderPath: string) {
  const prefix = folderPath.endsWith('/') ? folderPath : `${folderPath}/`
  const { files } = await listFiles({ prefix })

  if (files.length === 0) {
    return { success: true, deletedCount: 0 }
  }

  const keys = files.map((file) => file.key)
  await deleteMultipleFiles(keys)

  return { success: true, deletedCount: keys.length }
}

// ============================================
// EXAMPLE USAGE
// ============================================

/*
// Example 1: Upload a File
import { uploadFile } from '@/lib/integrations/aws-s3'
import fs from 'fs'

const fileBuffer = fs.readFileSync('/path/to/image.jpg')

const result = await uploadFile({
  key: 'images/profile.jpg',
  body: fileBuffer,
  contentType: 'image/jpeg',
  acl: 'public-read',
})

console.log('File URL:', result.url)

// Example 2: Upload with Metadata
await uploadFile({
  key: 'documents/report.pdf',
  body: pdfBuffer,
  contentType: 'application/pdf',
  metadata: {
    userId: '123',
    uploadDate: new Date().toISOString(),
  },
})

// Example 3: Download a File
import { downloadFile } from '@/lib/integrations/aws-s3'

const file = await downloadFile({ key: 'images/profile.jpg' })
console.log('Content Type:', file.contentType)
console.log('File Size:', file.body.length)

// Example 4: Generate Signed URL for Download
import { getSignedDownloadUrl } from '@/lib/integrations/aws-s3'

const signedUrl = await getSignedDownloadUrl({
  key: 'documents/private-report.pdf',
  expiresIn: 3600, // 1 hour
})

console.log('Download URL:', signedUrl)

// Example 5: Generate Signed URL for Upload (client-side upload)
import { getSignedUploadUrl } from '@/lib/integrations/aws-s3'

const uploadUrl = await getSignedUploadUrl({
  key: 'uploads/user-file.jpg',
  expiresIn: 300, // 5 minutes
})

// Client can now upload directly to S3 using this URL
console.log('Upload URL:', uploadUrl)

// Example 6: List Files in a Folder
import { listFilesInFolder } from '@/lib/integrations/aws-s3'

const { files } = await listFilesInFolder('images/avatars')
files.forEach((file) => {
  console.log(`${file.key} - ${file.size} bytes`)
})

// Example 7: Delete a File
import { deleteFile } from '@/lib/integrations/aws-s3'

await deleteFile('images/old-avatar.jpg')

// Example 8: Check if File Exists
import { fileExists } from '@/lib/integrations/aws-s3'

const exists = await fileExists('documents/report.pdf')
if (exists) {
  console.log('File exists!')
}

// Example 9: Copy a File
import { copyFile } from '@/lib/integrations/aws-s3'

await copyFile('images/original.jpg', 'images/backup/original.jpg')

// Example 10: Upload JSON Data
import { uploadJSONFile, downloadJSONFile } from '@/lib/integrations/aws-s3'

await uploadJSONFile('data/config.json', {
  theme: 'dark',
  language: 'en',
  notifications: true,
})

const config = await downloadJSONFile('data/config.json')
console.log('Config:', config)

// Example 11: API Route for File Upload
import { uploadFile } from '@/lib/integrations/aws-s3'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get('file') as File

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())

  try {
    const result = await uploadFile({
      key: `uploads/${Date.now()}-${file.name}`,
      body: buffer,
      contentType: file.type,
      acl: 'public-read',
    })

    return NextResponse.json({ url: result.url })
  } catch (error) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}

// Example 12: API Route for Signed Upload URL (client-side upload)
import { getSignedUploadUrl } from '@/lib/integrations/aws-s3'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const filename = searchParams.get('filename')

  if (!filename) {
    return NextResponse.json({ error: 'Filename required' }, { status: 400 })
  }

  try {
    const key = `uploads/${Date.now()}-${filename}`
    const uploadUrl = await getSignedUploadUrl({
      key,
      expiresIn: 300, // 5 minutes
    })

    return NextResponse.json({ uploadUrl, key })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate upload URL' }, { status: 500 })
  }
}
*/
