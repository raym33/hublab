/**
 * Extended Capsules Batch 2 - 200 capsules
 * IoT, Finance, Healthcare, Gaming categories
 */

import { Capsule } from '@/types/capsule'

const generateCapsule = (id: string, name: string, category: string, desc: string, tags: string[]): Capsule => ({
  id, name, category, description: desc, tags,
  code: `'use client'\nexport default function ${name.replace(/[^a-zA-Z0-9]/g, '')}() {\n  return <div className="p-4 border rounded-lg">${name}</div>\n}`,
  platform: 'react'
})

const extendedCapsulesBatch2: Capsule[] = [
  // IoT - 50 capsules
  ...['iot-device-manager', 'iot-sensor-data', 'iot-mqtt-client', 'iot-coap-protocol', 'iot-lorawan', 'iot-zigbee', 'iot-ble', 'iot-wifi-config', 'iot-firmware-update', 'iot-device-twin', 'iot-edge-gateway', 'iot-device-provisioning', 'iot-telemetry', 'iot-command-control', 'iot-fleet-management', 'iot-asset-tracking', 'iot-predictive-maintenance', 'iot-anomaly-detection', 'iot-energy-monitor', 'iot-smart-home', 'iot-smart-city', 'iot-industrial', 'iot-agriculture', 'iot-healthcare-devices', 'iot-wearables', 'iot-temperature-sensor', 'iot-humidity-sensor', 'iot-pressure-sensor', 'iot-motion-detector', 'iot-light-sensor', 'iot-camera-feed', 'iot-door-lock', 'iot-thermostat', 'iot-smoke-detector', 'iot-water-leak', 'iot-air-quality', 'iot-noise-sensor', 'iot-vibration-sensor', 'iot-gps-tracker', 'iot-rfid-reader', 'iot-barcode-scanner', 'iot-nfc-reader', 'iot-actuator-control', 'iot-relay-switch', 'iot-servo-motor', 'iot-pump-control', 'iot-valve-control', 'iot-led-controller', 'iot-display-control', 'iot-alarm-system'].map((id, i) =>
    generateCapsule(id, id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '), 'Utility', `IoT ${id.split('-').slice(1).join(' ')} component`, ['iot', 'sensor', 'device'])
  ),

  // Finance - 50 capsules
  ...['fin-payment-gateway', 'fin-stripe', 'fin-paypal', 'fin-square', 'fin-credit-card', 'fin-bank-transfer', 'fin-wallet', 'fin-crypto-payment', 'fin-invoice', 'fin-billing', 'fin-subscription', 'fin-recurring-payment', 'fin-refund', 'fin-chargeback', 'fin-fraud-detection', 'fin-kyc', 'fin-aml', 'fin-risk-assessment', 'fin-credit-score', 'fin-loan-calculator', 'fin-mortgage', 'fin-interest-calculator', 'fin-amortization', 'fin-roi-calculator', 'fin-investment-tracker', 'fin-portfolio', 'fin-stock-chart', 'fin-crypto-chart', 'fin-forex', 'fin-trading-bot', 'fin-order-book', 'fin-candlestick', 'fin-technical-indicators', 'fin-backtesting', 'fin-paper-trading', 'fin-wallet-connect', 'fin-defi', 'fin-yield-farming', 'fin-staking', 'fin-nft-marketplace', 'fin-accounting', 'fin-bookkeeping', 'fin-ledger', 'fin-journal-entry', 'fin-balance-sheet', 'fin-income-statement', 'fin-cash-flow', 'fin-budget', 'fin-expense-tracker', 'fin-receipt-scanner'].map((id, i) =>
    generateCapsule(id, id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '), 'E-commerce', `Finance ${id.split('-').slice(1).join(' ')} component`, ['finance', 'payment', 'money'])
  ),

  // Healthcare - 50 capsules
  ...['health-patient-portal', 'health-ehr', 'health-emr', 'health-appointment', 'health-scheduling', 'health-telemedicine', 'health-video-consult', 'health-prescription', 'health-pharmacy', 'health-medication', 'health-dosage-calculator', 'health-drug-interaction', 'health-symptom-checker', 'health-diagnosis', 'health-treatment-plan', 'health-lab-results', 'health-imaging', 'health-x-ray-viewer', 'health-dicom', 'health-vital-signs', 'health-heart-rate', 'health-blood-pressure', 'health-glucose-monitor', 'health-oxygen-level', 'health-temperature', 'health-weight-tracker', 'health-bmi-calculator', 'health-fitness-tracker', 'health-step-counter', 'health-calorie-counter', 'health-nutrition', 'health-meal-planner', 'health-water-intake', 'health-sleep-tracker', 'health-mental-health', 'health-mood-tracker', 'health-meditation', 'health-exercise-log', 'health-workout-planner', 'health-rehabilitation', 'health-physical-therapy', 'health-insurance', 'health-claims', 'health-billing-codes', 'health-icd-lookup', 'health-cpt-codes', 'health-hl7', 'health-fhir', 'health-hipaa-compliance', 'health-consent-forms'].map((id, i) =>
    generateCapsule(id, id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '), 'Form', `Healthcare ${id.split('-').slice(1).join(' ')} component`, ['healthcare', 'medical', 'patient'])
  ),

  // Gaming - 50 capsules
  ...['game-canvas', 'game-sprite', 'game-animation', 'game-physics', 'game-collision', 'game-particle-system', 'game-sound-manager', 'game-music-player', 'game-leaderboard', 'game-achievements', 'game-inventory', 'game-crafting', 'game-quest-system', 'game-dialogue', 'game-npc-ai', 'game-pathfinding', 'game-minimap', 'game-health-bar', 'game-mana-bar', 'game-stamina', 'game-skill-tree', 'game-level-up', 'game-experience', 'game-stats', 'game-character-creator', 'game-avatar-editor', 'game-equip-system', 'game-weapon-upgrade', 'game-armor-system', 'game-consumables', 'game-shop', 'game-currency', 'game-gacha', 'game-lootbox', 'game-daily-rewards', 'game-streak-counter', 'game-battle-system', 'game-turn-based', 'game-real-time-combat', 'game-pvp', 'game-pve', 'game-guild-system', 'game-chat-system', 'game-emotes', 'game-friends-list', 'game-matchmaking', 'game-lobby', 'game-room-browser', 'game-spectator-mode', 'game-replay-system', 'game-tournament'].map((id, i) =>
    generateCapsule(id, id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '), 'Interaction', `Gaming ${id.split('-').slice(1).join(' ')} component`, ['game', 'gaming', 'interactive'])
  )
]

export default extendedCapsulesBatch2
