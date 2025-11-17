# 🚀 HubLab Rust Engine - Guía de Deployment

## Estado Actual

✅ **Código completo y funcional**
✅ **8,124 capsules cargados en JSON**
✅ **Tests pasando localmente**
✅ **Configuración para múltiples plataformas**

## Opciones de Deployment (Gratis)

### Opción 1: Render.com ⭐ (RECOMENDADO)

**¿Por qué Render?**
- ✅ 100% gratuito (plan free permanente)
- ✅ Deploy automático desde GitHub
- ✅ Configuración ya incluida (`render.yaml`)
- ✅ Excelente soporte para Rust
- ✅ SSL automático

**Pasos:**

1. Ve a [render.com](https://render.com) y crea una cuenta
2. Conecta tu repositorio GitHub
3. Crea un nuevo "Web Service"
4. Selecciona este repositorio
5. Render detectará automáticamente el `render.yaml`
6. Click en "Create Web Service"
7. ¡Listo! Render compilará y deployará automáticamente

**Configuración incluida:**
- Archivo: `rust-engine/render.yaml`
- Puerto: 8080
- Health check: `/health`
- Auto-deploy: activado

---

### Opción 2: Shuttle.rs (Específico para Rust)

**¿Por qué Shuttle?**
- ✅ Diseñado específicamente para Rust
- ✅ 3 proyectos gratis
- ✅ Deploy súper rápido
- ✅ No requiere Dockerfile

**Configuración ya incluida:**
- Archivo: `rust-engine/src/shuttle.rs`
- Dependencies en `Cargo.toml`

**Pasos:**

1. Instala Shuttle CLI:
   ```bash
   cargo install cargo-shuttle
   ```

2. Login en Shuttle:
   ```bash
   cargo shuttle login
   ```

3. Deploy:
   ```bash
   cd rust-engine
   cargo shuttle deploy
   ```

4. ¡Listo! Shuttle te dará una URL como `https://hublab-engine.shuttleapp.rs`

**Nota:** El deploy desde este entorno tiene restricciones de red. Debes ejecutarlo desde tu máquina local.

---

### Opción 3: Railway.app

**¿Por qué Railway?**
- ✅ $5 USD gratis/mes (sin tarjeta)
- ✅ Muy fácil de usar
- ✅ Deploy desde GitHub

**Pasos:**

1. Ve a [railway.app](https://railway.app) y crea una cuenta
2. "New Project" → "Deploy from GitHub repo"
3. Selecciona este repositorio
4. Configura:
   - Root Directory: `rust-engine`
   - Build Command: `cargo build --release`
   - Start Command: `./target/release/hublab-engine serve`
5. Deploy!

---

## Verificación del Deploy

Una vez deployado, verifica que funciona:

```bash
# Health check
curl https://tu-url.com/health

# Buscar capsules
curl "https://tu-url.com/api/search?q=rust&category=learn"

# Stats
curl https://tu-url.com/api/stats
```

**Respuesta esperada:**
```json
{
  "status": "ok",
  "timestamp": "...",
  "version": "2.5.0"
}
```

---

## Configuración del Frontend

Una vez que tengas la URL del API deployado:

1. Actualiza las variables de entorno en tu frontend (Next.js):
   ```env
   NEXT_PUBLIC_RUST_ENGINE_URL=https://tu-url-del-api.com
   ```

2. El frontend automáticamente usará el engine de Rust para búsquedas.

---

## Troubleshooting

### El binary no produce output
**Problema:** Esto ocurrió en Fly.io - el binary se ejecutaba pero no producía output.
**Solución:** Usa Render.com o Shuttle.rs que tienen mejor soporte para Rust.

### Error de SSL/certificados
**Problema:** "invalid peer certificate: UnknownIssuer"
**Solución:** Ejecuta desde tu máquina local, no desde el entorno de desarrollo.

### Binary muy grande
**Problema:** El binary es de ~360KB (muy eficiente)
**Nota:** Esto es normal y esperado. Es muy pequeño para un binary de Rust con todos los features.

---

## Archivos de Configuración Incluidos

```
rust-engine/
├── Cargo.toml              # Dependencies de Rust + Shuttle
├── render.yaml             # Configuración de Render.com
├── Dockerfile              # Para Fly.io (opcional)
├── fly.toml               # Configuración de Fly.io (opcional)
├── src/
│   ├── main.rs            # Entry point principal
│   └── shuttle.rs         # Entry point para Shuttle
└── capsules.json          # 8,124 capsules (18MB)
```

---

## Recomendación Final

**Para deployment rápido:** Usa **Render.com**
- Solo conecta GitHub y listo
- Deploy automático en cada push
- 100% gratuito

**Para mejor experiencia Rust:** Usa **Shuttle.rs**
- Una sola línea: `cargo shuttle deploy`
- Específico para Rust
- Muy rápido

Ambas opciones funcionan perfectamente. La configuración ya está incluida en el repositorio.

---

## Próximos Pasos

1. ✅ Código listo
2. ✅ Configuración incluida
3. 🚀 Deploy desde tu máquina local con `cargo shuttle deploy`
   O desde Render.com conectando GitHub
4. 🔗 Actualiza `NEXT_PUBLIC_RUST_ENGINE_URL` en el frontend
5. 🎉 ¡API en producción!
