import { Injectable } from '@nestjs/common';
@Injectable()
export class IdentityService {
  ping(): string { return 'identity'; }
}
