/**
 * TypeScript Benchmark Script
 *
 * Equivalent benchmarks to Rust implementation for performance comparison
 */

import { allCapsules } from '../lib/all-capsules';
import type { Capsule } from '../types/capsule';

interface BenchmarkResult {
  name: string;
  avgTime: number;
  minTime: number;
  maxTime: number;
  iterations: number;
}

class Benchmark {
  private results: BenchmarkResult[] = [];

  async run(name: string, fn: () => void | Promise<void>, iterations: number = 100): Promise<void> {
    const times: number[] = [];

    // Warm-up
    for (let i = 0; i < 10; i++) {
      await fn();
    }

    // Actual benchmark
    for (let i = 0; i < iterations; i++) {
      const start = performance.now();
      await fn();
      const end = performance.now();
      times.push(end - start);
    }

    const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);

    this.results.push({
      name,
      avgTime,
      minTime,
      maxTime,
      iterations,
    });

    console.log(`✓ ${name}: ${avgTime.toFixed(2)}ms avg (${minTime.toFixed(2)}ms - ${maxTime.toFixed(2)}ms)`);
  }

  getResults(): BenchmarkResult[] {
    return this.results;
  }

  printSummary(): void {
    console.log('\n' + '='.repeat(80));
    console.log('BENCHMARK SUMMARY');
    console.log('='.repeat(80));
    console.log('\n');

    for (const result of this.results) {
      console.log(`${result.name.padEnd(50)} ${result.avgTime.toFixed(2)}ms`);
    }
  }
}

// Simple search implementation (similar to Rust)
function searchCapsules(
  capsules: Capsule[],
  query: string,
  category?: string,
  tags?: string[],
  limit: number = 20,
  offset: number = 0
): Capsule[] {
  const queryLower = query.toLowerCase();

  let results = capsules.filter((capsule) => {
    // Text matching
    const matchesQuery =
      !query ||
      capsule.name.toLowerCase().includes(queryLower) ||
      capsule.description?.toLowerCase().includes(queryLower) ||
      capsule.tags?.some((tag) => tag.toLowerCase().includes(queryLower)) ||
      capsule.category.toLowerCase().includes(queryLower);

    if (!matchesQuery) return false;

    // Category filter
    if (category && capsule.category !== category) return false;

    // Tags filter
    if (tags && tags.length > 0) {
      const capsuleTags = capsule.tags?.map((t) => t.toLowerCase()) || [];
      const hasAllTags = tags.every((tag) =>
        capsuleTags.some((t) => t.includes(tag.toLowerCase()))
      );
      if (!hasAllTags) return false;
    }

    return true;
  });

  // Score and sort
  results = results
    .map((capsule) => {
      let score = 0;
      const nameLower = capsule.name.toLowerCase();
      const descLower = capsule.description?.toLowerCase() || '';

      if (nameLower === queryLower) score += 100;
      else if (nameLower.includes(queryLower)) score += 50;

      if (descLower.includes(queryLower)) score += 10;

      return { capsule, score };
    })
    .sort((a, b) => b.score - a.score)
    .map(({ capsule }) => capsule);

  return results.slice(offset, offset + limit);
}

// Fuzzy search (simple Levenshtein distance)
function levenshtein(a: string, b: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

function fuzzySearchCapsules(
  capsules: Capsule[],
  query: string,
  threshold: number = 0.7,
  limit: number = 20
): Capsule[] {
  const queryLower = query.toLowerCase();

  const results = capsules
    .map((capsule) => {
      const nameLower = capsule.name.toLowerCase();
      const distance = levenshtein(queryLower, nameLower);
      const maxLen = Math.max(queryLower.length, nameLower.length);
      const similarity = 1 - distance / maxLen;

      return { capsule, similarity };
    })
    .filter(({ similarity }) => similarity >= threshold)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit)
    .map(({ capsule }) => capsule);

  return results;
}

// Run benchmarks
async function main() {
  console.log('🔍 TypeScript Search Engine Benchmarks\n');
  console.log(`Dataset size: ${allCapsules.length} capsules\n`);

  const bench = new Benchmark();

  // Index creation (simulate by cloning array)
  await bench.run('index_creation_8150', () => {
    const _ = [...allCapsules];
  }, 100);

  // Exact search benchmarks
  await bench.run('search_8150_exact', () => {
    searchCapsules(allCapsules, 'Test Capsule');
  }, 100);

  await bench.run('search_with_category_filter', () => {
    searchCapsules(allCapsules, 'capsule', 'UI Components');
  }, 100);

  await bench.run('search_with_tags_filter', () => {
    searchCapsules(allCapsules, 'capsule', undefined, ['button']);
  }, 100);

  // Fuzzy search
  await bench.run('search_8150_fuzzy', () => {
    fuzzySearchCapsules(allCapsules, 'Tst Capsul', 0.7);
  }, 50); // Fewer iterations as fuzzy is slower

  // Real data searches
  await bench.run('search_real_data_common_term', () => {
    searchCapsules(allCapsules, 'button');
  }, 100);

  await bench.run('search_real_data_rare_term', () => {
    searchCapsules(allCapsules, 'authentication');
  }, 100);

  await bench.run('fuzzy_search_real_data', () => {
    fuzzySearchCapsules(allCapsules, 'dashbord', 0.7);
  }, 50);

  // Pagination benchmarks
  await bench.run('paginated_search_offset_0', () => {
    searchCapsules(allCapsules, 'capsule', undefined, undefined, 20, 0);
  }, 100);

  await bench.run('paginated_search_offset_100', () => {
    searchCapsules(allCapsules, 'capsule', undefined, undefined, 20, 100);
  }, 100);

  await bench.run('paginated_search_offset_500', () => {
    searchCapsules(allCapsules, 'capsule', undefined, undefined, 20, 500);
  }, 100);

  // Print summary
  bench.printSummary();

  // Export results as JSON
  const results = bench.getResults();
  console.log('\n\nJSON Results:\n');
  console.log(JSON.stringify(results, null, 2));
}

main().catch(console.error);
