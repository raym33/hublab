'use client'

import { useState } from 'react'
import { Download, Loader2 } from 'lucide-react'
import { Capsule } from '@/types/capsule'

interface CanvasItem {
  id: string
  capsule: Capsule
  props?: Record<string, any>
}

interface ExportButtonProps {
  canvasItems: CanvasItem[]
}

export default function ExportButton({ canvasItems }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    if (canvasItems.length === 0) {
      alert('No hay componentes para exportar')
      return
    }

    setIsExporting(true)

    try {
      const response = await fetch('/api/canvas/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ canvasItems })
      })

      if (!response.ok) {
        throw new Error('Error al exportar')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `hublab-app-${Date.now()}.zip`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Export error:', error)
      alert('Error al exportar el proyecto')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={isExporting || canvasItems.length === 0}
      className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl font-medium disabled:shadow-none"
    >
      {isExporting ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Exportando...</span>
        </>
      ) : (
        <>
          <Download className="w-5 h-5" />
          <span>Exportar proyecto</span>
        </>
      )}
    </button>
  )
}
