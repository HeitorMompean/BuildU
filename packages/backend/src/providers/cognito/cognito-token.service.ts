import { Injectable } from '@nestjs/common';
// Verifies Cognito access tokens (signature/issuer/client/expiry/token_use). Round 3 fills.
@Injectable()
export class CognitoTokenService {
  ping(): string { return 'cognito-token'; }
}
