# 🤖 HubLab Ambient Agent CRM - Arquitectura Completa

**Fecha:** Octubre 2025
**Versión:** 1.0.0
**Estado:** Diseño arquitectónico

---

## 🎯 Visión General

HubLab evoluciona de un marketplace de bloques a un **Ambient Agent CRM** que:
- Observa múltiples fuentes de datos (Gmail, Calendar, Slack, llamadas)
- Razona automáticamente qué cambios hacer
- Actualiza CRMs existentes (HubSpot, Salesforce, Pipedrive, Zoho) vía API/MCP
- Opera con el framework de **Cápsulas** como arquitectura modular

### Propuesta de Valor

**No reemplazamos tu CRM** → Lo hacemos inteligente y automático.

---

## 🏗️ Arquitectura Global

```
┌─────────────────────────────────────────────────────────────────┐
│                    FUENTES DE DATOS (Watchers)                  │
├─────────────┬─────────────┬─────────────┬─────────────────────┤
│   Gmail     │  Calendar   │    Slack    │  Llamadas/Zoom      │
│   Outlook   │  Meet/Zoom  │   Teams     │  Transcripts        │
└─────────────┴─────────────┴─────────────┴─────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────────┐
│              CÁPSULA: Event Collector & Normalizer              │
│  - Normaliza formatos                                           │
│  - Dedupe con fingerprints                                      │
│  - Idempotencia con event_id                                    │
└─────────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────────┐
│                  EVENT BUS (Postgres NOTIFY)                    │
│  Cola de eventos: LeadEvent, MeetingEvent, EmailEvent          │
└─────────────────────────────────────────────────────────────────┘
                               ↓
        ┌──────────────────────┴──────────────────────┐
        ↓                                              ↓
┌──────────────────────┐                  ┌──────────────────────┐
│  CÁPSULA: Classifier │                  │  CÁPSULA: Guardrails │
│  Intent Detection    │                  │  Policy Engine       │
│  - Rules             │                  │  - Field allowlist   │
│  - LLM (optional)    │                  │  - Validation        │
└──────────────────────┘                  └──────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────────┐
│               CÁPSULA: Reasoning Engine (LLM)                   │
│  - Extrae: contacto, empresa, deal amount, next step            │
│  - Solo cuando reglas no son suficientes                        │
│  - MLX local (Apple Silicon) + fallback API                     │
└─────────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────────┐
│              ORQUESTADOR MCP (Servidor Hospedado)               │
│  Herramientas expuestas:                                        │
│  - crm.upsert_contact                                           │
│  - crm.update_deal_stage                                        │
│  - crm.log_activity                                             │
│  - email.search, calendar.list, notes.store                     │
└─────────────────────────────────────────────────────────────────┘
                               ↓
        ┌──────────────────────┴──────────────────────┐
        ↓                                              ↓
┌──────────────────────┐                  ┌──────────────────────┐
│  Human-in-the-loop   │                  │  Direct Auto-update  │
│  Slack approval      │                  │  Silent mode         │
│  1-click confirm     │                  │  High confidence     │
└──────────────────────┘                  └──────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────────┐
│           CONECTORES CRM (OAuth + API)                          │
│  - HubSpot (primer MVP)                                         │
│  - Salesforce                                                   │
│  - Pipedrive                                                    │
│  - Zoho CRM                                                     │
└─────────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────────┐
│                    AUDIT LOG & OBSERVABILITY                    │
│  - Cada cambio: quién/qué/cuándo/por qué                        │
│  - Rollback capability                                          │
│  - Compliance (GDPR, PII)                                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📦 Sistema de Cápsulas

### ¿Qué es una Cápsula?

Una **cápsula** es un módulo autocontenido que:
- Tiene una responsabilidad única (watcher, normalizer, classifier, etc.)
- Define un schema de entrada/salida
- Es composable con otras cápsulas
- Se puede activar/desactivar dinámicamente

### Cápsulas Core del Sistema

#### 1. **watcher-gmail** (Observador de Gmail)
```typescript
{
  name: "watcher-gmail",
  type: "watcher",
  inputs: {
    gmail_oauth_token: string,
    labels_to_watch: string[],  // ["sales", "leads"]
    poll_interval: number        // segundos
  },
  outputs: {
    events: EmailEvent[]
  },
  schema: {
    EmailEvent: {
      event_id: string,
      thread_id: string,
      from: { email, name },
      to: [],
      subject: string,
      body: string,
      attachments: [],
      labels: [],
      timestamp: ISO8601
    }
  }
}
```

**Funcionalidad:**
- Polling de Gmail API cada N segundos
- Filtra por labels configurados
- Emite `EmailEvent` al event bus
- Mantiene cursor de última sincronización

---

#### 2. **watcher-calendar** (Observador de Calendar)
```typescript
{
  name: "watcher-calendar",
  type: "watcher",
  inputs: {
    calendar_oauth_token: string,
    calendars_to_watch: string[]
  },
  outputs: {
    events: MeetingEvent[]
  },
  schema: {
    MeetingEvent: {
      event_id: string,
      meeting_id: string,
      title: string,
      attendees: [],
      start_time: ISO8601,
      end_time: ISO8601,
      status: "scheduled|completed|cancelled",
      notes: string,
      transcript_url?: string
    }
  }
}
```

**Funcionalidad:**
- Webhook de Google Calendar / Outlook
- Detecta: scheduled, started, ended, cancelled
- Extrae notas y transcripts (si hay)
- Emite `MeetingEvent`

---

#### 3. **normalizer** (Normalizador y Dedupe)
```typescript
{
  name: "normalizer",
  type: "processor",
  inputs: {
    events: Event[]  // Cualquier tipo de evento
  },
  outputs: {
    normalized_events: NormalizedEvent[]
  },
  logic: {
    dedupe: {
      method: "fingerprint",
      fields: ["event_id", "timestamp", "content_hash"]
    },
    normalization: {
      contacts: "extract_emails_and_names",
      companies: "extract_domains_and_names",
      dates: "parse_to_iso8601"
    }
  }
}
```

**Funcionalidad:**
- Dedupe con fingerprints
- Normaliza formatos (fechas, nombres, emails)
- Extrae entidades clave (contactos, empresas)

---

#### 4. **intent-classifier** (Clasificador de Intenciones)
```typescript
{
  name: "intent-classifier",
  type: "classifier",
  inputs: {
    normalized_event: NormalizedEvent
  },
  outputs: {
    intent: "create_lead" | "update_deal" | "log_activity" | "schedule_task" | "no_action"
    confidence: number,  // 0-1
    extracted_data: {
      contact?: Contact,
      company?: Company,
      deal?: Deal,
      next_action?: Task
    }
  },
  modes: {
    rules: "fast_heuristics",
    llm: "fallback_if_confidence_low"
  }
}
```

**Reglas rápidas:**
- "meeting ended" + "next step = demo" → intent: update_deal_stage
- "email with PO attachment" → intent: create_deal
- "no-show detected" → intent: schedule_task

**LLM (fallback):**
- Cuando reglas no aplican
- Extrae información missing
- Genera justificación

---

#### 5. **reason-llm** (Motor de Razonamiento LLM)
```typescript
{
  name: "reason-llm",
  type: "reasoner",
  inputs: {
    event: NormalizedEvent,
    context: CRMContext  // Datos previos del CRM
  },
  outputs: {
    actions: CRMAction[],
    justification: string
  },
  models: {
    local: "mlx/qwen2.5-7b",
    fallback: "anthropic/claude-3-haiku"
  }
}
```

**Prompt template:**
```
Given this event:
{event}

