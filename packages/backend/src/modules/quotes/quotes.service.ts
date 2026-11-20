import { Injectable } from '@nestjs/common';
@Injectable()
export class QuotesService {
  ping(): string { return 'quotes'; }
}
