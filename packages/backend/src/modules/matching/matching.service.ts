import { Injectable } from '@nestjs/common';
@Injectable()
export class MatchingService {
  ping(): string { return 'matching'; }
}
