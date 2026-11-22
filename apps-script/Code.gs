/**
 * Recibe los registros de la landing "Fuerte desde la base" y los guarda en la hoja.
 * Pégalo en tu Google Sheet: Extensiones › Apps Script.
 */
const SHEET_NAME = 'Registros';
const HEADERS = ['Fecha', 'Folio', 'Nombre', 'WhatsApp', 'Correo', 'Disciplina', 'Tipo', 'Monto', 'Pagado'];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const d = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sh = ss.getSheetByName(SHEET_NAME);
    if (!sh) {
      sh = ss.insertSheet(SHEET_NAME);
      sh.appendRow(HEADERS);
      sh.setFrozenRows(1);
    }
    sh.appendRow([
      new Date(),
      clean(d.folio),
      clean(d.nombre),
      "'" + clean(d.whatsapp), // como texto, para que no se pierdan dígitos
      clean(d.email),
      clean(d.disciplina),
      clean(d.tipo),
      Number(d.monto) || '',
      false, // márcalo cuando confirmes el pago
    ]);
    sh.getRange(sh.getLastRow(), 9).insertCheckboxes();
    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// Evita que alguien meta fórmulas en la hoja (=, +, -, @ al inicio)
function clean(v) {
  const s = String(v == null ? '' : v).slice(0, 200);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}
