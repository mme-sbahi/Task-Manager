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
exports.InviteMembersDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const project_role_enum_1 = require("../../projects/enums/project-role.enum");
class InviteMembersDto {
}
exports.InviteMembersDto = InviteMembersDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: ['teammate1@example.com', 'teammate2@example.com'],
        description: 'One or more emails to invite',
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayNotEmpty)(),
    (0, class_validator_1.ArrayMaxSize)(25),
    (0, class_validator_1.IsEmail)({}, { each: true }),
    __metadata("design:type", Array)
], InviteMembersDto.prototype, "emails", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: project_role_enum_1.ProjectRole, required: false, default: project_role_enum_1.ProjectRole.MEMBER }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(project_role_enum_1.ProjectRole),
    __metadata("design:type", String)
], InviteMembersDto.prototype, "role", void 0);
//# sourceMappingURL=invite-members.dto.js.map