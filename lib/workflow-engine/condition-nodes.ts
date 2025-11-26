/**
 * Condition Nodes - IF/ELSE, Switch, and logical operators
 *
 * These nodes enable conditional branching in workflows.
 */

import { registerNodeExecutor } from './engine'

// ============================================
// TYPES
// ============================================

export type ComparisonOperator =
  | 'equals'
  | 'not_equals'
  | 'greater_than'
  | 'less_than'
  | 'greater_or_equal'
  | 'less_or_equal'
  | 'contains'
  | 'not_contains'
  | 'starts_with'
  | 'ends_with'
  | 'is_empty'
  | 'is_not_empty'
  | 'is_null'
  | 'is_not_null'
  | 'matches_regex'

export type LogicalOperator = 'and' | 'or'

export interface Condition {
  field: string
  operator: ComparisonOperator
  value?: unknown
}

export interface ConditionGroup {
  operator: LogicalOperator
  conditions: (Condition | ConditionGroup)[]
}

// ============================================
// EVALUATION FUNCTIONS
// ============================================

/**
 * Get nested value from object using dot notation
 * e.g., getNestedValue({ a: { b: 1 } }, 'a.b') => 1
 */
function getNestedValue(obj: unknown, path: string): unknown {
  if (!path) return obj
  if (typeof obj !== 'object' || obj === null) return undefined

  const parts = path.split('.')
  let current: unknown = obj

  for (const part of parts) {
    if (current === null || current === undefined) return undefined
    if (typeof current !== 'object') return undefined

    current = (current as Record<string, unknown>)[part]
  }

  return current
}

/**
 * Evaluate a single condition
 */
function evaluateCondition(
  condition: Condition,
  data: Record<string, unknown>
): boolean {
  const fieldValue = getNestedValue(data, condition.field)
  const compareValue = condition.value

  switch (condition.operator) {
    case 'equals':
      return fieldValue === compareValue

    case 'not_equals':
      return fieldValue !== compareValue

    case 'greater_than':
      return Number(fieldValue) > Number(compareValue)

    case 'less_than':
      return Number(fieldValue) < Number(compareValue)

    case 'greater_or_equal':
      return Number(fieldValue) >= Number(compareValue)

    case 'less_or_equal':
      return Number(fieldValue) <= Number(compareValue)

    case 'contains':
      if (typeof fieldValue === 'string' && typeof compareValue === 'string') {
        return fieldValue.toLowerCase().includes(compareValue.toLowerCase())
      }
      if (Array.isArray(fieldValue)) {
        return fieldValue.includes(compareValue)
      }
      return false

    case 'not_contains':
      if (typeof fieldValue === 'string' && typeof compareValue === 'string') {
        return !fieldValue.toLowerCase().includes(compareValue.toLowerCase())
      }
      if (Array.isArray(fieldValue)) {
        return !fieldValue.includes(compareValue)
      }
      return true

    case 'starts_with':
      if (typeof fieldValue === 'string' && typeof compareValue === 'string') {
        return fieldValue.toLowerCase().startsWith(compareValue.toLowerCase())
      }
      return false

    case 'ends_with':
      if (typeof fieldValue === 'string' && typeof compareValue === 'string') {
        return fieldValue.toLowerCase().endsWith(compareValue.toLowerCase())
      }
      return false

    case 'is_empty':
      if (fieldValue === null || fieldValue === undefined) return true
      if (typeof fieldValue === 'string') return fieldValue.trim() === ''
      if (Array.isArray(fieldValue)) return fieldValue.length === 0
      if (typeof fieldValue === 'object') return Object.keys(fieldValue).length === 0
      return false

    case 'is_not_empty':
      if (fieldValue === null || fieldValue === undefined) return false
      if (typeof fieldValue === 'string') return fieldValue.trim() !== ''
      if (Array.isArray(fieldValue)) return fieldValue.length > 0
      if (typeof fieldValue === 'object') return Object.keys(fieldValue).length > 0
      return true

    case 'is_null':
      return fieldValue === null || fieldValue === undefined

    case 'is_not_null':
      return fieldValue !== null && fieldValue !== undefined

    case 'matches_regex':
      if (typeof fieldValue === 'string' && typeof compareValue === 'string') {
        try {
          const regex = new RegExp(compareValue)
          return regex.test(fieldValue)
        } catch {
          return false
        }
      }
      return false

    default:
      return false
  }
}

/**
 * Evaluate a condition group (AND/OR logic)
 */
