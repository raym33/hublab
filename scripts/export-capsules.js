const fs = require('fs');
const path = require('path');

// Import all capsule definitions
const { getAllCapsulesExtended } = require('../lib/capsules-v2/definitions-extended');

const capsules = getAllCapsulesExtended();

console.log(`📦 Exporting ${capsules.length} capsules...`);

let exportedCount = 0;
let skippedCount = 0;

capsules.forEach(capsule => {
  // Determine category folder
  const categoryMap = {
    'ui': 'ui',
    'chart': 'chart',
    'charts': 'chart',
    'form': 'form',
    'forms': 'form',
    'effect': 'effect',
    'effects': 'effect',
    'media': 'media',
    'ai-ml': 'ai-ml',
    'ai': 'ai-ml',
    'ml': 'ai-ml',
    'dataviz': 'dataviz',
    'data-viz': 'dataviz',
    'utilities': 'utilities',
    'utility': 'utilities',
    'advanced': 'advanced',
    'interaction': 'interaction'
  };

  const category = categoryMap[capsule.category.toLowerCase()] || 'utilities';

  // Create safe filename from capsule name
  const fileName = capsule.name
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9-]/g, '')
    .toLowerCase();

  const filePath = path.join(__dirname, '..', 'capsules', category, `${fileName}.tsx`);

  // Create component name (PascalCase)
  const componentName = capsule.name.replace(/\s+/g, '');

  // Extract the function code from capsule.code
  let functionCode = capsule.code.trim();

  // If the code doesn't start with 'function', try to extract it
  if (!functionCode.startsWith('function')) {
    // Remove any leading/trailing whitespace and newlines
    functionCode = functionCode.replace(/^\s+|\s+$/g, '');
  }

  // Build the full component file
  const fileContent = `'use client'

import React from 'react'

/**
 * ${capsule.name}
 * ${capsule.description}
 *
 * Category: ${capsule.category}
 *
 * Props:
${capsule.props.map(prop => ` * - ${prop.name} (${prop.type})${prop.required ? ' [required]' : ''}: ${prop.description || 'No description'}`).join('\n')}
 */

${functionCode}

export default ${componentName}
`;

  // Create directory if it doesn't exist
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Write file
  try {
    fs.writeFileSync(filePath, fileContent, 'utf8');
    exportedCount++;
    console.log(`✅ Exported: ${category}/${fileName}.tsx (${componentName})`);
  } catch (error) {
    skippedCount++;
    console.error(`❌ Error exporting ${capsule.name}:`, error.message);
  }
});

console.log(`\n✨ Export complete!`);
console.log(`📊 Statistics:`);
console.log(`   - Total capsules: ${capsules.length}`);
console.log(`   - Exported: ${exportedCount}`);
console.log(`   - Skipped/Errors: ${skippedCount}`);
