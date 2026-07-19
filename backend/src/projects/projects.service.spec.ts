import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Repository, ObjectLiteral } from 'typeorm';
import { ProjectsService } from './projects.service';
import { Project } from './entities/project.entity';
import { ProjectMember } from './entities/project-member.entity';
import { ProjectRole } from './enums/project-role.enum';

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

  beforeEach(async () => {
    projectsRepo = createMockRepo<Project>();
    membersRepo = createMockRepo<ProjectMember>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        { provide: getRepositoryToken(Project), useValue: projectsRepo },
        { provide: getRepositoryToken(ProjectMember), useValue: membersRepo },
      ],
    }).compile();

    service = module.get(ProjectsService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('findOne', () => {
    it('maps memberCount and taskCount from loadRelationCountAndMap', async () => {
      const queryBuilder = {
        loadRelationCountAndMap: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue({
          id: 'project-1',
          name: 'Leet Recruitment Project',
          memberCount: 3,
          taskCount: 12,
        }),
      };
      (projectsRepo.createQueryBuilder as jest.Mock).mockReturnValue(queryBuilder);

      const project = await service.findOne('project-1');

      expect(queryBuilder.loadRelationCountAndMap).toHaveBeenCalledWith(
        'project.memberCount',
        'project.members',
      );
      expect(queryBuilder.loadRelationCountAndMap).toHaveBeenCalledWith(
        'project.taskCount',
        'project.tasks',
      );
      expect(project.memberCount).toBe(3);
      expect(project.taskCount).toBe(12);
    });

    it('throws NotFoundException when the project does not exist', async () => {
      const queryBuilder = {
        loadRelationCountAndMap: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      };
      (projectsRepo.createQueryBuilder as jest.Mock).mockReturnValue(queryBuilder);

      await expect(service.findOne('missing-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

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
