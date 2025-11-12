import { CompleteCapsule } from './complete-capsules'

// 📊 DATA VISUALIZATION (15 capsules)
export const dataVizCapsules: CompleteCapsule[] = [
  {
    id: 'chart-line',
    name: 'Line Chart',
    category: 'visualization' as any,
    icon: '📈',
    color: '#10B981',
    description: 'Line chart visualization',
    configFields: [
      { name: 'smooth', type: 'boolean', required: false, description: 'Smooth curves', default: true },
      { name: 'showDots', type: 'boolean', required: false, description: 'Show data points', default: true },
      { name: 'showGrid', type: 'boolean', required: false, description: 'Show grid', default: true },
    ],
    inputPorts: [
      { id: 'data', name: 'Data', type: ['array'], required: true, description: 'Chart data' },
      { id: 'xKey', name: 'X Key', type: ['string'], required: true, description: 'X-axis data key' },
      { id: 'yKey', name: 'Y Key', type: ['string'], required: true, description: 'Y-axis data key' },
    ],
    outputPorts: [
      { id: 'component', name: 'Component', type: 'component', description: 'Line chart component' },
    ],
    npmPackage: 'recharts',
  },
  {
    id: 'chart-bar',
    name: 'Bar Chart',
    category: 'visualization' as any,
    icon: '📊',
    color: '#10B981',
    description: 'Bar chart visualization',
    configFields: [
      { name: 'orientation', type: 'select', required: false, description: 'Chart orientation', options: ['vertical', 'horizontal'], default: 'vertical' },
      { name: 'stacked', type: 'boolean', required: false, description: 'Stack bars', default: false },
    ],
    inputPorts: [
      { id: 'data', name: 'Data', type: ['array'], required: true, description: 'Chart data' },
      { id: 'xKey', name: 'X Key', type: ['string'], required: true, description: 'X-axis data key' },
      { id: 'yKey', name: 'Y Key', type: ['string'], required: true, description: 'Y-axis data key' },
    ],
    outputPorts: [
      { id: 'component', name: 'Component', type: 'component', description: 'Bar chart component' },
    ],
    npmPackage: 'recharts',
  },
  {
    id: 'chart-pie',
    name: 'Pie Chart',
    category: 'visualization' as any,
    icon: '🥧',
    color: '#10B981',
    description: 'Pie chart visualization',
    configFields: [
      { name: 'donut', type: 'boolean', required: false, description: 'Donut style', default: false },
      { name: 'showLabels', type: 'boolean', required: false, description: 'Show labels', default: true },
    ],
    inputPorts: [
      { id: 'data', name: 'Data', type: ['array'], required: true, description: 'Chart data' },
      { id: 'nameKey', name: 'Name Key', type: ['string'], required: true, description: 'Label data key' },
      { id: 'valueKey', name: 'Value Key', type: ['string'], required: true, description: 'Value data key' },
    ],
    outputPorts: [
      { id: 'component', name: 'Component', type: 'component', description: 'Pie chart component' },
    ],
    npmPackage: 'recharts',
  },
  {
    id: 'chart-area',
    name: 'Area Chart',
    category: 'visualization' as any,
    icon: '📈',
    color: '#10B981',
    description: 'Area chart visualization',
    configFields: [
      { name: 'stacked', type: 'boolean', required: false, description: 'Stack areas', default: false },
      { name: 'gradient', type: 'boolean', required: false, description: 'Use gradient fill', default: true },
    ],
    inputPorts: [
      { id: 'data', name: 'Data', type: ['array'], required: true, description: 'Chart data' },
      { id: 'xKey', name: 'X Key', type: ['string'], required: true, description: 'X-axis data key' },
      { id: 'yKey', name: 'Y Key', type: ['string'], required: true, description: 'Y-axis data key' },
    ],
    outputPorts: [
      { id: 'component', name: 'Component', type: 'component', description: 'Area chart component' },
    ],
    npmPackage: 'recharts',
  },
  {
    id: 'stat-card',
    name: 'Stat Card',
    category: 'visualization' as any,
    icon: '📊',
    color: '#10B981',
    description: 'Statistical display card',
    configFields: [
      { name: 'showTrend', type: 'boolean', required: false, description: 'Show trend indicator', default: true },
    ],
    inputPorts: [
      { id: 'label', name: 'Label', type: ['string'], required: true, description: 'Stat label' },
      { id: 'value', name: 'Value', type: ['string', 'number'], required: true, description: 'Stat value' },
      { id: 'change', name: 'Change', type: ['number'], required: false, description: 'Percentage change' },
      { id: 'icon', name: 'Icon', type: ['component'], required: false, description: 'Icon component' },
    ],
    outputPorts: [
      { id: 'component', name: 'Component', type: 'component', description: 'Stat card component' },
    ],
  },
]

