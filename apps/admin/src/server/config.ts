import { z } from 'zod';
const schema = z.object({ appEnv: z.string().default('staging'), port: z.coerce.number().default(3000) });
export const adminConfig = schema.parse({ appEnv: process.env['APP_ENV'], port: process.env['PORT'] });
