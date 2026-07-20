import { TasksService } from './tasks.service';
import { UpdateTaskDto } from './dto/update-task.dto';
export declare class TasksController {
    private readonly tasksService;
    constructor(tasksService: TasksService);
    findMyTasks(userId: string): Promise<import("./entities/task.entity").Task[]>;
    update(id: string, dto: UpdateTaskDto): Promise<import("./entities/task.entity").Task>;
    remove(id: string): Promise<void>;
}
