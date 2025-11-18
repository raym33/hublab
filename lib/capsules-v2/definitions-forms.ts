/**
 * Forms Capsules V2 - Advanced Form Components
 * Browser-based form validation, file uploads, and interactive inputs
 */

import DOMPurify from 'isomorphic-dompurify'
import { CapsuleDefinition } from './types'

export const FORMS_CAPSULES: CapsuleDefinition[] = [
  // ============================================
  // ADVANCED FORM INPUTS
  // ============================================

  {
    id: 'rich-text-editor',
    name: 'Rich Text Editor',
    description: 'Simple rich text editor with formatting',
    category: 'feature',
    props: [
      { name: 'initialContent', type: 'string', required: false, description: 'Initial HTML content' },
      { name: 'onChange', type: 'function', required: false, description: 'Change callback' }
    ],
    code: `function RichTextEditor({ initialContent = '', onChange }) {
  const [content, setContent] = React.useState(initialContent)
  const editorRef = React.useRef(null)

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value)
    const html = DOMPurify.sanitize(editorRef.current.innerHTML)
    setContent(html)
    onChange?.(html)
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text/plain')
    document.execCommand('insertText', false, text)
  }

  return (
    <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
      <div className="bg-gray-100 border-b-2 border-gray-300 p-2 flex gap-1 flex-wrap">
        <button
          onClick={() => execCommand('bold')}
          className="px-3 py-1 bg-white hover:bg-gray-200 rounded border border-gray-300 font-bold"
          title="Bold"
        >
          B
        </button>
        <button
          onClick={() => execCommand('italic')}
          className="px-3 py-1 bg-white hover:bg-gray-200 rounded border border-gray-300 italic"
          title="Italic"
        >
          I
        </button>
        <button
          onClick={() => execCommand('underline')}
          className="px-3 py-1 bg-white hover:bg-gray-200 rounded border border-gray-300 underline"
          title="Underline"
        >
          U
        </button>

        <div className="w-px bg-gray-300 mx-1" />

        <button
          onClick={() => execCommand('formatBlock', '<h1>')}
          className="px-3 py-1 bg-white hover:bg-gray-200 rounded border border-gray-300 text-sm"
          title="Heading 1"
        >
          H1
        </button>
        <button
          onClick={() => execCommand('formatBlock', '<h2>')}
          className="px-3 py-1 bg-white hover:bg-gray-200 rounded border border-gray-300 text-sm"
          title="Heading 2"
        >
          H2
        </button>
        <button
          onClick={() => execCommand('formatBlock', '<p>')}
          className="px-3 py-1 bg-white hover:bg-gray-200 rounded border border-gray-300 text-sm"
          title="Paragraph"
        >
          P
        </button>

        <div className="w-px bg-gray-300 mx-1" />

        <button
          onClick={() => execCommand('insertUnorderedList')}
          className="px-3 py-1 bg-white hover:bg-gray-200 rounded border border-gray-300"
          title="Bullet List"
        >
          • List
        </button>
        <button
          onClick={() => execCommand('insertOrderedList')}
          className="px-3 py-1 bg-white hover:bg-gray-200 rounded border border-gray-300"
          title="Numbered List"
        >
          1. List
        </button>

        <div className="w-px bg-gray-300 mx-1" />

        <button
          onClick={() => {
            const url = prompt('Enter URL:')
            if (url) execCommand('createLink', url)
          }}
          className="px-3 py-1 bg-white hover:bg-gray-200 rounded border border-gray-300"
          title="Insert Link"
        >
          🔗
        </button>

        <button
          onClick={() => execCommand('removeFormat')}
          className="px-3 py-1 bg-white hover:bg-gray-200 rounded border border-gray-300"
          title="Clear Formatting"
        >
          ✕
        </button>
      </div>

      <div
        ref={editorRef}
        contentEditable
        onInput={(e) => {
          const html = DOMPurify.sanitize(e.currentTarget.innerHTML)
          setContent(html)
          onChange?.(html)
        }}
        onPaste={handlePaste}
        className="p-4 min-h-[300px] focus:outline-none prose max-w-none"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
      />
    </div>
  )
}`
  },

  {
    id: 'file-dropzone',
    name: 'File Dropzone',
    description: 'Drag and drop file upload area',
    category: 'feature',
    props: [
      { name: 'accept', type: 'string', required: false, description: 'Accepted file types' },
      { name: 'maxSize', type: 'number', required: false, description: 'Max file size in MB' },
      { name: 'multiple', type: 'boolean', required: false, description: 'Allow multiple files' },
      { name: 'onUpload', type: 'function', required: false, description: 'Upload callback' }
    ],
    code: `function FileDropzone({ accept = '*', maxSize = 10, multiple = true, onUpload }) {
  const [files, setFiles] = React.useState([])
  const [isDragging, setIsDragging] = React.useState(false)
  const [error, setError] = React.useState('')
  const inputRef = React.useRef(null)

  const handleFiles = (fileList) => {
    const newFiles = Array.from(fileList)
    const maxBytes = maxSize * 1024 * 1024

    setError('')

    const validFiles = newFiles.filter(file => {
      if (file.size > maxBytes) {
        setError(\`\${file.name} exceeds \${maxSize}MB limit\`)
        return false
      }
      return true
    })

    const updatedFiles = multiple ? [...files, ...validFiles] : validFiles
    setFiles(updatedFiles)
    onUpload?.(updatedFiles)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const removeFile = (index) => {
    const updated = files.filter((_, i) => i !== index)
    setFiles(updated)
    onUpload?.(updated)
  }

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        className={\`
          border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition
          \${isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400 bg-gray-50'
          }
        \`}
      >
        <div className="text-6xl mb-4">📁</div>
        <p className="text-lg font-semibold text-gray-700 mb-2">
          Drag & drop files here
        </p>
        <p className="text-sm text-gray-500 mb-4">
          or click to browse
        </p>
        <p className="text-xs text-gray-400">
          {accept !== '*' && \`Accepted: \${accept}\`}
          {maxSize && \` • Max size: \${maxSize}MB\`}
        </p>

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
      </div>

      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3 text-red-700 text-sm">
          ⚠️ {error}
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-700">{files.length} file(s) selected:</h3>
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between bg-white border-2 border-gray-200 rounded-lg p-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="text-2xl">📄</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{file.name}</p>
                  <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  removeFile(index)
                }}
                className="ml-2 text-red-500 hover:text-red-700 font-bold text-xl"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}`
  },

  {
    id: 'autocomplete',
    name: 'Autocomplete Input',
    description: 'Input with autocomplete suggestions',
    category: 'ui',
    props: [
      { name: 'suggestions', type: 'array', required: true, description: 'List of suggestions' },
      { name: 'placeholder', type: 'string', required: false, description: 'Placeholder text' },
      { name: 'onSelect', type: 'function', required: false, description: 'Selection callback' }
    ],
    code: `function Autocomplete({ suggestions = [], placeholder = 'Search...', onSelect }) {
  const [value, setValue] = React.useState('')
  const [filtered, setFiltered] = React.useState([])
  const [showSuggestions, setShowSuggestions] = React.useState(false)
  const [selectedIndex, setSelectedIndex] = React.useState(-1)
  const wrapperRef = React.useRef(null)

  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleChange = (e) => {
    const input = e.target.value
    setValue(input)

    if (input.trim()) {
      const matches = suggestions.filter(s =>
        s.toLowerCase().includes(input.toLowerCase())
      )
      setFiltered(matches)
      setShowSuggestions(true)
      setSelectedIndex(-1)
    } else {
      setShowSuggestions(false)
    }
  }

  const handleSelect = (suggestion) => {
    setValue(suggestion)
    setShowSuggestions(false)
    onSelect?.(suggestion)
  }

  const handleKeyDown = (e) => {
    if (!showSuggestions) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => Math.min(prev + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => Math.max(prev - 1, -1))
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault()
      handleSelect(filtered[selectedIndex])
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }

  return (
    <div ref={wrapperRef} className="relative">
      <input
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => value && setShowSuggestions(true)}
        placeholder={placeholder}
        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
      />

      {showSuggestions && filtered.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border-2 border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filtered.map((suggestion, index) => (
            <div
              key={index}
              onClick={() => handleSelect(suggestion)}
              className={\`
                px-4 py-2 cursor-pointer
                \${index === selectedIndex ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}
              \`}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}`
  },

  {
    id: 'tags-input',
    name: 'Tags Input',
    description: 'Input for managing tags/chips',
    category: 'ui',
    props: [
      { name: 'placeholder', type: 'string', required: false, description: 'Placeholder text' },
      { name: 'maxTags', type: 'number', required: false, description: 'Maximum number of tags' },
      { name: 'onChange', type: 'function', required: false, description: 'Change callback' }
    ],
    code: `function TagsInput({ placeholder = 'Add tags...', maxTags = 10, onChange }) {
  const [tags, setTags] = React.useState([])
  const [input, setInput] = React.useState('')

  const addTag = (tag) => {
    const trimmed = tag.trim()
    if (trimmed && !tags.includes(trimmed) && tags.length < maxTags) {
      const newTags = [...tags, trimmed]
      setTags(newTags)
      setInput('')
      onChange?.(newTags)
    }
  }

  const removeTag = (index) => {
    const newTags = tags.filter((_, i) => i !== index)
    setTags(newTags)
    onChange?.(newTags)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag(input)
    } else if (e.key === 'Backspace' && !input && tags.length > 0) {
      removeTag(tags.length - 1)
    }
  }

  return (
    <div className="border-2 border-gray-300 rounded-lg p-2 focus-within:border-blue-500">
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 bg-blue-500 text-white px-3 py-1 rounded-full text-sm"
          >
            {tag}
            <button
              onClick={() => removeTag(index)}
              className="hover:bg-blue-600 rounded-full w-5 h-5 flex items-center justify-center"
            >
              ×
            </button>
          </span>
        ))}
      </div>

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => input && addTag(input)}
        placeholder={tags.length < maxTags ? placeholder : \`Max \${maxTags} tags\`}
        disabled={tags.length >= maxTags}
        className="w-full px-2 py-1 focus:outline-none disabled:opacity-50"
      />

      <div className="text-xs text-gray-500 mt-1">
        {tags.length}/{maxTags} tags • Press Enter to add
      </div>
    </div>
  )
}`
  },

  {
    id: 'form-wizard',
    name: 'Form Wizard',
    description: 'Multi-step form with validation',
    category: 'feature',
    props: [
      { name: 'steps', type: 'array', required: true, description: 'Array of step configurations' },
      { name: 'onComplete', type: 'function', required: false, description: 'Completion callback' }
    ],
    code: `function FormWizard({ steps = [], onComplete }) {
  const [currentStep, setCurrentStep] = React.useState(0)
  const [formData, setFormData] = React.useState({})
  const [errors, setErrors] = React.useState({})

  const step = steps[currentStep]

  const validate = () => {
    const newErrors = {}

    step.fields?.forEach(field => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = \`\${field.label} is required\`
      }

      if (field.type === 'email' && formData[field.name]) {
        const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/
        if (!emailRegex.test(formData[field.name])) {
          newErrors[field.name] = 'Invalid email address'
        }
      }

      if (field.minLength && formData[field.name]?.length < field.minLength) {
        newErrors[field.name] = \`Minimum \${field.minLength} characters\`
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validate()) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1)
      } else {
        onComplete?.(formData)
      }
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      setErrors({})
    }
  }

  const updateField = (name, value) => {
    setFormData({ ...formData, [name]: value })
    if (errors[name]) {
      setErrors({ ...errors, [name]: undefined })
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {steps.map((s, i) => (
            <div key={i} className="flex-1">
              <div className="flex items-center">
                <div
                  className={\`
                    w-10 h-10 rounded-full flex items-center justify-center font-semibold
                    \${i <= currentStep ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'}
                  \`}
                >
                  {i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={\`flex-1 h-1 mx-2 \${
                      i < currentStep ? 'bg-blue-500' : 'bg-gray-200'
                    }\`}
                  />
                )}
              </div>
              <p className="text-xs text-gray-600 mt-1">{s.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white border-2 border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-2">{step.title}</h2>
        {step.description && (
          <p className="text-gray-600 mb-6">{step.description}</p>
        )}

        <div className="space-y-4">
          {step.fields?.map(field => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
                {field.required && <span className="text-red-500">*</span>}
              </label>

              {field.type === 'textarea' ? (
                <textarea
                  value={formData[field.name] || ''}
                  onChange={(e) => updateField(field.name, e.target.value)}
                  placeholder={field.placeholder}
                  rows={4}
                  className={\`w-full px-3 py-2 border-2 rounded-lg focus:outline-none \${
                    errors[field.name] ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }\`}
                />
              ) : field.type === 'select' ? (
                <select
                  value={formData[field.name] || ''}
                  onChange={(e) => updateField(field.name, e.target.value)}
                  className={\`w-full px-3 py-2 border-2 rounded-lg focus:outline-none \${
                    errors[field.name] ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }\`}
                >
                  <option value="">Select...</option>
                  {field.options?.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type || 'text'}
                  value={formData[field.name] || ''}
                  onChange={(e) => updateField(field.name, e.target.value)}
                  placeholder={field.placeholder}
                  className={\`w-full px-3 py-2 border-2 rounded-lg focus:outline-none \${
                    errors[field.name] ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }\`}
                />
              )}

              {errors[field.name] && (
                <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={handleBack}
          disabled={currentStep === 0}
          className="px-6 py-2 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Back
        </button>

        <button
          onClick={handleNext}
          className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold"
        >
          {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
        </button>
      </div>
    </div>
  )
}`
  },

  {
    id: 'date-range-picker',
    name: 'Date Range Picker',
    description: 'Select start and end dates',
    category: 'ui',
    props: [
      { name: 'onChange', type: 'function', required: false, description: 'Change callback' }
    ],
    code: `function DateRangePicker({ onChange }) {
  const [startDate, setStartDate] = React.useState('')
  const [endDate, setEndDate] = React.useState('')

  React.useEffect(() => {
    if (startDate && endDate) {
      onChange?.({ start: startDate, end: endDate })
    }
  }, [startDate, endDate])

  const getDaysDiff = () => {
    if (!startDate || !endDate) return 0
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24))
    return diff
  }

  return (
    <div className="inline-block space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            max={endDate || undefined}
            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min={startDate || undefined}
            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {startDate && endDate && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3 text-center">
          <span className="font-semibold text-blue-900">
            {getDaysDiff()} days selected
          </span>
        </div>
      )}
    </div>
  )
}`
  },

  {
    id: 'password-strength',
    name: 'Password Strength Meter',
    description: 'Password input with strength indicator',
    category: 'ui',
    props: [
      { name: 'onChange', type: 'function', required: false, description: 'Change callback' }
    ],
    code: `function PasswordStrength({ onChange }) {
  const [password, setPassword] = React.useState('')
  const [showPassword, setShowPassword] = React.useState(false)

  const calculateStrength = () => {
    let strength = 0
    if (password.length >= 8) strength++
    if (password.length >= 12) strength++
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^a-zA-Z0-9]/.test(password)) strength++
    return strength
  }

  const strength = calculateStrength()
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong']
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500']

  const handleChange = (e) => {
    const value = e.target.value
    setPassword(value)
    onChange?.(value, strength)
  }

  return (
    <div className="space-y-2">
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={handleChange}
          placeholder="Enter password"
          className="w-full px-3 py-2 pr-12 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
        />
        <button
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {showPassword ? '👁️' : '👁️‍🗨️'}
        </button>
      </div>

      {password && (
        <>
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map(i => (
              <div
                key={i}
                className={\`flex-1 h-2 rounded-full transition \${
                  i < strength ? strengthColors[strength - 1] : 'bg-gray-200'
                }\`}
              />
            ))}
          </div>

          <p className="text-sm font-semibold" style={{ color: \`var(--tw-\${strengthColors[strength - 1]?.replace('bg-', '')})\` }}>
            {strengthLabels[strength - 1] || 'Very Weak'}
          </p>

          <div className="text-xs text-gray-600 space-y-1">
            <div className={password.length >= 8 ? 'text-green-600' : ''}>
              ✓ At least 8 characters
            </div>
            <div className={/[a-z]/.test(password) && /[A-Z]/.test(password) ? 'text-green-600' : ''}>
              ✓ Uppercase and lowercase letters
            </div>
            <div className={/[0-9]/.test(password) ? 'text-green-600' : ''}>
              ✓ At least one number
            </div>
            <div className={/[^a-zA-Z0-9]/.test(password) ? 'text-green-600' : ''}>
              ✓ At least one special character
            </div>
          </div>
        </>
      )}
    </div>
  )
}`
  },

  {
    id: 'otp-input',
    name: 'OTP Input',
    description: 'One-time password input with auto-focus',
    category: 'ui',
    props: [
      { name: 'length', type: 'number', required: false, description: 'Number of digits' },
      { name: 'onComplete', type: 'function', required: false, description: 'Completion callback' }
    ],
    code: `function OTPInput({ length = 6, onComplete }) {
  const [otp, setOtp] = React.useState(Array(length).fill(''))
  const inputRefs = React.useRef([])

  React.useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  const handleChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Move to next input
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }

    // Check if complete
    if (newOtp.every(digit => digit !== '') && newOtp.length === length) {
      onComplete?.(newOtp.join(''))
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, length)
    if (!/^[0-9]+$/.test(pastedData)) return

    const newOtp = pastedData.split('').concat(Array(length).fill('')).slice(0, length)
    setOtp(newOtp)

    const nextEmpty = newOtp.findIndex(digit => digit === '')
    const focusIndex = nextEmpty === -1 ? length - 1 : nextEmpty
    inputRefs.current[focusIndex]?.focus()

    if (newOtp.every(digit => digit !== '')) {
      onComplete?.(newOtp.join(''))
    }
  }

  return (
    <div className="flex gap-2 justify-center">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={el => inputRefs.current[index] = el}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
        />
      ))}
    </div>
  )
}`
  }
]
