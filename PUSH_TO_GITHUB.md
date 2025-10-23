# Subir código a GitHub - HubLab

## Opción 1: Usando GitHub Desktop (MÁS FÁCIL)

1. Descarga GitHub Desktop: https://desktop.github.com/
2. Instala y abre GitHub Desktop
3. File → Add Local Repository
4. Selecciona la carpeta `/Users/c/hublab`
5. Publish repository
6. Selecciona "raym33/hublab"
7. Click "Push origin"

## Opción 2: Usando la Terminal con Token

### Paso 1: Crear Personal Access Token

1. Ve a GitHub: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Nombre: "HubLab Deploy"
4. Selecciona scope: **repo** (todos los permisos de repositorio)
5. Click "Generate token"
6. **COPIA EL TOKEN** (solo lo verás una vez)

### Paso 2: Push con Token

```bash
cd /Users/c/hublab

# Añadir remote con token
git remote add origin https://TU_TOKEN@github.com/raym33/hublab.git

# Push
git branch -M main
git push -u origin main
```

Reemplaza `TU_TOKEN` con el token que copiaste.

## Opción 3: Usando SSH (MÁS SEGURO)

### Paso 1: Verificar si tienes SSH key

```bash
ls -la ~/.ssh
```

Si ves `id_rsa.pub` o `id_ed25519.pub`, ya tienes una key.

### Paso 2: Crear SSH key (si no tienes)

```bash
ssh-keygen -t ed25519 -C "tu_email@example.com"
# Presiona Enter 3 veces (usa defaults)

# Copiar la key
cat ~/.ssh/id_ed25519.pub
# Copia todo el output
```

### Paso 3: Añadir SSH key a GitHub

1. Ve a: https://github.com/settings/keys
2. Click "New SSH key"
3. Título: "MacBook HubLab"
4. Pega la key que copiaste
5. Click "Add SSH key"

### Paso 4: Push con SSH

```bash
cd /Users/c/hublab

# Añadir remote con SSH
git remote add origin git@github.com:raym33/hublab.git

# Push
git branch -M main
git push -u origin main
```

## Verificar que funcionó

Después del push, ve a:
https://github.com/raym33/hublab

Deberías ver todos los archivos del proyecto.

## Siguiente paso: Deploy en Netlify

Una vez el código esté en GitHub, continúa con:
- Ve a https://app.netlify.com/
- "Add new site" → "Import an existing project"
- Selecciona GitHub → raym33/hublab
- Build command: `npm run build`
- Publish directory: `.next`
- Click "Deploy site"
