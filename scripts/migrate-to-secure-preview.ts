#!/usr/bin/env tsx

/**
 * Migrate to SecureLivePreview
 *
 * Automatically replaces all instances of LivePreview
 * with the secure SecureLivePreview component.
 */

import fs from 'fs'
import path from 'path'
import { glob } from 'glob'

console.log('🔒 Migrating to SecureLivePreview...\n')

// Find all TypeScript/TSX files
const files = glob.sync('**/*.{ts,tsx}', {
  cwd: path.join(__dirname, '..'),
  absolute: true,
  ignore: [
    '**/node_modules/**',
    '**/.next/**',
    '**/dist/**',
    '**/components/LivePreview.tsx', // Skip the original file
    '**/components/SecureLivePreview.tsx', // Skip the new file
  ],
})

let totalFiles = 0
let totalReplacements = 0

for (const file of files) {
  let content = fs.readFileSync(file, 'utf-8')
  let fileModified = false
  let replacements = 0

  // Pattern 1: Import statement
  const importPattern = /import\s+LivePreview\s+from\s+['"]@\/components\/LivePreview['"]/g
  if (importPattern.test(content)) {
    content = content.replace(
      importPattern,
      "import SecureLivePreview from '@/components/SecureLivePreview'"
    )
    fileModified = true
    replacements++
  }

  // Pattern 2: Component usage <SecureLivePreview
  const usagePattern = /<SecureLivePreview/g
  const usageCount = (content.match(usagePattern) || []).length
  if (usageCount > 0) {
    content = content.replace(usagePattern, '<SecureLivePreview')
    fileModified = true
    replacements += usageCount
  }

  // Pattern 3: Closing tag </SecureLivePreview>
  const closingPattern = /<\/LivePreview>/g
  const closingCount = (content.match(closingPattern) || []).length
  if (closingCount > 0) {
    content = content.replace(closingPattern, '</SecureLivePreview>')
    fileModified = true
    replacements += closingCount
  }

  if (fileModified) {
    fs.writeFileSync(file, content, 'utf-8')
    console.log(`✅ ${path.basename(file)}: ${replacements} replacements`)
    totalFiles++
    totalReplacements += replacements
  }
}

console.log('\n' + '='.repeat(50))
console.log(`\n🎉 Migration complete!`)
console.log(`   Files updated: ${totalFiles}`)
console.log(`   Total replacements: ${totalReplacements}`)

if (totalFiles === 0) {
  console.log(`\n✨ No files needed migration (already using SecureLivePreview or no usage found)`)
} else {
  console.log(`\n🔒 All LivePreview components replaced with SecureLivePreview`)
  console.log(`\n💡 Next steps:`)
  console.log(`   1. Test the application`)
  console.log(`   2. Verify preview functionality works`)
  console.log(`   3. Check for any breaking changes`)
  console.log(`   4. Consider deprecating LivePreview.tsx`)
}
