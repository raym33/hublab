/**
 * Advanced Form Capsules
 *
 * Cápsulas avanzadas para formularios con validación, multi-step, y más
 */

import { Capsule } from '@/types/capsule'

export const advancedFormCapsules: Capsule[] = [
  // 1. Multi-Step Form
  {
    id: 'multi-step-form',
    name: 'Multi-Step Form',
    category: 'Form',
    description: 'Formulario de múltiples pasos con navegación, progreso y validación',
    tags: ['form', 'wizard', 'steps', 'progress', 'validation'],
    version: '1.0.0',
    author: 'HubLab',

    props: {
      steps: 'Array<{ title: string, fields: any[] }>',
      onComplete: '(data: any) => void',
      showProgress: 'boolean',
      allowBack: 'boolean'
    },

    code: `'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Check } from 'lucide-react'

interface Step {
  title: string
  description?: string
  fields: Array<{
    name: string
    label: string
    type: string
    required?: boolean
    placeholder?: string
  }>
}

interface MultiStepFormProps {
  steps: Step[]
  onComplete: (data: any) => void
  showProgress?: boolean
  allowBack?: boolean
}

export default function MultiStepForm({
  steps,
  onComplete,
  showProgress = true,
  allowBack = true
}: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateStep = () => {
    const currentFields = steps[currentStep].fields
    const newErrors: Record<string, string> = {}

    currentFields.forEach(field => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = \`\${field.label} es requerido\`
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep()) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(prev => prev + 1)
      } else {
        onComplete(formData)
      }
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      {/* Progress Bar */}
      {showProgress && (
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {steps.map((step, index) => (
              <div
                key={index}
                className={\`flex-1 text-center \${
                  index === currentStep
                    ? 'text-blue-600 font-semibold'
                    : index < currentStep
                    ? 'text-green-600'
                    : 'text-gray-400'
                }\`}
              >
                <div className="flex items-center justify-center mb-1">
                  {index < currentStep ? (
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  ) : (
                    <div
                      className={\`w-8 h-8 rounded-full flex items-center justify-center \${
                        index === currentStep
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }\`}
                    >
                      {index + 1}
                    </div>
                  )}
                </div>
                <div className="text-xs">{step.title}</div>
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: \`\${progress}%\` }}
            />
          </div>
        </div>
      )}

      {/* Current Step */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {steps[currentStep].title}
        </h2>
        {steps[currentStep].description && (
          <p className="text-gray-600">{steps[currentStep].description}</p>
        )}
      </div>

      {/* Fields */}
      <div className="space-y-4 mb-8">
        {steps[currentStep].fields.map(field => (
          <div key={field.name}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type={field.type}
              value={formData[field.name] || ''}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              className={\`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent \${
                errors[field.name] ? 'border-red-500' : 'border-gray-300'
              }\`}
            />
            {errors[field.name] && (
              <p className="text-sm text-red-500 mt-1">{errors[field.name]}</p>
            )}
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={handleBack}
          disabled={currentStep === 0 || !allowBack}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Atrás
        </button>
        <button
          onClick={handleNext}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          {currentStep === steps.length - 1 ? 'Completar' : 'Siguiente'}
          {currentStep < steps.length - 1 && <ChevronRight className="w-4 h-4" />}
        </button>
      </div>
    </div>
  )
}`
  },

  // 2. File Upload con Preview
  {
    id: 'file-upload-preview',
    name: 'File Upload with Preview',
    category: 'Form',
    description: 'Upload de archivos con preview, drag & drop, y validación',
    tags: ['upload', 'file', 'drag-drop', 'preview', 'images'],
    version: '1.0.0',
    author: 'HubLab',

    code: `'use client'

import { useState, useCallback } from 'react'
import { Upload, X, FileIcon, Image as ImageIcon } from 'lucide-react'

interface FileUploadProps {
  accept?: string
  maxSize?: number // in MB
  maxFiles?: number
  onFilesChange: (files: File[]) => void
  multiple?: boolean
}

export default function FileUploadWithPreview({
  accept = 'image/*',
  maxSize = 5,
  maxFiles = 5,
  onFilesChange,
  multiple = true
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFiles = useCallback((newFiles: FileList | null) => {
    if (!newFiles) return

    const fileArray = Array.from(newFiles)
    const validFiles: File[] = []
    let errorMsg = ''

    fileArray.forEach(file => {
      // Validate size
      if (file.size > maxSize * 1024 * 1024) {
        errorMsg = \`El archivo \${file.name} excede el tamaño máximo de \${maxSize}MB\`
        return
      }

      // Validate count
      if (validFiles.length + files.length >= maxFiles) {
        errorMsg = \`Máximo \${maxFiles} archivos permitidos\`
        return
      }

      validFiles.push(file)
    })

    if (errorMsg) {
      setError(errorMsg)
      setTimeout(() => setError(null), 3000)
      return
    }

    const newFilesList = multiple ? [...files, ...validFiles] : validFiles
    setFiles(newFilesList)
    onFilesChange(newFilesList)

    // Generate previews
    validFiles.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreviews(prev => [...prev, reader.result as string])
        }
        reader.readAsDataURL(file)
      }
    })
  }, [files, maxSize, maxFiles, multiple, onFilesChange])

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index)
    const newPreviews = previews.filter((_, i) => i !== index)
    setFiles(newFiles)
    setPreviews(newPreviews)
    onFilesChange(newFiles)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    handleFiles(e.dataTransfer.files)
  }

  return (
    <div className="w-full">
      {/* Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={\`relative border-2 border-dashed rounded-lg p-8 text-center transition \${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }\`}
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-700 font-medium mb-1">
          Arrastra archivos aquí o haz click para seleccionar
        </p>
        <p className="text-sm text-gray-500">
          Máximo {maxSize}MB por archivo • {maxFiles} archivos máximo
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Previews */}
      {files.length > 0 && (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {files.map((file, index) => (
            <div
              key={index}
              className="relative group bg-gray-50 rounded-lg overflow-hidden border border-gray-200"
            >
              {file.type.startsWith('image/') ? (
                <img
                  src={previews[index]}
                  alt={file.name}
                  className="w-full h-32 object-cover"
                />
              ) : (
                <div className="w-full h-32 flex items-center justify-center">
                  <FileIcon className="w-12 h-12 text-gray-400" />
                </div>
              )}
              <button
                onClick={() => removeFile(index)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="p-2">
                <p className="text-xs text-gray-700 truncate">{file.name}</p>
                <p className="text-xs text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}`
  },

  // 3. Form con Auto-Save
  {
    id: 'auto-save-form',
    name: 'Auto-Save Form',
    category: 'Form',
    description: 'Formulario que guarda automáticamente en localStorage',
    tags: ['form', 'autosave', 'localstorage', 'draft'],
    version: '1.0.0',
    author: 'HubLab',

    code: `'use client'

import { useState, useEffect } from 'react'
import { Save, CheckCircle } from 'lucide-react'

interface AutoSaveFormProps {
  formId: string
  fields: Array<{
    name: string
    label: string
    type: string
    required?: boolean
  }>
  onSubmit: (data: any) => void
  autoSaveDelay?: number // milliseconds
}

export default function AutoSaveForm({
  formId,
  fields,
  onSubmit,
  autoSaveDelay = 1000
}: AutoSaveFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(\`form-\${formId}\`)
    if (saved) {
      setFormData(JSON.parse(saved))
      setLastSaved(new Date(JSON.parse(saved).timestamp || Date.now()))
    }
  }, [formId])

  // Auto-save effect
  useEffect(() => {
    if (Object.keys(formData).length === 0) return

    const timeoutId = setTimeout(() => {
      setIsSaving(true)
      const dataToSave = {
        ...formData,
        timestamp: Date.now()
      }
      localStorage.setItem(\`form-\${formId}\`, JSON.stringify(dataToSave))
      setLastSaved(new Date())
      setTimeout(() => setIsSaving(false), 500)
    }, autoSaveDelay)

    return () => clearTimeout(timeoutId)
  }, [formData, formId, autoSaveDelay])

  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    localStorage.removeItem(\`form-\${formId}\`)
  }

  const clearDraft = () => {
    setFormData({})
    localStorage.removeItem(\`form-\${formId}\`)
    setLastSaved(null)
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 bg-white rounded-xl shadow-lg">
      {/* Auto-save indicator */}
      <div className="mb-4 flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          {isSaving ? (
            <>
              <Save className="w-4 h-4 text-blue-500 animate-pulse" />
              <span className="text-blue-600">Guardando...</span>
            </>
          ) : lastSaved ? (
            <>
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-gray-600">
                Guardado {lastSaved.toLocaleTimeString()}
              </span>
            </>
          ) : null}
        </div>
        {lastSaved && (
          <button
            type="button"
            onClick={clearDraft}
            className="text-red-600 hover:text-red-700 text-sm"
          >
            Limpiar borrador
          </button>
        )}
      </div>

      {/* Fields */}
      <div className="space-y-4 mb-6">
        {fields.map(field => (
          <div key={field.name}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {field.type === 'textarea' ? (
              <textarea
                value={formData[field.name] || ''}
                onChange={(e) => handleChange(field.name, e.target.value)}
                required={field.required}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <input
                type={field.type}
                value={formData[field.name] || ''}
                onChange={(e) => handleChange(field.name, e.target.value)}
                required={field.required}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            )}
          </div>
        ))}
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
      >
        Enviar Formulario
      </button>
    </form>
  )
}`
  }
]

export default advancedFormCapsules
