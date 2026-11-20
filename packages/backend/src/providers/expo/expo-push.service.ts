import { Injectable } from '@nestjs/common';
@Injectable()
export class ExpoPushService {
  ping(): string { return 'expo-push'; }
}
