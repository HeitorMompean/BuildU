import type { ExpoConfig } from 'expo/config';
import base from './app.json';
const config: ExpoConfig = { ...(base.expo as ExpoConfig), slug: 'hs-mobile' };
export default config;
