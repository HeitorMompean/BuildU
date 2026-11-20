import { Injectable } from '@nestjs/common';
// Durable handler shell. Round 8 implements inbox/dedupe/retry/DLQ.
@Injectable()
export class MessageHandler {
  async handle(_message: unknown): Promise<void> { /* no-op shell */ }
}
