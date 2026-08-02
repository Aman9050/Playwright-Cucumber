import dotenv from 'dotenv';
import * as path from 'path';
// Decide environment from command line or default
const env = process.env.ENV || 'qa';

// Load the corresponding .env file
dotenv.config({ path: path.resolve(`.env.${env.toLowerCase()}`) });
export const runtimeConfig = {
  env: process.env.ENV || 'QA',
  browser: process.env.BROWSER || 'chrome',
  reporter: process.env.REPORTER || 'Aman',
  project: process.env.PROJECT || 'Playwright Cucumber Framework',
  baseUrl: process.env.BASE_URL || 'https://example.com',
};
