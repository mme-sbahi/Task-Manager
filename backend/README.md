# TaskFlow — Backend

A NestJS + TypeORM + PostgreSQL API for the TaskFlow task manager.

**Status: feature-complete for the take-home** — Docker, PostgreSQL, JWT
Authentication, Users, Projects (with roles), Tasks, a real
invite → accept/decline membership flow, dashboard stats, Swagger, and
automated tests (unit + e2e).

> This README covers the backend in isolation. For the one-command
> full-stack setup (Postgres + backend + frontend together), see the
> [root README](../README.md).

## Stack

- NestJS 10, TypeORM 0.3, PostgreSQL 16
- JWT access + refresh tokens (passport-jwt), bcrypt password hashing
- class-validator / class-transformer for request validation & response sanitization
- Swagger (OpenAPI) auto-generated docs

## Quick start (backend only)

```bash
cp .env.example .env
docker-compose -f ../docker-compose.yml up --build backend postgres
```
Or, from the repo root, `make up` starts everything (see root README).

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
3. Send `Authorization: Bearer <accessToken>` on protected routes
4. When the access token expires, call `POST /auth/refresh` with
   `Authorization: Bearer <refreshToken>` to get a new pair
5. `POST /auth/logout` clears the stored refresh token hash server-side

Refresh tokens are never stored in plaintext — only a bcrypt hash lives on
`users.hashed_refresh_token`, rotated on every refresh.


## Routes implemented

```
POST   /auth/register
POST   /auth/login
POST   /auth/refresh   (requires refresh token)
POST   /auth/logout    (requires access token)
GET    /auth/profile   (requires access token)

GET    /projects                     projects you belong to (includes memberCount, taskCount)
POST   /projects                     create a project (you become OWNER)
GET    /projects/:id                 must be a member (includes memberCount, taskCount)
PATCH  /projects/:id                 must be OWNER/ADMIN
DELETE /projects/:id                 must be OWNER/ADMIN
GET    /projects/:id/members         list current (accepted) members, must be a member
DELETE /projects/:id/members/:userId must be OWNER/ADMIN

POST   /projects/:id/invitations     invite by email (creates PENDING invites), must be OWNER/ADMIN
GET    /projects/:id/invitations     invitation history for the project, must be OWNER/ADMIN
GET    /invitations/me               pending invitations waiting on you
POST   /invitations/:id/accept       accept — this is what creates the membership
POST   /invitations/:id/decline      decline

GET    /projects/:id/tasks           list tasks, must be a member
POST   /projects/:id/tasks           create a task, must be a member
GET    /tasks/me                     every task assigned to you, across all projects
PATCH  /tasks/:id                    update/move a task, must be a member of its project
DELETE /tasks/:id                    must be a member of its project

GET    /dashboard/stats              aggregate stats scoped to your projects
```
All routes above except `/auth/register` and `/auth/login` require
`Authorization: Bearer <accessToken>`.

## Testing

**Manual walkthrough:** [`MANUAL_TESTING.md`](./MANUAL_TESTING.md) — a full
step-by-step tour including the invite/accept/decline flow.

**Unit tests** (mocked repositories, no DB needed):
```bash
npm run test
```
31 tests across `AuthService`, `ProjectsService`, `TasksService`,
`InvitationsService` (invite/accept/decline, including the forbidden and
already-responded-to cases), and `DashboardService`.

**End-to-end tests** (real HTTP requests through real guards, against a real
Postgres test database):
```bash
# one-time setup
docker exec -it taskflow_postgres psql -U taskflow -c "CREATE DATABASE taskflow_test"
npm run test:e2e
```
Walks the full story end to end: register two users, create a project,
confirm a non-member is blocked, invite them (PENDING, not a member yet),
confirm they *still* can't see the project, accept, confirm they now can,
confirm double-accepting is rejected, and confirm decline never creates a
membership. Plus the tasks/guards story from before.

## Project structure

```
src
├── auth            — JWT strategies, guards, register/login/refresh/logout
├── users           — User entity, lookup by email/id
├── projects        — Project + ProjectMember entities, roles, CRUD
├── invitations     — ProjectInvitation entity, invite/accept/decline
├── tasks           — Task entity, TaskStatus/Priority enums, /tasks/me
├── dashboard        — aggregate stats query
├── common/filters   — global HTTP exception filter
├── config           — TypeORM datasource config (for migrations)
├── app.module.ts
└── main.ts
test
├── test-app.module.ts   — real modules, Postgres test DB instead of dev
└── app.e2e-spec.ts      — full HTTP walkthrough
```

