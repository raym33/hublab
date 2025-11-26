/**
 * Workflow Engine - Core execution engine for HubLab Workflow Builder
 *
 * This engine executes workflows by:
 * 1. Topologically sorting nodes based on connections
 * 2. Executing each node in order
 * 3. Passing data between connected nodes
 * 4. Logging execution details for each node
 */

import {
  WorkflowNode,
  WorkflowConnection,
  Workflow,
  WorkflowExecution,
  WorkflowExecutionLog,
  WorkflowLogLevel,
  WorkflowLogStatus,
  createExecution,
  updateExecution,
  createExecutionLog,
  getWorkflowById
} from '@/lib/supabase'

// ============================================
// TYPES
// ============================================

export interface ExecutionContext {
  executionId: string
  workflowId: string
  userId: string
  variables: Record<string, unknown>
  nodeOutputs: Map<string, unknown>
  logs: ExecutionLogEntry[]
  sequenceNumber: number
  startTime: number
  aborted: boolean
}

export interface ExecutionLogEntry {
  nodeId: string
  nodeType: string
  nodeLabel: string
  capsuleId: string
  level: WorkflowLogLevel
  message: string
  data?: Record<string, unknown>
  status: WorkflowLogStatus
  inputData?: Record<string, unknown>
  outputData?: Record<string, unknown>
  startedAt: string
  completedAt?: string
  durationMs?: number
  errorMessage?: string
  errorStack?: string
  sequenceNumber: number
}

export interface ExecutionResult {
  success: boolean
  executionId: string
  status: 'completed' | 'failed' | 'cancelled' | 'timeout'
  output?: Record<string, unknown>
  error?: string
  errorNodeId?: string
  logs: ExecutionLogEntry[]
  durationMs: number
  nodesCompleted: number
  nodesTotal: number
}

export interface NodeExecutionResult {
  success: boolean
  output?: unknown
  error?: string
  logs?: string[]
}

// ============================================
// NODE EXECUTORS
// ============================================

type NodeExecutor = (
  node: WorkflowNode,
  inputs: Record<string, unknown>,
  context: ExecutionContext
) => Promise<NodeExecutionResult>

