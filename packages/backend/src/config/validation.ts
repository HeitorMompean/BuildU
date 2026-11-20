const REQUIRED_PROD: readonly string[] = ['APP_ENV', 'AWS_REGION', 'DATABASE_SECRET_ARN'] as const;
export function validateConfig(env: NodeJS.ProcessEnv = process.env): readonly string[] {
  if ((env['NODE_ENV'] ?? '') !== 'production') return [];
  return REQUIRED_PROD.filter((k) => !env[k]);
}
