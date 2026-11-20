import { Injectable } from '@nestjs/common';
@Injectable()
export class BookingsRepository {
  ping(): string { return 'bookings-repo'; }
}
