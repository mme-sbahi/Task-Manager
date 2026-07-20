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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const project_member_entity_1 = require("../projects/entities/project-member.entity");
const task_entity_1 = require("../tasks/entities/task.entity");
const task_status_enum_1 = require("../tasks/enums/task-status.enum");
let DashboardService = class DashboardService {
    constructor(membersRepository, tasksRepository) {
        this.membersRepository = membersRepository;
        this.tasksRepository = tasksRepository;
    }
    async getStatsForUser(userId) {
        const memberships = await this.membersRepository.find({ where: { userId } });
        const projectIds = memberships.map((m) => m.projectId);
        if (projectIds.length === 0) {
            return {
                totalProjects: 0,
                totalTasks: 0,
                tasksCompleted: 0,
                tasksInProgress: 0,
                tasksDueToday: 0,
                overdueCount: 0,
            };
        }
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);
        const now = new Date();
        const raw = await this.tasksRepository
            .createQueryBuilder('task')
            .select('COUNT(*)', 'total')
            .addSelect(`COUNT(*) FILTER (WHERE task.status = :done)`, 'completed')
            .addSelect(`COUNT(*) FILTER (WHERE task.status = :inProgress)`, 'inProgress')
            .addSelect(`COUNT(*) FILTER (WHERE task.due_date BETWEEN :startOfToday AND :endOfToday AND task.status != :done)`, 'dueToday')
            .addSelect(`COUNT(*) FILTER (WHERE task.due_date < :now AND task.status != :done)`, 'overdue')
            .where('task.project_id IN (:...projectIds)', { projectIds })
            .setParameters({
            done: task_status_enum_1.TaskStatus.DONE,
            inProgress: task_status_enum_1.TaskStatus.IN_PROGRESS,
            startOfToday,
            endOfToday,
            now,
        })
            .getRawOne();
        return {
            totalProjects: projectIds.length,
            totalTasks: parseInt(raw.total, 10) || 0,
            tasksCompleted: parseInt(raw.completed, 10) || 0,
            tasksInProgress: parseInt(raw.inProgress, 10) || 0,
            tasksDueToday: parseInt(raw.dueToday, 10) || 0,
            overdueCount: parseInt(raw.overdue, 10) || 0,
        };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(project_member_entity_1.ProjectMember)),
    __param(1, (0, typeorm_1.InjectRepository)(task_entity_1.Task)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map