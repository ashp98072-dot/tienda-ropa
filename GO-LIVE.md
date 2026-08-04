# Go-live checklist — INEEDYOUGT

## 1. Infraestructura
- [ ] Dominio apuntando al hosting (Vercel / VPS)
- [ ] HTTPS activo
- [ ] Variables de entorno de producción cargadas

## 2. Variables mínimas

```env
NEXT_PUBLIC_SITE_URL=https://tudominio.com
NEXT_PUBLIC_WHATSAPP=502XXXXXXXX
ADMIN_PASSWORD=********
ADMIN_SESSION_SECRET=********
QPAYPRO_ENVIRONMENT=production
QPAYPRO_X_LOGIN=...
QPAYPRO_X_API_KEY=...
QPAYPRO_DEMO_MODE=false
ORDER_NOTIFY_EMAIL=pedidos@tudominio.com
# + Resend o SMTP
```

## 3. Negocio
- [ ] Afiliación QPayPro / VisaNet aprobada
- [ ] Cuenta bancaria para transferencias definida
- [ ] Tarifas de envío validadas con Shannon (`src/lib/shipping.ts`)
- [ ] Catálogo real cargado desde `/admin/productos`
- [ ] Pedido de prueba con tarjeta de bajo monto
- [ ] Pedido COD de prueba

## 4. QA
Completar `/admin/qa` en producción.

## 5. Entrega a Shannon
- [ ] Enviar accesos admin
- [ ] Revisar `MANUAL-CLIENTE.md` juntos (15–20 min)
- [ ] Primeros 7 días: monitorear pedidos y errores de pago
