import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectMember } from '../projects/entities/project-member.entity';
import { Task } from '../tasks/entities/task.entity';
import { TaskStatus } from '../tasks/enums/task-status.enum';
import { DashboardStatsDto } from './dto/dashboard-stats.dto';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(ProjectMember)
    private readonly membersRepository: Repository<ProjectMember>,
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
  ) {}

  async getStatsForUser(userId: string): Promise<DashboardStatsDto> {
    const memberships = await this.membersRepository.find({ where: { userId } });
    const projectIds = memberships.map((m) => m.projectId);

    if (projectIds.length === 0) {
      return {
        totalProjects: 0,
        totalTasks: 0,
        tasksCompleted: 0,
        tasksInProgress: 0,
        tasksDueToday: 0,
        overdueCount: 0,
      };
    }

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);
    const now = new Date();

    // One aggregate query rather than five separate COUNT(*) round trips.
    // FILTER (WHERE ...) is a Postgres-specific conditional-aggregate
    // syntax — fine here since this backend only ever targets Postgres.
    const raw = await this.tasksRepository
      .createQueryBuilder('task')
      .select('COUNT(*)', 'total')
      .addSelect(
        `COUNT(*) FILTER (WHERE task.status = :done)`,
        'completed',
      )
      .addSelect(
        `COUNT(*) FILTER (WHERE task.status = :inProgress)`,
        'inProgress',
      )
      .addSelect(
        `COUNT(*) FILTER (WHERE task.due_date BETWEEN :startOfToday AND :endOfToday AND task.status != :done)`,
        'dueToday',
      )
      .addSelect(
        `COUNT(*) FILTER (WHERE task.due_date < :now AND task.status != :done)`,
        'overdue',
      )
      .where('task.project_id IN (:...projectIds)', { projectIds })
      .setParameters({
        done: TaskStatus.DONE,
        inProgress: TaskStatus.IN_PROGRESS,
        startOfToday,
        endOfToday,
        now,
      })
      .getRawOne();

    return {
      totalProjects: projectIds.length,
      totalTasks: parseInt(raw.total, 10) || 0,
      tasksCompleted: parseInt(raw.completed, 10) || 0,
      tasksInProgress: parseInt(raw.inProgress, 10) || 0,
      tasksDueToday: parseInt(raw.dueToday, 10) || 0,
      overdueCount: parseInt(raw.overdue, 10) || 0,
    };
  }
}
