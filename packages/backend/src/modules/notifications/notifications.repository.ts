import { Injectable } from '@nestjs/common';
@Injectable()
export class NotificationsRepository {
  ping(): string { return 'notifications-repo'; }
}
