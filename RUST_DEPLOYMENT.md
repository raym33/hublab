# 🚀 HubLab Rust Engine - Guía de Deployment

## Estado Actual

✅ **Código completo y funcional**
✅ **8,124 capsules cargados en JSON** (18MB en `rust-engine/capsules.json`)
✅ **Tests pasando localmente**
✅ **Configuración para múltiples plataformas**

## Archivos Importantes

- `rust-engine/capsules.json` - 8,124 capsules exportados (18MB) - **DEBE estar incluido en el deploy**
- `rust-engine/render.yaml` - Configuración para Render.com
- `rust-engine/Cargo.toml` - Dependencias de Rust
- `RUST_DEPLOYMENT.md` - Esta guía

## Opciones de Deployment (Gratis)

### Opción 1: Render.com ⭐ (RECOMENDADO)

**¿Por qué Render?**
- ✅ 100% gratuito (plan free permanente)
- ✅ Deploy automático desde GitHub
- ✅ Configuración ya incluida (`render.yaml`)
- ✅ Excelente soporte para Rust
- ✅ SSL automático

**Pasos para Deploy:**

1. Ve a [render.com](https://render.com) y crea cuenta
2. Conecta tu repositorio GitHub
3. Click en "New" → "Web Service"
4. Selecciona este repositorio
5. Render detectará automáticamente `render.yaml`
6. Click "Create Web Service"
7. ¡Listo! Tu API estará en: `https://hublab-engine.onrender.com`

**Tiempo estimado:** ~5-10 minutos

---

### Opción 2: Shuttle.rs (Específico para Rust)

**¿Por qué Shuttle?**
- ✅ Diseñado específicamente para Rust
- ✅ Deploy super simple con un comando
- ✅ 3 proyectos gratis
- ✅ No requiere Dockerfile

**Pasos para Deploy:**

```bash
# 1. Instalar Shuttle CLI
cargo install cargo-shuttle

# 2. Login (abrirá navegador)
cargo shuttle login

# 3. Deploy
cd rust-engine
cargo shuttle deploy
```

**Tiempo estimado:** ~5 minutos

**URL resultante:** `https://hublab-engine.shuttleapp.rs`

---

### Opción 3: Railway.app

**¿Por qué Railway?**
- ✅ $5 USD de crédito gratis/mes
- ✅ Muy fácil de usar
- ✅ Soporta Rust + Docker

**Pasos para Deploy:**

1. Ve a [railway.app](https://railway.app)
2. Conecta tu repo GitHub
3. Click "Deploy Now"
4. Railway detectará automáticamente que es Rust
5. ¡Listo!

**Tiempo estimado:** ~3-5 minutos

---

## Verificación Post-Deploy

Una vez deployado, verifica que la API funciona:

```bash
# Health check
curl https://tu-url-aqui.com/healthz

# Debería retornar:
# {"status":"ok","version":"0.1.0","capsules_loaded":8124,"categories":71}

# Prueba de búsqueda
curl "https://tu-url-aqui.com/api/search?q=react&limit=5"

# Debería retornar capsules relacionadas con React

# Búsqueda fuzzy (typo-tolerant)
curl "https://tu-url-aqui.com/api/search/fuzzy?q=reakt&limit=5"

# Obtener capsule específica
curl https://tu-url-aqui.com/api/capsules/some-capsule-id

# Listar categorías
curl https://tu-url-aqui.com/api/categories
```

---

## Integración con Frontend Next.js

Una vez que tengas tu URL de producción, actualiza el archivo `.env.local`:

```bash
NEXT_PUBLIC_RUST_ENGINE_URL=https://tu-url-aqui.com
```

Luego reinicia el servidor de desarrollo:

```bash
npm run dev
```

---

## Troubleshooting

### Error: "Binary produces no output"
Este era el problema con Fly.io. Usar Render.com o Shuttle.rs lo resuelve.

### Error: "capsules.json not found"
Verifica que el archivo `rust-engine/capsules.json` existe y tiene 18MB.

### Error: "Out of memory"
El plan gratuito de Render tiene 512MB RAM. Si necesitas más, considera:
- Optimizar el tamaño de capsules.json
- Usar compresión gzip
- Upgrade a plan de pago

### Error: "Build timeout"
Render tiene timeout de 15 minutos en plan free. Si tarda más:
- Verifica que las dependencias en Cargo.toml sean las mínimas necesarias
- Considera usar Shuttle que tiene mejor cache para Rust

---

## Monitoreo

Después del deploy, las plataformas ofrecen:

**Render:**
- Dashboard con logs en tiempo real
- Métricas de CPU/memoria
- Health checks automáticos

**Shuttle:**
- CLI para ver logs: `shuttle logs`
- Dashboard web en console.shuttle.dev

**Railway:**
- Dashboard con métricas
- Logs en tiempo real
- Alertas automáticas

---

## Próximos Pasos

1. ✅ Deployar el engine (seguir una de las opciones arriba)
2. ✅ Verificar que la API funciona
3. ✅ Actualizar `.env.local` en Next.js
4. ✅ Probar búsqueda desde el frontend
5. ✅ (Opcional) Configurar dominio custom

---

## Notas de Debugging de Fly.io

Durante el desarrollo, intentamos deployar en Fly.io pero encontramos un problema crítico:

**Problema:**
- El binario se ejecutaba pero producía **CERO output** (ni stdout, ni stderr)
- Exit code 0 (success) pero sin logs
- Verificamos con `ldd`, `strace`, output forzado con `eprintln!`, etc.

**Causa:**
- Problema específico del entorno de Fly.io con este binary de Rust
- Posiblemente relacionado con la inicialización de stdio o runtime de Tokio

**Solución:**
- Usar plataformas con mejor soporte nativo para Rust
- Render.com y Shuttle.rs funcionan perfectamente

---

## Soporte

Si tienes problemas con el deployment:

1. Revisa los logs de la plataforma
2. Verifica que `capsules.json` existe localmente
3. Prueba correr localmente: `cargo run --release -- serve`
4. Abre un issue en GitHub con los logs

---

**¡Happy Deploying!** 🚀
