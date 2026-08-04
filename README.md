# I NEED YOU (INEEDYOUGT)

Tienda online de ropa para niños, adolescentes y adultos — Guatemala.

## Stack

- **Next.js 16** + React 19 + Tailwind CSS 4
- Catálogo con filtros, wishlist, búsqueda
- Carrito + checkout con **QPayPro** (tarjeta), contra entrega y transferencia

## Cómo correr

```bash
cp .env.example .env.local
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

### QPayPro (tarjeta)

1. Copia `.env.example` → `.env.local`
2. Sandbox por defecto: `visanetgt_qpay` / `88888888888`
3. `QPAYPRO_DEMO_MODE=false` redirige a hosted checkout de QPayPro
4. `QPAYPRO_DEMO_MODE=true` usa `/pago/demo` (simulación local)
5. En producción: URL pública en `NEXT_PUBLIC_SITE_URL` (el relay necesita HTTPS accesible)

Flujo tarjeta: Checkout → `POST /api/orders` → token QPayPro → redirect `/checkout/store/{token}` → relay → confirmación.

## Rutas

| Ruta | Descripción |
|------|-------------|
| `/` | Home |
| `/tienda` | Catálogo + filtros + búsqueda |
| `/producto/[slug]` | Ficha |
| `/deseos` | Wishlist |
| `/carrito` | Bolsa |
| `/checkout` | Pago |
| `/pago/demo` | Simulación QPayPro |
| `/pedido-confirmado` | Confirmación |
| `/api/orders` | Crear pedido |
| `/api/payments/qpaypro/relay` | Callback QPayPro |

### Envíos y correos (Fase 4)

- Tarifas por zona GT + retiro en tienda + envío gratis desde Q500
- Páginas `/envios`, `/devoluciones`, `/privacidad`, `/contacto`
- Emails de pedido (consola en dev; Resend o SMTP en prod — ver `.env.example`)

### Admin (Fase 5)

- URL: [/admin](http://localhost:3000/admin) — password default `ineedyou-admin`
- Crear/editar productos, subir fotos, gestionar pedidos
- Manual Shannon: `MANUAL-CLIENTE.md`
- **Deploy GitHub + Vercel + 1 Supabase:** `DEPLOY.md`
