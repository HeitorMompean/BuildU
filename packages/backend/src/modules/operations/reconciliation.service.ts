import { Injectable } from '@nestjs/common';
@Injectable()
export class ReconciliationService {
  ping(): string { return 'reconciliation'; }
}
