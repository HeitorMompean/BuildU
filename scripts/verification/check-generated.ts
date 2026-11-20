// Fails if generated client output is dirty. Round 4 wires full regeneration.
import { execSync } from 'node:child_process';
try {
  const out = execSync('git status --porcelain -- packages/api-client/src/generated packages/api-client/openapi/openapi.json', { encoding: 'utf8' });
  if (out.trim()) { console.error('generated output dirty:\n' + out); process.exit(1); }
  console.log('generated output clean');
} catch (e) { console.error(e); process.exit(1); }
