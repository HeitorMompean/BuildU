import { Injectable } from '@nestjs/common';
@Injectable()
export class PayoutsService {
  ping(): string { return 'payouts'; }
}
