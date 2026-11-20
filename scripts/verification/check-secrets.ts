// Fails on likely secret values in tracked files (placeholders allowed).
import { execSync } from 'node:child_process';
const patterns = ['AKIA[0-9A-Z]{16}', 'xox[bap]-', 'sk_live_', '-----BEGIN [A-Z ]*PRIVATE KEY-----'];
const out = execSync(`git grep -nE "${patterns.join('|')}" -- . || true`, { encoding: 'utf8' });
const hits = out.trim().split('\n').filter((l) => l && !l.includes('check-secrets.ts'));
if (hits.length) { console.error('possible secrets:\n' + hits.join('\n')); process.exit(1); }
console.log('no secret values found');
