/**
 * Workflow Executor - Test Mode
 * Simulates workflow execution with real-time logging
 */

export interface ExecutionLog {
  timestamp: string
  nodeId: string
  nodeName: string
  type: 'start' | 'success' | 'error' | 'info'
  message: string
  data?: any
}

export interface ExecutionResult {
  success: boolean
  executionTime: number
  logs: ExecutionLog[]
  outputs: Record<string, any>
  errors: string[]
}

export class WorkflowExecutor {
  private logs: ExecutionLog[] = []
  private startTime: number = 0
  private outputs: Record<string, any> = {}
  private errors: string[] = []

  constructor(
    private nodes: any[],
    private connections: any[],
    private onLog?: (log: ExecutionLog) => void
  ) {}

  private addLog(nodeId: string, nodeName: string, type: ExecutionLog['type'], message: string, data?: any) {
    const log: ExecutionLog = {
      timestamp: new Date().toISOString(),
      nodeId,
      nodeName,
      type,
      message,
      data
    }
    this.logs.push(log)
    if (this.onLog) {
      this.onLog(log)
    }
  }

  // Topological sort to determine execution order
  private topologicalSort(): string[] {
    const visited = new Set<string>()
    const result: string[] = []
    const adjacencyList = new Map<string, string[]>()

    // Build adjacency list
    this.nodes.forEach(node => adjacencyList.set(node.id, []))
    this.connections.forEach(conn => {
      const targets = adjacencyList.get(conn.from) || []
      targets.push(conn.to)
      adjacencyList.set(conn.from, targets)
    })

    // DFS
    const dfs = (nodeId: string) => {
      if (visited.has(nodeId)) return
      visited.add(nodeId)

      const neighbors = adjacencyList.get(nodeId) || []
      neighbors.forEach(neighbor => dfs(neighbor))

      result.unshift(nodeId)
    }

    // Find nodes with no incoming edges (start nodes)
    const hasIncoming = new Set(this.connections.map(c => c.to))
    const startNodes = this.nodes.filter(n => !hasIncoming.has(n.id))

    startNodes.forEach(node => dfs(node.id))

    return result
  }

  // Simulate node execution
  private async executeNode(node: any, inputs: any): Promise<any> {
    const nodeName = node.label || node.capsuleId || 'Unknown'

    this.addLog(node.id, nodeName, 'start', `Executing node: ${nodeName}`)

    // Simulate processing time (50-500ms)
    const processingTime = Math.floor(Math.random() * 450) + 50
    await new Promise(resolve => setTimeout(resolve, processingTime))

    // Simulate different node types
    const capsuleId = node.capsuleId || ''

    try {
      let output: any = {}

      if (capsuleId.includes('input') || capsuleId.includes('form')) {
        output = {
          value: `Sample input from ${nodeName}`,
          timestamp: new Date().toISOString(),
          valid: true
        }
        this.addLog(node.id, nodeName, 'info', 'Form data collected', output)
      } else if (capsuleId.includes('ai') || capsuleId.includes('ml')) {
        output = {
          prediction: Math.random() > 0.5 ? 'positive' : 'negative',
          confidence: (Math.random() * 0.3 + 0.7).toFixed(2),
          model: 'gpt-4'
        }
        this.addLog(node.id, nodeName, 'info', 'AI processing completed', output)
      } else if (capsuleId.includes('chart') || capsuleId.includes('viz')) {
        output = {
          data: Array.from({ length: 5 }, (_, i) => ({
            label: `Item ${i + 1}`,
            value: Math.floor(Math.random() * 100)
          })),
          type: 'bar'
        }
        this.addLog(node.id, nodeName, 'info', 'Data visualized', output)
      } else if (capsuleId.includes('database') || capsuleId.includes('db')) {
        output = {
          records: [
            { id: 1, name: 'John Doe', email: 'john@example.com' },
            { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
          ],
          count: 2
        }
        this.addLog(node.id, nodeName, 'info', 'Database query executed', output)
      } else if (capsuleId.includes('api') || capsuleId.includes('http')) {
        output = {
          status: 200,
          data: { message: 'API call successful', timestamp: new Date().toISOString() }
        }
        this.addLog(node.id, nodeName, 'info', 'API request completed', output)
      } else {
        output = {
          result: `Processed by ${nodeName}`,
          inputs,
          timestamp: new Date().toISOString()
        }
        this.addLog(node.id, nodeName, 'info', 'Node executed successfully', output)
      }

      this.addLog(node.id, nodeName, 'success', `✓ ${nodeName} completed in ${processingTime}ms`)
      return output
    } catch (error: any) {
      const errorMsg = `Error in ${nodeName}: ${error.message}`
      this.addLog(node.id, nodeName, 'error', errorMsg)
      this.errors.push(errorMsg)
      throw error
    }
  }

  // Execute entire workflow
  async execute(initialInputs: any = {}): Promise<ExecutionResult> {
    this.logs = []
    this.outputs = {}
    this.errors = []
    this.startTime = Date.now()

    try {
      this.addLog('system', 'Workflow', 'start', `🚀 Starting workflow execution with ${this.nodes.length} nodes`)

      // Get execution order
      const executionOrder = this.topologicalSort()
      this.addLog('system', 'Workflow', 'info', `Execution order: ${executionOrder.join(' → ')}`)

      // Execute nodes in order
      for (const nodeId of executionOrder) {
        const node = this.nodes.find(n => n.id === nodeId)
        if (!node) continue

        // Get inputs from connected nodes
        const incomingConnections = this.connections.filter(c => c.to === nodeId)
        const inputs = incomingConnections.reduce((acc, conn) => {
          acc[conn.from] = this.outputs[conn.from]
          return acc
        }, { ...initialInputs } as any)

        // Execute node
        const output = await this.executeNode(node, inputs)
        this.outputs[nodeId] = output
      }

      const executionTime = Date.now() - this.startTime
      this.addLog('system', 'Workflow', 'success', `✓ Workflow completed successfully in ${executionTime}ms`)

      return {
        success: true,
        executionTime,
        logs: this.logs,
        outputs: this.outputs,
        errors: this.errors
      }
    } catch (error: any) {
      const executionTime = Date.now() - this.startTime
      this.addLog('system', 'Workflow', 'error', `✗ Workflow failed: ${error.message}`)

      return {
        success: false,
        executionTime,
        logs: this.logs,
        outputs: this.outputs,
        errors: this.errors
      }
    }
  }

  // Validate workflow before execution
  validateWorkflow(): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    // Check for disconnected nodes
    const connectedNodes = new Set<string>()
    this.connections.forEach(c => {
      connectedNodes.add(c.from)
      connectedNodes.add(c.to)
    })

    const disconnectedNodes = this.nodes.filter(n => !connectedNodes.has(n.id) && this.nodes.length > 1)
    if (disconnectedNodes.length > 0) {
      errors.push(`${disconnectedNodes.length} disconnected node(s) found`)
    }

    // Check for circular dependencies
    const visited = new Set<string>()
    const recursionStack = new Set<string>()

    const hasCycle = (nodeId: string): boolean => {
      if (recursionStack.has(nodeId)) return true
      if (visited.has(nodeId)) return false

      visited.add(nodeId)
      recursionStack.add(nodeId)

      const neighbors = this.connections.filter(c => c.from === nodeId).map(c => c.to)
      for (const neighbor of neighbors) {
        if (hasCycle(neighbor)) return true
      }

      recursionStack.delete(nodeId)
      return false
    }

    for (const node of this.nodes) {
      if (hasCycle(node.id)) {
        errors.push('Circular dependency detected in workflow')
        break
      }
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }
}