// 📝 FORMS & VALIDATION (20 capsules)
export const formCapsules: CompleteCapsule[] = [
  {
    id: 'form-container',
    name: 'Form Container',
    category: 'forms' as any,
    icon: '📝',
    color: '#F59E0B',
    description: 'Form wrapper with validation',
    configFields: [
      { name: 'validateOnBlur', type: 'boolean', required: false, description: 'Validate on blur', default: true },
      { name: 'validateOnChange', type: 'boolean', required: false, description: 'Validate on change', default: false },
    ],
    inputPorts: [
      { id: 'onSubmit', name: 'On Submit', type: ['function'], required: true, description: 'Submit handler' },
      { id: 'children', name: 'Children', type: ['component'], required: true, description: 'Form fields' },
    ],
    outputPorts: [
      { id: 'component', name: 'Component', type: 'component', description: 'Form component' },
    ],
    npmPackage: 'react-hook-form',
  },
  {
    id: 'form-text-input',
    name: 'Text Input with Validation',
    category: 'forms' as any,
    icon: '✏️',
    color: '#F59E0B',
    description: 'Validated text input field',
    configFields: [
      { name: 'type', type: 'select', required: true, description: 'Input type', options: ['text', 'email', 'password', 'tel', 'url'] },
      { name: 'required', type: 'boolean', required: false, description: 'Required field', default: false },
      { name: 'minLength', type: 'number', required: false, description: 'Min length' },
      { name: 'maxLength', type: 'number', required: false, description: 'Max length' },
    ],
    inputPorts: [
      { id: 'name', name: 'Name', type: ['string'], required: true, description: 'Field name' },
      { id: 'label', name: 'Label', type: ['string'], required: true, description: 'Field label' },
      { id: 'placeholder', name: 'Placeholder', type: ['string'], required: false, description: 'Placeholder text' },
    ],
    outputPorts: [
      { id: 'component', name: 'Component', type: 'component', description: 'Input component' },
    ],
  },
  {
    id: 'form-textarea',
    name: 'Textarea with Validation',
    category: 'forms' as any,
    icon: '📄',
    color: '#F59E0B',
    description: 'Validated textarea field',
    configFields: [
      { name: 'rows', type: 'number', required: false, description: 'Number of rows', default: 4 },
      { name: 'required', type: 'boolean', required: false, description: 'Required field', default: false },
      { name: 'maxLength', type: 'number', required: false, description: 'Max length' },
    ],
    inputPorts: [
      { id: 'name', name: 'Name', type: ['string'], required: true, description: 'Field name' },
      { id: 'label', name: 'Label', type: ['string'], required: true, description: 'Field label' },
      { id: 'placeholder', name: 'Placeholder', type: ['string'], required: false, description: 'Placeholder text' },
    ],
    outputPorts: [
      { id: 'component', name: 'Component', type: 'component', description: 'Textarea component' },
    ],
  },
  {
    id: 'form-file-upload',
    name: 'File Upload',
    category: 'forms' as any,
    icon: '📎',
    color: '#F59E0B',
    description: 'File upload input with preview',
    configFields: [
      { name: 'accept', type: 'string', required: false, description: 'Accepted file types', placeholder: 'image/*,.pdf' },
      { name: 'multiple', type: 'boolean', required: false, description: 'Multiple files', default: false },
      { name: 'maxSize', type: 'number', required: false, description: 'Max file size (MB)', default: 10 },
    ],
    inputPorts: [
      { id: 'name', name: 'Name', type: ['string'], required: true, description: 'Field name' },
      { id: 'label', name: 'Label', type: ['string'], required: true, description: 'Field label' },
      { id: 'onUpload', name: 'On Upload', type: ['function'], required: true, description: 'Upload handler' },
    ],
    outputPorts: [
      { id: 'component', name: 'Component', type: 'component', description: 'File upload component' },
    ],
  },
  {
    id: 'form-date-picker',
    name: 'Date Picker',
    category: 'forms' as any,
    icon: '📅',
    color: '#F59E0B',
    description: 'Date selection input',
    configFields: [
      { name: 'format', type: 'string', required: false, description: 'Date format', default: 'YYYY-MM-DD' },
      { name: 'minDate', type: 'string', required: false, description: 'Minimum date' },
      { name: 'maxDate', type: 'string', required: false, description: 'Maximum date' },
    ],
    inputPorts: [
      { id: 'name', name: 'Name', type: ['string'], required: true, description: 'Field name' },
      { id: 'label', name: 'Label', type: ['string'], required: true, description: 'Field label' },
      { id: 'value', name: 'Value', type: ['string'], required: false, description: 'Selected date' },
    ],
    outputPorts: [
      { id: 'component', name: 'Component', type: 'component', description: 'Date picker component' },
    ],
    npmPackage: 'react-datepicker',
  },
  {
    id: 'form-validation',
    name: 'Field Validator',
    category: 'forms' as any,
    icon: '✅',
    color: '#F59E0B',
    description: 'Custom field validation',
    configFields: [
      { name: 'validationType', type: 'select', required: true, description: 'Validation type', options: ['email', 'url', 'phone', 'custom', 'regex'] },
      { name: 'errorMessage', type: 'string', required: true, description: 'Error message' },
    ],
    inputPorts: [
      { id: 'value', name: 'Value', type: ['any'], required: true, description: 'Value to validate' },
      { id: 'pattern', name: 'Pattern', type: ['string'], required: false, description: 'Regex pattern (if regex type)' },
    ],
    outputPorts: [
      { id: 'isValid', name: 'Is Valid', type: 'boolean', description: 'Validation result' },
      { id: 'error', name: 'Error', type: 'string', description: 'Error message if invalid' },
    ],
  },
]

