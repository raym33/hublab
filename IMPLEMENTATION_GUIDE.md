# 📋 Guía de Implementación - 5 Días

Plan detallado para construir HubLab de cero en 3-5 días de trabajo intenso.

## 🎯 Objetivo Final

**Tener un marketplace funcional en producción con primera venta en 7 días**

---

## 📅 Día 1: Setup y Autenticación (4-6 horas)

### Objetivo del Día
Tener auth funcionando localmente y usuarios pudiendo logearse.

### Mañana (2-3 horas)

**1. Crear proyecto (15 min)**
```bash
npx create-next-app@latest hublab --typescript
cd hublab
npm install
```

**2. Instalar dependencias (10 min)**
```bash
npm install @supabase/supabase-js stripe lucide-react
```

**3. Configurar Supabase (30 min)**
- Ve a supabase.com → Sign up
- Crea proyecto nuevo (elige región cercana)
- Copia URL y Anon Key
- Crea `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=tu-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**4. Setup base de datos (30 min)**
- En Supabase → SQL Editor
- Copia y ejecuta `supabase-setup.sql`
- Verifica que tablas existen
- Crea buckets: `prototypes` (privado), `previews` (público)

**5. Verificar setup (15 min)**
```bash
npm run dev
# Abre http://localhost:3000
# Debe cargar sin errores
```

### Tarde (2-3 horas)

**6. Implementar login page (60 min)**
- Crear `app/login/page.tsx`
- Form con email/password
- Google OAuth
- Sign up toggle
- Error handling

**7. Crear componente Navigation (45 min)**
- Crear `components/Navigation.tsx`
- Detectar sesión de usuario
- Mostrar email del user
- Botón de logout
- Links dinámicos

**8. Crear lib/supabase.ts (30 min)**
- Cliente de Supabase
- Tipos TypeScript
- Helper functions

**9. Testing (15 min)**
- npm run dev
- Probar login funciona
- Probar logout funciona
- Probar navbar se actualiza

### Checklist Día 1
- [ ] Proyecto Next.js creado
- [ ] Dependencias instaladas
- [ ] `.env.local` configurado
- [ ] Supabase proyecto creado
- [ ] `supabase-setup.sql` ejecutado
- [ ] Storage buckets creados
- [ ] Login page funciona
- [ ] Google OAuth funciona (si configurado)
- [ ] Navigation muestra user
- [ ] Logout funciona
- [ ] npm run dev sin errores

### Commits sugeridos
```bash
git add .
git commit -m "Día 1: Setup, Auth y Navigation"
```

---

## 📅 Día 2: Upload de Prototipos (6-8 horas)

### Objetivo del Día
Usuarios pueden subir prototipos y guardar en Supabase + Storage.

### Mañana (3-4 horas)

**1. Crear página upload (90 min)**
- `app/upload/page.tsx`
- Proteger con autenticación
- Form con:
  - Título (required)
  - Descripción
  - Precio
  - Categoría (select)
  - Tech stack (multi-select)
  - Preview image (file input)
  - ZIP file (file input)
- Validaciones client-side

**2. Implementar file uploads (60 min)**
- Crear funciones en `lib/supabase.ts`:
  - `uploadFile(bucket, path, file)`
  - `getPublicFileUrl(bucket, path)`
- Upload a Storage buckets
- Manejo de errores

**3. Crear record en DB (45 min)**
- Función `createPrototype(data)`
- Insert en tabla `prototypes`
- Guardar:
  - creator_id
  - título, descripción, precio
  - category, tech_stack
  - preview_image_url, file_url
  - published = true

### Tarde (3-4 horas)

**4. Testing upload (60 min)**
- Logearse
- Ir a /upload
- Subir prototipo con todos los campos
- Verificar en Supabase:
  - Tabla `prototypes`: tiene nuevo record
  - Storage `previews`: archivo image
  - Storage `prototypes`: archivo ZIP
- Verificar URLs funcionan

**5. Mejorar UX (60 min)**
- Loading states
- Error messages
- Success message
- Disable inputs durante upload
- Progress visual

**6. Agregar datos de prueba (30 min)**
- Subir 3-5 prototipos como vendedor
- Variedad de categorías
- Diferentes precios ($9.99, $29.99, $99.99)
- Diferentes tech stacks

### Checklist Día 2
- [ ] Upload page creada y protegida
- [ ] Formulario completo con validaciones
- [ ] File upload a Storage funciona
- [ ] Metadata guardada en DB
- [ ] URLs son correctas
- [ ] Datos de prueba subidos
- [ ] Error handling implementado
- [ ] Loading states visibles
- [ ] npm run dev sin errores

### Commits sugeridos
```bash
git add .
git commit -m "Día 2: Upload de prototipos y Storage"
```

---

## 📅 Día 3: Marketplace y Detalle (6-8 horas)

### Objetivo del Día
Usuarios ven marketplace con prototipos, pueden buscar, filtrar, y ver detalles.

### Mañana (3-4 horas)

**1. Crear función getPrototypes (30 min)**
- `lib/supabase.ts`: `getPrototypes(limit, offset)`
- Query: SELECT * FROM prototypes WHERE published=true
- Order by created_at DESC
- Limit 20

**2. Implementar Marketplace Home (90 min)**
- `app/page.tsx`
- Hero section
- Search bar con input
- Filtros por categoría (buttons)
- Grid de prototipos (3 columnas)
- Card component:
  - Preview image
  - Título
  - Descripción (truncada)
  - Tech stack tags
  - Precio y rating
  - Link a detalle

**3. Agregar búsqueda y filtros (60 min)**
- Search state
- Filter por categoría
- Usar array `.filter()` local
- Actualizar grid dinámicamente
- Loading states

### Tarde (3-4 horas)

**4. Crear página detalle (120 min)**
- `app/prototype/[id]/page.tsx`
- Params dinámicos: [id]
- Función `getPrototypeById(id)`
- Mostrar:
  - Large preview image
  - Título grande
  - Descripción completa
  - Tech stack completo
  - Rating y download count
  - Categoría y fecha
  - Botón de compra (al lado)
  - Botón compartir
  - Checklists de features

**5. Implementar lógica de compra (90 min)**
- User no logeado: "Login para comprar"
- User logeado: Mostrar botón "Comprar"
- Click compra: ir a /api/checkout
- User que es creador: "Tu prototipo"
- User que ya compró: Botón "Descargar"

**6. Testing (30 min)**
- Ir a /
- Marketplace carga con prototipos
- Search funciona
- Filtros funcionan
- Click en prototipo abre detalle
- Detalle muestra toda la info correcta

### Checklist Día 3
- [ ] getPrototypes implementado
- [ ] Marketplace home cargay con prototipos
- [ ] Search funciona
- [ ] Filtros por categoría funcionan
- [ ] Grid responsive (mobile/tablet/desktop)
- [ ] Página detalle completa
- [ ] Lógica de "Comprar" vs "Descargar"
- [ ] Botón compartir funciona
- [ ] Loading states
- [ ] npm run dev sin errores

### Commits sugeridos
```bash
git add .
git commit -m "Día 3: Marketplace y detalle de prototipo"
```

---

## 📅 Día 4: Pagos con Stripe (6-8 horas)

### Objetivo del Día
Usuarios pueden comprar prototipos con Stripe, se guarda compra en DB.

### Mañana (3-4 horas)

**1. Configurar Stripe (45 min)**
- Ve a stripe.com
- Sign up y crea proyecto
- Obtén API keys (test mode)
- Copia NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
- Copia STRIPE_SECRET_KEY
- Pega en `.env.local`

**2. Crear API de checkout (120 min)**
- `app/api/checkout/route.ts`
- Método POST
- Recibe: { prototypeId, price, title }
- Crea Stripe Checkout Session
- Metadata: { prototypeId }
- Success URL: /success?session_id={CHECKOUT_SESSION_ID}
- Cancel URL: /prototype/[id]
- Response: { url: session.url }

**3. Implementar Purchase record (60 min)**
- Antes de redirect a Stripe:
- INSERT en tabla purchases:
  - buyer_id (user actual)
  - prototype_id
  - stripe_checkout_id (session.id)
  - amount (price)
  - status: 'pending'

### Tarde (3-4 horas)

**4. Integrar botón de compra (90 min)**
- En `/prototype/[id]`:
- Click "Comprar" → POST /api/checkout
- Stripe checkout se abre
- User paga con tarjeta
- Redirect a success o cancel
- Si success: UPDATE purchase status = 'completed'

**5. Habilitar descarga (75 min)**
- Crear función `checkUserPurchase(userId, prototypeId)`
- Query purchases table
- WHERE buyer_id=? AND prototype_id=? AND status='completed'
- Si existe: mostrar botón "Descargar"
- Click descargar: usar `supabase.storage.download()`

**6. Testing de pagos (45 min)**
- Logearse como buyer
- Ir a un prototipo
- Click "Comprar"
- Debe ir a Stripe checkout
- Usar tarjeta test: 4242 4242 4242 4242
- Exp: 12/34
- CVC: 567
- Completar compra
- Debe redirect a success
- Verificar en Supabase → purchases table
- Status debe ser 'completed'
- Botón "Descargar" debe aparecer en detalle

### Checklist Día 4
- [ ] Cuenta Stripe creada
- [ ] API keys en `.env.local`
- [ ] POST /api/checkout creado
- [ ] Stripe Session se crea
- [ ] Purchase record se guarda
- [ ] Botón "Comprar" funciona
- [ ] Stripe checkout abre
- [ ] Pago con tarjeta test funciona
- [ ] Purchase status actualiza a completed
- [ ] Botón "Descargar" aparece post-compra
- [ ] Archivo se descarga correctamente
- [ ] npm run dev sin errores

### Commits sugeridos
```bash
git add .
git commit -m "Día 4: Integración con Stripe y pagos"
```

---

## 📅 Día 5: Polish y Deploy (4-6 horas)

### Objetivo del Día
Hacer que se vea profesional y deployar en producción.

### Mañana (2-3 horas)

**1. UI/UX Polish (75 min)**
- Revisar colores (Tailwind)
- Tipografía consistente
- Espaciado uniforme
- Efectos hover suaves
- Responsive checks en mobile
- Dark mode? (opcional)

**2. Mejorar Performance (45 min)**
- Lazy load imágenes
- Optimize Next.js images
- Remove console.logs
- Minify CSS
- Code splitting automático

**3. Agregar meta tags y SEO (30 min)**
- Title y description
- OG tags para sharing
- Favicon
- robots.txt

### Tarde (2-3 horas)

**4. Deploy en Vercel (90 min)**
- Create repo en GitHub
- Push código
- Ve a vercel.com
- Import repo
- Vercel auto-detecta Next.js
- Configura variables de entorno:
  - NEXT_PUBLIC_SUPABASE_URL
  - NEXT_PUBLIC_SUPABASE_ANON_KEY
  - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  - STRIPE_SECRET_KEY
  - NEXT_PUBLIC_SITE_URL=https://yourdomain.vercel.app
- Deploy!

**5. Post-Deploy Configuration (60 min)**
- Actualizar URLs en Supabase:
  - Authentication → Redirect URLs
  - Agregar: `https://yourdomain.vercel.app/auth/callback`
