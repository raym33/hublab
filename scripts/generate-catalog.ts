/**
 * Script to generate CAPSULES_CATALOG.json from all-capsules.ts
 */

import { writeFileSync } from 'fs';
import { join } from 'path';
import { allCapsules, getAllCategories } from '../lib/all-capsules';

const categories = getAllCategories();
const catalogCategories = categories
  .filter(cat => cat !== 'All')
  .map(cat => {
    const capsules = allCapsules.filter(c => c.category === cat);
    return {
      name: cat,
      id: cat.toLowerCase().replace(/\s+/g, '-'),
      count: capsules.length,
      sample_capsules: capsules.slice(0, 10).map(c => c.name)
    };
  })
  .filter(cat => cat.count > 0)
  .sort((a, b) => b.count - a.count);

const catalog = {
  metadata: {
    total_capsules: allCapsules.length,
    categories: categories.length - 1,
    last_updated: new Date().toISOString().split('T')[0],
    platform_url: 'https://hublab.dev',
    studio_url: 'https://hublab.dev/studio-v2',
    description: 'HubLab is a universal capsule compiler with 8,150+ production-ready React components across 65+ categories'
  },
  categories: catalogCategories,
  stats: {
    avg_capsules_per_category: Math.round(allCapsules.length / (categories.length - 1)),
    largest_category: catalogCategories[0]?.name || 'Unknown',
    largest_category_count: catalogCategories[0]?.count || 0,
    total_tags: new Set(allCapsules.flatMap(c => c.tags)).size
  }
};

const outputPath = join(__dirname, '..', 'docs', 'CAPSULES_CATALOG.json');
writeFileSync(outputPath, JSON.stringify(catalog, null, 2));

console.log(`✅ Generated catalog with ${catalog.metadata.total_capsules} capsules across ${catalog.metadata.categories} categories`);
console.log(`📊 Stats: ${catalog.stats.total_tags} unique tags, ${catalog.stats.avg_capsules_per_category} avg capsules/category`);
console.log(`📁 Saved to: ${outputPath}`);
