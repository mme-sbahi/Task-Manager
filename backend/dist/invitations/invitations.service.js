"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvitationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const project_invitation_entity_1 = require("./entities/project-invitation.entity");
const invitation_status_enum_1 = require("./enums/invitation-status.enum");
const project_member_entity_1 = require("../projects/entities/project-member.entity");
const project_role_enum_1 = require("../projects/enums/project-role.enum");
const users_service_1 = require("../users/users.service");
let InvitationsService = class InvitationsService {
    constructor(invitationsRepository, membersRepository, usersService) {
        this.invitationsRepository = invitationsRepository;
        this.membersRepository = membersRepository;
        this.usersService = usersService;
    }
    async inviteMembers(projectId, invitedById, dto) {
        const invited = [];
        const failed = [];
        for (const email of dto.emails) {
            try {
                const invitation = await this.inviteSingle(projectId, invitedById, email, dto.role);
                invited.push(invitation);
            }
            catch (err) {
                failed.push({
                    email,
                    reason: err instanceof Error ? err.message : 'Unknown error',
                });
            }
        }
        return { invited, failed };
    }
    async inviteSingle(projectId, invitedById, email, role) {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new common_1.NotFoundException(`No user found with email ${email}`);
        }
        const existingMembership = await this.membersRepository.findOne({
            where: { projectId, userId: user.id },
        });
        if (existingMembership) {
            throw new common_1.ConflictException('User is already a member of this project');
        }
        const existingInvitation = await this.invitationsRepository.findOne({
            where: {
                projectId,
                invitedUserId: user.id,
                status: invitation_status_enum_1.InvitationStatus.PENDING,
            },
        });
        if (existingInvitation) {
            throw new common_1.ConflictException('User already has a pending invitation');
        }
        const invitation = this.invitationsRepository.create({
            projectId,
            invitedUserId: user.id,
            invitedById,
            role: role ?? project_role_enum_1.ProjectRole.MEMBER,
            status: invitation_status_enum_1.InvitationStatus.PENDING,
        });
        return this.invitationsRepository.save(invitation);
    }
    async findPendingForUser(userId) {
        return this.invitationsRepository.find({
            where: { invitedUserId: userId, status: invitation_status_enum_1.InvitationStatus.PENDING },
            relations: ['project', 'invitedBy'],
            order: { createdAt: 'DESC' },
        });
    }
    async findAllForProject(projectId) {
        return this.invitationsRepository.find({
            where: { projectId },
            relations: ['invitedUser', 'invitedBy'],
            order: { createdAt: 'DESC' },
        });
    }
    async accept(invitationId, userId) {
        const invitation = await this.getOwnPendingInvitation(invitationId, userId);
        return this.invitationsRepository.manager.transaction(async (manager) => {
            const member = manager.create(project_member_entity_1.ProjectMember, {
                projectId: invitation.projectId,
                userId: invitation.invitedUserId,
                role: invitation.role,
            });
            const savedMember = await manager.save(member);
            invitation.status = invitation_status_enum_1.InvitationStatus.ACCEPTED;
            invitation.respondedAt = new Date();
            await manager.save(invitation);
            return savedMember;
        });
    }
    async decline(invitationId, userId) {
        const invitation = await this.getOwnPendingInvitation(invitationId, userId);
        invitation.status = invitation_status_enum_1.InvitationStatus.DECLINED;
        invitation.respondedAt = new Date();
        return this.invitationsRepository.save(invitation);
    }
    async getOwnPendingInvitation(invitationId, userId) {
        const invitation = await this.invitationsRepository.findOne({
            where: { id: invitationId },
        });
        if (!invitation) {
            throw new common_1.NotFoundException('Invitation not found');
        }
        if (invitation.invitedUserId !== userId) {
            throw new common_1.ForbiddenException('This invitation is not addressed to you');
        }
        if (invitation.status !== invitation_status_enum_1.InvitationStatus.PENDING) {
            throw new common_1.ConflictException('This invitation has already been responded to');
        }
        return invitation;
    }
};
exports.InvitationsService = InvitationsService;
exports.InvitationsService = InvitationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(project_invitation_entity_1.ProjectInvitation)),
    __param(1, (0, typeorm_1.InjectRepository)(project_member_entity_1.ProjectMember)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        users_service_1.UsersService])
], InvitationsService);
//# sourceMappingURL=invitations.service.js.map