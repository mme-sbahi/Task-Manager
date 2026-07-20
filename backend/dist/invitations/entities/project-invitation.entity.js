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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectInvitation = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const project_entity_1 = require("../../projects/entities/project.entity");
const project_role_enum_1 = require("../../projects/enums/project-role.enum");
const invitation_status_enum_1 = require("../enums/invitation-status.enum");
let ProjectInvitation = class ProjectInvitation {
};
exports.ProjectInvitation = ProjectInvitation;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ProjectInvitation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'project_id' }),
    __metadata("design:type", String)
], ProjectInvitation.prototype, "projectId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => project_entity_1.Project, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'project_id' }),
    __metadata("design:type", project_entity_1.Project)
], ProjectInvitation.prototype, "project", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'invited_user_id' }),
    __metadata("design:type", String)
], ProjectInvitation.prototype, "invitedUserId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'invited_user_id' }),
    __metadata("design:type", user_entity_1.User)
], ProjectInvitation.prototype, "invitedUser", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'invited_by_id', nullable: true }),
    __metadata("design:type", String)
], ProjectInvitation.prototype, "invitedById", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'SET NULL', nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'invited_by_id' }),
    __metadata("design:type", user_entity_1.User)
], ProjectInvitation.prototype, "invitedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: project_role_enum_1.ProjectRole, default: project_role_enum_1.ProjectRole.MEMBER }),
    __metadata("design:type", String)
], ProjectInvitation.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: invitation_status_enum_1.InvitationStatus,
        default: invitation_status_enum_1.InvitationStatus.PENDING,
    }),
    __metadata("design:type", String)
], ProjectInvitation.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], ProjectInvitation.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'responded_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], ProjectInvitation.prototype, "respondedAt", void 0);
exports.ProjectInvitation = ProjectInvitation = __decorate([
    (0, typeorm_1.Entity)('project_invitations')
], ProjectInvitation);
//# sourceMappingURL=project-invitation.entity.js.map