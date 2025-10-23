# 🏗️ Arquitectura de HubLab

Entendimiento técnico profundo de cómo está construido HubLab.

## 🎯 Visión General

HubLab es una aplicación web moderna con arquitectura separada en:
- **Frontend**: Next.js 14 con SSR y componentes React
- **Backend**: Supabase (PostgreSQL + Auth)
- **Storage**: Supabase Storage o AWS S3
- **Pagos**: Stripe

```
┌─────────────────────────────────────────────────────────────┐
│                      USUARIO FINAL                          │
└────────────────────────┬────────────────────────────────────┘
                         │
                    ┌────▼────┐
                    │ Vercel   │ (Hosting)
                    │ (Next.js)│
                    └────┬─────┘
        ┌───────────────┼───────────────┐
        │               │               │
   ┌────▼────┐  ┌──────▼──────┐  ┌────▼────┐
   │ Supabase │  │  Stripe     │  │ Storage  │
   │ (Auth+DB)│  │  (Payments) │  │ (Files)  │
   └──────────┘  └─────────────┘  └──────────┘
```

## 📂 Estructura de Carpetas

```
hublab/
├── app/                          ← Rutas y páginas Next.js
│   ├── (marketplace)
│   │   ├── page.tsx              ← Home / Marketplace
│   │   └── prototype/[id]/page.tsx ← Detalle
│   │
│   ├── (auth)
│   │   ├── login/page.tsx        ← Login / Sign up
│   │   └── auth/callback/        ← OAuth callback
│   │
│   ├── (seller)
│   │   └── upload/page.tsx       ← Subir prototipo
│   │
│   ├── api/                      ← API Routes
│   │   └── checkout/route.ts     ← Stripe checkout
│   │
│   ├── layout.tsx                ← Layout global
│   ├── globals.css               ← Estilos globales
│   └── page.tsx                  ← Home
│
├── components/
│   └── Navigation.tsx            ← Navbar con auth
│
├── lib/
│   └── supabase.ts               ← Cliente DB + types
│
├── public/                        ← Assets estáticos
│
├── supabase-setup.sql            ← SQL de tablas
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── next.config.js
├── .env.example
└── .gitignore
```

## 🔄 Flujos Principales

### 1. Flujo de Autenticación

```
Login Page
    ↓
  Email/Password o Google OAuth
    ↓
Supabase Auth Endpoint
    ↓
  Session creada
    ↓
  Redirect a Home
    ↓
Navigation detecta sesión
    ↓
Botón de "Vender" aparece
```

**Código relevante:**
- `app/login/page.tsx`: Formulario de login
- `lib/supabase.ts`: `getCurrentUser()`
- `components/Navigation.tsx`: Detecta sesión

---

### 2. Flujo de Upload de Prototipo

```
Upload Page
    ↓
Llenar formulario
  (titulo, description, price,
   tech_stack, files)
    ↓
  Validar inputs
    ↓
Upload archivos a Storage
  (preview image → previews bucket)
  (zip file → prototypes bucket)
    ↓
Guardar metadata en DB
  (INSERT en tabla prototypes)
    ↓
Crear purchase record (si es admin)
    ↓
Redirect a /prototype/[id]
```

**Código relevante:**
- `app/upload/page.tsx`: Formulario
- `lib/supabase.ts`: `uploadFile()`, `createPrototype()`
- `supabase-setup.sql`: Tabla `prototypes`

---

### 3. Flujo de Compra

```
Marketplace
    ↓
Click en prototipo
    ↓
Detalle page carga
    ↓
User logeado?
  ├─ No: Mostrar "Login para comprar"
  └─ Si: Continuar
    ↓
Click "Comprar"
    ↓
POST /api/checkout
  {prototypeId, price}
    ↓
Crear Stripe Session
    ↓
Guardar Purchase record (status: pending)
    ↓
Redirect a Stripe Checkout
    ↓
User paga
    ↓
Redirect a Success
    ↓
Update Purchase status → completed
    ↓
User puede descargar
```

