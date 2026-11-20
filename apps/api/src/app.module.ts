import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthController } from './health.controller.js';
import {
  AuditModule, AuthModule, BookingsModule, CatalogModule, DisputesModule,
  IdentityModule, JobsModule, LedgerModule, MatchingModule, MediaModule,
  NotificationsModule, OperationsModule, PaymentsModule, PayoutsModule,
  QuotesModule, ReviewsModule, WorkersModule,
} from '@hs/backend';

// Thin composition root: wires shared modules. No business logic here.
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule, IdentityModule, CatalogModule, WorkersModule, JobsModule,
    MatchingModule, QuotesModule, BookingsModule, PaymentsModule, LedgerModule,
    PayoutsModule, MediaModule, NotificationsModule, ReviewsModule, DisputesModule,
    AuditModule, OperationsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
