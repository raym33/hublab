# HubLab Rust Engine - GitHub Issues

Estos issues están listos para copiar y pegar en GitHub. Cada uno incluye título, descripción, criterios de aceptación y labels sugeridas.

---

## 🧩 SPRINT 1 – Datos reales + Motor de búsqueda sólido

### Issue #1 - Importar dataset real de cápsulas

**Labels:** `feat`, `rust`, `sprint-1`, `priority-high`

**Title:** `feat(rust): import real HubLab capsules dataset into Rust engine`

**Description:**

Implementar un módulo de carga de datos que importe las 8,150+ cápsulas reales de HubLab al motor Rust.

#### Objetivo

Crear la base del motor de búsqueda cargando todas las cápsulas desde un JSON exportado del repo principal.

#### Tareas

1. **Definir el struct `Capsule`** en Rust alineado con la interfaz TypeScript:
   ```rust
   pub struct Capsule {
       pub id: String,
       pub name: String,
       pub category: String,
       pub platform: String,
       pub tags: Vec<String>,
       pub description: String,
       pub code_snippet: Option<String>,
       pub metadata: Option<serde_json::Value>,
   }
   ```

2. **Crear módulo de carga** que lea desde:
   - `data/all-capsules.json` (exportado desde TypeScript)
   - Validar estructura con serde_json

3. **Implementar `CapsuleIndex`** en memoria:
   ```rust
   pub struct CapsuleIndex {
       pub all: Vec<Capsule>,
       pub by_id: HashMap<String, usize>,
       pub by_category: HashMap<String, Vec<usize>>,
       pub by_tag: HashMap<String, Vec<usize>>,
   }
   ```

4. **Logging inicial** que muestre:
   - Número total de cápsulas cargadas
   - Número de categorías únicas
   - Top 10 categorías por volumen

#### Criterios de Aceptación

- [ ] `cargo run` carga todas las cápsulas reales (8,150+)
- [ ] Log inicial muestra: `"Loaded 8150 capsules across 65 categories"`
- [ ] Tests unitarios verifican:
  - Al menos 1 cápsula por cada categoría principal
  - `by_id` encuentra una cápsula específica por ID
  - `by_category` devuelve correctamente cápsulas filtradas
  - `by_tag` indexa correctamente por tags
- [ ] Tiempo de carga < 500ms
- [ ] Uso de memoria razonable (< 200MB para todo el dataset)

#### Archivos Esperados

```
src/
├── models/
│   └── capsule.rs       # Struct Capsule + Deserializer
├── index/
│   └── capsule_index.rs # CapsuleIndex + métodos de búsqueda
└── loader/
    └── json_loader.rs   # Carga desde JSON
```

#### Referencias

- Fuente de datos: `/lib/all-capsules.ts`
- Interface TypeScript: `/types/capsule.ts`

---

### Issue #2 - Motor de búsqueda con ranking y filtros

**Labels:** `feat`, `rust`, `sprint-1`, `priority-high`

**Title:** `feat(rust): implement ranked search with category/tag/platform filters`

**Description:**

Implementar el motor de búsqueda principal con scoring, ranking y múltiples filtros.

#### Objetivo

Crear un sistema de búsqueda que:
- Asigne puntuaciones basadas en relevancia
- Soporte filtros por categoría, plataforma y tags
- Implemente paginación eficiente

#### Tareas

1. **Definir la API de búsqueda**:
   ```rust
   pub struct SearchQuery {
       pub query: String,
       pub category: Option<String>,
       pub platform: Option<String>,
       pub tags: Vec<String>,
       pub limit: usize,
       pub offset: usize,
   }

   pub struct SearchResult {
       pub capsules: Vec<ScoredCapsule>,
       pub total_count: usize,
       pub took_ms: u64,
   }

   pub struct ScoredCapsule {
       pub capsule: Capsule,
       pub score: f64,
       pub match_type: MatchType, // Exact, Partial, Tag
   }
   ```

2. **Implementar función principal**:
   ```rust
   pub fn search_capsules(
       index: &CapsuleIndex,
       query: &SearchQuery,
   ) -> SearchResult
   ```

