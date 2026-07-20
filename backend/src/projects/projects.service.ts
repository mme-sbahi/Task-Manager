import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { ProjectMember } from './entities/project-member.entity';
import { ProjectRole } from './enums/project-role.enum';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectsRepository: Repository<Project>,
    @InjectRepository(ProjectMember)
    private readonly membersRepository: Repository<ProjectMember>,
  ) {}
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
