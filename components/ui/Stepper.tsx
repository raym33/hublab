/**
 * Stepper Component
 * Multi-step progress indicator
 */

import React from 'react'
import { cn } from '@/lib/utils'

export interface Step {
  label: string
  description?: string
  icon?: React.ReactNode
}

export interface StepperProps {
  steps: Step[]
  currentStep: number
  orientation?: 'horizontal' | 'vertical'
  variant?: 'default' | 'dots' | 'simple'
  className?: string
}

const Stepper = ({
  steps,
  currentStep,
  orientation = 'horizontal',
  variant = 'default',
  className
}: StepperProps) => {
  const isHorizontal = orientation === 'horizontal'

  if (variant === 'dots') {
    return (
      <div
        className={cn(
          'flex gap-2',
          !isHorizontal && 'flex-col',
          className
        )}
      >
        {steps.map((step, index) => {
          const isActive = index === currentStep
          const isCompleted = index < currentStep

          return (
            <div
              key={index}
              className={cn(
                'flex items-center gap-2',
                !isHorizontal && 'flex-col'
              )}
            >
              <div
                className={cn(
                  'w-3 h-3 rounded-full transition-all',
                  isCompleted && 'bg-green-600',
                  isActive && 'bg-blue-600 ring-4 ring-blue-100',
                  !isCompleted && !isActive && 'bg-gray-300'
                )}
              />
              {isHorizontal && index < steps.length - 1 && (
                <div
                  className={cn(
                    'h-0.5 w-8',
                    index < currentStep ? 'bg-green-600' : 'bg-gray-300'
                  )}
                />
              )}
            </div>
          )
        })}
      </div>
    )
  }

  if (variant === 'simple') {
    return (
      <div className={cn('text-sm text-gray-600 dark:text-gray-400', className)}>
        Step {currentStep + 1} of {steps.length}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex',
        isHorizontal ? 'flex-row items-center' : 'flex-col',
        className
      )}
    >
      {steps.map((step, index) => {
        const isActive = index === currentStep
        const isCompleted = index < currentStep

        return (
          <React.Fragment key={index}>
            <div
              className={cn(
                'flex items-center gap-3',
                !isHorizontal && 'w-full'
              )}
            >
              {/* Step Circle */}
              <div
                className={cn(
                  'flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-all',
                  isCompleted && 'bg-green-600 text-white',
                  isActive && 'bg-blue-600 text-white ring-4 ring-blue-100',
                  !isCompleted && !isActive && 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                )}
              >
                {isCompleted ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : step.icon ? (
                  step.icon
                ) : (
                  index + 1
                )}
              </div>

              {/* Step Content */}
              <div className={cn('flex-1', !isHorizontal && 'mb-4')}>
                <div
                  className={cn(
                    'font-medium',
                    isActive && 'text-blue-600 dark:text-blue-400',
                    isCompleted && 'text-green-600 dark:text-green-400',
                    !isActive && !isCompleted && 'text-gray-600 dark:text-gray-400'
                  )}
                >
                  {step.label}
                </div>
                {step.description && (
                  <div className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                    {step.description}
                  </div>
                )}
              </div>
            </div>

            {/* Connector */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'transition-all',
                  isHorizontal
                    ? 'h-0.5 flex-1 mx-2'
                    : 'w-0.5 h-8 ml-5',
                  index < currentStep ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-700'
                )}
              />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

export default Stepper
