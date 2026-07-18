import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DashboardService } from './dashboard.service';
import { ProjectMember } from '../projects/entities/project-member.entity';
import { Task } from '../tasks/entities/task.entity';

describe('DashboardService', () => {
  let service: DashboardService;
  let membersRepo: { find: jest.Mock };
  let tasksRepo: { createQueryBuilder: jest.Mock };
  let queryBuilder: Record<string, jest.Mock>;

  beforeEach(async () => {
    membersRepo = { find: jest.fn() };

    queryBuilder = {
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      setParameters: jest.fn().mockReturnThis(),
      getRawOne: jest.fn(),
    };
    tasksRepo = { createQueryBuilder: jest.fn(() => queryBuilder) };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        { provide: getRepositoryToken(ProjectMember), useValue: membersRepo },
        { provide: getRepositoryToken(Task), useValue: tasksRepo },
      ],
    }).compile();

    service = module.get(DashboardService);
  });

  afterEach(() => jest.clearAllMocks());

  it('returns all zeros without querying tasks when the user belongs to no projects', async () => {
    membersRepo.find.mockResolvedValue([]);

    const result = await service.getStatsForUser('user-1');

    expect(result).toEqual({
      totalProjects: 0,
      totalTasks: 0,
      tasksCompleted: 0,
      tasksInProgress: 0,
      tasksDueToday: 0,
      overdueCount: 0,
    });
    expect(tasksRepo.createQueryBuilder).not.toHaveBeenCalled();
  });

  it('aggregates task counts across every project the user belongs to', async () => {
    membersRepo.find.mockResolvedValue([
      { projectId: 'project-1' },
      { projectId: 'project-2' },
    ]);
    queryBuilder.getRawOne.mockResolvedValue({
      total: '10',
      completed: '4',
      inProgress: '3',
      dueToday: '2',
      overdue: '1',
    });

    const result = await service.getStatsForUser('user-1');

    expect(result).toEqual({
      totalProjects: 2,
      totalTasks: 10,
      tasksCompleted: 4,
      tasksInProgress: 3,
      tasksDueToday: 2,
      overdueCount: 1,
    });
    expect(queryBuilder.where).toHaveBeenCalledWith(
      'task.project_id IN (:...projectIds)',
      { projectIds: ['project-1', 'project-2'] },
    );
  });
});
