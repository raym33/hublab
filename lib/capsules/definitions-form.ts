import { CapsuleDefinition } from './types'

/**
 * Form Capsules
 * Advanced form components and validation
 */

export const FORM_CAPSULES: CapsuleDefinition[] = [
  // Text Input
  {
    id: 'text-input',
    name: 'Text Input',
    description: 'Styled text input with label and error state',
    category: 'form',
    props: [
      { name: 'label', type: 'string', required: true, default: 'Label', description: 'Input label' },
      { name: 'placeholder', type: 'string', required: false, default: 'Enter text...', description: 'Placeholder text' },
      { name: 'error', type: 'string', required: false, default: '', description: 'Error message' },
      { name: 'type', type: 'string', required: false, default: 'text', description: 'Input type' },
      { name: 'required', type: 'boolean', required: false, default: false, description: 'Required field' }
    ],
    dependencies: [],
    code: `
function TextInput({ label = 'Label', placeholder = 'Enter text...', error = '', type = 'text', required = false }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-600 ml-1">*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className={\`w-full px-4 py-2 border \${error ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500\`}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}`
  },

  // Select Dropdown
  {
    id: 'select-dropdown',
    name: 'Select Dropdown',
    description: 'Dropdown select with options',
    category: 'form',
    props: [
      { name: 'label', type: 'string', required: true, default: 'Select', description: 'Select label' },
      { name: 'options', type: 'array', required: true, default: ['Option 1', 'Option 2', 'Option 3'], description: 'Dropdown options' },
      { name: 'error', type: 'string', required: false, default: '', description: 'Error message' }
    ],
    dependencies: [],
    code: `
function SelectDropdown({ label = 'Select', options = ['Option 1', 'Option 2', 'Option 3'], error = '' }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <select className={\`w-full px-4 py-2 border \${error ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500\`}>
        <option value="">Select an option</option>
        {options.map((option, idx) => (
          <option key={idx} value={option}>{option}</option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}`
  },

  // Checkbox
  {
    id: 'checkbox',
    name: 'Checkbox',
    description: 'Styled checkbox with label',
    category: 'form',
    props: [
      { name: 'label', type: 'string', required: true, default: 'Accept terms', description: 'Checkbox label' },
      { name: 'checked', type: 'boolean', required: false, default: false, description: 'Checked state' }
    ],
    dependencies: [],
    code: `
function Checkbox({ label = 'Accept terms', checked = false }) {
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        defaultChecked={checked}
        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
      />
      <label className="ml-2 text-sm text-gray-700">
        {label}
      </label>
    </div>
  )
}`
  },

  // Radio Group
  {
    id: 'radio-group',
    name: 'Radio Group',
    description: 'Radio button group',
    category: 'form',
    props: [
      { name: 'label', type: 'string', required: true, default: 'Choose one', description: 'Group label' },
      { name: 'options', type: 'array', required: true, default: ['Option 1', 'Option 2', 'Option 3'], description: 'Radio options' }
    ],
    dependencies: [],
    code: `
function RadioGroup({ label = 'Choose one', options = ['Option 1', 'Option 2', 'Option 3'] }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="space-y-2">
        {options.map((option, idx) => (
          <div key={idx} className="flex items-center">
            <input
              type="radio"
              name="radio-group"
              value={option}
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <label className="ml-2 text-sm text-gray-700">
              {option}
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}`
  },

  // Textarea
  {
    id: 'textarea',
    name: 'Textarea',
    description: 'Multi-line text input',
    category: 'form',
    props: [
      { name: 'label', type: 'string', required: true, default: 'Message', description: 'Textarea label' },
      { name: 'placeholder', type: 'string', required: false, default: 'Enter your message...', description: 'Placeholder text' },
      { name: 'rows', type: 'number', required: false, default: 4, description: 'Number of rows' }
    ],
    dependencies: [],
    code: `
function Textarea({ label = 'Message', placeholder = 'Enter your message...', rows = 4 }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <textarea
        rows={rows}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
      />
    </div>
  )
}`
  },

  // File Upload
  {
    id: 'file-upload',
    name: 'File Upload',
    description: 'Drag and drop file upload',
    category: 'form',
    props: [
      { name: 'label', type: 'string', required: false, default: 'Upload File', description: 'Upload label' },
      { name: 'accept', type: 'string', required: false, default: '*', description: 'Accepted file types' }
    ],
    dependencies: [],
    code: `
function FileUpload({ label = 'Upload File', accept = '*' }) {
  const [fileName, setFileName] = React.useState('')

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
        <input
          type="file"
          accept={accept}
          onChange={(e) => setFileName(e.target.files?.[0]?.name || '')}
          className="hidden"
          id="file-input"
        />
        <label htmlFor="file-input" className="cursor-pointer">
          <div className="text-gray-600">
            {fileName || 'Click to upload or drag and drop'}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            SVG, PNG, JPG or GIF (MAX. 800x400px)
          </div>
        </label>
      </div>
    </div>
  )
}`
  },

  // Toggle Switch
  {
    id: 'toggle-switch',
    name: 'Toggle Switch',
    description: 'On/off toggle switch',
    category: 'form',
    props: [
      { name: 'label', type: 'string', required: true, default: 'Enable feature', description: 'Toggle label' },
      { name: 'checked', type: 'boolean', required: false, default: false, description: 'Checked state' }
    ],
    dependencies: [],
    code: `
function ToggleSwitch({ label = 'Enable feature', checked = false }) {
  const [isChecked, setIsChecked] = React.useState(checked)

  return (
    <div className="flex items-center justify-between mb-4">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <button
        onClick={() => setIsChecked(!isChecked)}
        className={\`relative inline-flex h-6 w-11 items-center rounded-full transition-colors \${isChecked ? 'bg-blue-600' : 'bg-gray-200'}\`}
      >
        <span
          className={\`inline-block h-4 w-4 transform rounded-full bg-white transition-transform \${isChecked ? 'translate-x-6' : 'translate-x-1'}\`}
        />
      </button>
    </div>
  )
}`
  },

  // Range Slider
  {
    id: 'range-slider',
    name: 'Range Slider',
    description: 'Range input slider',
    category: 'form',
    props: [
      { name: 'label', type: 'string', required: true, default: 'Volume', description: 'Slider label' },
      { name: 'min', type: 'number', required: false, default: 0, description: 'Minimum value' },
      { name: 'max', type: 'number', required: false, default: 100, description: 'Maximum value' },
      { name: 'step', type: 'number', required: false, default: 1, description: 'Step increment' }
    ],
    dependencies: [],
    code: `
function RangeSlider({ label = 'Volume', min = 0, max = 100, step = 1 }) {
  const [value, setValue] = React.useState(50)

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <span className="text-sm text-gray-600">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      />
    </div>
  )
}`
  }
]
