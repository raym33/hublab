# 🎨 Ambient Agent CRM - UI/UX Design

**Versión:** 1.0.0
**Fecha:** Octubre 2025
**Estado:** Implementado

---

## 📋 Índice

1. [Visión General del Diseño](#visión-general-del-diseño)
2. [Página: CRM Setup](#página-crm-setup)
3. [Página: Dashboard](#página-dashboard)
4. [Página: Approvals](#página-approvals)
5. [Componentes Reutilizables](#componentes-reutilizables)
6. [Sistema de Diseño](#sistema-de-diseño)

---

## 🎯 Visión General del Diseño

### Principios de Diseño

1. **Claridad primero** - Información crítica visible inmediatamente
2. **Confianza visual** - Mostrar confidence scores y justificaciones AI
3. **Acción rápida** - Aprobar/rechazar con un solo click
4. **Estado en tiempo real** - Actualizaciones live de eventos
5. **Diseño modular** - Componentes reutilizables y consistentes

### Paleta de Colores

```
Primary (Blue):   #2563EB (bg-blue-600)
Success (Green):  #16A34A (bg-green-600)
Warning (Yellow): #CA8A04 (bg-yellow-600)
Danger (Red):     #DC2626 (bg-red-600)
Purple:           #9333EA (bg-purple-600)

Neutrals:
- Slate 900: #0F172A (texto principal)
- Slate 600: #475569 (texto secundario)
- Slate 200: #E2E8F0 (bordes)
- Slate 50:  #F8FAFC (backgrounds)
```

---

## 📄 Página: CRM Setup

**Ruta:** `/crm/setup`

### Layout Visual

```
╔═══════════════════════════════════════════════════════════════╗
║  🚀 Ambient Agent CRM Setup          [✓ Auto-sync enabled]   ║
║  Connect your CRM and data sources                            ║
╠═══════════════════════════════════════════════════════════════╣
║  [CRM Connections] [Data Sources] [Automation Rules]          ║
╠═══════════════════════════════════════════════════════════════╣
║                                                                ║
║  ┌─────────────────────┐  ┌─────────────────────┐            ║
║  │  H  HubSpot         │  │  S  Salesforce      │            ║
║  │  ✓ Connected        │  │  Not connected      │            ║
║  │                     │  │                     │            ║
║  │  Last: 2 min ago    │  │  [Connect →]        │            ║
║  │  [Configure]        │  │                     │            ║
║  └─────────────────────┘  └─────────────────────┘            ║
║                                                                ║
║  ┌─────────────────────┐  ┌─────────────────────┐            ║
║  │  P  Pipedrive       │  │  Z  Zoho CRM        │            ║
║  │  Not connected      │  │  Not connected      │            ║
║  │  [Connect →]        │  │  [Connect →]        │            ║
║  └─────────────────────┘  └─────────────────────┘            ║
║                                                                ║
║  ┌──────────────────────────────────────────────────────────┐ ║
║  │ ℹ Getting Started                                        │ ║
║  │ 1. Connect your CRM (we recommend HubSpot)               │ ║
║  │ 2. Enable data sources (Gmail, Calendar)                 │ ║
║  │ 3. Configure automation rules                            │ ║
║  └──────────────────────────────────────────────────────────┘ ║
╚═══════════════════════════════════════════════════════════════╝
```

### Características Principales

#### Tab 1: CRM Connections
- **Grid de 4 CRMs** (HubSpot, Salesforce, Pipedrive, Zoho)
- Cada card muestra:
  - Logo/inicial del CRM
  - Estado: Connected / Not connected
  - Last sync time (si conectado)
  - Botón CTA: "Connect" o "Configure"

#### Tab 2: Data Sources (Watchers)
```
╔═══════════════════════════════════════════════════════════════╗
║  Data Sources (Watchers)                                      ║
║  Enable the sources you want to monitor                       ║
╠═══════════════════════════════════════════════════════════════╣
║                                                                ║
║  ┌────────────────────────────────────────────────┐           ║
║  │  G  Gmail                      [Toggle: ON ]   │           ║
║  │  Actively monitoring for updates               │           ║
║  └────────────────────────────────────────────────┘           ║
║                                                                ║
║  ┌────────────────────────────────────────────────┐           ║
║  │  C  Google Calendar            [Toggle: ON ]   │           ║
║  │  Actively monitoring for updates               │           ║
║  └────────────────────────────────────────────────┘           ║
║                                                                ║
║  Stats:                                                        ║
║  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          ║
║  │ Events: 247 │  │ Actions: 18 │  │ Auto: 94%   │          ║
║  └─────────────┘  └─────────────┘  └─────────────┘          ║
╚═══════════════════════════════════════════════════════════════╝
```

#### Tab 3: Automation Rules
```
╔═══════════════════════════════════════════════════════════════╗
║  Automation Rules                                             ║
╠═══════════════════════════════════════════════════════════════╣
║                                                                ║
║  ┌────────────────────────────────────────────────┐           ║
║  │  Post-Meeting Updates              [Toggle: ON]│           ║
║  │  Create activity log and update deal stage     │           ║
║  │  [Calendar] [Auto-approve]                     │           ║
║  └────────────────────────────────────────────────┘           ║
║                                                                ║
║  ┌────────────────────────────────────────────────┐           ║
║  │  Email with Purchase Order      [Toggle: ON]   │           ║
║  │  Create or update deal                         │           ║
║  │  [Gmail] [Requires approval]                   │           ║
║  └────────────────────────────────────────────────┘           ║
║                                                                ║
║  [+ Add Custom Rule]                                          ║
╚═══════════════════════════════════════════════════════════════╝
```

---

## 📊 Página: Dashboard

**Ruta:** `/crm/dashboard`

### Layout Visual

```
╔═══════════════════════════════════════════════════════════════╗
║  CRM Dashboard                    [Today ▾] [Export Report]   ║
║  Real-time activity and automation insights                   ║
╠═══════════════════════════════════════════════════════════════╣
║                                                                ║
║  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          ║
║  │ 📊 Events   │  │ ✓ Updates   │  │ ⏰ Pending  │ │ 💰     │ ║
║  │ 1,247       │  │ 89          │  │ 3           │ │ $124K  │ ║
║  │ +12% ↑      │  │ +8% ↑       │  │ 0           │ │ +23% ↑ │ ║
║  └─────────────┘  └─────────────┘  └─────────────┘ └────────┘ ║
║                                                                ║
║  ┌──────────────────────────┐  ┌──────────────────────────┐  ║
║  │  Recent Events           │  │  CRM Actions             │  ║
║  ├──────────────────────────┤  ├──────────────────────────┤  ║
║  │  📅 Demo with ACME      │  │  ✓ Update Deal Stage     │  ║
║  │  2 minutes ago           │  │  ACME Corp               │  ║
║  │  98% confidence          │  │  2 minutes ago           │  ║
║  │                          │  │  [executed] 98%          │  ║
║  ├──────────────────────────┤  ├──────────────────────────┤  ║
║  │  ✉️ PO from Beta Inc    │  │  ✓ Create Deal           │  ║
║  │  15 minutes ago          │  │  Beta Inc - $85K         │  ║
║  │  95% confidence          │  │  15 minutes ago          │  ║
║  │                          │  │  [executed] 95%          │  ║
║  └──────────────────────────┘  └──────────────────────────┘  ║
║                                                                ║
║  ┌──────────────────────────────────────────────────────────┐ ║
║  │  Activity Trend (Chart)                                  │ ║
║  │  [Placeholder for real-time chart]                       │ ║
║  └──────────────────────────────────────────────────────────┘ ║
╚═══════════════════════════════════════════════════════════════╝
```

### Características Principales

#### Stats Grid (4 cards)
1. **Events Processed** - Total eventos del día
2. **CRM Updates** - Acciones ejecutadas
3. **Pending Approval** - Requieren revisión
4. **Pipeline Value** - Valor total impactado

#### Recent Events Feed
- Lista scrollable de últimos 5 eventos
- Cada evento muestra:
  - Icono por tipo (email, meeting, slack)
  - Título del evento
  - Fuente (Gmail, Calendar, etc.)
  - Timestamp relativo
  - Confidence score
  - Estado: procesado o pendiente

#### CRM Actions Feed
- Últimas 5 acciones ejecutadas
- Muestra:
  - Tipo de acción
  - Recurso afectado (contacto, deal, etc.)
  - Status badge (executed, pending, failed)
  - Confidence score

---

## ✅ Página: Approvals

**Ruta:** `/crm/approvals`

### Layout Visual

```
╔═══════════════════════════════════════════════════════════════╗
║  Pending Approvals        [Approve All Low] [Configure Auto]  ║
║  Review and approve proposed CRM updates                      ║
╠═══════════════════════════════════════════════════════════════╣
║  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐ ║
║  │ Pending   │  │ High Risk │  │ Avg Conf  │  │ Pipeline  │ ║
║  │    3      │  │     1     │  │    86%    │  │  $180K    │ ║
║  └───────────┘  └───────────┘  └───────────┘  └───────────┘ ║
╠═══════════════════════════════════════════════════════════════╣
║                                                                ║
║  ┌──────────────────────────────────────────────────────────┐ ║
║  │  ✉️ Create Deal                           [MEDIUM RISK]  │ ║
║  │  Beta Inc - Enterprise License             [87% conf]    │ ║
║  │                                                           │ ║
║  │  Triggered by: Purchase order from Beta Inc              │ ║
║  │  15 minutes ago                                           │ ║
║  │                                                           │ ║
║  │  👁️ AI Reasoning: Email contains PO with deal details.   │ ║
║  │  Amount extracted from document. Company exists in CRM.  │ ║
║  │                                                           │ ║
║  │  ▼ Show 5 proposed changes                               │ ║
║  │  ┌────────────────────────────────────────────────────┐  │ ║
║  │  │ Deal Name                                          │  │ ║
║  │  │ New Value: Beta Inc - Enterprise License          │  │ ║
║  │  ├────────────────────────────────────────────────────┤  │ ║
║  │  │ Amount                                             │  │ ║
║  │  │ Current: [empty]  →  Proposed: $85,000            │  │ ║
║  │  └────────────────────────────────────────────────────┘  │ ║
║  │                                                           │ ║
║  │  [✓ Approve & Execute]  [✗ Reject]  [Edit]              │ ║
║  └──────────────────────────────────────────────────────────┘ ║
║                                                                ║
║  ┌──────────────────────────────────────────────────────────┐ ║
║  │  📧 Create Contact                           [LOW RISK]  │ ║
║  │  john.doe@newcompany.com                     [92% conf]  │ ║
║  │  ...                                                      │ ║
║  └──────────────────────────────────────────────────────────┘ ║
╚═══════════════════════════════════════════════════════════════╝
```

### Características Principales

#### Stats Bar
- **Pending count** - Total pendientes
- **High risk count** - Requieren atención
- **Average confidence** - Confidence promedio
- **Pipeline impact** - Valor total de deals

#### Action Cards (Expandibles)
Cada card tiene:

**Header:**
- Icono del tipo de evento (email, meeting, slack)
- Tipo de acción (Create Deal, Update Contact, etc.)
- Recurso objetivo
- Risk badge (LOW, MEDIUM, HIGH)
- Confidence badge

**Body:**
- Evento trigger (qué lo causó)
- Timestamp
- AI Reasoning (justificación del LLM)
- Botón expandir/contraer cambios

**Proposed Changes (Expandible):**
- Lista de campos a cambiar
- Cada campo muestra:
  - Nombre del campo
  - Valor actual (si existe)
  - Valor propuesto
  - Visual diff: current (red) → proposed (green)

**Actions:**
- ✓ Approve & Execute (verde)
- ✗ Reject (gris)
- Edit (gris)

---

## 🧩 Componentes Reutilizables

### 1. StatCard

**Props:**
```typescript
{
  label: string
  value: string | number
  change?: string
  trend?: 'up' | 'down' | 'neutral'
  icon: LucideIcon
  color?: 'blue' | 'green' | 'yellow' | 'purple' | 'red'
}
```

**Uso:**
```tsx
<StatCard
  label="Events Processed"
  value="1,247"
  change="+12%"
  trend="up"
  icon={Activity}
  color="blue"
/>
```

### 2. EventCard

**Props:**
```typescript
{
  type: 'email' | 'meeting' | 'slack'
  source: string
  title: string
  timestamp: string
  processed: boolean
  confidence?: number
}
```

**Uso:**
```tsx
<EventCard
  type="meeting"
  source="Google Calendar"
  title="Demo with ACME Corp"
  timestamp="2 minutes ago"
  processed={true}
  confidence={0.98}
/>
```

### 3. ActionCard

**Props:**
```typescript
{
  type: string
  status: 'pending' | 'approved' | 'executed' | 'failed'
  resource: string
  timestamp: string
  confidence: number
}
```

**Uso:**
```tsx
<ActionCard
  type="update_deal_stage"
  status="executed"
  resource="ACME Corp - Deal"
  timestamp="2 minutes ago"
  confidence={0.98}
/>
```

---

## 🎨 Sistema de Diseño

### Tipografía

```
Headings:
- H1: text-3xl font-bold (30px)
- H2: text-xl font-semibold (20px)
- H3: text-lg font-semibold (18px)

Body:
- Regular: text-sm (14px)
- Small: text-xs (12px)
```

### Espaciado

```
- p-4: 1rem (16px)
- p-6: 1.5rem (24px)
- gap-4: 1rem
- gap-6: 1.5rem
- mt-8: 2rem (32px)
```

### Bordes y Radios

```
- rounded-lg: 0.5rem (8px)
- rounded-xl: 0.75rem (12px)
- border-slate-200: #E2E8F0
```

### Sombras

```
- shadow-sm: subtle shadow
- hover:border-blue-300: interactive feedback
```

### Estados Interactivos

```css
/* Buttons */
hover:bg-blue-700
transition-colors
font-medium

/* Cards */
hover:border-blue-300
transition-colors
cursor-pointer

/* Toggle switches */
peer-checked:bg-blue-600
peer-checked:after:translate-x-full
```

---

## 📱 Responsive Design

### Breakpoints

```
sm: 640px   (tablet)
md: 768px   (tablet landscape)
lg: 1024px  (desktop)
xl: 1280px  (large desktop)
```

### Grid Adaptativo

```tsx
// 1 columna en mobile, 2 en tablet, 4 en desktop
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4

// 1 columna en mobile, 2 en desktop
grid grid-cols-1 lg:grid-cols-2
```

---

## 🔄 Animaciones y Transiciones

### Micro-interacciones

```css
/* Hover effects */
transition-colors duration-200

/* Expand/collapse */
transition-all duration-300

/* Loading states */
animate-pulse
```

### Loading States

```tsx
// Skeleton loaders
<div className="animate-pulse bg-slate-200 h-10 rounded" />

// Spinners
<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
```

---

## ✅ Checklist de Implementación

### Fase 1: Setup (Completado ✓)
- [x] Página `/crm/setup`
- [x] Tab: CRM Connections
- [x] Tab: Data Sources
- [x] Tab: Automation Rules
- [x] OAuth placeholders

### Fase 2: Dashboard (Completado ✓)
- [x] Stats grid
- [x] Recent events feed
- [x] CRM actions feed
- [x] Chart placeholder

### Fase 3: Approvals (Completado ✓)
- [x] Stats bar
- [x] Pending actions list
- [x] Expandible change details
- [x] Approve/reject buttons
- [x] Risk badges
- [x] Confidence scores

### Fase 4: Componentes (Completado ✓)
- [x] StatCard component
- [x] EventCard component
- [x] ActionCard component

### Fase 5: Integración (Pendiente)
- [ ] Conectar con Supabase
- [ ] Implementar OAuth real (HubSpot)
- [ ] WebSocket para updates en tiempo real
- [ ] Integración con backend de cápsulas

---

## 🚀 Próximos Pasos

### Mejoras de UI

1. **Gráficos Interactivos**
   - Chart.js o Recharts para activity trends
   - Visualización de pipeline
   - Heatmap de actividad por hora

2. **Notificaciones en Tiempo Real**
   - Toast notifications
   - Badge counts en navegación
   - Sound alerts (opcional)

3. **Filtros y Búsqueda**
   - Filtrar eventos por tipo/fuente
   - Búsqueda full-text
   - Date range picker

4. **Bulk Actions**
   - Select multiple approvals
   - Approve all low-risk
   - Batch reject

5. **Dark Mode**
   - Toggle en header
   - Persistencia en localStorage

---

## 📞 Referencias

### Archivos de UI
- `/app/crm/setup/page.tsx` - Setup page
- `/app/crm/dashboard/page.tsx` - Dashboard
- `/app/crm/approvals/page.tsx` - Approvals
- `/components/crm/StatCard.tsx` - Stat component
- `/components/crm/EventCard.tsx` - Event component
- `/components/crm/ActionCard.tsx` - Action component

### Documentación de Arquitectura
- `/AMBIENT_AGENT_CRM_ARCHITECTURE.md` - Backend architecture

---

**Última actualización:** Octubre 2025
**Versión:** 1.0.0
**Estado:** UI Completada - Ready for backend integration
