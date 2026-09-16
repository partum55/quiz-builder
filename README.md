# Quiz Builder

Quizzes.

Build a quiz, share its link, and see who's taken it and how they scored.

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
