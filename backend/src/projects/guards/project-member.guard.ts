import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectMember } from '../entities/project-member.entity';

// Attaches `request.projectMember` for any downstream handler/guard to reuse,
// so we don't hit the DB twice for the same membership row.
@Injectable()
export class ProjectMemberGuard implements CanActivate {
  constructor(
    @InjectRepository(ProjectMember)
    private readonly membersRepository: Repository<ProjectMember>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId: string | undefined = request.user?.userId;
    // Route param is called either `id` (project routes) or `projectId`
    // (nested task routes) depending on where the guard is applied.
    const projectId: string | undefined =
      request.params.projectId ?? request.params.id;

    if (!userId || !projectId) {
      throw new NotFoundException('Project not found');
    }

    const membership = await this.membersRepository.findOne({
      where: { projectId, userId },
    });

    if (!membership) {
      throw new ForbiddenException('You are not a member of this project');
    }

    request.projectMember = membership;
    return true;
  }
}