3. **Sistema de scoring**:
   - **+100 puntos**: Match exacto en `name`
   - **+50 puntos**: Match parcial en `name` (contiene query)
   - **+30 puntos**: Match en `description`
   - **+20 puntos**: Match en cualquier `tag`
   - **+10 puntos**: Match en `category`
   - **Multiplicador x1.5**: Si `platform` coincide

4. **Filtros**:
   - Pre-filtrar por `category` si se proporciona
   - Pre-filtrar por `platform` si se proporciona
   - Post-filtrar por `tags` (debe tener TODOS los tags especificados)

5. **Paginación**:
   - Ordenar por score descendente
   - Aplicar `offset` y `limit`
   - Devolver `total_count` (antes de paginación)

#### Criterios de Aceptación

- [ ] Tests unitarios con dataset de prueba (50 cápsulas):
  - **Caso 1**: Query simple "dashboard" devuelve resultados ordenados por score
  - **Caso 2**: Filtro por categoría "UI Components" reduce conjunto correctamente
  - **Caso 3**: Filtro por platform "react" solo devuelve cápsulas React
  - **Caso 4**: Filtro por tags ["authentication", "oauth"] devuelve intersección
  - **Caso 5**: Paginación con `limit=10, offset=20` funciona correctamente
  - **Caso 6**: Query vacía devuelve todas las cápsulas ordenadas alfabéticamente
- [ ] Benchmark: búsqueda sobre 8,150 cápsulas en < 10ms (avg)
- [ ] No hay panics en búsquedas edge case (query vacía, sin resultados, etc.)

#### Archivos Esperados

```
src/
├── search/
│   ├── engine.rs        # search_capsules() principal
│   ├── scorer.rs        # Sistema de puntuación
│   └── filters.rs       # Lógica de filtrado
└── __tests__/
    └── search_engine_test.rs
```

---

### Issue #3 - Fuzzy search con Jaro-Winkler

**Labels:** `feat`, `rust`, `sprint-1`, `priority-medium`

**Title:** `feat(rust): add configurable fuzzy search with strsim (Jaro-Winkler)`

**Description:**

Implementar búsqueda fuzzy para tolerar typos y errores de escritura usando Jaro-Winkler.

#### Objetivo

Permitir que búsquedas con typos como "dashbord" encuentren "dashboard".

#### Tareas

1. **Añadir dependencia**:
   ```toml
   [dependencies]
   strsim = "0.10"
   ```

2. **Definir configuración**:
   ```rust
   pub struct SearchConfig {
       pub fuzzy_enabled: bool,
       pub fuzzy_threshold: f64,  // 0.0 - 1.0 (default: 0.85)
       pub fuzzy_max_distance: usize, // max Levenshtein distance
       pub max_results: usize,
   }
   ```

3. **Implementar `fuzzy_search_capsules`**:
   - Usar `strsim::jaro_winkler()` para calcular similitud
   - Comparar query con `capsule.name` y `capsule.tags`
   - Filtrar resultados con similitud < `fuzzy_threshold`
   - Ajustar score: `base_score * similarity`

4. **Integración con búsqueda principal**:
   - Si búsqueda exacta devuelve < 5 resultados, activar fuzzy automáticamente
   - Combinar resultados exactos + fuzzy (sin duplicados)
   - Ordenar por score final

#### Criterios de Aceptación

- [ ] Test donde buscar `"dashbord"` devuelve `"Dashboard Analytics"`
- [ ] Test donde buscar `"autentication"` devuelve `"Authentication Flow"`
- [ ] Test donde buscar `"buttom"` devuelve `"Button Component"`
- [ ] Configuración `fuzzy_threshold = 0.9` filtra más resultados que `0.7`
- [ ] Benchmark: fuzzy search sobre 8,150 cápsulas en < 50ms (avg)
- [ ] Tests verifican que no hay duplicados entre exact + fuzzy results

#### Archivos Esperados

```
src/
├── search/
│   ├── fuzzy.rs         # Fuzzy search implementation
│   └── config.rs        # SearchConfig
└── __tests__/
    └── fuzzy_search_test.rs
```

---

### Issue #4 - Tests unitarios y de integración completos

**Labels:** `test`, `rust`, `sprint-1`, `priority-high`

**Title:** `test(rust): add comprehensive unit and integration tests for search engine`

**Description:**

