import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const DEFAULT_BASE_URL = 'https://opensource-demo.orangehrmlive.com';
const DEFAULT_USERNAME = 'Admin';
const DEFAULT_PASSWORD = 'admin123';

/**
 * Centralised environment configuration.
 * Values fall back to the public OrangeHRM demo defaults when not provided.
 */
export const envConfig = {
  baseUrl: (process.env.BASE_URL || DEFAULT_BASE_URL).trim(),
  username: (process.env.ORANGEHRM_USERNAME || DEFAULT_USERNAME).trim(),
  password: (process.env.ORANGEHRM_PASSWORD || DEFAULT_PASSWORD).trim(),
} as const;