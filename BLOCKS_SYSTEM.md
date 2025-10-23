# 🧱 HubLab Blocks System - MVP Documentation

## 📋 Tabla de Contenidos
1. [Visión General](#visión-general)
2. [Arquitectura](#arquitectura)
3. [Bloques Implementados](#bloques-implementados)
4. [Cómo Funciona](#cómo-funciona)
5. [Demo](#demo)
6. [Próximos Pasos](#próximos-pasos)

---

## 🎯 Visión General

**HubLab Blocks** es un sistema de bloques reutilizables que permite construir páginas web mediante drag-and-drop, similar a WordPress/Webflow pero optimizado para **"vibe coding"** con AI IDEs como Cursor y Lovable.

### ¿Qué es un "Block"?

Un bloque es un **componente React autocontenido** con:
- ✅ **Component**: Código React (.tsx)
- ✅ **Schema**: JSON Schema que define sus props configurables
- ✅ **Metadata**: Información del marketplace (precio, tags, etc.)
- ✅ (Opcional) **Server Code**: Lógica backend si la necesita

### Estado Actual (Fase 1 MVP)

✅ **Completado:**
- Sistema de base de datos completo (Supabase SQL)
- Tipos TypeScript para bloques
- BlockRenderer funcional
- 5 bloques core pre-construidos
- Página de demo interactiva
- Funciones helper en `lib/supabase.ts`

⏳ **En progreso:**
- Marketplace visual de bloques
- Sistema de upload para creadores
- Editor drag-and-drop
- Integración de pagos para bloques pagos

---

## 🏗️ Arquitectura

### Estructura de Archivos

```
hublab/
├── supabase-blocks-extension.sql    # Schema de DB
├── lib/
│   ├── supabase.ts                  # Helper functions
│   └── types/
│       └── blocks.ts                # TypeScript types
├── components/
│   └── BlockRenderer.tsx            # Renderiza bloques dinámicamente
└── app/
    └── demo-blocks/
        └── page.tsx                 # Demo page
```

### Base de Datos (Supabase)

**Tablas principales:**

1. **`blocks`** - Bloques del marketplace
   - Metadata (título, descripción, precio, categoría)
   - URLs a archivos (component, schema, docs)
   - Stats (downloads, installs, rating)
   - Estado (published, approved)

2. **`block_purchases`** - Compras de bloques
   - Relación buyer → block
   - Integración con Stripe
   - Estados: pending, completed, refunded

3. **`pages`** - Páginas creadas por usuarios
   - Contiene array de `BlockInstance` en JSON
   - Layout y theme config
   - Published/draft status

4. **`block_collections`** - Bundles de bloques
   - Agrupaciones temáticas (ej: "E-commerce Starter Kit")

### Flujo de Datos

```
Usuario → Marketplace → Selecciona Bloque → Configura Props →
→ Guarda en `pages.blocks` (JSON) → BlockRenderer lee JSON →
→ Renderiza componentes dinámicamente
```

---

## 🧩 Bloques Implementados

Actualmente hay **5 bloques core** pre-construidos:

### 1. Hero Section
**Type:** `hero-section`

Landing principal con título, subtítulo y CTA.

**Props:**
```typescript
{
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  backgroundImage?: string;
}
```

**Uso:**
```json
{
  "type": "hero-section",
  "props": {
    "title": "Welcome to HubLab",
    "ctaText": "Get Started"
  }
}
```

---

### 2. Features Grid
**Type:** `features-grid`

Grid de características/servicios con iconos.

**Props:**
```typescript
{
  title?: string;
  features?: Array<{
    icon?: string;
    title: string;
    description: string;
  }>;
}
```

---

### 3. CTA Section
**Type:** `cta-section`

Sección de call-to-action con 2 botones.

**Props:**
```typescript
{
  title?: string;
  description?: string;
  primaryText?: string;
  primaryLink?: string;
  secondaryText?: string;
  secondaryLink?: string;
}
```

---

### 4. Testimonials
**Type:** `testimonials`

Grid de testimonios de usuarios.

**Props:**
```typescript
{
  title?: string;
  testimonials?: Array<{
    name: string;
    role: string;
    content: string;
    avatar?: string;
  }>;
}
```

---

### 5. Pricing Table
**Type:** `pricing-table`

Tabla de precios con múltiples planes.

**Props:**
```typescript
{
  title?: string;
  plans?: Array<{
    name: string;
    price: string;
    period?: string;
    features: string[];
    highlighted?: boolean;
    ctaText?: string;
    ctaLink?: string;
  }>;
}
```

---

## 🔧 Cómo Funciona

### 1. Registro de Bloques

Los bloques se registran en el `blockRegistry`:

```typescript
// components/BlockRenderer.tsx
blockRegistry['hero-section'] = {
  component: HeroSection,
  schema: {
    title: 'Hero Section',
    type: 'object',
    properties: {
      title: { type: 'string', default: 'Welcome' },
      // ...
    }
  }
};
```

### 2. Definición de una Página

Una página es un array de `BlockInstance`:

```typescript
const pageBlocks: BlockInstance[] = [
  {
    id: 'unique-id-1',
    blockId: 'hero-1', // Reference en marketplace
    type: 'hero-section',
    props: {
      title: 'Mi Título',
      ctaText: 'Click aquí'
    },
    position: {
      order: 0
    }
  },
  // más bloques...
];
```

### 3. Renderizado

El `BlockRenderer` parsea el array y renderiza cada bloque:

```tsx
<BlockRenderer
  blocks={pageBlocks}
  isEditor={false}
/>
```

**Output:** Página HTML completa con todos los bloques renderizados.

---

## 🎮 Demo

### Ver la Demo

1. **Iniciar servidor:**
   ```bash
   cd /Users/c/hublab
   npm run dev
   ```

2. **Abrir en navegador:**
   ```
   http://localhost:3001/demo-blocks
   ```

### Características de la Demo

- ✅ **Preview Mode**: Ve la página renderizada
- ✅ **Editor Mode**: Activa para ver bloques seleccionables
- ✅ **Side Panel**: Lista de bloques disponibles
- ✅ **Toolbar**: Info de debugging

### Capturas de Pantalla

La demo muestra:
- Hero section con gradiente
- Features grid (6 features)
- Testimonials (3 testimonios)
- Pricing table (3 planes)
- CTA final

---

## 🚀 Próximos Pasos

### Fase 1 (Semana 1-2) - MVP Básico ✅

- [x] Schema de DB
- [x] Tipos TypeScript
- [x] BlockRenderer
- [x] 5 bloques core
- [x] Demo page
- [ ] **Marketplace page** (`/blocks`)
- [ ] **Upload page** (`/blocks/upload`)

### Fase 2 (Semana 3-4) - Editor Visual

- [ ] Drag-and-drop editor
- [ ] Visual prop editor (forms dinámicos desde schema)
- [ ] Reordenar bloques
- [ ] Guardar/cargar páginas
- [ ] Preview en tiempo real

### Fase 3 (Mes 2) - Marketplace

- [ ] Browse blocks con filtros
- [ ] Detalle de block con preview
- [ ] Sistema de compras (Stripe)
- [ ] Reviews y ratings
- [ ] Search y categorías

### Fase 4 (Mes 2-3) - Framework Completo

- [ ] Monorepo con Turborepo
- [ ] CLI: `vibe new`, `vibe add:block`
- [ ] Sistema de plugins
- [ ] Multi-tenant
- [ ] Sandboxing de bloques third-party

---

## 📚 API Reference

### Funciones Helper (lib/supabase.ts)

```typescript
// Obtener bloques del marketplace
await getBlocks({
  category: 'ui',
  isFree: true,
  limit: 20
});

// Verificar acceso a bloque
await checkBlockAccess(userId, blockId);

// Crear bloque
await createBlock({
  title: 'My Block',
  block_key: 'my-block-v1',
  category: 'ui',
  price: 9.99,
  // ...
});

// Crear página
await createPage({
  title: 'Landing Page',
  slug: 'landing',
  blocks: [...blockInstances],
  creator_id: userId,
  published: true
});
```

### BlockRenderer Props

```typescript
interface BlockRendererProps {
  blocks: BlockInstance[];
  isEditor?: boolean; // Activa modo editor
  onBlockSelect?: (blockId: string) => void;
}
```

---

## 🎨 Crear tu Propio Bloque

### 1. Crear el Componente

```tsx
// components/blocks/MyAwesomeBlock.tsx
export default function MyAwesomeBlock({ title, items }: {
  title: string;
  items: string[];
}) {
  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-4">{title}</h2>
      <ul>
        {items.map((item, i) => <li key={i}>{item}</li>)}
      </ul>
    </div>
  );
}
```

### 2. Definir el Schema

```json
{
  "title": "My Awesome Block",
  "type": "object",
  "properties": {
    "title": {
      "type": "string",
      "default": "Default Title"
    },
    "items": {
      "type": "array",
      "items": { "type": "string" }
    }
  },
  "required": ["title"]
}
```

### 3. Registrar el Bloque

```typescript
import { registerBlock } from '@/components/BlockRenderer';
import MyAwesomeBlock from '@/components/blocks/MyAwesomeBlock';
import schema from './my-awesome-block.schema.json';

registerBlock('my-awesome-block', MyAwesomeBlock, schema);
```

### 4. Usar en una Página

```typescript
const blocks: BlockInstance[] = [
  {
    id: '1',
    blockId: 'awesome-1',
    type: 'my-awesome-block',
    props: {
      title: 'Check this out!',
      items: ['Item 1', 'Item 2', 'Item 3']
    }
  }
];
```

---

## 💡 Tips para Vibe Coding

### Con Cursor/AI IDEs

1. **Describe el bloque en lenguaje natural:**
   ```
   "Crea un bloque de pricing con 3 planes,
   cada uno con título, precio, features lista,
   y botón CTA. El plan del medio debe estar highlighted."
   ```

2. **Cursor generará:**
   - Componente React
   - Props interface
   - JSON Schema
   - Estilos Tailwind

3. **Registra y usa:**
   ```typescript
   registerBlock('ai-generated-pricing', Component, schema);
   ```

### Prompts Útiles

- "Crea un bloque de testimonio tipo card con avatar circular"
- "Genera un hero section con video background"
- "Quiero un bloque de FAQ con acordeones expandibles"
- "Crea una galería de imágenes con lightbox"

---

## 🤝 Contribuir

### Para Agregar Bloques Core

1. Crear componente en `components/blocks/`
2. Agregar registro en `BlockRenderer.tsx`
3. Actualizar esta documentación
4. Crear PR

### Para el Marketplace

Una vez implementado el sistema de upload, podrás:
- Subir bloques custom
- Venderlos (free o paid)
- Recibir pagos vía Stripe
- Ganar royalties

---

## 📞 Soporte

- **Issues**: GitHub Issues
- **Docs**: Este archivo + código comentado
- **Community**: (Por definir - Discord/Slack)

---

## 🎉 Conclusión

Este es el **MVP funcional** del sistema de bloques. Ya puedes:
- ✅ Ver bloques renderizados
- ✅ Crear páginas programáticamente
- ✅ Entender la arquitectura

**Siguiente paso:** Implementar el marketplace visual y el editor drag-and-drop.

---

*Última actualización: Oct 23, 2025*
*Versión: 1.0.0 (MVP)*
