import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { TasksService } from './tasks.service';
import { ProjectTasksController } from './project-tasks.controller';
import { TasksController } from './tasks.controller';
import { TaskProjectMemberGuard } from './guards/task-project-member.guard';
import { ProjectsModule } from '../projects/projects.module';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), ProjectsModule],
  controllers: [ProjectTasksController, TasksController],
  providers: [TasksService, TaskProjectMemberGuard],
})
export class TasksModule {}
