import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { WorkerModule } from './worker.module.js';
import { loadWorkerConfig } from './config.js';

async function bootstrap(): Promise<void> {
  loadWorkerConfig();
  const ctx = await NestFactory.createApplicationContext(WorkerModule);
  await ctx.init();
}
bootstrap().catch((e) => { console.error(e); process.exit(1); });
