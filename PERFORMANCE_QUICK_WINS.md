# ⚡ Quick Wins de Rendimiento - HubLab

Optimizaciones de alto impacto que pueden implementarse rápidamente (1-2 días cada una).

---

## 🎯 Quick Win #1: Habilitar Optimización de Imágenes (30 min)

**Impacto:** 10-15% reducción de payload, mejora LCP en 0.5-1s

**Archivo:** `next.config.js`

**Cambio:**
```javascript
// ❌ Actual:
images: {
  unoptimized: true,
},

// ✅ Cambiar a:
images: {
  unoptimized: false,
  formats: ['image/avif', 'image/webp'],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
},
```

**Luego, actualizar componentes:**

```tsx
// ❌ Antes:
<img src="/hero.png" alt="Hero" />

// ✅ Después:
import Image from 'next/image';

<Image
  src="/hero.png"
  alt="Hero"
  width={800}
  height={600}
  priority // Para imágenes above-the-fold
/>
```

**Archivos a actualizar:**
- `app/page.tsx`
- `app/compiler/page.tsx`
- `app/marketplace/page.tsx`
- Cualquier componente con `<img>` tags

---

## 🎯 Quick Win #2: React.memo en Componentes Pesados (2 horas)

**Impacto:** 20-30% mejora en rendering, menos re-renders innecesarios

**Archivos a modificar:**

### `components/CapsuleBrowser.tsx`
```tsx
import { memo } from 'react';

// Al final del archivo:
// ❌ Antes:
export default CapsuleBrowser;

// ✅ Después:
export default memo(CapsuleBrowser);
```

### `components/LiveCapsulePreviews.tsx`
```tsx
import { memo } from 'react';

export default memo(LiveCapsulePreviews);
```

### `components/IntelligentCapsuleSearch.tsx`
```tsx
import { memo } from 'react';

export default memo(IntelligentCapsuleSearch);
```

### `components/CompositionVisualizer.tsx`
```tsx
import { memo } from 'react';

export default memo(CompositionVisualizer);
```

**Lista completa de 20 componentes a envolver:**
1. CapsuleBrowser
2. LiveCapsulePreviews
3. IntelligentCapsuleSearch
4. CompositionVisualizer
5. SaveCompositionDialog
6. VisualTemplateGallery
7. GitHubCapsuleConverter
8. CodeExportModal
9. ImprovedStudioSidebar
10. IterativeChat
11. ErrorBoundary
12. LivePreview
13. CapsuleCard (componente de lista)
14. TemplateCard
15. MarketplaceCard
16. DashboardStats
17. CRMTable
18. WorkflowBuilder
19. CanvasEditor
20. MonacoEditor wrapper

---

## 🎯 Quick Win #3: Optimizar Queries de Base de Datos (1 hora)

**Impacto:** 10-20% reducción de payload, 30-40% menos tiempo de query

### Cambiar SELECT * a campos específicos:

**`app/api/marketplace/capsules/route.ts`**
```typescript
// ❌ Antes:
const { data } = await supabase
  .from('marketplace_capsules')
  .select('*')
  .range(offset, offset + limit - 1);

// ✅ Después:
const { data } = await supabase
  .from('marketplace_capsules')
  .select('id, name, description, author, category, stars, downloads, created_at')
  .range(offset, offset + limit - 1);
```

**`app/api/crm/leads/route.ts`**
```typescript
// ❌ Antes:
const { data } = await supabase
  .from('crm_leads')
  .select('*');

// ✅ Después:
const { data } = await supabase
  .from('crm_leads')
  .select('id, name, email, status, source, created_at')
  .order('created_at', { ascending: false })
  .limit(100); // Agregar límite
```

**Aplicar a todos los API routes** (buscar `.select('*')` y reemplazar)

---

## 🎯 Quick Win #4: Cachear Resultado de flattenCapsules() (30 min)

**Impacto:** 40-60% reducción en computación para este endpoint

**Archivo:** `app/api/v1/projects/[id]/capsules/route.ts`

```typescript
// ❌ Antes (líneas 254-255):
const capsuleArray1 = flattenCapsules(allCapsules);
const capsuleArray2 = flattenCapsules(allCapsules); // Duplicado!

// ✅ Después:
const capsuleArray = flattenCapsules(allCapsules);
// Usar capsuleArray en ambos lugares
```

---

## 🎯 Quick Win #5: Agregar Caching Headers (30 min)

**Impacto:** 50-80% reducción de requests en usuarios recurrentes

**Para endpoints públicos de solo lectura:**

```typescript
// app/api/ai/capsules/route.ts
export async function GET(request: Request) {
  const response = NextResponse.json(data);

  // Cachear por 5 minutos
  response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');

  return response;
}
```

**Agregar a:**
- `/api/ai/capsules` - Cache 5 min
- `/api/ai/metadata` - Cache 10 min
- `/api/marketplace/capsules` (sin query params) - Cache 5 min
- `/api/components` - Cache 1 hora

---

## 🎯 Quick Win #6: useMemo para Cálculos Pesados (1 hora)

**Impacto:** Evita cálculos redundantes en cada render

