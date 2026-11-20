import { z } from 'zod';
const schema = z.object({
  NODE_ENV: z.string().default('development'),
  APP_ENV: z.string().default('staging'),
  AWS_REGION: z.string().default('us-east-1'),
  SQS_DOMAIN_JOBS_QUEUE_URL: z.string().default(''),
});
export type WorkerConfig = z.infer<typeof schema>;
export function loadWorkerConfig(env: NodeJS.ProcessEnv = process.env): WorkerConfig {
  return schema.parse(env);
}
