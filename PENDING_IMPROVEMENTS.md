# 🔍 Revisión Final - Problemas Pendientes por Mejorar

**Fecha:** 2025-11-18
**Estado Actual:** 🟢 Bueno (11/23 problemas críticos/altos corregidos)

---

## 📊 Estado General

| Categoría | Completado | Pendiente | Progreso |
|-----------|------------|-----------|----------|
| **Críticos** | 5/5 | 0 | ✅ 100% |
| **Altos** | 6/6 | 0 | ✅ 100% |
| **Medios** | 6/6 | 0 | ✅ 100% |
| **Bajos** | 0/4 | 4 | ⚠️ 0% |
| **Calidad** | 3/22 | 19 | 🟡 14% |

---

## 🔴 PROBLEMAS PENDIENTES CRÍTICOS

### 1. XSS via dangerouslySetInnerHTML - PARCIAL ⚠️
**Severidad:** ALTA
**Estado:** Utilidades creadas, implementación pendiente
**Archivos afectados:** 8 ocurrencias en 6 archivos

**Archivos que requieren corrección:**
```
✅ lib/security-utils.ts - Utilidades creadas
❌ app/page.tsx (2 ocurrencias)
❌ app/layout.tsx (2 ocurrencias)
❌ lib/capsule-compiler/example-capsules.ts (1)
❌ lib/extended-capsules-batch24.ts (1)
❌ lib/capsules-v2/definitions-forms.ts (1)
❌ lib/capsules-v2/definitions-enhanced.ts (1)
```

**Solución requerida:**
```typescript
// Antes
<div dangerouslySetInnerHTML={{ __html: content }} />

// Después
import { sanitizeHTML } from '@/lib/security-utils'
<div dangerouslySetInnerHTML={{ __html: sanitizeHTML(content) }} />
```

**Prioridad:** 🔴 ALTA - Hacer esta semana
**Impacto:** XSS attacks, robo de sesiones, phishing
**Esfuerzo:** 1-2 horas (buscar y reemplazar con validación)

---

### 2. Code Injection via new Function() - NO CORREGIDO ⚠️
**Severidad:** CRÍTICA
**Estado:** Sin implementar
**Archivos afectados:** 2 archivos

**Archivos:**
```
❌ lib/extended-capsules-batch26.ts:280-281
❌ components/LivePreview.tsx:236
```

**Problema:**
```typescript
// LivePreview.tsx - Ejecuta código sin validación
const componentFunc = new Function('React', 'useState', ..., code)
```

**Solución recomendada:**
1. **Opción A:** Sandbox con iframe
   ```typescript
   // Usar iframe con sandbox attribute
   <iframe sandbox="allow-scripts" srcDoc={generatedHTML} />
   ```

2. **Opción B:** Web Workers
   ```typescript
   // Ejecutar en worker aislado
   const worker = new Worker('/preview-worker.js')
   worker.postMessage({ code })
   ```

3. **Opción C:** QuickJS (más seguro)
   ```bash
   npm install quickjs-emscripten
   ```

**Prioridad:** 🔴 CRÍTICA - Requiere cambio arquitectónico
**Impacto:** Ejecución arbitraria de código, compromiso total
**Esfuerzo:** 4-8 horas (requiere rediseño de LivePreview)

---

## 🟠 VULNERABILIDADES EN DEPENDENCIAS

### 3. Dependencias con Vulnerabilidades - PENDIENTE ⚠️
**Severidad:** ALTA
**Estado:** Detectadas, sin corregir

**Vulnerabilidades encontradas:**
```
🟠 dompurify <3.2.4 (MODERATE)
   - XSS vulnerability
   - Usado en: monaco-editor

🔴 glob 10.3.7 - 11.0.3 (HIGH)
   - Command injection via CLI
   - Usado en: sucrase → tailwindcss

Total: 5 vulnerabilidades (2 moderate, 3 high)
```

**Solución:**
```bash
# Actualizar dependencias vulnerables
npm audit fix

# Revisar cambios
npm audit fix --dry-run

# Si hay breaking changes, actualizar manualmente
npm install dompurify@latest
```

