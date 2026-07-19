process.env.JWT_ACCESS_SECRET = 'test-access-secret';
process.env.JWT_ACCESS_EXPIRATION = '15m';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
process.env.JWT_REFRESH_EXPIRATION = '7d';

import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { TestAppModule } from './test-app.module';

describe('TaskFlow (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestAppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    // Mirrors the ValidationPipe wired in main.ts, so the same DTO rules
    // (whitelist, forbidNonWhitelisted) apply in tests as in production.
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  const owner = {
    email: 'owner@example.com',
    password: 'StrongPassword123!',
    fullName: 'Project Owner',
  };
  const outsider = {
    email: 'outsider@example.com',
    password: 'StrongPassword123!',
    fullName: 'Someone Else',
  };

  let ownerToken: string;
  let outsiderToken: string;
  let projectId: string;
  let invitationId: string;
  let taskId: string;

  describe('Auth', () => {
    it('rejects registration with an invalid email (validation pipe)', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({ ...owner, email: 'not-an-email' })
        .expect(400);
    });

    it('registers the project owner', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send(owner)
        .expect(201);

      expect(res.body.accessToken).toBeDefined();
      expect(res.body.user.email).toBe(owner.email);
      expect(res.body.user.passwordHash).toBeUndefined();
      ownerToken = res.body.accessToken;
    });

    it('registers the outsider (never invited to any project)', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send(outsider)
        .expect(201);
      outsiderToken = res.body.accessToken;
    });

    it('rejects a duplicate email on register', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send(owner)
        .expect(409);
    });

    it('logs in with correct credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: owner.email, password: owner.password })
        .expect(200);
    });

    it('rejects login with the wrong password', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: owner.email, password: 'wrong-password' })
        .expect(401);
    });

    it('rejects an unauthenticated profile request', () => {
      return request(app.getHttpServer()).get('/auth/profile').expect(401);
    });

    it('returns the profile for a valid access token', () => {
      return request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', `Bearer ${ownerToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.email).toBe(owner.email);
        });
    });
  });

  describe('Projects', () => {
    it('creates a project and makes the creator its OWNER', async () => {
      const res = await request(app.getHttpServer())
        .post('/projects')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({ name: 'Leet Recruitment Project', description: 'Take-home' })
        .expect(201);

      expect(res.body.id).toBeDefined();
      expect(res.body.ownerId).toBeDefined();
      projectId = res.body.id;
    });

    it('lists the project for the owner', async () => {
      const res = await request(app.getHttpServer())
        .get('/projects')
        .set('Authorization', `Bearer ${ownerToken}`)
        .expect(200);

      expect(res.body).toHaveLength(1);
      expect(res.body[0].id).toBe(projectId);
    });

    it('blocks a non-member from viewing the project (ProjectMemberGuard)', () => {
      return request(app.getHttpServer())
        .get(`/projects/${projectId}`)
        .set('Authorization', `Bearer ${outsiderToken}`)
        .expect(403);
    });

    it('blocks a non-member from inviting themself', () => {
      return request(app.getHttpServer())
        .post(`/projects/${projectId}/invitations`)
        .set('Authorization', `Bearer ${outsiderToken}`)
        .send({ emails: [outsider.email] })
        .expect(403);
    });

    it('lets the owner invite the outsider — creates a PENDING invitation, not a membership', async () => {
      const res = await request(app.getHttpServer())
        .post(`/projects/${projectId}/invitations`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({ emails: [outsider.email] })
        .expect(201);

      expect(res.body.invited).toHaveLength(1);
      expect(res.body.invited[0].status).toBe('PENDING');
      invitationId = res.body.invited[0].id;
    });

    it('does not grant access until the invitation is accepted', () => {
      return request(app.getHttpServer())
        .get(`/projects/${projectId}`)
        .set('Authorization', `Bearer ${outsiderToken}`)
        .expect(403);
    });

    it('shows the pending invitation to the invited user via GET /invitations/me', async () => {
      const res = await request(app.getHttpServer())
        .get('/invitations/me')
        .set('Authorization', `Bearer ${outsiderToken}`)
        .expect(200);

      expect(res.body).toHaveLength(1);
      expect(res.body[0].id).toBe(invitationId);
    });

    it("blocks anyone but the invited user from accepting it", () => {
      return request(app.getHttpServer())
        .post(`/invitations/${invitationId}/accept`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .expect(403);
    });

    it('lets the invited user accept — this is what actually creates the membership', async () => {
      const res = await request(app.getHttpServer())
        .post(`/invitations/${invitationId}/accept`)
        .set('Authorization', `Bearer ${outsiderToken}`)
        .expect(201);

      expect(res.body.role).toBe('MEMBER');
    });

    it('rejects accepting the same invitation twice', () => {
      return request(app.getHttpServer())
        .post(`/invitations/${invitationId}/accept`)
        .set('Authorization', `Bearer ${outsiderToken}`)
        .expect(409);
    });

    it('now lets the newly-accepted member view the project', () => {
      return request(app.getHttpServer())
        .get(`/projects/${projectId}`)
        .set('Authorization', `Bearer ${outsiderToken}`)
        .expect(200);
    });

    it('lets an invited user decline instead of accept, and it never becomes a membership', async () => {
      const decliner = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'decliner@example.com',
          password: 'StrongPassword123!',
          fullName: 'Will Decline',
        });

      const inviteRes = await request(app.getHttpServer())
        .post(`/projects/${projectId}/invitations`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({ emails: ['decliner@example.com'] })
        .expect(201);
      const declineInvitationId = inviteRes.body.invited[0].id;

      await request(app.getHttpServer())
        .post(`/invitations/${declineInvitationId}/decline`)
        .set('Authorization', `Bearer ${decliner.body.accessToken}`)
        .expect(201);

      return request(app.getHttpServer())
        .get(`/projects/${projectId}`)
        .set('Authorization', `Bearer ${decliner.body.accessToken}`)
        .expect(403); // still not a member — declined, not accepted
    });

    it('still blocks a plain MEMBER from deleting the project (ProjectOwnerGuard)', () => {
      return request(app.getHttpServer())
        .delete(`/projects/${projectId}`)
        .set('Authorization', `Bearer ${outsiderToken}`)
        .expect(403);
    });
  });

  describe('Tasks', () => {
    it('lets a project member create a task', async () => {
      const res = await request(app.getHttpServer())
        .post(`/projects/${projectId}/tasks`)
        .set('Authorization', `Bearer ${outsiderToken}`)
        .send({ title: 'Navbar redesign', priority: 'HIGH' })
        .expect(201);

      expect(res.body.status).toBe('TODO'); // default
      expect(res.body.priority).toBe('HIGH');
      taskId = res.body.id;
    });

    it('rejects an invalid enum value (class-validator)', () => {
      return request(app.getHttpServer())
        .post(`/projects/${projectId}/tasks`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({ title: 'Broken task', priority: 'URGENT' })
        .expect(400);
    });

    it('lists tasks for the project', async () => {
      const res = await request(app.getHttpServer())
        .get(`/projects/${projectId}/tasks`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .expect(200);

      expect(res.body).toHaveLength(1);
    });

    it('moves a task from TODO to IN_PROGRESS via PATCH /tasks/:id', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/tasks/${taskId}`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({ status: 'IN_PROGRESS' })
        .expect(200);

      expect(res.body.status).toBe('IN_PROGRESS');
    });

    it('blocks a non-member from updating the task (TaskProjectMemberGuard)', async () => {
      const stranger = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'stranger@example.com',
          password: 'StrongPassword123!',
          fullName: 'A Stranger',
        });

      return request(app.getHttpServer())
        .patch(`/tasks/${taskId}`)
        .set('Authorization', `Bearer ${stranger.body.accessToken}`)
        .send({ status: 'DONE' })
        .expect(403);
    });
  });
});
