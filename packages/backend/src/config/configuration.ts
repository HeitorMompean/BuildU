export interface AppConfig {
  readonly nodeEnv: string;
  readonly appEnv: string;
  readonly port: number;
  readonly awsRegion: string;
}
// Reads only names from docs/operations/configuration.md. Secrets stay in ARNs.
export function loadConfiguration(env: NodeJS.ProcessEnv = process.env): AppConfig {
  return {
    nodeEnv: env['NODE_ENV'] ?? 'development',
    appEnv: env['APP_ENV'] ?? 'staging',
    port: Number(env['PORT'] ?? 8080),
    awsRegion: env['AWS_REGION'] ?? 'us-east-1',
  };
}
