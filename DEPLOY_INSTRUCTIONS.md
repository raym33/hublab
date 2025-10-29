# 🚀 Instrucciones de Deployment - HubLab

## ⚠️ Situación Actual

El repositorio remoto `https://github.com/raym33/hublab-dev.git` no está accesible.

**Commits listos para subir:**
```
9db0233 - style: Improve font readability and move FAQ to dedicated page
53c4763 - docs: Add comprehensive backend and API documentation  
f5eebbd - docs: Add testing setup guide and integration alignment report
dfa6e74 - feat: Complete frontend-backend integration for CRM hooks
ff2b953 - chore: merge backend Phase 1 into frontend
76635de - feat: Complete frontend UI for Ambient Agent CRM
cc7501c - Add backend infrastructure for Ambient Agent CRM
```

**Total: 7 commits nuevos** (Ambient Agent CRM completo + mejoras UI)

---

## 📝 Opción 1: Crear Nuevo Repositorio en GitHub

### Paso 1: Crear repo en GitHub
1. Ve a https://github.com/new
2. Nombre: `hublab` o `hublab-production`
3. Visibilidad: Private o Public (tu elección)
4. **NO** inicialices con README, .gitignore, o license
5. Click "Create repository"

### Paso 2: Cambiar el remote
```bash
# Eliminar el remote actual
git remote remove origin

# Añadir el nuevo (reemplaza YOUR_USERNAME y YOUR_REPO)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Verificar
git remote -v

# Subir todos los cambios
git push -u origin main
```

---

## 📝 Opción 2: Usar el Repositorio Existente Correcto

Si tienes otro repositorio de HubLab:

```bash
# Ver los remotes actuales
git remote -v

# Cambiar al repositorio correcto
git remote set-url origin https://github.com/TU_USERNAME/hublab.git

# Push
git push origin main
```

---

## 📝 Opción 3: Deploy Directo a Netlify (Sin GitHub)

Si quieres deployar sin GitHub:

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Login a Netlify
netlify login

# Build el proyecto
npm run build

# Deploy
netlify deploy --prod

# Netlify te dará una URL como: https://tu-sitio.netlify.app
```

---

## 🎯 Recomendación

**Mejor opción:** Opción 1 + Opción 3

1. **Crea nuevo repo en GitHub** para tener backup del código
2. **Deploy a Netlify** conectado a ese repo para auto-deployment

**Ventajas:**
- Cada push a GitHub → Auto-deploy en Netlify
- Versionado completo en GitHub
- Rollback fácil si algo falla

---

## 📋 Checklist de Deployment

### Antes de deployar:
- [ ] npm install (instalar dependencias)
- [ ] Crear .env.local con variables de producción
- [ ] npm run build (verificar que compila sin errores)

### Variables de entorno necesarias:
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_KEY=

# App URL
NEXT_PUBLIC_APP_URL=https://tu-dominio.netlify.app
NEXT_PUBLIC_SITE_URL=https://tu-dominio.netlify.app

# Opcional: HubSpot, Stripe, etc
```

### Configurar en Netlify:
1. Build command: `npm run build`
2. Publish directory: `.next`
3. Environment variables: Copiar del .env.local

---

## 🔥 Deploy Rápido (3 comandos)

```bash
# 1. Crear repo nuevo en GitHub (web) y copiar la URL

# 2. Actualizar remote y push
git remote set-url origin https://github.com/TU_USERNAME/TU_REPO.git
git push -u origin main

# 3. Conectar Netlify a ese repo (web)
# - Login en netlify.com
# - "Import from Git"
# - Selecciona tu repo
# - Auto-deploy activado ✅
```

---

## 📞 Ayuda

Si tienes problemas:
1. Verifica que el repositorio existe en GitHub
2. Usa Personal Access Token en vez de password
3. Netlify CLI: `netlify --help`

¡Listo para deployar! 🚀
