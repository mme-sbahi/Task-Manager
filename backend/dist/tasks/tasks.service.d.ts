import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
export declare class TasksService {
    private readonly tasksRepository;
    constructor(tasksRepository: Repository<Task>);
    findAllForProject(projectId: string): Promise<Task[]>;
    findAssignedToUser(userId: string): Promise<Task[]>;
    findOne(id: string): Promise<Task>;
    create(projectId: string, createdById: string, dto: CreateTaskDto): Promise<Task>;
    update(id: string, dto: UpdateTaskDto): Promise<Task>;
    remove(id: string): Promise<void>;
}
