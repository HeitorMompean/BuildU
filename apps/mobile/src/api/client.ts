import { createClient } from '@hs/api-client';
import { env } from '../config/env.js';
export const api = createClient({ baseUrl: env.apiUrl });
