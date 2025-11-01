/**
 * Simple composition generator based on keywords
 * (Fallback when AI generation fails)
 */
export function generateSimpleComposition(prompt: string, platform: string): any {
  const lowerPrompt = prompt.toLowerCase()

  // Detect app type from keywords
  if (lowerPrompt.includes('todo') || lowerPrompt.includes('task')) {
    return {
      name: 'Todo App',
      version: '1.0.0',
      platform: platform as any,
      description: prompt,
      rootCapsule: 'root',
      capsules: [
        {
          id: 'root',
          capsuleId: 'app-container',
          inputs: { title: 'My Tasks' }
        },
        {
          id: 'input',
          capsuleId: 'input-text',
          inputs: { placeholder: 'Add a new task...' }
        },
        {
          id: 'button',
          capsuleId: 'button-primary',
          inputs: { label: 'Add' }
        },
        {
          id: 'list',
          capsuleId: 'list-view',
          inputs: { items: [] }
        }
      ],
      connections: []
    }
  }

  if (lowerPrompt.includes('dashboard') || lowerPrompt.includes('analytics')) {
    return {
      name: 'Analytics Dashboard',
      version: '1.0.0',
      platform: platform as any,
      description: prompt,
      rootCapsule: 'root',
      capsules: [
        {
          id: 'root',
          capsuleId: 'app-container',
          inputs: { title: 'Dashboard' }
        },
        {
          id: 'chart',
          capsuleId: 'chart-line',
          inputs: { data: [] }
        },
        {
          id: 'table',
          capsuleId: 'data-table',
          inputs: {
            data: [],
            columns: [
              { id: 'name', label: 'Name' },
              { id: 'value', label: 'Value' }
            ]
          }
        }
      ],
      connections: []
    }
  }

  // Default: Simple app with container and text
  return {
    name: 'Simple App',
    version: '1.0.0',
    platform: platform as any,
    description: prompt,
    rootCapsule: 'root',
    capsules: [
      {
        id: 'root',
        capsuleId: 'app-container',
        inputs: { title: 'My App' }
      },
      {
        id: 'text',
        capsuleId: 'text-display',
        inputs: { text: prompt }
      }
    ],
    connections: []
  }
}