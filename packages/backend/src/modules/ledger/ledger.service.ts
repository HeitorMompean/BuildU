import { Injectable } from '@nestjs/common';
@Injectable()
export class LedgerService {
  ping(): string { return 'ledger'; }
}
