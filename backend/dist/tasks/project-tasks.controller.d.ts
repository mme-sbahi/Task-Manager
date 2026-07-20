import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
export declare class ProjectTasksController {
    private readonly tasksService;
    constructor(tasksService: TasksService);
    findAll(projectId: string): Promise<import("./entities/task.entity").Task[]>;
    create(projectId: string, userId: string, dto: CreateTaskDto): Promise<import("./entities/task.entity").Task>;
}