**`components/CapsuleBrowser.tsx`**
```tsx
import { useMemo } from 'react';

function CapsuleBrowser({ capsules, searchTerm, filters }) {
  // ❌ Antes (se ejecuta en cada render):
  const filtered = capsules.filter(c =>
    c.name.includes(searchTerm) &&
    matchesFilters(c, filters)
  );

  // ✅ Después:
  const filtered = useMemo(() => {
    return capsules.filter(c =>
      c.name.includes(searchTerm) &&
      matchesFilters(c, filters)
    );
  }, [capsules, searchTerm, filters]);

  // ...resto del componente
}
```

**Aplicar a:**
- Filtrado de listas grandes
- Cálculos de estadísticas en dashboards
- Transformaciones de datos
- Búsquedas/sorts

---

## 🎯 Quick Win #7: useCallback para Handlers (30 min)

**Impacto:** Evita re-renders de componentes hijos que dependen de callbacks

```tsx
import { useCallback } from 'react';

function ParentComponent() {
  // ❌ Antes (nueva función en cada render):
  const handleClick = (id) => {
    console.log('Clicked', id);
  };

  // ✅ Después:
  const handleClick = useCallback((id) => {
    console.log('Clicked', id);
  }, []); // Dependencias vacías si no usa state/props

  return <ChildComponent onClick={handleClick} />;
}
```

---

## 🎯 Quick Win #8: Lazy Loading de Rutas Pesadas (1 hora)

**Impacto:** 30-40% reducción de bundle inicial

**Archivo:** `app/layout.tsx` o componentes padre

```tsx
import dynamic from 'next/dynamic';

// ❌ Antes:
import MonacoEditor from '@monaco-editor/react';
import VisualBuilder from '@/components/VisualBuilder';

// ✅ Después:
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  loading: () => <div>Loading editor...</div>,
  ssr: false // No renderizar en servidor si no es necesario
});

const VisualBuilder = dynamic(() => import('@/components/VisualBuilder'), {
  loading: () => <div>Loading builder...</div>,
});
```

**Aplicar a componentes pesados:**
- Monaco Editor (200KB+)
- ReactFlow (150KB+)
- Componentes de visualización de datos
- Cualquier componente >50KB

---

## 🎯 Quick Win #9: Eliminar console.log en Producción (15 min)

**Impacto:** Pequeño pero limpia el código

**`next.config.js`**
```javascript
const nextConfig = {
  // ... config existente

  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'], // Mantener errors y warnings
    } : false,
  },
};
```

---

## 🎯 Quick Win #10: Optimizar Imports (30 min)

**Impacto:** 5-10% reducción de bundle

```typescript
// ❌ Antes (importa TODO lodash):
import _ from 'lodash';
const result = _.debounce(fn, 300);

// ✅ Después (solo importa debounce):
import debounce from 'lodash/debounce';
const result = debounce(fn, 300);
```

```typescript
// ❌ Antes:
import * as Icons from 'react-icons/fa';

// ✅ Después:
import { FaUser, FaCog, FaHome } from 'react-icons/fa';
```

---

## 📊 Resumen de Impacto Total

| Quick Win | Tiempo | Impacto | Prioridad |
|-----------|--------|---------|-----------|
| 1. Imágenes | 30 min | Alto (LCP -0.5-1s) | ⭐⭐⭐ |
| 2. React.memo | 2 hrs | Alto (30% renders) | ⭐⭐⭐ |
| 3. SELECT específicos | 1 hr | Medio (20% payload) | ⭐⭐⭐ |
| 4. Cache flattenCapsules | 30 min | Alto (60% en endpoint) | ⭐⭐⭐ |
| 5. Cache headers | 30 min | Alto (80% requests) | ⭐⭐⭐ |
| 6. useMemo | 1 hr | Medio | ⭐⭐ |
| 7. useCallback | 30 min | Bajo | ⭐ |
| 8. Lazy loading | 1 hr | Alto (40% bundle) | ⭐⭐⭐ |
| 9. Remove console | 15 min | Bajo | ⭐ |
| 10. Optimize imports | 30 min | Medio | ⭐⭐ |

**Total:** ~8 horas de trabajo
**Ganancia:** 40-50% mejora general en rendimiento

---

## 🚀 Plan de Implementación Recomendado

### Día 1 (4 horas)
- ✅ Quick Win #1: Imágenes (30 min)
- ✅ Quick Win #4: Cache flattenCapsules (30 min)
- ✅ Quick Win #5: Cache headers (30 min)
- ✅ Quick Win #8: Lazy loading (1 hr)
- ✅ Quick Win #9: Remove console (15 min)
- ✅ Quick Win #10: Optimize imports (30 min)

### Día 2 (4 horas)
- ✅ Quick Win #2: React.memo (2 hrs)
- ✅ Quick Win #3: SELECT queries (1 hr)
- ✅ Quick Win #6: useMemo (1 hr)

### Validación
- Correr `npm run build` y verificar bundle size
- Ejecutar Lighthouse antes/después
- Medir LCP, FCP, TTI en producción

---

## 🔍 Comandos para Medir Impacto

```bash
# Antes de cambios:
npm run build
# Anotar bundle sizes

# Después de cambios:
npm run build
# Comparar bundle sizes

# Lighthouse CI:
npx lighthouse https://tu-dominio.com --view

# Bundle analyzer:
npm install --save-dev @next/bundle-analyzer
# Agregar a next.config.js y correr
ANALYZE=true npm run build
```

---

**Nota:** Estos Quick Wins son independientes entre sí. Puedes implementarlos en cualquier orden según prioridad.
