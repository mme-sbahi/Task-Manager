"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvitationsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const project_invitation_entity_1 = require("./entities/project-invitation.entity");
const invitations_service_1 = require("./invitations.service");
const invitations_controller_1 = require("./invitations.controller");
const project_invitations_controller_1 = require("./project-invitations.controller");
const projects_module_1 = require("../projects/projects.module");
const users_module_1 = require("../users/users.module");
let InvitationsModule = class InvitationsModule {
};
exports.InvitationsModule = InvitationsModule;
exports.InvitationsModule = InvitationsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([project_invitation_entity_1.ProjectInvitation]),
            projects_module_1.ProjectsModule,
            users_module_1.UsersModule,
        ],
        controllers: [project_invitations_controller_1.ProjectInvitationsController, invitations_controller_1.InvitationsController],
        providers: [invitations_service_1.InvitationsService],
    })
], InvitationsModule);
//# sourceMappingURL=invitations.module.js.map