Asegurar la calidad del motor de búsqueda con tests exhaustivos.

#### Objetivo

Alcanzar > 80% de cobertura de código en los módulos core.

#### Tareas

1. **Tests unitarios** para:
   - `models::capsule` - Serialización/deserialización
   - `index::capsule_index` - Indexación y lookups
   - `search::engine` - Búsqueda exacta
   - `search::fuzzy` - Búsqueda fuzzy
   - `search::scorer` - Sistema de puntuación
   - `search::filters` - Filtros individuales

2. **Tests de integración** para:
   - Carga completa de dataset + búsqueda end-to-end
   - Múltiples filtros combinados
   - Paginación con datasets grandes
   - Performance con 10,000+ cápsulas simuladas

3. **Property-based tests** (con `proptest`):
   - Búsquedas nunca devuelven más de `limit` resultados
   - Score siempre es >= 0.0
   - Total count nunca es negativo

4. **Configurar CI**:
   ```yaml
   # .github/workflows/rust-tests.yml
   - run: cargo test --all-features
   - run: cargo test --release
   ```

#### Criterios de Aceptación

- [ ] `cargo test` ejecuta sin fallos (> 30 tests)
- [ ] Cobertura de código:
  - `models/`: > 90%
  - `search/`: > 80%
  - `index/`: > 85%
- [ ] Tests de integración cubren:
  - Happy path (búsqueda exitosa)
  - Edge cases (query vacía, sin resultados, caracteres especiales)
  - Performance (búsqueda en < 10ms)
- [ ] CI configurado y passing
- [ ] Documentación de tests en README

#### Archivos Esperados

```
tests/
├── integration_search_test.rs
├── integration_load_test.rs
└── property_tests.rs

src/
└── __tests__/
    ├── capsule_test.rs
    ├── index_test.rs
    ├── search_engine_test.rs
    ├── fuzzy_test.rs
    └── filters_test.rs
```

---

## 🌐 SPRINT 2 – REST API, CLI y Docker

### Issue #5 - Implementar API REST con Axum

**Labels:** `feat`, `rust`, `api`, `sprint-2`, `priority-high`

**Title:** `feat(rust): expose search engine via REST API using Axum`

**Description:**

Crear una API REST rápida y eficiente usando Axum para exponer el motor de búsqueda.

#### Objetivo

Permitir que el frontend Next.js consuma el motor Rust via HTTP.

#### Tareas

1. **Añadir dependencias**:
   ```toml
   [dependencies]
   axum = "0.7"
   tokio = { version = "1", features = ["full"] }
   tower = "0.4"
   tower-http = { version = "0.5", features = ["cors", "trace"] }
   serde = { version = "1.0", features = ["derive"] }
   serde_json = "1.0"
   tracing = "0.1"
   tracing-subscriber = "0.3"
   ```

2. **Implementar endpoints**:

   **GET `/healthz`**
   ```json
   {
     "status": "ok",
     "version": "0.1.0",
     "capsules_loaded": 8150,
     "categories": 65,
     "uptime_seconds": 3600
   }
   ```

   **GET `/api/search`**
   - Query params: `q`, `category`, `platform`, `tags`, `limit`, `offset`
   - Response:
   ```json
   {
     "results": [...],
     "total": 123,
     "took_ms": 8,
     "page": 1,
     "per_page": 20
   }
   ```

   **GET `/api/search/fuzzy`**
   - Igual que `/search` pero con fuzzy habilitado

   **GET `/api/capsules/:id`**
   - Devuelve una cápsula específica por ID
   - 404 si no existe

   **GET `/api/categories`**
   - Lista de categorías con counts:
   ```json
   {
     "categories": [
       { "name": "UI Components", "count": 450 },
       { "name": "Forms", "count": 320 }
     ]
   }
   ```

   **GET `/api/tags`**
   - Top 100 tags más usados

3. **Configurar CORS**:
   - Permitir origins configurables via env var
   - Default: `["http://localhost:3000"]`

4. **Error handling**:
   - 400 para parámetros inválidos
   - 404 para recursos no encontrados
   - 500 para errores internos
   - Respuestas JSON consistentes:
   ```json
   {
     "error": "Invalid category",
     "message": "Category 'xyz' does not exist",
     "code": 400
   }
   ```

