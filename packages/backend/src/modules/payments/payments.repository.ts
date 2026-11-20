import { Injectable } from '@nestjs/common';
@Injectable()
export class PaymentsRepository {
  ping(): string { return 'payments-repo'; }
}
