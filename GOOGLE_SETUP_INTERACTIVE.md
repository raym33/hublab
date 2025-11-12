# Google OAuth Setup - Guía Interactiva

## Paso 1: Crear Proyecto ✓

1. Ve a: https://console.cloud.google.com
2. Click "Select a project" (arriba)
3. Click "NEW PROJECT"
4. Nombre: **HubLab**
5. Click "CREATE"
6. Espera que se cree (~15 segundos)

---

## Paso 2: Habilitar APIs

1. Asegúrate que el proyecto "HubLab" esté seleccionado
2. En el menú lateral (☰), ve a: **APIs & Services** > **Library**
3. En el buscador, escribe: **Google+ API** (o "People API")
4. Click en el resultado
5. Click botón azul: **ENABLE**
6. Espera que se habilite

---

## Paso 3: OAuth Consent Screen

1. Menú lateral: **APIs & Services** > **OAuth consent screen**
2. Selecciona: ⭕ **External**
3. Click **CREATE**

**Página 1 - App information:**
- App name: `HubLab`
- User support email: `info@hublab.dev` (o tu email)
- App logo: (opcional, skip por ahora)
- Developer contact: `info@hublab.dev`
- Click **SAVE AND CONTINUE**

**Página 2 - Scopes:**
- Click **ADD OR REMOVE SCOPES**
- En el modal, busca y marca:
  - ✅ `.../auth/userinfo.email`
  - ✅ `.../auth/userinfo.profile`
- Click **UPDATE**
- Click **SAVE AND CONTINUE**

**Página 3 - Test users:**
- (Opcional) Puedes añadir tu email
- Click **SAVE AND CONTINUE**

**Página 4 - Summary:**
- Revisa que todo esté bien
- Click **BACK TO DASHBOARD**

---

## Paso 4: Crear Credenciales OAuth 2.0

1. Menú lateral: **APIs & Services** > **Credentials**
2. Click **+ CREATE CREDENTIALS** (arriba)
3. Selecciona: **OAuth client ID**

**Formulario:**
- Application type: `Web application`
- Name: `HubLab Web`

**Authorized JavaScript origins:** (opcional, skip)

**Authorized redirect URIs:**
Click **+ ADD URI** dos veces y añade:
```
http://localhost:3000/api/auth/google/callback
https://hublab.dev/api/auth/google/callback
```

4. Click **CREATE**

---

## Paso 5: Copiar Credenciales

Se abre un modal con tus credenciales:

```
Your Client ID
[una cadena larga tipo: 123456789-abcdefg.apps.googleusercontent.com]

Your Client Secret
[una cadena tipo: GOCSPX-abcdefghijk]
```

**⚠️ IMPORTANTE:**
1. Click en el ícono de copiar junto a "Client ID"
2. Pégalo en un archivo temporal
3. Click en el ícono de copiar junto a "Client Secret"
4. Pégalo también

**No cierres el modal hasta que los hayas copiado!**

---

## ✅ Checklist Final

- [ ] Proyecto "HubLab" creado
- [ ] Google+ API habilitada
- [ ] OAuth consent screen configurado (External)
- [ ] Credenciales OAuth 2.0 creadas
- [ ] Client ID copiado
- [ ] Client Secret copiado
- [ ] Ambas redirect URIs añadidas

---

## 🎯 Siguiente Paso

Una vez que tengas copiados:
- Client ID
- Client Secret

Díselos para configurar Netlify y hacer el deploy.

---

## 🆘 Problemas Comunes

**"No veo el menú APIs & Services"**
→ Click en el menú hamburguesa (☰) arriba a la izquierda

**"No encuentro Google+ API"**
→ Busca "People API" en su lugar, funciona igual

**"Me pide billing"**
→ No debería pedirlo para OAuth básico. Skip si aparece.

**"Error al crear proyecto"**
→ Intenta con otro nombre o espera unos segundos

**"No puedo añadir redirect URI"**
→ Asegúrate de hacer click en "+ ADD URI" primero
