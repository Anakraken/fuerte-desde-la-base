// ============================================================
//  CONFIGURACIÓN — lo único que necesitas editar
// ============================================================

// 1) URL de tu Apps Script publicado como "Aplicación web"
//    (ver apps-script/README en este proyecto). Vacío = modo prueba:
//    el formulario no envía nada, solo lo muestra en la consola.
export const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz4r4bqasNZp9IBXQVLeYitTyIRDRLOwC8LaEKQeDZaocfnFPsSYuraunQFhRQaUx4i/exec';

// 2) Links de pago de Mercado Pago (Tu negocio › Link de pago)
export const MP_LINK_MIEMBRA = 'https://mpago.la/2LopZGW';
export const MP_LINK_EXTERNA = 'https://mpago.la/2BAbgfb';

// 3) Hash del código de miembra. Nunca pongas el código en texto plano.
//    Para cambiarlo:  npm run hash -- "TuNuevoCodigo"  y pega el resultado aquí.
//    Valor actual = hash de "CupraRulz2026" (no distingue mayúsculas/minúsculas).
export const MEMBER_CODE_HASH =
  'bdf6fe0f8ea612cc50be2caa3af8caca8603a385bae7263d569dd824a9caad0d';

// 4) WhatsApp para recibir comprobantes (formato internacional, sin + ni espacios)
export const WHATSAPP_NUMBER = '529993318319';

// 5) Aviso de privacidad (obligatorio en México si recabas datos personales)
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
