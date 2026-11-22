/**
 * Backend de la landing "Fuerte desde la base".
 * - Valida el código de miembro (nunca viaja a la página).
 * - Guarda el registro en la hoja.
 * - Devuelve el link de pago correcto según el tipo validado.
 *
 * CONFIGURACIÓN (una sola vez): Configuración del proyecto (engrane) › Propiedades del script › Agregar:
 *   MEMBER_CODE      → el código de miembros, ej. CupraRulz2026 (no distingue mayúsculas)
 *   MP_LINK_MIEMBRO  → link de Mercado Pago de $200
 *   MP_LINK_EXTERNO  → link de Mercado Pago de $300
 *   SHEET_ID         → (opcional) ID de la hoja, solo si el script NO se creó desde la hoja
 */

const SHEET_NAME = 'Registros';
const HEADERS = ['Fecha', 'Folio', 'Nombre', 'WhatsApp', 'Correo', 'Disciplina', 'Tipo', 'Monto', 'Pagado'];
const PRECIO_MIEMBRO = 200;
const PRECIO_EXTERNO = 300;
const MAX_FALLOS = 30; // intentos de código fallidos permitidos cada 10 minutos (contra adivinanzas)

function props() { return PropertiesService.getScriptProperties(); }

function getSS() {
  const id = props().getProperty('SHEET_ID');
  return id ? SpreadsheetApp.openById(id) : SpreadsheetApp.getActiveSpreadsheet();
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// Abre la URL /exec en incógnito: debe decir OK.
function doGet() {
  return ContentService.createTextOutput('OK: el script está publicado y acepta registros.');
}

function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents);
    if (d.action === 'verificar') {
      return json({ ok: true, valido: codigoValido(d.codigo) });
    }
    return json(registrar(d));
  } catch (err) {
    return json({ ok: false, error: 'servidor', detalle: String(err) });
  }
}

function codigoValido(codigo) {
  const cache = CacheService.getScriptCache();
  const fallos = Number(cache.get('fallos') || 0);
  if (fallos >= MAX_FALLOS) return false;

  const real = String(props().getProperty('MEMBER_CODE') || '').trim().toLowerCase();
  const ok = !!real && String(codigo || '').trim().toLowerCase() === real;
  if (!ok) cache.put('fallos', String(fallos + 1), 600);
  return ok;
}

function registrar(d) {
  // Validaciones mínimas del lado del servidor
  const nombre = clean(d.nombre);
  const whatsapp = String(d.whatsapp || '').replace(/\D/g, '');
  const email = clean(d.email).toLowerCase();
  if (nombre.length < 3 || whatsapp.length !== 10 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return { ok: false, error: 'datos' };
  }

  const quiereMiembro = d.tipo === 'miembro';
  if (quiereMiembro && !codigoValido(d.codigo)) {
    return { ok: false, error: 'codigo' };
  }

  const p = props();
  const esMiembro = quiereMiembro; // ya validado arriba
  const monto = esMiembro ? PRECIO_MIEMBRO : PRECIO_EXTERNO;
  const payLink = esMiembro ? p.getProperty('MP_LINK_MIEMBRO') : p.getProperty('MP_LINK_EXTERNO');
  const folio = nuevoFolio();

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const ss = getSS();
    let sh = ss.getSheetByName(SHEET_NAME);
    if (!sh) {
      sh = ss.insertSheet(SHEET_NAME);
      sh.appendRow(HEADERS);
      sh.setFrozenRows(1);
    }
    sh.appendRow([
      new Date(), folio, nombre, "'" + whatsapp, email, clean(d.disciplina),
      esMiembro ? 'Miembro Cupra (código validado)' : 'Externo', monto, false,
    ]);
    sh.getRange(sh.getLastRow(), 9).insertCheckboxes();
  } finally {
    lock.releaseLock();
  }

  return { ok: true, folio: folio, monto: monto, tipo: esMiembro ? 'miembro' : 'externo', payLink: payLink };
}

function nuevoFolio() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < 5; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return 'FDB-' + s;
}

// Evita que alguien meta fórmulas en la hoja (=, +, -, @ al inicio)
function clean(v) {
  const s = String(v == null ? '' : v).trim().slice(0, 200);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

// Prueba desde el editor: debe agregar una fila "Prueba" y mostrar el resultado en el registro.
function probar() {
  Logger.log(registrar({ nombre: 'Prueba', whatsapp: '9990000000', email: 'prueba@test.com', disciplina: 'CrossFit', tipo: 'externo' }));
  Logger.log('Código correcto: ' + codigoValido(props().getProperty('MEMBER_CODE')));
}
