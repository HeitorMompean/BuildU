import { Injectable } from '@nestjs/common';
@Injectable()
export class AuditService {
  async record(_event: unknown): Promise<void> { /* append-only; rounds fill */ }
}
