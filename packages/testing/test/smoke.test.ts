import { describe, expect, it } from 'vitest';
import { syntheticId } from '../src/fixtures/synthetic.js';
describe('testing shell', () => { it('makes synthetic ids', () => { expect(syntheticId('job')).toContain('job'); }); });
