# 🚀 Instalación de HubLab - Paso a Paso

## Método 1: Instalación Automática (Recomendado)

```bash
# Ejecutar script de setup
./setup.sh

# O si no funciona:
bash setup.sh
```

## Método 2: Instalación Manual

### Paso 1: Instalar Dependencias

```bash
npm install
```

### Paso 2: Configurar Variables de Entorno

```bash
# Copiar archivo de ejemplo
cp .env.example .env.local

# Editar con tu editor favorito
nano .env.local
# o
code .env.local
```

### Paso 3: Configurar Supabase

1. **Crear cuenta en Supabase**
   - Ve a [supabase.com](https://supabase.com)
   - Sign up gratis
   - Crea un nuevo proyecto

2. **Obtener credenciales**
   - En Dashboard → Settings → API
   - Copia `URL` → pega en `NEXT_PUBLIC_SUPABASE_URL`
   - Copia `anon public` → pega en `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. **Ejecutar SQL de setup**
   - Ve a SQL Editor en Supabase
   - Copia todo el contenido de `supabase-setup.sql`
   - Pega y ejecuta (Run)

4. **Crear Storage Buckets**
   - Ve a Storage en Supabase
   - Crea bucket `prototypes` (privado)
   - Crea bucket `previews` (público)

### Paso 4: Configurar Stripe

1. **Crear cuenta en Stripe**
   - Ve a [stripe.com](https://stripe.com)
   - Sign up gratis

2. **Obtener API Keys**
   - Dashboard → Developers → API Keys
   - Asegúrate de estar en **Test mode**
   - Copia `Publishable key` → pega en `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - Copia `Secret key` → pega en `STRIPE_SECRET_KEY`

### Paso 5: Ejecutar en Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## 🧪 Verificar Instalación

### Test 1: Home Page
- [ ] Abre http://localhost:3000
- [ ] Debe cargar sin errores
- [ ] Debe mostrar "HubLab" en el navbar

### Test 2: Autenticación
- [ ] Click en "Login"
- [ ] Crear una cuenta nueva
- [ ] Debe poder hacer login
- [ ] Navbar debe mostrar tu email

### Test 3: Upload (requiere auth)
- [ ] Click en "Vender" (solo visible si estás logeado)
- [ ] Debe cargar formulario de upload
- [ ] Llena campos de prueba
- [ ] Submit debe funcionar

### Test 4: Base de Datos
- [ ] Ve a Supabase Dashboard
- [ ] Table Editor → prototypes
- [ ] Debe tener el prototipo que subiste

## 🐛 Solución de Problemas

### Error: "Cannot find module"
```bash
# Reinstalar dependencias
rm -rf node_modules
npm install
```

### Error: "Invalid environment variables"
- Verifica que `.env.local` existe
- Verifica que todas las variables están configuradas
- NO uses comillas en los valores

### Error: "Supabase connection failed"
- Verifica URL y ANON_KEY son correctos
- Verifica que el proyecto de Supabase está activo
- Prueba en navegador incógnito

### Error: "Stripe is not defined"
- Verifica que las keys de Stripe son correctas
- Asegúrate de estar en Test mode
- Verifica que no hay espacios en las keys

## 📋 Checklist Final

- [ ] Node.js 18+ instalado
- [ ] npm install completado
- [ ] .env.local configurado
- [ ] Supabase proyecto creado
- [ ] SQL ejecutado en Supabase
- [ ] Storage buckets creados
- [ ] Stripe cuenta creada
- [ ] API keys configuradas
- [ ] npm run dev funciona
- [ ] Localhost:3000 carga

## 🚀 ¡Listo!

Si todo está funcionando:
1. Lee `IMPLEMENTATION_GUIDE.md` para el plan de desarrollo
2. Sigue `CHECKLIST.md` para trackear progreso
3. Consulta `ARCHITECTURE.md` si tienes dudas técnicas

## 📞 Ayuda

Si tienes problemas:
1. Revisa los logs en la consola
2. Pregunta a Claude/ChatGPT con el error específico
3. Revisa la documentación en `README.md`

---

**Tiempo estimado de instalación: 15-30 minutos**