// Enforces runtime boundaries: domain stays pure; UI never imports backend.
import { execSync } from 'node:child_process';
const bad: string[] = [];
function grep(pattern: string, cwd: string): string {
  try { return execSync(`grep -rE "${pattern}" --include="*.ts" --include="*.tsx" . || true`, { cwd, encoding: 'utf8' }); }
  catch { return ''; }
}
const domainNest = grep('@nestjs|express', 'packages/domain/src');
if (domainNest.trim()) bad.push('packages/domain imports Nest/HTTP:\n' + domainNest);
const uiBackend = grep('@hs/backend', 'apps/mobile/src') + grep('@hs/backend', 'apps/mobile/app') + grep('@hs/backend', 'apps/admin/src');
if (uiBackend.trim()) bad.push('UI imports @hs/backend:\n' + uiBackend);
if (bad.length) { console.error(bad.join('\n')); process.exit(1); }
console.log('boundaries ok');
