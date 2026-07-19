import { Body, Controller, Get, Param, ParseUUIDPipe, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ProjectMemberGuard } from '../projects/guards/project-member.guard';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';

// Nested under a project: list & create only need "is this user a member
// of the project", enforced by ProjectMemberGuard reading :id from the URL.
@ApiTags('tasks')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, ProjectMemberGuard)
@Controller('projects/:id/tasks')
export class ProjectTasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @ApiOperation({ summary: 'List tasks for a project (must be a member)' })
  findAll(@Param('id', ParseUUIDPipe) projectId: string) {
    return this.tasksService.findAllForProject(projectId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a task in a project (must be a member)' })
  create(
    @Param('id', ParseUUIDPipe) projectId: string,
    @CurrentUser('userId') userId: string,
    @Body() dto: CreateTaskDto,
  ) {
    return this.tasksService.create(projectId, userId, dto);
  }
}
