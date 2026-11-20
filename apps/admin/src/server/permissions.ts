import type { AdminPermission } from '@hs/domain';
export function hasPermission(_perms: readonly AdminPermission[], _need: AdminPermission): boolean { return false; }
