import { Injectable } from '@nestjs/common';
@Injectable()
export class SentryService {
  capture(_error: unknown): void { /* diagnostics only, no PII */ }
}
