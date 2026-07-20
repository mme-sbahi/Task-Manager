import { User } from '../../users/entities/user.entity';
import { Project } from './project.entity';
import { ProjectRole } from '../enums/project-role.enum';
export declare class ProjectMember {
    id: string;
    projectId: string;
    project: Project;
    userId: string;
    user: User;
    role: ProjectRole;
    createdAt: Date;
}
