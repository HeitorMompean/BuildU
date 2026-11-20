import { describe, expect, it } from 'vitest';
import { createClient } from '../src/index.js';
describe('api-client shell', () => {
  it('builds a client', () => {
    const c = createClient({ baseUrl: 'http://localhost:8080' });
    expect(typeof c.healthLive).toBe('function');
  });
});
