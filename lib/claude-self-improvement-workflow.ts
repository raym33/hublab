/**
 * CLAUDE SELF-IMPROVEMENT WORKFLOW
 *
 * Este workflow permite a Claude auto-mejorarse y construir software autónomamente.
 * Es un sistema meta que analiza código, detecta mejoras, genera soluciones y las implementa.
 */

import { WorkflowTemplate } from './workflow-templates'

export const CLAUDE_SELF_IMPROVEMENT_WORKFLOWS: WorkflowTemplate[] = [
  // WORKFLOW 1: Auto-análisis y mejora de código
  {
    id: 'claude-code-analysis',
    name: '🤖 Claude Auto-Análisis de Código',
    description: 'Claude analiza su propio código, detecta problemas y genera mejoras automáticamente',
    category: 'ai',
    nodes: [
      // 1. Trigger: Webhook para recibir solicitudes de análisis
      {
        id: 'webhook-analysis-trigger',
        capsuleId: 'webhook',
        position: { x: 100, y: 100 },
        config: {
          method: 'POST',
          path: '/api/claude/analyze'
        }
      },

      // 2. Validar request
      {
        id: 'validate-request',
        capsuleId: 'validator',
        position: { x: 350, y: 100 },
        config: {
          schema: `z.object({
  repositoryUrl: z.string().url(),
  targetFiles: z.array(z.string()).optional(),
  analysisType: z.enum(['bugs', 'performance', 'security', 'architecture']),
  autoFix: z.boolean().default(false)
})`
        }
      },

      // 3. Clonar repositorio
      {
        id: 'clone-repo',
        capsuleId: 'http',
        position: { x: 600, y: 100 },
        config: {
          method: 'POST',
          url: '${GITHUB_API_URL}/repos/clone',
          headers: '{ "Authorization": "Bearer ${GITHUB_TOKEN}" }',
          body: '{{ validate-request.data }}'
        }
      },

      // 4. Leer archivos del código
      {
        id: 'read-codebase',
        capsuleId: 's3-download',
        position: { x: 850, y: 100 },
        config: {
          bucket: '${CODE_ANALYSIS_BUCKET}',
          key: '{{ clone-repo.response.path }}',
          region: 'us-east-1'
        }
      },

      // 5. Claude analiza el código
      {
        id: 'claude-analyze',
        capsuleId: 'ai-chat-claude',
        position: { x: 1100, y: 100 },
        config: {
          apiKey: '${ANTHROPIC_API_KEY}',
          model: 'claude-sonnet-4.5',
          systemPrompt: `Eres Claude, un asistente de programación experto. Analiza el código proporcionado y genera un informe detallado con:

1. PROBLEMAS DETECTADOS:
   - Bugs potenciales
   - Vulnerabilidades de seguridad
   - Problemas de rendimiento
   - Code smells
   - Deuda técnica

2. ARQUITECTURA:
   - Patrones detectados
   - Sugerencias de mejora
   - Refactoring recomendado

3. MEJORAS ESPECÍFICAS:
   - Para cada problema, proporciona:
     * Ubicación exacta (archivo:línea)
     * Descripción del problema
     * Código mejorado
     * Justificación

Formato de salida: JSON estructurado`,
          prompt: `Analiza este código y genera un informe de mejoras:\n\n{{ read-codebase.content }}`,
          temperature: 0.3,
          maxTokens: 16000
        }
      },

      // 6. Generar embeddings del código para búsqueda semántica
      {
        id: 'generate-embeddings',
        capsuleId: 'ai-embeddings',
        position: { x: 1350, y: 100 },
        config: {
          provider: 'openai',
          apiKey: '${OPENAI_API_KEY}',
          model: 'text-embedding-3-large',
          input: '{{ read-codebase.content }}'
        }
      },

      // 7. Guardar análisis en base de datos
      {
        id: 'save-analysis',
        capsuleId: 'database-postgresql',
        position: { x: 1600, y: 100 },
        config: {
          connectionString: '${DATABASE_URL}',
          query: `INSERT INTO code_analysis (repo_url, analysis_type, findings, embeddings, created_at)
                  VALUES ($1, $2, $3, $4, NOW())
                  RETURNING id`,
          params: `[
  "{{ validate-request.data.repositoryUrl }}",
  "{{ validate-request.data.analysisType }}",
  {{ claude-analyze.response }},
  {{ generate-embeddings.embeddings }}
]`
        }
      },

      // 8. Conditional: ¿Auto-fix habilitado?
      {
        id: 'check-autofix',
        capsuleId: 'router',
        position: { x: 1850, y: 100 },
        config: {
          condition: '{{ validate-request.data.autoFix }} === true',
          truePath: 'generate-fixes',
          falsePath: 'send-report'
        }
      },

      // 9a. Generar fixes automáticos (si autoFix = true)
      {
        id: 'generate-fixes',
        capsuleId: 'ai-chat-claude',
        position: { x: 2100, y: 50 },
        config: {
          apiKey: '${ANTHROPIC_API_KEY}',
          model: 'claude-sonnet-4.5',
          systemPrompt: `Eres Claude, un desarrollador experto. Genera código corregido para cada problema detectado.

IMPORTANTE:
- Genera diffs aplicables directamente
- Mantén el estilo del código original
- Añade comentarios explicando los cambios
- Asegúrate de que el código sea 100% funcional`,
          prompt: `Genera fixes para estos problemas:\n\n{{ claude-analyze.response }}`,
          temperature: 0.2,
          maxTokens: 16000
        }
      },

      // 10. Crear Pull Request con los fixes
      {
        id: 'create-pr',
        capsuleId: 'http',
        position: { x: 2350, y: 50 },
        config: {
          method: 'POST',
          url: '${GITHUB_API_URL}/repos/{{ validate-request.data.repositoryUrl }}/pulls',
          headers: '{ "Authorization": "Bearer ${GITHUB_TOKEN}" }',
          body: `{
  "title": "🤖 Claude Auto-Fix: {{ validate-request.data.analysisType }}",
  "body": "## Auto-generated fixes by Claude\\n\\n{{ generate-fixes.response }}\\n\\n**Analysis ID:** {{ save-analysis.rows[0].id }}",
  "head": "claude-autofix-{{ save-analysis.rows[0].id }}",
  "base": "main"
}`
        }
      },

      // 9b. Enviar reporte (si autoFix = false)
      {
        id: 'send-report',
        capsuleId: 'email',
        position: { x: 2100, y: 200 },
        config: {
          provider: 'resend',
          apiKey: '${RESEND_API_KEY}',
          from: 'claude@hublab.dev',
          to: '{{ validate-request.data.email }}',
          subject: '🤖 Análisis de código completado - {{ validate-request.data.repositoryUrl }}',
          body: `
<h1>Análisis de Código Completado</h1>

<h2>Repositorio:</h2>
<p>{{ validate-request.data.repositoryUrl }}</p>

<h2>Tipo de Análisis:</h2>
<p>{{ validate-request.data.analysisType }}</p>

<h2>Resultados:</h2>
<pre>{{ claude-analyze.response }}</pre>

<h2>ID de Análisis:</h2>
<p>{{ save-analysis.rows[0].id }}</p>

<p><em>Generado automáticamente por Claude Self-Improvement System</em></p>
`
        }
      },

      // 11. Logger final
      {
        id: 'log-completion',
        capsuleId: 'logger',
        position: { x: 2600, y: 100 },
        config: {
          level: 'info',
          message: 'Claude self-improvement analysis completed'
        }
      }
    ],
    edges: [
      { source: 'webhook-analysis-trigger', target: 'validate-request' },
      { source: 'validate-request', target: 'clone-repo' },
      { source: 'clone-repo', target: 'read-codebase' },
      { source: 'read-codebase', target: 'claude-analyze' },
      { source: 'claude-analyze', target: 'generate-embeddings' },
      { source: 'generate-embeddings', target: 'save-analysis' },
      { source: 'save-analysis', target: 'check-autofix' },
      { source: 'check-autofix', target: 'generate-fixes' },
      { source: 'generate-fixes', target: 'create-pr' },
      { source: 'create-pr', target: 'log-completion' },
      { source: 'check-autofix', target: 'send-report' },
      { source: 'send-report', target: 'log-completion' }
    ],
    envVars: [
      'ANTHROPIC_API_KEY',
      'OPENAI_API_KEY',
      'GITHUB_TOKEN',
      'GITHUB_API_URL',
      'DATABASE_URL',
      'RESEND_API_KEY',
      'CODE_ANALYSIS_BUCKET'
    ]
  },

  // WORKFLOW 2: Auto-generación de nuevas cápsulas
  {
    id: 'claude-capsule-generator',
    name: '🧩 Claude Auto-Generador de Cápsulas',
    description: 'Claude detecta necesidades de nuevas cápsulas y las genera automáticamente',
    category: 'ai',
    nodes: [
      // 1. Webhook trigger
      {
        id: 'webhook-capsule-request',
        capsuleId: 'webhook',
        position: { x: 100, y: 100 },
        config: {
          method: 'POST',
          path: '/api/claude/generate-capsule'
        }
      },

      // 2. Validar request
      {
        id: 'validate-capsule-request',
        capsuleId: 'validator',
        position: { x: 350, y: 100 },
        config: {
          schema: `z.object({
  capsuleName: z.string(),
  description: z.string(),
  category: z.enum(['auth', 'data', 'ai', 'communication', 'payments', 'storage', 'workflow']),
  features: z.array(z.string()),
  npmPackages: z.array(z.string()).optional()
})`
        }
      },

      // 3. Buscar cápsulas similares existentes
      {
        id: 'search-similar',
        capsuleId: 'ai-embeddings',
        position: { x: 600, y: 100 },
        config: {
          provider: 'openai',
          apiKey: '${OPENAI_API_KEY}',
          model: 'text-embedding-3-large',
          input: '{{ validate-capsule-request.data.description }}'
        }
      },

      // 4. Query base de datos de cápsulas
      {
        id: 'query-existing-capsules',
        capsuleId: 'database-postgresql',
        position: { x: 850, y: 100 },
        config: {
          connectionString: '${DATABASE_URL}',
          query: `SELECT * FROM capsules
                  ORDER BY embeddings <-> $1::vector
                  LIMIT 5`,
          params: '[{{ search-similar.embeddings }}]'
        }
      },

      // 5. Claude genera la nueva cápsula
      {
        id: 'claude-generate-capsule',
        capsuleId: 'ai-chat-claude',
        position: { x: 1100, y: 100 },
        config: {
          apiKey: '${ANTHROPIC_API_KEY}',
          model: 'claude-sonnet-4.5',
          systemPrompt: `Eres Claude, un arquitecto de software experto. Genera una nueva cápsula para el sistema HubLab.

ESTRUCTURA DE CÁPSULA:
{
  id: string,
  name: string,
  category: CapsuleCategory,
  icon: string (emoji),
  color: string (hex),
  description: string,
  configFields: CapsuleField[],
  inputPorts: InputPort[],
  outputPorts: OutputPort[],
  npmPackage?: string,
  documentation?: string,
  codeTemplate: string (código ejecutable con placeholders)
}

REGLAS:
1. El código debe ser production-ready
2. Usa TypeScript
3. Maneja errores apropiadamente
4. Incluye validación de inputs
5. El codeTemplate debe usar placeholders {{config.X}}
6. Los inputPorts/outputPorts deben tener tipos correctos

CÁPSULAS SIMILARES EXISTENTES:
{{ query-existing-capsules.rows }}

Genera una cápsula MEJOR y MÁS COMPLETA que las existentes.`,
          prompt: `Genera una nueva cápsula con estas especificaciones:

Nombre: {{ validate-capsule-request.data.capsuleName }}
Descripción: {{ validate-capsule-request.data.description }}
Categoría: {{ validate-capsule-request.data.category }}
Features: {{ validate-capsule-request.data.features }}
NPM Packages: {{ validate-capsule-request.data.npmPackages }}

Genera el código completo en formato JSON.`,
          temperature: 0.4,
          maxTokens: 8000
        }
      },

      // 6. Validar código generado
      {
        id: 'validate-generated-code',
        capsuleId: 'validator',
        position: { x: 1350, y: 100 },
        config: {
          schema: `z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  icon: z.string(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i),
  description: z.string(),
  configFields: z.array(z.any()),
  inputPorts: z.array(z.any()),
  outputPorts: z.array(z.any()),
  codeTemplate: z.string()
})`
        }
      },

      // 7. Generar tests automáticos
      {
        id: 'generate-tests',
        capsuleId: 'ai-chat-claude',
        position: { x: 1600, y: 100 },
        config: {
          apiKey: '${ANTHROPIC_API_KEY}',
          model: 'claude-sonnet-4.5',
          systemPrompt: 'Genera tests unitarios completos usando Jest para validar la cápsula.',
          prompt: 'Genera tests para esta cápsula:\n\n{{ validate-generated-code.data }}',
          temperature: 0.3
        }
      },

      // 8. Ejecutar tests
      {
        id: 'run-tests',
        capsuleId: 'http',
        position: { x: 1850, y: 100 },
        config: {
          method: 'POST',
          url: '${TEST_RUNNER_URL}/run',
          body: '{{ generate-tests.response }}'
        }
      },

      // 9. Conditional: ¿Tests pasaron?
      {
        id: 'check-tests',
        capsuleId: 'router',
        position: { x: 2100, y: 100 },
        config: {
          condition: '{{ run-tests.response.success }} === true',
          truePath: 'save-capsule',
          falsePath: 'retry-generation'
        }
      },

      // 10a. Guardar cápsula (si tests OK)
      {
        id: 'save-capsule',
        capsuleId: 'database-postgresql',
        position: { x: 2350, y: 50 },
        config: {
          connectionString: '${DATABASE_URL}',
          query: `INSERT INTO capsules (data, embeddings, tests, created_at)
                  VALUES ($1, $2, $3, NOW())
                  RETURNING id`,
          params: `[
  {{ validate-generated-code.data }},
  {{ search-similar.embeddings }},
  {{ generate-tests.response }}
]`
        }
      },

      // 11. Actualizar archivo de cápsulas
      {
        id: 'update-capsules-file',
        capsuleId: 'http',
        position: { x: 2600, y: 50 },
        config: {
          method: 'POST',
          url: '${GITHUB_API_URL}/repos/hublab/contents/lib/complete-capsules.ts',
          headers: '{ "Authorization": "Bearer ${GITHUB_TOKEN}" }',
          body: `{
  "message": "🤖 Claude auto-generated new capsule: {{ validate-capsule-request.data.capsuleName }}",
  "content": "{{ base64(validate-generated-code.data) }}"
}`
        }
      },

      // 12. Crear PR
      {
        id: 'create-capsule-pr',
        capsuleId: 'http',
        position: { x: 2850, y: 50 },
        config: {
          method: 'POST',
          url: '${GITHUB_API_URL}/repos/hublab/pulls',
          headers: '{ "Authorization": "Bearer ${GITHUB_TOKEN}" }',
          body: `{
  "title": "🧩 New Capsule: {{ validate-capsule-request.data.capsuleName }}",
  "body": "## Auto-generated by Claude\\n\\n{{ validate-generated-code.data.description }}\\n\\n### Tests:\\n✅ All tests passing",
  "head": "capsule/{{ validate-capsule-request.data.capsuleName }}",
  "base": "main"
}`
        }
      },

      // 10b. Retry con feedback (si tests fallan)
      {
        id: 'retry-generation',
        capsuleId: 'ai-chat-claude',
        position: { x: 2350, y: 200 },
        config: {
          apiKey: '${ANTHROPIC_API_KEY}',
          model: 'claude-sonnet-4.5',
          prompt: `Los tests fallaron. Errores:\n\n{{ run-tests.response.errors }}\n\nCódigo original:\n\n{{ validate-generated-code.data }}\n\nCorrige el código.`,
          temperature: 0.3
        }
      }
    ],
    edges: [
      { source: 'webhook-capsule-request', target: 'validate-capsule-request' },
      { source: 'validate-capsule-request', target: 'search-similar' },
      { source: 'search-similar', target: 'query-existing-capsules' },
      { source: 'query-existing-capsules', target: 'claude-generate-capsule' },
      { source: 'claude-generate-capsule', target: 'validate-generated-code' },
      { source: 'validate-generated-code', target: 'generate-tests' },
      { source: 'generate-tests', target: 'run-tests' },
      { source: 'run-tests', target: 'check-tests' },
      { source: 'check-tests', target: 'save-capsule' },
      { source: 'save-capsule', target: 'update-capsules-file' },
      { source: 'update-capsules-file', target: 'create-capsule-pr' },
      { source: 'check-tests', target: 'retry-generation' },
      { source: 'retry-generation', target: 'validate-generated-code' }
    ],
    envVars: [
      'ANTHROPIC_API_KEY',
      'OPENAI_API_KEY',
      'DATABASE_URL',
      'GITHUB_TOKEN',
      'GITHUB_API_URL',
      'TEST_RUNNER_URL'
    ]
  },

  // WORKFLOW 3: Auto-aprendizaje continuo
  {
    id: 'claude-continuous-learning',
    name: '📚 Claude Aprendizaje Continuo',
    description: 'Claude aprende de cada interacción y mejora sus respuestas',
    category: 'ai',
    nodes: [
      // 1. Scheduler: cada hora
      {
        id: 'learning-schedule',
        capsuleId: 'scheduler',
        position: { x: 100, y: 100 },
        config: {
          cron: '0 * * * *', // Cada hora
          timezone: 'UTC'
        }
      },

      // 2. Query interacciones recientes
      {
        id: 'fetch-interactions',
        capsuleId: 'database-postgresql',
        position: { x: 350, y: 100 },
        config: {
          connectionString: '${DATABASE_URL}',
          query: `SELECT * FROM claude_interactions
                  WHERE created_at > NOW() - INTERVAL '1 hour'
                  AND feedback IS NOT NULL
                  ORDER BY created_at DESC`
        }
      },

      // 3. Analizar feedback
      {
        id: 'analyze-feedback',
        capsuleId: 'ai-chat-claude',
        position: { x: 600, y: 100 },
        config: {
          apiKey: '${ANTHROPIC_API_KEY}',
          model: 'claude-sonnet-4.5',
          systemPrompt: `Eres Claude analizando tu propio desempeño. Identifica:

1. PATRONES DE ÉXITO:
   - Qué respuestas recibieron feedback positivo
   - Qué técnicas funcionaron mejor
   - Qué tipo de problemas resolviste bien

2. ÁREAS DE MEJORA:
   - Qué respuestas recibieron feedback negativo
   - Errores comunes
   - Malentendidos frecuentes

3. NUEVOS APRENDIZAJES:
   - Conceptos nuevos que encontraste
   - APIs o tecnologías que usaste
   - Patrones de código que generaste

Genera un informe estructurado para mejorar futuras respuestas.`,
          prompt: `Analiza estas interacciones:\n\n{{ fetch-interactions.rows }}`,
          temperature: 0.3,
          maxTokens: 8000
        }
      },

      // 4. Generar embeddings de aprendizajes
      {
        id: 'embed-learnings',
        capsuleId: 'ai-embeddings',
        position: { x: 850, y: 100 },
        config: {
          provider: 'openai',
          apiKey: '${OPENAI_API_KEY}',
          model: 'text-embedding-3-large',
          input: '{{ analyze-feedback.response }}'
        }
      },

      // 5. Guardar en knowledge base
      {
        id: 'save-learnings',
        capsuleId: 'database-postgresql',
        position: { x: 1100, y: 100 },
        config: {
          connectionString: '${DATABASE_URL}',
          query: `INSERT INTO claude_knowledge_base (analysis, embeddings, source_interactions, created_at)
                  VALUES ($1, $2, $3, NOW())`,
          params: `[
  {{ analyze-feedback.response }},
  {{ embed-learnings.embeddings }},
  {{ fetch-interactions.rows.length }}
]`
        }
      },

      // 6. Actualizar prompt templates
      {
        id: 'update-prompts',
        capsuleId: 'ai-chat-claude',
        position: { x: 1350, y: 100 },
        config: {
          apiKey: '${ANTHROPIC_API_KEY}',
          model: 'claude-sonnet-4.5',
          systemPrompt: 'Genera prompts mejorados basados en los aprendizajes.',
          prompt: 'Basado en este análisis, mejora los system prompts:\n\n{{ analyze-feedback.response }}',
          temperature: 0.4
        }
      },

      // 7. Guardar prompts mejorados
      {
        id: 'save-prompts',
        capsuleId: 'database-postgresql',
        position: { x: 1600, y: 100 },
        config: {
          connectionString: '${DATABASE_URL}',
          query: `INSERT INTO claude_prompts (category, prompt_text, version, created_at)
                  VALUES ($1, $2, $3, NOW())`,
          params: `[
  "improved",
  {{ update-prompts.response }},
  {{ Date.now() }}
]`
        }
      },

      // 8. Notificación Slack
      {
        id: 'notify-learning',
        capsuleId: 'slack-message',
        position: { x: 1850, y: 100 },
        config: {
          webhookUrl: '${SLACK_WEBHOOK_URL}',
          channel: '#claude-learning',
          message: `🧠 *Claude Learning Update*

Interacciones analizadas: {{ fetch-interactions.rows.length }}

*Resumen:*
{{ analyze-feedback.response }}

*Prompts actualizados:* ✅
          `
        }
      }
    ],
    edges: [
      { source: 'learning-schedule', target: 'fetch-interactions' },
      { source: 'fetch-interactions', target: 'analyze-feedback' },
      { source: 'analyze-feedback', target: 'embed-learnings' },
      { source: 'embed-learnings', target: 'save-learnings' },
      { source: 'save-learnings', target: 'update-prompts' },
      { source: 'update-prompts', target: 'save-prompts' },
      { source: 'save-prompts', target: 'notify-learning' }
    ],
    envVars: [
      'ANTHROPIC_API_KEY',
      'OPENAI_API_KEY',
      'DATABASE_URL',
      'SLACK_WEBHOOK_URL'
    ]
  },

  // WORKFLOW 4: Auto-deployment pipeline
  {
    id: 'claude-auto-deploy',
    name: '🚀 Claude Auto-Deployment',
    description: 'Claude revisa PRs, ejecuta tests y despliega automáticamente',
    category: 'workflow',
    nodes: [
      // 1. GitHub webhook (PR creado/actualizado)
      {
        id: 'github-webhook',
        capsuleId: 'webhook',
        position: { x: 100, y: 100 },
        config: {
          method: 'POST',
          path: '/api/github/webhook'
        }
      },

      // 2. Validar evento de GitHub
      {
        id: 'validate-github-event',
        capsuleId: 'validator',
        position: { x: 350, y: 100 },
        config: {
          schema: `z.object({
  action: z.enum(['opened', 'synchronize', 'reopened']),
  pull_request: z.object({
    number: z.number(),
    title: z.string(),
    diff_url: z.string(),
    html_url: z.string()
  })
})`
        }
      },

      // 3. Descargar diff del PR
      {
        id: 'fetch-pr-diff',
        capsuleId: 'http',
        position: { x: 600, y: 100 },
        config: {
          method: 'GET',
          url: '{{ validate-github-event.data.pull_request.diff_url }}',
          headers: '{ "Authorization": "Bearer ${GITHUB_TOKEN}" }'
        }
      },

      // 4. Claude revisa el código
      {
        id: 'claude-review',
        capsuleId: 'ai-chat-claude',
        position: { x: 850, y: 100 },
        config: {
          apiKey: '${ANTHROPIC_API_KEY}',
          model: 'claude-sonnet-4.5',
          systemPrompt: `Eres Claude, un code reviewer experto. Revisa el PR y genera un informe detallado:

1. CALIDAD DEL CÓDIGO:
   - ✅ Buenas prácticas seguidas
   - ❌ Problemas encontrados
   - 💡 Sugerencias de mejora

2. SEGURIDAD:
   - Vulnerabilidades potenciales
   - Validación de inputs
   - Manejo de errores

3. PERFORMANCE:
   - Optimizaciones posibles
   - Bottlenecks

4. TESTS:
   - ¿Tests incluidos?
   - Coverage adecuado?

5. DOCUMENTACIÓN:
   - Comentarios necesarios
   - README actualizado?

**DECISIÓN FINAL:** APPROVE | REQUEST_CHANGES | COMMENT`,
          prompt: `Revisa este PR:\n\nTítulo: {{ validate-github-event.data.pull_request.title }}\n\nDiff:\n{{ fetch-pr-diff.response }}`,
          temperature: 0.3,
          maxTokens: 8000
        }
      },

      // 5. Publicar review en GitHub
      {
        id: 'post-review',
        capsuleId: 'http',
        position: { x: 1100, y: 100 },
        config: {
          method: 'POST',
          url: '${GITHUB_API_URL}/repos/${REPO}/pulls/{{ validate-github-event.data.pull_request.number }}/reviews',
          headers: '{ "Authorization": "Bearer ${GITHUB_TOKEN}" }',
          body: `{
  "body": "{{ claude-review.response }}",
  "event": "COMMENT"
}`
        }
      },

      // 6. Ejecutar tests
      {
        id: 'run-ci-tests',
        capsuleId: 'http',
        position: { x: 1350, y: 100 },
        config: {
          method: 'POST',
          url: '${CI_CD_URL}/run-tests',
          body: '{ "prNumber": {{ validate-github-event.data.pull_request.number }} }'
        }
      },

      // 7. Conditional: ¿Tests pasaron?
      {
        id: 'check-tests-result',
        capsuleId: 'router',
        position: { x: 1600, y: 100 },
        config: {
          condition: '{{ run-ci-tests.response.success }} === true',
          truePath: 'merge-pr',
          falsePath: 'notify-failure'
        }
      },

      // 8a. Merge PR (si todo OK)
      {
        id: 'merge-pr',
        capsuleId: 'http',
        position: { x: 1850, y: 50 },
        config: {
          method: 'PUT',
          url: '${GITHUB_API_URL}/repos/${REPO}/pulls/{{ validate-github-event.data.pull_request.number }}/merge',
          headers: '{ "Authorization": "Bearer ${GITHUB_TOKEN}" }',
          body: '{ "merge_method": "squash" }'
        }
      },

      // 9. Deploy a producción
      {
        id: 'deploy-production',
        capsuleId: 'http',
        position: { x: 2100, y: 50 },
        config: {
          method: 'POST',
          url: '${VERCEL_API_URL}/deployments',
          headers: '{ "Authorization": "Bearer ${VERCEL_TOKEN}" }',
          body: '{ "target": "production" }'
        }
      },

      // 10. Notificar éxito
      {
        id: 'notify-success',
        capsuleId: 'slack-message',
        position: { x: 2350, y: 50 },
        config: {
          webhookUrl: '${SLACK_WEBHOOK_URL}',
          channel: '#deployments',
          message: `✅ *Deployment Successful*

PR #{{ validate-github-event.data.pull_request.number }} merged and deployed!

🔗 {{ validate-github-event.data.pull_request.html_url }}

Reviewed by: 🤖 Claude`
        }
      },

      // 8b. Notificar fallo (si tests fallan)
      {
        id: 'notify-failure',
        capsuleId: 'slack-message',
        position: { x: 1850, y: 200 },
        config: {
          webhookUrl: '${SLACK_WEBHOOK_URL}',
          channel: '#deployments',
          message: `❌ *Tests Failed*

PR #{{ validate-github-event.data.pull_request.number }}

Errors:
{{ run-ci-tests.response.errors }}

🔗 {{ validate-github-event.data.pull_request.html_url }}`
        }
      }
    ],
    edges: [
      { source: 'github-webhook', target: 'validate-github-event' },
      { source: 'validate-github-event', target: 'fetch-pr-diff' },
      { source: 'fetch-pr-diff', target: 'claude-review' },
      { source: 'claude-review', target: 'post-review' },
      { source: 'post-review', target: 'run-ci-tests' },
      { source: 'run-ci-tests', target: 'check-tests-result' },
      { source: 'check-tests-result', target: 'merge-pr' },
      { source: 'merge-pr', target: 'deploy-production' },
      { source: 'deploy-production', target: 'notify-success' },
      { source: 'check-tests-result', target: 'notify-failure' }
    ],
    envVars: [
      'ANTHROPIC_API_KEY',
      'GITHUB_TOKEN',
      'GITHUB_API_URL',
      'CI_CD_URL',
      'VERCEL_TOKEN',
      'VERCEL_API_URL',
      'SLACK_WEBHOOK_URL',
      'REPO'
    ]
  }
]
