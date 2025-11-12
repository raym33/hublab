import { CompleteCapsule } from './complete-capsules'

// 🎨 UI COMPONENTS - React/Tailwind focused (50 capsules)
export const uiComponentCapsules: CompleteCapsule[] = [
  // BUTTONS & ACTIONS
  {
    id: 'ui-button',
    name: 'Button',
    category: 'ui' as any,
    icon: '🔘',
    color: '#8B5CF6',
    description: 'Interactive button component',
    configFields: [
      { name: 'variant', type: 'select', required: true, description: 'Style variant', options: ['primary', 'secondary', 'outline', 'ghost', 'destructive'] },
      { name: 'size', type: 'select', required: false, description: 'Size', options: ['sm', 'md', 'lg'], default: 'md' },
      { name: 'disabled', type: 'boolean', required: false, description: 'Disabled state', default: false },
      { name: 'loading', type: 'boolean', required: false, description: 'Loading state', default: false },
    ],
    inputPorts: [
      { id: 'label', name: 'Label', type: ['string'], required: true, description: 'Button text' },
      { id: 'onClick', name: 'On Click', type: ['function'], required: false, description: 'Click handler' },
    ],
    outputPorts: [
      { id: 'component', name: 'Component', type: 'component', description: 'Button component' },
    ],
    codeTemplate: `<button
  onClick={{{input.onClick}}}
  disabled={{{config.disabled}} || {{config.loading}}}
  className={\`btn btn-{{config.variant}} btn-{{config.size}}\`}
>
  {{{config.loading}} ? 'Loading...' : {{input.label}}}
</button>`,
  },
  {
    id: 'ui-input',
    name: 'Input Field',
    category: 'ui' as any,
    icon: '📝',
    color: '#8B5CF6',
    description: 'Text input field',
    configFields: [
      { name: 'type', type: 'select', required: true, description: 'Input type', options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search'] },
      { name: 'placeholder', type: 'string', required: false, description: 'Placeholder text' },
      { name: 'required', type: 'boolean', required: false, description: 'Required field', default: false },
      { name: 'disabled', type: 'boolean', required: false, description: 'Disabled state', default: false },
    ],
    inputPorts: [
      { id: 'value', name: 'Value', type: ['string', 'number'], required: false, description: 'Input value' },
      { id: 'onChange', name: 'On Change', type: ['function'], required: false, description: 'Change handler' },
    ],
    outputPorts: [
      { id: 'component', name: 'Component', type: 'component', description: 'Input component' },
    ],
  },
  {
    id: 'ui-card',
    name: 'Card',
    category: 'ui' as any,
    icon: '🃏',
    color: '#8B5CF6',
    description: 'Card container component',
    configFields: [
      { name: 'variant', type: 'select', required: false, description: 'Style variant', options: ['default', 'bordered', 'elevated', 'flat'], default: 'default' },
      { name: 'padding', type: 'select', required: false, description: 'Padding', options: ['sm', 'md', 'lg'], default: 'md' },
    ],
    inputPorts: [
      { id: 'title', name: 'Title', type: ['string'], required: false, description: 'Card title' },
      { id: 'children', name: 'Children', type: ['component'], required: true, description: 'Card content' },
    ],
    outputPorts: [
      { id: 'component', name: 'Component', type: 'component', description: 'Card component' },
    ],
  },
  {
    id: 'ui-modal',
    name: 'Modal/Dialog',
    category: 'ui' as any,
    icon: '🪟',
    color: '#8B5CF6',
    description: 'Modal dialog component',
    configFields: [
      { name: 'size', type: 'select', required: false, description: 'Modal size', options: ['sm', 'md', 'lg', 'xl', 'full'], default: 'md' },
      { name: 'closeOnEscape', type: 'boolean', required: false, description: 'Close on ESC key', default: true },
      { name: 'closeOnBackdrop', type: 'boolean', required: false, description: 'Close on backdrop click', default: true },
    ],
    inputPorts: [
      { id: 'isOpen', name: 'Is Open', type: ['boolean'], required: true, description: 'Open state' },
      { id: 'onClose', name: 'On Close', type: ['function'], required: true, description: 'Close handler' },
      { id: 'children', name: 'Children', type: ['component'], required: true, description: 'Modal content' },
    ],
    outputPorts: [
      { id: 'component', name: 'Component', type: 'component', description: 'Modal component' },
    ],
  },
  {
    id: 'ui-dropdown',
    name: 'Dropdown Menu',
    category: 'ui' as any,
    icon: '📋',
    color: '#8B5CF6',
    description: 'Dropdown menu component',
    configFields: [
      { name: 'placement', type: 'select', required: false, description: 'Menu placement', options: ['bottom', 'top', 'left', 'right'], default: 'bottom' },
    ],
    inputPorts: [
      { id: 'trigger', name: 'Trigger', type: ['component'], required: true, description: 'Trigger element' },
      { id: 'items', name: 'Items', type: ['array'], required: true, description: 'Menu items' },
    ],
    outputPorts: [
      { id: 'component', name: 'Component', type: 'component', description: 'Dropdown component' },
    ],
  },
  {
    id: 'ui-tooltip',
    name: 'Tooltip',
    category: 'ui' as any,
    icon: '💬',
    color: '#8B5CF6',
    description: 'Tooltip component',
    configFields: [
      { name: 'placement', type: 'select', required: false, description: 'Tooltip placement', options: ['top', 'bottom', 'left', 'right'], default: 'top' },
      { name: 'delay', type: 'number', required: false, description: 'Show delay (ms)', default: 200 },
    ],
    inputPorts: [
      { id: 'content', name: 'Content', type: ['string', 'component'], required: true, description: 'Tooltip content' },
      { id: 'children', name: 'Children', type: ['component'], required: true, description: 'Target element' },
    ],
    outputPorts: [
      { id: 'component', name: 'Component', type: 'component', description: 'Tooltip component' },
    ],
  },
  {
    id: 'ui-badge',
    name: 'Badge',
    category: 'ui' as any,
    icon: '🏷️',
    color: '#8B5CF6',
    description: 'Badge/Tag component',
    configFields: [
      { name: 'variant', type: 'select', required: false, description: 'Style variant', options: ['default', 'primary', 'success', 'warning', 'danger'], default: 'default' },
      { name: 'size', type: 'select', required: false, description: 'Size', options: ['sm', 'md', 'lg'], default: 'md' },
    ],
    inputPorts: [
      { id: 'label', name: 'Label', type: ['string', 'number'], required: true, description: 'Badge text' },
    ],
    outputPorts: [
      { id: 'component', name: 'Component', type: 'component', description: 'Badge component' },
    ],
  },
  {
    id: 'ui-avatar',
    name: 'Avatar',
    category: 'ui' as any,
    icon: '👤',
    color: '#8B5CF6',
    description: 'User avatar component',
    configFields: [
      { name: 'size', type: 'select', required: false, description: 'Avatar size', options: ['xs', 'sm', 'md', 'lg', 'xl'], default: 'md' },
      { name: 'shape', type: 'select', required: false, description: 'Shape', options: ['circle', 'square'], default: 'circle' },
    ],
    inputPorts: [
      { id: 'src', name: 'Image URL', type: ['string'], required: false, description: 'Avatar image' },
      { id: 'alt', name: 'Alt Text', type: ['string'], required: false, description: 'Alt text' },
      { id: 'fallback', name: 'Fallback', type: ['string'], required: false, description: 'Fallback initials' },
    ],
    outputPorts: [
      { id: 'component', name: 'Component', type: 'component', description: 'Avatar component' },
    ],
  },
  {
    id: 'ui-progress',
    name: 'Progress Bar',
    category: 'ui' as any,
    icon: '📊',
    color: '#8B5CF6',
    description: 'Progress indicator',
    configFields: [
      { name: 'variant', type: 'select', required: false, description: 'Style variant', options: ['default', 'success', 'warning', 'danger'], default: 'default' },
      { name: 'showLabel', type: 'boolean', required: false, description: 'Show percentage label', default: true },
    ],
    inputPorts: [
      { id: 'value', name: 'Value', type: ['number'], required: true, description: 'Progress value (0-100)' },
      { id: 'max', name: 'Max', type: ['number'], required: false, description: 'Max value', default: 100 },
    ],
    outputPorts: [
      { id: 'component', name: 'Component', type: 'component', description: 'Progress component' },
    ],
  },
  {
    id: 'ui-spinner',
    name: 'Loading Spinner',
    category: 'ui' as any,
    icon: '⏳',
    color: '#8B5CF6',
    description: 'Loading spinner animation',
    configFields: [
      { name: 'size', type: 'select', required: false, description: 'Spinner size', options: ['sm', 'md', 'lg'], default: 'md' },
      { name: 'color', type: 'select', required: false, description: 'Color', options: ['primary', 'secondary', 'white'], default: 'primary' },
    ],
    inputPorts: [],
    outputPorts: [
      { id: 'component', name: 'Component', type: 'component', description: 'Spinner component' },
    ],
  },
  {
    id: 'ui-alert',
    name: 'Alert/Notification',
    category: 'ui' as any,
    icon: '⚠️',
    color: '#8B5CF6',
    description: 'Alert message component',
    configFields: [
      { name: 'variant', type: 'select', required: true, description: 'Alert type', options: ['info', 'success', 'warning', 'error'] },
      { name: 'dismissible', type: 'boolean', required: false, description: 'Can be dismissed', default: true },
    ],
    inputPorts: [
      { id: 'title', name: 'Title', type: ['string'], required: false, description: 'Alert title' },
      { id: 'message', name: 'Message', type: ['string'], required: true, description: 'Alert message' },
      { id: 'onDismiss', name: 'On Dismiss', type: ['function'], required: false, description: 'Dismiss handler' },
    ],
    outputPorts: [
      { id: 'component', name: 'Component', type: 'component', description: 'Alert component' },
    ],
  },
  {
    id: 'ui-tabs',
    name: 'Tabs',
    category: 'ui' as any,
    icon: '📑',
    color: '#8B5CF6',
    description: 'Tabbed interface component',
    configFields: [
      { name: 'variant', type: 'select', required: false, description: 'Style variant', options: ['default', 'pills', 'underline'], default: 'default' },
    ],
    inputPorts: [
      { id: 'tabs', name: 'Tabs', type: ['array'], required: true, description: 'Tab items with label and content' },
      { id: 'defaultTab', name: 'Default Tab', type: ['number'], required: false, description: 'Default active tab index', default: 0 },
    ],
    outputPorts: [
      { id: 'component', name: 'Component', type: 'component', description: 'Tabs component' },
    ],
  },
  {
    id: 'ui-accordion',
    name: 'Accordion',
    category: 'ui' as any,
    icon: '📄',
    color: '#8B5CF6',
    description: 'Expandable accordion component',
    configFields: [
      { name: 'allowMultiple', type: 'boolean', required: false, description: 'Allow multiple open', default: false },
    ],
    inputPorts: [
      { id: 'items', name: 'Items', type: ['array'], required: true, description: 'Accordion items' },
    ],
    outputPorts: [
      { id: 'component', name: 'Component', type: 'component', description: 'Accordion component' },
    ],
  },
  {
    id: 'ui-breadcrumb',
    name: 'Breadcrumb',
    category: 'ui' as any,
    icon: '🍞',
    color: '#8B5CF6',
    description: 'Breadcrumb navigation',
    configFields: [
      { name: 'separator', type: 'string', required: false, description: 'Separator character', default: '/' },
    ],
    inputPorts: [
      { id: 'items', name: 'Items', type: ['array'], required: true, description: 'Breadcrumb items with label and href' },
    ],
    outputPorts: [
      { id: 'component', name: 'Component', type: 'component', description: 'Breadcrumb component' },
    ],
  },
  {
    id: 'ui-pagination',
    name: 'Pagination',
    category: 'ui' as any,
    icon: '📄',
    color: '#8B5CF6',
    description: 'Pagination controls',
    configFields: [
      { name: 'showFirstLast', type: 'boolean', required: false, description: 'Show first/last buttons', default: true },
      { name: 'showPrevNext', type: 'boolean', required: false, description: 'Show prev/next buttons', default: true },
    ],
    inputPorts: [
      { id: 'currentPage', name: 'Current Page', type: ['number'], required: true, description: 'Current page number' },
      { id: 'totalPages', name: 'Total Pages', type: ['number'], required: true, description: 'Total pages' },
      { id: 'onPageChange', name: 'On Page Change', type: ['function'], required: true, description: 'Page change handler' },
    ],
    outputPorts: [
      { id: 'component', name: 'Component', type: 'component', description: 'Pagination component' },
    ],
  },
  {
    id: 'ui-table',
    name: 'Data Table',
    category: 'ui' as any,
    icon: '📊',
    color: '#8B5CF6',
    description: 'Data table component',
    configFields: [
      { name: 'sortable', type: 'boolean', required: false, description: 'Enable sorting', default: true },
      { name: 'hoverable', type: 'boolean', required: false, description: 'Row hover effect', default: true },
      { name: 'striped', type: 'boolean', required: false, description: 'Striped rows', default: false },
    ],
    inputPorts: [
      { id: 'columns', name: 'Columns', type: ['array'], required: true, description: 'Column definitions' },
      { id: 'data', name: 'Data', type: ['array'], required: true, description: 'Table data' },
      { id: 'onRowClick', name: 'On Row Click', type: ['function'], required: false, description: 'Row click handler' },
    ],
    outputPorts: [
      { id: 'component', name: 'Component', type: 'component', description: 'Table component' },
    ],
  },
  {
    id: 'ui-checkbox',
    name: 'Checkbox',
    category: 'ui' as any,
    icon: '☑️',
    color: '#8B5CF6',
    description: 'Checkbox input',
    configFields: [
      { name: 'disabled', type: 'boolean', required: false, description: 'Disabled state', default: false },
    ],
    inputPorts: [
      { id: 'checked', name: 'Checked', type: ['boolean'], required: false, description: 'Checked state' },
      { id: 'label', name: 'Label', type: ['string'], required: false, description: 'Checkbox label' },
      { id: 'onChange', name: 'On Change', type: ['function'], required: false, description: 'Change handler' },
    ],
    outputPorts: [
      { id: 'component', name: 'Component', type: 'component', description: 'Checkbox component' },
    ],
  },
  {
    id: 'ui-radio',
    name: 'Radio Button',
    category: 'ui' as any,
    icon: '⚪',
    color: '#8B5CF6',
    description: 'Radio button input',
    configFields: [
      { name: 'disabled', type: 'boolean', required: false, description: 'Disabled state', default: false },
    ],
    inputPorts: [
      { id: 'value', name: 'Value', type: ['string'], required: true, description: 'Radio value' },
      { id: 'checked', name: 'Checked', type: ['boolean'], required: false, description: 'Checked state' },
      { id: 'label', name: 'Label', type: ['string'], required: false, description: 'Radio label' },
      { id: 'onChange', name: 'On Change', type: ['function'], required: false, description: 'Change handler' },
    ],
    outputPorts: [
      { id: 'component', name: 'Component', type: 'component', description: 'Radio component' },
    ],
  },
  {
    id: 'ui-switch',
    name: 'Toggle Switch',
    category: 'ui' as any,
    icon: '🔄',
    color: '#8B5CF6',
    description: 'Toggle switch component',
    configFields: [
      { name: 'size', type: 'select', required: false, description: 'Switch size', options: ['sm', 'md', 'lg'], default: 'md' },
      { name: 'disabled', type: 'boolean', required: false, description: 'Disabled state', default: false },
    ],
    inputPorts: [
      { id: 'checked', name: 'Checked', type: ['boolean'], required: false, description: 'Checked state' },
      { id: 'label', name: 'Label', type: ['string'], required: false, description: 'Switch label' },
      { id: 'onChange', name: 'On Change', type: ['function'], required: false, description: 'Change handler' },
    ],
    outputPorts: [
      { id: 'component', name: 'Component', type: 'component', description: 'Switch component' },
    ],
  },
  {
    id: 'ui-slider',
    name: 'Range Slider',
    category: 'ui' as any,
    icon: '🎚️',
    color: '#8B5CF6',
    description: 'Range slider input',
    configFields: [
      { name: 'min', type: 'number', required: false, description: 'Minimum value', default: 0 },
      { name: 'max', type: 'number', required: false, description: 'Maximum value', default: 100 },
      { name: 'step', type: 'number', required: false, description: 'Step increment', default: 1 },
    ],
    inputPorts: [
      { id: 'value', name: 'Value', type: ['number'], required: false, description: 'Slider value' },
      { id: 'onChange', name: 'On Change', type: ['function'], required: false, description: 'Change handler' },
    ],
    outputPorts: [
      { id: 'component', name: 'Component', type: 'component', description: 'Slider component' },
    ],
  },
  {
    id: 'ui-select',
    name: 'Select Dropdown',
    category: 'ui' as any,
    icon: '🔽',
    color: '#8B5CF6',
    description: 'Select dropdown input',
    configFields: [
      { name: 'multiple', type: 'boolean', required: false, description: 'Multi-select', default: false },
      { name: 'searchable', type: 'boolean', required: false, description: 'Enable search', default: false },
    ],
    inputPorts: [
      { id: 'options', name: 'Options', type: ['array'], required: true, description: 'Select options' },
      { id: 'value', name: 'Value', type: ['string', 'array'], required: false, description: 'Selected value(s)' },
      { id: 'onChange', name: 'On Change', type: ['function'], required: false, description: 'Change handler' },
    ],
    outputPorts: [
      { id: 'component', name: 'Component', type: 'component', description: 'Select component' },
    ],
  },
  {
    id: 'textarea',
    name: 'Textarea',
    category: 'ui' as any,
    icon: '📄',
    color: '#8B5CF6',
    description: 'Multi-line text input area',
    configFields: [
      { name: 'rows', type: 'number', required: false, description: 'Number of rows', default: 4 },
      { name: 'placeholder', type: 'string', required: false, description: 'Placeholder text' },
      { name: 'required', type: 'boolean', required: false, description: 'Required field', default: false },
      { name: 'disabled', type: 'boolean', required: false, description: 'Disabled state', default: false },
      { name: 'maxLength', type: 'number', required: false, description: 'Maximum character length' },
      { name: 'resize', type: 'select', required: false, description: 'Resize behavior', options: ['none', 'both', 'horizontal', 'vertical'], default: 'vertical' },
    ],
    inputPorts: [
      { id: 'value', name: 'Value', type: ['string'], required: false, description: 'Textarea value' },
      { id: 'onChange', name: 'On Change', type: ['function'], required: false, description: 'Change handler' },
    ],
    outputPorts: [
      { id: 'component', name: 'Component', type: 'component', description: 'Textarea component' },
      { id: 'value', name: 'Value', type: 'string', description: 'Current text value' },
    ],
    codeTemplate: `<textarea
  value={{{input.value}}}
  onChange={{{input.onChange}}}
  rows={{{config.rows}}}
  placeholder="{{config.placeholder}}"
  required={{{config.required}}}
  disabled={{{config.disabled}}}
  maxLength={{{config.maxLength}}}
  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-{{config.resize}}"
/>`,
  },
  {
    id: 'icon',
    name: 'Icon',
    category: 'ui' as any,
    icon: '✨',
    color: '#8B5CF6',
    description: 'Display icons from popular icon libraries',
    configFields: [
      { name: 'library', type: 'select', required: false, description: 'Icon library', options: ['lucide', 'heroicons', 'feather', 'emoji'], default: 'lucide' },
      { name: 'size', type: 'select', required: false, description: 'Icon size', options: ['xs', 'sm', 'md', 'lg', 'xl'], default: 'md' },
      { name: 'color', type: 'string', required: false, description: 'Icon color (CSS)', default: 'currentColor' },
      { name: 'strokeWidth', type: 'number', required: false, description: 'Stroke width', default: 2 },
    ],
    inputPorts: [
      { id: 'icon', name: 'Icon Name', type: ['string'], required: true, description: 'Icon name or emoji' },
      { id: 'onClick', name: 'On Click', type: ['function'], required: false, description: 'Click handler' },
    ],
    outputPorts: [
      { id: 'component', name: 'Component', type: 'component', description: 'Icon component' },
    ],
    codeTemplate: `const sizeMap = { xs: 12, sm: 16, md: 20, lg: 24, xl: 32 }
const iconSize = sizeMap['{{config.size}}']
{{{config.library}} === 'emoji' ? (
  <span
    onClick={{{input.onClick}}}
    className="inline-flex items-center justify-center cursor-pointer"
    style={{ fontSize: iconSize }}
  >
    {{{input.icon}}}
  </span>
) : (
  <div
    onClick={{{input.onClick}}}
    className="inline-flex items-center justify-center cursor-pointer"
  >
    {/* Icon from {{config.library}} library */}
    <svg
      width={iconSize}
      height={iconSize}
      stroke="{{config.color}}"
      strokeWidth={{{config.strokeWidth}}}
      fill="none"
      className="icon"
    >
      {/* Dynamic icon rendering based on library */}
    </svg>
  </div>
)}`,
  },
]
