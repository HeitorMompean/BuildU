// Regenerates src/generated from openapi.json. Round 4 points this at Nest output.
// Never hand-edit src/generated; CI fails on dirty regeneration.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import openapiTS from 'openapi-typescript';

const IN = new URL('./openapi.json', import.meta.url);
const OUT = new URL('../src/generated/types.ts', import.meta.url);

const raw = await readFile(IN, 'utf8');
JSON.parse(raw); // fail fast on invalid JSON
const types = await openapiTS(IN as unknown as string, { version: 3 });
await mkdir(new URL('../src/generated/', import.meta.url), { recursive: true });
await writeFile(OUT, `// AUTO-GENERATED. Do not edit.\n${types}`);
console.log('generated src/generated/types.ts');
