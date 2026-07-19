import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { ObjectLiteral, Repository } from 'typeorm';
import { InvitationsService } from './invitations.service';
import { ProjectInvitation } from './entities/project-invitation.entity';
import { InvitationStatus } from './enums/invitation-status.enum';
import { ProjectMember } from '../projects/entities/project-member.entity';
import { ProjectRole } from '../projects/enums/project-role.enum';
import { UsersService } from '../users/users.service';

type MockRepo<T extends ObjectLiteral = any> = Partial<
  Record<keyof Repository<T>, jest.Mock>
>;

const createMockRepo = <T extends ObjectLiteral = any>(): MockRepo<T> => ({
  create: jest.fn((x) => x),
  save: jest.fn((x) => Promise.resolve({ id: 'generated-id', ...x })),
  findOne: jest.fn(),
  find: jest.fn(),
});

describe('InvitationsService', () => {
  let service: InvitationsService;
  let invitationsRepo: Omit<MockRepo<ProjectInvitation>, 'manager'> & {
    manager: { transaction: jest.Mock };
  };
  let membersRepo: MockRepo<ProjectMember>;
  let usersService: { findByEmail: jest.Mock };

  beforeEach(async () => {
    invitationsRepo = {
      ...createMockRepo<ProjectInvitation>(),
      manager: { transaction: jest.fn() },
    };
    membersRepo = createMockRepo<ProjectMember>();
    usersService = { findByEmail: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvitationsService,
        {
          provide: getRepositoryToken(ProjectInvitation),
          useValue: invitationsRepo,
        },
        { provide: getRepositoryToken(ProjectMember), useValue: membersRepo },
        { provide: UsersService, useValue: usersService },
      ],
    }).compile();

    service = module.get(InvitationsService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('inviteMembers', () => {
    it('creates a PENDING invitation for a valid, uninvited, non-member email', async () => {
      usersService.findByEmail.mockResolvedValue({ id: 'user-2' });
      (membersRepo.findOne as jest.Mock).mockResolvedValue(null); // not a member
      (invitationsRepo.findOne as jest.Mock).mockResolvedValue(null); // no pending invite

      const result = await service.inviteMembers('project-1', 'owner-1', {
        emails: ['teammate@example.com'],
      });

      expect(result.invited).toHaveLength(1);
      expect(result.failed).toHaveLength(0);
      expect(invitationsRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          projectId: 'project-1',
          invitedUserId: 'user-2',
          invitedById: 'owner-1',
          status: InvitationStatus.PENDING,
          role: ProjectRole.MEMBER,
        }),
      );
    });

    it('does NOT create a membership row — only an invitation', async () => {
      usersService.findByEmail.mockResolvedValue({ id: 'user-2' });
      (membersRepo.findOne as jest.Mock).mockResolvedValue(null);
      (invitationsRepo.findOne as jest.Mock).mockResolvedValue(null);

      await service.inviteMembers('project-1', 'owner-1', {
        emails: ['teammate@example.com'],
      });

      expect(membersRepo.create).not.toHaveBeenCalled();
      expect(membersRepo.save).not.toHaveBeenCalled();
    });

    it('reports (not throws) when the email is unregistered, already a member, or already invited', async () => {
      usersService.findByEmail.mockImplementation((email: string) =>
        email === 'ghost@example.com'
          ? Promise.resolve(null)
          : Promise.resolve({ id: `id-${email}` }),
      );
      (membersRepo.findOne as jest.Mock).mockImplementation(({ where }) =>
        where.userId === 'id-already-member@example.com'
          ? Promise.resolve({ id: 'existing-membership' })
          : Promise.resolve(null),
      );
      (invitationsRepo.findOne as jest.Mock).mockImplementation(({ where }) =>
        where.invitedUserId === 'id-already-invited@example.com'
          ? Promise.resolve({ id: 'existing-invite' })
          : Promise.resolve(null),
      );

      const result = await service.inviteMembers('project-1', 'owner-1', {
        emails: [
          'ghost@example.com',
          'already-member@example.com',
          'already-invited@example.com',
        ],
      });

      expect(result.invited).toHaveLength(0);
      expect(result.failed).toHaveLength(3);
    });
  });

  describe('accept', () => {
    const pendingInvitation = {
      id: 'invite-1',
      projectId: 'project-1',
      invitedUserId: 'user-2',
      role: ProjectRole.MEMBER,
      status: InvitationStatus.PENDING,
    };

    it('throws NotFoundException when the invitation does not exist', async () => {
      (invitationsRepo.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.accept('missing-id', 'user-2')).rejects.toThrow(
        NotFoundException,
      );
    });

    it("throws ForbiddenException when it's not addressed to this user", async () => {
      (invitationsRepo.findOne as jest.Mock).mockResolvedValue(pendingInvitation);

      await expect(service.accept('invite-1', 'someone-else')).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('throws ConflictException when already responded to', async () => {
      (invitationsRepo.findOne as jest.Mock).mockResolvedValue({
        ...pendingInvitation,
        status: InvitationStatus.DECLINED,
      });

      await expect(service.accept('invite-1', 'user-2')).rejects.toThrow(
        ConflictException,
      );
    });

    it('creates the membership and marks the invitation ACCEPTED, atomically', async () => {
      (invitationsRepo.findOne as jest.Mock).mockResolvedValue(pendingInvitation);

      const manager = {
        create: jest.fn((_entity, data) => data),
        save: jest.fn((x) => Promise.resolve({ id: 'saved', ...x })),
      };
      invitationsRepo.manager.transaction.mockImplementation((cb) => cb(manager));

      const result = await service.accept('invite-1', 'user-2');

      expect(manager.create).toHaveBeenCalledWith(
        ProjectMember,
        expect.objectContaining({
          projectId: 'project-1',
          userId: 'user-2',
          role: ProjectRole.MEMBER,
        }),
      );
      // both the membership and the invitation get saved in the same transaction
      expect(manager.save).toHaveBeenCalledTimes(2);
      expect(result.id).toBe('saved');
    });
  });

  describe('decline', () => {
    it('marks a pending invitation DECLINED', async () => {
      (invitationsRepo.findOne as jest.Mock).mockResolvedValue({
        id: 'invite-1',
        invitedUserId: 'user-2',
        status: InvitationStatus.PENDING,
      });

      const result = await service.decline('invite-1', 'user-2');

      expect(result.status).toBe(InvitationStatus.DECLINED);
      expect(result.respondedAt).toBeInstanceOf(Date);
      expect(invitationsRepo.save).toHaveBeenCalled();
    });

    it("throws ForbiddenException when it's not addressed to this user", async () => {
      (invitationsRepo.findOne as jest.Mock).mockResolvedValue({
        id: 'invite-1',
        invitedUserId: 'user-2',
        status: InvitationStatus.PENDING,
      });

      await expect(service.decline('invite-1', 'someone-else')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
