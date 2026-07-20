import { User } from '../../users/entities/user.entity';
import { ProjectMember } from './project-member.entity';
import { Task } from '../../tasks/entities/task.entity';
export declare class Project {
    id: string;
    name: string;
    description?: string;
    ownerId: string;
    owner: User;
    members: ProjectMember[];
    tasks: Task[];
    memberCount?: number;
    taskCount?: number;
    createdAt: Date;
    updatedAt: Date;
}
