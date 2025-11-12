# 🔄 Configurar Auto-Deploy de GitHub a Netlify

## ✅ Estado Actual

- ✅ Commits pusheados a GitHub (7f9b24a, 699d4d4, 6a9e5da)
- ✅ Repositorio: `raym33/hublab`
- ✅ Rama: `nextjs-marketplace`
- ❌ Netlify NO está conectado a GitHub (por eso no hay deploys automáticos)

## 📋 Pasos para Configurar Auto-Deploy

### 1️⃣ Ve a Netlify Dashboard

Abre en tu navegador:
```
https://app.netlify.com/projects/hublab-dev/settings/deploys
```

### 2️⃣ Conectar con GitHub

1. En la página de **Build settings**, busca la sección **"Continuous deployment"**

2. Verás algo como:
   ```
   Build settings
   Configure how Netlify builds and deploys your site

   [Link site to Git]  ← CLICK AQUÍ
   ```

3. Click en **"Link site to Git"** o **"Connect to Git repository"**

### 3️⃣ Autorizar GitHub

1. Selecciona **GitHub** como proveedor

2. Si te pide autorizar, click en **"Authorize Netlify"**

3. Te llevará a GitHub para confirmar el acceso

### 4️⃣ Seleccionar Repositorio

1. En la lista de repositorios, busca y selecciona:
   ```
   raym33/hublab
   ```

2. Si no aparece, click en **"Configure Netlify on GitHub"** y agrega el repositorio

### 5️⃣ Configurar Build Settings

Una vez seleccionado el repositorio, configura:

```
Base directory:          (dejar vacío)
Branch to deploy:        nextjs-marketplace  ← IMPORTANTE!
Build command:           npm run build
Publish directory:       .next
```

### 6️⃣ Guardar y Deploy

1. Click en **"Save"** o **"Link repository"**

2. Netlify detectará automáticamente el último commit y empezará a deployar

3. Verás el deploy en progreso en:
   ```
   https://app.netlify.com/projects/hublab-dev/deploys
   ```

---

## 🔍 Verificar que Funciona

Después de configurar, haz una prueba:

### Opción A: Desde GitHub Desktop

1. Abre **GitHub Desktop**
2. Haz un cambio pequeño (ej: edita README.md)
3. Escribe un mensaje de commit: "Test auto-deploy"
4. Click **"Commit to nextjs-marketplace"**
5. Click **"Push origin"**
6. Ve a Netlify y deberías ver un nuevo deploy automático

### Opción B: Desde la terminal

```bash
cd /Users/c/hublab
echo "# Test auto-deploy" >> README.md
git add README.md
git commit -m "Test: verify auto-deploy works"
git push origin nextjs-marketplace
```

Luego ve a: https://app.netlify.com/projects/hublab-dev/deploys

---

## 📺 Capturas de Pantalla de Referencia

### Página de Settings → Build & deploy
```
┌─────────────────────────────────────────┐
│ Build settings                          │
│                                         │
│ ○ Not linked to a Git repository       │
│                                         │
│ [Link site to Git] ← CLICK AQUÍ        │
│                                         │
└─────────────────────────────────────────┘
```

### Después de conectar
```
┌─────────────────────────────────────────┐
│ Build settings                          │
│                                         │
│ Repository: raym33/hublab              │
│ Branch: nextjs-marketplace             │
│ Build command: npm run build           │
│ Publish directory: .next               │
│                                         │
│ [Edit settings]                        │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🎯 Resultado Final

Una vez configurado:

✅ **Cada vez que hagas `git push`** → Netlify detectará el cambio
✅ **Build automático** → Netlify ejecutará `npm run build`
✅ **Deploy automático** → El sitio se actualizará en https://hublab.dev
✅ **Deploy visible en dashboard** → Verás todos los deploys en Netlify

---

## 🆘 Problemas Comunes

### No veo el botón "Link site to Git"

- Ve a: Settings → Build & deploy → Continuous deployment
- O prueba: https://app.netlify.com/projects/hublab-dev/settings/deploys#branches-and-deploy-contexts

### El repositorio no aparece

- Ve a: https://github.com/settings/installations
- Busca "Netlify" en la lista de aplicaciones instaladas
- Click en "Configure"
- Asegúrate de que el repositorio `raym33/hublab` tenga acceso

### Netlify no detecta los commits

- Verifica que la rama configurada sea `nextjs-marketplace`
- Ve a Settings → Build & deploy → Branch deploys
- Asegúrate de que "Production branch" sea `nextjs-marketplace`

---

## 📚 Recursos

- **Netlify Docs**: https://docs.netlify.com/configure-builds/repo-permissions-linking/
- **GitHub Integration**: https://docs.netlify.com/integrations/github/
- **Dashboard del proyecto**: https://app.netlify.com/projects/hublab-dev

---

**Último commit en GitHub**: `7f9b24a` - Remove .netlify build artifacts from repository

**Estado**: ⚠️ Esperando configuración de auto-deploy
