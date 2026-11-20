import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
// R01-M shell: real Cognito verification lands in Round 3 (R03-C).
@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(_context: ExecutionContext): boolean { return true; }
}
