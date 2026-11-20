export interface AuditContext { readonly actorId: string; readonly requestId: string; }
export function auditContext(requestId: string): AuditContext { return { actorId: 'unknown', requestId }; }
