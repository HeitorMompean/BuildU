import { Injectable } from '@nestjs/common';
@Injectable()
export class CatalogService {
  ping(): string { return 'catalog'; }
}
