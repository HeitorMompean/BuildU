import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller.js';
import { NotificationsService } from './notifications.service.js';
import { NotificationsRepository } from './notifications.repository.js';
import { PushService } from './push.service.js';
import { EmailService } from './email.service.js';

@Module({ controllers: [NotificationsController], providers: [NotificationsService, NotificationsRepository, PushService, EmailService], exports: [NotificationsService] })
export class NotificationsModule {}
