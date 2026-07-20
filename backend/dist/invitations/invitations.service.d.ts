import { Repository } from 'typeorm';
import { ProjectInvitation } from './entities/project-invitation.entity';
import { InviteMembersDto } from './dto/invite-members.dto';
import { ProjectMember } from '../projects/entities/project-member.entity';
import { UsersService } from '../users/users.service';
export declare class InvitationsService {
    private readonly invitationsRepository;
    private readonly membersRepository;
    private readonly usersService;
    constructor(invitationsRepository: Repository<ProjectInvitation>, membersRepository: Repository<ProjectMember>, usersService: UsersService);
    inviteMembers(projectId: string, invitedById: string, dto: InviteMembersDto): Promise<{
        invited: ProjectInvitation[];
        failed: {
            email: string;
            reason: string;
        }[];
    }>;
    private inviteSingle;
    findPendingForUser(userId: string): Promise<ProjectInvitation[]>;
    findAllForProject(projectId: string): Promise<ProjectInvitation[]>;
    accept(invitationId: string, userId: string): Promise<ProjectMember>;
    decline(invitationId: string, userId: string): Promise<ProjectInvitation>;
    private getOwnPendingInvitation;
}