// 🎨 LAYOUT COMPONENTS (15 capsules)
export const layoutCapsules: CompleteCapsule[] = [
  {
    id: 'layout-container',
    name: 'Container',
    category: 'layout' as any,
    icon: '📦',
    color: '#6366F1',
    description: 'Responsive container',
    configFields: [
      { name: 'maxWidth', type: 'select', required: false, description: 'Max width', options: ['sm', 'md', 'lg', 'xl', '2xl', 'full'], default: 'lg' },
      { name: 'padding', type: 'select', required: false, description: 'Padding', options: ['none', 'sm', 'md', 'lg'], default: 'md' },
    ],
    inputPorts: [
      { id: 'children', name: 'Children', type: ['component'], required: true, description: 'Container content' },
    ],
    outputPorts: [
      { id: 'component', name: 'Component', type: 'component', description: 'Container component' },
    ],
  },
  {
    id: 'layout-grid',
    name: 'Grid Layout',
    category: 'layout' as any,
    icon: '▦',
    color: '#6366F1',
    description: 'CSS Grid layout',
    configFields: [
      { name: 'columns', type: 'select', required: false, description: 'Columns', options: ['1', '2', '3', '4', '6', '12'], default: '3' },
      { name: 'gap', type: 'select', required: false, description: 'Gap size', options: ['sm', 'md', 'lg'], default: 'md' },
      { name: 'responsive', type: 'boolean', required: false, description: 'Responsive columns', default: true },
    ],
    inputPorts: [
      { id: 'children', name: 'Children', type: ['component'], required: true, description: 'Grid items' },
    ],
    outputPorts: [
      { id: 'component', name: 'Component', type: 'component', description: 'Grid component' },
    ],
  },
  {
    id: 'layout-flex',
    name: 'Flex Layout',
    category: 'layout' as any,
    icon: '↔️',
    color: '#6366F1',
    description: 'Flexbox layout',
    configFields: [
      { name: 'direction', type: 'select', required: false, description: 'Flex direction', options: ['row', 'column'], default: 'row' },
      { name: 'justify', type: 'select', required: false, description: 'Justify content', options: ['start', 'center', 'end', 'between', 'around'], default: 'start' },
      { name: 'align', type: 'select', required: false, description: 'Align items', options: ['start', 'center', 'end', 'stretch'], default: 'stretch' },
      { name: 'gap', type: 'select', required: false, description: 'Gap size', options: ['sm', 'md', 'lg'], default: 'md' },
    ],
    inputPorts: [
      { id: 'children', name: 'Children', type: ['component'], required: true, description: 'Flex items' },
    ],
    outputPorts: [
      { id: 'component', name: 'Component', type: 'component', description: 'Flex component' },
    ],
  },
  {
    id: 'layout-stack',
    name: 'Stack',
    category: 'layout' as any,
    icon: '📚',
    color: '#6366F1',
    description: 'Vertical stack layout',
    configFields: [
      { name: 'spacing', type: 'select', required: false, description: 'Item spacing', options: ['xs', 'sm', 'md', 'lg', 'xl'], default: 'md' },
      { name: 'divider', type: 'boolean', required: false, description: 'Show dividers', default: false },
    ],
    inputPorts: [
      { id: 'children', name: 'Children', type: ['component'], required: true, description: 'Stack items' },
    ],
    outputPorts: [
      { id: 'component', name: 'Component', type: 'component', description: 'Stack component' },
    ],
  },
  {
    id: 'layout-sidebar',
    name: 'Sidebar Layout',
    category: 'layout' as any,
    icon: '📐',
    color: '#6366F1',
    description: 'Sidebar with main content',
    configFields: [
      { name: 'position', type: 'select', required: false, description: 'Sidebar position', options: ['left', 'right'], default: 'left' },
      { name: 'collapsible', type: 'boolean', required: false, description: 'Collapsible sidebar', default: true },
      { name: 'defaultCollapsed', type: 'boolean', required: false, description: 'Default collapsed', default: false },
    ],
    inputPorts: [
      { id: 'sidebar', name: 'Sidebar', type: ['component'], required: true, description: 'Sidebar content' },
      { id: 'main', name: 'Main', type: ['component'], required: true, description: 'Main content' },
    ],
    outputPorts: [
      { id: 'component', name: 'Component', type: 'component', description: 'Sidebar layout component' },
    ],
  },
  {
    id: 'layout-header',
    name: 'Header/Navbar',
    category: 'layout' as any,
    icon: '🔝',
    color: '#6366F1',
    description: 'Page header/navigation',
    configFields: [
      { name: 'sticky', type: 'boolean', required: false, description: 'Sticky header', default: true },
      { name: 'transparent', type: 'boolean', required: false, description: 'Transparent background', default: false },
    ],
    inputPorts: [
      { id: 'logo', name: 'Logo', type: ['component'], required: false, description: 'Logo component' },
      { id: 'navigation', name: 'Navigation', type: ['component'], required: false, description: 'Nav links' },
      { id: 'actions', name: 'Actions', type: ['component'], required: false, description: 'Action buttons' },
    ],
    outputPorts: [
      { id: 'component', name: 'Component', type: 'component', description: 'Header component' },
    ],
  },
  {
    id: 'layout-footer',
    name: 'Footer',
    category: 'layout' as any,
    icon: '🔚',
    color: '#6366F1',
    description: 'Page footer',
    configFields: [
      { name: 'columns', type: 'select', required: false, description: 'Footer columns', options: ['1', '2', '3', '4'], default: '3' },
    ],
    inputPorts: [
      { id: 'children', name: 'Children', type: ['component'], required: true, description: 'Footer content' },
    ],
    outputPorts: [
      { id: 'component', name: 'Component', type: 'component', description: 'Footer component' },
    ],
  },
]

