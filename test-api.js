#!/usr/bin/env node
/**
 * HubLab API Test Script
 *
 * This script tests all major API endpoints to ensure they're working correctly.
 * Run with: node test-api.js
 */

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000/api/v1'
const API_KEY = process.env.HUBLAB_API_KEY || 'hublab_sk_test_key'

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  gray: '\x1b[90m',
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function logTest(name) {
  log(`\n🧪 Testing: ${name}`, 'blue')
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green')
}

function logError(message) {
  log(`❌ ${message}`, 'red')
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow')
}

function logInfo(message) {
  log(`   ${message}`, 'gray')
}

async function apiRequest(method, path, body = null) {
  const url = `${BASE_URL}${path}`
  const options = {
    method,
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
  }

  if (body) {
    options.body = JSON.stringify(body)
  }

  logInfo(`${method} ${path}`)

  try {
    const response = await fetch(url, options)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${data.error?.message || 'Unknown error'}`)
    }

    return { success: true, data, status: response.status }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

async function runTests() {
  log('\n╔══════════════════════════════════════════╗', 'blue')
  log('║       HubLab API Test Suite             ║', 'blue')
  log('╚══════════════════════════════════════════╝', 'blue')
  log(`\nBase URL: ${BASE_URL}`)
  log(`API Key: ${API_KEY.substring(0, 20)}...`)

  let projectId = null
  let testsPassed = 0
  let testsFailed = 0

  // Test 1: List Themes
  logTest('GET /themes')
  const themesResult = await apiRequest('GET', '/themes')
  if (themesResult.success) {
    logSuccess(`Found ${themesResult.data.data?.themes?.length || 0} themes`)
    testsPassed++
  } else {
    logError(`Failed: ${themesResult.error}`)
    testsFailed++
  }

  // Test 2: Get Specific Theme
  logTest('GET /themes/modern-blue')
  const themeResult = await apiRequest('GET', '/themes/modern-blue')
  if (themeResult.success) {
    logSuccess('Retrieved modern-blue theme')
    testsPassed++
  } else {
    logError(`Failed: ${themeResult.error}`)
    testsFailed++
  }

  // Test 3: Browse Capsule Catalog
  logTest('GET /catalog/capsules')
  const catalogResult = await apiRequest('GET', '/catalog/capsules')
  if (catalogResult.success) {
    logSuccess(`Found ${catalogResult.data.data?.capsules?.length || 0} capsule types`)
    testsPassed++
  } else {
    logError(`Failed: ${catalogResult.error}`)
    testsFailed++
  }

  // Test 4: Get Specific Capsule Type
  logTest('GET /catalog/capsules/data-table')
  const capsuleTypeResult = await apiRequest('GET', '/catalog/capsules/data-table')
  if (capsuleTypeResult.success) {
    logSuccess('Retrieved data-table capsule definition')
    testsPassed++
  } else {
    logError(`Failed: ${capsuleTypeResult.error}`)
    testsFailed++
  }

  // Test 5: Create Project
  logTest('POST /projects')
  const createResult = await apiRequest('POST', '/projects', {
    name: 'Test Dashboard',
    description: 'API test project',
    template: 'dashboard',
    theme: 'modern-blue',
  })

  if (createResult.success) {
    projectId = createResult.data.data?.project?.id
    logSuccess(`Created project: ${projectId}`)
    testsPassed++
  } else {
    logError(`Failed: ${createResult.error}`)
    testsFailed++
    logWarning('Cannot continue with remaining tests without a project')
    return printSummary(testsPassed, testsFailed)
  }

  // Test 6: List Projects
  logTest('GET /projects')
  const listResult = await apiRequest('GET', '/projects?limit=5')
  if (listResult.success) {
    logSuccess(`Found ${listResult.data.data?.projects?.length || 0} projects`)
    testsPassed++
  } else {
    logError(`Failed: ${listResult.error}`)
    testsFailed++
  }

  // Test 7: Get Project
  logTest(`GET /projects/${projectId}`)
  const getResult = await apiRequest('GET', `/projects/${projectId}`)
  if (getResult.success) {
    logSuccess('Retrieved project details')
    testsPassed++
  } else {
    logError(`Failed: ${getResult.error}`)
    testsFailed++
  }

  // Test 8: Add Stats Grid Capsule
  logTest(`POST /projects/${projectId}/capsules`)
  const addCapsuleResult = await apiRequest('POST', `/projects/${projectId}/capsules`, {
    type: 'stats-grid',
    props: {
      columns: 4,
      stats: [
        { label: 'Users', value: '1,234', icon: 'users' },
        { label: 'Revenue', value: '$45.6k', icon: 'dollar' },
        { label: 'Projects', value: '89', icon: 'folder' },
        { label: 'Completion', value: '94%', icon: 'check' },
      ],
    },
  })

  if (addCapsuleResult.success) {
    logSuccess('Added stats-grid capsule')
    testsPassed++
  } else {
    logError(`Failed: ${addCapsuleResult.error}`)
    testsFailed++
  }

  // Test 9: List Capsules
  logTest(`GET /projects/${projectId}/capsules`)
  const listCapsulesResult = await apiRequest('GET', `/projects/${projectId}/capsules`)
  if (listCapsulesResult.success) {
    const count = listCapsulesResult.data.data?.capsules?.length || 0
    logSuccess(`Found ${count} capsules in project`)
    testsPassed++
  } else {
    logError(`Failed: ${listCapsulesResult.error}`)
    testsFailed++
  }

  // Test 10: Add Integration
  logTest(`POST /projects/${projectId}/integrations`)
  const addIntegrationResult = await apiRequest('POST', `/projects/${projectId}/integrations`, {
    type: 'supabase',
    config: {},
  })

  if (addIntegrationResult.success) {
    logSuccess('Added Supabase integration')
    testsPassed++
  } else {
    logError(`Failed: ${addIntegrationResult.error}`)
    testsFailed++
  }

  // Test 11: List Integrations
  logTest(`GET /projects/${projectId}/integrations`)
  const listIntegrationsResult = await apiRequest('GET', `/projects/${projectId}/integrations`)
  if (listIntegrationsResult.success) {
    const count = listIntegrationsResult.data.data?.integrations?.length || 0
    logSuccess(`Found ${count} integrations in project`)
    testsPassed++
  } else {
    logError(`Failed: ${listIntegrationsResult.error}`)
    testsFailed++
  }

  // Test 12: Export Project
  logTest(`POST /projects/${projectId}/export`)
  const exportResult = await apiRequest('POST', `/projects/${projectId}/export`, {
    format: 'nextjs',
    options: {
      typescript: true,
      includeReadme: true,
      includeEnvExample: true,
    },
  })

  if (exportResult.success) {
    const fileCount = exportResult.data.data?.files?.length || 0
    logSuccess(`Exported ${fileCount} files to Next.js`)
    testsPassed++
  } else {
    logError(`Failed: ${exportResult.error}`)
    testsFailed++
  }

  // Test 13: Generate Preview
  logTest(`POST /projects/${projectId}/preview`)
  const previewResult = await apiRequest('POST', `/projects/${projectId}/preview`)
  if (previewResult.success) {
    logSuccess(`Generated preview URL: ${previewResult.data.data?.previewUrl}`)
    testsPassed++
  } else {
    logError(`Failed: ${previewResult.error}`)
    testsFailed++
  }

  // Test 14: Update Project
  logTest(`PUT /projects/${projectId}`)
  const updateResult = await apiRequest('PUT', `/projects/${projectId}`, {
    name: 'Updated Test Dashboard',
    description: 'Updated via API test',
  })

  if (updateResult.success) {
    logSuccess('Updated project successfully')
    testsPassed++
  } else {
    logError(`Failed: ${updateResult.error}`)
    testsFailed++
  }

  // Test 15: Delete Project
  logTest(`DELETE /projects/${projectId}`)
  const deleteResult = await apiRequest('DELETE', `/projects/${projectId}`)
  if (deleteResult.success) {
    logSuccess('Deleted project successfully')
    testsPassed++
  } else {
    logError(`Failed: ${deleteResult.error}`)
    testsFailed++
  }

  printSummary(testsPassed, testsFailed)
}

function printSummary(passed, failed) {
  const total = passed + failed
  const percentage = total > 0 ? Math.round((passed / total) * 100) : 0

  log('\n╔══════════════════════════════════════════╗', 'blue')
  log('║           Test Summary                   ║', 'blue')
  log('╚══════════════════════════════════════════╝', 'blue')
  log(`\nTotal Tests: ${total}`)
  logSuccess(`Passed: ${passed}`)
  if (failed > 0) {
    logError(`Failed: ${failed}`)
  }
  log(`Success Rate: ${percentage}%\n`)

  if (failed === 0) {
    log('🎉 All tests passed!', 'green')
  } else {
    log('⚠️  Some tests failed. Check the output above for details.', 'yellow')
  }

  process.exit(failed > 0 ? 1 : 0)
}

// Handle errors
process.on('unhandledRejection', (error) => {
  logError(`Unhandled error: ${error.message}`)
  process.exit(1)
})

// Run tests
runTests().catch((error) => {
  logError(`Test suite failed: ${error.message}`)
  process.exit(1)
})
