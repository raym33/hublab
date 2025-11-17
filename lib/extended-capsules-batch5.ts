/**
 * Extended Capsules Batch 5 - 200 capsules
 * Accessibility, Internationalization, Mobile, Performance, SEO/Marketing
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

const extendedCapsulesBatch5: Capsule[] = [
  // Accessibility - 40 capsules
  ...['a11y-screen-reader-only', 'a11y-skip-navigation', 'a11y-focus-trap', 'a11y-focus-visible', 'a11y-aria-live-region', 'a11y-aria-labels', 'a11y-aria-describedby', 'a11y-role-manager', 'a11y-keyboard-shortcuts', 'a11y-tab-index-manager', 'a11y-focus-management', 'a11y-roving-tabindex', 'a11y-dialog-aria', 'a11y-modal-trap-focus', 'a11y-combobox-aria', 'a11y-listbox-aria', 'a11y-menu-aria', 'a11y-tooltip-aria', 'a11y-accordion-aria', 'a11y-tabs-aria', 'a11y-landmarks', 'a11y-heading-structure', 'a11y-alt-text-validator', 'a11y-color-contrast-checker', 'a11y-focus-indicator', 'a11y-reduced-motion', 'a11y-high-contrast-mode', 'a11y-font-size-adjuster', 'a11y-dyslexia-font', 'a11y-text-spacing', 'a11y-link-purpose', 'a11y-form-errors-accessible', 'a11y-live-announcements', 'a11y-status-messages', 'a11y-error-summary', 'a11y-breadcrumb-nav', 'a11y-pagination-accessible', 'a11y-table-accessible', 'a11y-chart-accessible', 'a11y-video-captions'].map((id) =>
    generateCapsule(id, id.split('-').slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '), 'Utility', `Accessibility ${id.split('-').slice(1).join(' ')} component`, ['a11y', 'accessibility', 'wcag'])
  ),

  // Internationalization (i18n) - 40 capsules
  ...['i18n-language-switcher', 'i18n-locale-provider', 'i18n-translation-manager', 'i18n-namespace-loader', 'i18n-pluralization', 'i18n-number-formatter', 'i18n-currency-formatter', 'i18n-date-formatter', 'i18n-time-formatter', 'i18n-relative-time', 'i18n-rtl-support', 'i18n-text-direction', 'i18n-bidi-text', 'i18n-font-loader', 'i18n-locale-detector', 'i18n-browser-language', 'i18n-translation-keys', 'i18n-missing-translations', 'i18n-fallback-locale', 'i18n-interpolation', 'i18n-variables-formatter', 'i18n-html-translation', 'i18n-markdown-translation', 'i18n-dynamic-imports', 'i18n-lazy-loading', 'i18n-translation-cache', 'i18n-locale-storage', 'i18n-country-selector', 'i18n-timezone-selector', 'i18n-calendar-localization', 'i18n-address-format', 'i18n-phone-format', 'i18n-name-format', 'i18n-measurement-units', 'i18n-collation', 'i18n-sorting-locale', 'i18n-search-locale', 'i18n-autocomplete-locale', 'i18n-validation-messages', 'i18n-error-messages'].map((id) =>
    generateCapsule(id, id.split('-').slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '), 'Utility', `Internationalization ${id.split('-').slice(1).join(' ')} component`, ['i18n', 'localization', 'translation'])
  ),

  // Mobile Optimization - 40 capsules
  ...['mobile-bottom-sheet', 'mobile-action-sheet', 'mobile-tab-bar', 'mobile-navigation-bar', 'mobile-floating-button', 'mobile-swipe-actions', 'mobile-pull-refresh', 'mobile-infinite-scroll', 'mobile-skeleton-loader', 'mobile-shimmer-effect', 'mobile-ripple-effect', 'mobile-haptic-feedback', 'mobile-gesture-detector', 'mobile-swipe-carousel', 'mobile-snap-scroll', 'mobile-sticky-header', 'mobile-collapsing-toolbar', 'mobile-expandable-fab', 'mobile-bottom-navigation', 'mobile-drawer-menu', 'mobile-modal-bottom', 'mobile-toast-mobile', 'mobile-snackbar', 'mobile-banner-mobile', 'mobile-card-swipe', 'mobile-stepper-mobile', 'mobile-chip-input', 'mobile-segmented-control', 'mobile-toggle-switch', 'mobile-rating-mobile', 'mobile-picker-wheel', 'mobile-date-picker-mobile', 'mobile-time-picker-mobile', 'mobile-select-mobile', 'mobile-autocomplete-mobile', 'mobile-search-bar-mobile', 'mobile-filter-mobile', 'mobile-sort-mobile', 'mobile-list-mobile', 'mobile-grid-mobile'].map((id) =>
    generateCapsule(id, id.split('-').slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '), 'UI', `Mobile ${id.split('-').slice(1).join(' ')} component`, ['mobile', 'touch', 'responsive'])
  ),

  // Performance Optimization - 40 capsules
  ...['perf-lazy-component', 'perf-code-splitting', 'perf-dynamic-import', 'perf-bundle-analyzer', 'perf-tree-shaking', 'perf-dead-code-elimination', 'perf-minification', 'perf-compression', 'perf-gzip', 'perf-brotli', 'perf-image-optimization', 'perf-responsive-images', 'perf-webp-converter', 'perf-avif-converter', 'perf-lazy-loading-images', 'perf-blur-placeholder', 'perf-lqip', 'perf-progressive-images', 'perf-cdn-integration', 'perf-cache-strategy', 'perf-service-worker', 'perf-offline-cache', 'perf-preload-links', 'perf-prefetch-links', 'perf-dns-prefetch', 'perf-preconnect', 'perf-resource-hints', 'perf-critical-css', 'perf-inline-css', 'perf-async-css', 'perf-defer-scripts', 'perf-async-scripts', 'perf-web-workers', 'perf-virtual-scrolling', 'perf-windowing', 'perf-pagination-optimized', 'perf-debounce-util', 'perf-throttle-util', 'perf-memoization', 'perf-react-memo'].map((id) =>
    generateCapsule(id, id.split('-').slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '), 'Utility', `Performance ${id.split('-').slice(1).join(' ')} optimization`, ['performance', 'optimization', 'speed'])
  ),

  // SEO & Marketing - 40 capsules
  ...['seo-meta-tags', 'seo-open-graph', 'seo-twitter-cards', 'seo-structured-data', 'seo-schema-org', 'seo-json-ld', 'seo-canonical-url', 'seo-robots-meta', 'seo-sitemap-generator', 'seo-robots-txt', 'seo-hreflang-tags', 'seo-breadcrumb-schema', 'seo-article-schema', 'seo-product-schema', 'seo-faq-schema', 'seo-review-schema', 'seo-rating-schema', 'seo-video-schema', 'seo-image-alt-optimizer', 'seo-heading-structure', 'seo-internal-linking', 'seo-anchor-text', 'seo-404-handler', 'seo-301-redirects', 'seo-url-structure', 'seo-slug-generator', 'seo-keyword-density', 'seo-readability-score', 'seo-content-analysis', 'marketing-analytics-tracker', 'marketing-gtm-integration', 'marketing-ga4-events', 'marketing-facebook-pixel', 'marketing-linkedin-insight', 'marketing-pinterest-tag', 'marketing-tiktok-pixel', 'marketing-conversion-tracking', 'marketing-utm-builder', 'marketing-campaign-tracker', 'marketing-ab-testing'].map((id) =>
    generateCapsule(id, id.split('-').slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '), 'Utility', `${id.split('-')[0].toUpperCase()} ${id.split('-').slice(1).join(' ')} component`, ['seo', 'marketing', 'analytics'])
  )
]

export default extendedCapsulesBatch5
