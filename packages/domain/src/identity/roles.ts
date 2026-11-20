export const ROLES = ['customer', 'worker', 'admin'] as const;
export type Role = (typeof ROLES)[number];
