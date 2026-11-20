import { Injectable } from '@nestjs/common';
@Injectable()
export class MediaRepository {
  ping(): string { return 'media-repo'; }
}
