import { User } from '../../users/entities/user.entity';
import { Project } from '../../projects/entities/project.entity';
import { ProjectRole } from '../../projects/enums/project-role.enum';
import { InvitationStatus } from '../enums/invitation-status.enum';
export declare class ProjectInvitation {
    id: string;
    projectId: string;
    project: Project;
    invitedUserId: string;
    invitedUser: User;
    invitedById?: string;
    invitedBy?: User;
    role: ProjectRole;
    status: InvitationStatus;
    createdAt: Date;
    respondedAt?: Date;
}
