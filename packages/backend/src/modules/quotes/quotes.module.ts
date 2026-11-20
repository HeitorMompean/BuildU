import { Module } from '@nestjs/common';
import { QuotesController } from './quotes.controller.js';
import { QuotesService } from './quotes.service.js';
import { QuotesRepository } from './quotes.repository.js';

@Module({ controllers: [QuotesController], providers: [QuotesService, QuotesRepository], exports: [QuotesService] })
export class QuotesModule {}
