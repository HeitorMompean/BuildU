import { Injectable } from '@nestjs/common';
@Injectable()
export class AuditRepository {
  ping(): string { return 'audit-repo'; }
}
