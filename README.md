# Fuerte desde la base — Landing de registro

Landing mobile first (React + Vite) para el taller de suelo pélvico en CrossFit Cupra.

**Flujo:** la persona llena el formulario → si es miembra escribe el código de Cupra ($200), si no, paga $300 → el registro cae en tu Google Sheet → ve su folio y el botón de Mercado Pago → te manda su comprobante por WhatsApp con el folio.

## Correr en local

```bash
npm install
npm run dev
```

## Lo que tienes que configurar

### En Apps Script (backend — aquí viven los datos sensibles)
1. Pega `apps-script/Code.gs` en tu Apps Script (Extensiones › Apps Script desde la hoja).
2. **Configuración del proyecto (engrane) › Propiedades del script › Agregar propiedad**:
   | Propiedad | Valor |
   |---|---|
   | `MEMBER_CODE` | el código de miembros (no distingue mayúsculas) |
   | `MP_LINK_MIEMBRO` | link de Mercado Pago de $200 |
   | `MP_LINK_EXTERNO` | link de Mercado Pago de $300 |
   | `SHEET_ID` | (opcional) solo si el script no se creó desde la hoja |
3. Corre `probar` desde el editor: debe agregar una fila "Prueba".
4. **Implementar › Gestionar implementaciones › Editar › Nueva versión**, acceso: **Cualquier persona**.

Para cambiar el código o los links después, solo cambia la propiedad. No hay que tocar la página ni publicar de nuevo.

### En la página (`src/config.js`)
- `APPS_SCRIPT_URL`: la URL `/exec`.
- `WHATSAPP_NUMBER`, `PRIVACY_URL` y los datos del evento.
- Sin `APPS_SCRIPT_URL` la página funciona en modo prueba (código de prueba: `prueba`).

## Publicar (Vercel)

1. El repo vive en GitHub: `Anakraken/fuerte-desde-la-base`.
2. En vercel.com: **Add New › Project › Import** el repo. Vercel detecta Vite solo
   (Build: `npm run build`, Output: `dist`). Deploy.
3. Cada push a `main` se publica automáticamente. El dominio propio se conecta en
   **Settings › Domains**.

## Importante

- **El código de miembro y los links de pago viven solo en Apps Script**: la página no los conoce; el link de $200 solo se entrega si el servidor valida el código. Si alguien adivina mal más de 30 veces en 10 minutos, se bloquean los intentos temporalmente. Riesgo que queda: que un miembro comparta el código o el link de $200; en la hoja, la columna Tipo dice "Miembro Cupra (código validado)".
- **Mercado Pago no se conecta automáticamente con la hoja**: los links de pago no avisan a tu web. Cruza los pagos con el folio del comprobante y marca la casilla "Pagado". Si después quieres confirmación automática, se necesita la API de Checkout Pro con un backend.