// Registry of node executors by capsule category/type
const nodeExecutors: Record<string, NodeExecutor> = {
  // Default executor for UI components
  'default': async (node, inputs) => {
    return {
      success: true,
      output: {
        rendered: true,
        capsuleId: node.capsuleId,
        props: { ...node.inputs, ...inputs }
      }
    }
  },

  // Form inputs - pass through value
  'input-text': async (node, inputs) => {
    return {
      success: true,
      output: inputs.value ?? node.inputs.defaultValue ?? ''
    }
  },

  'input-number': async (node, inputs) => {
    return {
      success: true,
      output: Number(inputs.value ?? node.inputs.defaultValue ?? 0)
    }
  },

  // Button - trigger action
  'button-primary': async (node, inputs) => {
    return {
      success: true,
      output: {
        clicked: true,
        payload: inputs
      }
    }
  },

  'button-secondary': async (node, inputs) => {
    return {
      success: true,
      output: {
        clicked: true,
        payload: inputs
      }
    }
  },

  // Data transformers
  'data-filter': async (node, inputs) => {
    const data = inputs.data as unknown[]
    const filterFn = node.inputs.filterFn as string

    if (!Array.isArray(data)) {
      return { success: true, output: data }
    }

    try {
      // Simple filter implementation (in production, use a safe sandbox)
      const filtered = data.filter(() => true) // Placeholder
      return { success: true, output: filtered }
    } catch (error) {
      return {
        success: false,
        error: `Filter error: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  },

  'data-map': async (node, inputs) => {
    const data = inputs.data as unknown[]

    if (!Array.isArray(data)) {
      return { success: true, output: data }
    }

    return { success: true, output: data }
  },

  // Display components
  'toast': async (node, inputs) => {
    return {
      success: true,
      output: {
        displayed: true,
        message: inputs.message ?? node.inputs.message ?? 'Notification',
        type: node.inputs.type ?? 'info'
      }
    }
  },

  'modal': async (node, inputs) => {
    return {
      success: true,
      output: {
        opened: true,
        content: inputs.content ?? node.inputs.content
      }
    }
  },

  // Data visualization
  'chart-bar': async (node, inputs) => {
    return {
      success: true,
      output: {
        rendered: true,
        chartType: 'bar',
        data: inputs.data ?? node.inputs.data ?? []
      }
    }
  },

  'chart-line': async (node, inputs) => {
    return {
      success: true,
      output: {
        rendered: true,
        chartType: 'line',
        data: inputs.data ?? node.inputs.data ?? []
      }
    }
  },

  'chart-pie': async (node, inputs) => {
    return {
      success: true,
      output: {
        rendered: true,
        chartType: 'pie',
        data: inputs.data ?? node.inputs.data ?? []
      }
    }
  },

  // Tables
  'data-table': async (node, inputs) => {
    return {
      success: true,
      output: {
        rendered: true,
        rows: inputs.data ?? node.inputs.data ?? [],
        columns: node.inputs.columns ?? []
      }
    }
  },

  // Card containers
  'card': async (node, inputs) => {
    return {
      success: true,
      output: {
        rendered: true,
        title: node.inputs.title,
        content: inputs
      }
    }
  },

  // Search
  'search-input': async (node, inputs) => {
    return {
      success: true,
      output: {
        query: inputs.value ?? '',
        submitted: true
      }
    }
  },

  // Dropdown
  'dropdown-select': async (node, inputs) => {
    return {
      success: true,
      output: {
        selected: inputs.value ?? node.inputs.defaultValue,
        options: node.inputs.options ?? []
      }
    }
  },

  // List view
  'list-view': async (node, inputs) => {
    return {
      success: true,
      output: {
        rendered: true,
        items: inputs.data ?? node.inputs.items ?? []
      }
    }
  },

  // Badge
  'badge': async (node, inputs) => {
    return {
      success: true,
      output: {
        rendered: true,
        text: inputs.text ?? node.inputs.text ?? '',
        variant: node.inputs.variant ?? 'default'
      }
    }
  },

  // Media
  'carousel': async (node, inputs) => {
    return {
      success: true,
      output: {
        rendered: true,
        images: inputs.images ?? node.inputs.images ?? [],
        currentIndex: 0
      }
    }
  },

  'image': async (node, inputs) => {
    return {
      success: true,
      output: {
        rendered: true,
        src: inputs.src ?? node.inputs.src ?? '',
        alt: node.inputs.alt ?? ''
      }
    }
  }
}

// ============================================
// WORKFLOW ENGINE CLASS
// ============================================

export class WorkflowEngine {
  private workflow: Workflow
  private context: ExecutionContext
  private abortController: AbortController
  private timeoutId: NodeJS.Timeout | null = null

  constructor(workflow: Workflow, userId: string, executionId: string) {
    this.workflow = workflow
    this.abortController = new AbortController()
    this.context = {
      executionId,
      workflowId: workflow.id,
      userId,
      variables: {},
      nodeOutputs: new Map(),
      logs: [],
      sequenceNumber: 0,
      startTime: Date.now(),
      aborted: false
    }
  }

  /**
   * Execute the workflow
   */
  async execute(inputData: Record<string, unknown> = {}): Promise<ExecutionResult> {
    const startTime = Date.now()

    try {
      // Set timeout
      if (this.workflow.timeout_ms > 0) {
        this.timeoutId = setTimeout(() => {
          this.abort('Workflow execution timed out')
        }, this.workflow.timeout_ms)
      }

      // Update execution status to running
      await updateExecution(this.context.executionId, {
        status: 'running',
        started_at: new Date().toISOString(),
        nodes_total: this.workflow.nodes.length,
        input_data: inputData
      })

      // Log workflow start
      this.log('system', 'workflow', 'Workflow Execution', '', 'info',
        `Starting workflow execution: ${this.workflow.name}`, { inputData }, 'started')

      // Initialize variables with input data
      this.context.variables = { ...inputData }

      // Get execution order (topological sort)
      const executionOrder = this.getExecutionOrder()

      // Execute nodes in order
      let nodesCompleted = 0
      for (const nodeId of executionOrder) {
        if (this.context.aborted) {
          break
        }

        const node = this.workflow.nodes.find(n => n.id === nodeId)
        if (!node) continue

        // Update current node
        await updateExecution(this.context.executionId, {
          current_node_id: nodeId,
          nodes_completed: nodesCompleted
        })

        // Get inputs from connected nodes
        const inputs = this.getNodeInputs(node)

        // Execute node
        const result = await this.executeNode(node, inputs)

        if (!result.success) {
          // Node failed - stop execution
          const durationMs = Date.now() - startTime

          await updateExecution(this.context.executionId, {
            status: 'failed',
            completed_at: new Date().toISOString(),
            duration_ms: durationMs,
            error_message: result.error,
            error_node_id: nodeId,
            nodes_completed: nodesCompleted
          })

          // Save logs to database
          await this.saveLogs()

          return {
            success: false,
            executionId: this.context.executionId,
            status: 'failed',
            error: result.error,
            errorNodeId: nodeId,
            logs: this.context.logs,
            durationMs,
            nodesCompleted,
            nodesTotal: this.workflow.nodes.length
          }
        }

        // Store output
        this.context.nodeOutputs.set(nodeId, result.output)
        nodesCompleted++
      }

      // Clear timeout
      if (this.timeoutId) {
        clearTimeout(this.timeoutId)
      }

      const durationMs = Date.now() - startTime

      // Check if aborted
      if (this.context.aborted) {
        await updateExecution(this.context.executionId, {
          status: 'cancelled',
          completed_at: new Date().toISOString(),
          duration_ms: durationMs,
          nodes_completed: nodesCompleted
        })

        await this.saveLogs()

        return {
          success: false,
          executionId: this.context.executionId,
          status: 'cancelled',
          error: 'Workflow was cancelled',
          logs: this.context.logs,
          durationMs,
          nodesCompleted,
          nodesTotal: this.workflow.nodes.length
        }
      }

      // Collect final output from sink nodes
      const output = this.collectFinalOutput()

      // Log workflow completion
      this.log('system', 'workflow', 'Workflow Execution', '', 'info',
        `Workflow completed successfully`, { output, nodesCompleted }, 'completed')

      // Update execution as completed
      await updateExecution(this.context.executionId, {
        status: 'completed',
        completed_at: new Date().toISOString(),
        duration_ms: durationMs,
        output_data: output,
        nodes_completed: nodesCompleted
      })

      // Save logs to database
      await this.saveLogs()

      return {
        success: true,
        executionId: this.context.executionId,
        status: 'completed',
        output,
        logs: this.context.logs,
        durationMs,
        nodesCompleted,
        nodesTotal: this.workflow.nodes.length
      }
    } catch (error) {
      const durationMs = Date.now() - startTime
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'

      await updateExecution(this.context.executionId, {
        status: 'failed',
        completed_at: new Date().toISOString(),
        duration_ms: durationMs,
        error_message: errorMessage,
        error_stack: error instanceof Error ? error.stack : undefined
      })

      await this.saveLogs()

      return {
        success: false,
        executionId: this.context.executionId,
        status: 'failed',
        error: errorMessage,
        logs: this.context.logs,
        durationMs,
        nodesCompleted: 0,
        nodesTotal: this.workflow.nodes.length
      }
    }
  }

  /**
   * Abort the workflow execution
   */
  abort(reason: string = 'User cancelled'): void {
    this.context.aborted = true
    this.abortController.abort()

    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
    }

    this.log('system', 'workflow', 'Workflow Execution', '', 'warn',
      `Workflow aborted: ${reason}`, {}, 'failed')
  }

  /**
   * Get topological sort of nodes for execution
   */
  private getExecutionOrder(): string[] {
    const nodes = this.workflow.nodes
    const connections = this.workflow.connections

    // Build adjacency list and in-degree count
    const inDegree = new Map<string, number>()
    const adjacency = new Map<string, string[]>()

    for (const node of nodes) {
      inDegree.set(node.id, 0)
      adjacency.set(node.id, [])
    }

    for (const conn of connections) {
      const targets = adjacency.get(conn.from) || []
      targets.push(conn.to)
      adjacency.set(conn.from, targets)

      const count = inDegree.get(conn.to) || 0
      inDegree.set(conn.to, count + 1)
    }

    // Kahn's algorithm for topological sort
    const queue: string[] = []
    const result: string[] = []

    for (const [nodeId, degree] of inDegree) {
      if (degree === 0) {
        queue.push(nodeId)
      }
    }

    while (queue.length > 0) {
      const nodeId = queue.shift()!
      result.push(nodeId)

      const neighbors = adjacency.get(nodeId) || []
      for (const neighbor of neighbors) {
        const newDegree = (inDegree.get(neighbor) || 0) - 1
        inDegree.set(neighbor, newDegree)

        if (newDegree === 0) {
          queue.push(neighbor)
        }
      }
    }

    return result
  }

  /**
   * Get inputs for a node from connected source nodes
   */
  private getNodeInputs(node: WorkflowNode): Record<string, unknown> {
    const inputs: Record<string, unknown> = {}

    // Find all connections that target this node
    const incomingConnections = this.workflow.connections.filter(c => c.to === node.id)

    for (const conn of incomingConnections) {
      const sourceOutput = this.context.nodeOutputs.get(conn.from)
      inputs[conn.toPort] = sourceOutput
    }

    // Merge with node's configured inputs
    return { ...node.inputs, ...inputs }
  }

  /**
   * Execute a single node
   */
  private async executeNode(
    node: WorkflowNode,
    inputs: Record<string, unknown>
  ): Promise<NodeExecutionResult> {
    const startTime = Date.now()

    // Log node start
    this.log(node.id, node.type, node.label, node.capsuleId, 'info',
      `Executing node: ${node.label}`, { inputs }, 'started', inputs)

    try {
      // Get executor for this node type
      const executor = nodeExecutors[node.capsuleId] || nodeExecutors['default']

      // Execute the node
      const result = await executor(node, inputs, this.context)

      const durationMs = Date.now() - startTime

      if (result.success) {
        // Log node completion
        this.log(node.id, node.type, node.label, node.capsuleId, 'info',
          `Node completed: ${node.label}`,
          { output: result.output, durationMs },
          'completed',
          inputs,
          result.output as Record<string, unknown>,
          durationMs)
      } else {
        // Log node failure
        this.log(node.id, node.type, node.label, node.capsuleId, 'error',
          `Node failed: ${node.label} - ${result.error}`,
          { error: result.error, durationMs },
          'failed',
          inputs,
          undefined,
          durationMs,
          result.error)
      }

      return result
    } catch (error) {
      const durationMs = Date.now() - startTime
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      const errorStack = error instanceof Error ? error.stack : undefined

      // Log node error
      this.log(node.id, node.type, node.label, node.capsuleId, 'error',
        `Node error: ${node.label} - ${errorMessage}`,
        { error: errorMessage, stack: errorStack, durationMs },
        'failed',
        inputs,
        undefined,
        durationMs,
        errorMessage,
        errorStack)

      return {
        success: false,
        error: errorMessage
      }
    }
  }

  /**
   * Add a log entry
   */
  private log(
    nodeId: string,
    nodeType: string,
    nodeLabel: string,
    capsuleId: string,
    level: WorkflowLogLevel,
    message: string,
    data?: Record<string, unknown>,
    status?: WorkflowLogStatus,
    inputData?: Record<string, unknown>,
    outputData?: Record<string, unknown>,
    durationMs?: number,
    errorMessage?: string,
    errorStack?: string
  ): void {
    const entry: ExecutionLogEntry = {
      nodeId,
      nodeType,
      nodeLabel,
      capsuleId,
      level,
      message,
      data,
      status: status || 'started',
      inputData,
      outputData,
      startedAt: new Date().toISOString(),
      completedAt: status === 'completed' || status === 'failed' ? new Date().toISOString() : undefined,
      durationMs,
      errorMessage,
      errorStack,
      sequenceNumber: this.context.sequenceNumber++
    }

    this.context.logs.push(entry)
  }

  /**
   * Save logs to database
   */
  private async saveLogs(): Promise<void> {
    for (const log of this.context.logs) {
      try {
        await createExecutionLog({
          execution_id: this.context.executionId,
          node_id: log.nodeId,
          node_type: log.nodeType,
          node_label: log.nodeLabel,
          capsule_id: log.capsuleId,
          level: log.level,
          message: log.message,
          data: log.data,
          status: log.status,
          input_data: log.inputData,
          output_data: log.outputData,
          started_at: log.startedAt,
          completed_at: log.completedAt,
          duration_ms: log.durationMs,
          error_message: log.errorMessage,
          error_stack: log.errorStack,
          sequence_number: log.sequenceNumber
        })
      } catch (error) {
        console.error('Failed to save log entry:', error)
      }
    }
  }

  /**
   * Collect final output from sink nodes (nodes with no outgoing connections)
   */
  private collectFinalOutput(): Record<string, unknown> {
    const sinkNodes = this.workflow.nodes.filter(node => {
      const hasOutgoing = this.workflow.connections.some(c => c.from === node.id)
      return !hasOutgoing
    })

    const output: Record<string, unknown> = {}

    for (const node of sinkNodes) {
      const nodeOutput = this.context.nodeOutputs.get(node.id)
      output[node.id] = {
        label: node.label,
        capsuleId: node.capsuleId,
        output: nodeOutput
      }
    }

    return output
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Execute a workflow by ID
 */
export async function executeWorkflowById(
  workflowId: string,
  userId: string,
  inputData: Record<string, unknown> = {},
  triggeredBy: string = 'manual'
): Promise<ExecutionResult> {
  // Get workflow
  const workflow = await getWorkflowById(workflowId)

  if (!workflow) {
    throw new Error(`Workflow not found: ${workflowId}`)
  }

  if (!workflow.is_active) {
    throw new Error(`Workflow is not active: ${workflowId}`)
  }

  // Create execution record
  const execution = await createExecution({
    workflow_id: workflowId,
    user_id: userId,
    input_data: inputData,
    nodes_total: workflow.nodes.length,
    workflow_snapshot: workflow,
    triggered_by: triggeredBy
  })

  // Create engine and execute
  const engine = new WorkflowEngine(workflow, userId, execution.id)
  return engine.execute(inputData)
}

/**
 * Register a custom node executor
 */
export function registerNodeExecutor(capsuleId: string, executor: NodeExecutor): void {
  nodeExecutors[capsuleId] = executor
}

/**
 * Get available node executors
 */
export function getRegisteredExecutors(): string[] {
  return Object.keys(nodeExecutors)
}
