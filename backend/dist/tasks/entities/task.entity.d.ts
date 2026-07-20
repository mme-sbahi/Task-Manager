import { User } from '../../users/entities/user.entity';
import { Project } from '../../projects/entities/project.entity';
import { TaskStatus } from '../enums/task-status.enum';
import { Priority } from '../enums/priority.enum';
export declare class Task {
    id: string;
    title: string;
    description?: string;
    status: TaskStatus;
    priority: Priority;
    dueDate?: Date;
    projectId: string;
    project: Project;
    assigneeId?: string;
    assignee?: User;
    createdById: string;
    createdBy: User;
    createdAt: Date;
    updatedAt: Date;
}
