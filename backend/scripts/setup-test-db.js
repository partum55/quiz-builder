import { config } from 'dotenv';
import { execSync } from 'node:child_process';
import pg from 'pg';

// Connect using the dev DATABASE_URL (quizdb) — Postgres requires connecting
// to an existing database to issue CREATE DATABASE for a new one.
config({ path: '.env' });
const adminUrl = process.env.DATABASE_URL;

config({ path: '.env.test', override: true });
const testUrl = process.env.DATABASE_URL;

if (!adminUrl || !testUrl) {
  throw new Error('DATABASE_URL missing from .env or .env.test');
}

const testDbName = new URL(testUrl).pathname.slice(1);

const client = new pg.Client({ connectionString: adminUrl });
await client.connect();
const { rowCount } = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [testDbName]);
if (rowCount === 0) {
  await client.query(`CREATE DATABASE "${testDbName}"`);
  console.log(`Created database "${testDbName}"`);
}
await client.end();

execSync('npx prisma migrate deploy', {
  stdio: 'inherit',
  env: { ...process.env, DATABASE_URL: testUrl },
});