And this CRM context:
{context}

Determine what CRM actions to take. Extract:
- Contact info (name, email, phone)
- Company info (name, domain, size)
- Deal info (stage, amount, close date)
- Next action (task, call, email)

Output format: JSON
```

---

#### 6. **policy-guardrails** (Guardrails y Políticas)
```typescript
{
  name: "policy-guardrails",
  type: "validator",
  inputs: {
    proposed_actions: CRMAction[]
  },
  outputs: {
    validated_actions: CRMAction[],
    rejected: { action, reason }[]
  },
  config: {
    field_allowlist: [
      "contacts.email",
      "contacts.name",
      "deals.stage",
      "deals.amount",
      "activities.notes"
    ],
    field_blocklist: [
      "contacts.password",
      "deals.internal_notes"
    ],
    validation_rules: [
      { field: "deals.amount", rule: "must_be_positive" },
      { field: "contacts.email", rule: "must_be_valid_email" }
    ]
  }
}
```

---

#### 7. **mcp-orchestrator** (Orquestador MCP)
```typescript
{
  name: "mcp-orchestrator",
  type: "orchestrator",
  inputs: {
    actions: CRMAction[]
  },
  outputs: {
    results: ActionResult[]
  },
  tools: [
    "crm.upsert_contact",
    "crm.upsert_company",
    "crm.update_deal_stage",
    "crm.create_deal",
    "crm.log_activity",
    "crm.create_task"
  ],
  server: "mcp://hublab.dev/mcp-server"
}
```

**Herramientas MCP:**
```json
{
  "crm.upsert_contact": {
    "params": {
      "crm_type": "hubspot|salesforce|pipedrive",
      "contact": {
        "email": "required",
        "name": "optional",
        "phone": "optional"
      }
    },
    "returns": {
      "contact_id": "string",
      "status": "created|updated"
    }
  },
  "crm.update_deal_stage": {
    "params": {
      "deal_id": "string",
      "new_stage": "string"
    }
  }
}
```

---

#### 8. **crm-hubspot** (Conector HubSpot)
```typescript
{
  name: "crm-hubspot",
  type: "connector",
  auth: {
    method: "oauth2",
    scopes: [
      "crm.objects.contacts.read",
      "crm.objects.contacts.write",
      "crm.objects.companies.read",
      "crm.objects.companies.write",
      "crm.objects.deals.read",
      "crm.objects.deals.write"
    ]
  },
  api: {
    base_url: "https://api.hubapi.com",
    rate_limit: {
      requests_per_second: 10,
      daily_limit: 250000
    }
  },
  mappings: {
    contact: {
      email: "properties.email",
      firstname: "properties.firstname",
      lastname: "properties.lastname",
      phone: "properties.phone"
    },
    deal: {
      dealname: "properties.dealname",
      amount: "properties.amount",
      dealstage: "properties.dealstage",
      closedate: "properties.closedate"
    }
  }
}
```

---

#### 9. **crm-salesforce** (Conector Salesforce)
```typescript
{
  name: "crm-salesforce",
  type: "connector",
  auth: {
    method: "oauth2",
    instance_url: "dynamic",  // Por cliente
    api_version: "v58.0"
  },
  mappings: {
    Contact: {
      Email: "Email",
      FirstName: "FirstName",
      LastName: "LastName",
      Phone: "Phone"
    },
    Opportunity: {
      Name: "Name",
      Amount: "Amount",
      StageName: "StageName",
      CloseDate: "CloseDate"
    }
  }
}
```

---

#### 10. **audit-trail** (Registro de Auditoría)
```typescript
{
  name: "audit-trail",
  type: "logger",
  inputs: {
    action: CRMAction,
    result: ActionResult
  },
  outputs: {
    audit_record: AuditLog
  },
  schema: {
    AuditLog: {
      id: uuid,
      timestamp: ISO8601,
      user_id: string,
      action_type: string,
      crm_type: string,
      resource_type: "contact|deal|activity",
      resource_id: string,
      changes: {
        before: object,
        after: object
      },
      justification: string,
      event_id: string  // Trazabilidad al evento original
    }
  },
  retention: {
    default: "90_days",
    enterprise: "1_year"
  }
}
```

---

## 🗄️ Base de Datos (Supabase)

### Nuevas Tablas para Ambient Agent

#### 1. `crm_connections`
```sql
CREATE TABLE crm_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  crm_type TEXT NOT NULL,  -- 'hubspot', 'salesforce', 'pipedrive'
  oauth_token TEXT NOT NULL,  -- Encrypted
  refresh_token TEXT,
  instance_url TEXT,  -- Para Salesforce
  field_mappings JSONB,  -- Mapeos configurables
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 2. `events`
```sql
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  event_id TEXT UNIQUE NOT NULL,  -- Idempotencia
  event_type TEXT NOT NULL,  -- 'email', 'meeting', 'slack_message'
  source TEXT NOT NULL,  -- 'gmail', 'calendar', 'slack'
  raw_data JSONB NOT NULL,
  normalized_data JSONB,
  fingerprint TEXT,  -- Para dedupe
  processed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_events_user_id ON events(user_id);
CREATE INDEX idx_events_event_id ON events(event_id);
CREATE INDEX idx_events_fingerprint ON events(fingerprint);
CREATE INDEX idx_events_processed ON events(processed);
```

