import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectMemberGuard } from './guards/project-member.guard';
import { ProjectOwnerGuard } from './guards/project-owner.guard';

@ApiTags('projects')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @ApiOperation({ summary: 'List every project the current user belongs to' })
  findAll(@CurrentUser('userId') userId: string) {
    return this.projectsService.findAllForUser(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a project (creator becomes OWNER)' })
  create(@CurrentUser('userId') userId: string, @Body() dto: CreateProjectDto) {
    return this.projectsService.create(userId, dto);
  }

  @UseGuards(ProjectMemberGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get a single project (must be a member)' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.projectsService.findOne(id);
  }

  @UseGuards(ProjectMemberGuard, ProjectOwnerGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a project (must be OWNER or ADMIN)' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProjectDto,
  ) {
    return this.projectsService.update(id, dto);
  }

  @UseGuards(ProjectMemberGuard, ProjectOwnerGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a project (must be OWNER or ADMIN)' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.projectsService.remove(id);
  }

  @UseGuards(ProjectMemberGuard)
  @Get(':id/members')
  @ApiOperation({ summary: 'List current (accepted) project members' })
  listMembers(@Param('id', ParseUUIDPipe) id: string) {
    return this.projectsService.listMembers(id);
  }

  @UseGuards(ProjectMemberGuard, ProjectOwnerGuard)
  @Delete(':id/members/:userId')
  @ApiOperation({ summary: 'Remove a member (must be OWNER or ADMIN)' })
  removeMember(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.projectsService.removeMember(id, userId);
  }
}
