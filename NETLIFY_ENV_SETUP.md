# 📋 Guía: Configurar Variables de Entorno en Netlify

## 🔑 Variables Necesarias de `.env.local`

Estas son las variables que necesitas configurar en Netlify desde tu archivo `.env.local`:

### Variables de Supabase
- `NEXT_PUBLIC_SUPABASE_URL` - URL de tu proyecto Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Clave pública (anon) de Supabase
- `SUPABASE_SERVICE_ROLE_KEY` - Clave de servicio de Supabase (mantener privada)

### Variables de OpenAI
- `OPENAI_API_KEY` - Tu clave API de OpenAI
- `OPENAI_MODEL` - Modelo a usar (ej: "gpt-4")

### Variables de Groq (Alternativa a OpenAI)
- `GROQ_API_KEY` - Tu clave API de Groq

### Variables de HubSpot (CRM)
- `HUBSPOT_CLIENT_ID` - ID de cliente OAuth de HubSpot
- `HUBSPOT_CLIENT_SECRET` - Secreto de cliente OAuth de HubSpot
- `HUBSPOT_REDIRECT_URI` - URI de redirección OAuth

### Variables de Stripe (Pagos)
- `STRIPE_SECRET_KEY` - Clave secreta de Stripe
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Clave pública de Stripe

## 📝 Pasos para Configurar en Netlify

### Método 1: A través del Panel de Netlify (Recomendado)

1. **Acceder al Panel de Netlify**
   ```
   https://app.netlify.com
   ```

2. **Seleccionar tu Sitio**
   - Ve a: https://app.netlify.com/sites/hublab-dev/overview

3. **Ir a Configuración de Variables**
   - Click en `Site configuration` en el menú lateral
   - Click en `Environment variables`
   - O directo: https://app.netlify.com/sites/hublab-dev/configuration/env

4. **Agregar Variables**
   - Click en `Add a variable`
   - Para cada variable:
     - **Key**: Nombre de la variable (ej: `OPENAI_API_KEY`)
     - **Values**:
       - Click en `Add value`
       - **Value**: El valor de tu `.env.local`
       - **Context**: Selecciona donde aplicar:
         - `Production` ✅
         - `Deploy Previews` ✅ (opcional)
         - `Branch deploys` ✅ (opcional)
         - `Local development` ❌

5. **Guardar Cambios**
   - Click en `Save variable`
   - Repite para cada variable

### Método 2: Usando Netlify CLI

1. **Instalar Netlify CLI** (si no lo tienes)
   ```bash
   npm install -g netlify-cli
   ```

2. **Autenticarse**
   ```bash
   netlify login
   ```

3. **Configurar Variables una por una**
   ```bash
   # Sintaxis: netlify env:set VARIABLE_NAME "value"

   # Supabase
   netlify env:set NEXT_PUBLIC_SUPABASE_URL "tu-url-de-supabase"
   netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY "tu-anon-key"
   netlify env:set SUPABASE_SERVICE_ROLE_KEY "tu-service-role-key"

   # OpenAI
   netlify env:set OPENAI_API_KEY "tu-openai-api-key"
   netlify env:set OPENAI_MODEL "gpt-4"

   # Groq (si usas)
   netlify env:set GROQ_API_KEY "tu-groq-api-key"

   # HubSpot
   netlify env:set HUBSPOT_CLIENT_ID "tu-hubspot-client-id"
   netlify env:set HUBSPOT_CLIENT_SECRET "tu-hubspot-client-secret"
   netlify env:set HUBSPOT_REDIRECT_URI "https://hublab.dev/api/crm/hubspot/callback"
   ```

4. **Verificar Variables**
   ```bash
   netlify env:list
   ```

### Método 3: Importar desde `.env.local` (Más Rápido)

1. **Script de Importación Automática**

   Crea un archivo `import-env-to-netlify.sh`:
   ```bash
   #!/bin/bash

   # Leer .env.local y configurar en Netlify
   while IFS='=' read -r key value; do
     # Ignorar líneas vacías y comentarios
     if [[ ! -z "$key" && ! "$key" =~ ^# ]]; then
       # Remover comillas del valor si las tiene
       value="${value%\"}"
       value="${value#\"}"

       echo "Setting $key..."
       netlify env:set "$key" "$value"
     fi
   done < .env.local

   echo "✅ Variables importadas!"
   netlify env:list
   ```

2. **Ejecutar el script**
   ```bash
   chmod +x import-env-to-netlify.sh
   ./import-env-to-netlify.sh
   ```

## 🔄 Verificar y Actualizar Variables

### Ver todas las variables configuradas
```bash
netlify env:list
```

### Actualizar una variable
```bash
netlify env:set VARIABLE_NAME "nuevo-valor"
```

### Eliminar una variable
```bash
netlify env:unset VARIABLE_NAME
```

## ⚠️ Notas Importantes

1. **Variables con prefijo `NEXT_PUBLIC_`**
   - Son visibles en el cliente (navegador)
   - Se incluyen en el bundle de JavaScript
   - Úsalas solo para valores públicos

2. **Variables sin prefijo `NEXT_PUBLIC_`**
   - Solo disponibles en el servidor
   - Más seguras para claves secretas
   - No se exponen al cliente

3. **Después de agregar variables**
   - Necesitas hacer un nuevo deploy para que tomen efecto
   - Puedes hacerlo desde el panel o con:
     ```bash
     netlify deploy --prod
     ```

4. **Contextos de Variables**
   - **Production**: Se aplican a tu sitio en producción
   - **Deploy Previews**: Se aplican a PRs y previews
   - **Branch deploys**: Se aplican a ramas específicas

## 🔒 Seguridad

- **NUNCA** commitees archivos `.env.local` a Git
- **NUNCA** compartas claves secretas en código público
- Usa diferentes claves para desarrollo y producción
- Rota las claves regularmente
- Revoca claves comprometidas inmediatamente

## 📊 Variables Actuales Necesarias

Aquí está la lista completa de variables que tu aplicación necesita:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# AI (Elige uno)
OPENAI_API_KEY=
GROQ_API_KEY=

# Modelo AI
OPENAI_MODEL=gpt-4

# HubSpot CRM (Opcional)
HUBSPOT_CLIENT_ID=
HUBSPOT_CLIENT_SECRET=
HUBSPOT_REDIRECT_URI=https://hublab.dev/api/crm/hubspot/callback

# Stripe (Opcional)
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Configuración del Compilador
NEXT_PUBLIC_ENABLE_COMPILER=true
NEXT_PUBLIC_MAX_COMPILE_TIME=25000
NEXT_PUBLIC_ENABLE_AI_GENERATION=true
NEXT_PUBLIC_ENABLE_VOICE_INPUT=true
```

## 🚀 Deploy Rápido

Una vez configuradas las variables:

1. **Trigger manual deploy**
   ```bash
   netlify deploy --prod
   ```

2. **O desde el panel**
   - Ve a Deploys
   - Click en "Trigger deploy" > "Deploy site"

## 📞 Soporte

Si tienes problemas:
- Revisa los logs: https://app.netlify.com/sites/hublab-dev/logs
- Verifica las variables: `netlify env:list`
- Asegúrate de que los nombres coincidan exactamente (case-sensitive)
- Revisa que no haya espacios extra en los valores