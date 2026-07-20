import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    findAll(userId: string): Promise<import("./entities/project.entity").Project[]>;
    create(userId: string, dto: CreateProjectDto): Promise<import("./entities/project.entity").Project>;
    findOne(id: string): Promise<import("./entities/project.entity").Project>;
    update(id: string, dto: UpdateProjectDto): Promise<import("./entities/project.entity").Project>;
    remove(id: string): Promise<void>;
    listMembers(id: string): Promise<import("./entities/project-member.entity").ProjectMember[]>;
    removeMember(id: string, userId: string): Promise<void>;
}
