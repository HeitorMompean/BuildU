import { Injectable } from '@nestjs/common';
@Injectable()
export class MediaService {
  ping(): string { return 'media'; }
}
