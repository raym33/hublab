/**
 * Test Script for GitHub to Capsule Conversion
 *
 * Run with: node test-github-conversion.js
 */

const testRepositories = [
  {
    name: 'OpenCut Video Editor',
    url: 'https://github.com/OpenCut-app/OpenCut',
    expectedCategory: 'Media',
    expectedEmbedType: 'iframe'
  },
  {
    name: 'shadcn/ui',
    url: 'https://github.com/shadcn-ui/ui',
    expectedCategory: 'UI',
    expectedEmbedType: 'npm-package'
  },
  {
    name: 'Recharts',
    url: 'https://github.com/recharts/recharts',
    expectedCategory: 'DataViz',
    expectedEmbedType: 'npm-package'
  }
]

async function testConversion(repo) {
  console.log(`\n🧪 Testing: ${repo.name}`)
  console.log(`   URL: ${repo.url}`)

  try {
    const response = await fetch('http://localhost:3000/api/github-to-capsule', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        repoUrl: repo.url
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.error || 'Conversion failed')
    }

    const { capsule, metadata } = data

    console.log(`   ✅ Conversion successful!`)
    console.log(`   📦 Capsule ID: ${capsule.id}`)
    console.log(`   🏷️  Category: ${capsule.category} (expected: ${repo.expectedCategory})`)
    console.log(`   🔧 Embed Type: ${metadata.embedType} (expected: ${repo.expectedEmbedType})`)
    console.log(`   ⭐ Stars: ${metadata.stars.toLocaleString()}`)
    console.log(`   📝 Language: ${metadata.language}`)
    console.log(`   📚 Dependencies: ${capsule.dependencies.length}`)
    console.log(`   💾 Code size: ${capsule.code.length.toLocaleString()} characters`)

    // Validate expected values
    if (capsule.category !== repo.expectedCategory) {
      console.log(`   ⚠️  Category mismatch! Got ${capsule.category}, expected ${repo.expectedCategory}`)
    }

    if (metadata.embedType !== repo.expectedEmbedType) {
      console.log(`   ⚠️  Embed type mismatch! Got ${metadata.embedType}, expected ${repo.expectedEmbedType}`)
    }

    return true
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`)
    return false
  }
}

async function runTests() {
  console.log('🚀 GitHub to Capsule Conversion - Test Suite')
  console.log('=' .repeat(60))

  let passed = 0
  let failed = 0

  for (const repo of testRepositories) {
    const success = await testConversion(repo)
    if (success) {
      passed++
    } else {
      failed++
    }

    // Wait a bit between requests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  console.log('\n' + '='.repeat(60))
  console.log(`📊 Results: ${passed} passed, ${failed} failed`)

  if (failed === 0) {
    console.log('🎉 All tests passed!')
  } else {
    console.log('⚠️  Some tests failed. Check the logs above.')
  }
}

// Only run if this script is executed directly
if (require.main === module) {
  console.log('⚠️  Make sure the development server is running!')
  console.log('   Run: npm run dev')
  console.log('')

  setTimeout(() => {
    runTests().catch(error => {
      console.error('Fatal error:', error)
      process.exit(1)
    })
  }, 2000)
}

module.exports = { testConversion, testRepositories }
