// ============================================================
//  CONFIGURACIÓN — lo único que necesitas editar
// ============================================================

// 1) URL de tu Apps Script publicado como "Aplicación web"
//    (ver apps-script/README en este proyecto). Vacío = modo prueba:
//    el formulario no envía nada, solo lo muestra en la consola.
export const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz4r4bqasNZp9IBXQVLeYitTyIRDRLOwC8LaEKQeDZaocfnFPsSYuraunQFhRQaUx4i/exec';

// 2) Los links de Mercado Pago y el código de miembro YA NO van aquí:
//    viven en las "Propiedades del script" de tu Apps Script (ver README).
//    Así nadie puede verlos en el código de la página.

// 3) WhatsApp para recibir comprobantes (formato internacional, sin + ni espacios)
export const WHATSAPP_NUMBER = '529993318319';

// 4) Aviso de privacidad (obligatorio en México si recabas datos personales)
export const PRIVACY_URL = '#aviso-de-privacidad';

// Datos del evento
export const EVENT = {
  name: 'Fuerte desde la base',
  subtitle: 'Cuidado del suelo pélvico enfocado para mujeres',
  dateLong: 'Sábado 12 de diciembre',
  dateShort: 'Sáb 12 dic',
  time: '9:00 am – 12:00 pm',
  place: 'CrossFit Cupra',
  spots: 'Cupo limitado',
  instructor: 'Anakaren R. Tamayo',
  priceMember: 200,
  priceExternal: 300,
};
