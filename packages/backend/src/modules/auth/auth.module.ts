import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { CognitoTokenService } from '../../providers/cognito/cognito-token.service.js';
import { PermissionsGuard } from '../../common/guards/permissions.guard.js';

@Module({ providers: [AuthService, CognitoTokenService, PermissionsGuard], exports: [AuthService] })
export class AuthModule {}
