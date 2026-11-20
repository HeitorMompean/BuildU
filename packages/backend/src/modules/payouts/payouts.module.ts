import { Module } from '@nestjs/common';
import { PayoutsController } from './payouts.controller.js';
import { PayoutsService } from './payouts.service.js';
import { PayoutsRepository } from './payouts.repository.js';

@Module({ controllers: [PayoutsController], providers: [PayoutsService, PayoutsRepository], exports: [PayoutsService] })
export class PayoutsModule {}
