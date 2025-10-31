# Google OAuth Setup para HubLab

## 🔧 Configuración en Google Cloud Console

### 1. Crear Proyecto
```
URL: https://console.cloud.google.com
Proyecto: HubLab
```

### 2. Habilitar APIs
- Google+ API (o People API)
- OAuth consent screen configurado como "External"

### 3. OAuth Consent Screen
```
App name: HubLab
User support email: info@hublab.dev
Developer contact: info@hublab.dev

Scopes:
- .../auth/userinfo.email
- .../auth/userinfo.profile
```

### 4. Credenciales OAuth 2.0
```
Application type: Web application
Name: HubLab Web

Authorized redirect URIs:
- http://localhost:3000/api/auth/google/callback (desarrollo)
- https://hublab.dev/api/auth/google/callback (producción)
```

## 🔐 Variables de Entorno

### Desarrollo Local (.env.local)
```bash
NEXT_PUBLIC_GOOGLE_CLIENT_ID=tu_client_id_aqui
GOOGLE_CLIENT_SECRET=tu_client_secret_aqui
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Producción (Netlify)
```bash
NEXT_PUBLIC_GOOGLE_CLIENT_ID=tu_client_id_aqui
GOOGLE_CLIENT_SECRET=tu_client_secret_aqui
NEXT_PUBLIC_BASE_URL=https://hublab.dev
```

## 🚀 Configurar en Netlify

1. Ve a: https://app.netlify.com
2. Selecciona el sitio "hublab"
3. Ve a: Site settings > Environment variables
4. Add variable (3 veces):

```
Key: NEXT_PUBLIC_GOOGLE_CLIENT_ID
Value: [tu client id]

Key: GOOGLE_CLIENT_SECRET
Value: [tu client secret]

Key: NEXT_PUBLIC_BASE_URL
Value: https://hublab.dev
```

5. Save
6. Trigger deploy (Deploys > Trigger deploy > Deploy site)

## 🧪 Testing

### Local
```bash
# 1. Crear .env.local con las variables
cp .env.example .env.local
# 2. Editar .env.local con tus valores reales
# 3. Iniciar servidor
npm run dev
# 4. Visita http://localhost:3000
# 5. Click "Start Building with Google"
```

### Producción
```
1. Visita https://hublab.dev
2. Click "Start Building with Google"
3. Inicia sesión con Google
4. Deberías ser redirigido a /builder
```

## 🔍 Troubleshooting

### Error: "redirect_uri_mismatch"
- Verifica que la URL en Google Cloud Console sea EXACTAMENTE:
  - https://hublab.dev/api/auth/google/callback
- Sin espacios, sin slash extra al final

### Error: "invalid_client"
- Verifica que GOOGLE_CLIENT_SECRET esté correctamente configurado
- Verifica que no haya espacios antes/después del secret

### Error: "access_denied"
- El usuario canceló el login
- Normal, puedes intentar de nuevo

### Error: "Error 400: redirect_uri_mismatch"
- La URL de callback no coincide
- Añade AMBAS URLs en Google Cloud:
  - http://localhost:3000/api/auth/google/callback
  - https://hublab.dev/api/auth/google/callback

## 📋 Checklist

- [ ] Proyecto creado en Google Cloud Console
- [ ] Google+ API habilitada
- [ ] OAuth consent screen configurado
- [ ] Credenciales OAuth 2.0 creadas
- [ ] Redirect URIs añadidos (local + producción)
- [ ] Client ID copiado
- [ ] Client Secret copiado
- [ ] Variables configuradas en Netlify
- [ ] Deploy triggerado
- [ ] Probado en producción

## 🎯 Flujo Completo

```
Usuario visita hublab.dev
    ↓
Click "Start Building with Google"
    ↓
Redirige a /api/auth/google
    ↓
Redirige a Google OAuth
    ↓
Usuario inicia sesión con Google
    ↓
Google redirige a /api/auth/google/callback
    ↓
Crea sesión de usuario (cookie)
    ↓
Redirige a /builder
    ↓
¡Usuario en el visual builder! 🎉
```

## 📞 Soporte

- Documentación Google OAuth: https://developers.google.com/identity/protocols/oauth2
- Netlify Environment Variables: https://docs.netlify.com/environment-variables/overview/
