import { Injectable } from '@nestjs/common';
@Injectable()
export class IdentityRepository {
  ping(): string { return 'identity-repo'; }
}
