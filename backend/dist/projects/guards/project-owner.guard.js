"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectOwnerGuard = void 0;
const common_1 = require("@nestjs/common");
const project_role_enum_1 = require("../enums/project-role.enum");
let ProjectOwnerGuard = class ProjectOwnerGuard {
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const membership = request.projectMember;
        if (!membership ||
            ![project_role_enum_1.ProjectRole.OWNER, project_role_enum_1.ProjectRole.ADMIN].includes(membership.role)) {
            throw new common_1.ForbiddenException('Only the project owner or an admin can perform this action');
        }
        return true;
    }
};
exports.ProjectOwnerGuard = ProjectOwnerGuard;
exports.ProjectOwnerGuard = ProjectOwnerGuard = __decorate([
    (0, common_1.Injectable)()
], ProjectOwnerGuard);
//# sourceMappingURL=project-owner.guard.js.map