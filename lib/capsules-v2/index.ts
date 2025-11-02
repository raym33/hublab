/**
 * Punto de entrada principal para el sistema de Cápsulas V2
 * Exporta todas las cápsulas (básicas + extendidas)
 */

export * from './types'
export * from './compiler'
export * from './templates'

// Exportar cápsulas
export { CAPSULE_DEFINITIONS } from './definitions'
export { ALL_CAPSULES, getAllCapsulesExtended, getCapsuleByIdExtended } from './definitions-extended'

// Re-exportar funciones útiles
export { getCapsuleById, getAllCapsules, getCapsulesByCategory } from './definitions'