5. **Logging estructurado**:
   - Request ID
   - Latencia
   - Parámetros de búsqueda (sanitizados)

#### Criterios de Aceptación

- [ ] `cargo run --bin server --port 8080` levanta el servidor
- [ ] `curl http://localhost:8080/healthz` responde 200 OK
- [ ] `curl "http://localhost:8080/api/search?q=dashboard&limit=10"` devuelve JSON válido
- [ ] CORS headers correctos para localhost:3000
- [ ] Logs estructurados en stdout (JSON)
- [ ] Tests de integración para cada endpoint
- [ ] Documentación OpenAPI/Swagger generada

#### Archivos Esperados

```
src/
├── api/
│   ├── server.rs        # Axum server setup
│   ├── routes/
│   │   ├── health.rs
│   │   ├── search.rs
│   │   ├── capsules.rs
│   │   └── metadata.rs
│   ├── middleware/
│   │   ├── cors.rs
│   │   └── logging.rs
│   └── error.rs         # Error types
└── bin/
    └── server.rs        # Binary entrypoint
```

---

### Issue #6 - CLI `hublab` funcional

**Labels:** `feat`, `rust`, `cli`, `sprint-2`, `priority-medium`

**Title:** `feat(rust): add CLI binary for search and inspection`

**Description:**

Crear una CLI intuitiva para buscar cápsulas desde la terminal.

#### Objetivo

Permitir a developers buscar y explorar cápsulas sin levantar el servidor.

#### Tareas

1. **Añadir dependencias**:
   ```toml
   [dependencies]
   clap = { version = "4.5", features = ["derive"] }
   colored = "2.1"
   tabled = "0.15"
   ```

2. **Definir comandos**:

   **`hublab search <query>`**
   ```bash
   $ hublab search "authentication" --category "Security" --limit 5

   🔍 Found 23 results in 8ms

   ┌──────────────────────────┬─────────────┬───────┬──────────────────────┐
   │ Name                     │ Category    │ Score │ Tags                 │
   ├──────────────────────────┼─────────────┼───────┼──────────────────────┤
   │ OAuth2 Login Flow        │ Security    │ 95.0  │ auth, oauth, login   │
   │ JWT Token Manager        │ Security    │ 87.5  │ auth, jwt, tokens    │
   │ Password Reset Flow      │ Security    │ 82.0  │ auth, password       │
   └──────────────────────────┴─────────────┴───────┴──────────────────────┘
   ```

   **Flags**:
   - `--category`, `-c`: Filtrar por categoría
   - `--platform`, `-p`: Filtrar por plataforma
   - `--tags`, `-t`: Filtrar por tags (múltiples)
   - `--fuzzy`, `-f`: Habilitar fuzzy search
   - `--json`: Output en JSON
   - `--limit`, `-l`: Límite de resultados (default: 20)

   **`hublab get <id>`**
   ```bash
   $ hublab get "oauth2-login-flow"

   📦 OAuth2 Login Flow
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Category: Security
   Platform: react
   Tags: auth, oauth, login, security

   Description:
   Complete OAuth2 authentication flow with provider
   selection, consent screen, and token management.

   Code snippet: 245 lines
   ```

   **`hublab categories`**
   - Lista todas las categorías con counts

   **`hublab serve`**
   ```bash
   $ hublab serve --port 8080 --host 0.0.0.0

   🚀 HubLab Rust Engine v0.1.0
   📦 Loaded 8,150 capsules across 65 categories
   🌐 Listening on http://0.0.0.0:8080

   Endpoints:
     GET /healthz
     GET /api/search
     GET /api/capsules/:id
   ```

3. **Configuración**:
   - Leer desde `~/.config/hublab/config.toml` (opcional)
   - Override con flags CLI
   - Env vars: `HUBLAB_DATA_PATH`, `HUBLAB_PORT`

#### Criterios de Aceptación

- [ ] `cargo build --bin hublab` compila sin warnings
- [ ] `hublab search "dashboard"` imprime resultados formateados
- [ ] `hublab search "xyz" --json` devuelve JSON válido
- [ ] `hublab get <id>` muestra detalles de la cápsula
- [ ] `hublab get invalid-id` devuelve error claro
- [ ] `hublab categories` lista todas las categorías
- [ ] `hublab serve` levanta el servidor correctamente
- [ ] `hublab --help` muestra ayuda completa
- [ ] Tests de integración para CLI
- [ ] Documentación en README con ejemplos

