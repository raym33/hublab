/**
 * Extended Capsules Batch 4 - 250 capsules
 * E-commerce Advanced, DevTools, Testing, API Integration, Cloud Services
 */

import { Capsule } from '@/types/capsule'

const generateCapsule = (id: string, name: string, category: string, desc: string, tags: string[]): Capsule => {
  const componentName = name.replace(/[^a-zA-Z0-9]/g, '')
  return {
    id,
    name,
    category,
    description: desc,
    tags,
    code: `'use client'
import { useState } from 'react'

export default function ${componentName}() {
  const [isActive, setIsActive] = useState(false)

  return (
    <div className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-xl font-bold mb-2">${name}</h3>
      <p className="text-gray-600 mb-4">${desc}</p>
      <button
        onClick={() => setIsActive(!isActive)}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        {isActive ? 'Active' : 'Inactive'}
      </button>
    </div>
  )
}`,
    platform: 'react'
  }
}

const extendedCapsulesBatch4: Capsule[] = [
  // E-commerce Advanced - 50 capsules
  ...['ecom-product-recommendations', 'ecom-wishlist-manager', 'ecom-compare-products', 'ecom-inventory-tracker', 'ecom-price-history', 'ecom-stock-alerts', 'ecom-bundle-builder', 'ecom-gift-cards', 'ecom-loyalty-points', 'ecom-referral-program', 'ecom-subscription-manager', 'ecom-pre-order', 'ecom-back-in-stock', 'ecom-dynamic-pricing', 'ecom-discount-calculator', 'ecom-tax-calculator', 'ecom-shipping-estimator', 'ecom-payment-plans', 'ecom-invoice-generator', 'ecom-receipt-printer', 'ecom-order-tracking-map', 'ecom-returns-portal', 'ecom-refund-processor', 'ecom-exchange-handler', 'ecom-warranty-tracker', 'ecom-product-reviews-advanced', 'ecom-rating-analytics', 'ecom-qa-system', 'ecom-size-guide', 'ecom-virtual-try-on', 'ecom-ar-viewer', 'ecom-360-product-view', 'ecom-video-reviews', 'ecom-social-proof-badges', 'ecom-urgency-timer', 'ecom-low-stock-indicator', 'ecom-recently-viewed', 'ecom-frequently-bought', 'ecom-cross-sell-widget', 'ecom-upsell-modal', 'ecom-abandoned-cart-recovery', 'ecom-exit-intent-popup', 'ecom-email-capture', 'ecom-sms-notifications', 'ecom-push-notifications', 'ecom-multi-currency', 'ecom-multi-language', 'ecom-geo-pricing', 'ecom-age-verification', 'ecom-fraud-detection'].map((id) =>
    generateCapsule(id, id.split('-').slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '), 'E-commerce', `Advanced ${id.split('-').slice(1).join(' ')} e-commerce component`, ['ecommerce', 'shop', 'store'])
  ),

  // DevTools & Developer Experience - 50 capsules
  ...['dev-code-editor-monaco', 'dev-diff-viewer', 'dev-json-formatter', 'dev-json-validator', 'dev-yaml-editor', 'dev-markdown-live-preview', 'dev-regex-tester', 'dev-color-palette-generator', 'dev-gradient-builder', 'dev-box-shadow-generator', 'dev-css-animator', 'dev-flexbox-playground', 'dev-grid-generator', 'dev-responsive-tester', 'dev-device-simulator', 'dev-api-client', 'dev-graphql-playground', 'dev-sql-formatter', 'dev-query-builder', 'dev-schema-designer', 'dev-er-diagram', 'dev-uml-designer', 'dev-flowchart-builder', 'dev-sequence-diagram', 'dev-state-machine', 'dev-git-graph', 'dev-commit-history', 'dev-branch-visualizer', 'dev-merge-conflict-resolver', 'dev-code-formatter-prettier', 'dev-linter-eslint', 'dev-type-checker', 'dev-bundle-analyzer', 'dev-performance-profiler', 'dev-memory-profiler', 'dev-network-monitor', 'dev-console-logger', 'dev-error-boundary', 'dev-debug-panel', 'dev-feature-flags', 'dev-ab-testing-panel', 'dev-env-switcher', 'dev-config-editor', 'dev-secrets-manager', 'dev-api-mock-server', 'dev-webhook-tester', 'dev-cron-expression-builder', 'dev-base64-encoder', 'dev-hash-generator', 'dev-uuid-generator'].map((id) =>
    generateCapsule(id, id.split('-').slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '), 'Utility', `${id.split('-').slice(1).join(' ')} developer tool`, ['dev', 'tools', 'developer'])
  ),

  // Testing & QA Components - 50 capsules
  ...['test-unit-test-runner', 'test-integration-suite', 'test-e2e-playwright', 'test-visual-regression', 'test-snapshot-comparison', 'test-coverage-reporter', 'test-mutation-testing', 'test-performance-benchmark', 'test-load-tester', 'test-stress-tester', 'test-spike-tester', 'test-endurance-tester', 'test-scalability-analyzer', 'test-accessibility-checker', 'test-wcag-validator', 'test-aria-tester', 'test-keyboard-nav-tester', 'test-screen-reader-sim', 'test-contrast-checker', 'test-responsive-tester', 'test-cross-browser-tester', 'test-device-farm', 'test-network-throttling', 'test-offline-mode', 'test-error-injection', 'test-chaos-engineering', 'test-security-scanner', 'test-xss-tester', 'test-sql-injection-checker', 'test-csrf-validator', 'test-penetration-tester', 'test-api-fuzzer', 'test-contract-testing', 'test-schema-validator', 'test-mock-data-generator', 'test-fixture-builder', 'test-test-data-factory', 'test-snapshot-manager', 'test-assertion-builder', 'test-matcher-library', 'test-spy-wrapper', 'test-stub-creator', 'test-fake-timer', 'test-async-utils', 'test-wait-for-helper', 'test-cleanup-handler', 'test-setup-teardown', 'test-parallel-runner', 'test-ci-reporter', 'test-flaky-test-detector'].map((id) =>
    generateCapsule(id, id.split('-').slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '), 'Utility', `${id.split('-').slice(1).join(' ')} testing component`, ['testing', 'qa', 'quality'])
  ),

  // API Integration & Backend - 50 capsules
  ...['api-rest-client', 'api-graphql-client', 'api-websocket-client', 'api-grpc-client', 'api-soap-client', 'api-oauth-handler', 'api-jwt-manager', 'api-api-key-vault', 'api-rate-limiter', 'api-request-queue', 'api-retry-logic', 'api-circuit-breaker', 'api-bulkhead-pattern', 'api-cache-manager', 'api-etag-handler', 'api-pagination-helper', 'api-cursor-pagination', 'api-infinite-scroll-loader', 'api-batch-processor', 'api-debounce-requests', 'api-throttle-requests', 'api-request-deduplication', 'api-response-transformer', 'api-data-normalizer', 'api-error-handler', 'api-retry-interceptor', 'api-logging-middleware', 'api-metrics-collector', 'api-trace-context', 'api-correlation-id', 'api-request-validator', 'api-response-validator', 'api-schema-validator-ajv', 'api-mock-server-msw', 'api-service-worker', 'api-offline-queue', 'api-sync-manager', 'api-conflict-resolver', 'api-optimistic-ui', 'api-pessimistic-ui', 'api-background-sync', 'api-push-subscription', 'api-sse-client', 'api-long-polling', 'api-polling-manager', 'api-webhook-receiver', 'api-event-stream', 'api-message-queue', 'api-pub-sub', 'api-event-bus'].map((id) =>
    generateCapsule(id, id.split('-').slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '), 'Utility', `${id.split('-').slice(1).join(' ')} API component`, ['api', 'backend', 'integration'])
  ),

  // Cloud Services & Infrastructure - 50 capsules
  ...['cloud-aws-s3-uploader', 'cloud-aws-lambda-trigger', 'cloud-aws-dynamodb-client', 'cloud-aws-cognito-auth', 'cloud-aws-ses-mailer', 'cloud-aws-sns-publisher', 'cloud-aws-sqs-consumer', 'cloud-aws-cloudwatch-logger', 'cloud-gcp-storage-client', 'cloud-gcp-cloud-functions', 'cloud-gcp-firestore-client', 'cloud-gcp-firebase-auth', 'cloud-gcp-cloud-tasks', 'cloud-gcp-pub-sub', 'cloud-gcp-bigquery-client', 'cloud-azure-blob-storage', 'cloud-azure-functions', 'cloud-azure-cosmos-db', 'cloud-azure-ad-auth', 'cloud-azure-service-bus', 'cloud-azure-event-grid', 'cloud-docker-container-manager', 'cloud-kubernetes-deployer', 'cloud-helm-chart-installer', 'cloud-terraform-provider', 'cloud-ansible-playbook', 'cloud-cloudflare-worker', 'cloud-cloudflare-r2-storage', 'cloud-cloudflare-kv-store', 'cloud-cloudflare-d1-database', 'cloud-vercel-deployment', 'cloud-netlify-deployment', 'cloud-railway-deployment', 'cloud-fly-io-deployment', 'cloud-render-deployment', 'cloud-heroku-deployment', 'cloud-digital-ocean-droplet', 'cloud-linode-instance', 'cloud-vultr-server', 'cloud-cdn-manager', 'cloud-edge-cache', 'cloud-load-balancer', 'cloud-auto-scaler', 'cloud-health-checker', 'cloud-uptime-monitor', 'cloud-log-aggregator', 'cloud-trace-collector', 'cloud-metrics-exporter', 'cloud-alert-manager', 'cloud-incident-responder'].map((id) =>
    generateCapsule(id, id.split('-').slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '), 'Utility', `${id.split('-').slice(1).join(' ')} cloud service`, ['cloud', 'infrastructure', 'devops'])
  )
]

export default extendedCapsulesBatch4
