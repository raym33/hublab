#!/usr/bin/env tsx

/**
 * Extract Capsule Metadata
 *
 * Separates capsule metadata from code to reduce bundle size.
 * Creates lightweight metadata.json for search/filtering.
 * Full code is loaded on-demand when capsule is used.
 */

import { allCapsules } from '../lib/all-capsules'
import fs from 'fs'
import path from 'path'

console.log('📦 Extracting capsule metadata...\n')

// Create metadata-only version (no code)
const metadata = allCapsules.map(capsule => ({
  id: capsule.id,
  name: capsule.name,
  category: capsule.category,
  description: capsule.description,
  tags: capsule.tags,
  platform: capsule.platform || 'react',
  // Omit 'code' field to reduce size
}))

// Calculate sizes
const fullSize = JSON.stringify(allCapsules).length
const metadataSize = JSON.stringify(metadata).length
const reduction = ((1 - metadataSize / fullSize) * 100).toFixed(1)

console.log('📊 Statistics:')
console.log(`   Total capsules: ${allCapsules.length}`)
console.log(`   Full size: ${(fullSize / 1024 / 1024).toFixed(2)} MB`)
console.log(`   Metadata size: ${(metadataSize / 1024 / 1024).toFixed(2)} MB`)
console.log(`   Reduction: ${reduction}% smaller\n`)

// Write metadata file
const outputPath = path.join(__dirname, '../lib/capsules-metadata.json')
fs.writeFileSync(outputPath, JSON.stringify(metadata, null, 2))

console.log(`✅ Metadata written to: ${outputPath}`)
console.log(`📦 Size: ${(fs.statSync(outputPath).size / 1024 / 1024).toFixed(2)} MB\n`)

// Create category index for faster lookups
const byCategory: Record<string, typeof metadata> = {}
metadata.forEach(capsule => {
  if (!byCategory[capsule.category]) {
    byCategory[capsule.category] = []
  }
  byCategory[capsule.category].push(capsule)
})

const categoryIndexPath = path.join(__dirname, '../lib/capsules-by-category.json')
fs.writeFileSync(categoryIndexPath, JSON.stringify(byCategory, null, 2))

console.log(`✅ Category index written to: ${categoryIndexPath}`)
console.log(`📂 Categories: ${Object.keys(byCategory).length}`)
console.log(`📦 Size: ${(fs.statSync(categoryIndexPath).size / 1024 / 1024).toFixed(2)} MB\n`)

// Create ID → batch mapping for code loading
const idToBatch: Record<string, string> = {}
allCapsules.forEach(capsule => {
  // Determine which batch file contains this capsule
  // Based on naming patterns from lib/extended-capsules-batch*.ts
  const batchNumber = determineBatchNumber(capsule)
  idToBatch[capsule.id] = `batch${batchNumber}`
})

const batchMapPath = path.join(__dirname, '../lib/capsule-batch-map.json')
fs.writeFileSync(batchMapPath, JSON.stringify(idToBatch, null, 2))

console.log(`✅ Batch map written to: ${batchMapPath}`)
console.log(`📦 Size: ${(fs.statSync(batchMapPath).size / 1024).toFixed(2)} KB\n`)

console.log('🎉 Metadata extraction complete!')
console.log('\n💡 Next steps:')
console.log('   1. Import metadata.json instead of allCapsules for search')
console.log('   2. Lazy load full capsule code only when needed')
console.log('   3. Expected bundle reduction: ~80-90%')

function determineBatchNumber(capsule: any): number {
  // Simple heuristic based on category
  const categoryToBatch: Record<string, number> = {
    'AI': 1,
    'IoT': 2,
    'CMS': 3,
    'Analytics': 4,
    'Dashboard': 5,
    'Blockchain': 6,
    'AR/VR': 7,
    'Healthcare': 8,
    'Finance': 9,
    'Education': 10,
    'Social': 11,
    'E-commerce': 12,
    'Agriculture': 13,
    'Real Estate': 14,
    'Events': 15,
    'Hospitality': 16,
    'Transportation': 17,
    'Manufacturing': 18,
    // Default batches
    'UI': 18,
    'Forms': 19,
    'Charts': 20,
    'Tables': 21,
    'Layout': 22,
    'Navigation': 23,
    'Modal': 24,
    'Notification': 25,
    'Media': 26,
  }

  return categoryToBatch[capsule.category] || 26 // Default to last batch
}
