/**
 * Tests for Extended Capsules Batch 20
 * AI/ML Advanced, Computer Vision, NLP, Deep Learning, Robotics
 */

import extendedCapsulesBatch20 from '@/lib/extended-capsules-batch20'

describe('Extended Capsules Batch 20 - Advanced AI/ML & Robotics', () => {
  it('should have exactly 500 capsules', () => {
    expect(extendedCapsulesBatch20.length).toBe(500)
  })

  it('should have valid capsule structure', () => {
    const capsule = extendedCapsulesBatch20[0]

    expect(capsule).toHaveProperty('id')
    expect(capsule).toHaveProperty('name')
    expect(capsule).toHaveProperty('category')
    expect(capsule).toHaveProperty('description')
    expect(capsule).toHaveProperty('tags')
    expect(capsule).toHaveProperty('code')
    expect(capsule).toHaveProperty('platform')
  })

  it('should have AI-friendly descriptions (>=20 chars)', () => {
    extendedCapsulesBatch20.forEach(capsule => {
      expect(capsule.description.length).toBeGreaterThanOrEqual(20)
    })
  })

  it('should have at least 3 tags per capsule', () => {
    extendedCapsulesBatch20.forEach(capsule => {
      expect(capsule.tags.length).toBeGreaterThanOrEqual(3)
    })
  })

  it('should have React platform for all capsules', () => {
    extendedCapsulesBatch20.forEach(capsule => {
      expect(capsule.platform).toBe('react')
    })
  })

  it('should have unique IDs', () => {
    const ids = extendedCapsulesBatch20.map(c => c.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(extendedCapsulesBatch20.length)
  })

  it('should have valid React code (export default)', () => {
    extendedCapsulesBatch20.forEach(capsule => {
      expect(capsule.code).toContain('export default')
    })
  })

  it('should have AI/ML-related categories', () => {
    const categories = new Set(extendedCapsulesBatch20.map(c => c.category))
    const aiCategories = ['Computer Vision', 'NLP', 'Deep Learning', 'Neural Networks',
                           'Machine Learning', 'Robotics', 'AutoML', 'AI/Speech', 'AI/Vision', 'AI/Text']

    categories.forEach(cat => {
      expect(aiCategories).toContain(cat)
    })
  })

  it('should have AI tags in most capsules', () => {
    const capsulesWithAITags = extendedCapsulesBatch20.filter(capsule => {
      return capsule.tags.some(tag =>
        ['ai', 'ml', 'cv', 'nlp', 'dl', 'nn', 'robot', 'automl', 'speech', 'vision', 'text',
         'neural', 'deep-learning', 'machine-learning', 'computer-vision', 'prediction',
         'training', 'inference', 'model', 'analysis'].includes(tag.toLowerCase())
      )
    })
    expect(capsulesWithAITags.length / extendedCapsulesBatch20.length).toBeGreaterThanOrEqual(0.95)
  })

  it('should have object detection capsule', () => {
    const objectDetection = extendedCapsulesBatch20.find(c => c.id === 'cv-object-detection')
    expect(objectDetection).toBeDefined()
    expect(objectDetection?.tags).toContain('cv')
  })

  it('should have face recognition capsule', () => {
    const faceRecognition = extendedCapsulesBatch20.find(c => c.id === 'cv-face-recognition')
    expect(faceRecognition).toBeDefined()
    expect(faceRecognition?.tags).toContain('face-recognition')
  })

  it('should have sentiment analyzer capsule', () => {
    const sentimentAnalyzer = extendedCapsulesBatch20.find(c => c.id === 'nlp-sentiment-analyzer')
    expect(sentimentAnalyzer).toBeDefined()
    expect(sentimentAnalyzer?.tags).toContain('nlp')
  })

  it('should have model training capsule', () => {
    const modelTraining = extendedCapsulesBatch20.find(c => c.id === 'ml-model-training')
    expect(modelTraining).toBeDefined()
    expect(modelTraining?.tags).toContain('training')
  })

  it('should have robot control capsule', () => {
    const robotControl = extendedCapsulesBatch20.find(c => c.id === 'robot-control-panel')
    expect(robotControl).toBeDefined()
    expect(robotControl?.tags).toContain('robotics')
  })

  it('should have computer vision components', () => {
    const cvCapsules = extendedCapsulesBatch20.filter(c =>
      c.category === 'Computer Vision' || c.tags.includes('cv')
    )
    expect(cvCapsules.length).toBeGreaterThan(0)
  })

  it('should have NLP components', () => {
    const nlpCapsules = extendedCapsulesBatch20.filter(c =>
      c.category === 'NLP' || c.tags.includes('nlp')
    )
    expect(nlpCapsules.length).toBeGreaterThan(0)
  })

  it('should have machine learning components', () => {
    const mlCapsules = extendedCapsulesBatch20.filter(c =>
      c.category.includes('Machine Learning') || c.tags.includes('ml')
    )
    expect(mlCapsules.length).toBeGreaterThan(0)
  })
})
