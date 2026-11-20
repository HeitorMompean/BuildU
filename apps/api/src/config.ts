import { z } from 'zod';
const schema = z.object({
  NODE_ENV: z.string().default('development'),
  APP_ENV: z.string().default('staging'),
  PORT: z.coerce.number().default(8080),
  AWS_REGION: z.string().default('us-east-1'),
});
export type ApiConfig = z.infer<typeof schema>;
export function loadApiConfig(env: NodeJS.ProcessEnv = process.env): ApiConfig {
  return schema.parse(env);
}
