import { Repository } from 'typeorm';
import { ProjectMember } from '../projects/entities/project-member.entity';
import { Task } from '../tasks/entities/task.entity';
import { DashboardStatsDto } from './dto/dashboard-stats.dto';
export declare class DashboardService {
    private readonly membersRepository;
    private readonly tasksRepository;
    constructor(membersRepository: Repository<ProjectMember>, tasksRepository: Repository<Task>);
    getStatsForUser(userId: string): Promise<DashboardStatsDto>;
}
