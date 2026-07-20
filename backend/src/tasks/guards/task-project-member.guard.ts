import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../entities/task.entity';
import { ProjectMember } from '../../projects/entities/project-member.entity';


@Injectable()
export class TaskProjectMemberGuard implements CanActivate {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
    @InjectRepository(ProjectMember)
    private readonly membersRepository: Repository<ProjectMember>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId: string | undefined = request.user?.userId;
    const taskId: string | undefined = request.params.id;

    if (!userId || !taskId) {
      throw new NotFoundException('Task not found');
    }

    const task = await this.tasksRepository.findOne({ where: { id: taskId } });
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const membership = await this.membersRepository.findOne({
      where: { projectId: task.projectId, userId },
    });
    if (!membership) {
      throw new ForbiddenException('You are not a member of this project');
    }

    request.task = task;
    request.projectMember = membership;
    return true;
  }
}
