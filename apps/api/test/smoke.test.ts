import { describe, expect, it } from 'vitest';
import { loadApiConfig } from '../src/config.js';
describe('api shell', () => {
  it('loads config', () => { expect(loadApiConfig({} as NodeJS.ProcessEnv).PORT).toBe(8080); });
});
