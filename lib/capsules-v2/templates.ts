/**
 * Templates predefinidos usando las cápsulas V2
 */

import type { AppComposition } from './types'

export const TEMPLATES: Record<string, AppComposition> = {
  'todo-app': {
    name: 'Todo App',
    description: 'A simple and functional todo list application',
    layout: 'single',
    capsules: [
      {
        capsuleId: 'todolist',
        instanceId: 'main',
        props: {
          title: 'My Tasks'
        }
      }
    ]
  },

  'calculator': {
    name: 'Calculator App',
    description: 'Simple calculator with counter',
    layout: 'grid',
    capsules: [
      {
        capsuleId: 'counter',
        instanceId: 'calc1',
        props: {
          title: 'Counter 1',
          initial: 0
        }
      },
      {
        capsuleId: 'counter',
        instanceId: 'calc2',
        props: {
          title: 'Counter 2',
          initial: 10
        }
      }
    ]
  },

  'contact-form': {
    name: 'Contact Form',
    description: 'Professional contact form',
    layout: 'single',
    capsules: [
      {
        capsuleId: 'form',
        instanceId: 'contact',
        props: {
          title: 'Get in Touch',
          fields: [
            { name: 'name', label: 'Full Name', type: 'text' },
            { name: 'email', label: 'Email Address', type: 'email' },
            { name: 'message', label: 'Message', type: 'textarea' }
          ]
        }
      }
    ]
  },

  'dashboard': {
    name: 'Dashboard',
    description: 'Simple dashboard with cards and stats',
    layout: 'grid',
    capsules: [
      {
        capsuleId: 'card',
        instanceId: 'card1',
        props: {
          title: 'Total Users',
          content: '1,234 active users this month'
        }
      },
      {
        capsuleId: 'card',
        instanceId: 'card2',
        props: {
          title: 'Revenue',
          content: '$12,345 in total revenue'
        }
      },
      {
        capsuleId: 'card',
        instanceId: 'card3',
        props: {
          title: 'Tasks Completed',
          content: '89% completion rate'
        }
      },
      {
        capsuleId: 'list',
        instanceId: 'tasks',
        props: {
          title: 'Recent Activity',
          items: ['User John signed up', 'New order received', 'Payment processed']
        }
      }
    ]
  },

  'timer-app': {
    name: 'Timer & Counter',
    description: 'Productivity timer and counter application',
    layout: 'grid',
    capsules: [
      {
        capsuleId: 'timer',
        instanceId: 'pomodoro',
        props: {
          title: 'Pomodoro Timer',
          seconds: 1500
        }
      },
      {
        capsuleId: 'counter',
        instanceId: 'sessions',
        props: {
          title: 'Sessions Completed',
          initial: 0
        }
      }
    ]
  },

  'tabs-demo': {
    name: 'Tabbed Interface',
    description: 'Multi-tab content interface',
    layout: 'single',
    capsules: [
      {
        capsuleId: 'tabs',
        instanceId: 'main',
        props: {
          tabs: [
            { label: 'Home', content: 'Welcome to our application!' },
            { label: 'Features', content: 'Explore our amazing features' },
            { label: 'About', content: 'Learn more about us' },
            { label: 'Contact', content: 'Get in touch with our team' }
          ]
        }
      }
    ]
  },

  'ui-components': {
    name: 'UI Components Showcase',
    description: 'Collection of reusable UI components',
    layout: 'grid',
    capsules: [
      {
        capsuleId: 'button',
        instanceId: 'btn1',
        props: {
          text: 'Primary Button',
          variant: 'primary'
        }
      },
      {
        capsuleId: 'button',
        instanceId: 'btn2',
        props: {
          text: 'Secondary Button',
          variant: 'secondary'
        }
      },
      {
        capsuleId: 'button',
        instanceId: 'btn3',
        props: {
          text: 'Danger Button',
          variant: 'danger'
        }
      },
      {
        capsuleId: 'input',
        instanceId: 'input1',
        props: {
          label: 'Username',
          placeholder: 'Enter your username'
        }
      },
      {
        capsuleId: 'input',
        instanceId: 'input2',
        props: {
          label: 'Password',
          placeholder: 'Enter your password',
          type: 'password'
        }
      },
      {
        capsuleId: 'modal',
        instanceId: 'modal1',
        props: {
          title: 'Welcome!',
          content: 'Click the button to see this modal in action.'
        }
      }
    ]
  },

  'landing-page': {
    name: 'Landing Page',
    description: 'Simple landing page with sections',
    layout: 'flex',
    capsules: [
      {
        capsuleId: 'card',
        instanceId: 'hero',
        props: {
          title: 'Welcome to Our Product',
          content: 'The best solution for your business needs'
        }
      },
      {
        capsuleId: 'card',
        instanceId: 'feature1',
        props: {
          title: 'Fast & Reliable',
          content: 'Lightning-fast performance you can count on'
        }
      },
      {
        capsuleId: 'card',
        instanceId: 'feature2',
        props: {
          title: 'Easy to Use',
          content: 'Intuitive interface that anyone can master'
        }
      },
      {
        capsuleId: 'card',
        instanceId: 'feature3',
        props: {
          title: 'Secure',
          content: 'Enterprise-grade security for your data'
        }
      },
      {
        capsuleId: 'form',
        instanceId: 'signup',
        props: {
          title: 'Get Started',
          fields: [
            { name: 'email', label: 'Email', type: 'email' }
          ]
        }
      }
    ]
  }
}

export function getTemplate(id: string): AppComposition | null {
  return TEMPLATES[id] || null
}

export function getAllTemplates(): Array<{ id: string; composition: AppComposition }> {
  return Object.entries(TEMPLATES).map(([id, composition]) => ({
    id,
    composition
  }))
}
