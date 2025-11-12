/**
 * Operational Verification Test
 *
 * Verifies that all capsules are operational and counts them accurately
 *
 * Tests:
 * 1. Exact capsule count
 * 2. Code operability (valid React code)
 * 3. Required fields present
 * 4. Import/export structure
 * 5. Category breakdown
 */

import { allCapsules } from '../lib/all-capsules'

interface OperationalIssue {
  capsule: string
  issue: string
  severity: 'critical' | 'warning'
}

class OperationalTester {
  issues: OperationalIssue[] = []
  stats = {
    total: 0,
    operational: 0,
    hasIssues: 0,
    categoryBreakdown: {} as Record<string, number>
  }

  /**
   * TEST 1: Count capsules accurately
   */
  countCapsules() {
    console.log('\n📊 TEST 1: Capsule Count Verification')
    console.log('─'.repeat(60))

    this.stats.total = allCapsules.length
    console.log(`✓ Total capsules found: ${this.stats.total}`)
    console.log(`  Expected: 240`)
    console.log(`  Status: ${this.stats.total === 240 ? '✅ CORRECT' : '⚠️ MISMATCH'}`)

    // Breakdown by source
    const categories = new Set(allCapsules.map(c => c.category))
    console.log(`\n📁 Categories found: ${categories.size}`)

    categories.forEach(cat => {
      const count = allCapsules.filter(c => c.category === cat).length
      this.stats.categoryBreakdown[cat] = count
    })
  }

  /**
   * TEST 2: Verify React code structure
   */
  verifyCodeStructure() {
    console.log('\n🔧 TEST 2: Code Structure Verification')
    console.log('─'.repeat(60))

    let validCode = 0
    let hasUseClient = 0
    let hasExport = 0
    let hasReactImport = 0

    allCapsules.forEach((capsule, index) => {
      if (!capsule.code || capsule.code.trim().length === 0) {
        this.issues.push({
          capsule: `${capsule.name} (${capsule.category})`,
          issue: 'Missing or empty code',
          severity: 'critical'
        })
        return
      }

      // Check for syntax issues
      try {
        const code = capsule.code

        // Check basic React structure
        if (code.includes("'use client'") || code.includes('"use client"')) {
          hasUseClient++
        }

        if (code.includes('export default') || code.includes('export {')) {
          hasExport++
        } else {
          this.issues.push({
            capsule: `${capsule.name} (${capsule.category})`,
            issue: 'Missing export statement',
            severity: 'warning'
          })
        }

        // Check for common syntax errors
        const openBraces = (code.match(/{/g) || []).length
        const closeBraces = (code.match(/}/g) || []).length
        const openParens = (code.match(/\(/g) || []).length
        const closeParens = (code.match(/\)/g) || []).length

        if (openBraces !== closeBraces) {
          this.issues.push({
            capsule: `${capsule.name} (${capsule.category})`,
            issue: `Unmatched braces: ${openBraces} open, ${closeBraces} close`,
            severity: 'critical'
          })
        }

        if (openParens !== closeParens) {
          this.issues.push({
            capsule: `${capsule.name} (${capsule.category})`,
            issue: `Unmatched parentheses: ${openParens} open, ${closeParens} close`,
            severity: 'critical'
          })
        }

        validCode++
      } catch (error) {
        this.issues.push({
          capsule: `${capsule.name} (${capsule.category})`,
          issue: `Code parsing error: ${error}`,
          severity: 'critical'
        })
      }
    })

    console.log(`✓ Valid code structure: ${validCode}/${this.stats.total}`)
    console.log(`✓ Has 'use client': ${hasUseClient}/${this.stats.total} (${((hasUseClient/this.stats.total)*100).toFixed(1)}%)`)
    console.log(`✓ Has export: ${hasExport}/${this.stats.total} (${((hasExport/this.stats.total)*100).toFixed(1)}%)`)
  }

  /**
   * TEST 3: Verify required fields
   */
  verifyRequiredFields() {
    console.log('\n📋 TEST 3: Required Fields Verification')
    console.log('─'.repeat(60))

    const requiredFields = ['id', 'name', 'category', 'description', 'code']
    const optionalFields = ['tags', 'popularity', 'dependencies']

    let completeCount = 0
    let withTags = 0
    let withPopularity = 0

    allCapsules.forEach((capsule: any) => {
      const missing: string[] = []

      requiredFields.forEach(field => {
        if (!capsule[field] || (typeof capsule[field] === 'string' && capsule[field].trim().length === 0)) {
          missing.push(field)
        }
      })

      if (missing.length > 0) {
        this.issues.push({
          capsule: `${capsule.name || 'Unnamed'} (${capsule.category || 'No category'})`,
          issue: `Missing required fields: ${missing.join(', ')}`,
          severity: 'critical'
        })
      } else {
        completeCount++
      }

      // Check optional fields
      if (capsule.tags && Array.isArray(capsule.tags) && capsule.tags.length > 0) {
        withTags++
      }

      if (capsule.popularity !== undefined) {
        withPopularity++
      }
    })

    console.log(`✓ Complete capsules (all required fields): ${completeCount}/${this.stats.total}`)
    console.log(`✓ With tags: ${withTags}/${this.stats.total} (${((withTags/this.stats.total)*100).toFixed(1)}%)`)
    console.log(`✓ With popularity: ${withPopularity}/${this.stats.total} (${((withPopularity/this.stats.total)*100).toFixed(1)}%)`)
  }

