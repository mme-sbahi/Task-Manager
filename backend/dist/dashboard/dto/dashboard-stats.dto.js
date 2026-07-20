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
exports.DashboardStatsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class DashboardStatsDto {
}
exports.DashboardStatsDto = DashboardStatsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 4, description: 'Projects the user belongs to' }),
    __metadata("design:type", Number)
], DashboardStatsDto.prototype, "totalProjects", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 37, description: 'Tasks across all of those projects' }),
    __metadata("design:type", Number)
], DashboardStatsDto.prototype, "totalTasks", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 21 }),
    __metadata("design:type", Number)
], DashboardStatsDto.prototype, "tasksCompleted", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 9 }),
    __metadata("design:type", Number)
], DashboardStatsDto.prototype, "tasksInProgress", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3, description: 'Not-yet-done tasks due today' }),
    __metadata("design:type", Number)
], DashboardStatsDto.prototype, "tasksDueToday", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2, description: 'Not-yet-done tasks past their due date' }),
    __metadata("design:type", Number)
], DashboardStatsDto.prototype, "overdueCount", void 0);
//# sourceMappingURL=dashboard-stats.dto.js.map