**Código relevante:**
- `app/prototype/[id]/page.tsx`: Botón de compra
- `app/api/checkout/route.ts`: Crear sesión Stripe
- `lib/supabase.ts`: `createPurchase()`, `checkUserPurchase()`

---

## 📊 Base de Datos

### Schema (Tablas)

#### 1. `profiles`
Extend del `auth.users` de Supabase

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

**Usos:**
- Guardar info adicional del usuario
- Mostrar nombre/avatar en prototipos
- Crear perfil público del vendedor

---

#### 2. `prototypes`
Los productos/apps del marketplace

```sql
CREATE TABLE prototypes (
  id UUID PRIMARY KEY,
  creator_id UUID REFERENCES auth.users,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL NOT NULL,
  category TEXT,
  tech_stack TEXT[],
  preview_image_url TEXT,
  file_url TEXT,
  downloads_count INTEGER,
  rating DECIMAL,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  published BOOLEAN
);
```

**Campos:**
- `creator_id`: Quién lo subió
- `price`: Precio en USD
- `tech_stack`: Array de tecnologías (React, Next.js, etc)
- `file_url`: Ruta en Storage bucket
- `published`: Si es visible en marketplace

**Índices:**
- `creator_id`: Para queries de vendedor
- `category`: Para filtros
- `created_at`: Para ordenamiento

---

#### 3. `purchases`
Historial de compras

```sql
CREATE TABLE purchases (
  id UUID PRIMARY KEY,
  buyer_id UUID REFERENCES auth.users,
  prototype_id UUID REFERENCES prototypes,
  stripe_checkout_id TEXT UNIQUE,
  amount DECIMAL,
  status TEXT, -- pending|completed|failed
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

**Usos:**
- Trackear quién compró qué
- Permitir descarga solo a compradores
- Análisis de ventas

**Estados:**
- `pending`: Sesión creada, esperando pago
- `completed`: Pago exitoso
- `failed`: Pago fallido

---

#### 4. `reviews`
Reseñas de prototipos (futuro)

```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY,
  prototype_id UUID REFERENCES prototypes,
  reviewer_id UUID REFERENCES auth.users,
  rating INTEGER (1-5),
  comment TEXT,
  created_at TIMESTAMP
);
```

---

### RLS (Row Level Security)

Todas las tablas tienen RLS habilitado. Esto significa que la DB controla quién puede ver/editar qué.

**Ejemplo - `prototypes`:**
```sql
-- Todos pueden ver prototipos publicados
CREATE POLICY "Published visible to all" ON prototypes
  FOR SELECT USING (published = true);

-- Solo el creador puede ver sus borradores
CREATE POLICY "Unpublished visible to creator" ON prototypes
  FOR SELECT USING (auth.uid() = creator_id);

-- Solo el creador puede actualizar
CREATE POLICY "Creator can update" ON prototypes
  FOR UPDATE USING (auth.uid() = creator_id);
```

**Beneficios:**
- No necesitas validar en backend
- Imposible que un usuario acceda datos de otros
- Automático y seguro

---

## 🔐 Flujo de Seguridad

### Almacenamiento de Contraseñas
```
Usuario escribe password
    ↓
Supabase Auth encripta (bcrypt)
    ↓
Nunca se ve la password en texto plano
    ↓
Token JWT para sesiones
```

### Acceso a Archivos
```
User sube archivo
    ↓
Guardado en Storage bucket privado
    ↓
Para descargar, debe estar autenticado
    ↓
RLS verifica que compró
    ↓
URL firmada generada (expira en 1 hora)
    ↓
Download permitido
```

### Pagos
```
User envía datos de tarjeta
    ↓
Enviado DIRECTAMENTE a Stripe
    ↓
Nunca toca nuestro servidor
    ↓
Token seguro devuelto
    ↓
Crear sesión checkout
```

---

## 🌊 Flujos de Datos

### Cargar Marketplace

```
User abre /
    ↓
Next.js renderiza (SSR)
    ↓
getPrototypes() querya Supabase
    ↓
SELECT * FROM prototypes
    WHERE published = true
    ORDER BY created_at DESC
    LIMIT 20
    ↓
