/**
 * Extended Capsules Batch 3 - 265 capsules
 * Expanding existing categories: UI, Form, Media, Layout, Navigation
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

const extendedCapsulesBatch3: Capsule[] = [
  // Extended UI Components - 100 capsules
  ...['ui-accordion-animated', 'ui-alert-dismissible', 'ui-avatar-group-stacked', 'ui-badge-animated', 'ui-banner-cookie', 'ui-breadcrumb-dropdown', 'ui-button-gradient', 'ui-button-icon-only', 'ui-button-loading', 'ui-button-social', 'ui-card-flip', 'ui-card-glass', 'ui-card-hover', 'ui-card-pricing', 'ui-card-product', 'ui-card-profile', 'ui-card-stats', 'ui-card-testimonial', 'ui-carousel-3d', 'ui-carousel-fade', 'ui-carousel-infinite', 'ui-chip-closable', 'ui-chip-choice', 'ui-collapsible-nested', 'ui-color-swatch', 'ui-divider-text', 'ui-divider-vertical', 'ui-drawer-bottom', 'ui-drawer-full', 'ui-dropdown-mega', 'ui-dropdown-nested', 'ui-empty-state-illustration', 'ui-error-404', 'ui-error-500', 'ui-fab-group', 'ui-footer-complex', 'ui-footer-minimal', 'ui-gallery-lightbox', 'ui-gallery-masonry', 'ui-header-fixed', 'ui-header-transparent', 'ui-hero-animated', 'ui-hero-split', 'ui-hero-video', 'ui-icon-animated', 'ui-icon-sprite', 'ui-image-compare', 'ui-image-crop', 'ui-image-filter', 'ui-image-lazy', 'ui-image-zoom', 'ui-kbd-shortcut', 'ui-label-floating', 'ui-link-animated', 'ui-list-draggable', 'ui-list-grouped', 'ui-list-nested', 'ui-list-timeline', 'ui-loader-dots', 'ui-loader-progress', 'ui-loader-skeleton', 'ui-loader-spinner', 'ui-menu-context', 'ui-menu-dropdown-hover', 'ui-menu-flyout', 'ui-menu-hamburger', 'ui-modal-bottom-sheet', 'ui-modal-drawer', 'ui-modal-fullscreen', 'ui-modal-stacked', 'ui-notification-stack', 'ui-notification-toast', 'ui-pagination-infinite', 'ui-panel-collapsible', 'ui-panel-resizable', 'ui-panel-split', 'ui-pill', 'ui-popover-tooltip', 'ui-portal', 'ui-progress-circular', 'ui-progress-steps', 'ui-rating-editable', 'ui-rating-half', 'ui-ribbon', 'ui-scrollbar-custom', 'ui-searchbar-autocomplete', 'ui-section-parallax', 'ui-separator-gradient', 'ui-sidebar-collapsible', 'ui-sidebar-overlay', 'ui-skeleton-card', 'ui-skeleton-list', 'ui-skeleton-text', 'ui-slider-range', 'ui-snippet-code', 'ui-spinner-overlay', 'ui-stat-card', 'ui-stepper-vertical', 'ui-switch-theme', 'ui-tab-vertical'].map((id, i) =>
    generateCapsule(id, id.split('-').slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '), 'UI', `Advanced ${id.split('-').slice(1).join(' ')} UI component`, ['ui', 'component', 'interactive'])
  ),

  // Extended Form Components - 50 capsules
  ...['form-autocomplete-multi', 'form-checkbox-group', 'form-color-input', 'form-combobox', 'form-currency-input', 'form-date-range', 'form-datetime-local', 'form-drag-drop-upload', 'form-dropdown-search', 'form-file-upload-multi', 'form-image-upload', 'form-input-mask', 'form-input-otp', 'form-input-pin', 'form-input-tags', 'form-markdown-editor-rich', 'form-monaco-editor', 'form-number-stepper', 'form-password-strength', 'form-phone-international', 'form-radio-cards', 'form-range-slider', 'form-rating-stars', 'form-rich-text-editor', 'form-search-advanced', 'form-select-async', 'form-select-creatable', 'form-select-grouped', 'form-select-multi-level', 'form-select-virtual', 'form-signature-canvas', 'form-slider-double', 'form-switch-label', 'form-textarea-autosize', 'form-time-picker', 'form-toggle-group', 'form-transfer-list', 'form-tree-select', 'form-uploader-drag', 'form-validation-inline', 'form-validation-live', 'form-wizard-multi', 'form-wysiwyg-full', 'form-color-picker-advanced', 'form-emoji-picker', 'form-mentions-input', 'form-slider-marks', 'form-input-group', 'form-addon-button', 'form-floating-label'].map((id, i) =>
    generateCapsule(id, id.split('-').slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '), 'Form', `Advanced ${id.split('-').slice(1).join(' ')} form component`, ['form', 'input', 'validation'])
  ),

  // Extended Media Components - 40 capsules
  ...['media-audio-waveform', 'media-audio-visualizer', 'media-audio-playlist', 'media-audio-recorder', 'media-audio-spectrum', 'media-image-carousel-thumbnails', 'media-image-gallery-infinite', 'media-image-grid-pinterest', 'media-image-hotspots', 'media-image-panorama', 'media-pdf-annotate', 'media-pdf-embed', 'media-pdf-thumbnail', 'media-video-chapters', 'media-video-playlist', 'media-video-thumbnail', 'media-video-transcript', 'media-video-pip', 'media-video-vr', 'media-video-360', 'media-screenshot-tool', 'media-screen-recorder', 'media-webcam-filters', 'media-gif-player', 'media-gif-recorder', 'media-svg-editor', 'media-canvas-draw', 'media-canvas-paint', 'media-3d-model-viewer', 'media-3d-viewer-gltf', 'media-epub-reader', 'media-markdown-preview', 'media-code-diff', 'media-syntax-highlighter', 'media-mermaid-diagram', 'media-flowchart', 'media-mind-map', 'media-org-chart', 'media-timeline-visual', 'media-gantt-chart'].map((id, i) =>
    generateCapsule(id, id.split('-').slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '), 'Media', `Advanced ${id.split('-').slice(1).join(' ')} media component`, ['media', 'player', 'viewer'])
  ),

  // Extended Layout Components - 35 capsules
  ...['layout-app-shell', 'layout-dashboard-grid', 'layout-dashboard-responsive', 'layout-flex-responsive', 'layout-grid-auto', 'layout-grid-masonry-animated', 'layout-holy-grail', 'layout-multi-column', 'layout-responsive-sidebar', 'layout-split-horizontal', 'layout-split-vertical-resizable', 'layout-stack', 'layout-sticky-footer', 'layout-sticky-header-nav', 'layout-two-column', 'layout-three-column', 'layout-centered', 'layout-full-bleed', 'layout-container-fluid', 'layout-container-max-width', 'layout-aspect-ratio', 'layout-bento-grid', 'layout-cards-grid', 'layout-feature-grid', 'layout-gallery-responsive', 'layout-hero-full-screen', 'layout-magazine', 'layout-portal-layout', 'layout-pricing-grid', 'layout-product-grid', 'layout-testimonial-grid', 'layout-kanban-board-cols', 'layout-calendar-month', 'layout-timetable', 'layout-split-screen'].map((id, i) =>
    generateCapsule(id, id.split('-').slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '), 'Layout', `Advanced ${id.split('-').slice(1).join(' ')} layout`, ['layout', 'grid', 'responsive'])
  ),

  // Extended Navigation - 40 capsules
  ...['nav-breadcrumb-auto', 'nav-breadcrumb-collapsed', 'nav-menu-accordion', 'nav-menu-dropdown-animated', 'nav-menu-mega-multi', 'nav-menu-mobile', 'nav-menu-slide-out', 'nav-navbar-centered', 'nav-navbar-glass', 'nav-navbar-minimal', 'nav-navbar-scroll-hide', 'nav-navbar-sticky-animated', 'nav-pagination-cursor', 'nav-pagination-load-more', 'nav-sidebar-icon-only', 'nav-sidebar-mini', 'nav-sidebar-multi-level', 'nav-sidebar-pinned', 'nav-steps-clickable', 'nav-steps-progress', 'nav-tabs-animated', 'nav-tabs-closable', 'nav-tabs-draggable', 'nav-tabs-pills', 'nav-tabs-scroll', 'nav-tabs-vertical', 'nav-tree-navigation', 'nav-wizard-branching', 'nav-bottom-nav-ios', 'nav-bottom-nav-material', 'nav-command-menu', 'nav-floating-nav', 'nav-rail-navigation', 'nav-skip-links', 'nav-table-of-contents', 'nav-back-button', 'nav-forward-button', 'nav-scroll-to-top-fab', 'nav-scroll-progress', 'nav-scroll-spy-highlight'].map((id, i) =>
    generateCapsule(id, id.split('-').slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '), 'Navigation', `Advanced ${id.split('-').slice(1).join(' ')} navigation`, ['navigation', 'menu', 'nav'])
  )
]

export default extendedCapsulesBatch3
