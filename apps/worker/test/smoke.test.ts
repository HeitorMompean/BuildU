import { describe, expect, it } from 'vitest';
import { loadWorkerConfig } from '../src/config.js';
describe('worker shell', () => { it('loads config', () => { expect(loadWorkerConfig({} as NodeJS.ProcessEnv).APP_ENV).toBe('staging'); }); });
