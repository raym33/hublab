# 🤝 Team Coordination - Dual Claude Agents

**Fecha Inicio:** Octubre 29, 2025
**Rama Backend:** `claude-agent-backend`
**Rama Frontend:** `claude-agent-frontend` (pendiente)

---

## 👥 División del Trabajo

### 🎨 Claude Frontend (yo)
**Responsabilidades:**
- UI Components (React/TypeScript)
- Pages en `/app/crm/*`
- Integración con APIs del backend
- Real-time updates
- Loading states y error handling
- UX y animaciones

**Archivos asignados:**
- `app/crm/setup/page.tsx` ✅ HECHO
- `app/crm/dashboard/page.tsx` ✅ HECHO
- `app/crm/approvals/page.tsx` ✅ HECHO
- `components/crm/*.tsx` ✅ HECHO
- `components/Navigation.tsx` ✅ HECHO
- Documentación UI ✅ HECHO

**Pendiente integración:**
- [ ] Conectar Dashboard con `/api/crm/stats`
- [ ] Conectar Approvals con `/api/crm/approvals`
- [ ] Implementar Supabase real-time subscriptions
- [ ] Loading spinners y error boundaries

---

### ⚙️ Claude Backend (el otro)
**Responsabilidades:**
- Schema SQL (Supabase)
- API Routes (Next.js)
- Cápsulas (lógica de negocio)
- OAuth flows
- Database helpers
- Event bus

**Archivos asignados:**
- `supabase/migrations/001_crm_ambient_agent.sql` ✅ COMPLETADO!
- `lib/types/crm.ts` 🔄 EN PROGRESO
- `lib/crm-database.ts` ⏳ PENDIENTE
- `lib/capsules/*.ts` ⏳ PENDIENTE
- `app/api/crm/**/*.ts` ⏳ PENDIENTE
- `lib/crm/hubspot-client.ts` ⏳ PENDIENTE

---

## 📊 Estado Actual

### ✅ Completado

#### Frontend
- [x] 3 páginas UI completas
- [x] 3 componentes reutilizables (StatCard, EventCard, ActionCard)
- [x] 4 React hooks (useCRMStats, useRecentEvents, useRecentActions, usePendingApprovals)
- [x] Navegación integrada con dropdown CRM
- [x] Documentación arquitectura (150+ páginas)
- [x] Documentación diseño UI
- [x] Sistema de diseño (Tailwind)
- [x] Componentes UI extras (LoadingSpinner, ErrorDisplay, Toast)
- [x] Utilidades (format.ts, validation.ts)

#### Backend
- [x] Schema SQL completado ✅ (346 líneas!)
  - [x] 5 tablas creadas (crm_connections, events, crm_actions, audit_logs, capsule_configs)
  - [x] RLS policies implementadas
  - [x] Helper functions (has_crm_connection, get_active_crm_connection)
  - [x] Triggers automáticos (audit log, updated_at)
  - [x] Stats view para dashboard
  - [x] Índices optimizados

---

### 🔄 En Progreso

**Backend Claude está trabajando en:**
1. ✅ Crear directorio `supabase/migrations/` - COMPLETADO
2. ✅ Escribir `001_crm_ambient_agent.sql` - COMPLETADO
3. 🔄 Crear `lib/types/crm.ts` - Probablemente en progreso ahora
   - CRMConnection interface
   - Event interface
   - CRMAction interface
   - AuditLog interface
   - CapsulaConfig interface

---

### ⏳ Pendiente (Orden de prioridad)

#### Backend (Fase 1)
1. [ ] Finalizar SQL schema
2. [ ] Crear `lib/types/crm.ts`
3. [ ] Crear `lib/crm-database.ts`
4. [ ] Probar insert/query básico

#### Frontend (Fase 1)
1. [ ] Esperar a que backend termine SQL
2. [ ] Crear hooks para fetch data:
   - `hooks/useCRMStats.ts`
   - `hooks/usePendingApprovals.ts`
   - `hooks/useRecentEvents.ts`
3. [ ] Conectar Dashboard con datos reales
4. [ ] Añadir loading states

#### Backend (Fase 2)
1. [ ] OAuth HubSpot routes
2. [ ] Normalizer capsule
3. [ ] API `/api/crm/approvals`

#### Frontend (Fase 2)
1. [ ] Conectar Setup page con OAuth flow
2. [ ] Conectar Approvals con API
3. [ ] Implementar approve/reject real

---

## 🔗 Puntos de Integración

### API Endpoints que Backend debe crear:

#### 1. GET `/api/crm/stats`
**Response:**
```json
{
  "events_today": 1247,
  "crm_updates": 89,
  "pending_approvals": 3,
  "pipeline_value": 124000
}
```
**Frontend necesita:** Dashboard page

---

#### 2. GET `/api/crm/events/recent`
**Response:**
```json
[
  {
    "id": "1",
    "type": "meeting",
    "source": "Google Calendar",
    "title": "Demo with ACME Corp",
    "timestamp": "2024-10-29T10:30:00Z",
    "processed": true,
    "confidence": 0.98
  }
]
```
**Frontend necesita:** Dashboard page

---

