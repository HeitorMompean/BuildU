import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller.js';
import { BookingsService } from './bookings.service.js';
import { BookingsRepository } from './bookings.repository.js';

@Module({ controllers: [BookingsController], providers: [BookingsService, BookingsRepository], exports: [BookingsService] })
export class BookingsModule {}