Datos devueltos
    ↓
HTML generado en servidor
    ↓
Enviado al navegador
    ↓
React hydration
    ↓
Cliente puede interactuar
```

**Performance:**
- SSR es más rápido (server genera HTML)
- Cliente recibe HTML listo
- Mejor para SEO
- Mejor UX en conexiones lentas

---

### Subir Prototipo

```
User en /upload
    ↓
Completa form
    ↓
Click "Publish"
    ↓
Validar inputs (client side)
  ├─ Título requerido?
  ├─ Precio válido?
  ├─ Tech stack seleccionado?
  └─ Archivos válidos?
    ↓
Upload a Storage (client)
  GET signed URLs de servidor
    ↓
Archivos en bucket (Supabase/S3)
    ↓
Guardar metadata en DB
    ↓
INSERT prototypes record
    ↓
Return new ID
    ↓
Redirect /prototype/[id]
```

---

## 🛒 Flujo de Pago

```
User en /prototype/[id]
    ↓
Click "Comprar"
    ↓
POST /api/checkout
  headers: { Authorization: token }
  body: { prototypeId, price, title }
    ↓
Validar sesión (get user from token)
    ↓
Crear Stripe Checkout Session
  with metadata: { prototypeId }
    ↓
INSERT purchases (status: pending)
    ↓
Return session.url
    ↓
Redirect user a Stripe URL
    ↓
User ve Stripe checkout
    ↓
User entra datos tarjeta
    ↓
Stripe procesa pago
    ↓
Webhook recibido (futuro)
  UPDATE purchases SET status = 'completed'
    ↓
User redirigido a success
    ↓
User puede descargar
```

---

## 📈 Componentes Clave

### `lib/supabase.ts`
Cliente de Supabase. Todos los queries a la base de datos pasan por aquí.

**Funciones principales:**
```typescript
// Auth
getCurrentUser()
getUserProfile(userId)

// Prototypes
getPrototypes(limit, offset)
getPrototypeById(id)
getUserPrototypes(userId)
createPrototype(data)
updatePrototype(id, updates)

// Purchases
getPurchasesByUser(userId)
createPurchase(data)
updatePurchase(id, updates)
checkUserPurchase(userId, prototypeId)

// Storage
uploadFile(bucket, path, file)
getPublicFileUrl(bucket, path)
```

### `components/Navigation.tsx`
Navbar que:
- Detecta sesión del usuario
- Muestra email del user
- Botón de logout
- Links dinámicos (Marketplace, Vender)

### Páginas
```
/                      ← Marketplace (público)
/login                 ← Autenticación
/upload                ← Subir (solo usuarios)
/prototype/[id]        ← Detalle (público)
/api/checkout          ← Pagos (API)
/auth/callback         ← OAuth redirect
```

---

## 🚀 Performance Optimizations

### Frontend
- **SSR**: HTML generado en servidor
- **Code Splitting**: Cada página carga su propio JS
- **Image Optimization**: Next.js Image component
- **CSS Optimization**: Tailwind purge
- **Font Loading**: System fonts (rápido)

### Backend
- **Índices**: En `creator_id`, `category`, `created_at`
- **RLS**: Previene queries innecesarias
- **Connection Pooling**: Supabase maneja automático
- **Caching**: URLs firmadas cacheadas

### Storage
- **Bucket Organization**: `creator_id/timestamp-filename`
- **File Compression**: Usuarios deben comprimir ZIP
- **CDN**: Supabase usa CDN automático

---

## 🔄 Ciclo de Vida de Componentes

### Marketplace (/)

```
1. SERVER SIDE (Next.js)
   getPrototypes() → Supabase query

2. HTML generado con datos

3. CLIENT SIDE (React)
   useEffect() → setState con datos nuevos
   Re-render con animaciones

4. USER INTERACTION
   Search input → filter local state
   Category button → filter local state
   Click en card → next/Link → /prototype/[id]
```

### Prototype Detail ([id])

```
1. SERVER SIDE
   getPrototypeById() → Supabase
   getUser() → Check sesión

