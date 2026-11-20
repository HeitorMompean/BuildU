import { Injectable } from '@nestjs/common';
@Injectable()
export class OutboxService {
  async enqueue(_event: unknown): Promise<void> { /* Round 7 implements */ }
}
