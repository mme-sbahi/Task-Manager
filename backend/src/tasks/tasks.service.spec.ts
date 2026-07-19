import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Repository, ObjectLiteral } from 'typeorm';
import { TasksService } from './tasks.service';
import { Task } from './entities/task.entity';
import { TaskStatus } from './enums/task-status.enum';
import { Priority } from './enums/priority.enum';

type MockRepo<T extends ObjectLiteral = any> = Partial<
  Record<keyof Repository<T>, jest.Mock>
>;

const createMockRepo = <T extends ObjectLiteral = any>(): MockRepo<T> => ({
  create: jest.fn((x) => x),
  save: jest.fn((x) => Promise.resolve({ id: 'task-1', ...x })),
  find: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
});

describe('TasksService', () => {
  let service: TasksService;
  let tasksRepo: MockRepo<Task>;

  beforeEach(async () => {
    tasksRepo = createMockRepo<Task>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: getRepositoryToken(Task), useValue: tasksRepo },
      ],
    }).compile();

    service = module.get(TasksService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('defaults status/priority and stamps projectId + createdById from the caller, not the body', async () => {
      const task = await service.create('project-1', 'user-1', {
        title: 'Navbar redesign',
        priority: Priority.HIGH,
      });

      expect(tasksRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Navbar redesign',
          priority: Priority.HIGH,
          projectId: 'project-1',
          createdById: 'user-1',
        }),
      );
      expect(task.id).toBe('task-1');
    });

    it('parses an ISO due date string into a Date', async () => {
      await service.create('project-1', 'user-1', {
        title: 'Ship release',
        dueDate: '2026-08-01T00:00:00.000Z',
      });

      const callArg = (tasksRepo.create as jest.Mock).mock.calls[0][0];
      expect(callArg.dueDate).toBeInstanceOf(Date);
      expect(callArg.dueDate.toISOString()).toBe('2026-08-01T00:00:00.000Z');
    });
  });

  describe('findOne', () => {
    it('throws NotFoundException when the task does not exist', async () => {
      (tasksRepo.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne('missing-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('applies a status move (e.g. TODO -> IN_PROGRESS)', async () => {
      (tasksRepo.findOne as jest.Mock).mockResolvedValue({
        id: 'task-1',
        title: 'Navbar redesign',
        status: TaskStatus.TODO,
        dueDate: undefined,
      });

      const updated = await service.update('task-1', {
        status: TaskStatus.IN_PROGRESS,
      });

      expect(updated.status).toBe(TaskStatus.IN_PROGRESS);
      expect(tasksRepo.save).toHaveBeenCalled();
    });
  });

  describe('findAssignedToUser', () => {
    it('returns tasks assigned to the given user, ordered by due date', async () => {
      (tasksRepo.find as jest.Mock).mockResolvedValue([{ id: 'task-1' }]);

      const result = await service.findAssignedToUser('user-1');

      expect(tasksRepo.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { assigneeId: 'user-1' },
          order: { dueDate: 'ASC' },
        }),
      );
      expect(result).toEqual([{ id: 'task-1' }]);
    });
  });

  describe('remove', () => {
    it('removes an existing task', async () => {
      (tasksRepo.findOne as jest.Mock).mockResolvedValue({ id: 'task-1' });

      await service.remove('task-1');

      expect(tasksRepo.remove).toHaveBeenCalledWith({ id: 'task-1' });
    });
  });
});
