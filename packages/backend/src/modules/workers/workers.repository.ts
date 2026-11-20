import { Injectable } from '@nestjs/common';
@Injectable()
export class WorkersRepository {
  ping(): string { return 'workers-repo'; }
}