#### 3. `crm_actions`
```sql
CREATE TABLE crm_actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  event_id UUID REFERENCES events(id),
  crm_connection_id UUID REFERENCES crm_connections(id),
  action_type TEXT NOT NULL,  -- 'upsert_contact', 'update_deal', etc.
  resource_type TEXT,  -- 'contact', 'deal', 'activity'
  resource_id TEXT,  -- ID en el CRM externo
  payload JSONB NOT NULL,
  status TEXT DEFAULT 'pending',  -- 'pending', 'approved', 'executed', 'failed'
  confidence FLOAT,  -- 0-1
  justification TEXT,
  requires_approval BOOLEAN DEFAULT false,
  approved_by UUID,
  approved_at TIMESTAMP,
  executed_at TIMESTAMP,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_crm_actions_status ON crm_actions(status);
CREATE INDEX idx_crm_actions_requires_approval ON crm_actions(requires_approval);
```

#### 4. `audit_logs`
```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  action_id UUID REFERENCES crm_actions(id),
  event_id UUID REFERENCES events(id),
  crm_type TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT NOT NULL,
  changes JSONB NOT NULL,  -- { before: {...}, after: {...} }
  justification TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
```

#### 5. `capsule_configs`
```sql
CREATE TABLE capsule_configs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  capsule_name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  config JSONB NOT NULL,  -- Configuración específica de la cápsula
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, capsule_name)
);
```

