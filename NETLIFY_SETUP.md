# 🚀 Configuración de GitHub Desktop + Netlify Auto-Deploy

## 📋 Pasos para configurar el deploy automático

### 1️⃣ GITHUB DESKTOP (Ya configurado ✅)

Tu repositorio ya está conectado:
- **Repo**: https://github.com/raym33/hublab.git
- **Rama actual**: nextjs-marketplace

**Cómo usar GitHub Desktop:**
1. Abre GitHub Desktop (debería estar abierto ahora)
2. Si no ve el proyecto, ve a: `File` → `Add Local Repository` → Selecciona `/Users/c/hublab`
3. Verás los cambios en la pestaña "Changes"
4. Escribe un mensaje de commit
5. Click en "Commit to nextjs-marketplace"
6. Click en "Push origin" (arriba a la derecha)

---

### 2️⃣ NETLIFY AUTO-DEPLOY (Configuración necesaria)

#### Opción A: Configuración desde Dashboard (Recomendado)

1. **Abre Netlify Dashboard**: https://app.netlify.com/projects/hublab-dev

2. **Ve a Build & Deploy**:
   - Click en "Site settings" (menú izquierdo)
   - Click en "Build & deploy"
   - Click en "Continuous Deployment"

3. **Conecta GitHub**:
   - Busca la sección "Build settings"
   - Click en "Link site to Git"
   - Selecciona "GitHub"
   - Autoriza Netlify (si te pide)
   - Busca y selecciona: `raym33/hublab`
   - Selecciona rama: `nextjs-marketplace`

4. **Configura Build Settings**:
   ```
   Base directory: (dejar vacío)
   Build command: npm run build
   Publish directory: .next
   ```

5. **Click en "Deploy site"**

#### Opción B: Configuración desde CLI

Ejecuta en la terminal:
```bash
cd /Users/c/hublab
netlify env:set GITHUB_REPO "raym33/hublab"
netlify env:set BRANCH "nextjs-marketplace"
```

---

### 3️⃣ VERIFICAR QUE FUNCIONA

Después de configurar:

1. **Haz un cambio pequeño** (ejemplo):
   ```bash
   cd /Users/c/hublab
   echo "# Test" >> README.md
   ```

2. **Commitea y pushea con GitHub Desktop**:
   - Abre GitHub Desktop
   - Verás el cambio en README.md
   - Escribe commit: "Test auto-deploy"
   - Click "Commit to nextjs-marketplace"
   - Click "Push origin"

3. **Ve a Netlify**:
   - Abre: https://app.netlify.com/projects/hublab-dev/deploys
   - Deberías ver un nuevo deploy en progreso

---

### 4️⃣ CONFIGURACIÓN DE VARIABLES DE ENTORNO

Si tu app necesita variables de entorno (API keys, etc.):

1. Ve a: https://app.netlify.com/projects/hublab-dev/settings/env
2. Click en "Add a variable"
3. Agrega las que necesites (ej: `NEXT_PUBLIC_SUPABASE_URL`)

---

## 🔄 FLUJO COMPLETO

```
┌─────────────────┐
│  Haces cambios  │
│   en el código  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ GitHub Desktop  │
│  1. Commit      │
│  2. Push        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│     GitHub      │
│  (repositorio)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Netlify      │
│  1. Detecta     │
│  2. Build       │
│  3. Deploy      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   🎉 LIVE!      │
│ hublab.dev      │
└─────────────────┘
```

---

## 📝 COMANDOS ÚTILES

### Ver status de Netlify:
```bash
netlify status
```

### Ver deploys recientes:
```bash
netlify deploy:list
```

### Abrir dashboard de Netlify:
```bash
netlify open
```

### Abrir sitio en producción:
```bash
netlify open:site
```

### Deploy manual (si falla auto-deploy):
```bash
npm run build
netlify deploy --prod
```

---

## ⚠️ IMPORTANTE

- **NO commitees la carpeta `.netlify/`** (ya está en .gitignore ✅)
- **NO commitees `.env`** con secretos (ya debería estar en .gitignore)
- Usa variables de entorno en Netlify para secretos

---

## 🆘 PROBLEMAS COMUNES

### Build falla en Netlify:
1. Verifica que `npm run build` funciona localmente
2. Revisa los logs en: https://app.netlify.com/projects/hublab-dev/deploys
3. Verifica las variables de entorno

### GitHub Desktop no muestra cambios:
1. Verifica que estás en la rama correcta
2. Refresca: `Repository` → `Refresh`

### Netlify no detecta el push:
1. Verifica que la integración de GitHub está activa
2. Re-conecta el repositorio en Netlify
3. Intenta un deploy manual: `netlify deploy --prod`

---

## 📚 RECURSOS

- **Netlify Dashboard**: https://app.netlify.com/projects/hublab-dev
- **Sitio en vivo**: https://hublab.dev
- **GitHub Repo**: https://github.com/raym33/hublab
- **Docs Netlify**: https://docs.netlify.com/

---

## ✅ CHECKLIST

- [ ] GitHub Desktop instalado y proyecto agregado
- [ ] Repositorio conectado en Netlify
- [ ] Build settings configurados
- [ ] Variables de entorno configuradas (si necesario)
- [ ] Primer test deploy exitoso
- [ ] Auto-deploy funcionando

---

**Estado actual**:
- ✅ Proyecto linkeado a Netlify: `hublab-dev`
- ✅ Git remoto configurado: `raym33/hublab`
- ✅ Rama: `nextjs-marketplace`
- ⚠️  **FALTA**: Conectar GitHub en Netlify Dashboard

**Próximo paso**: Ve a https://app.netlify.com/projects/hublab-dev y configura la integración con GitHub.