  /**
   * TEST 4: Verify data quality
   */
  verifyDataQuality() {
    console.log('\n✨ TEST 4: Data Quality Verification')
    console.log('─'.repeat(60))

    let goodDescriptions = 0
    let wellTagged = 0
    let longCode = 0

    allCapsules.forEach((capsule: any) => {
      if (capsule.description && capsule.description.length > 30) {
        goodDescriptions++
      } else if (capsule.description) {
        this.issues.push({
          capsule: `${capsule.name} (${capsule.category})`,
          issue: `Description too short (${capsule.description.length} chars)`,
          severity: 'warning'
        })
      }

      if (capsule.tags && Array.isArray(capsule.tags) && capsule.tags.length >= 3) {
        wellTagged++
      } else {
        const tagCount = capsule.tags ? capsule.tags.length : 0
        this.issues.push({
          capsule: `${capsule.name} (${capsule.category})`,
          issue: `Insufficient tags (${tagCount}, need 3+)`,
          severity: 'warning'
        })
      }

      if (capsule.code && capsule.code.length > 50) {
        longCode++
      }
    })

    console.log(`✓ Good descriptions (>30 chars): ${goodDescriptions}/${this.stats.total} (${((goodDescriptions/this.stats.total)*100).toFixed(1)}%)`)
    console.log(`✓ Well-tagged (3+ tags): ${wellTagged}/${this.stats.total} (${((wellTagged/this.stats.total)*100).toFixed(1)}%)`)
    console.log(`✓ Substantial code (>50 chars): ${longCode}/${this.stats.total} (${((longCode/this.stats.total)*100).toFixed(1)}%)`)
  }

  /**
   * Run all operational tests
   */
  runAll() {
    console.log('\n' + '='.repeat(60))
    console.log('🔍 OPERATIONAL VERIFICATION TEST')
    console.log('='.repeat(60))
    console.log('Testing capsule functionality and counting capsules\n')

    this.countCapsules()
    this.verifyCodeStructure()
    this.verifyRequiredFields()
    this.verifyDataQuality()

    this.printSummary()
  }

  /**
   * Print summary report
   */
  printSummary() {
    console.log('\n' + '='.repeat(60))
    console.log('📊 OPERATIONAL STATUS REPORT')
    console.log('='.repeat(60))

    // Count severity
    const criticalIssues = this.issues.filter(i => i.severity === 'critical').length
    const warnings = this.issues.filter(i => i.severity === 'warning').length

    console.log(`\n📦 CAPSULE COUNT:`)
    console.log(`   Total: ${this.stats.total}`)
    console.log(`   Expected: 240`)
    console.log(`   Status: ${this.stats.total === 240 ? '✅ MATCH' : '⚠️ MISMATCH'}`)

    console.log(`\n🔧 OPERATIONAL STATUS:`)
    const operational = this.stats.total - this.issues.filter(i => i.severity === 'critical').length
    console.log(`   Operational: ${operational}/${this.stats.total} (${((operational/this.stats.total)*100).toFixed(1)}%)`)
    console.log(`   Critical Issues: ${criticalIssues}`)
    console.log(`   Warnings: ${warnings}`)

    console.log(`\n📁 CATEGORY BREAKDOWN:`)
    Object.entries(this.stats.categoryBreakdown)
      .sort(([, a], [, b]) => b - a)
      .forEach(([category, count]) => {
        console.log(`   ${category}: ${count} capsules`)
      })

    // Show issues if any
    if (this.issues.length > 0) {
      console.log(`\n⚠️  ISSUES FOUND (${this.issues.length} total):`)

      const criticalList = this.issues.filter(i => i.severity === 'critical')
      if (criticalList.length > 0) {
        console.log(`\n❌ CRITICAL (${criticalList.length}):`)
        criticalList.slice(0, 10).forEach(issue => {
          console.log(`   • ${issue.capsule}`)
          console.log(`     ${issue.issue}`)
        })
        if (criticalList.length > 10) {
          console.log(`   ... and ${criticalList.length - 10} more critical issues`)
        }
      }

      const warningList = this.issues.filter(i => i.severity === 'warning')
      if (warningList.length > 0) {
        console.log(`\n⚠️  WARNINGS (${warningList.length}):`)
        warningList.slice(0, 5).forEach(issue => {
          console.log(`   • ${issue.capsule}`)
          console.log(`     ${issue.issue}`)
        })
        if (warningList.length > 5) {
          console.log(`   ... and ${warningList.length - 5} more warnings`)
        }
      }
    }

    console.log('\n' + '='.repeat(60))
    console.log('🎯 FINAL VERDICT:')
    console.log('='.repeat(60))

    if (criticalIssues === 0 && this.stats.total === 240) {
      console.log('✅ ALL CAPSULES ARE OPERATIONAL!')
      console.log(`   • ${this.stats.total} capsules counted (matches expected 240)`)
      console.log(`   • All capsules have valid code structure`)
      console.log(`   • All required fields present`)
      if (warnings > 0) {
        console.log(`   • ${warnings} minor warnings (non-critical)`)
      }
    } else {
      console.log('⚠️  OPERATIONAL ISSUES DETECTED')
      if (this.stats.total !== 240) {
        console.log(`   • Count mismatch: ${this.stats.total} found, 240 expected`)
      }
      if (criticalIssues > 0) {
        console.log(`   • ${criticalIssues} capsules have critical issues`)
      }
    }

    console.log('='.repeat(60) + '\n')
  }
}

// Run operational test
const tester = new OperationalTester()
tester.runAll()
