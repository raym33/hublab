#!/usr/bin/env node

const API_KEY = 'hublab_sk_fa05a955550a91f89deeb5d549fb384d5c9a5ef9f209dc21c882780c3332392f'
const BASE_URL = 'https://hublab.dev/api/v1'

console.log('🧪 Testing HubLab Production API...\n')
console.log(`Base URL: ${BASE_URL}`)
console.log(`API Key: ${API_KEY.substring(0, 20)}...\n`)

async function test() {
  try {
    // Test 1: List themes
    console.log('1️⃣ Testing GET /themes')
    const themesRes = await fetch(`${BASE_URL}/themes`, {
      headers: { 'Authorization': `Bearer ${API_KEY}` }
    })
    const themesData = await themesRes.json()

    if (themesRes.ok) {
      console.log(`   ✅ Success! Found ${themesData.data?.themes?.length || 0} themes`)
      console.log(`   Themes: ${themesData.data?.themes?.map(t => t.name).join(', ')}\n`)
    } else {
      console.log(`   ❌ Failed: ${themesData.error?.message}`)
      console.log(`   This is expected if you haven't executed the SQL yet!\n`)
      console.log(`   👉 Execute the SQL in: /Users/c/hublab/lib/api/production-setup.sql\n`)
      return
    }

    // Test 2: Create a project
    console.log('2️⃣ Testing POST /projects')
    const createRes = await fetch(`${BASE_URL}/projects`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'Test Dashboard',
        template: 'dashboard',
        theme: {
          name: 'modern-blue',
          colors: {
            primary: '#3B82F6',
            secondary: '#10B981'
          }
        }
      })
    })
    const createData = await createRes.json()

    if (createRes.ok) {
      const projectId = createData.data?.project?.id
      console.log(`   ✅ Success! Created project: ${projectId}`)
      console.log(`   Name: ${createData.data?.project?.name}`)
      console.log(`   Template: ${createData.data?.project?.template}\n`)

      // Test 3: Get the project
      console.log('3️⃣ Testing GET /projects/:id')
      const getRes = await fetch(`${BASE_URL}/projects/${projectId}`, {
        headers: { 'Authorization': `Bearer ${API_KEY}` }
      })
      const getData = await getRes.json()

      if (getRes.ok) {
        console.log(`   ✅ Success! Retrieved project details`)
        console.log(`   Status: ${getData.data?.project?.status}\n`)
      } else {
        console.log(`   ❌ Failed: ${getData.error?.message}\n`)
      }

      // Test 4: List all projects
      console.log('4️⃣ Testing GET /projects')
      const listRes = await fetch(`${BASE_URL}/projects`, {
        headers: { 'Authorization': `Bearer ${API_KEY}` }
      })
      const listData = await listRes.json()

      if (listRes.ok) {
        console.log(`   ✅ Success! Found ${listData.data?.projects?.length || 0} projects\n`)
      } else {
        console.log(`   ❌ Failed: ${listData.error?.message}\n`)
      }

    } else {
      console.log(`   ❌ Failed: ${createData.error?.message}`)
      if (createData.error?.message?.includes('relation "projects" does not exist')) {
        console.log(`\n   👉 The 'projects' table doesn't exist yet!`)
        console.log(`   Execute the SQL in: /Users/c/hublab/lib/api/production-setup.sql\n`)
      }
      return
    }

    console.log('🎉 Production API is working perfectly!\n')
    console.log('Next steps:')
    console.log('1. Install ChatGPT plugin: https://hublab.dev')
    console.log('2. Publish SDK to NPM: cd sdk/typescript && npm publish')
    console.log('3. Share your API with the world! 🚀\n')

  } catch (error) {
    console.log(`❌ Error: ${error.message}`)
    console.log(`\nThis usually means:`)
    console.log(`- The production site is not accessible`)
    console.log(`- Network connection issue`)
    console.log(`- CORS issue (shouldn't happen with API routes)\n`)
  }
}

test()
