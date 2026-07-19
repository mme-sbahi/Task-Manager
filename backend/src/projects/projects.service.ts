import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { ProjectMember } from './entities/project-member.entity';
import { ProjectRole } from './enums/project-role.enum';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AddMemberDto } from './dto/add-member.dto';
import { InviteMembersDto } from './dto/invite-members.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectsRepository: Repository<Project>,
    @InjectRepository(ProjectMember)
    private readonly membersRepository: Repository<ProjectMember>,
    private readonly usersService: UsersService,
  ) {}

  // Every project the user can see: owned by them, or where they're a member.
  // Includes memberCount/taskCount so a project list (e.g. the dashboard's
  // "Recent Projects" widget) never has to fire N follow-up requests.
  async findAllForUser(userId: string): Promise<Project[]> {
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

  async findOne(id: string): Promise<Project> {
    const project = await this.projectsRepository
      .createQueryBuilder('project')
      .loadRelationCountAndMap('project.memberCount', 'project.members')
      .loadRelationCountAndMap('project.taskCount', 'project.tasks')
      .where('project.id = :id', { id })
      .getOne();

    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return project;
  }

  // Creating a project also creates the OWNER membership row in the same
  // transaction, so "who owns this" and "who can access this" never drift
  // out of sync with each other.
  async create(ownerId: string, dto: CreateProjectDto): Promise<Project> {
    const project = this.projectsRepository.create({
      name: dto.name,
      description: dto.description,
      ownerId,
    });
    const saved = await this.projectsRepository.save(project);

    const ownerMembership = this.membersRepository.create({
      projectId: saved.id,
      userId: ownerId,
      role: ProjectRole.OWNER,
    });
    await this.membersRepository.save(ownerMembership);

    return saved;
  }

  async update(id: string, dto: UpdateProjectDto): Promise<Project> {
    const project = await this.findOne(id);
    Object.assign(project, dto);
    return this.projectsRepository.save(project);
  }

  async remove(id: string): Promise<void> {
    const project = await this.findOne(id);
    await this.projectsRepository.remove(project);
  }

  async addMember(projectId: string, dto: AddMemberDto): Promise<ProjectMember> {
    return this.addSingleMember(projectId, dto.email, dto.role);
  }

  // Invites several people at once. One bad email (not registered,
  // already a member) shouldn't fail the whole batch — each is attempted
  // independently and the caller gets a clear summary of what happened.
  async inviteMembers(
    projectId: string,
    dto: InviteMembersDto,
  ): Promise<{
    invited: ProjectMember[];
    failed: { email: string; reason: string }[];
  }> {
    const invited: ProjectMember[] = [];
    const failed: { email: string; reason: string }[] = [];

    for (const email of dto.emails) {
      try {
        const member = await this.addSingleMember(projectId, email, dto.role);
        invited.push(member);
      } catch (err) {
        failed.push({
          email,
          reason: err instanceof Error ? err.message : 'Unknown error',
        });
      }
    }

    return { invited, failed };
  }

  private async addSingleMember(
    projectId: string,
    email: string,
    role?: ProjectRole,
  ): Promise<ProjectMember> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException(`No user found with email ${email}`);
    }

    const existing = await this.membersRepository.findOne({
      where: { projectId, userId: user.id },
    });
    if (existing) {
      throw new ForbiddenException('User is already a member of this project');
    }

    const member = this.membersRepository.create({
      projectId,
      userId: user.id,
      role: role ?? ProjectRole.MEMBER,
    });
    return this.membersRepository.save(member);
  }

  async listMembers(projectId: string): Promise<ProjectMember[]> {
    return this.membersRepository.find({
      where: { projectId },
      relations: ['user'],
    });
  }

  async removeMember(projectId: string, userId: string): Promise<void> {
    const membership = await this.membersRepository.findOne({
      where: { projectId, userId },
    });
    if (!membership) {
      throw new NotFoundException('Membership not found');
    }
    if (membership.role === ProjectRole.OWNER) {
      throw new ForbiddenException('Cannot remove the project owner');
    }
    await this.membersRepository.remove(membership);
  }
}