---

## 🔄 Flujo Completo (Ejemplo)

### Caso de Uso: Post-Reunión con ACME Corp

**Entrada:**
```json
{
  "event_type": "meeting_ended",
  "meeting_id": "google-meet-xyz",
  "title": "Demo ACME Corp",
  "attendees": [
    { "email": "john@acme.com", "name": "John Doe" }
  ],
  "notes": "Great demo! Next step: send proposal by Friday. Deal size ~$50k."
}
```

**Flujo:**

1. **Watcher-Calendar** detecta el meeting ended → Emite `MeetingEvent`

2. **Normalizer** procesa:
   - Extrae contacto: `john@acme.com`
   - Extrae empresa: `acme.com` → "ACME Corp"
   - Extrae deal: `$50k`
   - Extrae next action: "send proposal by Friday"

3. **Intent-Classifier**:
   - Intent: `update_deal_stage` (confidence: 0.95)
   - Intent: `create_task` (confidence: 0.98)
   - Intent: `log_activity` (confidence: 1.0)

4. **Reason-LLM** (opcional, si confidence < 0.9):
   - Confirma extracción
   - Genera justificación

5. **Policy-Guardrails**:
   - Valida que `deals.stage` esté en allowlist
   - Valida que `$50k` sea positivo
   - ✅ Todo OK

6. **Human-in-the-loop**:
   - Si `requires_approval = true` → Envía a Slack
   - Mensaje: "Update ACME deal to 'Demo Completed' + create task?"
   - User click "Approve" ✅

7. **MCP-Orchestrator**:
   - Llama `crm.update_deal_stage(deal_id, "Demo Completed")`
   - Llama `crm.create_task(title: "Send proposal", due: "Friday")`
   - Llama `crm.log_activity(type: "meeting", notes: "...")`

8. **CRM-HubSpot**:
   - Ejecuta 3 API calls a HubSpot
   - Retorna success

9. **Audit-Trail**:
   - Registra 3 cambios en `audit_logs`
   - Trazabilidad completa

**Output (Slack notification):**
```
✅ ACME Corp updated:
- Deal stage: Demo Completed
- Task created: Send proposal (due: Friday)
- Meeting notes logged

View in HubSpot →
```

---

## 🚀 Roadmap de Implementación (2 semanas)

### **Día 1-2: Fundamentos**
- ✅ Crear tablas DB (`crm_connections`, `events`, `crm_actions`, `audit_logs`)
- ✅ OAuth para HubSpot (primer CRM)
- ✅ Página de configuración en HubLab (`/crm/setup`)

### **Día 3-4: Watchers**
- ✅ Implementar `watcher-gmail` (Gmail API + polling)
- ✅ Implementar `watcher-calendar` (Google Calendar webhooks)
- ✅ Event bus básico (Postgres NOTIFY)

### **Día 5-6: Procesamiento**
- ✅ Cápsula `normalizer` (dedupe + extract entities)
- ✅ Cápsula `intent-classifier` (reglas básicas)
- ✅ Audit trail básico

### **Día 7-8: CRM Integration**
- ✅ Conector HubSpot (`upsert_contact`, `log_activity`)
- ✅ Dry-run mode (testing sin tocar CRM real)
- ✅ Cliente demo con datos fake

### **Día 9-10: Deal Management**
- ✅ `update_deal_stage`
- ✅ `create_task` con fecha
- ✅ Reglas avanzadas (post-meeting, email con PO)

### **Día 11-12: Human-in-the-loop**
- ✅ Integración Slack para aprobaciones
- ✅ Modo "auto" vs "manual approval"
- ✅ Dashboard de actions pending

