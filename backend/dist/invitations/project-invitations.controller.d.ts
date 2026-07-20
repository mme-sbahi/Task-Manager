import { InvitationsService } from './invitations.service';
import { InviteMembersDto } from './dto/invite-members.dto';
export declare class ProjectInvitationsController {
    private readonly invitationsService;
    constructor(invitationsService: InvitationsService);
    invite(projectId: string, invitedById: string, dto: InviteMembersDto): Promise<{
        invited: import("./entities/project-invitation.entity").ProjectInvitation[];
        failed: {
            email: string;
            reason: string;
        }[];
    }>;
    findAll(projectId: string): Promise<import("./entities/project-invitation.entity").ProjectInvitation[]>;
}
