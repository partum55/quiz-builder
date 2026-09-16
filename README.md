# Quiz Builder

Quizzes.

Build a quiz, share its link, and see who's taken it and how they scored.

## What it does

- **Build** — a step-by-step wizard: title, then questions (yes/no, short
  answer, or multiple choice), then preview and publish.
- **Share** — every quiz gets a public link; no login needed to take it.
- **Take** — a respondent enters their name, answers every question, and
  submits.
- **Review** — the quiz's own page has a Results tab listing who took it,
  their score, and when.

## Stack

- **Frontend** — Next.js (App Router) + React, Tailwind CSS, react-hook-form + zod.
- **Backend** — NestJS + Prisma + PostgreSQL.
- Both run in Docker via `docker-compose.yml`; see `backend/` and `frontend/` for each app on its own.

## Run

Needs Docker.

```bash
./scripts/setup-env.sh
docker compose up --build
```

Open http://localhost:3000.

## Stop & clean

```bash
./scripts/docker-clean.sh
```

Stops every container and deletes the database volume.
