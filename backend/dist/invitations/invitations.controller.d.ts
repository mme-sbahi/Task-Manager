import { InvitationsService } from './invitations.service';
export declare class InvitationsController {
    private readonly invitationsService;
    constructor(invitationsService: InvitationsService);
    findMyPending(userId: string): Promise<import("./entities/project-invitation.entity").ProjectInvitation[]>;
    accept(id: string, userId: string): Promise<import("../projects/entities/project-member.entity").ProjectMember>;
    decline(id: string, userId: string): Promise<import("./entities/project-invitation.entity").ProjectInvitation>;
}
