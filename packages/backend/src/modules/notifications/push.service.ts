import { Injectable } from '@nestjs/common';
@Injectable()
export class PushService {
  ping(): string { return 'push'; }
}
