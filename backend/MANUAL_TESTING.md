# Manual testing walkthrough

This walks through the entire API by hand so you can see how auth,
projects, tasks, and the authorization guards all fit together. Do this
either through Swagger (`http://localhost:3001/api`, click "Try it out" on
each route) or with the `curl` commands below — both hit the same server.

Make sure `docker-compose up --build` is running first.

## 1. Register two users

You need two accounts to actually see the membership/authorization logic
do something — one owner, one outsider.

```bash
curl -s -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"owner@example.com","password":"StrongPass123!","fullName":"Project Owner"}' | tee owner.json

curl -s -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"teammate@example.com","password":"StrongPass123!","fullName":"Teammate"}' | tee teammate.json
```

Grab the tokens for the next steps:
```bash
OWNER_TOKEN=$(jq -r .accessToken owner.json)
TEAMMATE_TOKEN=$(jq -r .accessToken teammate.json)
```
(No `jq`? Just copy the `accessToken` string manually from the JSON output.)

## 2. Confirm auth works

```bash
curl -s http://localhost:3001/auth/profile \
  -H "Authorization: Bearer $OWNER_TOKEN"
```
Expect the owner's profile back, **with no `passwordHash` field** — that's
the `@Exclude()` decorator on the entity doing its job.

Try it with no token at all:
```bash
curl -i http://localhost:3001/auth/profile
```
Expect `401 Unauthorized`.

## 3. Create a project

```bash
curl -s -X POST http://localhost:3001/projects \
  -H "Authorization: Bearer $OWNER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Leet Recruitment Project","description":"Take-home project"}' | tee project.json

PROJECT_ID=$(jq -r .id project.json)
```

## 4. Prove the membership guard actually blocks people

The teammate hasn't been invited yet — this should fail:
```bash
curl -i http://localhost:3001/projects/$PROJECT_ID \
  -H "Authorization: Bearer $TEAMMATE_TOKEN"
```
Expect `403 Forbidden` — this is `ProjectMemberGuard` doing its job.

## 5. Invite the teammate

```bash
curl -s -X POST http://localhost:3001/projects/$PROJECT_ID/members \
  -H "Authorization: Bearer $OWNER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"email":"teammate@example.com"}'
```
Expect a `201` with `"role": "MEMBER"`.

Now re-run the same request from step 4 — it should succeed with `200` this
time.

## 6. Prove role-based restrictions

The teammate is a MEMBER, not an OWNER/ADMIN. Try deleting the project as
the teammate:
```bash
curl -i -X DELETE http://localhost:3001/projects/$PROJECT_ID \
  -H "Authorization: Bearer $TEAMMATE_TOKEN"
```
Expect `403 Forbidden` — this is `ProjectOwnerGuard`.

## 7. Create and move a task

```bash
curl -s -X POST http://localhost:3001/projects/$PROJECT_ID/tasks \
  -H "Authorization: Bearer $TEAMMATE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Navbar redesign","priority":"HIGH"}' | tee task.json

TASK_ID=$(jq -r .id task.json)
```
Note `status` defaults to `"TODO"` — you never had to set it.

Move it along the Kanban states:
```bash
curl -s -X PATCH http://localhost:3001/tasks/$TASK_ID \
  -H "Authorization: Bearer $TEAMMATE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"IN_PROGRESS"}'
```

## 8. Prove validation actually rejects bad input

```bash
curl -i -X POST http://localhost:3001/projects/$PROJECT_ID/tasks \
  -H "Authorization: Bearer $OWNER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"x","priority":"URGENT"}'
```
Expect `400 Bad Request` — `title` is under the 3-character minimum and
`URGENT` isn't a valid `Priority` enum value.

## 9. Inspect the database directly

```bash
docker exec -it taskflow_postgres psql -U taskflow -d taskflow_db
```
```sql
SELECT id, email, full_name FROM users;
SELECT id, name, owner_id FROM projects;
SELECT project_id, user_id, role FROM project_members;
SELECT id, title, status, priority, project_id FROM tasks;
```
You should see exactly the rows the requests above created.

---

If every step above behaves as described, Day 1 + Day 2 are both fully
working end to end.