#### Archivos Esperados

```
src/
├── cli/
│   ├── commands/
│   │   ├── search.rs
│   │   ├── get.rs
│   │   ├── categories.rs
│   │   └── serve.rs
│   ├── output.rs        # Formatters (table, JSON)
│   └── config.rs        # CLI config
└── bin/
    └── hublab.rs        # CLI entrypoint
```

---

### Issue #7 - Dockerfile de producción

**Labels:** `chore`, `docker`, `sprint-2`, `priority-high`

**Title:** `chore(docker): add production-ready multi-stage Dockerfile`

**Description:**

Crear un Dockerfile optimizado para deployments en producción.

#### Objetivo

Imagen Docker < 50MB, segura y rápida de arrancar.

#### Tareas

1. **Crear Dockerfile multi-stage**:
   ```dockerfile
   # Stage 1: Build
   FROM rust:1.75-alpine AS builder
   WORKDIR /app

   # Cache dependencies
   COPY Cargo.toml Cargo.lock ./
   RUN mkdir src && echo "fn main() {}" > src/main.rs
   RUN cargo build --release
   RUN rm -rf src

   # Build real app
   COPY . .
   RUN cargo build --release --bin server

   # Stage 2: Runtime
   FROM alpine:3.19
   RUN apk add --no-cache ca-certificates

   WORKDIR /app
   COPY --from=builder /app/target/release/server /app/hublab-server
   COPY data/ /app/data/

   ENV PORT=8080
   ENV DATA_PATH=/app/data/all-capsules.json
   EXPOSE 8080

   ENTRYPOINT ["/app/hublab-server"]
   CMD ["serve", "--port", "8080", "--host", "0.0.0.0"]
   ```

2. **Crear `.dockerignore`**:
   ```
   target/
   .git/
   .github/
   node_modules/
   *.md
   Dockerfile
   .dockerignore
   ```

3. **Configuración via env vars**:
   - `PORT` (default: 8080)
   - `DATA_PATH` (default: /app/data/all-capsules.json)
   - `RUST_LOG` (default: info)
   - `CORS_ORIGINS` (default: *)

4. **Health checks**:
   ```dockerfile
   HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
     CMD wget --no-verbose --tries=1 --spider http://localhost:8080/healthz || exit 1
   ```

5. **Documentación**:
   - Crear `docker/README.md` con ejemplos de uso
   - docker-compose.yml de ejemplo

#### Criterios de Aceptación

- [ ] `docker build -t hublab-rust .` completa en < 5min (con cache)
- [ ] Imagen final < 50MB
- [ ] `docker run -p 8080:8080 hublab-rust` arranca y responde a /healthz
- [ ] Variables de entorno configurables
- [ ] Health check funciona correctamente
- [ ] Tests de integración Docker:
  - Build exitoso
  - Container arranca
  - API responde
  - Logs estructurados visibles
- [ ] docker-compose.yml incluido con ejemplo completo
- [ ] Documentación en `docker/README.md`

#### Archivos Esperados

```
/
├── Dockerfile
├── .dockerignore
└── docker/
    ├── README.md
    └── docker-compose.yml
```

**docker-compose.yml ejemplo**:
```yaml
version: '3.8'

services:
  hublab-rust:
    build: .
    ports:
      - "8080:8080"
    environment:
      - RUST_LOG=info
      - CORS_ORIGINS=http://localhost:3000
    volumes:
      - ./data:/app/data:ro
    healthcheck:
      test: ["CMD", "wget", "--spider", "http://localhost:8080/healthz"]
      interval: 30s
      timeout: 3s
      retries: 3
```

---

## 🧠 SPRINT 3 – Compiler + Integración

### Issue #8 - Implementar módulo `compiler` con templates

**Labels:** `feat`, `rust`, `compiler`, `sprint-3`, `priority-medium`

**Title:** `feat(rust): implement capsule compiler with Tera templates for React/HTML`

**Description:**

Crear un compilador que genere código React y HTML a partir de cápsulas.

