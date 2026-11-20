import { Injectable } from '@nestjs/common';
@Injectable()
export class NotificationsService {
  ping(): string { return 'notifications'; }
}
