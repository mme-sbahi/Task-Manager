import { TaskStatus } from '../enums/task-status.enum';
import { Priority } from '../enums/priority.enum';
export declare class CreateTaskDto {
    title: string;
    description?: string;
    status?: TaskStatus;
    priority?: Priority;
    dueDate?: string;
    assigneeId?: string;
}
