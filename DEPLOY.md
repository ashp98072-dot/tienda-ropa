# Desplegar I NEED YOU (GitHub + Vercel + 1 Supabase)

Este proyecto es **la tienda simple** (no CommerceCore).  
Un cliente → un catálogo → un panel admin → **un solo proyecto Supabase**.

---

## 1. Un proyecto en Supabase (solo uno)

1. Entra a [supabase.com](https://supabase.com) → **New project** (ej. `ineedyougt`).
2. SQL Editor → New query → pega todo el archivo `supabase/schema.sql` → **Run**.
3. Settings → API → copia:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `service_role` (secret) → `SUPABASE_SERVICE_ROLE_KEY`

> Si ya creaste 3 proyectos por el otro sistema, usa **uno** nuevo limpio para esta tienda y archiva/borra los demás cuando quieras.

---

## 2. Variables de entorno

Copia `.env.example` → `.env.local` y completa:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_WHATSAPP=502XXXXXXXX
ADMIN_PASSWORD=tu-clave-segura
ADMIN_SESSION_SECRET=otro-secreto-largo

NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# QPayPro cuando lo tengas
QPAYPRO_ENVIRONMENT=sandbox
QPAYPRO_X_LOGIN=...
QPAYPRO_X_API_KEY=...
QPAYPRO_DEMO_MODE=false
```

---

## 3. Local

```bash
npm install
npm run dev
```

- Tienda: http://localhost:3000  
- Admin: http://localhost:3000/admin  
- En admin → **Cargar productos demo** (si la DB está vacía)  
- Crear producto → subir imagen desde el formulario

---

## 4. GitHub

```bash
git add .
git commit -m "Tienda I NEED YOU lista para Vercel y Supabase"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/ineedyougt.git
git push -u origin main
```

(Crea el repo vacío en GitHub antes, o usa `gh repo create`.)

---

## 5. Vercel

1. [vercel.com](https://vercel.com) → Import del repo.
2. Framework: Next.js (automático).
3. Environment Variables: las mismas del `.env.local` (con `NEXT_PUBLIC_SITE_URL=https://tu-dominio.vercel.app`).
4. Deploy.

Luego en Supabase / QPayPro usa esa URL pública para callbacks.

---

## Qué puede hacer el cliente (Shannon)

| Acción | Dónde |
|--------|--------|
| Cambiar / subir fotos | Admin → Productos → editar → subir imagen |
| Precio, tallas, colores | Admin → Productos |
| Ocultar producto | Desmarcar “Visible en tienda” |
| Ver pedidos / marcar enviado | Admin → Pedidos |

---

## CommerceCore GT.zip

No lo uses para este cliente. Era un sistema más grande y te complicó con varios Supabase.  
**Este repo (`Tienda`) es el que va a GitHub + Vercel.**
