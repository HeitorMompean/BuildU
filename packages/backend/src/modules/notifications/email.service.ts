import { Injectable } from '@nestjs/common';
@Injectable()
export class EmailService {
  ping(): string { return 'email'; }
}
