/**
 * PRODUCTION-GRADE CAPSULES
 *
 * Advanced capsules for enterprise workflows:
 * - Circuit breakers & retry logic
 * - Distributed tracing
 * - Multi-region deployment
 * - Performance monitoring
 * - Advanced caching strategies
 */

import { DataType, InputPort, OutputPort } from './capsules-types'
import { CapsuleCategory, CapsuleField } from './capsules-config'

export interface ProductionCapsule {
  id: string
  name: string
  category: CapsuleCategory
  icon: string
  color: string
  description: string
  configFields: CapsuleField[]
  inputPorts: InputPort[]
  outputPorts: OutputPort[]
  npmPackage?: string
  documentation?: string
  codeTemplate?: string
}

export const PRODUCTION_CAPSULES: ProductionCapsule[] = [
  // ADVANCED ERROR HANDLING
  {
    id: 'error-handler',
    name: 'Error Handler',
    category: 'workflow',
    icon: '🛡️',
    color: '#DC2626',
    description: 'Advanced error handling with retry logic and exponential backoff',
    configFields: [
      { name: 'maxRetries', type: 'number', required: true, description: 'Max retry attempts', default: 3 },
      { name: 'retryDelay', type: 'number', required: true, description: 'Initial retry delay (ms)', default: 1000 },
      { name: 'exponentialBackoff', type: 'boolean', required: false, description: 'Use exponential backoff', default: true },
      { name: 'maxBackoff', type: 'number', required: false, description: 'Max backoff time (ms)', default: 30000 },
      { name: 'onError', type: 'string', required: true, description: 'Error callback node ID' },
      { name: 'retryableErrors', type: 'array', required: false, description: 'Retryable error codes', placeholder: '["ECONNRESET", "ETIMEDOUT"]' }
    ],
    inputPorts: [
      { id: 'operation', name: 'Operation', type: ['any'], required: true, description: 'Operation to execute with retry' }
    ],
    outputPorts: [
      { id: 'result', name: 'Result', type: 'any', description: 'Operation result' },
      { id: 'error', name: 'Error', type: 'error', description: 'Error if all retries failed' },
      { id: 'attempts', name: 'Attempts', type: 'number', description: 'Number of attempts made' }
    ],
    npmPackage: 'p-retry',
    documentation: 'https://github.com/sindresorhus/p-retry',
    codeTemplate: `const pRetry = require('p-retry')

const operation = async () => {
  // Execute the operation
  return await prevOutput()
}

const result = await pRetry(operation, {
  retries: {{config.maxRetries}},
  factor: {{config.exponentialBackoff ? 2 : 1}},
  minTimeout: {{config.retryDelay}},
  maxTimeout: {{config.maxBackoff || 30000}},
  onFailedAttempt: (error) => {
    console.log(\`Attempt \${error.attemptNumber} failed. \${error.retriesLeft} retries left.\`)
  }
})`
  },

  // CIRCUIT BREAKER
  {
    id: 'circuit-breaker',
    name: 'Circuit Breaker',
    category: 'workflow',
    icon: '⚡',
    color: '#F59E0B',
    description: 'Circuit breaker pattern to prevent cascading failures',
    configFields: [
      { name: 'failureThreshold', type: 'number', required: true, description: 'Failures before opening', default: 5 },
      { name: 'resetTimeout', type: 'number', required: true, description: 'Time before retry (ms)', default: 60000 },
      { name: 'timeout', type: 'number', required: false, description: 'Operation timeout (ms)', default: 3000 },
      { name: 'volumeThreshold', type: 'number', required: false, description: 'Min requests for stats', default: 10 }
    ],
    inputPorts: [
      { id: 'operation', name: 'Operation', type: ['any'], required: true, description: 'Protected operation' }
    ],
    outputPorts: [
      { id: 'result', name: 'Result', type: 'any', description: 'Operation result' },
      { id: 'state', name: 'State', type: 'string', description: 'Circuit state (closed/open/half-open)' },
      { id: 'stats', name: 'Stats', type: 'object', description: 'Circuit breaker statistics' }
    ],
    npmPackage: 'opossum',
    documentation: 'https://nodeshift.dev/opossum/',
    codeTemplate: `const CircuitBreaker = require('opossum')

const options = {
  timeout: {{config.timeout || 3000}},
  errorThresholdPercentage: 50,
  resetTimeout: {{config.resetTimeout}},
  volumeThreshold: {{config.volumeThreshold || 10}}
}

const breaker = new CircuitBreaker(prevOutput, options)

breaker.on('open', () => console.log('Circuit opened'))
breaker.on('halfOpen', () => console.log('Circuit half-open'))
breaker.on('close', () => console.log('Circuit closed'))

const result = await breaker.fire()`
  },

  // DATABASE TRANSACTION
  {
    id: 'database-transaction',
    name: 'Database Transaction',
    category: 'data',
    icon: '🔒',
    color: '#10B981',
    description: 'ACID transactions with isolation levels',
    configFields: [
      { name: 'connectionString', type: 'string', required: true, description: 'Database URL', placeholder: 'postgresql://...' },
      { name: 'operation', type: 'select', required: true, description: 'Transaction operation', options: ['begin', 'commit', 'rollback'] },
      { name: 'isolationLevel', type: 'select', required: false, description: 'Isolation level', options: ['READ UNCOMMITTED', 'READ COMMITTED', 'REPEATABLE READ', 'SERIALIZABLE'], default: 'READ COMMITTED' },
      { name: 'transactionId', type: 'string', required: false, description: 'Transaction ID (for commit/rollback)' }
    ],
    inputPorts: [
      { id: 'queries', name: 'Queries', type: ['array'], required: false, description: 'Queries to execute in transaction' }
    ],
    outputPorts: [
      { id: 'transactionId', name: 'Transaction ID', type: 'string', description: 'Unique transaction identifier' },
      { id: 'status', name: 'Status', type: 'string', description: 'Transaction status' }
    ],
    npmPackage: 'pg',
    documentation: 'https://node-postgres.com/features/transactions',
    codeTemplate: `const { Pool } = require('pg')
const pool = new Pool({ connectionString: '{{config.connectionString}}' })

const client = await pool.connect()

try {
  if ('{{config.operation}}' === 'begin') {
    await client.query('BEGIN TRANSACTION ISOLATION LEVEL {{config.isolationLevel}}')
    const transactionId = \`tx_\${Date.now()}_\${Math.random()}\`
    // Store client for later use
    global.transactions = global.transactions || {}
    global.transactions[transactionId] = client
    return { transactionId, status: 'started' }
  } else if ('{{config.operation}}' === 'commit') {
    const client = global.transactions['{{config.transactionId}}']
    await client.query('COMMIT')
    delete global.transactions['{{config.transactionId}}']
    client.release()
    return { transactionId: '{{config.transactionId}}', status: 'committed' }
  } else if ('{{config.operation}}' === 'rollback') {
    const client = global.transactions['{{config.transactionId}}']
    await client.query('ROLLBACK')
    delete global.transactions['{{config.transactionId}}']
    client.release()
    return { transactionId: '{{config.transactionId}}', status: 'rolled_back' }
  }
} catch (error) {
  await client.query('ROLLBACK')
  client.release()
  throw error
}`
  },

  // KAFKA CONSUMER
  {
    id: 'kafka-consumer',
    name: 'Kafka Consumer',
    category: 'data',
    icon: '📨',
    color: '#000000',
    description: 'High-performance Kafka message consumer',
    configFields: [
      { name: 'brokers', type: 'string', required: true, description: 'Kafka brokers', placeholder: 'localhost:9092' },
      { name: 'groupId', type: 'string', required: true, description: 'Consumer group ID' },
      { name: 'topic', type: 'string', required: true, description: 'Topic to consume' },
      { name: 'fromBeginning', type: 'boolean', required: false, description: 'Start from beginning', default: false },
      { name: 'autoCommit', type: 'boolean', required: false, description: 'Auto-commit offsets', default: true },
      { name: 'batchSize', type: 'number', required: false, description: 'Batch size', default: 100 }
    ],
    inputPorts: [],
    outputPorts: [
      { id: 'messages', name: 'Messages', type: 'array', description: 'Consumed messages' },
      { id: 'consumer', name: 'Consumer', type: 'object', description: 'Consumer instance' }
    ],
    npmPackage: 'kafkajs',
    documentation: 'https://kafka.js.org/',
    codeTemplate: `const { Kafka } = require('kafkajs')

const kafka = new Kafka({
  clientId: 'hublab-workflow',
  brokers: '{{config.brokers}}'.split(',')
})

const consumer = kafka.consumer({ groupId: '{{config.groupId}}' })

await consumer.connect()
await consumer.subscribe({
  topic: '{{config.topic}}',
  fromBeginning: {{config.fromBeginning || false}}
})

const messages = []

await consumer.run({
  eachBatchAutoResolve: {{config.autoCommit || true}},
  eachBatch: async ({ batch, resolveOffset, heartbeat }) => {
    for (const message of batch.messages) {
      messages.push({
        key: message.key?.toString(),
        value: JSON.parse(message.value.toString()),
        headers: message.headers,
        timestamp: message.timestamp,
        offset: message.offset
      })

      if (messages.length >= {{config.batchSize || 100}}) {
        break
      }
    }

    await resolveOffset(batch.messages[batch.messages.length - 1].offset)
    await heartbeat()
  }
})

return { messages, consumer }`
  },

  // DISTRIBUTED TRACING
  {
    id: 'distributed-tracing',
    name: 'Distributed Tracing',
    category: 'monitoring',
    icon: '🔍',
    color: '#6366F1',
    description: 'OpenTelemetry distributed tracing',
    configFields: [
      { name: 'serviceName', type: 'string', required: true, description: 'Service name' },
      { name: 'spanName', type: 'string', required: true, description: 'Span name' },
      { name: 'exporterUrl', type: 'string', required: true, description: 'OTLP exporter URL', placeholder: 'http://localhost:4318/v1/traces' },
      { name: 'attributes', type: 'textarea', required: false, description: 'Span attributes (JSON)', placeholder: '{ "user.id": "123" }' }
    ],
    inputPorts: [
      { id: 'operation', name: 'Operation', type: ['any'], required: true, description: 'Operation to trace' }
    ],
    outputPorts: [
      { id: 'result', name: 'Result', type: 'any', description: 'Operation result' },
      { id: 'traceId', name: 'Trace ID', type: 'string', description: 'Trace identifier' },
      { id: 'spanId', name: 'Span ID', type: 'string', description: 'Span identifier' }
    ],
    npmPackage: '@opentelemetry/api',
    documentation: 'https://opentelemetry.io/docs/instrumentation/js/',
    codeTemplate: `const { trace } = require('@opentelemetry/api')
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http')
const { Resource } = require('@opentelemetry/resources')
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions')
const { BasicTracerProvider, BatchSpanProcessor } = require('@opentelemetry/sdk-trace-base')

const provider = new BasicTracerProvider({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: '{{config.serviceName}}'
  })
})

const exporter = new OTLPTraceExporter({ url: '{{config.exporterUrl}}' })
provider.addSpanProcessor(new BatchSpanProcessor(exporter))
provider.register()

const tracer = trace.getTracer('{{config.serviceName}}')

const span = tracer.startSpan('{{config.spanName}}', {
  attributes: {{config.attributes || '{}'}}
})

const ctx = trace.setSpan(trace.context.active(), span)

try {
  const result = await trace.context.with(ctx, async () => {
    return await prevOutput()
  })

  span.setStatus({ code: 0 }) // OK
  return {
    result,
    traceId: span.spanContext().traceId,
    spanId: span.spanContext().spanId
  }
} catch (error) {
  span.setStatus({ code: 2, message: error.message }) // ERROR
  span.recordException(error)
  throw error
} finally {
  span.end()
}`
  },

  // METRICS COLLECTION
  {
    id: 'metrics-datadog',
    name: 'Datadog Metrics',
    category: 'monitoring',
    icon: '📈',
    color: '#632CA6',
    description: 'Send metrics to Datadog',
    configFields: [
      { name: 'apiKey', type: 'string', required: true, description: 'Datadog API key', placeholder: 'process.env.DATADOG_API_KEY' },
      { name: 'metrics', type: 'array', required: true, description: 'Metrics to send' }
    ],
    inputPorts: [
      { id: 'data', name: 'Data', type: ['object'], required: false, description: 'Metric data' }
    ],
    outputPorts: [
      { id: 'success', name: 'Success', type: 'boolean', description: 'Send success' }
    ],
    npmPackage: 'datadog-metrics',
    documentation: 'https://docs.datadoghq.com/api/',
    codeTemplate: `const { BufferedMetricsLogger } = require('datadog-metrics')

const metrics = new BufferedMetricsLogger({
  apiKey: '{{config.apiKey}}',
  host: 'hublab-workflow',
  prefix: 'workflow.',
  flushIntervalSeconds: 15
})

const metricsList = {{config.metrics}}

for (const metric of metricsList) {
  if (metric.type === 'count') {
    metrics.increment(metric.name, metric.value, metric.tags)
  } else if (metric.type === 'gauge') {
    metrics.gauge(metric.name, metric.value, metric.tags)
  } else if (metric.type === 'histogram') {
    metrics.histogram(metric.name, metric.value, metric.tags)
  }
}

await metrics.flush()
return { success: true }`
  },

  // PROMETHEUS METRICS
  {
    id: 'metrics-prometheus',
    name: 'Prometheus Metrics',
    category: 'monitoring',
    icon: '📊',
    color: '#E6522C',
    description: 'Push metrics to Prometheus Pushgateway',
    configFields: [
      { name: 'pushgateway', type: 'string', required: true, description: 'Pushgateway URL', placeholder: 'http://localhost:9091' },
      { name: 'jobName', type: 'string', required: true, description: 'Job name', default: 'hublab-workflow' },
      { name: 'metrics', type: 'array', required: true, description: 'Metrics to push' }
    ],
    inputPorts: [
      { id: 'data', name: 'Data', type: ['object'], required: false, description: 'Metric data' }
    ],
    outputPorts: [
      { id: 'success', name: 'Success', type: 'boolean', description: 'Push success' }
    ],
    npmPackage: 'prom-client',
    documentation: 'https://github.com/siimon/prom-client',
    codeTemplate: `const client = require('prom-client')
const { Pushgateway } = client

const register = new client.Registry()
const gateway = new Pushgateway('{{config.pushgateway}}', [], register)

const metricsList = {{config.metrics}}

for (const metric of metricsList) {
  if (metric.type === 'counter') {
    const counter = new client.Counter({
      name: metric.name,
      help: metric.help || metric.name,
      labelNames: Object.keys(metric.labels || {}),
      registers: [register]
    })
    counter.inc(metric.labels || {}, metric.value)
  } else if (metric.type === 'gauge') {
    const gauge = new client.Gauge({
      name: metric.name,
      help: metric.help || metric.name,
      labelNames: Object.keys(metric.labels || {}),
      registers: [register]
    })
    gauge.set(metric.labels || {}, metric.value)
  } else if (metric.type === 'histogram') {
    const histogram = new client.Histogram({
      name: metric.name,
      help: metric.help || metric.name,
      labelNames: Object.keys(metric.labels || {}),
      buckets: metric.buckets || [0.1, 0.5, 1, 2, 5, 10],
      registers: [register]
    })
    histogram.observe(metric.labels || {}, metric.value)
  }
}

await gateway.pushAdd({ jobName: '{{config.jobName}}' })
return { success: true }`
  },

  // PARALLEL EXECUTOR
  {
    id: 'parallel-executor',
    name: 'Parallel Executor',
    category: 'workflow',
    icon: '⚙️',
    color: '#8B5CF6',
    description: 'Execute multiple operations in parallel with concurrency control',
    configFields: [
      { name: 'maxConcurrency', type: 'number', required: true, description: 'Max parallel tasks', default: 5 },
      { name: 'timeout', type: 'number', required: false, description: 'Task timeout (ms)', default: 30000 },
      { name: 'failFast', type: 'boolean', required: false, description: 'Fail on first error', default: false }
    ],
    inputPorts: [
      { id: 'tasks', name: 'Tasks', type: ['array'], required: true, description: 'Tasks to execute' }
    ],
    outputPorts: [
      { id: 'results', name: 'Results', type: 'array', description: 'Task results' },
      { id: 'errors', name: 'Errors', type: 'array', description: 'Task errors' },
      { id: 'duration', name: 'Duration', type: 'number', description: 'Total duration (ms)' }
    ],
    npmPackage: 'p-limit',
    documentation: 'https://github.com/sindresorhus/p-limit',
    codeTemplate: `const pLimit = require('p-limit')
const pTimeout = require('p-timeout')

const limit = pLimit({{config.maxConcurrency || 5}})
const tasks = prevOutput

const startTime = Date.now()
const results = []
const errors = []

const promises = tasks.map((task, index) =>
  limit(async () => {
    try {
      const result = await pTimeout(
        task(),
        {{config.timeout || 30000}},
        \`Task \${index} timed out\`
      )
      results[index] = result
      return result
    } catch (error) {
      errors[index] = { index, error: error.message }
      if ({{config.failFast || false}}) {
        throw error
      }
      return null
    }
  })
)

await Promise.all(promises)

return {
  results,
  errors: errors.filter(Boolean),
  duration: Date.now() - startTime
}`
  }
]
