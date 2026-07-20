import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { ProjectMember } from './entities/project-member.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
export declare class ProjectsService {
    private readonly projectsRepository;
    private readonly membersRepository;
    constructor(projectsRepository: Repository<Project>, membersRepository: Repository<ProjectMember>);
    findAllForUser(userId: string): Promise<Project[]>;
    findOne(id: string): Promise<Project>;
    create(ownerId: string, dto: CreateProjectDto): Promise<Project>;
    update(id: string, dto: UpdateProjectDto): Promise<Project>;
    remove(id: string): Promise<void>;
    listMembers(projectId: string): Promise<ProjectMember[]>;
    removeMember(projectId: string, userId: string): Promise<void>;
}
