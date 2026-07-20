import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ProjectMember } from '../entities/project-member.entity';
import { ProjectRole } from '../enums/project-role.enum';

@Injectable()
export class ProjectOwnerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const membership: ProjectMember | undefined = request.projectMember;

    if (
      !membership ||
      ![ProjectRole.OWNER, ProjectRole.ADMIN].includes(membership.role)
    ) {
      throw new ForbiddenException(
        'Only the project owner or an admin can perform this action',
      );
    }

    return true;
  }
}
