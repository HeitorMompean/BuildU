import { vi } from 'vitest';
// Shared stub factory placeholder. Round 2+ adds fixtures via @hs/testing.
export function stub<T extends object>(overrides: Partial<T> = {}): T { return { ...overrides } as T; }
export { vi };
