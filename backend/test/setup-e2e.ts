import { config } from 'dotenv';

// Override any DATABASE_URL already loaded from .env (e.g. by @nestjs/config)
// so e2e tests always hit quizdb_test, never the dev quizdb.
config({ path: '.env.test', override: true });