function evaluateConditionGroup(
  group: ConditionGroup,
  data: Record<string, unknown>
): boolean {
  if (group.conditions.length === 0) return true

  if (group.operator === 'and') {
    return group.conditions.every(cond => {
      if ('operator' in cond && ('conditions' in cond)) {
        return evaluateConditionGroup(cond as ConditionGroup, data)
      }
      return evaluateCondition(cond as Condition, data)
    })
  } else {
    return group.conditions.some(cond => {
      if ('operator' in cond && ('conditions' in cond)) {
        return evaluateConditionGroup(cond as ConditionGroup, data)
      }
      return evaluateCondition(cond as Condition, data)
    })
  }
}

/**
 * Simple expression evaluator for basic conditions
 * Supports: ==, !=, >, <, >=, <=, &&, ||
 */
function evaluateExpression(expression: string, data: Record<string, unknown>): boolean {
  try {
    // Replace field references with actual values
    // {{field}} or ${field} syntax
    let evalExpr = expression

    // Replace {{field}} syntax
    evalExpr = evalExpr.replace(/\{\{([^}]+)\}\}/g, (_, field) => {
      const value = getNestedValue(data, field.trim())
      return JSON.stringify(value)
    })

    // Replace ${field} syntax
    evalExpr = evalExpr.replace(/\$\{([^}]+)\}/g, (_, field) => {
      const value = getNestedValue(data, field.trim())
      return JSON.stringify(value)
    })

    // Simple safe evaluation (no eval!)
    // Parse basic comparisons
    const comparisons = [
      { op: '===', fn: (a: unknown, b: unknown) => a === b },
      { op: '!==', fn: (a: unknown, b: unknown) => a !== b },
      { op: '==', fn: (a: unknown, b: unknown) => a == b },
      { op: '!=', fn: (a: unknown, b: unknown) => a != b },
      { op: '>=', fn: (a: unknown, b: unknown) => Number(a) >= Number(b) },
      { op: '<=', fn: (a: unknown, b: unknown) => Number(a) <= Number(b) },
      { op: '>', fn: (a: unknown, b: unknown) => Number(a) > Number(b) },
      { op: '<', fn: (a: unknown, b: unknown) => Number(a) < Number(b) },
    ]

    for (const { op, fn } of comparisons) {
      if (evalExpr.includes(op)) {
        const [left, right] = evalExpr.split(op).map(s => s.trim())
        const leftVal = JSON.parse(left)
        const rightVal = JSON.parse(right)
        return fn(leftVal, rightVal)
      }
    }

    // Try to parse as boolean
    const parsed = JSON.parse(evalExpr)
    return Boolean(parsed)
  } catch {
    // If parsing fails, treat non-empty string as true
    return expression.trim().length > 0
  }
}

// ============================================
// NODE EXECUTORS
// ============================================

/**
 * Register all condition node executors
 */
