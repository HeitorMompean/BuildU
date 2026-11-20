import { describe, expect, it } from 'vitest';
import { FEATURE } from '../src/features/jobs/index.js';
describe('mobile shell', () => { it('prewires features', () => { expect(FEATURE).toBe('jobs'); }); });
