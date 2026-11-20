import { Module } from '@nestjs/common';
import { WorkersController } from './workers.controller.js';
import { WorkersService } from './workers.service.js';
import { WorkersRepository } from './workers.repository.js';

@Module({ controllers: [WorkersController], providers: [WorkersService, WorkersRepository], exports: [WorkersService] })
export class WorkersModule {}
