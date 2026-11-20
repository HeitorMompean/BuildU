import { describe, expect, it } from 'vitest';
import { loadConfiguration } from '../src/config/configuration.js';
import { emptyPage } from '../src/common/pagination/pagination.js';

describe('backend shell', () => {
  it('loads config without secrets', () => {
    const cfg = loadConfiguration({ NODE_ENV: 'test' } as NodeJS.ProcessEnv);
    expect(cfg.port).toBe(8080);
  });
  it('returns empty pages', () => {
    expect(emptyPage().items).toEqual([]);
  });
});
