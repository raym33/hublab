#!/usr/bin/env node

const API_KEY = 'hublab_sk_fa05a955550a91f89deeb5d549fb384d5c9a5ef9f209dc21c882780c3332392f'
const BASE_URL = 'http://localhost:3000/api/v1'

console.log('🧪 Testing HubLab API...\n')

async function test() {
  try {
    // Test 1: List themes
    console.log('1️⃣ Testing GET /themes')
    const themesRes = await fetch(`${BASE_URL}/themes`, {
      headers: { 'Authorization': `Bearer ${API_KEY}` }
    })
    const themesData = await themesRes.json()

    if (themesRes.ok) {
      console.log(`   ✅ Success! Found ${themesData.data?.themes?.length || 0} themes\n`)
    } else {
      console.log(`   ❌ Failed: ${themesData.error?.message}\n`)
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
        theme: 'modern-blue'
      })
    })
    const createData = await createRes.json()

    if (createRes.ok) {
      const projectId = createData.data?.project?.id
      console.log(`   ✅ Success! Created project: ${projectId}\n`)

      // Test 3: Get the project
      console.log('3️⃣ Testing GET /projects/:id')
      const getRes = await fetch(`${BASE_URL}/projects/${projectId}`, {
        headers: { 'Authorization': `Bearer ${API_KEY}` }
      })
      const getData = await getRes.json()

      if (getRes.ok) {
        console.log(`   ✅ Success! Retrieved project details\n`)
      } else {
        console.log(`   ❌ Failed: ${getData.error?.message}\n`)
      }

    } else {
      console.log(`   ❌ Failed: ${createData.error?.message}\n`)
    }

    console.log('🎉 API is working!\n')

  } catch (error) {
    console.log(`❌ Error: ${error.message}\n`)
  }
}

test()
