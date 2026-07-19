# TaskFlow

A full-stack task manager: Next.js 15 + NestJS + PostgreSQL, with real JWT
auth, project membership via an invite/accept/decline flow (not a direct
add), a Kanban-style task board, and a live dashboard.

## Run everything with one command

```bash
git clone <this-repo>
cd taskflow
make setup   # copies .env templates — edit them if you want different secrets
make up      # builds and starts postgres + backend + frontend
```

- Frontend: **http://localhost:3000**
- Backend Swagger docs: **http://localhost:3001/api**
- Postgres: `localhost:5432` (credentials in `backend/.env`)

No `make`? The equivalent is just:
```bash
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local
docker-compose up --build
```

Other handy commands — see `make help` for the full list:
```bash
make logs        # tail every service's logs
make test         # run backend unit tests
make psql         # open a psql shell into the dev database
make down         # stop everything
make clean        # stop everything AND wipe the Postgres volume
```

## What's actually working right now

- **Auth**: register, login, JWT access + refresh tokens (rotated on every
  refresh, bcrypt-hashed at rest), protected routes
- **Projects**: create, list, update, delete, role-based authorization
  (OWNER / ADMIN / MEMBER)
- **Invitations**: inviting someone creates a pending invite, not instant
  access — they explicitly accept or decline before a membership exists
- **Tasks**: full CRUD, status/priority enums, per-user "my tasks" view,
  scoped to project membership
- **Dashboard**: real aggregate stats (not mocked), computed server-side
- **Tests**: 31 backend unit tests + a full e2e suite exercising the entire
  auth → invite → accept → task flow through real HTTP requests and guards

## Project layout

```
taskflow/
├── docker-compose.yml   ← starts all three services together
├── Makefile             ← thin wrapper around docker-compose
├── backend/             ← NestJS API — see backend/README.md for details
└── frontend/            ← Next.js app — see frontend/TODO.md for what's left
```

Each subfolder has its own README/TODO with the details specific to it —
this file is intentionally just the entry point.

## Known limitations

These are deliberate scope decisions for a one-week project, not oversights
— see `backend/README.md`'s "Known limitations" section for the full list
and reasoning. The short version: tokens live in the response body rather
than httpOnly cookies (frontend's responsibility to store safely), one
refresh token per user rather than per-device, no rate limiting yet, no
`comments` module (explicitly deferred), and invitations require the
invited email to already be a registered account.
