# Manual I NEED YOU — Shannon / operación

## Accesos

| Qué | Dónde |
|-----|--------|
| Tienda | `https://tudominio.com` |
| Admin | `https://tudominio.com/admin` |
| Contraseña admin | variable `ADMIN_PASSWORD` (local default: `ineedyou-admin`) |

## Cómo publicar un producto

1. Entra a **/admin** con la contraseña.
2. **Productos → Nuevo producto**.
3. Completa nombre, precio (Q), descripción, imagen (URL), segmento, género, categoría, tallas y colores.
4. Marca **Nuevo** / **Destacado** si aplica.
5. Guarda. Aparece en la tienda de inmediato.

**Tip:** sube fotos a un hosting (Cloudinary, Imgur, o carpeta del servidor) y pega la URL.

## Cómo gestionar un pedido

1. Ve a **Admin → Pedidos**.
2. Estados útiles:
   - `cod` / `awaiting_transfer` / `pending_payment` → recién creado
   - `paid` → tarjeta confirmada
   - `processing` → preparando
   - `shipped` → enviado
   - `delivered` → entregado
   - `cancelled` / `failed` → anulado

3. Contacta al cliente por WhatsApp con el número del pedido.

## Pagos

- **Tarjeta:** QPayPro (sandbox o producción según `.env`).
- **Contra entrega** y **transferencia:** el pedido queda registrado; confirmas el pago manualmente.

## Antes de lanzar (go-live)

1. Dominio + HTTPS.
2. `NEXT_PUBLIC_SITE_URL=https://tudominio.com`
3. `NEXT_PUBLIC_WHATSAPP=502XXXXXXXX` (sin + ni espacios)
4. Credenciales QPayPro de producción.
5. SMTP o Resend para correos reales.
6. Cambiar `ADMIN_PASSWORD` y `ADMIN_SESSION_SECRET`.
7. Cargar productos reales (fotos propias).
8. Pasar el **Checklist QA** en `/admin/qa`.

## Soporte técnico

Pedidos y catálogo se guardan en la carpeta `.data/` del servidor (haz backup).
Para pasar a base de datos (Postgres) más adelante, se puede migrar sin cambiar la experiencia de la tienda.