2. CLIENT SIDE
   useEffect() → Get user auth
   useEffect() → Check si compró

3. CONDITIONAL RENDER
   Si no compró: Mostrar "Comprar"
   Si compró: Mostrar "Descargar"
   Si es creador: Mostrar "Tu prototipo"

4. INTERACTIONS
   Click Comprar → POST /api/checkout
   Click Descargar → Download file
   Click Compartir → Copy link a clipboard
```

---

## 🌐 API Routes

### POST /api/checkout

```
REQUEST:
{
  prototypeId: "uuid",
  prototypeTitle: "string",
  price: 29.99
}

PROCESS:
1. Validate user authenticated
2. Create Stripe Checkout Session
3. Insert purchase record (pending)
4. Return session URL

RESPONSE:
{
  url: "https://checkout.stripe.com/..."
}

REDIRECT:
User → Stripe URL → Pays → Success/Cancel
```

---

## 📱 Responsive Design

### Breakpoints Tailwind
```
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
```

### Estrategia
- **Mobile first**: Diseña para mobile primero
- **Grid responsive**: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- **Hidden elements**: Menú burger en mobile
- **Touch friendly**: Botones grandes (48px+)

---

## 🧪 Testing Locales

### Auth
```bash
Ir a /login
Crear cuenta: test@test.com / password123
Ir a /upload (debe funcionar)
Logout y verificar que se ve el botón "Login"
```

### Upload
```bash
Login
Ir a /upload
Subir archivo dummy (crear ZIP vacío)
Verificar en Supabase → prototypes table
Verificar en Storage
```

### Marketplace
```bash
Ir a /
Debe mostrar prototipos subidos
Buscar por nombre
Filtrar por categoría
Click en prototipo → debe ir a /prototype/[id]
```

### Pagos
```bash
Logeado como buyer
Ir a prototipo
Click "Comprar"
Debe ir a Stripe checkout
Usar tarjeta test: 4242 4242 4242 4242
Verificar en Supabase → purchases table
Status debe estar "completed"
Botón "Descargar" debe aparecer
```

---

## 📦 Deployment Architecture

```
GitHub Repo
    ↓
Push a main branch
    ↓
Vercel detecta cambios
    ↓
npm run build
    ↓
next build
    ↓
Optimiza y compila
    ↓
Artifacts subidos a Vercel
    ↓
Deploy en edge functions
    ↓
HTTPS automático
    ↓
DNS apunta a Vercel
    ↓
User accede a yourdomain.com
```

---

## 🎯 Scalability

### Qué funcionará en 1000 usuarios
- Supabase free tier: hasta 500K queries/mes
- Vercel: Unlimited bandwidth
- Storage: Depende de tamaño

### Qué necesita upgrade en 10000 usuarios
- Supabase: Upgrade a pro ($25/mes)
- Cache más agresivo
- CDN para imágenes
- Database optimization

### Qué necesita refactor en 100K usuarios
- Microservicios
- Caching con Redis
- Search especializado (ElasticSearch)
- Analytics database (BigQuery)

---

## 🔗 Integrations

### Supabase
- PostgreSQL: Base de datos relacional
- Auth: Autenticación (email, OAuth)
- Storage: Almacenamiento de archivos
- Realtime: Para futuras notifications

### Stripe
- Checkout: Interfaz de pago
- Webhooks: Confirmación de pago
- Connect: Para splits (futuro)

### Vercel
- Hosting: Deploy automático
- Analytics: Performance monitoring
- Edge Functions: Para serverless

---

## 📚 Recursos

### Documentación
- Next.js: https://nextjs.org/docs
- Supabase: https://supabase.com/docs
- Stripe: https://stripe.com/docs
- Tailwind: https://tailwindcss.com/docs

### Debugging
- Browser DevTools (F12)
- Supabase Dashboard (SQL, Storage, Auth)
- Stripe Dashboard (Payments, Logs)
- Vercel Logs (Deployments)

---

**Última actualización:** Octubre 2025
**Versión:** 1.0
**Estado:** Production-ready
