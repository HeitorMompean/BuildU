import { Injectable } from '@nestjs/common';
@Injectable()
export class SqsService {
  ping(): string { return 'sqs'; }
}
