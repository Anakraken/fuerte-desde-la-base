// Uso: npm run hash -- "CupraRulz2026"
import { createHash } from 'node:crypto';

const code = process.argv[2];
if (!code) {
  console.error('Escribe el código:  npm run hash -- "TuCodigo"');
  process.exit(1);
}
const hash = createHash('sha256')
  .update('fuerte-desde-la-base:' + code.trim().toLowerCase())
  .digest('hex');
console.log('\nPega esto en src/config.js como MEMBER_CODE_HASH:\n');
console.log(hash + '\n');
