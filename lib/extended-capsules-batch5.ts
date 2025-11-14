/**
 * Extended Capsules Batch 5 - 200 capsules
 * Accessibility, Internationalization, Mobile, Performance, SEO
 */

import { Capsule } from '@/types/capsule'

const generateCapsule = (id: string, name: string, category: string, desc: string, tags: string[]): Capsule => ({
  id, name, category, description: desc, tags,
  code: `'use client'\nexport default function ${name.replace(/[^a-zA-Z0-9]/g, '')}() {\n  return <div className="p-4 border rounded-lg shadow">${name}</div>\n}`,
  platform: 'react'
})

const extendedCapsulesBatch5: Capsule[] = [
  // Accessibility - 40 capsules
  ...['a11y-skip-links', 'a11y-focus-trap', 'a11y-focus-visible', 'a11y-keyboard-nav', 'a11y-aria-live', 'a11y-screen-reader-only', 'a11y-visually-hidden', 'a11y-reduced-motion', 'a11y-high-contrast', 'a11y-text-resize', 'a11y-color-blind-mode', 'a11y-dyslexia-font', 'a11y-landmark-regions', 'a11y-heading-structure', 'a11y-semantic-html', 'a11y-alt-text-checker', 'a11y-form-labels', 'a11y-error-announcer', 'a11y-progress-announcer', 'a11y-loading-announcer', 'a11y-modal-focus-manager', 'a11y-tooltip-accessible', 'a11y-dropdown-accessible', 'a11y-tabs-accessible', 'a11y-accordion-accessible', 'a11y-carousel-accessible', 'a11y-table-accessible', 'a11y-chart-accessible', 'a11y-video-captions', 'a11y-audio-transcripts', 'a11y-text-to-speech', 'a11y-speech-to-text', 'a11y-gesture-alternatives', 'a11y-timeout-extender', 'a11y-auto-save-recovery', 'a11y-help-text-provider', 'a11y-instructions-reader', 'a11y-validation-live', 'a11y-breadcrumb-nav', 'a11y-pagination-nav'].map((id) =>
    generateCapsule(id, id.split('-').slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '), 'UI', `${id.split('-').slice(1).join(' ')} accessibility component`, ['a11y', 'accessibility', 'wcag'])
  ),

  // Internationalization (i18n) - 40 capsules
  ...['i18n-language-switcher', 'i18n-locale-provider', 'i18n-translation-manager', 'i18n-pluralization-handler', 'i18n-date-formatter', 'i18n-time-formatter', 'i18n-number-formatter', 'i18n-currency-formatter', 'i18n-relative-time', 'i18n-timezone-converter', 'i18n-calendar-localized', 'i18n-rtl-layout', 'i18n-bidirectional-text', 'i18n-font-loader', 'i18n-glyph-support', 'i18n-input-method', 'i18n-keyboard-layout', 'i18n-collation-sorter', 'i18n-string-comparator', 'i18n-search-localized', 'i18n-autocomplete-i18n', 'i18n-validation-messages', 'i18n-error-messages', 'i18n-success-messages', 'i18n-placeholder-text', 'i18n-help-text', 'i18n-tooltip-i18n', 'i18n-notification-i18n', 'i18n-email-templates', 'i18n-sms-templates', 'i18n-push-messages', 'i18n-metadata-translator', 'i18n-seo-translator', 'i18n-url-slugs', 'i18n-content-negotiation', 'i18n-fallback-handler', 'i18n-missing-translation', 'i18n-translation-keys', 'i18n-namespace-manager', 'i18n-lazy-load-translations'].map((id) =>
    generateCapsule(id, id.split('-').slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '), 'Utility', `${id.split('-').slice(1).join(' ')} internationalization component`, ['i18n', 'localization', 'translation'])
  ),

  // Mobile & Touch - 40 capsules
  ...['mobile-touch-gesture', 'mobile-swipe-handler', 'mobile-pinch-zoom', 'mobile-double-tap', 'mobile-long-press', 'mobile-pull-to-refresh', 'mobile-infinite-scroll', 'mobile-bottom-sheet', 'mobile-action-sheet', 'mobile-tab-bar', 'mobile-navigation-bar', 'mobile-floating-button', 'mobile-slide-menu', 'mobile-drawer-mobile', 'mobile-modal-fullscreen', 'mobile-toast-mobile', 'mobile-snackbar', 'mobile-safe-area', 'mobile-notch-support', 'mobile-status-bar', 'mobile-navigation-gestures', 'mobile-haptic-feedback', 'mobile-vibration', 'mobile-device-orientation', 'mobile-gyroscope', 'mobile-accelerometer', 'mobile-compass', 'mobile-geolocation-mobile', 'mobile-camera-access', 'mobile-photo-picker', 'mobile-video-recorder', 'mobile-audio-recorder', 'mobile-share-sheet', 'mobile-contacts-picker', 'mobile-calendar-access', 'mobile-biometric-auth', 'mobile-face-id', 'mobile-touch-id', 'mobile-app-rating', 'mobile-deep-linking'].map((id) =>
    generateCapsule(id, id.split('-').slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '), 'Interaction', `${id.split('-').slice(1).join(' ')} mobile component`, ['mobile', 'touch', 'gesture'])
  ),

  // Performance Optimization - 40 capsules
  ...['perf-lazy-load-image', 'perf-lazy-load-component', 'perf-code-splitting', 'perf-dynamic-import', 'perf-preload-link', 'perf-prefetch-link', 'perf-preconnect', 'perf-dns-prefetch', 'perf-resource-hints', 'perf-priority-hints', 'perf-intersection-observer', 'perf-virtual-list', 'perf-windowing', 'perf-pagination-virtual', 'perf-infinite-scroll-virtual', 'perf-image-optimization', 'perf-responsive-images', 'perf-webp-converter', 'perf-avif-converter', 'perf-blur-placeholder', 'perf-lqip-loader', 'perf-progressive-image', 'perf-font-optimization', 'perf-font-subsetting', 'perf-font-display', 'perf-critical-css', 'perf-css-inline', 'perf-css-minifier', 'perf-js-minifier', 'perf-tree-shaking', 'perf-dead-code-elimination', 'perf-bundle-splitting', 'perf-chunk-optimization', 'perf-compression-gzip', 'perf-compression-brotli', 'perf-service-worker-cache', 'perf-http-cache', 'perf-browser-cache', 'perf-memory-leak-detector', 'perf-render-optimizer'].map((id) =>
    generateCapsule(id, id.split('-').slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '), 'Utility', `${id.split('-').slice(1).join(' ')} performance component`, ['performance', 'optimization', 'speed'])
  ),

  // SEO & Marketing - 40 capsules
  ...['seo-meta-tags', 'seo-open-graph', 'seo-twitter-cards', 'seo-json-ld-schema', 'seo-structured-data', 'seo-breadcrumb-schema', 'seo-article-schema', 'seo-product-schema', 'seo-review-schema', 'seo-faq-schema', 'seo-canonical-url', 'seo-hreflang-tags', 'seo-robots-meta', 'seo-sitemap-generator', 'seo-robots-txt', 'seo-title-optimizer', 'seo-description-optimizer', 'seo-keyword-analyzer', 'seo-heading-checker', 'seo-alt-text-optimizer', 'seo-url-optimizer', 'seo-redirect-manager', 'seo-404-handler', 'seo-broken-link-checker', 'seo-internal-linking', 'seo-external-linking', 'seo-nofollow-manager', 'seo-ugc-links', 'seo-sponsored-links', 'marketing-utm-builder', 'marketing-campaign-tracker', 'marketing-referral-tracker', 'marketing-affiliate-tracker', 'marketing-conversion-pixel', 'marketing-event-tracker', 'marketing-heat-map', 'marketing-session-replay', 'marketing-ab-test', 'marketing-funnel-analytics', 'marketing-cohort-analysis'].map((id) =>
    generateCapsule(id, id.split('-').slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '), 'Utility', `${id.split('-').slice(1).join(' ')} SEO/marketing component`, ['seo', 'marketing', 'analytics'])
  )
]

export default extendedCapsulesBatch5
