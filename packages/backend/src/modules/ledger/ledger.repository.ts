import { Injectable } from '@nestjs/common';
@Injectable()
export class LedgerRepository {
  ping(): string { return 'ledger-repo'; }
}
