# Frontend TODO — to match the final backend

This folder is currently just a placeholder (`Dockerfile` +
`.env.local.example`) so `docker-compose up` / `make up` can start all three
services together. Drop your actual Next.js project in here — same folder
name (`frontend/`), same level as `Dockerfile`.

## ⚠️ Breaking API change — the invitation flow

The member-invite endpoints changed shape. If your `api.ts` still calls
`POST /projects/:id/members` directly, **that route no longer exists.**
Inviting someone now creates a pending invitation, not an instant
membership — they have to accept it first. Concretely:

| Old (removed) | New |
|---|---|
| `POST /projects/:id/members` (instant add) | `POST /projects/:id/invitations` — body `{ emails: string[], role? }`, creates PENDING invitations |
| — | `GET /projects/:id/invitations` — invitation history for the project (OWNER/ADMIN only) |
| — | `GET /invitations/me` — pending invitations waiting on the current user |
| — | `POST /invitations/:id/accept` — accepts; **this is what actually creates the membership** |
| — | `POST /invitations/:id/decline` |

`GET /projects/:id/members` (list current members) and
`DELETE /projects/:id/members/:userId` (remove a member) are unchanged.

## What to build on top of this

- [ ] **A notifications entry point** (bell icon in the dashboard layout is
      the natural spot) that fetches `GET /invitations/me` and shows a
      badge with the pending count. A `useQuery` with a short
      `refetchInterval` (e.g. 30s) or `refetchOnWindowFocus: true` is
      enough — no need for websockets for this scope.
- [ ] **An invitations dropdown/page** listing each pending invite
      (`project.name`, who invited them — `invitedBy.fullName`) with
      Accept / Decline buttons calling the two endpoints above. On
      accept, invalidate both the invitations query and the projects
      list query (`queryClient.invalidateQueries(...)`) so the new
      project shows up immediately.
- [ ] **Update whatever invite UI you already built** (the modal/form that
      used to call `POST /projects/:id/members`) to call
      `POST /projects/:id/invitations` instead, and expect
      `{ invited: [...], failed: [...] }` back — surface `failed` entries
      as inline errors next to each email if you're inviting several at
      once.

## Also wire in (already built on the backend, not yet used by the frontend)

- [ ] `GET /tasks/me` — for a "My Tasks" view / the dashboard's task lists
- [ ] `GET /dashboard/stats` — real numbers for the dashboard stat cards
- [ ] `memberCount` / `taskCount` now come back on every project object
      from `GET /projects` and `GET /projects/:id` — no more N+1 requests
      needed to show those numbers in a project card or list

## General production-readiness (from earlier in this conversation)

- [ ] `app/error.tsx` and `app/not-found.tsx` — Next's dev overlay won't
      exist in production; an unhandled error currently means a blank page
- [ ] Run `npm run build` once before submitting — catches type errors
      `next dev` silently tolerates
- [ ] Loading/empty states for: empty dashboard, a project with zero
      tasks, zero pending invitations, `/tasks/me` with nothing assigned —
      these are the exact states a reviewer's fresh account will hit first
- [ ] Commit `.env.local.example` (already created here) so the setup step
      in the root README actually works for someone else