- Actualizar URLs en Stripe:
  - Webhooks (si aplica)
  - Success/cancel URLs
- Testing completo en producción:
  - Login funciona
  - Upload funciona
  - Marketplace carga
  - Compra funciona

**6. Final touches (30 min)**
- Revisar no hay broken links
- Verificar responsiveness mobile
- Test en diferentes browsers
- Check performance (Lighthouse)

### Checklist Día 5
- [ ] UI se ve profesional
- [ ] Performance optimizado
- [ ] Meta tags configurados
- [ ] Repo en GitHub creado
- [ ] Deploy en Vercel exitoso
- [ ] Variables de entorno configuradas
- [ ] Supabase URLs actualizadas
- [ ] Stripe URLs actualizadas
- [ ] Testing completo en producción
- [ ] Lighthouse score > 80
- [ ] Sitio es públicamente accesible

### Commits sugeridos
```bash
git add .
git commit -m "Día 5: Polish, SEO y Deploy en producción"
```

---

## 🚀 Días 6-7: Lanzamiento y Primera Venta

### Día 6: Lanzamiento
**Mañana:**
- Preparar 5-10 prototipos de demo
- Escribir descripciones atractivas
- Tomar screenshots para marketing

**Tarde:**
- Tweet de lanzamiento
- Post en Product Hunt (si quieres)
- Post en Reddit (r/SideProject, r/webdev)
- Compartir en comunidades (Slack, Discord)

