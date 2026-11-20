import { Injectable } from '@nestjs/common';
@Injectable()
export class MatchingRepository {
  ping(): string { return 'matching-repo'; }
}
