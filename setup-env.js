// setup-env.js: Safely copies .env.example -> .env if not present
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootExample = path.join(__dirname, '.env.example');
const rootEnv = path.join(__dirname, '.env');

if (!fs.existsSync(rootEnv) && fs.existsSync(rootExample)) {
  fs.copyFileSync(rootExample, rootEnv);
  console.log('Created .env from .env.example');
} else if (fs.existsSync(rootEnv)) {
  console.log('.env already exists, keeping current settings.');
}

const backendExample = path.join(__dirname, 'backend', '.env.example');
const backendEnv = path.join(__dirname, 'backend', '.env');

if (!fs.existsSync(backendEnv) && fs.existsSync(backendExample)) {
  fs.copyFileSync(backendExample, backendEnv);
  console.log('Created backend/.env from backend/.env.example');
}
