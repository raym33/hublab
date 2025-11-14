/**
 * Extended Capsules Batch 7 - 200 capsules
 * AR/VR, 3D Graphics, WebGL, Audio Processing
 */

import { Capsule } from '@/types/capsule'

const generateCapsule = (id: string, name: string, category: string, desc: string, tags: string[]): Capsule => ({
  id, name, category, description: desc, tags,
  code: `'use client'\nexport default function ${name.replace(/[^a-zA-Z0-9]/g, '')}() {\n  return <div className="p-4 border rounded-lg shadow">${name}</div>\n}`,
  platform: 'react'
})

const extendedCapsulesBatch7: Capsule[] = [
  // AR/VR & XR - 50 capsules
  ...['ar-marker-tracker', 'ar-image-target', 'ar-face-tracking', 'ar-hand-tracking', 'ar-body-tracking', 'ar-plane-detection', 'ar-surface-detection', 'ar-depth-sensing', 'ar-occlusion-mask', 'ar-lighting-estimation', 'ar-3d-object-placement', 'ar-virtual-try-on-ar', 'ar-furniture-preview', 'ar-product-viewer-ar', 'ar-navigation-arrows', 'ar-wayfinding', 'ar-location-based', 'ar-geo-anchors', 'ar-world-tracking', 'ar-slam-system', 'vr-scene-viewer', 'vr-360-viewer', 'vr-panorama-viewer', 'vr-stereoscopic-render', 'vr-headset-controller', 'vr-hand-controller', 'vr-gaze-pointer', 'vr-teleportation', 'vr-locomotion-system', 'vr-comfort-vignette', 'vr-haptic-feedback-vr', 'vr-spatial-audio', 'vr-room-scale', 'vr-guardian-system', 'vr-passthrough-mode', 'xr-session-manager', 'xr-input-handler', 'xr-hit-test', 'xr-dom-overlay', 'xr-light-probe', 'xr-anchors-system', 'xr-layers-compositor', 'xr-webxr-polyfill', 'xr-device-selector', 'xr-feature-detector', 'xr-permissions-handler', 'xr-session-recorder', 'xr-screenshot-capture', 'xr-performance-monitor', 'xr-analytics-tracker'].map((id) =>
    generateCapsule(id, id.split('-').slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '), 'Media', `${id.split('-').slice(1).join(' ')} AR/VR component`, ['ar', 'vr', 'xr', 'immersive'])
  ),

  // 3D Graphics & WebGL - 50 capsules
  ...['3d-scene-renderer', '3d-gltf-loader', '3d-fbx-loader', '3d-obj-loader', '3d-model-viewer-3d', '3d-texture-loader', '3d-material-editor', '3d-shader-editor', '3d-pbr-material', '3d-standard-material', '3d-toon-shader', '3d-wireframe-renderer', '3d-point-cloud', '3d-mesh-generator', '3d-geometry-builder', '3d-primitive-shapes', '3d-curve-generator', '3d-extrude-geometry', '3d-lathe-geometry', '3d-parametric-surface', '3d-lighting-system', '3d-directional-light', '3d-point-light', '3d-spot-light', '3d-ambient-light', '3d-hemisphere-light', '3d-shadow-mapper', '3d-reflection-probe', '3d-camera-controller', '3d-orbit-controls', '3d-first-person-camera', '3d-fly-controls', '3d-trackball-controls', '3d-transform-controls', '3d-animation-mixer', '3d-skeletal-animation', '3d-morph-targets', '3d-keyframe-animation', '3d-physics-engine', '3d-collision-detection', '3d-raycast-picker', '3d-bvh-optimizer', '3d-lod-manager', '3d-instancing-renderer', '3d-gpu-particles', '3d-post-processing', '3d-bloom-effect', '3d-ssao-effect', '3d-ssr-effect', '3d-depth-of-field'].map((id) =>
    generateCapsule(id, id.split('-').slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '), 'Media', `${id.split('-').slice(1).join(' ')} 3D graphics component`, ['3d', 'webgl', 'graphics'])
  ),

  // Canvas & 2D Graphics - 50 capsules
  ...['canvas-drawing-board', 'canvas-paint-tool', 'canvas-brush-engine', 'canvas-pen-tool', 'canvas-eraser-tool', 'canvas-fill-bucket', 'canvas-gradient-tool', 'canvas-shape-tool', 'canvas-text-tool', 'canvas-selection-tool', 'canvas-lasso-selection', 'canvas-magic-wand', 'canvas-layer-manager', 'canvas-layer-blend-modes', 'canvas-opacity-control', 'canvas-transform-tool', 'canvas-crop-tool', 'canvas-resize-canvas', 'canvas-rotate-canvas', 'canvas-flip-canvas', 'canvas-filters-panel', 'canvas-brightness-contrast', 'canvas-hue-saturation', 'canvas-blur-filter', 'canvas-sharpen-filter', 'canvas-noise-filter', 'canvas-posterize', 'canvas-threshold', 'canvas-color-picker-canvas', 'canvas-eyedropper', 'canvas-color-palette', 'canvas-gradient-editor', 'canvas-pattern-editor', 'canvas-sprite-sheet', 'canvas-animation-timeline', 'canvas-frame-player', 'canvas-export-png', 'canvas-export-svg', 'canvas-export-pdf', 'canvas-import-image', 'canvas-paste-clipboard', 'canvas-undo-redo-stack', 'canvas-history-panel', 'canvas-zoom-pan-canvas', 'canvas-grid-overlay', 'canvas-rulers', 'canvas-guides', 'canvas-snap-to-grid', 'canvas-pixel-grid', 'canvas-onion-skin'].map((id) =>
    generateCapsule(id, id.split('-').slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '), 'Media', `${id.split('-').slice(1).join(' ')} canvas component`, ['canvas', '2d', 'drawing'])
  ),

  // Audio Processing & Music - 50 capsules
  ...['audio-waveform-editor', 'audio-spectrum-analyzer', 'audio-equalizer', 'audio-mixer-board', 'audio-track-mixer', 'audio-volume-fader', 'audio-pan-control', 'audio-mute-solo', 'audio-gain-control', 'audio-compressor', 'audio-limiter', 'audio-gate-expander', 'audio-reverb-effect', 'audio-delay-effect', 'audio-chorus-effect', 'audio-flanger-effect', 'audio-phaser-effect', 'audio-distortion-effect', 'audio-bitcrusher', 'audio-filter-lowpass', 'audio-filter-highpass', 'audio-filter-bandpass', 'audio-filter-notch', 'audio-pitch-shifter', 'audio-time-stretcher', 'audio-vocoder', 'audio-auto-tune', 'audio-harmonizer', 'audio-tremolo', 'audio-vibrato', 'audio-sequencer', 'audio-step-sequencer', 'audio-piano-roll', 'audio-drum-machine', 'audio-sampler', 'audio-synthesizer', 'audio-oscillator', 'audio-envelope-generator', 'audio-lfo-generator', 'audio-noise-generator', 'audio-metronome', 'audio-tempo-tapper', 'audio-bpm-detector', 'audio-key-detector', 'audio-chord-detector', 'audio-tuner', 'audio-vocal-remover', 'audio-stem-separator', 'audio-transcription', 'audio-beat-grid'].map((id) =>
    generateCapsule(id, id.split('-').slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '), 'Media', `${id.split('-').slice(1).join(' ')} audio component`, ['audio', 'music', 'sound'])
  )
]

export default extendedCapsulesBatch7
