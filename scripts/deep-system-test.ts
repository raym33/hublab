/**
 * Deep System Test - Comprehensive Quality Check
 *
 * Tests all aspects of the improved capsule system:
 * - Enhanced capsules quality
 * - Tag system functionality
 * - Search and filter capabilities
 * - Component integration
 * - Performance metrics
 */

import { allCapsules, getAllCategories, searchCapsules } from '../lib/all-capsules'

interface TestResult {
  category: string
  tests: {
    name: string
    passed: boolean
    details: string
    critical: boolean
  }[]
}

class DeepSystemTester {
  results: TestResult[] = []
  stats = {
    totalTests: 0,
    passed: 0,
    failed: 0,
    warnings: 0
  }

  addTest(category: string, name: string, passed: boolean, details: string, critical = true) {
    const categoryResult = this.results.find(r => r.category === category)
    const test = { name, passed, details, critical }

    if (categoryResult) {
      categoryResult.tests.push(test)
    } else {
      this.results.push({
        category,
        tests: [test]
      })
    }

    this.stats.totalTests++
    if (passed) {
      this.stats.passed++
    } else {
      if (critical) this.stats.failed++
      else this.stats.warnings++
    }
  }

  // TEST 1: Enhanced Capsules Quality
  testEnhancedQuality() {
    console.log('\n🔬 TEST 1: Enhanced Capsules Quality')
    console.log('─'.repeat(60))

    // Check all capsules have enhanced properties
    const withGoodDesc = allCapsules.filter(c => c.description && c.description.length > 30).length
    const withTags = allCapsules.filter((c: any) => c.tags && c.tags.length >= 3).length
    const withCode = allCapsules.filter(c => c.code && c.code.length > 50).length

    this.addTest(
      'Enhanced Quality',
      'All capsules have good descriptions (>30 chars)',
      withGoodDesc === allCapsules.length,
      `${withGoodDesc}/${allCapsules.length} capsules`
    )

    this.addTest(
      'Enhanced Quality',
      'All capsules have 3+ tags',
      withTags === allCapsules.length,
      `${withTags}/${allCapsules.length} capsules`
    )

    this.addTest(
      'Enhanced Quality',
      'All capsules have valid code',
      withCode === allCapsules.length,
      `${withCode}/${allCapsules.length} capsules`
    )

    // Check for React best practices in code
    let reactCompliant = 0
    allCapsules.forEach((capsule: any) => {
      if (capsule.code) {
        const hasUseClient = capsule.code.includes("'use client'")
        const hasExport = capsule.code.includes('export default')
        const hasReactImport = capsule.code.includes('import React')

        if (hasUseClient && hasExport) {
          reactCompliant++
        }
      }
    })

    this.addTest(
      'Enhanced Quality',
      'React compliance (use client + export)',
      reactCompliant === allCapsules.length,
      `${reactCompliant}/${allCapsules.length} compliant`
    )

    console.log(`✓ Quality checks completed`)
  }

  // TEST 2: Tag System Functionality
  testTagSystem() {
    console.log('\n🏷️  TEST 2: Tag System Functionality')
    console.log('─'.repeat(60))

    // Collect all unique tags
    const allTags = new Set<string>()
    const tagDistribution: Record<string, number> = {}

    allCapsules.forEach((capsule: any) => {
      if (capsule.tags) {
        capsule.tags.forEach((tag: string) => {
          allTags.add(tag.toLowerCase())
          tagDistribution[tag.toLowerCase()] = (tagDistribution[tag.toLowerCase()] || 0) + 1
        })
      }
    })

    this.addTest(
      'Tag System',
      'Rich tag vocabulary',
      allTags.size >= 50,
      `${allTags.size} unique tags (target: 50+)`
    )

    // Check tag distribution
    const avgTagsPerCapsule = Array.from(allTags).length / allCapsules.length
    this.addTest(
      'Tag System',
      'Good tag coverage',
      avgTagsPerCapsule >= 3,
      `${avgTagsPerCapsule.toFixed(1)} tags per capsule on average`
    )

    // Check for semantic tags (common useful tags)
    const semanticTags = [
      'button', 'form', 'input', 'interactive', 'animated',
      'responsive', 'layout', 'navigation', 'data', 'visualization'
    ]

    const foundSemanticTags = semanticTags.filter(tag => allTags.has(tag))
    this.addTest(
      'Tag System',
      'Semantic tags present',
      foundSemanticTags.length >= 7,
      `${foundSemanticTags.length}/${semanticTags.length} semantic tags found`
    )

    // Show top 10 most used tags
    const sortedTags = Object.entries(tagDistribution)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)

