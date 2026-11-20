import { Injectable } from '@nestjs/common';
@Injectable()
export class JobsRepository {
  ping(): string { return 'jobs-repo'; }
}
