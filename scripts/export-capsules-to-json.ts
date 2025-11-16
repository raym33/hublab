#!/usr/bin/env tsx

/**
 * Export All Capsules to JSON
 *
 * This script exports all 8,150+ capsules from TypeScript to a JSON file
 * that can be consumed by the Rust engine.
 *
 * Usage:
 *   npm run export:capsules
 *   or
 *   tsx scripts/export-capsules-to-json.ts
 */

import fs from 'fs'
import path from 'path'

// Import all capsules from the centralized registry
import { allCapsules } from '../lib/all-capsules'

interface ExportMetadata {
  total_capsules: number
  categories: string[]
  category_counts: Record<string, number>
  platforms: string[]
  platform_counts: Record<string, number>
  export_date: string
  version: string
}

interface ExportedCapsule {
  id: string
  name: string
  category: string
  description: string
  tags: string[]
  platform?: string
  code_snippet?: string
  metadata?: {
    version?: string
    author?: string
    [key: string]: any
  }
}

interface ExportData {
  metadata: ExportMetadata
  capsules: ExportedCapsule[]
}

function generateMetadata(): ExportMetadata {
  const categories = new Set<string>()
  const categoryCounts: Record<string, number> = {}
  const platforms = new Set<string>()
  const platformCounts: Record<string, number> = {}

  allCapsules.forEach((capsule) => {
    // Categories
    categories.add(capsule.category)
    categoryCounts[capsule.category] = (categoryCounts[capsule.category] || 0) + 1

    // Platforms
    const platform = capsule.platform || 'react'
    platforms.add(platform)
    platformCounts[platform] = (platformCounts[platform] || 0) + 1
  })

  return {
    total_capsules: allCapsules.length,
    categories: Array.from(categories).sort(),
    category_counts: categoryCounts,
    platforms: Array.from(platforms).sort(),
    platform_counts: platformCounts,
    export_date: new Date().toISOString(),
    version: '1.0.0',
  }
}

function exportCapsulesToJSON(): void {
  console.log('🚀 Starting capsule export...')
  console.log(`📦 Total capsules to export: ${allCapsules.length}`)

  // Transform capsules to export format
  const exportedCapsules: ExportedCapsule[] = allCapsules.map((capsule) => ({
    id: capsule.id,
    name: capsule.name,
    category: capsule.category,
    description: capsule.description || '',
    tags: capsule.tags || [],
    platform: capsule.platform || 'react',
    code_snippet: capsule.code || undefined,
    metadata: {
      version: capsule.version,
      author: capsule.author,
    },
  }))

  // Generate metadata
  const metadata = generateMetadata()

  // Create export data
  const exportData: ExportData = {
    metadata,
    capsules: exportedCapsules,
  }

  // Ensure data directory exists
  const dataDir = path.join(process.cwd(), 'data')
  if (!fs.existsSync(dataDir)) {
    console.log('📁 Creating data directory...')
    fs.mkdirSync(dataDir, { recursive: true })
  }

  // Write to file
  const outputPath = path.join(dataDir, 'all-capsules.json')
  console.log(`💾 Writing to ${outputPath}...`)

  fs.writeFileSync(outputPath, JSON.stringify(exportData, null, 2), 'utf-8')

  // Calculate file size
  const stats = fs.statSync(outputPath)
  const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2)

  console.log('✅ Export completed successfully!')
  console.log('')
  console.log('📊 Export Summary:')
  console.log(`   Total capsules: ${metadata.total_capsules}`)
  console.log(`   Categories: ${metadata.categories.length}`)
  console.log(`   Platforms: ${metadata.platforms.length}`)
  console.log(`   File size: ${fileSizeMB} MB`)
  console.log(`   Output: ${outputPath}`)
  console.log('')
  console.log('📈 Top 10 Categories:')

  const topCategories = Object.entries(metadata.category_counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)

  topCategories.forEach(([category, count], index) => {
    console.log(`   ${index + 1}. ${category}: ${count} capsules`)
  })

  console.log('')
  console.log('🎯 Platform Distribution:')
  Object.entries(metadata.platform_counts).forEach(([platform, count]) => {
    console.log(`   ${platform}: ${count} capsules`)
  })
}

// Run the export
try {
  exportCapsulesToJSON()
} catch (error) {
  console.error('❌ Export failed:', error)
  process.exit(1)
}
