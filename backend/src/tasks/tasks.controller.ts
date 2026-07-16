import {
  Body,
  Controller,
  Delete,
  Param,
  ParseUUIDPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TaskProjectMemberGuard } from './guards/task-project-member.guard';
import { TasksService } from './tasks.service';
import { UpdateTaskDto } from './dto/update-task.dto';

// Standalone task routes: the URL only carries a task id, so
// TaskProjectMemberGuard resolves task -> project -> membership internally.
@ApiTags('tasks')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, TaskProjectMemberGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Patch(':id')
  @ApiOperation({ summary: 'Update a task (e.g. move status, reassign)' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateTaskDto) {
    return this.tasksService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task (must be a project member)' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.tasksService.remove(id);
  }
}
