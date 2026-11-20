export const ADMIN_PERMISSIONS = ['users:read','users:manage','workers:read','workers:verify','jobs:read','jobs:manage','media:read','media:moderate','reviews:moderate','disputes:read','disputes:resolve','payments:read','payments:reconcile','payments:refund','payouts:read','payouts:approve','payouts:settle','audit:read'] as const;
export type AdminPermission = (typeof ADMIN_PERMISSIONS)[number];
