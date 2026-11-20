import { Injectable } from '@nestjs/common';
@Injectable()
export class ReviewsRepository {
  ping(): string { return 'reviews-repo'; }
}
