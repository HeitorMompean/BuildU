import { z } from 'zod';
const schema = z.object({
  appEnv: z.string().default('staging'),
  apiUrl: z.string().default('https://api-staging.example.com'),
  linksUrl: z.string().default('https://links-staging.example.com'),
});
// Only EXPO_PUBLIC_* values. Never secrets.
export const env = schema.parse({
  appEnv: process.env['EXPO_PUBLIC_APP_ENV'],
  apiUrl: process.env['EXPO_PUBLIC_API_URL'],
  linksUrl: process.env['EXPO_PUBLIC_LINKS_URL'],
});