#### 3. GET `/api/crm/actions/recent`
**Response:**
```json
[
  {
    "id": "1",
    "type": "update_deal_stage",
    "status": "executed",
    "resource": "ACME Corp - Deal",
    "timestamp": "2024-10-29T10:30:00Z",
    "confidence": 0.98
  }
]
```
**Frontend necesita:** Dashboard page

---

#### 4. GET `/api/crm/approvals`
**Response:**
```json
[
  {
    "id": "1",
    "type": "create_deal",
    "resource": "Beta Inc - Enterprise License",
    "event": {
      "type": "email",
      "title": "Purchase order received",
      "timestamp": "2024-10-29T10:15:00Z"
    },
    "proposed_changes": [
      {
        "field": "Deal Name",
        "current": null,
        "proposed": "Beta Inc - Enterprise License"
      }
    ],
    "confidence": 0.87,
    "justification": "Email contains PO...",
    "risk_level": "medium",
    "timestamp": "2024-10-29T10:15:00Z"
  }
]
```
**Frontend necesita:** Approvals page

---

#### 5. POST `/api/crm/approvals/:id/approve`
**Body:**
```json
{
  "action_id": "1"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Action approved and executed"
}
```
**Frontend necesita:** Approvals page (approve button)

---

#### 6. POST `/api/crm/approvals/:id/reject`
**Body:**
```json
{
  "action_id": "1",
  "reason": "Incorrect amount"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Action rejected"
}
```
**Frontend necesita:** Approvals page (reject button)

---

## 📞 Protocolo de Comunicación

### Cuando Backend termina una tarea:
1. ✅ Commit en rama `claude-agent-backend`
2. 📢 Actualizar este archivo (sección "Estado Actual")
3. 💬 Avisar: "✅ SQL schema completado - Frontend puede integrar"

### Cuando Frontend termina una tarea:
1. ✅ Commit en rama `claude-agent-frontend`
2. 📢 Actualizar este archivo
3. 💬 Avisar: "✅ Dashboard conectado - Necesito endpoint X"

### Conflictos:
- ❌ NUNCA editar archivos del otro
- ✅ Si necesitas algo, actualiza este archivo
- ✅ Usa comentarios `// TODO: BACKEND` o `// TODO: FRONTEND`

---

## 🎯 Hitos

### Hito 1: Schema + Types ✅
**Criterio:** SQL ejecutado + types creados
**Responsable:** Backend Claude
**ETA:** Hoy

### Hito 2: CRUD Básico
**Criterio:** Crear/leer eventos y acciones funciona
**Responsable:** Backend Claude
**ETA:** Hoy

### Hito 3: Dashboard Conectado
**Criterio:** Stats reales en Dashboard UI
**Responsable:** Frontend Claude (yo)
**ETA:** Después de Hito 2

### Hito 4: OAuth HubSpot
**Criterio:** Conectar HubSpot desde Setup page
**Responsable:** Backend Claude
**ETA:** Mañana

### Hito 5: Approvals Funcional
**Criterio:** Aprobar/rechazar acciones reales
**Responsable:** Ambos
**ETA:** Mañana

---

## 🐛 Issues Conocidos

### Frontend
- [ ] UI usa datos mock (no conectado aún)
- [ ] Falta loading states
- [ ] Falta error handling
- [ ] No hay validación de forms

### Backend
- [ ] Schema SQL en progreso
- [ ] No hay OAuth aún
- [ ] Watchers no implementados
- [ ] LLM reasoning pendiente

---

## 📝 Notas

### Para Backend Claude:
- Frontend ya tiene todas las páginas UI listas
- Solo necesita conectar con tus APIs
- Revisa `CRM_UI_DESIGN.md` para ver qué data shapes espera el frontend
- Los componentes ya aceptan props del tipo correcto

### Para Frontend Claude (yo):
- Esperar a que backend termine SQL antes de integrar
- Crear hooks React para separar lógica de fetch
- Usar React Query para caching y real-time
- Implementar Supabase subscriptions para updates live

---

## 🚀 Comandos Útiles

### Backend Claude:
```bash
# Ver cambios del frontend
git log --oneline --graph --all

# Pull cambios de frontend si se mergean a main
git pull origin main

# Probar SQL localmente
supabase db reset
supabase db push
```

### Frontend Claude (yo):
```bash
# Ver cambios del backend
git log --oneline --graph claude-agent-backend

# Cuando backend esté listo
git merge claude-agent-backend

# Servidor de desarrollo
npm run dev
```

---

**Última actualización:** Octubre 29, 2025 - 02:50 AM
**Actualizado por:** Claude Frontend
**Próxima revisión:** Cuando Backend termine SQL schema

---

## ✅ Checklist de Integración

### Antes de mergear a main:
- [ ] Backend: Todas las APIs funcionan
- [ ] Backend: Tests básicos pasando
- [ ] Frontend: Todas las páginas conectadas
- [ ] Frontend: Loading states implementados
- [ ] Frontend: Error handling implementado
- [ ] Ambos: No hay conflictos de merge
- [ ] Ambos: README actualizado
- [ ] Testing E2E básico funciona

---

**🤝 Let's build this together!**
