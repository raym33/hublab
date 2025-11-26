/**
 * Workflow Engine - HubLab Workflow Builder Capsule
 *
 * This module exports the workflow execution engine and related utilities.
 */

export {
  WorkflowEngine,
  executeWorkflowById,
  registerNodeExecutor,
  getRegisteredExecutors,
  type ExecutionContext,
  type ExecutionLogEntry,
  type ExecutionResult,
  type NodeExecutionResult
} from './engine'

export {
  registerConditionNodes,
  evaluateCondition,
  evaluateConditionGroup,
  evaluateExpression,
  getNestedValue,
  type ComparisonOperator,
  type LogicalOperator,
  type Condition,
  type ConditionGroup
} from './condition-nodes'

export {
  registerIntegrationNodes
} from './integration-nodes'

// Auto-register all nodes when module is imported
import { registerConditionNodes } from './condition-nodes'
import { registerIntegrationNodes } from './integration-nodes'
registerConditionNodes()
registerIntegrationNodes()
