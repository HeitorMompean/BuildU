import { Injectable } from '@nestjs/common';
@Injectable()
export class IdempotencyService {
  async get(_key: string): Promise<unknown> { return null; }
}
