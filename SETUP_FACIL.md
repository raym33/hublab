# 🚀 Setup Fácil - HubLab API

Guía paso a paso para configurar el API en 5 minutos.

## Paso 1: Copiar la Service Role Key

1. Abre este link: https://supabase.com/dashboard/project/kfssgrzqtnxuhfiqmjhu/settings/api

2. Busca la sección **"Project API keys"**

3. Busca la key que dice **"service_role"** (es secreta, NO uses la "anon" key)

4. Haz clic en el ícono del ojo 👁️ para mostrarla

5. Copia la key completa (empieza con `eyJ...`)

6. **PÉGALA AQUÍ ABAJO** (yo la voy a poner en el archivo .env.local por ti):

```
TU_SERVICE_ROLE_KEY_AQUÍ
```

---

## Paso 2: Ejecutar el SQL en Supabase

1. Abre este link: https://supabase.com/dashboard/project/kfssgrzqtnxuhfiqmjhu/sql/new

2. Borra todo lo que aparece en el editor

3. Abre el archivo `/Users/c/hublab/lib/api/schema-simple.sql`

4. Copia TODO el contenido del archivo

5. Pégalo en el SQL Editor de Supabase

6. Haz clic en **"Run"** (botón verde abajo a la derecha)

7. **COPIA LA API KEY** que aparece en los resultados (empieza con `hublab_sk_...`)

---

## Paso 3: Probar el API

Una vez que tengas la API key del paso 2, ejecuta estos comandos:

```bash
# 1. Ir al directorio del proyecto
cd /Users/c/hublab

# 2. Establecer tu API key
export HUBLAB_API_KEY="hublab_sk_TU_KEY_AQUI"

# 3. Ejecutar tests
node test-api.js
```

Si todo salió bien, deberías ver algo como:

```
🧪 Testing: GET /themes
✅ Found 3 themes

🧪 Testing: POST /projects
✅ Created project: abc-123

🎉 All tests passed!
```

---

## ¿Problemas?

### "Cannot find module 'node-fetch'"

El script de test usa `fetch` que está disponible en Node 18+. Si tienes Node 16 o anterior:

```bash
node --version  # Verificar versión
```

Si es menor a 18, actualiza Node o modifica el test.

### "SUPABASE_SERVICE_ROLE_KEY is not defined"

Asegúrate de haber pegado la service role key correctamente en el paso 1.

### "Table 'api_keys' does not exist"

No ejecutaste el SQL del paso 2, o hubo un error al ejecutarlo. Revisa los errores en Supabase.

---

## Resumen Visual

```
┌─────────────────────────────────────────┐
│ Paso 1: Obtener Service Role Key       │
│ ↓                                       │
│ Supabase Dashboard → Settings → API    │
│ Copiar "service_role" key               │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ Paso 2: Ejecutar SQL                   │
│ ↓                                       │
│ Supabase Dashboard → SQL Editor         │
│ Pegar schema-simple.sql → Run           │
│ Copiar la API key generada              │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ Paso 3: Probar                          │
│ ↓                                       │
│ export HUBLAB_API_KEY="..."            │
│ node test-api.js                        │
└─────────────────────────────────────────┘
              ↓
           ✅ LISTO!
```

---

## Siguiente Paso (Opcional)

Una vez que funcione el API, puedes:

1. **Crear más API keys** para diferentes proyectos
2. **Cambiar el tier** de una key (free → pro → enterprise)
3. **Desplegar a producción** con `netlify deploy --prod`
4. **Instalar el plugin de ChatGPT** siguiendo `CHATGPT_PLUGIN_SETUP.md`

---

## Crear Más API Keys (SQL)

```sql
-- Para crear una nueva key:
INSERT INTO api_keys (user_id, key, name, tier)
VALUES (
  'tu-user-id',
  'hublab_sk_' || encode(gen_random_bytes(32), 'hex'),
  'Mi Proyecto X',
  'pro'  -- o 'free' o 'enterprise'
)
RETURNING key;
```

---

## Cambiar Tier de una Key (SQL)

```sql
-- Upgrade a Pro:
UPDATE api_keys
SET tier = 'pro'
WHERE key = 'hublab_sk_tu_key_aqui';

-- Upgrade a Enterprise:
UPDATE api_keys
SET tier = 'enterprise'
WHERE key = 'hublab_sk_tu_key_aqui';
```

---

## Ver Todas tus API Keys (SQL)

```sql
SELECT
  key,
  name,
  tier,
  created_at,
  is_active
FROM api_keys
ORDER BY created_at DESC;
```

---

¡Eso es todo! Si tienes problemas, avísame y te ayudo.