// 🎭 ANIMATION COMPONENTS (10 capsules)
export const animationCapsules: CompleteCapsule[] = [
  {
    id: 'anim-fade',
    name: 'Fade Animation',
    category: 'animation' as any,
    icon: '✨',
    color: '#EC4899',
    description: 'Fade in/out animation',
    configFields: [
      { name: 'duration', type: 'number', required: false, description: 'Duration (ms)', default: 300 },
      { name: 'direction', type: 'select', required: false, description: 'Direction', options: ['in', 'out'], default: 'in' },
    ],
    inputPorts: [
      { id: 'show', name: 'Show', type: ['boolean'], required: true, description: 'Show/hide trigger' },
      { id: 'children', name: 'Children', type: ['component'], required: true, description: 'Content to animate' },
    ],
    outputPorts: [
      { id: 'component', name: 'Component', type: 'component', description: 'Animated component' },
    ],
    npmPackage: 'framer-motion',
  },
  {
    id: 'anim-slide',
    name: 'Slide Animation',
    category: 'animation' as any,
    icon: '➡️',
    color: '#EC4899',
    description: 'Slide in/out animation',
    configFields: [
      { name: 'direction', type: 'select', required: false, description: 'Slide direction', options: ['up', 'down', 'left', 'right'], default: 'up' },
      { name: 'duration', type: 'number', required: false, description: 'Duration (ms)', default: 300 },
    ],
    inputPorts: [
      { id: 'show', name: 'Show', type: ['boolean'], required: true, description: 'Show/hide trigger' },
      { id: 'children', name: 'Children', type: ['component'], required: true, description: 'Content to animate' },
    ],
    outputPorts: [
      { id: 'component', name: 'Component', type: 'component', description: 'Animated component' },
    ],
    npmPackage: 'framer-motion',
  },
  {
    id: 'anim-scale',
    name: 'Scale Animation',
    category: 'animation' as any,
    icon: '🔍',
    color: '#EC4899',
    description: 'Scale up/down animation',
    configFields: [
      { name: 'from', type: 'number', required: false, description: 'From scale', default: 0.95 },
      { name: 'to', type: 'number', required: false, description: 'To scale', default: 1 },
      { name: 'duration', type: 'number', required: false, description: 'Duration (ms)', default: 200 },
    ],
    inputPorts: [
      { id: 'show', name: 'Show', type: ['boolean'], required: true, description: 'Show/hide trigger' },
      { id: 'children', name: 'Children', type: ['component'], required: true, description: 'Content to animate' },
    ],
    outputPorts: [
      { id: 'component', name: 'Component', type: 'component', description: 'Animated component' },
    ],
    npmPackage: 'framer-motion',
  },
]
