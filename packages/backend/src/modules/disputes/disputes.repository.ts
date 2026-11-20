import { Injectable } from '@nestjs/common';
@Injectable()
export class DisputesRepository {
  ping(): string { return 'disputes-repo'; }
}
