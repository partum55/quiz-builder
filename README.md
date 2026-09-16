# Quiz Builder

Quizzes.

Build a quiz, share its link, and see who's taken it and how they scored.

## What it does

- **Build** — a step-by-step wizard: title, then questions (yes/no, short
  answer, or multiple choice), then preview and publish. Existing quizzes
  can be edited later too.
- **Share** — every quiz gets a public link; no login needed to take it.
- **Take** — a respondent enters their name, answers every question, and
  submits.
- **Review** — the quiz's own page has a Results tab listing who took it,
  their score, and when.

## Stack

- **Frontend** — Next.js (App Router) + React, Tailwind CSS, react-hook-form + zod.
- **Backend** — NestJS + Prisma + PostgreSQL.

## Run everything with Docker (recommended)

Needs Docker.

```bash
./scripts/setup-env.sh       # generates .env / backend/.env / backend/.env.test / frontend/.env.local
docker compose up --build
```

Open http://localhost:3000. The database, its migrations, the API, and the
web app all start with that one command — nothing else to set up.

Stop and wipe everything (including the database) with:

```bash
./scripts/docker-clean.sh
```

## Run without Docker

Useful for local development (hot reload on both apps).

1. **Database** — start just Postgres in Docker, or point at any Postgres/SQLite instance you already have:

   ```bash
   cd backend && npm run db:start   # docker compose up -d, uses backend/docker-compose.yml
   ```

2. **Env files** — from the repo root: `./scripts/setup-env.sh` (or copy each `.env.example` yourself).

3. **Backend**:

   ```bash
   cd backend
   npm install
   npx prisma migrate dev   # creates the schema
   npm run start:dev        # http://localhost:8000, Swagger docs at /docs
   ```

4. **Frontend** (separate terminal):

   ```bash
   cd frontend
   npm install
   npm run dev               # http://localhost:3000
   ```

## Create a sample quiz

Either use the UI (`New quiz` on the dashboard), or seed one from the backend:

```bash
cd backend && npm run seed
```

This creates a "Sample Quiz: World Capitals" with one question of each type
(yes/no, short answer, multiple choice).

## Code quality

Each app has its own linter and formatter:

```bash
cd backend  && npm run lint && npm run format   # oxlint + Prettier
cd frontend && npm run lint && npm run format    # ESLint + Prettier
```

## Tests

```bash
cd backend && npm run test && npm run test:e2e
```
