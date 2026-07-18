import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Repository, ObjectLiteral } from 'typeorm';
import { ProjectsService } from './projects.service';
import { Project } from './entities/project.entity';
import { ProjectMember } from './entities/project-member.entity';
import { ProjectRole } from './enums/project-role.enum';
import { UsersService } from '../users/users.service';

type MockRepo<T extends ObjectLiteral = any> = Partial<
  Record<keyof Repository<T>, jest.Mock>
>;

const createMockRepo = <T extends ObjectLiteral = any>(): MockRepo<T> => ({
  create: jest.fn((x) => x),
  save: jest.fn((x) => Promise.resolve({ id: 'generated-id', ...x })),
  findOne: jest.fn(),
  find: jest.fn(),
  remove: jest.fn(),
  createQueryBuilder: jest.fn(),
});

describe('ProjectsService', () => {
  let service: ProjectsService;
  let projectsRepo: MockRepo<Project>;
  let membersRepo: MockRepo<ProjectMember>;
  let usersService: { findByEmail: jest.Mock };

  beforeEach(async () => {
    projectsRepo = createMockRepo<Project>();
    membersRepo = createMockRepo<ProjectMember>();
    usersService = { findByEmail: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        { provide: getRepositoryToken(Project), useValue: projectsRepo },
        { provide: getRepositoryToken(ProjectMember), useValue: membersRepo },
        { provide: UsersService, useValue: usersService },
      ],
    }).compile();

    service = module.get(ProjectsService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('creates the project and an OWNER membership row for the creator', async () => {
      (projectsRepo.save as jest.Mock).mockResolvedValue({
        id: 'project-1',
        name: 'Leet Recruitment Project',
        ownerId: 'user-1',
      });

      const project = await service.create('user-1', {
        name: 'Leet Recruitment Project',
      });

      expect(project.id).toBe('project-1');
      expect(membersRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          projectId: 'project-1',
          userId: 'user-1',
          role: ProjectRole.OWNER,
        }),
      );
      expect(membersRepo.save).toHaveBeenCalled();
    });
  });

  describe('addMember', () => {
    it('throws NotFoundException when the invited email does not belong to a user', async () => {
      usersService.findByEmail.mockResolvedValue(null);

      await expect(
        service.addMember('project-1', { email: 'ghost@example.com' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws ForbiddenException when the user is already a member', async () => {
      usersService.findByEmail.mockResolvedValue({ id: 'user-2' });
      (membersRepo.findOne as jest.Mock).mockResolvedValue({
        id: 'membership-1',
      });

      await expect(
        service.addMember('project-1', { email: 'teammate@example.com' }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('adds a MEMBER-role membership by default', async () => {
      usersService.findByEmail.mockResolvedValue({ id: 'user-2' });
      (membersRepo.findOne as jest.Mock).mockResolvedValue(null);

      await service.addMember('project-1', { email: 'teammate@example.com' });

      expect(membersRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ role: ProjectRole.MEMBER }),
      );
    });
  });

  describe('inviteMembers', () => {
    it('invites every valid email and reports failures separately, without stopping the batch', async () => {
      usersService.findByEmail.mockImplementation((email: string) => {
        if (email === 'ghost@example.com') return Promise.resolve(null);
        return Promise.resolve({ id: `user-${email}` });
      });
      (membersRepo.findOne as jest.Mock).mockImplementation(({ where }) =>
        where.userId === 'user-already@example.com'
          ? Promise.resolve({ id: 'existing-membership' })
          : Promise.resolve(null),
      );

      const result = await service.inviteMembers('project-1', {
        emails: ['good@example.com', 'ghost@example.com', 'already@example.com'],
      });

      expect(result.invited).toHaveLength(1);
      expect(result.failed).toHaveLength(2);
      expect(result.failed.map((f) => f.email)).toEqual(
        expect.arrayContaining(['ghost@example.com', 'already@example.com']),
      );
    });
  });

  describe('removeMember', () => {
    it('throws NotFoundException when the membership does not exist', async () => {
      (membersRepo.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        service.removeMember('project-1', 'user-2'),
      ).rejects.toThrow(NotFoundException);
    });

    it('refuses to remove the project OWNER', async () => {
      (membersRepo.findOne as jest.Mock).mockResolvedValue({
        role: ProjectRole.OWNER,
      });

      await expect(
        service.removeMember('project-1', 'user-1'),
      ).rejects.toThrow(ForbiddenException);
      expect(membersRepo.remove).not.toHaveBeenCalled();
    });

    it('removes a non-owner member', async () => {
      (membersRepo.findOne as jest.Mock).mockResolvedValue({
        role: ProjectRole.MEMBER,
      });

      await service.removeMember('project-1', 'user-2');

      expect(membersRepo.remove).toHaveBeenCalled();
    });
  });
});
