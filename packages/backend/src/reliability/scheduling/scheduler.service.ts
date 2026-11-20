import { Injectable } from '@nestjs/common';
@Injectable()
export class SchedulerService {
  ping(): string { return 'scheduler'; }
}