#### Objetivo

Convertir selecciones de cápsulas en archivos de código listos para usar.

#### Tareas

1. **Añadir dependencias**:
   ```toml
   [dependencies]
   tera = "1.19"
   serde = { version = "1.0", features = ["derive"] }
   serde_json = "1.0"
   ```

2. **Definir API del compilador**:
   ```rust
   pub enum TargetPlatform {
       React,
       ReactNative,
       Html,
       Vue,
   }

   pub struct CompileRequest {
       pub capsule_ids: Vec<String>,
       pub target: TargetPlatform,
       pub theme: Option<ThemeConfig>,
       pub options: CompileOptions,
   }

   pub struct ThemeConfig {
       pub primary_color: String,
       pub secondary_color: String,
       pub font_family: String,
   }

   pub struct CompileOptions {
       pub typescript: bool,
       pub tailwind: bool,
       pub next_app_router: bool,
   }

   pub struct CompileResult {
       pub files: HashMap<String, String>, // filename -> content
       pub dependencies: Vec<String>,      // npm packages needed
       pub warnings: Vec<String>,
   }
   ```

3. **Crear templates Tera**:

   **`templates/react/page.tsx.tera`**:
   ```tsx
   'use client'

   import React from 'react'
   {% for import in imports %}
   {{ import }}
   {% endfor %}

   export default function GeneratedPage() {
     return (
       <div className="min-h-screen">
         {% for capsule in capsules %}
         {/* {{ capsule.name }} */}
         {{ capsule.code_snippet }}
         {% endfor %}
       </div>
     )
   }
   ```

   **`templates/html/index.html.tera`**:
   ```html
   <!DOCTYPE html>
   <html lang="en">
   <head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title>{{ title }}</title>
     <script src="https://cdn.tailwindcss.com"></script>
   </head>
   <body>
     {% for capsule in capsules %}
     <!-- {{ capsule.name }} -->
     {{ capsule.code_snippet }}
     {% endfor %}
   </body>
   </html>
   ```

4. **Lógica del compilador**:
   - Resolver cápsulas por ID
   - Extraer imports necesarios del código
   - Deduplicar imports
   - Inyectar en template
   - Validar sintaxis básica (opcional: usar swc)

5. **Endpoint API**:
   **POST `/api/compile`**
   ```json
   {
     "capsule_ids": ["hero-section", "pricing-table", "footer"],
     "target": "React",
     "options": {
       "typescript": true,
       "tailwind": true
     }
   }
   ```

   Response:
   ```json
   {
     "files": {
       "page.tsx": "...",
       "components/Hero.tsx": "..."
     },
     "dependencies": [
       "react@18.2.0",
       "tailwindcss@3.3.0"
     ],
     "warnings": []
   }
   ```

#### Criterios de Aceptación

- [ ] Tests que compilan cápsulas simples a React:
  - Input: `["button-primary", "hero-section"]`
  - Output: Archivo TSX válido sintácticamente
- [ ] Tests que compilan a HTML estático
- [ ] Extracción de imports funciona correctamente
- [ ] Deduplicación de imports (no duplicados)
- [ ] Endpoint `/api/compile` implementado
- [ ] Validación de IDs de cápsulas (error si no existen)
- [ ] Templates documentados con ejemplos
- [ ] Benchmarks: compilación de 10 cápsulas en < 50ms

#### Archivos Esperados

```
src/
├── compiler/
│   ├── engine.rs        # compile() principal
│   ├── templates.rs     # Tera template management
│   ├── imports.rs       # Import extraction
│   └── platforms/
│       ├── react.rs
│       ├── html.rs
│       └── vue.rs
└── templates/
    ├── react/
    │   ├── page.tsx.tera
    │   └── component.tsx.tera
    └── html/
        └── index.html.tera
```

---

### Issue #9 - Benchmarks reproducibles con Criterion

**Labels:** `perf`, `rust`, `sprint-3`, `priority-medium`

**Title:** `perf(rust): add comprehensive benchmarks with Criterion`

**Description:**

Medir y documentar el rendimiento del motor Rust vs. implementación TypeScript.

#### Objetivo

Justificar el uso de Rust con datos concretos de performance.

#### Tareas