### **Día 13-14: Hardening**
- ✅ Retries con backoff
- ✅ Rate limiting
- ✅ Error handling robusto
- ✅ Métricas y dashboards (Grafana)
- ✅ Testing E2E

---

## 💰 Modelo de Negocio

### Planes

#### **Starter** (€49/usuario/mes)
- 2 conectores (Gmail + Calendar)
- 1 CRM (HubSpot o Salesforce)
- 3 reglas personalizables
- Audit log 30 días
- Email support

#### **Pro** (€149/usuario/mes)
- 5 conectores (Gmail, Calendar, Slack, Outlook, Zoom)
- 2 CRMs simultáneos
- Reglas ilimitadas
- Auto-update sin aprobación
- Audit log 90 días
- LLM reasoning avanzado
- Chat support

#### **Enterprise** (Custom)
- Conectores ilimitados
- CRMs ilimitados
- SSO (SAML)
- Data residency (EU)
- SOC2 compliance
- Audit log 1 año
- SLA 99.9%
- Dedicated support

### Proyección de Ingresos

**Mes 3:**
- 20 empresas × 5 usuarios promedio × €49 = €4,900/mes

**Mes 6:**
- 50 empresas × 5 usuarios × €99 (mix Starter/Pro) = €24,750/mes

**Año 1:**
- 200 empresas × 8 usuarios × €120 promedio = €192,000/mes

---

## 🔐 Seguridad y Cumplimiento

### OAuth y Tokens
- Tokens encriptados en DB (AES-256)
- Refresh automático antes de expiración
- Revocación inmediata si se detecta compromiso

### PII y GDPR
- Field-level allowlist por cliente
- Right to be forgotten (delete cascade)
- Data residency configurable (EU, US)
- Audit log inmutable

### Idempotencia
- `event_id` único por evento
- Fingerprints para dedupe
- No duplicar acciones si mismo evento llega 2 veces

### Rate Limiting
- Por CRM (respeta sus límites)
- Por usuario (evita abuse)
- Exponential backoff en errores

---

## 📊 Métricas y Observabilidad

### KPIs
- **Events/day**: Eventos procesados
- **Actions/day**: Cambios en CRM
- **Auto-approval rate**: % sin human intervention
- **Error rate**: % de actions fallidas
- **Latency p95**: Tiempo desde evento hasta actualización CRM

### Dashboards
- Grafana con métricas en tiempo real
- Alertas por Slack/PagerDuty
- Log aggregation con Loki

### SLAs
- **p95 < 60s** para cambios post-meeting
- **p95 < 30s** para logs de actividad
- **99% success rate** en CRM updates

---

## 🎓 Preguntas Clave

### ¿HubSpot o Salesforce primero?

**Recomendación: HubSpot**

**Razones:**
1. API más sencilla y documentación mejor
2. Free tier generoso para testing
3. OAuth flow más directo
4. Mercado más amplio (SMBs)
5. Rate limits menos restrictivos

**Salesforce después** (Semana 3-4):
- Enterprise focus
- API más compleja
- Multi-tenant architecture
- Custom objects

---

## 📚 Recursos y Referencias

### APIs a Integrar
- [HubSpot API](https://developers.hubspot.com/docs/api/overview)
- [Salesforce REST API](https://developer.salesforce.com/docs/apis)
- [Gmail API](https://developers.google.com/gmail/api)
- [Google Calendar API](https://developers.google.com/calendar/api)
- [Slack API](https://api.slack.com/)

### MCP
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [MCP Servers](https://github.com/modelcontextprotocol/servers)

### Tech Stack
- **Frontend:** Next.js 14 (ya en HubLab)
- **Backend:** Supabase + Edge Functions
- **Queue:** Postgres NOTIFY + pg_notify
- **LLM:** MLX (local) + Anthropic Claude (fallback)
- **Monitoring:** Grafana + Prometheus

---

## 🎉 Conclusión

Este documento define la arquitectura completa del **HubLab Ambient Agent CRM**. El sistema es:
- ✅ Modular (cápsulas independientes)
- ✅ Escalable (Supabase + Edge)
- ✅ Seguro (OAuth, encryption, audit)
- ✅ Plug-and-play (no reemplaza CRM existente)
- ✅ EU-compliant (GDPR ready)

**Próximo paso:** Comenzar implementación con HubSpot como primer conector.

---

**Versión:** 1.0.0
**Fecha:** Octubre 2025
**Autor:** HubLab Team
