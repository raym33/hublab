/**
 * Comprehensive Capsule Testing Script
 *
 * Tests all 516+ capsules for:
 * - Validity
 * - Completeness
 * - AI-friendliness
 * - Duplicates
 * - Quality
 */

import { allCapsules, getAllCategories, getCapsuleStats } from '../lib/all-capsules'

interface TestResult {
  passed: boolean
  message: string
  severity: 'error' | 'warning' | 'info'
}

class CapsuleTester {
  results: TestResult[] = []
  stats = {
    total: 0,
    passed: 0,
    warnings: 0,
    errors: 0
  }

  log(message: string, severity: 'error' | 'warning' | 'info' = 'info', passed = true) {
    this.results.push({ passed, message, severity })
    if (severity === 'error') this.stats.errors++
    if (severity === 'warning') this.stats.warnings++
    if (passed && severity === 'info') this.stats.passed++
  }

  // Test 1: Basic Structure
  testBasicStructure() {
    console.log('\n🔍 TEST 1: Basic Structure')
    console.log('─'.repeat(50))

    this.stats.total = allCapsules.length
    this.log(`Total capsules loaded: ${this.stats.total}`, 'info')

    if (this.stats.total < 500) {
      this.log(`Expected 516+ capsules, got ${this.stats.total}`, 'warning', false)
    } else {
      this.log(`✓ Capsule count meets expectation (${this.stats.total})`, 'info')
    }

    // Check each capsule has required fields
    allCapsules.forEach((capsule, index) => {
      const errors = []

      if (!capsule.id) errors.push('missing id')
      if (!capsule.name) errors.push('missing name')
      if (!capsule.category) errors.push('missing category')
      if (!capsule.description) errors.push('missing description')
      if (!capsule.tags || capsule.tags.length === 0) errors.push('missing tags')
      if (!capsule.code) errors.push('missing code')

      if (errors.length > 0) {
        this.log(
          `Capsule #${index} "${capsule.name || 'unnamed'}": ${errors.join(', ')}`,
          'error',
          false
        )
      }
    })
  }

  // Test 2: Check for Duplicates
  testDuplicates() {
    console.log('\n🔍 TEST 2: Duplicate Detection')
    console.log('─'.repeat(50))

    const idMap = new Map<string, number>()
    const nameMap = new Map<string, number>()

    allCapsules.forEach((capsule, index) => {
      // Check ID duplicates
      if (idMap.has(capsule.id)) {
        this.log(
          `Duplicate ID found: "${capsule.id}" at index ${index} and ${idMap.get(capsule.id)}`,
          'error',
          false
        )
      } else {
        idMap.set(capsule.id, index)
      }

      // Check name duplicates (warning only)
      if (nameMap.has(capsule.name)) {
        this.log(
          `Duplicate name found: "${capsule.name}" at index ${index} and ${nameMap.get(capsule.name)}`,
          'warning',
          false
        )
      } else {
        nameMap.set(capsule.name, index)
      }
    })

    if (idMap.size === allCapsules.length) {
      this.log('✓ No duplicate IDs found', 'info')
    }
  }

  // Test 3: Code Quality
  testCodeQuality() {
    console.log('\n🔍 TEST 3: Code Quality')
    console.log('─'.repeat(50))

    let validCode = 0
    let hasProps = 0
    let hasTypeScript = 0
    let hasReact = 0

    allCapsules.forEach((capsule) => {
      if (capsule.code && capsule.code.length > 50) {
        validCode++

        // Check for React patterns
        if (capsule.code.includes('export default') || capsule.code.includes('export function')) {
          hasReact++
        }

        // Check for TypeScript
        if (capsule.code.includes('interface ') || capsule.code.includes('type ') || capsule.code.includes(': ')) {
          hasTypeScript++
        }

        // Check for props definition
        if (capsule.code.includes('Props') || capsule.code.includes('interface')) {
          hasProps++
        }
      }
    })

    this.log(`✓ Capsules with valid code: ${validCode}/${allCapsules.length}`, 'info')
    this.log(`✓ Capsules with TypeScript: ${hasTypeScript}/${allCapsules.length}`, 'info')
    this.log(`✓ Capsules with React exports: ${hasReact}/${allCapsules.length}`, 'info')
    this.log(`✓ Capsules with props interfaces: ${hasProps}/${allCapsules.length}`, 'info')

    if (validCode < allCapsules.length * 0.9) {
      this.log(
        `Only ${((validCode / allCapsules.length) * 100).toFixed(1)}% have valid code`,
        'warning',
        false
      )
    }
  }

  // Test 4: AI-Friendliness
  testAIFriendliness() {
    console.log('\n🔍 TEST 4: AI-Friendliness')
    console.log('─'.repeat(50))

    let goodDescriptions = 0
    let goodTags = 0
    let hasExamples = 0
    let selfContained = 0

    allCapsules.forEach((capsule) => {
      // Good description (>30 chars, descriptive)
      if (capsule.description && capsule.description.length > 30) {
        goodDescriptions++
      }

      // Good tags (3+ relevant tags)
      if (capsule.tags && capsule.tags.length >= 3) {
        goodTags++
      }

      // Has usage examples or props documentation
      if (capsule.code && (
        capsule.code.includes('/**') ||
        capsule.code.includes('//') ||
        capsule.code.includes('Example')
      )) {
        hasExamples++
      }

      // Self-contained (has all imports)
      if (capsule.code && (
        capsule.code.includes("'use client'") ||
        capsule.code.includes('import ')
      )) {
        selfContained++
      }
    })

    this.log(`✓ Descriptive descriptions: ${goodDescriptions}/${allCapsules.length}`, 'info')
    this.log(`✓ Well-tagged capsules: ${goodTags}/${allCapsules.length}`, 'info')
    this.log(`✓ Capsules with examples/docs: ${hasExamples}/${allCapsules.length}`, 'info')
    this.log(`✓ Self-contained code: ${selfContained}/${allCapsules.length}`, 'info')

    const aiScore = (
      (goodDescriptions + goodTags + hasExamples + selfContained) /
      (allCapsules.length * 4)
    ) * 100

    this.log(`\nAI-Friendliness Score: ${aiScore.toFixed(1)}%`, aiScore > 70 ? 'info' : 'warning')
  }

