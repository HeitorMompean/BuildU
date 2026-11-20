import { Injectable } from '@nestjs/common';
@Injectable()
export class PayoutsRepository {
  ping(): string { return 'payouts-repo'; }
}
