import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MessageHandler } from './message-handler.js';
import { SqsListener } from './sqs-listener.js';
import { OperationsModule } from '@hs/backend';

// Thin composition root for the SQS consumer. No business logic here.
@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), OperationsModule],
  providers: [MessageHandler, SqsListener],
})
export class WorkerModule {}
