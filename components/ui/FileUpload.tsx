/**
 * FileUpload Component
 * Drag-and-drop file upload with preview
 */

'use client'

import React, { useRef, useState } from 'react'
import { cn } from '@/lib/utils'

export interface FileUploadProps {
  accept?: string
  multiple?: boolean
  maxSize?: number // in bytes
  maxFiles?: number
  onUpload: (files: File[]) => void
  disabled?: boolean
  className?: string
}

const FileUpload = ({
  accept,
  multiple = false,
  maxSize,
  maxFiles,
  onUpload,
  disabled = false,
  className
}: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [error, setError] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFiles = (files: File[]): boolean => {
    setError('')

    if (maxFiles && files.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`)
      return false
    }

    if (maxSize) {
      const oversizedFile = files.find(file => file.size > maxSize)
      if (oversizedFile) {
        setError(`File "${oversizedFile.name}" exceeds maximum size of ${Math.round(maxSize / 1024 / 1024)}MB`)
        return false
      }
    }

    return true
  }

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return

    const fileArray = Array.from(files)

    if (!validateFiles(fileArray)) return

    setSelectedFiles(fileArray)
    onUpload(fileArray)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (disabled) return

    handleFiles(e.dataTransfer.files)
  }

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click()
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files)
  }

  const handleRemove = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index)
    setSelectedFiles(newFiles)
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div className={cn('w-full', className)}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={cn(
          'relative border-2 border-dashed rounded-lg p-8',
          'transition-all duration-200 cursor-pointer',
          'flex flex-col items-center justify-center gap-3',
          isDragging && 'border-blue-500 bg-blue-50 dark:bg-blue-900/20',
          !isDragging && !disabled && 'border-gray-300 dark:border-gray-600 hover:border-gray-400',
          disabled && 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-800'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          disabled={disabled}
          className="hidden"
        />

        <svg
          className="w-12 h-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>

        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-semibold text-blue-600">Click to upload</span> or drag and drop
          </p>
          {accept && (
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              {accept.split(',').join(', ')}
            </p>
          )}
          {maxSize && (
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Max size: {Math.round(maxSize / 1024 / 1024)}MB
            </p>
          )}
        </div>
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      {selectedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          {selectedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <svg className="w-8 h-8 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                </svg>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemove(index)
                }}
                className="ml-3 text-gray-400 hover:text-red-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default FileUpload