    console.log('\n📊 Top 10 Most Used Tags:')
    sortedTags.forEach(([tag, count], i) => {
      console.log(`   ${i + 1}. ${tag}: ${count} capsules`)
    })

    console.log(`\n✓ Tag system checks completed`)
  }

  // TEST 3: Search and Filter Capabilities
  testSearchFilter() {
    console.log('\n🔍 TEST 3: Search and Filter Capabilities')
    console.log('─'.repeat(60))

    // Test search by name
    const buttonResults = searchCapsules('button')
    this.addTest(
      'Search & Filter',
      'Search by name works',
      buttonResults.length > 0,
      `Found ${buttonResults.length} results for "button"`
    )

    // Test search by tag
    const formResults = searchCapsules('form')
    this.addTest(
      'Search & Filter',
      'Search by tag works',
      formResults.length > 0,
      `Found ${formResults.length} results for "form"`
    )

    // Test search precision
    const chartResults = searchCapsules('chart')
    const chartPrecision = chartResults.filter(c =>
      c.name.toLowerCase().includes('chart') ||
      c.description.toLowerCase().includes('chart') ||
      (c as any).tags?.some((t: string) => t.toLowerCase().includes('chart'))
    ).length / chartResults.length

    this.addTest(
      'Search & Filter',
      'Search precision is high',
      chartPrecision >= 0.8,
      `${(chartPrecision * 100).toFixed(1)}% precision`
    )

    // Test category filtering
    const categories = getAllCategories()
    this.addTest(
      'Search & Filter',
      'Categories are well-organized',
      categories.length >= 5 && categories.length <= 20,
      `${categories.length - 1} categories (excluding "All")`
    )

    console.log('\n📁 Available Categories:')
    categories.slice(1).forEach(cat => {
      const count = allCapsules.filter(c => c.category === cat).length
      console.log(`   - ${cat}: ${count} capsules`)
    })

    console.log(`\n✓ Search and filter checks completed`)
  }

  // TEST 4: Data Integrity
  testDataIntegrity() {
    console.log('\n🔒 TEST 4: Data Integrity')
    console.log('─'.repeat(60))

    // Check for duplicates
    const ids = allCapsules.map(c => c.id)
    const uniqueIds = new Set(ids)
    this.addTest(
      'Data Integrity',
      'No duplicate IDs',
      ids.length === uniqueIds.size,
      `${uniqueIds.size}/${ids.length} unique IDs`
    )

    // Check for missing required fields
    let completeCount = 0
    allCapsules.forEach(capsule => {
      if (
        capsule.id &&
        capsule.name &&
        capsule.category &&
        capsule.description &&
        (capsule as any).tags &&
        capsule.code
      ) {
        completeCount++
      }
    })

    this.addTest(
      'Data Integrity',
      'All capsules have required fields',
      completeCount === allCapsules.length,
      `${completeCount}/${allCapsules.length} complete`
    )

    // Check category normalization
    const categorySet = new Set(allCapsules.map(c => c.category))
    const hasLowercaseCategories = Array.from(categorySet).some(c =>
      c.toLowerCase() === c && c.length > 1
    )

    this.addTest(
      'Data Integrity',
      'Categories are normalized (PascalCase)',
      !hasLowercaseCategories,
      hasLowercaseCategories ? 'Found lowercase categories' : 'All categories properly cased'
    )

    console.log(`✓ Data integrity checks completed`)
  }

  // TEST 5: Performance Metrics
  testPerformance() {
    console.log('\n⚡ TEST 5: Performance Metrics')
    console.log('─'.repeat(60))

    // Test search performance
    const searchStart = performance.now()
    for (let i = 0; i < 100; i++) {
      searchCapsules('button')
    }
    const searchTime = performance.now() - searchStart
    const avgSearchTime = searchTime / 100

    this.addTest(
      'Performance',
      'Search is fast (<5ms average)',
      avgSearchTime < 5,
      `${avgSearchTime.toFixed(2)}ms average per search`,
      false
    )

    // Test filter performance
    const filterStart = performance.now()
    for (let i = 0; i < 100; i++) {
      allCapsules.filter(c => c.category === 'UI')
    }
    const filterTime = performance.now() - filterStart
    const avgFilterTime = filterTime / 100

    this.addTest(
      'Performance',
      'Filtering is fast (<2ms average)',
      avgFilterTime < 2,
      `${avgFilterTime.toFixed(2)}ms average per filter`,
      false
    )

    // Memory footprint
    const capsuleData = JSON.stringify(allCapsules)
    const memorySizeMB = capsuleData.length / (1024 * 1024)

    this.addTest(
      'Performance',
      'Reasonable memory footprint (<5MB)',
      memorySizeMB < 5,
      `${memorySizeMB.toFixed(2)}MB of data`,
      false
    )

    console.log(`✓ Performance checks completed`)
  }

  // TEST 6: AI-Friendliness Score
  testAIFriendliness() {
    console.log('\n🤖 TEST 6: AI-Friendliness Analysis')
    console.log('─'.repeat(60))

    const metrics = {
      goodDescriptions: 0,
      wellTagged: 0,
      hasExamples: 0,
      selfContained: 0,
      typed: 0
    }

    allCapsules.forEach((capsule: any) => {
      if (capsule.description && capsule.description.length > 30) metrics.goodDescriptions++
      if (capsule.tags && capsule.tags.length >= 3) metrics.wellTagged++
      if (capsule.code && capsule.code.includes('//')) metrics.hasExamples++
      if (capsule.code && capsule.code.includes("'use client'")) metrics.selfContained++
      if (capsule.code && (capsule.code.includes('interface') || capsule.code.includes(': '))) metrics.typed++
    })

    const total = allCapsules.length

    this.addTest(
      'AI-Friendliness',
      'Descriptive descriptions',
      metrics.goodDescriptions / total >= 0.95,
      `${metrics.goodDescriptions}/${total} (${((metrics.goodDescriptions / total) * 100).toFixed(1)}%)`
    )

    this.addTest(
      'AI-Friendliness',
      'Well-tagged capsules',
      metrics.wellTagged / total >= 0.95,
      `${metrics.wellTagged}/${total} (${((metrics.wellTagged / total) * 100).toFixed(1)}%)`
    )

    this.addTest(
      'AI-Friendliness',
      'Self-contained code',
      metrics.selfContained / total >= 0.90,
      `${metrics.selfContained}/${total} (${((metrics.selfContained / total) * 100).toFixed(1)}%)`
    )

    this.addTest(
      'AI-Friendliness',
      'TypeScript typed',
      metrics.typed / total >= 0.70,
      `${metrics.typed}/${total} (${((metrics.typed / total) * 100).toFixed(1)}%)`
    )

    const aiScore = (
      (metrics.goodDescriptions + metrics.wellTagged + metrics.selfContained + metrics.typed) /
      (total * 4)
    ) * 100

    console.log(`\n🎯 Overall AI-Friendliness Score: ${aiScore.toFixed(1)}%`)

    this.addTest(
      'AI-Friendliness',
      'Overall score meets target (80%+)',
      aiScore >= 80,
      `${aiScore.toFixed(1)}%`
    )

    console.log(`✓ AI-friendliness checks completed`)
  }

  // Run all tests
  runAll() {
    console.log('\n' + '='.repeat(60))
    console.log('🧪 DEEP SYSTEM TEST - COMPREHENSIVE QUALITY CHECK')
    console.log('='.repeat(60))
    console.log(`📦 Testing ${allCapsules.length} capsules\n`)

    this.testEnhancedQuality()
    this.testTagSystem()
    this.testSearchFilter()
    this.testDataIntegrity()
    this.testPerformance()
    this.testAIFriendliness()

    this.printSummary()
  }

  printSummary() {
    console.log('\n' + '='.repeat(60))
    console.log('📊 TEST SUMMARY')
    console.log('='.repeat(60))

    this.results.forEach(result => {
      const passed = result.tests.filter(t => t.passed).length
      const failed = result.tests.filter(t => !t.passed && t.critical).length
      const warnings = result.tests.filter(t => !t.passed && !t.critical).length

      console.log(`\n${result.category}:`)
      result.tests.forEach(test => {
        const icon = test.passed ? '✅' : (test.critical ? '❌' : '⚠️')
        console.log(`  ${icon} ${test.name}`)
        console.log(`     ${test.details}`)
      })
    })

    console.log('\n' + '='.repeat(60))
    console.log(`Total Tests: ${this.stats.totalTests}`)
    console.log(`✅ Passed: ${this.stats.passed}`)
    console.log(`❌ Failed: ${this.stats.failed}`)
    console.log(`⚠️  Warnings: ${this.stats.warnings}`)

    const successRate = (this.stats.passed / this.stats.totalTests) * 100
    console.log(`\n📈 Success Rate: ${successRate.toFixed(1)}%`)

    if (this.stats.failed === 0) {
      console.log('\n🎉 ALL CRITICAL TESTS PASSED!')
      if (this.stats.warnings === 0) {
        console.log('✨ PERFECT SCORE - NO WARNINGS!')
      }
    } else {
      console.log(`\n⚠️  Found ${this.stats.failed} critical issues`)
    }

    console.log('='.repeat(60) + '\n')
  }
}

// Run deep system test
const tester = new DeepSystemTester()
tester.runAll()