### Día 7: Growth y Primera Venta
- Responder a comentarios
- Recolectar feedback
- Monitorear métricas
- Hacer pequeñas mejoras basadas en feedback
- ¡PRIMERA VENTA! 🎉

---

## 📊 Testing Checklist por Día

### Día 1
```bash
✓ npm run dev funciona
✓ Home page carga
✓ Login page accesible
✓ Email/password login funciona
✓ Google OAuth funciona
✓ Logout funciona
✓ Navigation detecta user
```

### Día 2
```bash
✓ Upload page carga (protegida)
✓ Formulario valida inputs
✓ Preview image sube
✓ ZIP file sube
✓ Prototipo aparece en DB
✓ Archivos en Storage
✓ URLs funcionan
```

### Día 3
```bash
✓ Marketplace carga con prototipos
✓ Search filtra por título
✓ Filtros por categoría funcionan
✓ Detalle page carga
✓ Info del prototipo es correcta
✓ Botón "Comprar" visible
✓ Responsive en mobile
```

### Día 4
```bash
✓ Click Comprar → Stripe
✓ Stripe checkout se abre
✓ Pago se procesa
✓ Purchase se guarda
✓ Status actualiza a completed
✓ Botón Descargar aparece
✓ Descarga funciona
```

### Día 5
```bash
✓ Sitio carga en Vercel
✓ Sin errores en console
✓ Login funciona en prod
✓ Upload funciona en prod
✓ Compra funciona en prod
✓ Lighthouse > 80
✓ Mobile responsive
```

