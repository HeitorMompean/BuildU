import { Module } from '@nestjs/common';
import { IdentityController } from './identity.controller.js';
import { IdentityService } from './identity.service.js';
import { IdentityRepository } from './identity.repository.js';

@Module({ controllers: [IdentityController], providers: [IdentityService, IdentityRepository], exports: [IdentityService] })
export class IdentityModule {}
