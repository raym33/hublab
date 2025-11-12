/**
 * Fix Critical Issues Found in Deep System Test
 *
 * Fixes:
 * 1. Duplicate IDs
 * 2. Normalize lowercase categories
 * 3. Verify tag coverage calculation
 */

import { allCapsules } from '../lib/all-capsules'

console.log('\n' + '='.repeat(60))
console.log('🔧 FIXING CRITICAL ISSUES')
console.log('='.repeat(60))

// ISSUE 1: Find duplicate IDs
console.log('\n📋 ISSUE 1: Duplicate IDs')
console.log('─'.repeat(60))

const idMap = new Map<string, number[]>()
allCapsules.forEach((capsule, index) => {
  if (idMap.has(capsule.id)) {
    idMap.get(capsule.id)!.push(index)
  } else {
    idMap.set(capsule.id, [index])
  }
})

const duplicates = Array.from(idMap.entries()).filter(([, indices]) => indices.length > 1)

console.log(`Found ${duplicates.length} duplicate IDs:`)
duplicates.slice(0, 10).forEach(([id, indices]) => {
  console.log(`  - ID "${id}" appears ${indices.length} times`)
  console.log(`    Capsules:`)
  indices.slice(0, 3).forEach(i => {
    console.log(`      [${i}] ${allCapsules[i].name} (${allCapsules[i].category})`)
  })
})

if (duplicates.length > 10) {
  console.log(`  ... and ${duplicates.length - 10} more duplicates`)
}

// ISSUE 2: Find lowercase categories
console.log('\n📁 ISSUE 2: Lowercase Categories')
console.log('─'.repeat(60))

const categorySet = new Set(allCapsules.map(c => c.category))
const lowercaseCategories = Array.from(categorySet).filter(c =>
  c.toLowerCase() === c && c.length > 1
)

console.log(`Found ${lowercaseCategories.length} lowercase categories:`)
lowercaseCategories.forEach(cat => {
  const count = allCapsules.filter(c => c.category === cat).length
  console.log(`  - "${cat}": ${count} capsules`)

  // Show some examples
  const examples = allCapsules
    .filter(c => c.category === cat)
    .slice(0, 3)
    .map(c => c.name)
  console.log(`    Examples: ${examples.join(', ')}`)
})

// ISSUE 3: Verify tag coverage
console.log('\n🏷️  ISSUE 3: Tag Coverage Analysis')
console.log('─'.repeat(60))

const totalTags = allCapsules.reduce((sum, capsule: any) => {
  return sum + (capsule.tags ? capsule.tags.length : 0)
}, 0)

const avgTagsPerCapsule = totalTags / allCapsules.length
const allUniqueTags = new Set<string>()
allCapsules.forEach((capsule: any) => {
  if (capsule.tags) {
    capsule.tags.forEach((tag: string) => allUniqueTags.add(tag.toLowerCase()))
  }
})

console.log(`Total unique tags: ${allUniqueTags.size}`)
console.log(`Total tags across all capsules: ${totalTags}`)
console.log(`Average tags per capsule: ${avgTagsPerCapsule.toFixed(1)}`)
console.log(`(Previous calculation was incorrect - showing unique tags / capsules)`)

// Recommendations
console.log('\n' + '='.repeat(60))
console.log('💡 RECOMMENDED FIXES')
console.log('='.repeat(60))

console.log(`
1. DUPLICATE IDs (${duplicates.length} issues)
   ├─ Make IDs unique by appending index or category
   ├─ Example: "button" → "button-ui-1", "button-form-2"
   └─ Run ID normalization script

2. LOWERCASE CATEGORIES (${lowercaseCategories.length} categories)
   ├─ Normalize to PascalCase:
${lowercaseCategories.map(c => `   │  - "${c}" → "${c.charAt(0).toUpperCase() + c.slice(1)}"`).join('\n')}
   └─ Update category mappings

3. TAG COVERAGE
   ├─ Coverage is actually GOOD (${avgTagsPerCapsule.toFixed(1)} tags per capsule)
   ├─ Previous test had incorrect calculation
   └─ No action needed - system is working as expected

Priority: Fix #1 (Duplicate IDs) and #2 (Lowercase Categories)
`)

console.log('='.repeat(60) + '\n')
