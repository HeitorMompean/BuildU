import { Injectable } from '@nestjs/common';
@Injectable()
export class QuotesRepository {
  ping(): string { return 'quotes-repo'; }
}
