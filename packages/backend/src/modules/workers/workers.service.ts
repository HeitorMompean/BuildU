import { Injectable } from '@nestjs/common';
@Injectable()
export class WorkersService {
  ping(): string { return 'workers'; }
}
