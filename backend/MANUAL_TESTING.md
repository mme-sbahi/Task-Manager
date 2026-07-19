# Manual testing walkthrough

Do this either through Swagger (`http://localhost:3001/api`) or the `curl`
commands below. Make sure everything is running first (`make up` from the
repo root, or `docker-compose up --build` from here for backend-only).

## 1. Register two users

```bash
curl -s -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"owner@example.com","password":"StrongPass123!","fullName":"Project Owner"}' | tee owner.json

curl -s -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"teammate@example.com","password":"StrongPass123!","fullName":"Teammate"}' | tee teammate.json

OWNER_TOKEN=$(jq -r .accessToken owner.json)
TEAMMATE_TOKEN=$(jq -r .accessToken teammate.json)
```

## 2. Confirm auth works

```bash
curl -s http://localhost:3001/auth/profile -H "Authorization: Bearer $OWNER_TOKEN"
```
Expect the profile, with no `passwordHash` field.

## 3. Create a project

```bash
curl -s -X POST http://localhost:3001/projects \
  -H "Authorization: Bearer $OWNER_TOKEN" -H "Content-Type: application/json" \
  -d '{"name":"Leet Recruitment Project","description":"Take-home project"}' | tee project.json

PROJECT_ID=$(jq -r .id project.json)
```
Notice `memberCount: 1` and `taskCount: 0` are already in the response.

## 4. Confirm the membership guard blocks non-members

```bash
curl -i http://localhost:3001/projects/$PROJECT_ID -H "Authorization: Bearer $TEAMMATE_TOKEN"
```
Expect `403` — the teammate hasn't been invited yet.

## 5. Invite the teammate — this does NOT add them yet

```bash
curl -s -X POST http://localhost:3001/projects/$PROJECT_ID/invitations \
  -H "Authorization: Bearer $OWNER_TOKEN" -H "Content-Type: application/json" \
  -d '{"emails":["teammate@example.com"]}' | tee invite.json

INVITATION_ID=$(jq -r .invited[0].id invite.json)
```
Expect `status: "PENDING"` in `invite.json`.

Confirm the teammate *still* can't see the project:
```bash
curl -i http://localhost:3001/projects/$PROJECT_ID -H "Authorization: Bearer $TEAMMATE_TOKEN"
```
Still `403` — an invitation existing isn't the same as being a member.

## 6. The teammate sees the pending invitation

```bash
curl -s http://localhost:3001/invitations/me -H "Authorization: Bearer $TEAMMATE_TOKEN"
```
Expect an array with one entry, including the project's name.

## 7. Accept it

```bash
curl -s -X POST http://localhost:3001/invitations/$INVITATION_ID/accept \
  -H "Authorization: Bearer $TEAMMATE_TOKEN"
```
Expect a `ProjectMember` object back with `role: "MEMBER"`.

Now re-run step 4's request — should be `200` this time.

Try accepting it again:
```bash
curl -i -X POST http://localhost:3001/invitations/$INVITATION_ID/accept \
  -H "Authorization: Bearer $TEAMMATE_TOKEN"
```
Expect `409` — already responded to.

## 8. Role restrictions still apply after accepting

The teammate is a MEMBER, not OWNER/ADMIN:
```bash
curl -i -X DELETE http://localhost:3001/projects/$PROJECT_ID \
  -H "Authorization: Bearer $TEAMMATE_TOKEN"
```
Expect `403`.

## 9. Tasks

```bash
curl -s -X POST http://localhost:3001/projects/$PROJECT_ID/tasks \
  -H "Authorization: Bearer $TEAMMATE_TOKEN" -H "Content-Type: application/json" \
  -d '{"title":"Navbar redesign","priority":"HIGH"}' | tee task.json

TASK_ID=$(jq -r .id task.json)

curl -s -X PATCH http://localhost:3001/tasks/$TASK_ID \
  -H "Authorization: Bearer $TEAMMATE_TOKEN" -H "Content-Type: application/json" \
  -d '{"status":"IN_PROGRESS"}'
```

Check "my tasks" for the teammate:
```bash
curl -s http://localhost:3001/tasks/me -H "Authorization: Bearer $TEAMMATE_TOKEN"
```

## 10. Dashboard stats

```bash
curl -s http://localhost:3001/dashboard/stats -H "Authorization: Bearer $OWNER_TOKEN"
```
Expect `totalProjects: 1`, `totalTasks: 1`, `tasksInProgress: 1`, rest `0`.

## 11. Inspect the database directly

```bash
make psql
# or: docker exec -it taskflow_postgres psql -U taskflow -d taskflow_db
```
```sql
SELECT id, email, full_name FROM users;
SELECT id, name, owner_id FROM projects;
SELECT project_id, user_id, role FROM project_members;
SELECT project_id, invited_user_id, role, status FROM project_invitations;
SELECT id, title, status, priority, project_id FROM tasks;
```

---
If every step above behaves as described, the backend is fully working
end to end.
