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
exports.ProjectsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const project_entity_1 = require("./entities/project.entity");
const project_member_entity_1 = require("./entities/project-member.entity");
const project_role_enum_1 = require("./enums/project-role.enum");
let ProjectsService = class ProjectsService {
    constructor(projectsRepository, membersRepository) {
        this.projectsRepository = projectsRepository;
        this.membersRepository = membersRepository;
    }
    async findAllForUser(userId) {
        const memberships = await this.membersRepository.find({
            where: { userId },
        });
        const projectIds = memberships.map((m) => m.projectId);
        if (projectIds.length === 0) {
            return [];
        }
        return this.projectsRepository
            .createQueryBuilder('project')
            .loadRelationCountAndMap('project.memberCount', 'project.members')
            .loadRelationCountAndMap('project.taskCount', 'project.tasks')
            .where('project.id IN (:...projectIds)', { projectIds })
            .orderBy('project.createdAt', 'DESC')
            .getMany();
    }
    async findOne(id) {
        const project = await this.projectsRepository
            .createQueryBuilder('project')
            .loadRelationCountAndMap('project.memberCount', 'project.members')
            .loadRelationCountAndMap('project.taskCount', 'project.tasks')
            .where('project.id = :id', { id })
            .getOne();
        if (!project) {
            throw new common_1.NotFoundException('Project not found');
        }
        return project;
    }
    async create(ownerId, dto) {
        const project = this.projectsRepository.create({
            name: dto.name,
            description: dto.description,
            ownerId,
        });
        const saved = await this.projectsRepository.save(project);
        const ownerMembership = this.membersRepository.create({
            projectId: saved.id,
            userId: ownerId,
            role: project_role_enum_1.ProjectRole.OWNER,
        });
        await this.membersRepository.save(ownerMembership);
        return saved;
    }
    async update(id, dto) {
        const project = await this.findOne(id);
        Object.assign(project, dto);
        return this.projectsRepository.save(project);
    }
    async remove(id) {
        const project = await this.findOne(id);
        await this.projectsRepository.remove(project);
    }
    async listMembers(projectId) {
        return this.membersRepository.find({
            where: { projectId },
            relations: ['user'],
        });
    }
    async removeMember(projectId, userId) {
        const membership = await this.membersRepository.findOne({
            where: { projectId, userId },
        });
        if (!membership) {
            throw new common_1.NotFoundException('Membership not found');
        }
        if (membership.role === project_role_enum_1.ProjectRole.OWNER) {
            throw new common_1.ForbiddenException('Cannot remove the project owner');
        }
        await this.membersRepository.remove(membership);
    }
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(project_entity_1.Project)),
    __param(1, (0, typeorm_1.InjectRepository)(project_member_entity_1.ProjectMember)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ProjectsService);
//# sourceMappingURL=projects.service.js.map