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
