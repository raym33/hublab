import { allCapsules } from '../lib/all-capsules'
import fs from 'fs'
import path from 'path'

console.log('🚀 Exporting HubLab capsules to Rust engine...')
console.log(`📊 Total capsules: ${allCapsules.length}`)

// Export to hublab-rust directory
const outputPath = path.join(__dirname, '../../hublab-rust/capsules.json')

fs.writeFileSync(
  outputPath,
  JSON.stringify(allCapsules, null, 2)
)

console.log(`✅ Exported to: ${outputPath}`)
console.log(`📦 File size: ${(fs.statSync(outputPath).size / 1024 / 1024).toFixed(2)} MB`)

// Stats
const categories = new Set(allCapsules.map(c => c.category))
const tags = new Set(allCapsules.flatMap(c => c.tags))

console.log('\n📈 Statistics:')
console.log(`   - Capsules: ${allCapsules.length}`)
console.log(`   - Categories: ${categories.size}`)
console.log(`   - Unique tags: ${tags.size}`)
console.log('\n🎯 Ready for Rust engine!')
