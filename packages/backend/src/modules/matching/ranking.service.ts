import { Injectable } from '@nestjs/common';
@Injectable()
export class RankingService {
  ping(): string { return 'ranking'; }
}
