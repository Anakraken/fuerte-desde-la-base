import { MEMBER_CODE_HASH, APPS_SCRIPT_URL } from './config.js';

export async function sha256Hex(text) {
  const data = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function isValidMemberCode(code) {
  if (!code || !code.trim()) return false;
  const hash = await sha256Hex('fuerte-desde-la-base:' + code.trim().toLowerCase());
  return hash === MEMBER_CODE_HASH;
}

export function makeFolio() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < 5; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return 'FDB-' + s;
}

// Apps Script no devuelve CORS, por eso se envía como text/plain en modo no-cors.
// El registro llega a la hoja aunque el navegador no pueda leer la respuesta.
export async function sendRegistration(payload) {
  if (!APPS_SCRIPT_URL) {
    console.warn('[Modo prueba] APPS_SCRIPT_URL vacío. Registro no enviado:', payload);
    await new Promise((r) => setTimeout(r, 600));
    return;
  }
  await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
  });
}

export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
export const onlyDigits = (v) => v.replace(/\D/g, '');
