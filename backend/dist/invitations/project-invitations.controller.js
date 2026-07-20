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
exports.ProjectInvitationsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const project_member_guard_1 = require("../projects/guards/project-member.guard");
const project_owner_guard_1 = require("../projects/guards/project-owner.guard");
const invitations_service_1 = require("./invitations.service");
const invite_members_dto_1 = require("./dto/invite-members.dto");
let ProjectInvitationsController = class ProjectInvitationsController {
    constructor(invitationsService) {
        this.invitationsService = invitationsService;
    }
    invite(projectId, invitedById, dto) {
        return this.invitationsService.inviteMembers(projectId, invitedById, dto);
    }
    findAll(projectId) {
        return this.invitationsService.findAllForProject(projectId);
    }
};
exports.ProjectInvitationsController = ProjectInvitationsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Invite people by email (must be OWNER or ADMIN)',
        description: 'Creates a PENDING invitation for each email — this does NOT add ' +
            'them to the project. They must accept via POST /invitations/:id/accept ' +
            'before a membership is created. One bad email does not block the rest ' +
            'of the batch.',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)('userId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, invite_members_dto_1.InviteMembersDto]),
    __metadata("design:returntype", void 0)
], ProjectInvitationsController.prototype, "invite", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Invitation history for this project (must be OWNER or ADMIN)' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProjectInvitationsController.prototype, "findAll", null);
exports.ProjectInvitationsController = ProjectInvitationsController = __decorate([
    (0, swagger_1.ApiTags)('invitations'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, project_member_guard_1.ProjectMemberGuard, project_owner_guard_1.ProjectOwnerGuard),
    (0, common_1.Controller)('projects/:id/invitations'),
    __metadata("design:paramtypes", [invitations_service_1.InvitationsService])
], ProjectInvitationsController);
//# sourceMappingURL=project-invitations.controller.js.map