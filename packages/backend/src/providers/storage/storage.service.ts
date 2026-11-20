import { Injectable } from '@nestjs/common';
@Injectable()
export class StorageService {
  ping(): string { return 'storage'; }
}