1. **Añadir dependencias**:
   ```toml
   [dev-dependencies]
   criterion = { version = "0.5", features = ["html_reports"] }
   ```

2. **Crear benchmarks**:

   **`benches/search.rs`**:
   ```rust
   use criterion::{black_box, criterion_group, criterion_main, Criterion};

   fn search_benchmark(c: &mut Criterion) {
       let index = load_test_dataset(8150); // Full dataset

       c.bench_function("search_8150_exact", |b| {
           b.iter(|| {
               search_capsules(
                   black_box(&index),
                   black_box("dashboard analytics")
               )
           })
       });

       c.bench_function("search_8150_fuzzy", |b| {
           b.iter(|| {
               fuzzy_search_capsules(
                   black_box(&index),
                   black_box("dashbord analytcs") // typos
               )
           })
       });

       c.bench_function("search_with_filters", |b| {
           b.iter(|| {
               search_capsules_filtered(
                   black_box(&index),
                   black_box("auth"),
                   black_box(Some("Security")),
                   black_box(vec!["oauth"])
               )
           })
       });
   }

   criterion_group!(benches, search_benchmark);
   criterion_main!(benches);
   ```

   **`benches/compile.rs`**:
   ```rust
   fn compile_benchmark(c: &mut Criterion) {
       c.bench_function("compile_10_capsules_react", |b| {
           b.iter(|| {
               compile(black_box(&capsule_ids), black_box(React))
           })
       });
   }
   ```

3. **Comparación con TypeScript**:
   - Implementar benchmarks equivalentes en TS (usando `console.time`)
   - Documentar resultados en tabla comparativa

4. **Configuración de Criterion**:
   ```toml
   [[bench]]
   name = "search"
   harness = false

   [[bench]]
   name = "compile"
   harness = false
   ```

#### Criterios de Aceptación

- [ ] `cargo bench` ejecuta todos los benchmarks
- [ ] Reports HTML generados en `target/criterion/`
- [ ] README incluye tabla de resultados:

   | Operación | Rust (avg) | TypeScript (avg) | Mejora |
   |-----------|------------|------------------|--------|
   | Búsqueda exacta (8K) | 8ms | 45ms | **5.6x** |
   | Búsqueda fuzzy (8K) | 35ms | 180ms | **5.1x** |
   | Compilación (10 cápsulas) | 42ms | 120ms | **2.9x** |
   | Carga inicial | 350ms | 1200ms | **3.4x** |

- [ ] Documentación incluye:
  - Hardware usado (CPU, RAM)
  - Versiones (Rust, Node.js)
  - Metodología de medición
- [ ] CI ejecuta benchmarks y reporta degradaciones (> 10%)

#### Archivos Esperados

```
benches/
├── search.rs
├── compile.rs
└── load.rs

docs/
└── BENCHMARKS.md
```

---

### Issue #10 - Integración con repo principal `hublab`

**Labels:** `feat`, `integration`, `sprint-3`, `priority-high`

**Title:** `feat(integration): integrate Rust engine with main Next.js repo`

**Description:**

Conectar el motor Rust con el frontend Next.js existente.

#### Objetivo

Permitir usar el motor Rust como backend de búsqueda desde la UI.

#### Tareas en el repo **principal** (`hublab`):

1. **Crear cliente TypeScript**:

   **`lib/rust-engine-client.ts`**:
   ```typescript
   export class RustEngineClient {
     constructor(private baseUrl: string) {}

     async search(params: SearchParams): Promise<SearchResult> {
       const url = new URL('/api/search', this.baseUrl)
       Object.entries(params).forEach(([key, value]) => {
         if (value) url.searchParams.set(key, String(value))
       })

       const res = await fetch(url.toString())
       if (!res.ok) throw new Error(`Search failed: ${res.statusText}`)
       return res.json()
     }

     async getCapsule(id: string): Promise<Capsule> {
       const res = await fetch(`${this.baseUrl}/api/capsules/${id}`)
       if (!res.ok) throw new Error(`Capsule not found: ${id}`)
       return res.json()
     }
   }
   ```

2. **Configuración en `.env.local`**:
   ```bash
   # Search Backend
   HUBLAB_SEARCH_BACKEND=rust  # or 'typescript'
   HUBLAB_RUST_URL=http://localhost:8080
   ```

