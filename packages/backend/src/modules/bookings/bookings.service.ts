import { Injectable } from '@nestjs/common';
@Injectable()
export class BookingsService {
  ping(): string { return 'bookings'; }
}
