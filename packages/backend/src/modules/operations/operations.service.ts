import { Injectable } from '@nestjs/common';
@Injectable()
export class OperationsService {
  ping(): string { return 'operations'; }
}