3. **Actualizar `IntelligentCapsuleSearch.tsx`**:
   ```typescript
   const searchBackend = process.env.NEXT_PUBLIC_SEARCH_BACKEND || 'typescript'
   const rustClient = new RustEngineClient(process.env.NEXT_PUBLIC_RUST_URL!)

   async function performSearch(query: string) {
     if (searchBackend === 'rust') {
       return rustClient.search({ q: query, limit: 20 })
     } else {
       // Fallback to TypeScript implementation
       return searchCapsulesTS(query, allCapsules)
     }
   }
   ```

4. **Añadir toggle en UI**:
   - Settings panel con opción "Use Rust Engine (beta)"
   - Guardar preferencia en localStorage
   - Mostrar badge con backend actual

5. **Documentación**:

   **`RUST_ENGINE_INTEGRATION.md`**:
   ```markdown
   # HubLab Rust Engine Integration

   ## Quick Start

   ### 1. Start Rust Engine
   ```bash
   cd rust-engine
   docker-compose up -d
   # or
   cargo run --bin server -- serve --port 8080
   ```

   ### 2. Configure Next.js
   ```bash
   # .env.local
   NEXT_PUBLIC_SEARCH_BACKEND=rust
   NEXT_PUBLIC_RUST_URL=http://localhost:8080
   ```

   ### 3. Test Integration
   ```bash
   npm run dev
   # Open Studio V2 and search for "dashboard"
   # Check Network tab - requests should go to localhost:8080
   ```

   ## Fallback Mode
   If Rust engine is unavailable, the app falls back to TypeScript search automatically.

   ## Performance Comparison
   See `/rust-engine/docs/BENCHMARKS.md`
   ```

#### Criterios de Aceptación

- [ ] Cliente TypeScript implementado y testeado
- [ ] `.env.local.example` incluye variables necesarias
- [ ] Toggle en UI funciona correctamente
- [ ] Fallback a TS si Rust no disponible
- [ ] Tests de integración end-to-end:
  - Rust engine running + Next.js → búsqueda funciona
  - Rust engine down → fallback a TS
- [ ] Documentación completa en `RUST_ENGINE_INTEGRATION.md`
- [ ] Video demo (opcional): búsqueda con Rust vs TS side-by-side

#### Archivos Esperados (en repo principal)

```
hublab/
├── lib/
│   └── rust-engine-client.ts
├── components/
│   └── settings/
│       └── SearchBackendToggle.tsx
├── .env.local.example  (actualizado)
└── RUST_ENGINE_INTEGRATION.md
```

---

## 📋 Resumen de Labels

Usa estos labels para organizar los issues en GitHub:

- `feat` - Nueva funcionalidad
- `test` - Tests y QA
- `chore` - Mantenimiento y configuración
- `perf` - Performance y optimización
- `api` - API REST
- `cli` - Command Line Interface
- `docker` - Containerización
- `compiler` - Motor de compilación
- `integration` - Integración con otros sistemas
- `rust` - Código Rust
- `sprint-1`, `sprint-2`, `sprint-3` - Organización por sprints
- `priority-high`, `priority-medium` - Priorización

---

## 🎯 Orden de Implementación Recomendado

### Sprint 1 (Base sólida)
1. Issue #1 - Importar dataset
2. Issue #2 - Motor de búsqueda
3. Issue #3 - Fuzzy search
4. Issue #4 - Tests

**Milestone**: Motor de búsqueda funcional y testeado

### Sprint 2 (Exposición)
5. Issue #5 - API REST
6. Issue #6 - CLI
7. Issue #7 - Docker

**Milestone**: API desplegable y CLI usable

### Sprint 3 (Avanzado)
8. Issue #9 - Benchmarks (hacer ANTES del compilador para justificar)
9. Issue #8 - Compiler
10. Issue #10 - Integración

**Milestone**: Sistema completo integrado

---

## 📞 Soporte

Para cada issue, el dev puede:
- Comentar dudas técnicas
- Proponer cambios a los criterios de aceptación
- Solicitar más contexto sobre el dominio

---

**Generado**: 2025-11-16
**Versión**: 1.0
**Proyecto**: HubLab Rust Engine
