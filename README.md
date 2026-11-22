# Fuerte desde la base — Landing de registro

Landing para el taller de suelo pélvico en CrossFit Cupra.

**Flujo:** la persona llena el formulario → si es miembra escribe el código de Cupra ($200), si no, paga $300 → el registro cae en tu Google Sheet → ve su folio y el botón de Mercado Pago → te manda su comprobante por WhatsApp con el folio.

## Correr en local

```bash
npm install
npm run dev
```

## Lo que tienes que configurar (todo en `src/config.js`)

1. **Google Sheet**
   1. Crea una hoja nueva.
   2. Extensiones › Apps Script. Borra lo que haya y pega `apps-script/Code.gs`. Guarda.
   3. Implementar › Nueva implementación › Tipo: **Aplicación web**. Ejecutar como: **Yo**. Quién tiene acceso: **Cualquier persona**.
   4. Copia la URL que termina en `/exec` y pégala en `APPS_SCRIPT_URL`.
   5. Si cambias el script, vuelve a Implementar › Gestionar implementaciones › Editar › Nueva versión.
2. **Mercado Pago**: crea dos links de pago (Tu negocio › Link de pago), uno de $200 y otro de $300, y pégalos en `MP_LINK_MIEMBRA` y `MP_LINK_EXTERNA`.
3. **WhatsApp**: tu número en `WHATSAPP_NUMBER` (ej. `529991234567`).
4. **Código de miembra**: ya viene configurado con `CupraRulz2026`. Para cambiarlo:
   ```bash
   npm run hash -- "NuevoCodigo2026"
   ```
   y pega el resultado en `MEMBER_CODE_HASH`. No distingue mayúsculas.
5. **Aviso de privacidad**: pon el link en `PRIVACY_URL`.
6. **Bio de la instructora**: en `src/App.jsx`, edita el texto de `coach__bio`.

## Publicar

```bash
npm run build
```
Sube la carpeta `dist/` a Netlify, Vercel o Cloudflare Pages (arrastrar y soltar funciona).

## Importante

- **El código de miembra es una barrera ligera**: va cifrado (hash), no se lee a simple vista, pero alguien con conocimientos podría saltárselo o encontrar el link de $200. Revisa en la hoja que quien pagó $200 sea miembra.
- **Mercado Pago no se conecta automáticamente con la hoja**: los links de pago no avisan a tu web. Cruza los pagos con el folio del comprobante y marca la casilla "Pagado". Si después quieres confirmación automática, se necesita la API de Checkout Pro con un backend.
