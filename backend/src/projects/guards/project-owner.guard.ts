import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ProjectMember } from '../entities/project-member.entity';
import { ProjectRole } from '../enums/project-role.enum';

// Must run AFTER ProjectMemberGuard in the @UseGuards() list, since it relies
// on `request.projectMember` being populated already. Kept as a separate
// guard (rather than folded into ProjectMemberGuard) so routes can compose
// "must be a member" vs "must be able to manage this project" independently.
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
