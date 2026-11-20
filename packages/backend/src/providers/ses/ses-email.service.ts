import { Injectable } from '@nestjs/common';
@Injectable()
export class SesEmailService {
  ping(): string { return 'ses-email'; }
}
