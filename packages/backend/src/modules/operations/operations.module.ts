import { Module } from '@nestjs/common';
import { OperationsService } from './operations.service.js';
import { ReconciliationService } from './reconciliation.service.js';
import { SchedulerService } from '../../reliability/scheduling/scheduler.service.js';

@Module({ providers: [OperationsService, ReconciliationService, SchedulerService], exports: [OperationsService] })
export class OperationsModule {}
