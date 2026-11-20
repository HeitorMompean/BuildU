// Writes the generated OpenAPI document for @hs/api-client. Round 4 expands DTOs.
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFile, mkdir } from 'node:fs/promises';
import { AppModule } from './app.module.js';

async function main(): Promise<void> {
  const app = await NestFactory.create(AppModule, { logger: false });
  const config = new DocumentBuilder().setTitle('Home Services API').setVersion('0.0.0').addBearerAuth().build();
  const doc = SwaggerModule.createDocument(app, config);
  const out = new URL('../../../packages/api-client/openapi/openapi.json', import.meta.url);
  await mkdir(new URL('../../../packages/api-client/openapi/', import.meta.url), { recursive: true });
  await writeFile(out, `${JSON.stringify(doc, null, 2)}\n`);
  await app.close();
  console.log('wrote packages/api-client/openapi/openapi.json');
}
await main();