**Prioridad:** 🟠 ALTA - Hacer esta semana
**Impacto:** XSS, command injection
**Esfuerzo:** 30 minutos + testing

---

## 🟡 PROBLEMAS MEDIOS DE CALIDAD

### 4. Console Statements en Producción - PENDIENTE ⚠️
**Severidad:** BAJA
**Estado:** 599 ocurrencias en 127 archivos

**Problema:**
- console.log/warn/error expuestos en producción
- Puede exponer información sensible
- Impacto en performance (leve)

**Solución:**
```typescript
// Crear logger centralizado
// lib/logger.ts
export const logger = {
  debug: process.env.NODE_ENV === 'development' ? console.log : () => {},
  info: console.info,
  warn: console.warn,
  error: (msg: string, error?: any) => {
    console.error(msg, error)
    // Enviar a Sentry en producción
    if (process.env.NODE_ENV === 'production') {
      Sentry.captureException(error)
    }
  }
}

// Usar en lugar de console.log
import { logger } from '@/lib/logger'
logger.debug('Development info')
```

**Prioridad:** 🟡 MEDIA - Próximo mes
**Esfuerzo:** 2-3 horas (crear logger + buscar/reemplazar)

---

### 5. Archivos Muy Grandes - PENDIENTE ⚠️
**Severidad:** BAJA
**Estado:** Identificados, no refactorizados

**Archivos problemáticos:**
```
❌ components/LiveCapsulePreviews.tsx - 4,276 líneas
❌ lib/extended-capsules-batch26.ts - 2,084 líneas
❌ lib/capsule-compiler/example-capsules.ts - ~8,000 líneas
```

**Problema:**
- Difícil mantenimiento
- Navegación compleja
- Code review lento

**Solución:**
- Dividir en múltiples archivos por responsabilidad
- Extraer componentes reutilizables
- Modularizar cápsulas por categorías

**Prioridad:** 🟢 BAJA - Refactoring futuro
**Esfuerzo:** 4-6 horas por archivo

---

### 6. TODOs Sin Implementar - PENDIENTE ⚠️
**Severidad:** BAJA
**Estado:** ~30 TODOs en código

**Ejemplos:**
```typescript
// lib/capsule-compiler/ai-generator.ts:158
// TODO: Call Claude API

// lib/capsule-compiler/compiler.ts:459
// TODO: Implement optimizations
```

**Solución:**
- Crear GitHub issues para TODOs importantes
- Eliminar TODOs obsoletos
- Implementar o documentar plan

**Prioridad:** 🟢 BAJA
**Esfuerzo:** 1-2 horas (revisión + issues)

---

### 7. Magic Numbers Sin Constantes - PENDIENTE ⚠️
**Severidad:** BAJA

**Ejemplos:**
```typescript
setTimeout(() => { ... }, 600)  // ¿Por qué 600ms?
if (history.length > 50) { ... }  // ¿Por qué 50?
```

**Solución:**
```typescript
const ANIMATION_DELAY_MS = 600
const MAX_HISTORY_STATES = 50
```

**Prioridad:** 🟢 BAJA
**Esfuerzo:** 1 hora

---

## 🔐 MEJORAS DE SEGURIDAD RECOMENDADAS

### 8. Aplicar CSRF a Endpoints - PENDIENTE ⚠️
**Severidad:** ALTA
**Estado:** Librería implementada, no aplicada

**Endpoints que necesitan CSRF:**
```
❌ /api/checkout
❌ /api/compiler/async
❌ /api/compiler/v2
❌ /api/marketplace/capsules
❌ /api/crm/approvals
❌ /api/compositions
❌ /api/canvas/export
... (todos los POST/PUT/DELETE)
```

**Implementación:**
```typescript
// En cada endpoint
import { withCsrfProtection } from '@/lib/csrf'

export const POST = withCsrfProtection(async (request) => {
  // Tu código aquí
})
```

**Prioridad:** 🟠 ALTA - Esta semana
**Esfuerzo:** 2-3 horas (aplicar a ~30 endpoints)

---

### 9. Implementar JWT para Sesiones - PENDIENTE ⚠️
**Severidad:** MEDIA
**Estado:** José instalado, sin implementar

