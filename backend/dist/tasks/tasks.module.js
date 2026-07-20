"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const task_entity_1 = require("./entities/task.entity");
const tasks_service_1 = require("./tasks.service");
const project_tasks_controller_1 = require("./project-tasks.controller");
const tasks_controller_1 = require("./tasks.controller");
const task_project_member_guard_1 = require("./guards/task-project-member.guard");
const projects_module_1 = require("../projects/projects.module");
let TasksModule = class TasksModule {
};
exports.TasksModule = TasksModule;
exports.TasksModule = TasksModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([task_entity_1.Task]), projects_module_1.ProjectsModule],
        controllers: [project_tasks_controller_1.ProjectTasksController, tasks_controller_1.TasksController],
        providers: [tasks_service_1.TasksService, task_project_member_guard_1.TaskProjectMemberGuard],
    })
], TasksModule);
//# sourceMappingURL=tasks.module.js.map