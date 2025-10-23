# Quick Deploy Guide - HubLab to Netlify + hublab.dev

## 📋 Checklist Rápido

### 1. Preparar GitHub (5 minutos)

```bash
cd /Users/c/hublab

# Inicializar git
git init
git add .
git commit -m "Initial commit - HubLab marketplace"
git branch -M main

# Crear repo en GitHub:
# Ve a https://github.com/new
# Nombre: hublab
# Private o Public (tu elección)
# NO inicialices con README (ya lo tenemos)

# Conectar y pushear (reemplaza YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/hublab.git
git push -u origin main
```

### 2. Deploy en Netlify (10 minutos)

1. **Conectar GitHub:**
   - Ve a https://app.netlify.com/
   - Click "Add new site" → "Import an existing project"
   - Selecciona GitHub
   - Autoriza Netlify
   - Selecciona el repo `hublab`

2. **Configurar Build:**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Click "Deploy site"

3. **Añadir Variables de Entorno:**
   - Site settings → Environment variables
   - Add variables:
     ```
     NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
     NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
     SUPABASE_SERVICE_KEY=tu_service_key_de_supabase
     NEXT_PUBLIC_SITE_URL=https://hublab.dev
     ```
   - Trigger deploy → Clear cache and deploy

### 3. Configurar Dominio hublab.dev (15 minutos)

#### Opción A: DNS de Netlify (RECOMENDADO - más fácil)

**En Netlify:**
1. Domain settings → Add custom domain
2. Introduce `hublab.dev`
3. Click "Use Netlify DNS"
4. Netlify te dará 4 nameservers, ejemplo:
   ```
   dns1.p01.nsone.net
   dns2.p01.nsone.net
   dns3.p01.nsone.net
   dns4.p01.nsone.net
   ```

**En Namecheap:**
1. Login → Domain List → Manage `hublab.dev`
2. En la pestaña "Domain"
3. Nameservers → Custom DNS
4. Añade los 4 nameservers de Netlify
5. Save

**Espera:** 30 minutos a 24 horas para propagación DNS

#### Opción B: DNS Manual en Namecheap (más rápido pero más técnico)

**En Namecheap:**
1. Domain List → Manage → Advanced DNS
2. Elimina todos los records existentes
3. Añade estos records:

| Type | Host | Value | TTL |
|------|------|-------|-----|
| A Record | @ | 75.2.60.5 | Automatic |
| CNAME | www | tu-sitio-123.netlify.app | Automatic |

**Obtener tu URL de Netlify:**
- En Netlify: Domain settings → busca "Default subdomain"
- Ejemplo: `hublab-123abc.netlify.app`

### 4. SSL/HTTPS (Automático)

Una vez el DNS esté configurado:
1. Netlify → Domain settings → HTTPS
2. "Verify DNS configuration"
3. Netlify provisionará SSL automáticamente (Let's Encrypt)
4. Activa "Force HTTPS"

### 5. Configurar Supabase (5 minutos)

Ve a tu proyecto Supabase → SQL Editor y ejecuta:

```sql
-- Crear tabla waitlist
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notified BOOLEAN DEFAULT FALSE,
  notified_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_waitlist_email ON waitlist(email);
CREATE INDEX idx_waitlist_created_at ON waitlist(created_at DESC);

ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can join waitlist" ON waitlist
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can view waitlist" ON waitlist
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Service role can update waitlist" ON waitlist
  FOR UPDATE TO service_role USING (true);
```

## ✅ Verificación Post-Deploy

Abre estos URLs y verifica:

- [ ] https://hublab.dev - Landing page carga
- [ ] https://hublab.dev/waitlist - Formulario funciona
- [ ] https://hublab.dev/marketplace - Muestra prototipos
- [ ] https://hublab.dev/terms - Página legal
- [ ] https://hublab.dev/privacy - Política privacidad
- [ ] https://hublab.dev/cookie-policy - Cookies
- [ ] SSL funciona (candado verde)
- [ ] www.hublab.dev redirige a hublab.dev

## 🐛 Troubleshooting

### "Site not found" después de configurar dominio
- Espera 5-10 minutos y refresca
- Verifica que el dominio esté correctamente escrito
- Check DNS: `dig hublab.dev`

### Build falla en Netlify
- Revisa "Deploy log" en Netlify
- Verifica que todas las env variables estén configuradas
- Asegúrate que no falta ninguna dependencia en package.json

### Formulario waitlist no funciona
- Verifica env variables de Supabase en Netlify
- Comprueba que ejecutaste el SQL en Supabase
- Revisa la consola del navegador (F12) para errores

### DNS no propaga
- Usa https://dnschecker.org/ para verificar propagación
- Espera hasta 48 horas (normalmente 1-4 horas)
- Verifica nameservers en Namecheap

## 📊 Monitoreo

- **Netlify Analytics:** Analytics → Site overview
- **Supabase Dashboard:** Table editor → waitlist
- **Deploy Logs:** Deploys → Click en deploy → Ver log

## 🔄 Actualizar el sitio

```bash
cd /Users/c/hublab

# Hacer cambios en el código
# ...

# Commitear y pushear
git add .
git commit -m "Descripción de cambios"
git push

# Netlify auto-deploiará en ~2 minutos
```

## 📞 Soporte

- **Netlify:** https://answers.netlify.com/
- **Namecheap:** https://www.namecheap.com/support/
- **Supabase:** https://supabase.com/docs

---

## Tiempo Total Estimado: ~35 minutos
- GitHub: 5 min
- Netlify: 10 min
- DNS: 15 min
- Supabase: 5 min

**La propagación DNS puede tomar hasta 24h, pero normalmente 1-4 horas.**
