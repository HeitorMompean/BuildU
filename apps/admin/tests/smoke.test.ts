import { describe, expect, it } from 'vitest';
import { ADMIN_FEATURES } from '../src/features/index.js';
describe('admin shell', () => { it('prewires dashboard', () => { expect(ADMIN_FEATURES).toContain('jobs'); }); });
