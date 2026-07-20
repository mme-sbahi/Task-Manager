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

@Injectable()
export class ProjectMemberGuard implements CanActivate {
  constructor(
    @InjectRepository(ProjectMember)
    private readonly membersRepository: Repository<ProjectMember>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId: string | undefined = request.user?.userId;
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
