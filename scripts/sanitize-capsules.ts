#!/usr/bin/env tsx

/**
 * Sanitize All Capsules
 *
 * Applies HTML sanitization to all capsule definitions
 * that use dangerouslySetInnerHTML.
 *
 * Security fix for XSS vulnerabilities.
 */

import fs from 'fs'
import path from 'path'
import { glob } from 'glob'

console.log('🔒 Sanitizing capsule definitions...\n')

// Find all capsule batch files
const batchFiles = glob.sync('lib/extended-capsules-batch*.ts', {
  cwd: path.join(__dirname, '..'),
  absolute: true,
})

console.log(`📁 Found ${batchFiles.length} batch files\n`)

let totalFixed = 0
let totalFiles = 0

for (const file of batchFiles) {
  console.log(`Processing: ${path.basename(file)}`)

  let content = fs.readFileSync(file, 'utf-8')
  let fixedCount = 0

  // Pattern 1: dangerouslySetInnerHTML without sanitization
  const dangerousPattern1 = /dangerouslySetInnerHTML=\{\{\s*__html:\s*(['"`])([^'"`]+)\1\s*\}\}/g
  const dangerousPattern2 = /dangerouslySetInnerHTML=\{\{\s*__html:\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\}\}/g

  // Check if file needs sanitizeHTML import
  const needsSanitize =
    dangerousPattern1.test(content) || dangerousPattern2.test(content)

  if (needsSanitize) {
    // Reset regex lastIndex
    dangerousPattern1.lastIndex = 0
    dangerousPattern2.lastIndex = 0

    // Add import if not present
    if (!content.includes("import { sanitizeHTML } from '@/lib/utils/sanitize'")) {
      // Find the first import or start of code
      const firstImportMatch = content.match(/^import .+$/m)
      if (firstImportMatch) {
        const insertPosition = content.indexOf(firstImportMatch[0])
        content =
          content.slice(0, insertPosition) +
          "import { sanitizeHTML } from '@/lib/utils/sanitize'\n" +
          content.slice(insertPosition)
      } else {
        // No imports found, add at the beginning
        content = "import { sanitizeHTML } from '@/lib/utils/sanitize'\n\n" + content
      }
    }

    // Fix Pattern 1: Static strings
    content = content.replace(
      dangerousPattern1,
      (match, quote, htmlContent) => {
        fixedCount++
        return `dangerouslySetInnerHTML={{ __html: sanitizeHTML(${quote}${htmlContent}${quote}) }}`
      }
    )

    // Fix Pattern 2: Variables
    content = content.replace(dangerousPattern2, (match, variable) => {
      fixedCount++
      return `dangerouslySetInnerHTML={{ __html: sanitizeHTML(${variable}) }}`
    })

    if (fixedCount > 0) {
      fs.writeFileSync(file, content, 'utf-8')
      console.log(`   ✅ Fixed ${fixedCount} instances`)
      totalFixed += fixedCount
      totalFiles++
    }
  } else {
    console.log(`   ⏭️  No issues found`)
  }
}

console.log('\n' + '='.repeat(50))
console.log(`\n✅ Sanitization complete!`)
console.log(`   Files modified: ${totalFiles}`)
console.log(`   Instances fixed: ${totalFixed}`)
console.log(`\n🔒 All dangerouslySetInnerHTML calls now use sanitizeHTML()`)
console.log(`\n💡 Next: Review changes and test capsule rendering`)
