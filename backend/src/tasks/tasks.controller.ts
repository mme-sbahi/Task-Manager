import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { TaskProjectMemberGuard } from './guards/task-project-member.guard';
import { TasksService } from './tasks.service';
import { UpdateTaskDto } from './dto/update-task.dto';

@ApiTags('tasks')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get('me')
  @ApiOperation({ summary: 'List every task assigned to the current user' })
  findMyTasks(@CurrentUser('userId') userId: string) {
    return this.tasksService.findAssignedToUser(userId);
  }

  @UseGuards(TaskProjectMemberGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a task (e.g. move status, reassign)' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateTaskDto) {
    return this.tasksService.update(id, dto);
  }

  @UseGuards(TaskProjectMemberGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task (must be a project member)' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.tasksService.remove(id);
  }
}
