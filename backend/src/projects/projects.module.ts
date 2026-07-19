import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { ProjectMember } from './entities/project-member.entity';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { ProjectMemberGuard } from './guards/project-member.guard';
import { ProjectOwnerGuard } from './guards/project-owner.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Project, ProjectMember])],
  controllers: [ProjectsController],
  providers: [ProjectsService, ProjectMemberGuard, ProjectOwnerGuard],
  exports: [ProjectsService, ProjectMemberGuard, ProjectOwnerGuard, TypeOrmModule],
})
export class ProjectsModule {}
