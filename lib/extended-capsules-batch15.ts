/**
 * Extended Capsules Batch 15 - 300 capsules
 * IoT Advanced, Smart Home, Wearables, Industrial IoT
 */

import { Capsule } from '@/types/capsule'

const generateCapsule = (id: string, name: string, category: string, desc: string, tags: string[]): Capsule => {
  const componentName = name.replace(/[^a-zA-Z0-9]/g, '')
  return {
  id, name, category, description: desc, tags,
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


const extendedCapsulesBatch15: Capsule[] = [
  // Smart Home & Consumer IoT - 100 capsules
  ...['smart-home-dashboard', 'smart-thermostat-control', 'smart-lighting-panel', 'light-color-picker', 'light-brightness-slider', 'light-scene-selector', 'light-schedule-builder', 'smart-lock-control', 'door-lock-status', 'door-access-log', 'door-temporary-code', 'door-unlock-history', 'smart-doorbell-viewer', 'doorbell-live-feed', 'doorbell-recording-list', 'doorbell-motion-zones', 'doorbell-visitor-log', 'smart-camera-grid', 'camera-ptz-control', 'camera-recording-timeline', 'camera-motion-detection', 'camera-person-detection', 'camera-vehicle-detection', 'camera-package-detection', 'camera-face-recognition', 'camera-zone-activity', 'security-alarm-panel', 'alarm-arm-disarm', 'alarm-zone-status', 'alarm-event-history', 'alarm-notification-settings', 'smart-garage-controller', 'garage-door-opener', 'garage-door-sensor', 'garage-vehicle-detector', 'smart-blinds-control', 'blinds-position-slider', 'blinds-schedule-automation', 'smart-speaker-control', 'speaker-volume-control', 'speaker-multi-room-audio', 'speaker-equalizer', 'speaker-preset-scenes', 'smart-tv-remote', 'tv-channel-guide', 'tv-app-launcher', 'tv-voice-control', 'smart-appliance-monitor', 'washer-cycle-status', 'dryer-notification', 'dishwasher-control', 'oven-remote-control', 'oven-temperature-monitor', 'fridge-inventory-tracker', 'fridge-expiration-alerts', 'coffee-maker-scheduler', 'vacuum-robot-control', 'vacuum-cleaning-map', 'vacuum-zone-cleaning', 'vacuum-schedule-builder', 'air-purifier-monitor', 'air-quality-index', 'air-filter-status', 'humidifier-control', 'dehumidifier-control', 'smart-fan-control', 'fan-speed-control', 'fan-oscillation-toggle', 'water-leak-detector', 'leak-alert-system', 'leak-location-map', 'smoke-detector-status', 'co-detector-status', 'environmental-sensors', 'temperature-humidity-display', 'energy-monitor-dashboard', 'power-consumption-chart', 'energy-cost-calculator', 'solar-panel-monitor', 'solar-production-graph', 'battery-storage-status', 'circuit-breaker-monitor', 'smart-outlet-control', 'outlet-schedule-timer', 'outlet-power-usage', 'whole-home-automation', 'scene-builder', 'routine-automation', 'geo-fencing-triggers', 'presence-detection', 'room-occupancy-sensor', 'voice-assistant-integration', 'alexa-skill-connector', 'google-home-integration', 'siri-shortcuts-builder', 'ifttt-automation-creator', 'home-dashboard-widgets', 'device-grouping-manager'].map((id) =>
    generateCapsule(id, id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '), 'Dashboard', `${id.split('-').join(' ')} smart home component`, ['iot', 'smart-home', 'automation'])
  ),

  // Industrial IoT & Manufacturing - 100 capsules
  ...['industrial-dashboard-iiot', 'factory-floor-overview', 'production-line-monitor', 'machine-status-grid', 'equipment-health-score', 'predictive-maintenance', 'maintenance-schedule', 'downtime-tracker', 'oee-calculator', 'oee-dashboard', 'availability-metrics', 'performance-metrics', 'quality-metrics', 'scrap-rate-monitor', 'yield-analysis', 'cycle-time-tracker', 'takt-time-calculator', 'throughput-monitor', 'bottleneck-detector', 'capacity-utilization', 'asset-tracking-map', 'asset-location-tracker', 'asset-utilization-report', 'asset-lifecycle-manager', 'equipment-telemetry', 'sensor-data-stream', 'vibration-analysis', 'temperature-monitoring', 'pressure-gauge-monitor', 'flow-rate-meter', 'level-sensor-display', 'motor-current-monitor', 'energy-consumption-iiot', 'power-quality-analyzer', 'compressed-air-monitor', 'hvac-system-monitor', 'plc-data-viewer', 'scada-integration', 'modbus-data-reader', 'opc-ua-connector', 'mqtt-message-viewer', 'edge-gateway-manager', 'fog-computing-node', 'digital-twin-viewer', 'simulation-model', 'what-if-scenario', 'production-planning', 'job-scheduling', 'work-order-manager', 'batch-tracking', 'lot-traceability', 'genealogy-tracker', 'quality-control-dashboard', 'spc-charts', 'control-chart-analyzer', 'cpk-calculator', 'defect-tracking', 'root-cause-analysis', 'pareto-chart-defects', 'fishbone-diagram', '5-why-analysis', 'andon-board', 'andon-alert-system', 'stop-light-indicator', 'production-counter', 'unit-tracker', 'shift-performance', 'operator-efficiency', 'skill-matrix', 'training-tracker', 'safety-incident-log', 'near-miss-reporter', 'safety-kpi-dashboard', 'environmental-monitoring', 'emissions-tracker', 'waste-management', 'water-usage-monitor', 'compliance-dashboard', 'audit-checklist', 'inspection-report', 'calibration-tracker', 'tool-life-monitor', 'consumables-inventory', 'spare-parts-manager', 'maintenance-parts-ordering', 'vendor-performance', 'supply-chain-visibility', 'logistics-tracker', 'warehouse-automation', 'forklift-fleet-monitor', 'conveyor-system-status', 'robotic-arm-controller', 'cobot-interface', 'agv-fleet-manager', 'autonomous-vehicle-tracker', 'inventory-robot-monitor'].map((id) =>
    generateCapsule(id, id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '), 'Dashboard', `${id.split('-').join(' ')} industrial IoT component`, ['iiot', 'manufacturing', 'industry-4.0'])
  ),

  // Wearables & Health Tech - 100 capsules
  ...['wearable-dashboard', 'fitness-tracker-sync', 'step-counter-widget', 'daily-steps-goal', 'distance-tracker', 'calories-burned', 'active-minutes', 'sedentary-alerts', 'heart-rate-monitor', 'heart-rate-zones', 'resting-heart-rate', 'heart-rate-variability', 'hrv-stress-score', 'vo2-max-estimator', 'cardio-fitness-score', 'recovery-time-advisor', 'sleep-tracker', 'sleep-stages-chart', 'sleep-quality-score', 'sleep-duration-goal', 'sleep-efficiency', 'rem-sleep-tracker', 'deep-sleep-monitor', 'light-sleep-tracker', 'wake-times-log', 'sleep-debt-calculator', 'circadian-rhythm', 'bedtime-reminder', 'wake-up-alarm-smart', 'blood-oxygen-monitor', 'spo2-tracking', 'respiratory-rate', 'breathing-exercise', 'guided-breathing', 'stress-management', 'mindfulness-timer', 'meditation-tracker', 'body-battery-energy', 'energy-level-tracker', 'workout-recorder', 'exercise-type-selector', 'workout-intensity', 'training-load', 'training-status', 'training-effect', 'recovery-advisor', 'overtraining-alert', 'running-metrics', 'pace-calculator', 'cadence-tracker', 'stride-length', 'ground-contact-time', 'vertical-oscillation', 'running-power', 'cycling-metrics', 'cycling-power-meter', 'cycling-cadence', 'cycling-speed', 'elevation-gain', 'route-tracker', 'gps-map-workout', 'swimming-metrics', 'swim-stroke-detection', 'swim-pace', 'swolf-score', 'pool-length-counter', 'strength-training-log', 'rep-counter-auto', 'set-tracker', 'rest-timer-workout', 'weight-lifted-log', 'progressive-overload', 'workout-split-planner', 'nutrition-tracker', 'calorie-counter', 'macro-tracker', 'water-intake-log', 'hydration-reminder', 'meal-photo-logger', 'barcode-scanner-food', 'recipe-calorie-calc', 'weight-tracker', 'bmi-calculator', 'body-fat-percentage', 'muscle-mass-tracker', 'body-composition', 'progress-photos', 'measurement-tracker', 'goal-weight-progress', 'menstrual-cycle-tracker', 'fertility-window', 'symptom-logger', 'medication-reminder', 'pill-tracker', 'health-vitals-dashboard', 'blood-pressure-log', 'glucose-monitor', 'insulin-tracker', 'ecg-viewer', 'afib-detection'].map((id) =>
    generateCapsule(id, id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '), 'Dashboard', `${id.split('-').join(' ')} wearable health component`, ['wearables', 'health', 'fitness'])
  )
]

export default extendedCapsulesBatch15