**Beneficios:**
- Sesiones firmadas criptográficamente
- Sin posibilidad de modificación por cliente
- Soporte para refresh tokens

**Implementación:**
```typescript
import { SignJWT, jwtVerify } from 'jose'

// Crear sesión
const token = await new SignJWT({ userId, email })
  .setProtectedHeader({ alg: 'HS256' })
  .setExpirationTime('7d')
  .sign(secret)
```

**Prioridad:** 🟡 MEDIA - Próximo mes
**Esfuerzo:** 3-4 horas

---

### 10. Headers de Seguridad con Helmet - PENDIENTE ⚠️
**Severidad:** MEDIA
**Estado:** Helmet instalado, sin configurar

**Implementación:**
```typescript
// middleware.ts o layout
import helmet from 'helmet'

const helmetMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'nonce-{random}'"],
      styleSrc: ["'self'", "'nonce-{random}'"],
    }
  },
  hsts: { maxAge: 31536000, includeSubDomains: true }
})
```

**Prioridad:** 🟡 MEDIA - Próximo mes
**Esfuerzo:** 1-2 horas

---

## 📋 PLAN DE ACCIÓN RECOMENDADO

### 🔴 Esta Semana (Prioridad Crítica)
1. ⚠️ **Sanitizar dangerouslySetInnerHTML** (6 archivos)
   - Esfuerzo: 1-2 horas
   - Usar lib/security-utils.ts ya creado

2. ⚠️ **Actualizar dependencias vulnerables**
   - Esfuerzo: 30 min + testing
   - `npm audit fix`

3. ⚠️ **Aplicar CSRF a endpoints críticos**
   - Esfuerzo: 2-3 horas
   - Usar lib/csrf.ts ya creado

### 🟠 Este Mes (Prioridad Alta)
4. ⚠️ **Sandbox para LivePreview** (new Function())
   - Esfuerzo: 4-8 horas
   - Rediseño arquitectónico necesario

5. ⚠️ **Implementar JWT para sesiones**
   - Esfuerzo: 3-4 horas
   - José ya instalado

6. ⚠️ **Configurar Helmet.js**
   - Esfuerzo: 1-2 horas

### 🟡 Próximos 2-3 Meses (Mejoras)
7. ⚠️ **Logger centralizado** (reemplazar console.log)
8. ⚠️ **Refactorizar archivos grandes**
9. ⚠️ **Resolver TODOs** (crear issues)
10. ⚠️ **Testing completo de seguridad**
11. ⚠️ **Auditoría externa**

---

## ✅ CHECKLIST DE PRODUCCIÓN

### Seguridad
- [x] API keys removidas del código
- [x] Precio validado desde BD
- [x] Memory leaks corregidos
- [x] Tokens OAuth encriptados
- [x] Rate limiting activo
- [x] CORS restrictivo
- [x] Validación de entrada (Zod)
- [ ] XSS sanitizado en cápsulas
- [ ] Code injection resuelto
- [ ] CSRF aplicado a todos endpoints
- [ ] Dependencias actualizadas
- [ ] JWT sesiones implementado

### Calidad
- [ ] Console logs removidos/centralizados
- [ ] Archivos grandes refactorizados
- [ ] TODOs documentados
- [ ] Magic numbers como constantes
- [ ] Tests de seguridad pasando

### Infraestructura
- [ ] Variables de entorno configuradas
- [ ] Secrets scanning en CI/CD
- [ ] Monitoring activo
- [ ] Backups configurados

---

## 🎯 RESUMEN EJECUTIVO

**Completado:** 11/23 problemas (48%)
**Críticos restantes:** 2 (XSS, Code Injection)
**Vulnerabilidades deps:** 5 (2 mod, 3 high)
**Esfuerzo estimado total:** 15-25 horas

**Recomendación:**
1. Priorizar XSS y dependencias (esta semana - 2 horas)
2. Code injection requiere más tiempo (planear bien)
3. Resto puede ser gradual en próximos sprints

**Estado del proyecto:** ✅ Seguro para desarrollo, ⚠️ Requiere trabajo antes de producción

---

**Próxima revisión recomendada:** En 2 semanas (tras implementar pendientes de esta semana)
