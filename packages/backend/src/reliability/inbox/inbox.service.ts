import { Injectable } from '@nestjs/common';
@Injectable()
export class InboxService {
  async seen(_key: string): Promise<boolean> { return false; }
}
