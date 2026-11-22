import { APPS_SCRIPT_URL } from './config.js';

// Llama al Apps Script. Se envía como text/plain para evitar el "preflight" de CORS;
// Apps Script responde JSON y el navegador sí puede leerlo.
async function callScript(payload) {
  if (!APPS_SCRIPT_URL) {
    // Modo prueba (sin Apps Script): simula respuestas.
    console.warn('[Modo prueba] APPS_SCRIPT_URL vacío.', payload);
    await new Promise((r) => setTimeout(r, 500));
    if (payload.action === 'verificar') return { ok: true, valido: payload.codigo?.trim().toLowerCase() === 'prueba' };
    const miembro = payload.tipo === 'miembro';
    if (miembro && payload.codigo?.trim().toLowerCase() !== 'prueba') return { ok: false, error: 'codigo' };
    return { ok: true, folio: 'FDB-PRUEB', monto: miembro ? 200 : 300, tipo: payload.tipo, payLink: '#modo-prueba' };
  }
  const res = await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  return res.json();
}

export async function verifyMemberCode(codigo) {
  if (!codigo || !codigo.trim()) return false;
  const r = await callScript({ action: 'verificar', codigo });
  return !!r.valido;
}

export function register(data) {
  return callScript({ action: 'registrar', ...data });
}

export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
export const onlyDigits = (v) => v.replace(/\D/g, '');
