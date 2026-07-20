import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectInvitation } from './entities/project-invitation.entity';
import { InvitationStatus } from './enums/invitation-status.enum';
import { InviteMembersDto } from './dto/invite-members.dto';
import { ProjectMember } from '../projects/entities/project-member.entity';
import { ProjectRole } from '../projects/enums/project-role.enum';
import { UsersService } from '../users/users.service';

@Injectable()
export class InvitationsService {
  constructor(
    @InjectRepository(ProjectInvitation)
    private readonly invitationsRepository: Repository<ProjectInvitation>,
    @InjectRepository(ProjectMember)
    private readonly membersRepository: Repository<ProjectMember>,
    private readonly usersService: UsersService,
  ) {}

  async inviteMembers(
    projectId: string,
    invitedById: string,
    dto: InviteMembersDto,
  ): Promise<{
    invited: ProjectInvitation[];
    failed: { email: string; reason: string }[];
  }> {
    const invited: ProjectInvitation[] = [];
    const failed: { email: string; reason: string }[] = [];

    for (const email of dto.emails) {
      try {
        const invitation = await this.inviteSingle(
          projectId,
          invitedById,
          email,
          dto.role,
        );
        invited.push(invitation);
      } catch (err) {
        failed.push({
          email,
          reason: err instanceof Error ? err.message : 'Unknown error',
        });
      }
    }

    return { invited, failed };
  }

  private async inviteSingle(
    projectId: string,
    invitedById: string,
    email: string,
    role?: ProjectRole,
  ): Promise<ProjectInvitation> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException(`No user found with email ${email}`);
    }

    const existingMembership = await this.membersRepository.findOne({
      where: { projectId, userId: user.id },
    });
    if (existingMembership) {
      throw new ConflictException('User is already a member of this project');
    }

    const existingInvitation = await this.invitationsRepository.findOne({
      where: {
        projectId,
        invitedUserId: user.id,
        status: InvitationStatus.PENDING,
      },
    });
    if (existingInvitation) {
      throw new ConflictException('User already has a pending invitation');
    }

    const invitation = this.invitationsRepository.create({
      projectId,
      invitedUserId: user.id,
      invitedById,
      role: role ?? ProjectRole.MEMBER,
      status: InvitationStatus.PENDING,
    });
    return this.invitationsRepository.save(invitation);
  }

  async findPendingForUser(userId: string): Promise<ProjectInvitation[]> {
    return this.invitationsRepository.find({
      where: { invitedUserId: userId, status: InvitationStatus.PENDING },
      relations: ['project', 'invitedBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async findAllForProject(projectId: string): Promise<ProjectInvitation[]> {
    return this.invitationsRepository.find({
      where: { projectId },
      relations: ['invitedUser', 'invitedBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async accept(invitationId: string, userId: string): Promise<ProjectMember> {
    const invitation = await this.getOwnPendingInvitation(invitationId, userId);


    return this.invitationsRepository.manager.transaction(async (manager) => {
      const member = manager.create(ProjectMember, {
        projectId: invitation.projectId,
        userId: invitation.invitedUserId,
        role: invitation.role,
      });
      const savedMember = await manager.save(member);

      invitation.status = InvitationStatus.ACCEPTED;
      invitation.respondedAt = new Date();
      await manager.save(invitation);

      return savedMember;
    });
  }

  async decline(invitationId: string, userId: string): Promise<ProjectInvitation> {
    const invitation = await this.getOwnPendingInvitation(invitationId, userId);

    invitation.status = InvitationStatus.DECLINED;
    invitation.respondedAt = new Date();
    return this.invitationsRepository.save(invitation);
  }

  private async getOwnPendingInvitation(
    invitationId: string,
    userId: string,
  ): Promise<ProjectInvitation> {
    const invitation = await this.invitationsRepository.findOne({
      where: { id: invitationId },
    });
    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }
    if (invitation.invitedUserId !== userId) {
      throw new ForbiddenException('This invitation is not addressed to you');
    }
    if (invitation.status !== InvitationStatus.PENDING) {
      throw new ConflictException(
        'This invitation has already been responded to',
      );
    }
    return invitation;
  }
}
