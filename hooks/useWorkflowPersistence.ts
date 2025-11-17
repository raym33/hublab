/**
 * useWorkflowPersistence Hook
 * Handles saving/loading workflows to/from localStorage
 */

import { useState, useEffect, useCallback } from 'react'

export interface SavedWorkflow {
  id: string
  name: string
  description?: string
  nodes: any[]
  connections: any[]
  createdAt: string
  updatedAt: string
  version: string
}

const STORAGE_KEY = 'hublab_workflows'
const CURRENT_VERSION = '2.0.0'

export function useWorkflowPersistence() {
  const [savedWorkflows, setSavedWorkflows] = useState<SavedWorkflow[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load all workflows from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const workflows = JSON.parse(stored)
        setSavedWorkflows(workflows)
      }
    } catch (error) {
      console.error('Error loading workflows:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save workflow
  const saveWorkflow = useCallback((workflow: {
    id?: string
    name: string
    description?: string
    nodes: any[]
    connections: any[]
  }) => {
    try {
      const now = new Date().toISOString()
      const newWorkflow: SavedWorkflow = {
        id: workflow.id || `workflow-${Date.now()}`,
        name: workflow.name,
        description: workflow.description,
        nodes: workflow.nodes,
        connections: workflow.connections,
        createdAt: workflow.id ? savedWorkflows.find(w => w.id === workflow.id)?.createdAt || now : now,
        updatedAt: now,
        version: CURRENT_VERSION
      }

      const updated = workflow.id
        ? savedWorkflows.map(w => w.id === workflow.id ? newWorkflow : w)
        : [...savedWorkflows, newWorkflow]

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      setSavedWorkflows(updated)

      return newWorkflow
    } catch (error) {
      console.error('Error saving workflow:', error)
      throw error
    }
  }, [savedWorkflows])

  // Load workflow by ID
  const loadWorkflow = useCallback((id: string) => {
    return savedWorkflows.find(w => w.id === id) || null
  }, [savedWorkflows])

  // Delete workflow
  const deleteWorkflow = useCallback((id: string) => {
    try {
      const updated = savedWorkflows.filter(w => w.id !== id)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      setSavedWorkflows(updated)
    } catch (error) {
      console.error('Error deleting workflow:', error)
      throw error
    }
  }, [savedWorkflows])

  // Duplicate workflow
  const duplicateWorkflow = useCallback((id: string) => {
    const workflow = savedWorkflows.find(w => w.id === id)
    if (!workflow) return null

    const now = new Date().toISOString()
    const duplicated: SavedWorkflow = {
      ...workflow,
      id: `workflow-${Date.now()}`,
      name: `${workflow.name} (Copy)`,
      createdAt: now,
      updatedAt: now
    }

    const updated = [...savedWorkflows, duplicated]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    setSavedWorkflows(updated)

    return duplicated
  }, [savedWorkflows])

  // Export workflow to JSON
  const exportWorkflow = useCallback((id: string) => {
    const workflow = savedWorkflows.find(w => w.id === id)
    if (!workflow) return

    const blob = new Blob([JSON.stringify(workflow, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${workflow.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [savedWorkflows])

  // Import workflow from JSON
  const importWorkflow = useCallback(async (file: File) => {
    try {
      const text = await file.text()
      const workflow = JSON.parse(text) as SavedWorkflow

      const now = new Date().toISOString()
      const imported: SavedWorkflow = {
        ...workflow,
        id: `workflow-${Date.now()}`,
        createdAt: now,
        updatedAt: now,
        version: CURRENT_VERSION
      }

      const updated = [...savedWorkflows, imported]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      setSavedWorkflows(updated)

      return imported
    } catch (error) {
      console.error('Error importing workflow:', error)
      throw error
    }
  }, [savedWorkflows])

  // Clear all workflows
  const clearAllWorkflows = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setSavedWorkflows([])
  }, [])

  return {
    savedWorkflows,
    isLoading,
    saveWorkflow,
    loadWorkflow,
    deleteWorkflow,
    duplicateWorkflow,
    exportWorkflow,
    importWorkflow,
    clearAllWorkflows
  }
}