  // Test 5: Category Organization
  testCategories() {
    console.log('\n🔍 TEST 5: Category Organization')
    console.log('─'.repeat(50))

    const categories = getAllCategories()
    const stats = getCapsuleStats()

    this.log(`✓ Total categories: ${categories.length - 1}`, 'info') // -1 for 'All'

    Object.entries(stats.categoryDistribution).forEach(([category, count]) => {
      this.log(`  - ${category}: ${count} capsules`, 'info')
    })

    // Check for uncategorized
    const uncategorized = allCapsules.filter(c => !c.category || c.category === 'undefined')
    if (uncategorized.length > 0) {
      this.log(`Found ${uncategorized.length} uncategorized capsules`, 'warning', false)
    }

    // Check for balanced distribution
    const avgPerCategory = stats.averagePerCategory
    this.log(`\nAverage per category: ${avgPerCategory}`, 'info')
  }

  // Test 6: Search & Tags
  testSearchability() {
    console.log('\n🔍 TEST 6: Searchability')
    console.log('─'.repeat(50))

    const allTags = new Set<string>()
    let lowTagCount = 0

    allCapsules.forEach((capsule) => {
      capsule.tags?.forEach(tag => allTags.add(tag.toLowerCase()))

      if (!capsule.tags || capsule.tags.length < 2) {
        lowTagCount++
      }
    })

    this.log(`✓ Total unique tags: ${allTags.size}`, 'info')
    this.log(`✓ Average tags per capsule: ${(allTags.size / allCapsules.length).toFixed(1)}`, 'info')

    if (lowTagCount > 0) {
      this.log(`${lowTagCount} capsules have less than 2 tags`, 'warning', false)
    }

    // Test common search terms
    const commonSearches = ['button', 'form', 'chart', 'modal', 'table', 'input', 'card']
    commonSearches.forEach(term => {
      const matches = allCapsules.filter(c =>
        c.name.toLowerCase().includes(term) ||
        c.description.toLowerCase().includes(term) ||
        c.tags?.some(t => t.toLowerCase().includes(term))
      )
      this.log(`  Search "${term}": ${matches.length} results`, 'info')
    })
  }

  // Test 7: New Capsules Quality
  testNewCapsules() {
    console.log('\n🔍 TEST 7: New Capsules Quality Check')
    console.log('─'.repeat(50))

    const newCategories = [
      'Notification', 'Advanced Form', 'Data Visualization',
      'Layout', 'Navigation', 'Utility'
    ]

    newCategories.forEach(category => {
      const capsules = allCapsules.filter(c =>
        c.category?.toLowerCase().includes(category.toLowerCase())
      )

      if (capsules.length > 0) {
        this.log(`✓ ${category}: ${capsules.length} capsules`, 'info')

        capsules.forEach(capsule => {
          // Check code has TypeScript
          const hasTS = capsule.code?.includes('interface') || capsule.code?.includes(': ')
          // Check has proper exports
          const hasExport = capsule.code?.includes('export default')
          // Check has use client
          const hasClient = capsule.code?.includes("'use client'")

          if (!hasTS || !hasExport || !hasClient) {
            const missing = []
            if (!hasTS) missing.push('TypeScript')
            if (!hasExport) missing.push('export')
            if (!hasClient) missing.push('use client')
            this.log(
              `  ${capsule.name} missing: ${missing.join(', ')}`,
              'warning',
              false
            )
          }
        })
      }
    })
  }

  // Run all tests
  async runAll() {
    console.log('\n' + '='.repeat(50))
    console.log('🧪 COMPREHENSIVE CAPSULE TESTING')
    console.log('='.repeat(50))

    this.testBasicStructure()
    this.testDuplicates()
    this.testCodeQuality()
    this.testAIFriendliness()
    this.testCategories()
    this.testSearchability()
    this.testNewCapsules()

    this.printSummary()
  }

  printSummary() {
    console.log('\n' + '='.repeat(50))
    console.log('📊 TEST SUMMARY')
    console.log('='.repeat(50))
    console.log(`Total Capsules: ${this.stats.total}`)
    console.log(`Errors: ${this.stats.errors}`)
    console.log(`Warnings: ${this.stats.warnings}`)
    console.log(`Passed Checks: ${this.stats.passed}`)

    const successRate = ((this.stats.passed / (this.stats.passed + this.stats.errors + this.stats.warnings)) * 100) || 0
    console.log(`\n✅ Success Rate: ${successRate.toFixed(1)}%`)

    if (this.stats.errors === 0) {
      console.log('\n🎉 ALL TESTS PASSED!')
    } else {
      console.log(`\n⚠️  Found ${this.stats.errors} critical issues`)
    }

    console.log('='.repeat(50) + '\n')
  }
}

// Run tests
const tester = new CapsuleTester()
tester.runAll()
