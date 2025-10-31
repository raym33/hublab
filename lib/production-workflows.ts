/**
 * PRODUCTION-GRADE WORKFLOWS
 *
 * Enterprise-ready workflows with:
 * - Advanced error handling & retry logic
 * - Circuit breakers & rate limiting
 * - Monitoring & observability
 * - Performance optimization
 * - Security best practices
 * - Multi-region deployment
 * - Database transactions
 * - Caching strategies
 * - Load balancing
 */

import { WorkflowTemplate } from './workflow-templates'

export const PRODUCTION_WORKFLOWS: WorkflowTemplate[] = [
  // WORKFLOW 1: E-commerce Order Processing (Production-Grade)
  {
    id: 'ecommerce-order-processing',
    name: '🛒 E-commerce Order Processing',
    description: 'Complete order processing with payment, inventory, shipping, and notifications',
    category: 'payments',
    nodes: [
      // 1. Webhook with authentication
      {
        id: 'order-webhook',
        capsuleId: 'webhook',
        position: { x: 100, y: 100 },
        config: {
          method: 'POST',
          path: '/api/orders',
          authentication: 'jwt'
        }
      },

      // 2. Rate limiter (prevent abuse)
      {
        id: 'rate-limiter',
        capsuleId: 'rate-limiter',
        position: { x: 350, y: 100 },
        config: {
          identifier: '{{ order-webhook.headers["x-user-id"] }}',
          maxRequests: 10,
          windowMs: 60000, // 10 requests per minute
          blockDuration: 300000 // Block for 5 minutes if exceeded
        }
      },

      // 3. Request validation
      {
        id: 'validate-order',
        capsuleId: 'validator',
        position: { x: 600, y: 100 },
        config: {
          schema: `z.object({
  userId: z.string().uuid(),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().positive().int(),
    price: z.number().positive()
  })).min(1),
  shippingAddress: z.object({
    street: z.string(),
    city: z.string(),
    country: z.string(),
    postalCode: z.string()
  }),
  paymentMethodId: z.string()
})`
        }
      },

      // 4. Check cache for product data
      {
        id: 'check-product-cache',
        capsuleId: 'cache-redis',
        position: { x: 850, y: 100 },
        config: {
          operation: 'get',
          key: 'products:{{ validate-order.data.items[*].productId }}',
          ttl: 3600
        }
      },

      // 5. Conditional: Cache hit or miss
      {
        id: 'cache-router',
        capsuleId: 'router',
        position: { x: 1100, y: 100 },
        config: {
          condition: '{{ check-product-cache.value }} !== null',
          truePath: 'use-cached-products',
          falsePath: 'fetch-products-db'
        }
      },

      // 6a. Use cached products (fast path)
      {
        id: 'use-cached-products',
        capsuleId: 'transformer',
        position: { x: 1350, y: 50 },
        config: {
          code: 'return JSON.parse(input)'
        }
      },

      // 6b. Fetch from database (slow path)
      {
        id: 'fetch-products-db',
        capsuleId: 'database-postgresql',
        position: { x: 1350, y: 150 },
        config: {
          connectionString: '${DATABASE_URL}',
          query: `SELECT id, name, price, stock, images
                  FROM products
                  WHERE id = ANY($1::uuid[])
                  FOR UPDATE`, // Lock rows for inventory update
          params: '[{{ validate-order.data.items[*].productId }}]'
        }
      },

      // 7. Update cache with DB data
      {
        id: 'update-cache',
        capsuleId: 'cache-redis',
        position: { x: 1600, y: 150 },
        config: {
          operation: 'set',
          key: 'products:{{ validate-order.data.items[*].productId }}',
          value: '{{ fetch-products-db.rows }}',
          ttl: 3600
        }
      },

      // 8. Calculate order total with validation
      {
        id: 'calculate-total',
        capsuleId: 'transformer',
        position: { x: 1850, y: 100 },
        config: {
          code: `const items = input.orderItems
const products = input.products

let total = 0
const lineItems = []

for (const item of items) {
  const product = products.find(p => p.id === item.productId)

  if (!product) {
    throw new Error(\`Product \${item.productId} not found\`)
  }

  if (product.stock < item.quantity) {
    throw new Error(\`Insufficient stock for \${product.name}\`)
  }

  // Verify price hasn't been tampered
  if (Math.abs(product.price - item.price) > 0.01) {
    throw new Error(\`Price mismatch for \${product.name}\`)
  }

  const lineTotal = product.price * item.quantity
  total += lineTotal

  lineItems.push({
    productId: product.id,
    name: product.name,
    quantity: item.quantity,
    unitPrice: product.price,
    total: lineTotal
  })
}

return { total, lineItems }`
        }
      },

      // 9. Start database transaction
      {
        id: 'begin-transaction',
        capsuleId: 'database-transaction',
        position: { x: 2100, y: 100 },
        config: {
          connectionString: '${DATABASE_URL}',
          operation: 'begin',
          isolationLevel: 'SERIALIZABLE'
        }
      },

      // 10. Create order record
      {
        id: 'create-order',
        capsuleId: 'database-postgresql',
        position: { x: 2350, y: 100 },
        config: {
          connectionString: '${DATABASE_URL}',
          query: `INSERT INTO orders (
                    user_id, total, status, shipping_address,
                    created_at, updated_at
                  ) VALUES ($1, $2, 'pending', $3, NOW(), NOW())
                  RETURNING id, created_at`,
          params: `[
  "{{ validate-order.data.userId }}",
  {{ calculate-total.output.total }},
  {{ validate-order.data.shippingAddress }}
]`
        }
      },

      // 11. Create order items
      {
        id: 'create-order-items',
        capsuleId: 'database-postgresql',
        position: { x: 2600, y: 100 },
        config: {
          connectionString: '${DATABASE_URL}',
          query: `INSERT INTO order_items (
                    order_id, product_id, quantity, unit_price, total
                  )
                  SELECT
                    $1,
                    item->>'productId',
                    (item->>'quantity')::int,
                    (item->>'unitPrice')::numeric,
                    (item->>'total')::numeric
                  FROM jsonb_array_elements($2::jsonb) AS item`,
          params: `[
  "{{ create-order.rows[0].id }}",
  {{ calculate-total.output.lineItems }}
]`
        }
      },

      // 12. Update inventory (decrement stock)
      {
        id: 'update-inventory',
        capsuleId: 'database-postgresql',
        position: { x: 2850, y: 100 },
        config: {
          connectionString: '${DATABASE_URL}',
          query: `UPDATE products
                  SET stock = stock - updates.quantity,
                      updated_at = NOW()
                  FROM (
                    SELECT
                      (item->>'productId')::uuid as product_id,
                      (item->>'quantity')::int as quantity
                    FROM jsonb_array_elements($1::jsonb) AS item
                  ) AS updates
                  WHERE products.id = updates.product_id
                  RETURNING products.id, products.stock`,
          params: '[{{ calculate-total.output.lineItems }}]'
        }
      },

      // 13. Process payment with Stripe
      {
        id: 'process-payment',
        capsuleId: 'stripe-payment',
        position: { x: 3100, y: 100 },
        config: {
          apiKey: '${STRIPE_SECRET_KEY}',
          amount: '{{ calculate-total.output.total * 100 }}', // Convert to cents
          currency: 'usd',
          paymentMethodId: '{{ validate-order.data.paymentMethodId }}',
          metadata: {
            orderId: '{{ create-order.rows[0].id }}',
            userId: '{{ validate-order.data.userId }}'
          },
          idempotencyKey: '{{ create-order.rows[0].id }}' // Prevent duplicate charges
        }
      },

      // 14. Error handler for payment
      {
        id: 'payment-error-handler',
        capsuleId: 'error-handler',
        position: { x: 3350, y: 100 },
        config: {
          onError: 'rollback-transaction',
          maxRetries: 3,
          retryDelay: 1000,
          exponentialBackoff: true
        }
      },

      // 15. Update order with payment info
      {
        id: 'update-order-payment',
        capsuleId: 'database-postgresql',
        position: { x: 3600, y: 100 },
        config: {
          connectionString: '${DATABASE_URL}',
          query: `UPDATE orders
                  SET status = 'paid',
                      payment_intent_id = $1,
                      payment_status = $2,
                      updated_at = NOW()
                  WHERE id = $3
                  RETURNING *`,
          params: `[
  "{{ process-payment.paymentIntent.id }}",
  "{{ process-payment.paymentIntent.status }}",
  "{{ create-order.rows[0].id }}"
]`
        }
      },

      // 16. Commit transaction
      {
        id: 'commit-transaction',
        capsuleId: 'database-transaction',
        position: { x: 3850, y: 100 },
        config: {
          connectionString: '${DATABASE_URL}',
          operation: 'commit',
          transactionId: '{{ begin-transaction.transactionId }}'
        }
      },

      // 17. Publish order event to queue
      {
        id: 'publish-order-event',
        capsuleId: 'queue-rabbitmq',
        position: { x: 4100, y: 100 },
        config: {
          connectionString: '${RABBITMQ_URL}',
          exchange: 'orders',
          routingKey: 'order.created',
          message: {
            orderId: '{{ create-order.rows[0].id }}',
            userId: '{{ validate-order.data.userId }}',
            total: '{{ calculate-total.output.total }}',
            timestamp: '{{ create-order.rows[0].created_at }}'
          },
          persistent: true
        }
      },

      // 18. Send confirmation email (async)
      {
        id: 'send-confirmation-email',
        capsuleId: 'email',
        position: { x: 4350, y: 50 },
        config: {
          provider: 'resend',
          apiKey: '${RESEND_API_KEY}',
          from: 'orders@hublab.dev',
          to: '{{ validate-order.data.email }}',
          subject: 'Order Confirmation #{{ create-order.rows[0].id }}',
          template: 'order-confirmation',
          data: {
            orderId: '{{ create-order.rows[0].id }}',
            items: '{{ calculate-total.output.lineItems }}',
            total: '{{ calculate-total.output.total }}',
            shippingAddress: '{{ validate-order.data.shippingAddress }}'
          }
        }
      },

      // 19. Send SMS notification (async)
      {
        id: 'send-sms',
        capsuleId: 'sms-twilio',
        position: { x: 4350, y: 150 },
        config: {
          accountSid: '${TWILIO_ACCOUNT_SID}',
          authToken: '${TWILIO_AUTH_TOKEN}',
          from: '${TWILIO_PHONE_NUMBER}',
          to: '{{ validate-order.data.phone }}',
          message: 'Your order #{{ create-order.rows[0].id }} has been confirmed! Total: ${{ calculate-total.output.total }}'
        }
      },

      // 20. Log to monitoring
      {
        id: 'log-order',
        capsuleId: 'logger',
        position: { x: 4600, y: 100 },
        config: {
          level: 'info',
          message: 'Order processed successfully',
          metadata: {
            orderId: '{{ create-order.rows[0].id }}',
            userId: '{{ validate-order.data.userId }}',
            total: '{{ calculate-total.output.total }}',
            paymentIntentId: '{{ process-payment.paymentIntent.id }}',
            duration: '{{ Date.now() - order-webhook.timestamp }}'
          },
          service: 'order-processing'
        }
      },

      // 21. Track metrics
      {
        id: 'track-metrics',
        capsuleId: 'metrics-datadog',
        position: { x: 4850, y: 100 },
        config: {
          apiKey: '${DATADOG_API_KEY}',
          metrics: [
            {
              name: 'order.processed',
              value: 1,
              type: 'count',
              tags: ['status:success', 'payment:stripe']
            },
            {
              name: 'order.total',
              value: '{{ calculate-total.output.total }}',
              type: 'gauge',
              tags: ['currency:usd']
            },
            {
              name: 'order.items_count',
              value: '{{ validate-order.data.items.length }}',
              type: 'gauge'
            },
            {
              name: 'order.processing_time',
              value: '{{ Date.now() - order-webhook.timestamp }}',
              type: 'histogram',
              tags: ['status:success']
            }
          ]
        }
      },

      // ROLLBACK PATH (if payment fails)
      {
        id: 'rollback-transaction',
        capsuleId: 'database-transaction',
        position: { x: 3350, y: 250 },
        config: {
          connectionString: '${DATABASE_URL}',
          operation: 'rollback',
          transactionId: '{{ begin-transaction.transactionId }}'
        }
      },

      // Restore inventory
      {
        id: 'restore-inventory',
        capsuleId: 'database-postgresql',
        position: { x: 3600, y: 250 },
        config: {
          connectionString: '${DATABASE_URL}',
          query: `UPDATE products
                  SET stock = stock + updates.quantity
                  FROM (
                    SELECT
                      (item->>'productId')::uuid as product_id,
                      (item->>'quantity')::int as quantity
                    FROM jsonb_array_elements($1::jsonb) AS item
                  ) AS updates
                  WHERE products.id = updates.product_id`,
          params: '[{{ calculate-total.output.lineItems }}]'
        }
      },

      // Log error
      {
        id: 'log-error',
        capsuleId: 'logger',
        position: { x: 3850, y: 250 },
        config: {
          level: 'error',
          message: 'Order processing failed',
          metadata: {
            userId: '{{ validate-order.data.userId }}',
            error: '{{ payment-error-handler.error }}',
            stage: 'payment'
          },
          service: 'order-processing'
        }
      },

      // Send error notification
      {
        id: 'notify-error',
        capsuleId: 'slack-message',
        position: { x: 4100, y: 250 },
        config: {
          webhookUrl: '${SLACK_WEBHOOK_URL}',
          channel: '#alerts',
          message: `🚨 *Order Processing Failed*

User: {{ validate-order.data.userId }}
Error: {{ payment-error-handler.error }}
Total: ${{ calculate-total.output.total }}

Time: {{ new Date().toISOString() }}`
        }
      },

      // Return error to user
      {
        id: 'return-error',
        capsuleId: 'response-formatter',
        position: { x: 4350, y: 250 },
        config: {
          statusCode: 400,
          body: {
            success: false,
            error: 'Payment processing failed',
            message: '{{ payment-error-handler.error }}',
            orderId: '{{ create-order.rows[0].id }}'
          }
        }
      }
    ],
    edges: [
      { source: 'order-webhook', target: 'rate-limiter' },
      { source: 'rate-limiter', target: 'validate-order' },
      { source: 'validate-order', target: 'check-product-cache' },
      { source: 'check-product-cache', target: 'cache-router' },
      { source: 'cache-router', target: 'use-cached-products' },
      { source: 'cache-router', target: 'fetch-products-db' },
      { source: 'fetch-products-db', target: 'update-cache' },
      { source: 'update-cache', target: 'calculate-total' },
      { source: 'use-cached-products', target: 'calculate-total' },
      { source: 'calculate-total', target: 'begin-transaction' },
      { source: 'begin-transaction', target: 'create-order' },
      { source: 'create-order', target: 'create-order-items' },
      { source: 'create-order-items', target: 'update-inventory' },
      { source: 'update-inventory', target: 'process-payment' },
      { source: 'process-payment', target: 'payment-error-handler' },
      { source: 'payment-error-handler', target: 'update-order-payment' },
      { source: 'update-order-payment', target: 'commit-transaction' },
      { source: 'commit-transaction', target: 'publish-order-event' },
      { source: 'publish-order-event', target: 'send-confirmation-email' },
      { source: 'publish-order-event', target: 'send-sms' },
      { source: 'send-confirmation-email', target: 'log-order' },
      { source: 'send-sms', target: 'log-order' },
      { source: 'log-order', target: 'track-metrics' },

      // Error path
      { source: 'payment-error-handler', target: 'rollback-transaction' },
      { source: 'rollback-transaction', target: 'restore-inventory' },
      { source: 'restore-inventory', target: 'log-error' },
      { source: 'log-error', target: 'notify-error' },
      { source: 'notify-error', target: 'return-error' }
    ],
    envVars: [
      'DATABASE_URL',
      'STRIPE_SECRET_KEY',
      'RESEND_API_KEY',
      'TWILIO_ACCOUNT_SID',
      'TWILIO_AUTH_TOKEN',
      'TWILIO_PHONE_NUMBER',
      'RABBITMQ_URL',
      'DATADOG_API_KEY',
      'SLACK_WEBHOOK_URL'
    ]
  },

  // WORKFLOW 2: Real-time Analytics Pipeline
  {
    id: 'realtime-analytics',
    name: '📊 Real-time Analytics Pipeline',
    description: 'High-performance event processing with streaming, aggregation, and ML',
    category: 'data',
    nodes: [
      // 1. Kafka consumer (streaming)
      {
        id: 'kafka-consumer',
        capsuleId: 'kafka-consumer',
        position: { x: 100, y: 100 },
        config: {
          brokers: '${KAFKA_BROKERS}',
          groupId: 'analytics-pipeline',
          topic: 'user-events',
          fromBeginning: false,
          autoCommit: false,
          batchSize: 100,
          maxWaitTime: 1000
        }
      },

      // 2. Batch events for efficiency
      {
        id: 'batch-events',
        capsuleId: 'array-batcher',
        position: { x: 350, y: 100 },
        config: {
          batchSize: 100,
          maxWaitMs: 1000,
          flushOnShutdown: true
        }
      },

      // 3. Parallel processing (fan-out)
      {
        id: 'parallel-processor',
        capsuleId: 'parallel-executor',
        position: { x: 600, y: 100 },
        config: {
          maxConcurrency: 10,
          timeout: 5000
        }
      },

      // 4a. Write to TimescaleDB (time-series)
      {
        id: 'write-timescale',
        capsuleId: 'database-timescale',
        position: { x: 850, y: 50 },
        config: {
          connectionString: '${TIMESCALE_URL}',
          query: `INSERT INTO events (
                    user_id, event_type, properties, timestamp
                  )
                  SELECT
                    (event->>'userId')::uuid,
                    event->>'eventType',
                    event->'properties',
                    (event->>'timestamp')::timestamptz
                  FROM jsonb_array_elements($1::jsonb) AS event
                  ON CONFLICT DO NOTHING`,
          params: '[{{ batch-events.batch }}]',
          hypertable: 'events',
          chunkInterval: '1 day'
        }
      },

      // 4b. Update real-time aggregations (Redis)
      {
        id: 'update-redis-counters',
        capsuleId: 'redis-pipeline',
        position: { x: 850, y: 150 },
        config: {
          connectionString: '${REDIS_URL}',
          commands: `[
  { cmd: 'HINCRBY', args: ['stats:daily', 'events', {{ batch-events.batch.length }}] },
  { cmd: 'HINCRBY', args: ['stats:hourly', 'events', {{ batch-events.batch.length }}] },
  { cmd: 'PFADD', args: ['unique_users:today', ...{{ batch-events.batch.map(e => e.userId) }}] },
  { cmd: 'ZADD', args: ['trending:events', ...{{ batch-events.batch.flatMap(e => [Date.now(), e.eventType]) }}] }
]`
        }
      },

      // 4c. Stream to ClickHouse (OLAP)
      {
        id: 'stream-clickhouse',
        capsuleId: 'clickhouse-insert',
        position: { x: 850, y: 250 },
        config: {
          host: '${CLICKHOUSE_HOST}',
          database: 'analytics',
          table: 'events',
          values: '{{ batch-events.batch }}',
          format: 'JSONEachRow',
          async: true
        }
      },

      // 5. Run ML model for anomaly detection
      {
        id: 'anomaly-detection',
        capsuleId: 'ml-model',
        position: { x: 1100, y: 100 },
        config: {
          modelUrl: '${ML_MODEL_URL}/anomaly-detection',
          input: {
            events: '{{ batch-events.batch }}',
            window: '5m'
          },
          threshold: 0.95
        }
      },

      // 6. Conditional: anomaly detected?
      {
        id: 'check-anomaly',
        capsuleId: 'router',
        position: { x: 1350, y: 100 },
        config: {
          condition: '{{ anomaly-detection.score }} > 0.95',
          truePath: 'alert-anomaly',
          falsePath: 'continue-processing'
        }
      },

      // 7. Alert on anomaly
      {
        id: 'alert-anomaly',
        capsuleId: 'pagerduty-alert',
        position: { x: 1600, y: 50 },
        config: {
          apiKey: '${PAGERDUTY_API_KEY}',
          severity: 'critical',
          title: 'Anomaly detected in user events',
          details: {
            score: '{{ anomaly-detection.score }}',
            events: '{{ batch-events.batch.length }}',
            timestamp: '{{ Date.now() }}'
          }
        }
      },

      // 8. Update materialized views
      {
        id: 'refresh-views',
        capsuleId: 'database-postgresql',
        position: { x: 1600, y: 150 },
        config: {
          connectionString: '${DATABASE_URL}',
          query: 'REFRESH MATERIALIZED VIEW CONCURRENTLY user_activity_summary'
        }
      },

      // 9. Cache aggregated data
      {
        id: 'cache-aggregations',
        capsuleId: 'cache-redis',
        position: { x: 1850, y: 100 },
        config: {
          operation: 'set',
          key: 'analytics:latest',
          value: {
            totalEvents: '{{ write-timescale.rowCount }}',
            uniqueUsers: '{{ update-redis-counters.results[2] }}',
            timestamp: '{{ Date.now() }}'
          },
          ttl: 60
        }
      },

      // 10. Commit Kafka offset
      {
        id: 'commit-offset',
        capsuleId: 'kafka-commit',
        position: { x: 2100, y: 100 },
        config: {
          consumer: '{{ kafka-consumer.consumer }}',
          offsetCommitInterval: 5000
        }
      },

      // 11. Track processing metrics
      {
        id: 'track-pipeline-metrics',
        capsuleId: 'metrics-prometheus',
        position: { x: 2350, y: 100 },
        config: {
          pushgateway: '${PROMETHEUS_PUSHGATEWAY}',
          metrics: [
            {
              name: 'events_processed_total',
              value: '{{ batch-events.batch.length }}',
              type: 'counter'
            },
            {
              name: 'processing_latency_ms',
              value: '{{ Date.now() - batch-events.timestamp }}',
              type: 'histogram'
            },
            {
              name: 'anomaly_score',
              value: '{{ anomaly-detection.score }}',
              type: 'gauge'
            }
          ]
        }
      }
    ],
    edges: [
      { source: 'kafka-consumer', target: 'batch-events' },
      { source: 'batch-events', target: 'parallel-processor' },
      { source: 'parallel-processor', target: 'write-timescale' },
      { source: 'parallel-processor', target: 'update-redis-counters' },
      { source: 'parallel-processor', target: 'stream-clickhouse' },
      { source: 'write-timescale', target: 'anomaly-detection' },
      { source: 'update-redis-counters', target: 'anomaly-detection' },
      { source: 'stream-clickhouse', target: 'anomaly-detection' },
      { source: 'anomaly-detection', target: 'check-anomaly' },
      { source: 'check-anomaly', target: 'alert-anomaly' },
      { source: 'check-anomaly', target: 'refresh-views' },
      { source: 'alert-anomaly', target: 'refresh-views' },
      { source: 'refresh-views', target: 'cache-aggregations' },
      { source: 'cache-aggregations', target: 'commit-offset' },
      { source: 'commit-offset', target: 'track-pipeline-metrics' }
    ],
    envVars: [
      'KAFKA_BROKERS',
      'TIMESCALE_URL',
      'REDIS_URL',
      'CLICKHOUSE_HOST',
      'ML_MODEL_URL',
      'PAGERDUTY_API_KEY',
      'DATABASE_URL',
      'PROMETHEUS_PUSHGATEWAY'
    ]
  },

  // WORKFLOW 3: Multi-region Content Delivery
  {
    id: 'cdn-content-delivery',
    name: '🌍 Multi-Region CDN Pipeline',
    description: 'Upload, optimize, and distribute content globally with caching',
    category: 'storage',
    nodes: [
      // 1. Webhook (file upload)
      {
        id: 'upload-webhook',
        capsuleId: 'webhook',
        position: { x: 100, y: 100 },
        config: {
          method: 'POST',
          path: '/api/upload',
          maxFileSize: '100MB',
          allowedMimeTypes: ['image/*', 'video/*', 'application/pdf']
        }
      },

      // 2. Virus scan
      {
        id: 'virus-scan',
        capsuleId: 'clamav-scan',
        position: { x: 350, y: 100 },
        config: {
          host: '${CLAMAV_HOST}',
          timeout: 30000
        }
      },

      // 3. Conditional: safe file?
      {
        id: 'check-virus',
        capsuleId: 'router',
        position: { x: 600, y: 100 },
        config: {
          condition: '{{ virus-scan.infected }} === false',
          truePath: 'process-file',
          falsePath: 'reject-file'
        }
      },

      // 4. Detect file type
      {
        id: 'detect-type',
        capsuleId: 'file-type-detector',
        position: { x: 850, y: 100 },
        config: {
          buffer: '{{ upload-webhook.file }}'
        }
      },

      // 5. Router: by file type
      {
        id: 'type-router',
        capsuleId: 'router',
        position: { x: 1100, y: 100 },
        config: {
          routes: [
            { condition: '{{ detect-type.mime.startsWith("image/") }}', path: 'optimize-image' },
            { condition: '{{ detect-type.mime.startsWith("video/") }}', path: 'transcode-video' },
            { condition: '{{ detect-type.mime === "application/pdf" }}', path: 'compress-pdf' }
          ]
        }
      },

      // 6a. Optimize image
      {
        id: 'optimize-image',
        capsuleId: 'image-optimizer',
        position: { x: 1350, y: 50 },
        config: {
          quality: 85,
          formats: ['webp', 'avif', 'jpeg'],
          sizes: [
            { name: 'thumbnail', width: 150, height: 150 },
            { name: 'small', width: 480 },
            { name: 'medium', width: 1024 },
            { name: 'large', width: 2048 }
          ],
          stripMetadata: true
        }
      },

      // 6b. Transcode video
      {
        id: 'transcode-video',
        capsuleId: 'video-transcoder',
        position: { x: 1350, y: 150 },
        config: {
          presets: [
            { name: '480p', width: 854, height: 480, bitrate: '1M' },
            { name: '720p', width: 1280, height: 720, bitrate: '2.5M' },
            { name: '1080p', width: 1920, height: 1080, bitrate: '5M' }
          ],
          codec: 'h264',
          generateThumbnail: true
        }
      },

      // 6c. Compress PDF
      {
        id: 'compress-pdf',
        capsuleId: 'pdf-compressor',
        position: { x: 1350, y: 250 },
        config: {
          quality: 'high',
          optimize: true,
          linearize: true
        }
      },

      // 7. Upload to S3 (origin)
      {
        id: 'upload-s3-origin',
        capsuleId: 's3-upload',
        position: { x: 1600, y: 100 },
        config: {
          bucket: '${S3_ORIGIN_BUCKET}',
          key: 'uploads/{{ Date.now() }}/{{ upload-webhook.filename }}',
          acl: 'private',
          storageClass: 'STANDARD_IA',
          metadata: {
            originalName: '{{ upload-webhook.filename }}',
            mimeType: '{{ detect-type.mime }}',
            uploadedBy: '{{ upload-webhook.userId }}'
          }
        }
      },

      // 8. Replicate to multiple regions (parallel)
      {
        id: 'replicate-regions',
        capsuleId: 'parallel-executor',
        position: { x: 1850, y: 100 },
        config: {
          tasks: [
            {
              capsule: 's3-upload',
              config: { bucket: '${S3_US_EAST}', region: 'us-east-1' }
            },
            {
              capsule: 's3-upload',
              config: { bucket: '${S3_EU_WEST}', region: 'eu-west-1' }
            },
            {
              capsule: 's3-upload',
              config: { bucket: '${S3_AP_SOUTHEAST}', region: 'ap-southeast-1' }
            }
          ],
          maxConcurrency: 3
        }
      },

      // 9. Invalidate CloudFront cache
      {
        id: 'invalidate-cdn',
        capsuleId: 'cloudfront-invalidation',
        position: { x: 2100, y: 100 },
        config: {
          distributionId: '${CLOUDFRONT_DISTRIBUTION_ID}',
          paths: [
            '/uploads/{{ upload-webhook.filename }}',
            '/uploads/{{ upload-webhook.filename }}/*'
          ]
        }
      },

      // 10. Generate CDN URLs
      {
        id: 'generate-urls',
        capsuleId: 'transformer',
        position: { x: 2350, y: 100 },
        config: {
          code: `const baseUrl = '${CDN_URL}'
const filename = input.filename

return {
  original: \`\${baseUrl}/\${filename}\`,
  thumbnail: \`\${baseUrl}/\${filename}?size=thumbnail\`,
  small: \`\${baseUrl}/\${filename}?size=small\`,
  medium: \`\${baseUrl}/\${filename}?size=medium\`,
  large: \`\${baseUrl}/\${filename}?size=large\`
}`
        }
      },

      // 11. Save to database
      {
        id: 'save-metadata',
        capsuleId: 'database-postgresql',
        position: { x: 2600, y: 100 },
        config: {
          connectionString: '${DATABASE_URL}',
          query: `INSERT INTO files (
                    user_id, filename, mime_type, size,
                    s3_key, cdn_urls, regions, created_at
                  ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
                  RETURNING id, cdn_urls`,
          params: `[
  "{{ upload-webhook.userId }}",
  "{{ upload-webhook.filename }}",
  "{{ detect-type.mime }}",
  {{ upload-webhook.size }},
  "{{ upload-s3-origin.key }}",
  {{ generate-urls.output }},
  ["us-east-1", "eu-west-1", "ap-southeast-1"]
]`
        }
      },

      // 12. Send webhook notification
      {
        id: 'notify-upload-complete',
        capsuleId: 'webhook-outgoing',
        position: { x: 2850, y: 100 },
        config: {
          url: '{{ upload-webhook.callbackUrl }}',
          method: 'POST',
          body: {
            fileId: '{{ save-metadata.rows[0].id }}',
            urls: '{{ save-metadata.rows[0].cdn_urls }}',
            status: 'completed'
          },
          headers: {
            'X-Signature': '{{ hmac("sha256", upload-webhook.secret, save-metadata.rows[0].id) }}'
          }
        }
      }
    ],
    edges: [
      { source: 'upload-webhook', target: 'virus-scan' },
      { source: 'virus-scan', target: 'check-virus' },
      { source: 'check-virus', target: 'detect-type' },
      { source: 'detect-type', target: 'type-router' },
      { source: 'type-router', target: 'optimize-image' },
      { source: 'type-router', target: 'transcode-video' },
      { source: 'type-router', target: 'compress-pdf' },
      { source: 'optimize-image', target: 'upload-s3-origin' },
      { source: 'transcode-video', target: 'upload-s3-origin' },
      { source: 'compress-pdf', target: 'upload-s3-origin' },
      { source: 'upload-s3-origin', target: 'replicate-regions' },
      { source: 'replicate-regions', target: 'invalidate-cdn' },
      { source: 'invalidate-cdn', target: 'generate-urls' },
      { source: 'generate-urls', target: 'save-metadata' },
      { source: 'save-metadata', target: 'notify-upload-complete' }
    ],
    envVars: [
      'CLAMAV_HOST',
      'S3_ORIGIN_BUCKET',
      'S3_US_EAST',
      'S3_EU_WEST',
      'S3_AP_SOUTHEAST',
      'CLOUDFRONT_DISTRIBUTION_ID',
      'CDN_URL',
      'DATABASE_URL'
    ]
  }
]
