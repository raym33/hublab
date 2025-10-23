# 🚀 Quick Start - 10 Minutos

Setup rápido de HubLab para tener algo funcionando en tu máquina.

## ⏱️ Paso 1: Instalar (2 min)

```bash
# Clonar repo (o descargar ZIP)
git clone <tu-repo>
cd hublab

# Instalar dependencias
npm install
```

## 🔑 Paso 2: Variables de Entorno (2 min)

```bash
# Copiar archivo de ejemplo
cp .env.example .env.local
```

**Para desarrollo local**, puedes usar estos valores dummy:

```bash
# .env.local

# Supabase (necesitas crear proyecto gratis en supabase.com)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...

# Stripe (necesitas crear cuenta gratis en stripe.com)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# App
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 🗄️ Paso 3: Configurar Supabase (3 min)

1. **Crear proyecto**: Ve a [supabase.com](https://supabase.com) → Click "Create Project"
2. **Obtener credenciales**: Dashboard → Settings → API → Copia `URL` y `anon key`
3. **Setup base de datos**:
   - Ve a SQL Editor
   - Copia todo de `supabase-setup.sql`
   - Pega y ejecuta

4. **Crear Storage buckets**:
   - Ve a Storage
   - Crea bucket: `prototypes` (privado)
   - Crea bucket: `previews` (público)

5. **Configurar Google OAuth** (opcional):
   - Ve a Authentication → Providers → Google
   - Configura Google OAuth si quieres

## 💳 Paso 4: Configurar Stripe (2 min)

1. **Crear cuenta**: Ve a [stripe.com](https://stripe.com) → Sign up
2. **Obtener keys**:
   - Dashboard → Developers → API Keys
   - Copia `Publishable key` y `Secret key` (asegúrate que estén en **Test mode**)
3. **Pegar en `.env.local`**

## ▶️ Paso 5: Ejecutar (1 min)

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## ✅ Verificar que funciona

1. **Home page carga** ✅
2. Click en "Iniciar Sesión" → Puedes hacer login
3. Click en "Vender" → Puedes subir un prototipo
4. Busca el prototipo en home → Click para ver detalle

## 🧪 Testing sin Supabase/Stripe

Si no quieres configurar nada, puedes:

1. Comentar imports de Supabase en componentes
2. Usar datos mockeados para testing local

Pero para un setup completo, necesitas Supabase + Stripe.

## 🐛 Si algo falla

**Error de conexión a Supabase**:
- Verifica que NEXT_PUBLIC_SUPABASE_URL sea correcto
- Revisa que estés usando `.env.local` (no `.env`)

**Google OAuth no funciona**:
- Es normal en localhost sin configurar OAuth
- Prueba con Email/Password en su lugar

**Stripe error**:
- Verifica que STRIPE_SECRET_KEY esté en `.env.local`
- Asegúrate de usar keys de **Test mode**

## 📊 Estructura de carpetas

```
hublab/
├── app/               ← Páginas principales
├── components/        ← Componentes React
├── lib/              ← Cliente de Supabase
├── supabase-setup.sql ← SQL de base de datos
├── package.json      ← Dependencias
└── .env.local        ← Variables (no commitear)
```

## 🎯 Próximos pasos

Después de setup:

1. **Leer documentación**: Ve a `IMPLEMENTATION_GUIDE.md`
2. **Explorar código**: Ve a `app/page.tsx` para ver cómo funciona
3. **Hacer cambios**: Edita componentes y reload automático
4. **Subir a producción**: `vercel --prod` cuando esté listo

## 💪 Recordar

```
"The best way to learn is by doing."
```

¡Ahora que está funcionando, juega con el código!

---

¿Listo para empezar? Abre [http://localhost:3000](http://localhost:3000) 🚀