export function registerConditionNodes(): void {
  /**
   * IF Node - Evaluates a condition and outputs to true/false branches
   *
   * Inputs:
   *   - input: any data to evaluate
   *   - condition: Condition or ConditionGroup object
   *   - expression: string expression (alternative to condition)
   *
   * Outputs:
   *   - result: boolean (true/false)
   *   - value: the input value (passed through)
   *   - branch: 'true' or 'false' string for routing
   */
  registerNodeExecutor('if-condition', async (node, inputs) => {
    const inputData = inputs.input ?? inputs.data ?? inputs

    let result = false

    // Check for condition object
    if (node.inputs.condition) {
      const condition = node.inputs.condition as Condition | ConditionGroup

      if ('conditions' in condition) {
        result = evaluateConditionGroup(condition as ConditionGroup, inputData as Record<string, unknown>)
      } else {
        result = evaluateCondition(condition as Condition, inputData as Record<string, unknown>)
      }
    }
    // Check for expression string
    else if (node.inputs.expression) {
      result = evaluateExpression(
        node.inputs.expression as string,
        inputData as Record<string, unknown>
      )
    }
    // Check for simple field comparison
    else if (node.inputs.field && node.inputs.operator) {
      result = evaluateCondition(
        {
          field: node.inputs.field as string,
          operator: node.inputs.operator as ComparisonOperator,
          value: node.inputs.value
        },
        inputData as Record<string, unknown>
      )
    }

    return {
      success: true,
      output: {
        result,
        value: inputData,
        branch: result ? 'true' : 'false',
        // Special flag for engine to handle branching
        __conditional: true,
        __branch: result ? 'true' : 'false'
      }
    }
  })

  /**
   * IF-ELSE Node - Similar to IF but with explicit else handling
   */
  registerNodeExecutor('if-else', async (node, inputs) => {
    const inputData = inputs.input ?? inputs.data ?? inputs

    let result = false

    if (node.inputs.condition) {
      const condition = node.inputs.condition as Condition | ConditionGroup

      if ('conditions' in condition) {
        result = evaluateConditionGroup(condition as ConditionGroup, inputData as Record<string, unknown>)
      } else {
        result = evaluateCondition(condition as Condition, inputData as Record<string, unknown>)
      }
    } else if (node.inputs.expression) {
      result = evaluateExpression(
        node.inputs.expression as string,
        inputData as Record<string, unknown>
      )
    } else if (node.inputs.field && node.inputs.operator) {
      result = evaluateCondition(
        {
          field: node.inputs.field as string,
          operator: node.inputs.operator as ComparisonOperator,
          value: node.inputs.value
        },
        inputData as Record<string, unknown>
      )
    }

    return {
      success: true,
      output: {
        result,
        then: result ? inputData : null,
        else: result ? null : inputData,
        branch: result ? 'then' : 'else',
        __conditional: true,
        __branch: result ? 'then' : 'else'
      }
    }
  })

  /**
   * Switch Node - Multiple branch selection based on value
   */
  registerNodeExecutor('switch', async (node, inputs) => {
    const inputData = inputs.input ?? inputs.data ?? inputs
    const switchValue = node.inputs.field
      ? getNestedValue(inputData as Record<string, unknown>, node.inputs.field as string)
      : inputData

    const cases = (node.inputs.cases || []) as Array<{ value: unknown; label: string }>
    const defaultCase = node.inputs.default as string | undefined

    let matchedCase = defaultCase || 'default'

    for (const c of cases) {
      if (switchValue === c.value) {
        matchedCase = c.label
        break
      }
    }

    return {
      success: true,
      output: {
        value: inputData,
        switchValue,
        matchedCase,
        branch: matchedCase,
        __conditional: true,
        __branch: matchedCase
      }
    }
  })

  /**
   * AND Gate - All inputs must be truthy
   */
  registerNodeExecutor('and-gate', async (_node, inputs) => {
    const values = Object.values(inputs).filter(v => v !== undefined)
    const result = values.every(v => Boolean(v))

    return {
      success: true,
      output: {
        result,
        inputs: values,
        branch: result ? 'true' : 'false',
        __conditional: true,
        __branch: result ? 'true' : 'false'
      }
    }
  })

  /**
   * OR Gate - At least one input must be truthy
   */
  registerNodeExecutor('or-gate', async (_node, inputs) => {
    const values = Object.values(inputs).filter(v => v !== undefined)
    const result = values.some(v => Boolean(v))

    return {
      success: true,
      output: {
        result,
        inputs: values,
        branch: result ? 'true' : 'false',
        __conditional: true,
        __branch: result ? 'true' : 'false'
      }
    }
  })

  /**
   * NOT Gate - Inverts boolean value
   */
  registerNodeExecutor('not-gate', async (_node, inputs) => {
    const value = inputs.input ?? inputs.value ?? inputs.data
    const result = !Boolean(value)

    return {
      success: true,
      output: {
        result,
        originalValue: value,
        branch: result ? 'true' : 'false',
        __conditional: true,
        __branch: result ? 'true' : 'false'
      }
    }
  })

  /**
   * Compare Node - Compare two values
   */
  registerNodeExecutor('compare', async (node, inputs) => {
    const left = inputs.left ?? inputs.a ?? inputs.input
    const right = inputs.right ?? inputs.b ?? node.inputs.compareValue
    const operator = (node.inputs.operator || 'equals') as ComparisonOperator

    const result = evaluateCondition(
      { field: '', operator, value: right },
      { '': left }
    )

    return {
      success: true,
      output: {
        result,
        left,
        right,
        operator,
        branch: result ? 'true' : 'false',
        __conditional: true,
        __branch: result ? 'true' : 'false'
      }
    }
  })

  /**
   * Filter Branch Node - Only passes data if condition is met
   */
  registerNodeExecutor('filter-branch', async (node, inputs) => {
    const inputData = inputs.input ?? inputs.data ?? inputs
    let shouldPass = false

    if (node.inputs.condition) {
      const condition = node.inputs.condition as Condition | ConditionGroup

      if ('conditions' in condition) {
        shouldPass = evaluateConditionGroup(condition as ConditionGroup, inputData as Record<string, unknown>)
      } else {
        shouldPass = evaluateCondition(condition as Condition, inputData as Record<string, unknown>)
      }
    } else if (node.inputs.expression) {
      shouldPass = evaluateExpression(
        node.inputs.expression as string,
        inputData as Record<string, unknown>
      )
    }

    return {
      success: true,
      output: shouldPass ? {
        passed: true,
        value: inputData,
        __conditional: false // Don't branch, just filter
      } : {
        passed: false,
        value: null,
        __skip_downstream: true // Signal to skip downstream nodes
      }
    }
  })

  console.log('[WorkflowEngine] Condition nodes registered')
}

// Export evaluation functions for external use
export {
  evaluateCondition,
  evaluateConditionGroup,
  evaluateExpression,
  getNestedValue
}