---

## 💪 Mejores Prácticas Vibe Coding

### Durante Implementación
1. **Ship first, perfect later**
   - No gastes tiempo perfeccionando el CSS ahora
   - Funcionalidad primero, design después

2. **Use IA generously**
   - Usa Claude, ChatGPT, Cursor para generar código
   - Pregunta por ejemplos
   - Déjate ayudar con debugging

3. **Commit frecuentemente**
   - Cada feature completada = 1 commit
   - Facilita revert si algo falla

4. **Test constantemente**
   - No esperes al final
   - Test cada feature cuando termines

5. **Ask for help**
   - Si te bloqueas 15 minutos, pide ayuda
   - Stack Overflow, Discord, ChatGPT

### Productividad
- **Pomodoros**: 25 min focus + 5 min break
- **Elimina distracciones**: Silenciar notificaciones
- **Toma notas**: Problemas encontrados, soluciones
- **Duerme bien**: Cerebro necesita descanso para ser creativo

---

## 🎯 Métricas Objetivo

### Fin Día 1
- Usuarios pueden logearse ✅

### Fin Día 2
- Usuarios pueden subir prototipos ✅

### Fin Día 3
- Marketplace visible con prototipos ✅

### Fin Día 4
- Compras funcionan ✅

### Fin Día 5
- Deploy en producción ✅

### Fin Día 6
- Lanzado en redes sociales ✅

### Fin Día 7
- Primera venta conseguida 🎉

---

## 📝 Notas Importantes

### Troubleshooting Rápido

**"Cannot read property"**
→ Usa optional chaining: `data?.property`

**Upload falla silenciosamente**
→ Chequea console.log de respuesta

**Login loop infinito**
→ Limpia cookies del navegador

**Stripe no funciona**
→ Verifica que estés en test mode

**Supabase falla**
→ Chequea RLS y credenciales

### Recursos Útiles
- Claude/ChatGPT para debugging
- Documentación oficial (Next.js, Supabase, Stripe)
- Stack Overflow para problemas específicos
- Discord communities para peer help

---

## 🏁 Final Status

Cuando termines el Día 5, deberías tener:

```
✅ MVP funcional en producción
✅ Usuarios pueden logearse
✅ Usuarios pueden subir prototipos
✅ Marketplace visible
✅ Pagos procesados
✅ Descarga habilitada
✅ Sitio públicamente accesible
✅ Google indexable (si quieres)
```

Ahora, a conseguir **primera venta en 7 días** 🚀

---

**Recuerda:** "Ship fast, iterate faster. Done is better than perfect."

¡Adelante! 💪
