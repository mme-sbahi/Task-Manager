# TaskFlow — Backend

A NestJS + TypeORM + PostgreSQL API for the TaskFlow task manager.

**Status: Day 1 + Day 2 complete** — Docker, PostgreSQL, JWT Authentication,
Users, Swagger, Projects (with membership/roles), Tasks, authorization
guards, and automated tests.

## Stack

- NestJS 10, TypeORM 0.3, PostgreSQL 16
- JWT access + refresh tokens (passport-jwt), bcrypt password hashing
- class-validator / class-transformer for request validation & response sanitization
- Swagger (OpenAPI) auto-generated docs

## Quick start

```bash
cp .env.example .env
docker-compose up --build
```

That's it. This starts:
- `postgres` — Postgres 16 on `5432`
- `backend` — NestJS API on `3001`, hot-reloading from `./src`

Swagger docs: **http://localhost:3001/api**

## Running without Docker

```bash
npm install
cp .env.example .env   # then point DATABASE_HOST to localhost
npm run start:dev
```

You'll need a local Postgres instance matching the `.env` credentials.

## Auth flow

1. `POST /auth/register` → creates the user, returns `{ user, accessToken, refreshToken }`
2. `POST /auth/login` → same response shape
3. Send `Authorization: Bearer <accessToken>` on protected routes (`GET /auth/profile`, etc.)
4. When the access token expires, call `POST /auth/refresh` with `Authorization: Bearer <refreshToken>` to get a new pair
5. `POST /auth/logout` clears the stored refresh token hash server-side

Refresh tokens are never stored in plaintext — only a bcrypt hash lives on the
`users.hashed_refresh_token` column, and it's rotated on every refresh.

## Routes implemented

```
POST   /auth/register
POST   /auth/login
POST   /auth/refresh   (requires refresh token)
POST   /auth/logout    (requires access token)
GET    /auth/profile   (requires access token)

GET    /projects                     list projects you belong to
POST   /projects                     create a project (you become OWNER)
GET    /projects/:id                 must be a member
PATCH  /projects/:id                 must be OWNER/ADMIN
DELETE /projects/:id                 must be OWNER/ADMIN
GET    /projects/:id/members         must be a member
POST   /projects/:id/members         invite by email, must be OWNER/ADMIN
DELETE /projects/:id/members/:userId must be OWNER/ADMIN

GET    /projects/:id/tasks           list tasks, must be a member
POST   /projects/:id/tasks           create a task, must be a member
PATCH  /tasks/:id                    update/move a task, must be a member
DELETE /tasks/:id                    must be a member
```

All routes above except `/auth/register` and `/auth/login` require
`Authorization: Bearer <accessToken>`.

## Testing

**Manual walkthrough:** see [`MANUAL_TESTING.md`](./MANUAL_TESTING.md) for a
full step-by-step `curl`/Swagger tour of auth, projects, tasks, and the
authorization guards actually blocking/allowing things.

**Unit tests** (mocked repositories, no DB needed):
```bash
npm run test
```
Covers `AuthService` (register/login/refresh/logout, including bad password
and forged refresh token cases), `ProjectsService` (owner-membership
creation, duplicate-invite prevention, owner-removal protection), and
`TasksService` (defaults, due-date parsing, not-found handling).

**End-to-end tests** (real HTTP requests through real guards, against a real
Postgres test database):
```bash
# one-time setup — create the dedicated test database
docker exec -it taskflow_postgres psql -U taskflow -c "CREATE DATABASE taskflow_test"

npm run test:e2e
```
This boots the actual app (auth + projects + tasks wired together exactly
like production) against `taskflow_test` — a separate database so it never
touches your dev data — and drops/recreates the schema on every run. It
walks the same story as the manual guide: register two users, create a
project, confirm a non-member gets `403`, invite them, confirm they can now
see the project but still can't delete it, create and move a task, and
confirm a stranger gets blocked from touching it.

## Project structure

```
src
├── auth
│   ├── decorators/current-user.decorator.ts
│   ├── dto/            (register, login, tokens)
│   ├── guards/         (JwtAuthGuard, JwtRefreshGuard)
│   ├── interfaces/     (JwtPayload)
│   ├── strategies/     (JwtStrategy, JwtRefreshStrategy)
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   ├── auth.service.ts
│   └── auth.service.spec.ts
├── users
│   ├── entities/user.entity.ts
│   ├── dto/create-user.dto.ts
│   ├── users.module.ts
│   └── users.service.ts
├── projects
│   ├── entities/          (Project, ProjectMember)
│   ├── enums/project-role.enum.ts      (OWNER, ADMIN, MEMBER)
│   ├── dto/                (create/update project, add-member)
│   ├── guards/              (ProjectMemberGuard, ProjectOwnerGuard)
│   ├── projects.controller.ts
│   ├── projects.module.ts
│   ├── projects.service.ts
│   └── projects.service.spec.ts
├── tasks
│   ├── entities/task.entity.ts
│   ├── enums/               (TaskStatus, Priority)
│   ├── dto/                  (create/update task)
│   ├── guards/task-project-member.guard.ts
│   ├── project-tasks.controller.ts   (nested: /projects/:id/tasks)
│   ├── tasks.controller.ts           (standalone: /tasks/:id)
│   ├── tasks.module.ts
│   ├── tasks.service.ts
│   └── tasks.service.spec.ts
├── common
│   └── filters/http-exception.filter.ts
├── config
│   └── typeorm.config.ts
├── app.module.ts
└── main.ts
test
├── test-app.module.ts    (real modules, Postgres test DB instead of dev)
└── app.e2e-spec.ts       (full HTTP walkthrough — auth, projects, tasks, guards)
```

## Design notes

- **Password & refresh-token hashes are never serialized.** They're marked
  `@Exclude()` on the entity and stripped a second time in `AuthService` before
  the response leaves the controller — belt and suspenders.
- **`synchronize: true`** is used for Day 1-2 development speed. Before this
  goes anywhere near production it should switch to TypeORM migrations
  (`npm run migration:generate` / `migration:run` scripts are already wired up
  against `src/config/typeorm.config.ts`).
- **Global `ValidationPipe`** (`whitelist` + `forbidNonWhitelisted`) rejects any
  request body field not declared on a DTO — this is what `@IsString() @Length(3,100)`-style
  decorators actually enforce.
- **Two separate JWT strategies** (`jwt`, `jwt-refresh`) with two secrets and
  two guards, so an access token can never be replayed against `/auth/refresh`
  and vice versa.

## Next up (Day 3)

- Frontend: Next.js login/register pages, protected routes, dashboard
- `comments` module (backend — deliberately deferred since it's a "cut
  first if short on time" feature; the four things that matter most —
  Auth, Projects, Tasks, Docker — are already solid)
