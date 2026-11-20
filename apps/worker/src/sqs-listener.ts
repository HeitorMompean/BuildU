import { Injectable, OnModuleInit } from '@nestjs/common';
@Injectable()
export class SqsListener implements OnModuleInit {
  onModuleInit(): void { /* Round 8 polls SQS; shell does not connect */ }
  ping(): string { return 'sqs-listener'; }
}
